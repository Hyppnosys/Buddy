import { Calendar, Flame, ListChecks, Timer as TimerIcon } from 'lucide-react';
import { useSessions } from '../hooks/useSessions';
import { StatsCard } from '../components/StatsCard';
import { HistoryList } from '../components/HistoryList';

export function Statistics() {
  const { sessions, statistics } = useSessions();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8 animate-fade-up">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold">Estatísticas</h1>
        <p className="text-(--color-ink-muted) mt-1.5">Seu progresso, calculado a partir das sessões que você já concluiu.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatsCard label="Sessões hoje" value={statistics.sessionsToday} icon={<ListChecks size={18} />} />
        <StatsCard label="Foco hoje" value={`${statistics.focusMinutesToday} min`} icon={<TimerIcon size={18} />} accent="var(--color-long)" />
        <StatsCard label="Sequência" value={`${statistics.currentStreak} dias`} icon={<Flame size={18} />} accent="var(--color-short)" />
        <StatsCard label="Sessões na semana" value={statistics.sessionsThisWeek} icon={<Calendar size={18} />} accent="var(--color-relax)" />
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold mb-1">Tempo total focado: {statistics.totalFocusMinutes} min</h2>
        <p className="text-sm text-(--color-ink-muted) mb-4">Soma de todas as sessões de foco concluídas desde o início.</p>
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold mb-3">Histórico completo</h2>
        <HistoryList sessions={sessions} />
      </div>
    </div>
  );
}
