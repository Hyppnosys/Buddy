import { Flame, ListChecks, Timer as TimerIcon } from 'lucide-react';
import { useTimer } from '../hooks/useTimer';
import { useSessions } from '../hooks/useSessions';
import { Timer } from '../components/Timer';
import { TimerControls } from '../components/TimerControls';
import { SessionSelector } from '../components/SessionSelector';
import { CycleIndicator } from '../components/CycleIndicator';
import { StatsCard } from '../components/StatsCard';
import { HistoryList } from '../components/HistoryList';

export function Home() {
  const timer = useTimer();
  const { sessions, statistics } = useSessions();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 flex flex-col items-center gap-10 animate-fade-up">
      <div className="text-center max-w-md">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold">Pronto para focar?</h1>
        <p className="text-(--color-ink-muted) mt-1.5">
          Escolha uma sessão e comece. Seu progresso fica salvo automaticamente.
        </p>
      </div>

      <SessionSelector
        value={timer.sessionType}
        onChange={timer.selectSessionType}
        disabled={timer.status === 'running'}
      />

      <Timer
        sessionType={timer.sessionType}
        sessionLabel={timer.sessionLabel}
        status={timer.status}
        remainingSeconds={timer.remainingSeconds}
        progress={timer.progress}
      />

      <TimerControls
        status={timer.status}
        onStart={timer.start}
        onPause={timer.pause}
        onReset={timer.reset}
        onSkip={timer.skip}
      />

      <div className="flex flex-col items-center gap-2">
        <CycleIndicator
          total={timer.sessionsBeforeLongBreak}
          completed={timer.cycleIndex}
          isCurrentFocus={timer.sessionType === 'focus'}
        />
        <p className="text-xs text-(--color-ink-muted)">
          Ciclo atual · {timer.cycleIndex} de {timer.sessionsBeforeLongBreak} sessões de foco
        </p>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatsCard
          label="Sessões hoje"
          value={statistics.sessionsToday}
          icon={<ListChecks size={18} />}
        />
        <StatsCard
          label="Tempo focado hoje"
          value={`${statistics.focusMinutesToday} min`}
          icon={<TimerIcon size={18} />}
          accent="var(--color-long)"
        />
        <StatsCard
          label="Sequência"
          value={`${statistics.currentStreak} dias`}
          icon={<Flame size={18} />}
          accent="var(--color-short)"
        />
      </div>

      {sessions.length > 0 && (
        <div className="w-full">
          <h2 className="font-display text-lg font-semibold mb-3">Sessões recentes</h2>
          <HistoryList sessions={sessions} limit={5} />
        </div>
      )}
    </div>
  );
}
