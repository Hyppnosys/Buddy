import { describe, expect, it } from 'vitest';
import { formatTime, minutesToSeconds, secondsUntil } from './time';

describe('minutesToSeconds', () => {
  it('25 minutos devem resultar em 1500 segundos', () => {
    expect(minutesToSeconds(25)).toBe(1500);
  });
  it('never returns a negative value', () => {
    expect(minutesToSeconds(-5)).toBe(0);
  });
});

describe('formatTime', () => {
  it('formats seconds as MM:SS', () => {
    expect(formatTime(1500)).toBe('25:00');
    expect(formatTime(65)).toBe('01:05');
    expect(formatTime(0)).toBe('00:00');
  });
  it('formats over an hour as HH:MM:SS', () => {
    expect(formatTime(3661)).toBe('01:01:01');
  });
});

describe('secondsUntil', () => {
  it('computes remaining seconds from a future timestamp', () => {
    const now = 1_000_000;
    expect(secondsUntil(now + 10_000, now)).toBe(10);
  });
  it('never returns negative seconds for a past timestamp', () => {
    const now = 1_000_000;
    expect(secondsUntil(now - 5_000, now)).toBe(0);
  });
});
