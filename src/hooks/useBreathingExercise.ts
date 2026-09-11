import { useCallback, useEffect, useRef, useState } from 'react';
import type { BreathingPhaseConfig } from '../types/relaxation';

interface UseBreathingExerciseOptions {
  phases: BreathingPhaseConfig[];
  onPhaseStart?: (phase: BreathingPhaseConfig) => void;
}

export function useBreathingExercise({ phases, onPhaseStart }: UseBreathingExerciseOptions) {
  const [isActive, setIsActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(phases[0]?.seconds ?? 0);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  const timeoutRef = useRef<number | null>(null);
  const onPhaseStartRef = useRef(onPhaseStart);
  onPhaseStartRef.current = onPhaseStart;

  const clear = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearInterval(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => clear, [clear]);

  const start = useCallback(() => {
    setIsActive(true);
    setPhaseIndex(0);
    setSecondsLeft(phases[0]?.seconds ?? 0);
    if (phases[0]) onPhaseStartRef.current?.(phases[0]);
  }, [phases]);

  const stop = useCallback(() => {
    setIsActive(false);
    clear();
    setPhaseIndex(0);
    setSecondsLeft(phases[0]?.seconds ?? 0);
  }, [clear, phases]);

  useEffect(() => {
    if (!isActive) return;
    clear();
    timeoutRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;
        setPhaseIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % phases.length;
          if (nextIndex === 0) setCyclesCompleted((c) => c + 1);
          setSecondsLeft(phases[nextIndex]?.seconds ?? 0);
          if (phases[nextIndex]) onPhaseStartRef.current?.(phases[nextIndex]);
          return nextIndex;
        });
        return prev;
      });
    }, 1000);
    return clear;
  }, [isActive, phases, clear]);

  const currentPhase = phases[phaseIndex];

  return { isActive, currentPhase, secondsLeft, cyclesCompleted, start, stop };
}
