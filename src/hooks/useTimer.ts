import { useCallback, useEffect, useRef, useState } from 'react';
import type { SessionType, TimerSettings, TimerSnapshot, TimerStatus } from '../types/timer';
import { minutesToSeconds, secondsUntil } from '../utils/time';
import { readStorage, writeStorage, STORAGE_KEYS, scopedKey } from '../services/storage';
import { sendNotification } from '../services/notifications';
import { useSessions } from './useSessions';
import { useSettings } from './useSettings';
import { useToast } from './useToast';
import { useAuth } from './useAuth';
import { useMascot } from './useMascot';

interface PersistedTimerState extends TimerSnapshot {
  startedAt: string;
}

const SESSION_LABELS: Record<SessionType, string> = {
  focus: 'Foco',
  shortBreak: 'Pausa curta',
  longBreak: 'Pausa longa',
};

function durationFor(type: SessionType, settings: TimerSettings): number {
  const minutes =
    type === 'focus'
      ? settings.focusMinutes
      : type === 'shortBreak'
        ? settings.shortBreakMinutes
        : settings.longBreakMinutes;
  return minutesToSeconds(Math.max(minutes, 1));
}

function initialState(settings: TimerSettings): PersistedTimerState {
  return {
    status: 'idle',
    sessionType: 'focus',
    durationSeconds: durationFor('focus', settings),
    remainingSeconds: durationFor('focus', settings),
    endTimestamp: null,
    cycleIndex: 0,
    completedFocusInCycle: 0,
    startedAt: new Date().toISOString(),
  };
}

function nextSessionType(
  current: SessionType,
  cycleIndex: number,
  sessionsBeforeLongBreak: number
): { type: SessionType; cycleIndex: number } {
  if (current === 'focus') {
    const nextIndex = cycleIndex + 1;
    if (nextIndex >= sessionsBeforeLongBreak) return { type: 'longBreak', cycleIndex: nextIndex };
    return { type: 'shortBreak', cycleIndex: nextIndex };
  }
  if (current === 'longBreak') return { type: 'focus', cycleIndex: 0 };
  return { type: 'focus', cycleIndex };
}

export function useTimer() {
  const { timerSettings, settings } = useSettings();
  const { recordSession } = useSessions();
  const { showToast } = useToast();
  const { currentUser } = useAuth();
  const { addActivity } = useMascot();
  const timerStateKey = scopedKey(STORAGE_KEYS.timerState, currentUser?.id ?? null);

  const [state, setState] = useState<PersistedTimerState>(() =>
    readStorage(timerStateKey, initialState(timerSettings))
  );
  const stateRef = useRef(state);
  stateRef.current = state;

  const [, forceTick] = useState(0);

  useEffect(() => {
    writeStorage(timerStateKey, state);
  }, [state, timerStateKey]);

  useEffect(() => {
    setState((prev) => {
      if (prev.status !== 'running' || prev.endTimestamp === null) return prev;
      const remaining = secondsUntil(prev.endTimestamp);
      if (remaining > 0) return { ...prev, remainingSeconds: remaining };
      return { ...prev, remainingSeconds: 0 };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state.status !== 'running' || state.endTimestamp === null) return;
    const id = window.setInterval(() => {
      const endTs = stateRef.current.endTimestamp;
      if (endTs === null) return;
      const remaining = secondsUntil(endTs);
      setState((prev) => (prev.status === 'running' ? { ...prev, remainingSeconds: remaining } : prev));
      forceTick((n) => n + 1);
    }, 250);
    return () => window.clearInterval(id);
  }, [state.status, state.endTimestamp]);

  const finishSession = useCallback(
    (outcome: 'completed' | 'skipped') => {
      const prev = stateRef.current;

      recordSession({
        type: prev.sessionType,
        durationMinutes: Math.round(prev.durationSeconds / 60),
        startedAt: prev.startedAt,
        status: outcome,
      });

      if (outcome === 'completed') {
        const isFocus = prev.sessionType === 'focus';
        const title = isFocus ? '🎉 Sessão concluída!' : '⏰ Pausa concluída!';
        const description = isFocus ? 'Hora de fazer uma pausa.' : 'Hora de voltar ao foco.';
        if (!settings.distractionFreeEnabled) {
          showToast(title, description);
          if (settings.notificationsEnabled) sendNotification(title, description);
        }
        if (isFocus) addActivity('Sessão de foco concluída', 2);
      }

      const { type: nextType, cycleIndex } = nextSessionType(
        prev.sessionType,
        prev.cycleIndex,
        timerSettings.sessionsBeforeLongBreak
      );
      const duration = durationFor(nextType, timerSettings);
      const shouldAutoStart = timerSettings.autoStartNext && outcome === 'completed';
      const now = Date.now();

      setState({
        status: shouldAutoStart ? 'running' : 'idle',
        sessionType: nextType,
        durationSeconds: duration,
        remainingSeconds: duration,
        endTimestamp: shouldAutoStart ? now + duration * 1000 : null,
        cycleIndex,
        completedFocusInCycle: cycleIndex,
        startedAt: new Date(now).toISOString(),
      });
    },
    [recordSession, settings.notificationsEnabled, settings.distractionFreeEnabled, timerSettings, showToast, addActivity]
  );

  useEffect(() => {
    if (state.status === 'running' && state.remainingSeconds <= 0) {
      finishSession('completed');
    }
  }, [state.status, state.remainingSeconds, finishSession]);

  const start = useCallback(() => {
    setState((prev) => {
      if (prev.status === 'running') return prev;
      const now = Date.now();
      const remaining = prev.status === 'paused' ? prev.remainingSeconds : prev.durationSeconds;
      return {
        ...prev,
        status: 'running',
        remainingSeconds: remaining,
        endTimestamp: now + remaining * 1000,
        startedAt: prev.status === 'paused' ? prev.startedAt : new Date(now).toISOString(),
      };
    });
  }, []);

  const pause = useCallback(() => {
    setState((prev) => {
      if (prev.status !== 'running' || prev.endTimestamp === null) return prev;
      return { ...prev, status: 'paused', remainingSeconds: secondsUntil(prev.endTimestamp), endTimestamp: null };
    });
  }, []);

  const reset = useCallback(() => {
    setState((prev) => ({
      ...prev,
      status: 'idle',
      remainingSeconds: prev.durationSeconds,
      endTimestamp: null,
      startedAt: new Date().toISOString(),
    }));
  }, []);

  const skip = useCallback(() => {
    if (stateRef.current.status === 'idle' && stateRef.current.remainingSeconds === stateRef.current.durationSeconds) {
      setState((prev) => {
        const { type: nextType, cycleIndex } = nextSessionType(
          prev.sessionType,
          prev.cycleIndex,
          timerSettings.sessionsBeforeLongBreak
        );
        const duration = durationFor(nextType, timerSettings);
        return {
          status: 'idle',
          sessionType: nextType,
          durationSeconds: duration,
          remainingSeconds: duration,
          endTimestamp: null,
          cycleIndex,
          completedFocusInCycle: cycleIndex,
          startedAt: new Date().toISOString(),
        };
      });
      return;
    }
    finishSession('skipped');
  }, [finishSession, timerSettings]);

  const selectSessionType = useCallback(
    (type: SessionType) => {
      setState((prev) => {
        if (prev.status === 'running') return prev;
        const duration = durationFor(type, timerSettings);
        return {
          ...prev,
          sessionType: type,
          status: 'idle',
          durationSeconds: duration,
          remainingSeconds: duration,
          endTimestamp: null,
          startedAt: new Date().toISOString(),
        };
      });
    },
    [timerSettings]
  );

  useEffect(() => {
    setState((prev) => {
      if (prev.status !== 'idle') return prev;
      const duration = durationFor(prev.sessionType, timerSettings);
      if (duration === prev.durationSeconds) return prev;
      return { ...prev, durationSeconds: duration, remainingSeconds: duration };
    });
  }, [timerSettings]);

  const progress = state.durationSeconds > 0 ? 1 - state.remainingSeconds / state.durationSeconds : 0;

  return {
    status: state.status as TimerStatus,
    sessionType: state.sessionType,
    sessionLabel: SESSION_LABELS[state.sessionType],
    remainingSeconds: state.remainingSeconds,
    durationSeconds: state.durationSeconds,
    cycleIndex: state.cycleIndex,
    sessionsBeforeLongBreak: timerSettings.sessionsBeforeLongBreak,
    progress: Math.min(1, Math.max(0, progress)),
    start,
    pause,
    reset,
    skip,
    selectSessionType,
  };
}
