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
  /** Total duration of the current session, in seconds. */
  durationSeconds: number;
  /** Seconds remaining, derived from timestamps. */
  remainingSeconds: number;
  /** Timestamp (ms) the current running interval will end at. Null when not running. */
  endTimestamp: number | null;
  /** Index of the current focus cycle within the sessionsBeforeLongBreak loop (0-based). */
  cycleIndex: number;
  /** How many focus sessions have been completed in the current cycle set. */
  completedFocusInCycle: number;
}
