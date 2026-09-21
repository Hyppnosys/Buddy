interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  suffix?: string;
}

export function NumberField({ label, value, onChange, min = 1, max = 180, suffix = 'min' }: NumberFieldProps) {
  const id = `field-${label.replace(/\s+/g, '-').toLowerCase()}`;
  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      <div className="flex items-center gap-2">
        <button type="button" aria-label={`Diminuir ${label}`} onClick={() => onChange(clamp(value - 1))} className="w-8 h-8 rounded-full bg-(--color-surface-alt) hover:bg-(--color-border) transition-colors font-semibold">−</button>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          onChange={(e) => { const n = Number(e.target.value); if (!Number.isNaN(n)) onChange(clamp(n)); }}
          className="w-16 text-center rounded-lg border border-(--color-border) bg-(--color-bg) py-1.5 text-sm tabular-nums"
        />
        <button type="button" aria-label={`Aumentar ${label}`} onClick={() => onChange(clamp(value + 1))} className="w-8 h-8 rounded-full bg-(--color-surface-alt) hover:bg-(--color-border) transition-colors font-semibold">+</button>
        <span className="text-xs text-(--color-ink-muted) w-6">{suffix}</span>
      </div>
    </div>
  );
}
