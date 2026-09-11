import { useCallback, useEffect, useRef } from 'react';

type Phase = 'inhale' | 'hold' | 'exhale';

const FREQ_START = 220;
const FREQ_PEAK = 330;
const FREQ_END = 180;

/**
 * Produces a real, audible breathing tone using the Web Audio API (no
 * external audio files required). The tone glides upward while inhaling,
 * holds steady, then glides back down while exhaling.
 */
export function useBreathingSound() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const enabledRef = useRef(false);
  const volumeRef = useRef(0.5);

  const ensureContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new Ctx();
    }
    return audioCtxRef.current;
  }, []);

  const stopTone = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (oscillatorRef.current && gainRef.current && ctx) {
      const now = ctx.currentTime;
      gainRef.current.gain.cancelScheduledValues(now);
      gainRef.current.gain.setTargetAtTime(0, now, 0.08);
      const osc = oscillatorRef.current;
      window.setTimeout(() => {
        try {
          osc.stop();
        } catch {
          // already stopped
        }
      }, 200);
    }
    oscillatorRef.current = null;
    gainRef.current = null;
  }, []);

  const setEnabled = useCallback(
    (enabled: boolean) => {
      enabledRef.current = enabled;
      if (!enabled) stopTone();
    },
    [stopTone]
  );

  const setVolume = useCallback((volume: number) => {
    volumeRef.current = volume;
    if (gainRef.current && audioCtxRef.current) {
      gainRef.current.gain.setTargetAtTime(volume * 0.12, audioCtxRef.current.currentTime, 0.15);
    }
  }, []);

  const playPhase = useCallback(
    (phase: Phase, seconds: number) => {
      if (!enabledRef.current) return;
      const ctx = ensureContext();
      if (ctx.state === 'suspended') ctx.resume();

      if (!oscillatorRef.current || !gainRef.current) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        gain.gain.value = 0;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        oscillatorRef.current = osc;
        gainRef.current = gain;
      }

      const osc = oscillatorRef.current;
      const gain = gainRef.current;
      const now = ctx.currentTime;
      const targetGain = volumeRef.current * 0.12;

      gain.gain.cancelScheduledValues(now);
      gain.gain.setTargetAtTime(targetGain, now, 0.2);

      osc.frequency.cancelScheduledValues(now);
      if (phase === 'inhale') {
        osc.frequency.setValueAtTime(FREQ_START, now);
        osc.frequency.linearRampToValueAtTime(FREQ_PEAK, now + seconds);
      } else if (phase === 'hold') {
        osc.frequency.setValueAtTime(FREQ_PEAK, now);
      } else {
        osc.frequency.setValueAtTime(FREQ_PEAK, now);
        osc.frequency.linearRampToValueAtTime(FREQ_END, now + seconds);
      }
    },
    [ensureContext]
  );

  useEffect(() => stopTone, [stopTone]);

  return { setEnabled, setVolume, playPhase, stopTone };
}
