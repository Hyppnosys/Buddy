import type { SessionType } from './timer';

export interface Session {
  id: string;
  type: SessionType;
  durationMinutes: number;
  startedAt: string;
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
