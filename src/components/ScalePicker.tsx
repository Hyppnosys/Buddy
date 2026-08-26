interface ScalePickerProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  lowLabel: string;
  highLabel: string;
}

export function ScalePicker({ label, value, onChange, lowLabel, highLabel }: ScalePickerProps) {
  return (
    <div>
      <p className="text-sm font-medium mb-2">{label}</p>
      <div className="flex items-center gap-2" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            onClick={() => onChange(n)}
            className={`w-10 h-10 rounded-full text-sm font-semibold transition-all duration-150
              ${value === n ? 'bg-(--color-focus) text-white scale-105' : 'bg-(--color-surface-alt) text-(--color-ink-muted) hover:bg-(--color-border)'}`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-(--color-ink-muted) mt-1.5">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}
