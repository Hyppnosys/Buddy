import { createContext, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { MascotActivityLog, MascotState } from '../types/social';
import { useAuth } from '../hooks/useAuth';
import { applyActivityPoints, INITIAL_MASCOT_PROGRESS } from '../utils/mascotProgress';
import { fetchMascotState, insertActivityLog, persistMascotProgress, renameMascotDb, setSharedWithFriendIdsDb } from '../services/mascotDb';

// Reexportados para quem já importava esses nomes daqui (ex: pages/Mascot.tsx).
export { STAGE_LABEL, nextStageInfo, phaseGoalFor, PHASE_GOALS } from '../utils/mascotProgress';

const EMPTY_MASCOT: MascotState = {
  name: 'Rio',
  stage: INITIAL_MASCOT_PROGRESS.stage,
  phaseProgress: INITIAL_MASCOT_PROGRESS.phaseProgress,
  extraPoints: INITIAL_MASCOT_PROGRESS.extraPoints,
  totalXp: INITIAL_MASCOT_PROGRESS.totalXp,
  completedPhases: INITIAL_MASCOT_PROGRESS.completedPhases,
  sharedWithFriendIds: [],
  log: [],
};

interface MascotContextValue {
  mascot: MascotState;
  stage: MascotState['stage'];
  isLoading: boolean;
  addActivity: (reason: string, by?: string) => void;
  renameMascot: (name: string) => void;
  toggleShareWithFriend: (friendUserId: string) => void;
}

// Regra de pontuação atual: toda atividade vale exatamente 1 ponto, sem
// distinção por tipo (foco, diário, check-in, respiração, yoga...). Fica
// centralizado aqui em vez de cada chamador escolher um valor, pra não
// existir a possibilidade de uma atividade valer "2" ou "5" por engano.
const POINTS_PER_ACTIVITY = 1;

export const MascotContext = createContext<MascotContextValue | null>(null);

/**
 * O progresso do mascote (fase, barra da fase atual, pontos extras, XP
 * total, histórico de atividades) agora é persistido no banco de dados
 * (Supabase), não mais só no navegador — veja src/services/mascotDb.ts e
 * supabase/schema.sql. Assim o mascote continua exatamente de onde parou
 * se o usuário sair e entrar de novo, inclusive em outro dispositivo.
 *
 * A lógica de "quantos pontos para evoluir, quando resetar a barra, quando
 * virar pontuação extra" fica isolada e 100% testável em
 * src/utils/mascotProgress.ts (`applyActivityPoints`) — este componente só
 * chama essa função pura e persiste o resultado.
 */
export function MascotProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [mascot, setMascot] = useState<MascotState>(EMPTY_MASCOT);
  const [isLoading, setIsLoading] = useState(false);
  const loadPromiseRef = useRef<Promise<void> | null>(null);
  // Espelha `mascot` para leitura síncrona dentro de addActivity — ver o
  // comentário lá embaixo sobre por que não lemos o progresso "prev" de
  // dentro do updater do setMascot.
  const mascotRef = useRef(mascot);
  useEffect(() => {
    mascotRef.current = mascot;
  }, [mascot]);

  useEffect(() => {
    if (!currentUser) {
      setMascot(EMPTY_MASCOT);
      loadPromiseRef.current = null;
      return;
    }
    setIsLoading(true);
    const promise = fetchMascotState(currentUser.id)
      .then((state) => setMascot(state))
      .catch((error) => console.warn('[mascot] Falha ao carregar progresso do banco de dados.', error))
      .finally(() => setIsLoading(false));
    loadPromiseRef.current = promise;
  }, [currentUser?.id]);

  const addActivity = useCallback(
    async (reason: string, by = 'Você') => {
      if (!currentUser) return;
      // Garante que uma atividade concluída ANTES do progresso terminar de
      // carregar não sobrescreva o que já está salvo — espera o load em
      // andamento (se houver) antes de aplicar os pontos.
      if (loadPromiseRef.current) await loadPromiseRef.current;

      const userId = currentUser.id;
      const points = POINTS_PER_ACTIVITY;
      const optimisticEntry: MascotActivityLog = {
        id: `pending-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        reason,
        points,
        by,
        at: new Date().toISOString(),
      };

      // A causa da atividade duplicada: `persistMascotProgress` e
      // `insertActivityLog` (chamadas de rede) estavam sendo disparadas
      // de DENTRO do updater passado pro setMascot. Updaters de estado
      // devem ser puros — o React pode (e no Strict Mode do modo dev,
      // sempre) invocar essa função mais de uma vez e descartar um dos
      // resultados, mas quaisquer chamadas de rede feitas ali dentro já
      // foram disparadas e não têm como ser "descartadas": cada activity
      // acabava sendo inserida duas vezes no banco. O cálculo dos pontos
      // (`applyActivityPoints`) continua o mesmo e não foi alterado — só
      // passou a ser lido de `mascotRef.current` em vez do `prev` do
      // updater, e as chamadas de rede saíram do updater para o corpo
      // normal da função, sendo disparadas uma única vez por atividade.
      const nextProgress = applyActivityPoints(mascotRef.current, points);
      setMascot((prev) => ({ ...prev, ...nextProgress, log: [optimisticEntry, ...prev.log].slice(0, 100) }));

      persistMascotProgress(userId, nextProgress).catch((error) =>
        console.warn('[mascot] Falha ao salvar progresso no banco de dados.', error)
      );
      insertActivityLog(userId, reason, points, by)
        .then((saved) => {
          setMascot((cur) => ({ ...cur, log: [saved, ...cur.log.filter((l) => l.id !== optimisticEntry.id)].slice(0, 100) }));
        })
        .catch((error) => console.warn('[mascot] Falha ao salvar atividade no banco de dados.', error));
    },
    [currentUser]
  );

  const renameMascot = useCallback(
    (name: string) => {
      const trimmed = name.trim();
      if (!trimmed || !currentUser) return;
      setMascot((prev) => ({ ...prev, name: trimmed }));
      renameMascotDb(currentUser.id, trimmed).catch((error) => console.warn('[mascot] Falha ao renomear no banco de dados.', error));
    },
    [currentUser]
  );

  const toggleShareWithFriend = useCallback(
    (friendUserId: string) => {
      if (!currentUser) return;
      setMascot((prev) => {
        const ids = prev.sharedWithFriendIds.includes(friendUserId)
          ? prev.sharedWithFriendIds.filter((id) => id !== friendUserId)
          : [...prev.sharedWithFriendIds, friendUserId];
        setSharedWithFriendIdsDb(currentUser.id, ids).catch((error) =>
          console.warn('[mascot] Falha ao salvar compartilhamento no banco de dados.', error)
        );
        return { ...prev, sharedWithFriendIds: ids };
      });
    },
    [currentUser]
  );

  const value = useMemo<MascotContextValue>(
    () => ({ mascot, stage: mascot.stage, isLoading, addActivity, renameMascot, toggleShareWithFriend }),
    [mascot, isLoading, addActivity, renameMascot, toggleShareWithFriend]
  );

  return <MascotContext.Provider value={value}>{children}</MascotContext.Provider>;
}
