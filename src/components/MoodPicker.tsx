import type { Mood } from '../types/wellness';

interface MoodOption { value: Mood; emoji: string; label: string; }

const MOODS: MoodOption[] = [
  { value: 'great', emoji: '😄', label: 'Ótimo' },
  { value: 'good', emoji: '🙂', label: 'Bem' },
  { value: 'okay', emoji: '😐', label: 'Normal' },
  { value: 'low', emoji: '😔', label: 'Baixo' },
  { value: 'rough', emoji: '😣', label: 'Difícil' },
];

export { MOODS };

interface MoodPickerProps { value: Mood | null; onChange: (mood: Mood) => void; }

export function MoodPicker({ value, onChange }: MoodPickerProps) {
  return (
    <div role="radiogroup" aria-label="Como você está se sentindo" className="flex justify-between gap-2">
      {MOODS.map((mood) => {
        const isActive = value === mood.value;
        return (
          <button
            key={mood.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(mood.value)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl border transition-all duration-200
              ${isActive ? 'border-(--color-focus) bg-(--color-focus-soft)' : 'border-(--color-border) hover:border-(--color-focus)'}`}
          >
            <span className="text-2xl" aria-hidden>{mood.emoji}</span>
            <span className="text-xs font-medium text-(--color-ink-muted)">{mood.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function moodEmoji(mood: Mood): string { return MOODS.find((m) => m.value === mood)?.emoji ?? '🙂'; }
export function moodLabel(mood: Mood): string { return MOODS.find((m) => m.value === mood)?.label ?? ''; }
