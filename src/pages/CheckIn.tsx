import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { MoodPicker, moodEmoji, moodLabel } from '../components/MoodPicker';
import { ScalePicker } from '../components/ScalePicker';
import { useCheckIns } from '../hooks/useCheckIns';
import { useMascot } from '../hooks/useMascot';
import type { Mood } from '../types/wellness';

export function CheckIn() {
  const { todayCheckIn, submitCheckIn } = useCheckIns();
  const { addActivity } = useMascot();

  const [mood, setMood] = useState<Mood | null>(null);
  const [sleepQuality, setSleepQuality] = useState(3);
  const [energyLevel, setEnergyLevel] = useState(3);
  const [gratitude, setGratitude] = useState('');

  if (todayCheckIn) {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-10 animate-fade-up">
        <Card className="text-center flex flex-col items-center gap-3 py-10">
          <CheckCircle2 size={36} className="text-(--color-success)" />
          <h1 className="font-display text-xl font-semibold">Check-in de hoje concluído</h1>
          <p className="text-(--color-ink-muted) text-sm">
            Você já registrou como está hoje: {moodEmoji(todayCheckIn.mood)} {moodLabel(todayCheckIn.mood)}. Volte amanhã para um novo check-in.
          </p>
          {todayCheckIn.gratitude && <p className="text-sm bg-(--color-surface-alt) rounded-xl px-4 py-3 mt-2 max-w-sm">"{todayCheckIn.gratitude}"</p>}
        </Card>
      </div>
    );
  }

  const handleSubmit = () => {
    if (!mood) return;
    submitCheckIn({ mood, sleepQuality, energyLevel, gratitude: gratitude.trim() });
    addActivity('Check-in diário', 1);
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-6 animate-fade-up">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold">Como você está?</h1>
        <p className="text-(--color-ink-muted) mt-1.5">Um check-in rápido para o seu dia de hoje.</p>
      </div>

      <Card className="flex flex-col gap-6">
        <div>
          <p className="text-sm font-medium mb-2">Seu humor hoje</p>
          <MoodPicker value={mood} onChange={setMood} />
        </div>
        <ScalePicker label="Como foi o seu sono?" value={sleepQuality} onChange={setSleepQuality} lowLabel="Ruim" highLabel="Ótimo" />
        <ScalePicker label="Seu nível de energia" value={energyLevel} onChange={setEnergyLevel} lowLabel="Baixo" highLabel="Alto" />
        <div>
          <label htmlFor="gratitude" className="text-sm font-medium block mb-1.5">Algo pelo qual você é grato(a) hoje? (opcional)</label>
          <textarea id="gratitude" value={gratitude} onChange={(e) => setGratitude(e.target.value)} rows={3} className="w-full rounded-xl border border-(--color-border) bg-(--color-bg) px-4 py-2.5 text-sm resize-none" />
        </div>
        <Button onClick={handleSubmit} disabled={!mood} size="lg" className="self-start">Concluir check-in</Button>
      </Card>
    </div>
  );
}
