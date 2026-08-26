import { useState } from 'react';
import { Card } from '../components/Card';
import { RelaxationExercise } from '../components/RelaxationExercise';
import { SoundPlayer } from '../components/SoundPlayer';
import { YogaSession } from '../components/YogaSession';
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

type Tab = 'respirar' | 'yoga' | 'sons';

const TABS: { value: Tab; label: string }[] = [
  { value: 'respirar', label: 'Respiração' },
  { value: 'yoga', label: 'Exercitar' },
  { value: 'sons', label: 'Sons' },
];

export function Relax() {
  const [tab, setTab] = useState<Tab>('respirar');

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8 animate-fade-up">
      <div className="text-center">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold">Área de relaxamento</h1>
        <p className="text-(--color-ink-muted) mt-1.5">
          Uma pausa para respirar, se alongar ou apenas ouvir algo calmo.
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Tipo de relaxamento"
        className="inline-flex items-center gap-1 p-1 rounded-full bg-(--color-surface-alt) mx-auto"
      >
        {TABS.map((t) => (
          <button
            key={t.value}
            role="tab"
            aria-selected={tab === t.value}
            onClick={() => setTab(t.value)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200
              ${tab === t.value ? 'bg-(--color-relax) text-white shadow-(--shadow-soft)' : 'text-(--color-ink-muted) hover:text-(--color-ink)'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Card>
        {tab === 'respirar' && <RelaxationExercise exercise={BREATHING_EXERCISE} />}
        {tab === 'yoga' && <YogaSession />}
        {tab === 'sons' && <SoundPlayer />}
      </Card>
    </div>
  );
}
