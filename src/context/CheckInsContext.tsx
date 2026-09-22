import { createContext, useMemo, type ReactNode } from 'react';
import type { DailyCheckIn, Mood } from '../types/wellness';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAuth } from '../hooks/useAuth';
import { STORAGE_KEYS, scopedKey } from '../services/storage';

interface CheckInInput {
  mood: Mood;
  sleepQuality: number;
  energyLevel: number;
  gratitude: string;
}

interface CheckInsContextValue {
  checkIns: DailyCheckIn[];
  todayCheckIn: DailyCheckIn | null;
  submitCheckIn: (input: CheckInInput) => void;
}

export const CheckInsContext = createContext<CheckInsContextValue | null>(null);

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function CheckInsProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [checkIns, setCheckIns] = useLocalStorage<DailyCheckIn[]>(
    scopedKey(STORAGE_KEYS.checkins, currentUser?.id ?? null),
    []
  );

  const todayCheckIn = useMemo(
    () => checkIns.find((c) => c.date === todayKey()) ?? null,
    [checkIns]
  );

  const value = useMemo<CheckInsContextValue>(
    () => ({
      checkIns,
      todayCheckIn,
      submitCheckIn: (input) => {
        const date = todayKey();
        const entry: DailyCheckIn = { id: createId(), date, createdAt: new Date().toISOString(), ...input };
        setCheckIns((prev) => [entry, ...prev.filter((c) => c.date !== date)]);
      },
    }),
    [checkIns, todayCheckIn, setCheckIns]
  );

  return <CheckInsContext.Provider value={value}>{children}</CheckInsContext.Provider>;
}
