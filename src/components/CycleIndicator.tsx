interface CycleIndicatorProps {
  total: number;
  completed: number;
  isCurrentFocus: boolean;
}

export function CycleIndicator({ total, completed, isCurrentFocus }: CycleIndicatorProps) {
  return (
    <div className="flex items-center gap-2" role="img" aria-label={`Ciclo de foco: ${completed} de ${total} sessões concluídas`}>
      {Array.from({ length: total }).map((_, index) => {
        const isDone = index < completed;
        const isCurrent = index === completed && isCurrentFocus;
        return (
          <span
            key={index}
            className={`rounded-full transition-all duration-300 ${
              isDone ? 'w-2.5 h-2.5 bg-(--color-focus)' : isCurrent ? 'w-3 h-3 bg-(--color-focus) animate-soft-pulse' : 'w-2.5 h-2.5 bg-(--color-border)'
            }`}
          />
        );
      })}
    </div>
  );
}
