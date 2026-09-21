import type { Session, Statistics } from '../types/session';
import { isSameDay, startOfWeek } from './time';

function completedFocusSessions(sessions: Session[]): Session[] {
  return sessions.filter((s) => s.type === 'focus' && s.status === 'completed');
}

export function calculateStatistics(sessions: Session[]): Statistics {
  const now = new Date();
  const focusSessions = completedFocusSessions(sessions);

  const sessionsToday = sessions.filter(
    (s) => s.status === 'completed' && isSameDay(new Date(s.endedAt), now)
  ).length;

  const focusMinutesToday = focusSessions
    .filter((s) => isSameDay(new Date(s.endedAt), now))
    .reduce((sum, s) => sum + s.durationMinutes, 0);

  const weekStart = startOfWeek(now);
  const sessionsThisWeek = sessions.filter(
    (s) => s.status === 'completed' && new Date(s.endedAt) >= weekStart
  ).length;

  const totalFocusMinutes = focusSessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  const currentStreak = calculateStreak(focusSessions);

  return { sessionsToday, focusMinutesToday, sessionsThisWeek, totalFocusMinutes, currentStreak };
}

export function calculateStreak(focusSessions: Session[]): number {
  if (focusSessions.length === 0) return 0;

  const daysWithFocus = new Set(
    focusSessions.map((s) => {
      const d = new Date(s.endedAt);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cursor = new Date(today);
  if (!daysWithFocus.has(cursor.getTime())) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (daysWithFocus.has(cursor.getTime())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function groupSessionsByDay(sessions: Session[]): Map<string, Session[]> {
  const groups = new Map<string, Session[]>();
  const sorted = [...sessions].sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  );
  for (const session of sorted) {
    const key = new Date(session.endedAt).toDateString();
    const existing = groups.get(key) ?? [];
    existing.push(session);
    groups.set(key, existing);
  }
  return groups;
}
