import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useTimer } from './useTimer';
import { AllProviders } from '../test/AllProviders';

beforeEach(() => {
  window.localStorage.clear();
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

function setup() {
  return renderHook(() => useTimer(), { wrapper: AllProviders });
}

describe('useTimer', () => {
  it('starts idle with the default focus duration', () => {
    const { result } = setup();
    expect(result.current.status).toBe('idle');
    expect(result.current.sessionType).toBe('focus');
    expect(result.current.remainingSeconds).toBe(25 * 60);
  });

  it('counts down once started', () => {
    const { result } = setup();
    act(() => result.current.start());
    expect(result.current.status).toBe('running');
    act(() => vi.advanceTimersByTime(5000));
    expect(result.current.remainingSeconds).toBeLessThanOrEqual(25 * 60 - 5);
    expect(result.current.remainingSeconds).toBeGreaterThan(25 * 60 - 7);
  });

  it('pauses without losing remaining time and resumes correctly', () => {
    const { result } = setup();
    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(10_000));
    const remainingAtPause = result.current.remainingSeconds;
    act(() => result.current.pause());
    expect(result.current.status).toBe('paused');
    act(() => vi.advanceTimersByTime(20_000));
    expect(result.current.remainingSeconds).toBe(remainingAtPause);
    act(() => result.current.start());
    expect(result.current.status).toBe('running');
    expect(result.current.remainingSeconds).toBe(remainingAtPause);
  });

  it('resets to the full duration and idle status', () => {
    const { result } = setup();
    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(10_000));
    act(() => result.current.reset());
    expect(result.current.status).toBe('idle');
    expect(result.current.remainingSeconds).toBe(result.current.durationSeconds);
  });

  it('never allows two timers to run at once (idempotent start)', () => {
    const { result } = setup();
    act(() => result.current.start());
    const firstRemaining = result.current.remainingSeconds;
    act(() => result.current.start());
    expect(result.current.remainingSeconds).toBe(firstRemaining);
    expect(result.current.status).toBe('running');
  });

  it('completes automatically and advances to a short break', () => {
    const { result } = setup();
    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(25 * 60 * 1000 + 500));
    expect(result.current.sessionType).toBe('shortBreak');
    expect(result.current.status).toBe('idle');
    expect(result.current.cycleIndex).toBe(1);
  });

  it('moves to a long break after the configured number of focus sessions', () => {
    const { result } = setup();
    for (let i = 0; i < 4; i += 1) {
      if (result.current.sessionType !== 'focus') act(() => result.current.selectSessionType('focus'));
      act(() => result.current.skip());
    }
    expect(result.current.sessionType).toBe('longBreak');
  });

  it('skip on an untouched idle timer advances without recording a session', () => {
    const { result } = setup();
    act(() => result.current.skip());
    expect(result.current.sessionType).toBe('shortBreak');
    expect(result.current.status).toBe('idle');
  });

  it('lets the user switch session type while idle', () => {
    const { result } = setup();
    act(() => result.current.selectSessionType('longBreak'));
    expect(result.current.sessionType).toBe('longBreak');
    expect(result.current.remainingSeconds).toBe(15 * 60);
  });
});
