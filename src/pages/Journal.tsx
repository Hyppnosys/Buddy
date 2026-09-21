import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { MoodPicker, moodEmoji } from '../components/MoodPicker';
import { useJournal } from '../hooks/useJournal';
import { useMascot } from '../hooks/useMascot';
import type { Mood } from '../types/wellness';
import { formatClock, formatDayLabel } from '../utils/time';

export function Journal() {
  const { entries, addEntry, removeEntry } = useJournal();
  const { addActivity } = useMascot();
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<Mood | null>(null);

  const handleSubmit = () => {
    if (!content.trim() || !mood) return;
    addEntry(content.trim(), mood);
    addActivity('Registro no diário', 1);
    setContent('');
    setMood(null);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8 animate-fade-up">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold">Diário</h1>
        <p className="text-(--color-ink-muted) mt-1.5">Um espaço para registrar o seu dia, sem julgamentos.</p>
      </div>

      <Card className="flex flex-col gap-4">
        <MoodPicker value={mood} onChange={setMood} />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={5} placeholder="Como foi o seu dia? O que aconteceu, o que você sentiu..." className="w-full rounded-xl border border-(--color-border) bg-(--color-bg) px-4 py-3 text-sm resize-none" />
        <Button onClick={handleSubmit} disabled={!content.trim() || !mood} className="self-start">Salvar no diário</Button>
      </Card>

      <div className="flex flex-col gap-3">
        <h2 className="font-display text-lg font-semibold">Entradas anteriores</h2>
        {entries.length === 0 && <Card className="text-center py-10"><p className="text-sm text-(--color-ink-muted)">Nenhuma entrada ainda. Escreva a primeira acima.</p></Card>}
        {entries.map((entry) => (
          <Card key={entry.id} className="flex gap-3 items-start">
            <span className="text-2xl shrink-0" aria-hidden>{moodEmoji(entry.mood)}</span>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-(--color-ink-muted) mb-1">{formatDayLabel(entry.createdAt)} · {formatClock(entry.createdAt)}</p>
              <p className="text-sm whitespace-pre-wrap break-words">{entry.content}</p>
            </div>
            <button onClick={() => removeEntry(entry.id)} aria-label="Excluir entrada" className="shrink-0 p-1.5 rounded-full text-(--color-ink-muted) hover:text-(--color-danger) hover:bg-(--color-danger)/10 transition-colors">
              <Trash2 size={15} />
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
