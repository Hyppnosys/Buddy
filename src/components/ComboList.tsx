import { Clock, ListOrdered } from 'lucide-react';
import type { YogaRoutine } from '../types/wellness';
import { estimatedMinutes } from '../utils/yoga';
import { Button } from './Button';
import { Card } from './Card';

interface ComboListProps {
  combos: YogaRoutine[];
  onSelect: (combo: YogaRoutine) => void;
}

export function ComboList({ combos, onSelect }: ComboListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {combos.map((combo) => (
        <Card key={combo.id} className="flex flex-col gap-3">
          <div>
            <h3 className="font-display font-semibold">{combo.name}</h3>
            <p className="text-sm text-(--color-ink-muted) mt-1">{combo.description}</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-(--color-ink-muted)">
            <span className="flex items-center gap-1"><ListOrdered size={13} />{combo.poses.length} exercícios</span>
            <span className="flex items-center gap-1"><Clock size={13} />~{estimatedMinutes(combo)} min</span>
          </div>
          <Button variant="secondary" onClick={() => onSelect(combo)} className="self-start">Começar</Button>
        </Card>
      ))}
    </div>
  );
}
