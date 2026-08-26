import { useCallback, useEffect, useRef, useState } from 'react';
import type { YogaRoutine } from '../types/wellness';

export function useYogaSession(routine: YogaRoutine) {
  const [isActive, setIsActive] = useState(false);
  const [poseIndex, setPoseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(routine.poses[0]?.seconds ?? 0);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => clear, [clear]);

  const start = useCallback(() => {
    setIsActive(true);
    setIsComplete(false);
    setPoseIndex(0);
    setSecondsLeft(routine.poses[0]?.seconds ?? 0);
  }, [routine]);

  const stop = useCallback(() => {
    setIsActive(false);
    clear();
    setPoseIndex(0);
    setSecondsLeft(routine.poses[0]?.seconds ?? 0);
  }, [clear, routine]);

  const skipPose = useCallback(() => {
    setPoseIndex((prev) => {
      const next = prev + 1;
      if (next >= routine.poses.length) {
        setIsActive(false);
        setIsComplete(true);
        clear();
        return prev;
      }
      setSecondsLeft(routine.poses[next]?.seconds ?? 0);
      return next;
    });
  }, [routine, clear]);

  useEffect(() => {
    if (!isActive) return;
    clear();
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;
        skipPose();
        return prev;
      });
    }, 1000);
    return clear;
  }, [isActive, clear, skipPose]);

  const currentPose = routine.poses[poseIndex];
  const progress = currentPose ? 1 - secondsLeft / currentPose.seconds : 0;

  return {
    isActive,
    isComplete,
    currentPose,
    poseIndex,
    secondsLeft,
    progress,
    totalPoses: routine.poses.length,
    start,
    stop,
    skipPose,
  };
}
