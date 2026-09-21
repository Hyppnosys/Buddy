import { createContext, useMemo, type ReactNode } from 'react';
import type { MascotActivityLog, MascotStage, MascotState } from '../types/social';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAuth } from '../hooks/useAuth';
import { STORAGE_KEYS, scopedKey } from '../services/storage';

const DEFAULT_MASCOT: MascotState = {
  name: 'Rio',
  xp: 0,
  log: [],
  sharedWithFriendIds: [],
};

// Three real stages — bebê (hatchling) → jovem (young) → adulto (grown) —
// each with its own distinct artwork. There used to be a 4th "egg" stage
// below "hatchling" that reused the exact same image as hatchling; reaching
// it produced zero visible change, which is what made evolution look broken.
// Removing it means every stage transition now shows a different mascot.
export const STAGE_LABEL: Record<MascotStage, string> = {
  hatchling: 'Bebê',
  young: 'Jovem',
  grown: 'Adulto',
};

// X = 20 is the reference unit: bebê starts at 0 (immediate), jovem needs
// 2X and adulto needs 3X — a noticeably longer, more deliberate progression
// than before (previously 12 / 30), so evolving feels like a real
// milestone rather than something reached in one or two activities.
const X = 20;
export const STAGE_THRESHOLDS: Record<MascotStage, number> = {
  hatchling: 0,
  young: X * 2,
  grown: X * 3,
};

export function stageForXp(xp: number): MascotStage {
  if (xp >= STAGE_THRESHOLDS.grown) return 'grown';
  if (xp >= STAGE_THRESHOLDS.young) return 'young';
  return 'hatchling';
}

export function nextStageInfo(xp: number): { stage: MascotStage; xpToGo: number } | null {
  const stage = stageForXp(xp);
  if (stage === 'grown') return null;
  const order: MascotStage[] = ['hatchling', 'young', 'grown'];
  const next = order[order.indexOf(stage) + 1];
  return { stage: next, xpToGo: STAGE_THRESHOLDS[next] - xp };
}

interface MascotContextValue {
  mascot: MascotState;
  stage: MascotStage;
  addActivity: (reason: string, points: number, by?: string) => void;
  renameMascot: (name: string) => void;
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
