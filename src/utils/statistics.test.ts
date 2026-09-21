import { describe, expect, it } from 'vitest';
import { calculateStatistics, calculateStreak } from './statistics';
import type { Session } from '../types/session';

function makeSession(overrides: Partial<Session> & { daysAgo?: number }): Session {
  const { daysAgo = 0, ...rest } = overrides;
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const iso = date.toISOString();
  return { id: Math.random().toString(36), type: 'focus', durationMinutes: 25, startedAt: iso, endedAt: iso, status: 'completed', ...rest };
}

describe('calculateStatistics', () => {
  it('counts sessions completed today', () => {
    const sessions = [makeSession({ daysAgo: 0 }), makeSession({ daysAgo: 0 }), makeSession({ daysAgo: 1 })];
    expect(calculateStatistics(sessions).sessionsToday).toBe(2);
  });
  it('sums focus minutes for today only', () => {
    const sessions = [makeSession({ daysAgo: 0, durationMinutes: 25 }), makeSession({ daysAgo: 0, durationMinutes: 25 }), makeSession({ daysAgo: 1, durationMinutes: 25 })];
    expect(calculateStatistics(sessions).focusMinutesToday).toBe(50);
  });
  it('does not count skipped sessions toward total focus minutes', () => {
    expect(calculateStatistics([makeSession({ status: 'skipped', durationMinutes: 25 })]).totalFocusMinutes).toBe(0);
  });
  it('does not count break sessions toward focus minutes', () => {
    expect(calculateStatistics([makeSession({ type: 'shortBreak', durationMinutes: 5 })]).totalFocusMinutes).toBe(0);
  });
});

describe('calculateStreak', () => {
  it('returns 0 with no sessions', () => {
    expect(calculateStreak([])).toBe(0);
  });
  it('counts consecutive days including today', () => {
    expect(calculateStreak([makeSession({ daysAgo: 0 }), makeSession({ daysAgo: 1 }), makeSession({ daysAgo: 2 })])).toBe(3);
  });
  it('still counts a streak ending yesterday if nothing happened today yet', () => {
    expect(calculateStreak([makeSession({ daysAgo: 1 }), makeSession({ daysAgo: 2 })])).toBe(2);
  });
  it('resets when a day is skipped', () => {
    expect(calculateStreak([makeSession({ daysAgo: 0 }), makeSession({ daysAgo: 2 })])).toBe(1);
  });
});
