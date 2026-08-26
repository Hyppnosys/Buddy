import { createContext, useMemo, type ReactNode } from 'react';
import type { MascotActivityLog, MascotStage, MascotState } from '../types/social';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAuth } from '../hooks/useAuth';
import { STORAGE_KEYS, scopedKey } from '../services/storage';

const DEFAULT_MASCOT: MascotState = {
  name: 'Broto',
  xp: 0,
  log: [],
  sharedWithFriendIds: [],
  color: '#3F6B58',
};

export const STAGE_THRESHOLDS: Record<MascotStage, number> = {
  egg: 0,
  hatchling: 10,
  young: 30,
  grown: 70,
};

export function stageForXp(xp: number): MascotStage {
  if (xp >= STAGE_THRESHOLDS.grown) return 'grown';
  if (xp >= STAGE_THRESHOLDS.young) return 'young';
  if (xp >= STAGE_THRESHOLDS.hatchling) return 'hatchling';
  return 'egg';
}

export function nextStageInfo(xp: number): { stage: MascotStage; xpToGo: number } | null {
  const stage = stageForXp(xp);
  if (stage === 'grown') return null;
  const order: MascotStage[] = ['egg', 'hatchling', 'young', 'grown'];
  const next = order[order.indexOf(stage) + 1];
  return { stage: next, xpToGo: STAGE_THRESHOLDS[next] - xp };
}

interface MascotContextValue {
  mascot: MascotState;
  stage: MascotStage;
  addActivity: (reason: string, points: number, by?: string) => void;
  renameMascot: (name: string) => void;
  setMascotColor: (color: string) => void;
  toggleShareWithFriend: (friendId: string) => void;
}

export const MascotContext = createContext<MascotContextValue | null>(null);

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function MascotProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [mascot, setMascot] = useLocalStorage<MascotState>(
    scopedKey(STORAGE_KEYS.mascot, currentUser?.id ?? null),
    DEFAULT_MASCOT
  );

  const value = useMemo<MascotContextValue>(
    () => ({
      mascot,
      stage: stageForXp(mascot.xp),
      addActivity: (reason, points, by = 'Você') => {
        const entry: MascotActivityLog = { id: createId(), reason, points, by, at: new Date().toISOString() };
        setMascot((prev) => ({ ...prev, xp: prev.xp + points, log: [entry, ...prev.log].slice(0, 100) }));
      },
      renameMascot: (name) => setMascot((prev) => ({ ...prev, name: name.trim() || prev.name })),
      setMascotColor: (color) => setMascot((prev) => ({ ...prev, color })),
      toggleShareWithFriend: (friendId) =>
        setMascot((prev) => ({
          ...prev,
          sharedWithFriendIds: prev.sharedWithFriendIds.includes(friendId)
            ? prev.sharedWithFriendIds.filter((id) => id !== friendId)
            : [...prev.sharedWithFriendIds, friendId],
        })),
    }),
    [mascot, setMascot]
  );

  return <MascotContext.Provider value={value}>{children}</MascotContext.Provider>;
}
