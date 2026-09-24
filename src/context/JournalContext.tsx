import { createContext, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { JournalEntry, Mood } from '../types/wellness';
import { useAuth } from '../hooks/useAuth';
import { readStorage, writeStorage, STORAGE_KEYS, scopedKey } from '../services/storage';
import { deleteJournalEntry, fetchJournalEntries, insertJournalEntry } from '../services/journalDb';

interface JournalContextValue {
  entries: JournalEntry[];
  /** true enquanto as entradas ainda estão sendo carregadas do banco (e, na
   * primeira vez em cada dispositivo, durante a migração — ver abaixo). */
  isLoading: boolean;
  addEntry: (content: string, mood: Mood) => void;
  removeEntry: (id: string) => void;
}

export const JournalContext = createContext<JournalContextValue | null>(null);

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function migratedFlagKey(userId: string): string {
  return `buddy:journal-migrated:${userId}`;
}

/**
 * Até essa versão, as entradas do Diário só existiam no localStorage do
 * navegador (por usuário, mas por DISPOSITIVO/navegador) — por isso uma
 * entrada criada no celular nunca aparecia no notebook, mesmo na mesma
 * conta: não existia nenhuma fonte de dados compartilhada por trás, só uma
 * cópia isolada em cada aparelho. Agora as entradas vivem na tabela
 * `journal_entries` do Supabase (mesmo banco que já guarda o progresso do
 * mascote — ver mascotDb.ts/MascotContext.tsx), então qualquer dispositivo
 * logado na mesma conta lê a mesma lista.
 *
 * MIGRAÇÃO: entradas escritas ANTES dessa mudança nunca estiveram no banco
 * — só no localStorage daquele dispositivo específico. Pra não perder o
 * que já foi escrito, na PRIMEIRA vez que este código roda em cada
 * dispositivo (controlado pela flag `migratedFlagKey`), se existirem
 * entradas antigas no localStorage local, elas são enviadas ao banco
 * automaticamente, preservando a data/hora original de cada uma. Isso
 * precisa acontecer uma vez em CADA dispositivo/navegador onde a pessoa
 * escreveu antes, pra essas entradas migrarem também — não tem como uma
 * entrada que só existe no localStorage de um aparelho aparecer em outro
 * sem que esse aparelho, em algum momento, rode essa migração.
 */
export function JournalProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const loadPromiseRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setEntries([]);
      loadPromiseRef.current = null;
      return;
    }
    const userId = currentUser.id;
    setIsLoading(true);

    const promise = (async () => {
      try {
        let remote = await fetchJournalEntries(userId);

        const alreadyMigrated = readStorage<boolean>(migratedFlagKey(userId), false);
        if (!alreadyMigrated) {
          const legacyKey = scopedKey(STORAGE_KEYS.journal, userId);
          const legacyEntries = readStorage<JournalEntry[]>(legacyKey, []);
          if (legacyEntries.length > 0) {
            // Do mais antigo pro mais novo, pra manter a mesma ordem que o
            // banco teria se essas entradas tivessem sido salvas lá desde
            // o início.
            for (const entry of [...legacyEntries].reverse()) {
              try {
                await insertJournalEntry(userId, entry.content, entry.mood, entry.createdAt);
              } catch (migrationError) {
                console.warn('[journal] Falha ao migrar uma entrada antiga do localStorage pro banco de dados.', migrationError);
              }
            }
            remote = await fetchJournalEntries(userId);
          }
          // Marca como migrado mesmo se não havia nada a migrar, pra não
          // ficar checando o localStorage sem necessidade nas próximas vezes.
          writeStorage(migratedFlagKey(userId), true);
        }

        setEntries(remote);
      } catch (error) {
        console.warn('[journal] Falha ao carregar entradas do banco de dados.', error);
      } finally {
        setIsLoading(false);
      }
    })();
    loadPromiseRef.current = promise;
  }, [currentUser?.id]);

  const addEntry = useCallback(
    async (content: string, mood: Mood) => {
      if (!currentUser) return;
      // Mesmo cuidado do MascotContext: espera qualquer carregamento (ou
      // migração) em andamento terminar antes de mexer na lista, pra uma
      // entrada criada bem no início não se perder ou duplicar.
      if (loadPromiseRef.current) await loadPromiseRef.current;

      const userId = currentUser.id;
      const optimisticEntry: JournalEntry = { id: `pending-${createId()}`, content, mood, createdAt: new Date().toISOString() };

      // Atualização otimista pura (sem chamada de rede aqui dentro) — ver o
      // comentário em MascotContext.tsx sobre por que side effects dentro
      // do updater do setState causam duplicação.
      setEntries((prev) => [optimisticEntry, ...prev]);

      try {
        const saved = await insertJournalEntry(userId, content, mood);
        setEntries((cur) => [saved, ...cur.filter((e) => e.id !== optimisticEntry.id)]);
      } catch (error) {
        console.warn('[journal] Falha ao salvar entrada no banco de dados.', error);
      }
    },
    [currentUser]
  );

  const removeEntry = useCallback(
    async (id: string) => {
      if (!currentUser) return;
      setEntries((prev) => prev.filter((e) => e.id !== id));
      try {
        await deleteJournalEntry(currentUser.id, id);
      } catch (error) {
        console.warn('[journal] Falha ao excluir entrada no banco de dados.', error);
      }
    },
    [currentUser]
  );

  const value = useMemo<JournalContextValue>(
    () => ({ entries, isLoading, addEntry, removeEntry }),
    [entries, isLoading, addEntry, removeEntry]
  );

  return <JournalContext.Provider value={value}>{children}</JournalContext.Provider>;
}
