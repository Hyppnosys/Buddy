import { useCallback, useEffect, useRef, useState } from 'react';
import type { BreathingPhaseConfig } from '../types/relaxation';

interface UseBreathingExerciseOptions {
  phases: BreathingPhaseConfig[];
  onPhaseStart?: (phase: BreathingPhaseConfig) => void;
}

/**
 * Timestamp-based (not naive setInterval) breathing cycle. Instead of
 * incrementing a phase index on every tick — which can drift or double-fire
 * across renders — this computes which phase is "live" directly from
 * elapsed wall-clock time modulo the total cycle length. That guarantees
 * phases always run in exactly the order given in `phases` (as configured
 * in Relax.tsx: Inspira → Segura → Expira), with no possibility of the
 * displayed phase, the animation, and the audio callback ever disagreeing.
 */
export function useBreathingExercise({ phases, onPhaseStart }: UseBreathingExerciseOptions) {
  const [isActive, setIsActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(phases[0]?.seconds ?? 0);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  const rafRef = useRef<number | null>(null);
  const startedAtRef = useRef(0);
  const lastPhaseIndexRef = useRef(-1);
  const lastCycleRef = useRef(0);
  const onPhaseStartRef = useRef(onPhaseStart);
  onPhaseStartRef.current = onPhaseStart;

  const totalCycleSeconds = phases.reduce((sum, p) => sum + p.seconds, 0);

  const clear = useCallback(() => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  useEffect(() => clear, [clear]);

  const start = useCallback(() => {
    startedAtRef.current = performance.now();
    lastPhaseIndexRef.current = -1;
    lastCycleRef.current = 0;
    setCyclesCompleted(0);
    setIsActive(true);
  }, []);

  const stop = useCallback(() => {
    setIsActive(false);
    clear();
    setPhaseIndex(0);
    setSecondsLeft(phases[0]?.seconds ?? 0);
  }, [clear, phases]);

  useEffect(() => {
    if (!isActive || phases.length === 0 || totalCycleSeconds <= 0) return;

    const tick = () => {
      const elapsedMs = performance.now() - startedAtRef.current;
      const elapsedSeconds = elapsedMs / 1000;
      const cycleNumber = Math.floor(elapsedSeconds / totalCycleSeconds);
      const withinCycle = elapsedSeconds - cycleNumber * totalCycleSeconds;

      let acc = 0;
      let index = 0;
      for (let i = 0; i < phases.length; i++) {
        acc += phases[i].seconds;
        if (withinCycle < acc) {
          index = i;
          break;
        }
        index = i;
      }
      const phaseElapsed = withinCycle - (acc - phases[index].seconds);
      const remaining = Math.max(1, Math.ceil(phases[index].seconds - phaseElapsed));

      if (index !== lastPhaseIndexRef.current) {
        lastPhaseIndexRef.current = index;
        setPhaseIndex(index);
        onPhaseStartRef.current?.(phases[index]);
      }
      if (cycleNumber !== lastCycleRef.current) {
        lastCycleRef.current = cycleNumber;
        setCyclesCompleted(cycleNumber);
      }
      setSecondsLeft(remaining);

      rafRef.current = window.requestAnimationFrame(tick);
    };

    // Fire the first phase immediately, then start the loop.
    onPhaseStartRef.current?.(phases[0]);
    lastPhaseIndexRef.current = 0;
    setPhaseIndex(0);
    setSecondsLeft(phases[0]?.seconds ?? 0);
    rafRef.current = window.requestAnimationFrame(tick);

    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, phases, totalCycleSeconds, clear]);

  const currentPhase = phases[phaseIndex];

  return { isActive, currentPhase, secondsLeft, cyclesCompleted, start, stop };
}
