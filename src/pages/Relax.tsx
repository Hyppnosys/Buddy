import { Card } from '../components/Card';
import { RelaxationExercise } from '../components/RelaxationExercise';
import { SoundPlayer } from '../components/SoundPlayer';
import type { RelaxationExercise as RelaxationExerciseConfig } from '../types/relaxation';

const BREATHING_EXERCISE: RelaxationExerciseConfig = {
  id: 'box-breathing',
  name: 'Respire',
  description: 'Inspire, segure e expire em um ritmo constante para acalmar a mente.',
  phases: [
    { key: 'inhale', label: 'Inspire', seconds: 4 },
    { key: 'hold', label: 'Segure', seconds: 4 },
    { key: 'exhale', label: 'Expire', seconds: 4 },
  ],
};

export function Relax() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8 animate-fade-up">
      <div className="text-center">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold">Área de relaxamento</h1>
        <p className="text-(--color-ink-muted) mt-1.5">
          Uma pausa curta para respirar e recarregar antes de voltar ao foco.
        </p>
      </div>

      <Card>
        <RelaxationExercise exercise={BREATHING_EXERCISE} />
      </Card>

      <Card>
        <h2 className="font-display text-lg font-semibold mb-4">Sons ambientes</h2>
        <SoundPlayer />
      </Card>
    </div>
  );
}
