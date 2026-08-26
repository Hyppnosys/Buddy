import { Play, Square } from 'lucide-react';
import type { RelaxationExercise as RelaxationExerciseConfig } from '../types/relaxation';
import { useBreathingExercise } from '../hooks/useBreathingExercise';
import { Button } from './Button';

interface RelaxationExerciseProps {
  exercise: RelaxationExerciseConfig;
}

const PHASE_LABEL: Record<string, string> = {
  inhale: 'Inspire',
  hold: 'Segure',
  exhale: 'Expire',
};

export function RelaxationExercise({ exercise }: RelaxationExerciseProps) {
  const { isActive, currentPhase, secondsLeft, cyclesCompleted, start, stop } = useBreathingExercise({
    phases: exercise.phases,
  });

  const phaseKey = currentPhase?.key ?? 'inhale';
  const seconds = currentPhase?.seconds ?? 4;

  const animationStyle = !isActive
    ? { transform: 'scale(0.72)', transition: 'transform 0.5s ease' }
    : phaseKey === 'inhale'
      ? { animation: `breathe-in ${seconds}s ease-in-out forwards` }
      : phaseKey === 'exhale'
        ? { animation: `breathe-out ${seconds}s ease-in-out forwards` }
        : { transform: 'scale(1)' };

  return (
    <div className="flex flex-col items-center gap-8 py-4">
      <div className="relative w-64 h-64 flex items-center justify-center">
        <div
          key={isActive ? phaseKey : 'idle'}
          className="absolute inset-0 rounded-full bg-(--color-relax-soft)"
          style={animationStyle}
        />
        <div className="relative z-10 flex flex-col items-center justify-center w-36 h-36 rounded-full bg-(--color-relax) text-white shadow-(--shadow-lift)">
          <span className="font-display text-lg font-semibold">
            {isActive ? PHASE_LABEL[phaseKey] : 'Pronto?'}
          </span>
          <span className="text-3xl font-display tabular-nums mt-1">
            {isActive ? secondsLeft : exercise.phases[0]?.seconds}
          </span>
        </div>
      </div>

      <div className="text-center min-h-5">
        <p className="text-sm text-(--color-ink-muted)">
          {isActive
            ? `Ciclos completos: ${cyclesCompleted}`
            : 'Um exercício simples para acalmar a mente antes ou depois do foco.'}
        </p>
      </div>

      {!isActive ? (
        <Button size="lg" onClick={start} icon={<Play size={18} fill="currentColor" />}>
          Começar a respirar
        </Button>
      ) : (
        <Button size="lg" variant="secondary" onClick={stop} icon={<Square size={16} fill="currentColor" />}>
          Parar
        </Button>
      )}
    </div>
  );
}
