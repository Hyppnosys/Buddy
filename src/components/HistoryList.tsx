import { CheckCircle2, XCircle } from 'lucide-react';
import type { Session } from '../types/session';
import { groupSessionsByDay } from '../utils/statistics';
import { formatClock, formatDayLabel } from '../utils/time';
import { Card } from './Card';

const TYPE_LABEL: Record<Session['type'], string> = { focus: 'Foco', shortBreak: 'Pausa curta', longBreak: 'Pausa longa' };
const TYPE_COLOR: Record<Session['type'], string> = { focus: 'var(--color-focus)', shortBreak: 'var(--color-short)', longBreak: 'var(--color-long)' };

interface HistoryListProps {
  sessions: Session[];
  limit?: number;
}

export function HistoryList({ sessions, limit }: HistoryListProps) {
  if (sessions.length === 0) {
    return (
      <Card className="text-center py-10">
        <p className="text-sm text-(--color-ink-muted)">Nenhuma sessão ainda. Comece um período de foco para ver seu histórico aqui.</p>
      </Card>
    );
  }

  const grouped = groupSessionsByDay(limit ? sessions.slice(0, limit) : sessions);

  return (
    <div className="flex flex-col gap-6">
      {Array.from(grouped.entries()).map(([dayKey, daySessions]) => (
        <div key={dayKey}>
          <h3 className="text-sm font-semibold text-(--color-ink-muted) mb-2">{formatDayLabel(daySessions[0].endedAt)}</h3>
          <Card padded={false} className="divide-y divide-(--color-border) overflow-hidden">
            {daySessions.map((session) => (
              <div key={session.id} className="flex items-center gap-3 px-4 py-3">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: TYPE_COLOR[session.type] }} aria-hidden />
                <span className="text-sm font-mono text-(--color-ink-muted) w-14 shrink-0">{formatClock(session.startedAt)}</span>
                <span className="text-sm font-medium flex-1 min-w-0 truncate">{TYPE_LABEL[session.type]}</span>
                <span className="text-sm text-(--color-ink-muted) shrink-0">{session.durationMinutes} min</span>
                <span className="shrink-0" title={session.status === 'completed' ? 'Concluído' : 'Pulado'}>
                  {session.status === 'completed' ? <CheckCircle2 size={16} className="text-(--color-success)" /> : <XCircle size={16} className="text-(--color-ink-muted)" />}
                </span>
              </div>
            ))}
          </Card>
        </div>
      ))}
    </div>
  );
}
