import { Play, RotateCcw, SkipForward, Square } from 'lucide-react';
import { YOGA_ROUTINE } from '../utils/yoga';
import { useYogaSession } from '../hooks/useYogaSession';
import { useMascot } from '../hooks/useMascot';
import { ProgressIndicator } from './ProgressIndicator';
import { Button } from './Button';
import { useEffect, useRef } from 'react';

export function YogaSession() {
  const session = useYogaSession(YOGA_ROUTINE);
  const { addActivity } = useMascot();
  const hasCreditedRef = useRef(false);

  useEffect(() => {
    if (session.isComplete && !hasCreditedRef.current) {
      addActivity('Rotina de yoga concluída', 2);
      hasCreditedRef.current = true;
    }
    if (session.isActive) {
      hasCreditedRef.current = false;
    }
  }, [session.isComplete, session.isActive, addActivity]);

  if (session.isComplete) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <p className="text-3xl">🧘</p>
        <h3 className="font-display text-lg font-semibold">Rotina concluída!</h3>
        <p className="text-sm text-(--color-ink-muted)">
          Você completou as {YOGA_ROUTINE.poses.length} posturas de {YOGA_ROUTINE.name}.
        </p>
        <Button onClick={session.start} icon={<RotateCcw size={16} />}>
          Fazer de novo
        </Button>
      </div>
    );
  }

  if (!session.isActive) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <h3 className="font-display text-lg font-semibold">{YOGA_ROUTINE.name}</h3>
        <p className="text-sm text-(--color-ink-muted) max-w-xs">{YOGA_ROUTINE.description}</p>
        <p className="text-xs text-(--color-ink-muted)">{YOGA_ROUTINE.poses.length} posturas guiadas</p>
        <Button size="lg" onClick={session.start} icon={<Play size={18} fill="currentColor" />}>
          Começar rotina
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <ProgressIndicator
        progress={session.progress}
        color="var(--color-relax)"
        trackColor="var(--color-relax-soft)"
        size={220}
        strokeWidth={10}
      >
        <div className="flex flex-col items-center px-6 text-center">
          <span className="text-xs font-semibold uppercase tracking-wide text-(--color-relax)">
            Postura {session.poseIndex + 1} de {session.totalPoses}
          </span>
          <span className="font-display text-2xl font-semibold mt-1">{session.currentPose?.name}</span>
          <span className="font-mono text-lg tabular-nums mt-2 text-(--color-ink-muted)">
            {session.secondsLeft}s
          </span>
        </div>
      </ProgressIndicator>

      <p className="text-sm text-(--color-ink-muted) text-center max-w-xs">{session.currentPose?.cue}</p>

      <div className="flex items-center gap-3">
        <Button variant="secondary" onClick={session.skipPose} icon={<SkipForward size={16} />}>
          Próxima postura
        </Button>
        <Button variant="ghost" onClick={session.stop} icon={<Square size={14} fill="currentColor" />}>
          Parar
        </Button>
      </div>
    </div>
  );
}
