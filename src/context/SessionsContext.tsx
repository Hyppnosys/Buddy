import { createContext, useMemo, type ReactNode } from 'react';
import type { Session } from '../types/session';
import type { SessionType } from '../types/timer';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../services/storage';

interface RecordSessionInput {
  type: SessionType;
  durationMinutes: number;
  startedAt: string;
  status: 'completed' | 'skipped';
}

interface SessionsContextValue {
  sessions: Session[];
  recordSession: (input: RecordSessionInput) => void;
  clearHistory: () => void;
}

export const SessionsContext = createContext<SessionsContextValue | null>(null);

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function SessionsProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useLocalStorage<Session[]>(STORAGE_KEYS.sessions, []);

  const value = useMemo<SessionsContextValue>(
    () => ({
      sessions,
      recordSession: (input) => {
        const session: Session = {
          id: createId(),
          endedAt: new Date().toISOString(),
          ...input,
        };
        setSessions((prev) => [session, ...prev].slice(0, 500));
      },
      clearHistory: () => setSessions([]),
    }),
    [sessions, setSessions]
  );

  return <SessionsContext.Provider value={value}>{children}</SessionsContext.Provider>;
}
