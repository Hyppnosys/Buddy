import { Play, Square, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { RelaxationExercise as RelaxationExerciseConfig } from '../types/relaxation';
import { useBreathingExercise } from '../hooks/useBreathingExercise';
import { useBreathingSound } from '../hooks/useBreathingSound';
import { useSettings } from '../hooks/useSettings';
import { useMascot } from '../hooks/useMascot';
import { MascotAvatar } from './MascotAvatar';
import { Button } from './Button';

interface RelaxationExerciseProps {
  exercise: RelaxationExerciseConfig;
}

const PHASE_LABEL: Record<string, string> = { inhale: 'Inspira', hold: 'Segura', exhale: 'Expira' };
const STEPS: { key: 'inhale' | 'hold' | 'exhale'; label: string }[] = [
  { key: 'inhale', label: 'Inspira' },
  { key: 'hold', label: 'Segura' },
  { key: 'exhale', label: 'Expira' },
];

export function RelaxationExercise({ exercise }: RelaxationExerciseProps) {
  const { settings, updateSettings } = useSettings();
  const { mascot, addActivity } = useMascot();
  const sound = useBreathingSound();
  const creditedRef = useRef(false);

  const { isActive, currentPhase, secondsLeft, cyclesCompleted, start, stop } = useBreathingExercise({
    phases: exercise.phases,
    onPhaseStart: (phase) => sound.playPhase(phase.key, phase.seconds),
  });

  const soundOn = settings.sound.enabled;

  useEffect(() => {
    sound.setEnabled(isActive && soundOn);
  }, [isActive, soundOn, sound]);

  useEffect(() => {
    sound.setVolume(settings.sound.volume);
  }, [settings.sound.volume, sound]);

  useEffect(() => {
    if (isActive) {
      creditedRef.current = false;
    } else if (cyclesCompleted > 0 && !creditedRef.current) {
      addActivity('Exercício de respiração', 1);
      creditedRef.current = true;
    }
  }, [isActive, cyclesCompleted, addActivity]);

  const phaseKey = currentPhase?.key ?? 'inhale';
  const seconds = currentPhase?.seconds ?? 4;

  const animationStyle = !isActive
    ? { transform: 'scale(0.8)', transition: 'transform 0.5s ease' }
    : phaseKey === 'inhale'
      ? { animation: `breathe-in ${seconds}s ease-in-out forwards` }
      : phaseKey === 'exhale'
        ? { animation: `breathe-out ${seconds}s ease-in-out forwards` }
        : { transform: 'scale(1)' };

  const toggleSound = () => {
    const next = !soundOn;
    sound.setEnabled(isActive && next);
    updateSettings((prev) => ({ ...prev, sound: { ...prev.sound, enabled: next } }));
  };

  const handleStart = () => {
    sound.setEnabled(soundOn);
    start();
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="flex items-center gap-1.5" role="img" aria-label="Sequência: Inspira, Segura, Expira">
        {STEPS.map((step, i) => (
          <div key={step.key} className="flex items-center gap-1.5">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors duration-300
                ${isActive && phaseKey === step.key ? 'bg-(--color-relax) text-white' : 'bg-(--color-surface-alt) text-(--color-ink-muted)'}`}
            >
              {step.label}
            </span>
            {i < STEPS.length - 1 && <span className="text-(--color-ink-muted) text-xs">→</span>}
          </div>
        ))}
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center">
        <div key={isActive ? phaseKey : 'idle'} className="absolute inset-0 rounded-full bg-(--color-relax-soft)" style={animationStyle} />
        <div className="relative z-10 flex flex-col items-center justify-center gap-1">
          <MascotAvatar stage="young" color={mascot.color} size={84} animated={isActive} />
          <span className="font-display text-lg font-semibold text-(--color-relax)">{isActive ? PHASE_LABEL[phaseKey] : 'Pronto?'}</span>
          <span className="text-3xl font-display tabular-nums">
            {isActive ? secondsLeft : exercise.phases[0]?.seconds}
            <span className="text-base">s</span>
          </span>
        </div>
      </div>

      <div className="text-center min-h-5">
        <p className="text-sm text-(--color-ink-muted)">
          {isActive ? `Ciclos completos: ${cyclesCompleted}` : 'Um exercício simples para acalmar a mente antes ou depois do foco.'}
        </p>
      </div>

      {!isActive ? (
        <Button size="lg" onClick={handleStart} icon={<Play size={18} fill="currentColor" />}>
          Começar a respirar
        </Button>
      ) : (
        <Button size="lg" variant="secondary" onClick={stop} icon={<Square size={16} fill="currentColor" />}>
          Parar
        </Button>
      )}

      <button
        onClick={toggleSound}
        aria-pressed={soundOn}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors
          ${soundOn ? 'border-(--color-relax) bg-(--color-relax-soft) text-(--color-relax)' : 'border-(--color-border) text-(--color-ink-muted)'}`}
      >
        {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
        Som da respiração: {soundOn ? 'ativado' : 'desativado'}
      </button>
    </div>
  );
}
