export type SessionType = 'focus' | 'shortBreak' | 'longBreak';
export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface TimerSettings {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionsBeforeLongBreak: number;
  autoStartNext: boolean;
}

export interface TimerSnapshot {
  status: TimerStatus;
  sessionType: SessionType;
  durationSeconds: number;
  remainingSeconds: number;
  endTimestamp: number | null;
  cycleIndex: number;
  completedFocusInCycle: number;
}
