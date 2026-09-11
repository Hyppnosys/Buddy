import type { SessionType, TimerStatus } from '../types/timer';
import { formatTime } from '../utils/time';
import { ProgressIndicator } from './ProgressIndicator';

interface TimerProps {
  sessionType: SessionType;
  sessionLabel: string;
  status: TimerStatus;
  remainingSeconds: number;
  progress: number;
}

const RING_COLOR: Record<SessionType, string> = {
  focus: 'var(--color-focus)',
  shortBreak: 'var(--color-short)',
  longBreak: 'var(--color-long)',
};
const RING_TRACK: Record<SessionType, string> = {
  focus: 'var(--color-focus-soft)',
  shortBreak: 'var(--color-short-soft)',
  longBreak: 'var(--color-long-soft)',
};
const STATUS_LABEL: Record<TimerStatus, string> = {
  idle: 'Pronto para começar',
  running: 'Em andamento',
  paused: 'Pausado',
  completed: 'Concluído',
};

export function Timer({ sessionType, sessionLabel, status, remainingSeconds, progress }: TimerProps) {
  return (
    <div className="flex flex-col items-center gap-5">
      <ProgressIndicator progress={progress} color={RING_COLOR[sessionType]} trackColor={RING_TRACK[sessionType]} size={296} strokeWidth={12}>
        <div className={`flex flex-col items-center transition-transform duration-500 ${status === 'running' ? 'scale-100' : 'scale-95'}`}>
          <span className="uppercase tracking-[0.2em] text-xs font-semibold" style={{ color: RING_COLOR[sessionType] }}>
            {sessionLabel}
          </span>
          <span className="font-display font-medium tabular-nums text-6xl sm:text-7xl mt-2" aria-live="polite">
            {formatTime(remainingSeconds)}
          </span>
          <span className="text-sm text-(--color-ink-muted) mt-2">{STATUS_LABEL[status]}</span>
        </div>
      </ProgressIndicator>
    </div>
  );
}
