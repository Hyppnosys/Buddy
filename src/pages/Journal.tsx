import { useState } from 'react';
import { Download, Trash2 } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { MoodPicker, moodEmoji } from '../components/MoodPicker';
import { useJournal } from '../hooks/useJournal';
import { useMascot } from '../hooks/useMascot';
import type { Mood } from '../types/wellness';
import { formatClock, formatDayLabel } from '../utils/time';
import { buildJournalCsv, downloadCsv, filterEntriesByPeriod } from '../utils/journalExport';

export function Journal() {
  const { entries, addEntry, removeEntry } = useJournal();
  const { addActivity } = useMascot();
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<Mood | null>(null);
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');

  const handleSubmit = () => {
    if (!content.trim() || !mood) return;
    addEntry(content.trim(), mood);
    addActivity('Registro no diário');
    setContent('');
    setMood(null);
  };

  // Exportação é uma funcionalidade só do Diário — usa apenas o texto e a
  // data/horário de cada entrada, nunca a pontuação (que é interna do
  // Mascote). Ver src/utils/journalExport.ts.
  const exportAll = () => {
    downloadCsv(`buddy-diario-completo-${new Date().toISOString().slice(0, 10)}.csv`, buildJournalCsv(entries));
  };

  const exportPeriod = () => {
    const filtered = filterEntriesByPeriod(entries, periodStart, periodEnd);
    const suffix = `${periodStart || 'inicio'}_a_${periodEnd || 'hoje'}`;
    downloadCsv(`buddy-diario-${suffix}.csv`, buildJournalCsv(filtered));
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
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="font-display text-lg font-semibold">Entradas anteriores</h2>
        </div>

        {entries.length > 0 && (
          <Card className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Download size={16} className="text-(--color-ink-muted)" />
              <h3 className="text-sm font-semibold">Exportar entradas</h3>
            </div>
            <p className="text-xs text-(--color-ink-muted) -mt-1">Baixa um arquivo .csv com o que você escreveu — sem pontuação, só o conteúdo do diário.</p>

            <Button variant="secondary" onClick={exportAll} className="self-start">Exportar tudo</Button>

            <div className="border-t border-(--color-border) pt-3 flex flex-col gap-2">
              <p className="text-xs font-medium text-(--color-ink-muted)">Ou exportar só um período:</p>
              <div className="flex items-end gap-2 flex-wrap">
                <div>
                  <label htmlFor="periodStart" className="text-xs text-(--color-ink-muted) block mb-1">Data inicial</label>
                  <input
                    id="periodStart"
                    type="date"
                    value={periodStart}
                    onChange={(e) => setPeriodStart(e.target.value)}
                    max={periodEnd || undefined}
                    className="rounded-xl border border-(--color-border) bg-(--color-bg) px-3 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="periodEnd" className="text-xs text-(--color-ink-muted) block mb-1">Data final</label>
                  <input
                    id="periodEnd"
                    type="date"
                    value={periodEnd}
                    onChange={(e) => setPeriodEnd(e.target.value)}
                    min={periodStart || undefined}
                    className="rounded-xl border border-(--color-border) bg-(--color-bg) px-3 py-1.5 text-sm"
                  />
                </div>
                <Button variant="secondary" onClick={exportPeriod} disabled={!periodStart && !periodEnd}>Exportar período</Button>
              </div>
            </div>
          </Card>
        )}

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
