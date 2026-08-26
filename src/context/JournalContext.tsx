import { createContext, useMemo, type ReactNode } from 'react';
import type { JournalEntry, Mood } from '../types/wellness';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAuth } from '../hooks/useAuth';
import { STORAGE_KEYS, scopedKey } from '../services/storage';

interface JournalContextValue {
  entries: JournalEntry[];
  addEntry: (content: string, mood: Mood) => void;
  removeEntry: (id: string) => void;
}

export const JournalContext = createContext<JournalContextValue | null>(null);

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function JournalProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [entries, setEntries] = useLocalStorage<JournalEntry[]>(
    scopedKey(STORAGE_KEYS.journal, currentUser?.id ?? null),
    []
  );

  const value = useMemo<JournalContextValue>(
    () => ({
      entries,
      addEntry: (content, mood) => {
        const entry: JournalEntry = { id: createId(), content, mood, createdAt: new Date().toISOString() };
        setEntries((prev) => [entry, ...prev]);
      },
      removeEntry: (id) => setEntries((prev) => prev.filter((e) => e.id !== id)),
    }),
    [entries, setEntries]
  );

  return <JournalContext.Provider value={value}>{children}</JournalContext.Provider>;
}
