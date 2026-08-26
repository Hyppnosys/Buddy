import type { SessionType } from './timer';

export interface Session {
  id: string;
  type: SessionType;
  /** Planned duration in minutes. */
  durationMinutes: number;
  /** ISO timestamp when the session started. */
  startedAt: string;
  /** ISO timestamp when the session finished or was abandoned. */
  endedAt: string;
  status: 'completed' | 'skipped';
}

export interface Statistics {
  sessionsToday: number;
  focusMinutesToday: number;
  sessionsThisWeek: number;
  totalFocusMinutes: number;
  currentStreak: number;
}
