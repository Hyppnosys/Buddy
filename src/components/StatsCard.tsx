import type { ReactNode } from 'react';
import { Card } from './Card';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  accent?: string;
}

export function StatsCard({ label, value, icon, accent = 'var(--color-focus)' }: StatsCardProps) {
  return (
    <Card className="flex items-center gap-4" padded>
      <div
        className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: 'color-mix(in srgb, ' + accent + ' 14%, transparent)', color: accent }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-display font-semibold tabular-nums leading-tight">{value}</p>
        <p className="text-sm text-(--color-ink-muted) leading-snug">{label}</p>
      </div>
    </Card>
  );
}
