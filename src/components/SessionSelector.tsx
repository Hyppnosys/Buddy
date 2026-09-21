import type { SessionType } from '../types/timer';

interface SessionSelectorProps {
  value: SessionType;
  onChange: (type: SessionType) => void;
  disabled?: boolean;
}

const OPTIONS: { type: SessionType; label: string }[] = [
  { type: 'focus', label: 'Foco' },
  { type: 'shortBreak', label: 'Pausa curta' },
  { type: 'longBreak', label: 'Pausa longa' },
];

const ACTIVE_CLASSES: Record<SessionType, string> = {
  focus: 'bg-(--color-focus) text-white',
  shortBreak: 'bg-(--color-short) text-white',
  longBreak: 'bg-(--color-long) text-white',
};

export function SessionSelector({ value, onChange, disabled }: SessionSelectorProps) {
  return (
    <div role="tablist" aria-label="Selecionar tipo de sessão" className="inline-flex items-center gap-1 p-1 rounded-full bg-(--color-surface-alt)">
      {OPTIONS.map((opt) => {
        const isActive = value === opt.type;
        return (
          <button
            key={opt.type}
            role="tab"
            aria-selected={isActive}
            disabled={disabled}
            onClick={() => onChange(opt.type)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${isActive ? ACTIVE_CLASSES[opt.type] + ' shadow-(--shadow-soft)' : 'text-(--color-ink-muted) hover:text-(--color-ink)'}`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
