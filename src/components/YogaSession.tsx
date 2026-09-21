import { ChevronLeft, Play, RotateCcw, SkipForward, Square } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { YogaRoutine } from '../types/wellness';
import { useYogaSession } from '../hooks/useYogaSession';
import { useMascot } from '../hooks/useMascot';
import { ProgressIndicator } from './ProgressIndicator';
import { PoseIllustration } from './PoseIllustration';
import { Button } from './Button';

interface YogaSessionProps {
  routine: YogaRoutine;
  onExit?: () => void;
}

export function YogaSession({ routine, onExit }: YogaSessionProps) {
  const session = useYogaSession(routine);
  const { addActivity } = useMascot();
  const hasCreditedRef = useRef(false);

  useEffect(() => {
    if (session.isComplete && !hasCreditedRef.current) {
      addActivity(`Rotina de yoga concluída (${routine.name})`, 2);
      hasCreditedRef.current = true;
    }
    if (session.isActive) hasCreditedRef.current = false;
  }, [session.isComplete, session.isActive, addActivity, routine.name]);

  if (session.isComplete) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <p className="text-3xl">🦦</p>
        <h3 className="font-display text-lg font-semibold">Rotina concluída!</h3>
        <p className="text-sm text-(--color-ink-muted)">Você completou as {routine.poses.length} posturas de {routine.name}.</p>
        <div className="flex items-center gap-3">
          <Button onClick={session.start} icon={<RotateCcw size={16} />}>Fazer de novo</Button>
          {onExit && <Button variant="ghost" onClick={onExit}>Voltar aos combos</Button>}
        </div>
      </div>
    );
  }

  if (!session.isActive) {
    const firstPose = routine.poses[0];
    return (
      <div className="flex flex-col items-center gap-5 py-4 text-center">
        {onExit && (
          <button onClick={onExit} className="self-start flex items-center gap-1 text-sm text-(--color-ink-muted) hover:text-(--color-ink)">
            <ChevronLeft size={16} />
            Combos
          </button>
        )}
        <h3 className="font-display text-lg font-semibold">{routine.name}</h3>
        <p className="text-sm text-(--color-ink-muted) max-w-xs">{routine.description}</p>
        <p className="text-xs text-(--color-ink-muted)">{routine.poses.length} posturas guiadas</p>
        {firstPose && (
          <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
            <PoseIllustration poseId={firstPose.id} view="front" size={90} />
            <PoseIllustration poseId={firstPose.id} view="left" size={90} />
            <PoseIllustration poseId={firstPose.id} view="right" size={90} />
          </div>
        )}
        <div className="grid grid-cols-3 gap-2 w-full max-w-xs text-[11px] text-(--color-ink-muted) -mt-3">
          <span>Frente</span><span>Esquerda</span><span>Direita</span>
        </div>
        <Button size="lg" onClick={session.start} icon={<Play size={18} fill="currentColor" />}>Começar rotina</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <ProgressIndicator progress={session.progress} color="var(--color-relax)" trackColor="var(--color-relax-soft)" size={200} strokeWidth={10}>
        <div className="flex flex-col items-center px-6 text-center">
          <span className="text-xs font-semibold uppercase tracking-wide text-(--color-relax)">Postura {session.poseIndex + 1} de {session.totalPoses}</span>
          <span className="font-display text-xl font-semibold mt-1">{session.currentPose?.name}</span>
          <span className="font-mono text-lg tabular-nums mt-2 text-(--color-ink-muted)">{session.secondsLeft}s</span>
        </div>
      </ProgressIndicator>
      {session.currentPose && (
        <div className="w-full max-w-xs">
          <div className="grid grid-cols-3 gap-2">
            <PoseIllustration poseId={session.currentPose.id} view="front" size={90} />
            <PoseIllustration poseId={session.currentPose.id} view="left" size={90} />
            <PoseIllustration poseId={session.currentPose.id} view="right" size={90} />
          </div>
          <div className="grid grid-cols-3 gap-2 text-[11px] text-(--color-ink-muted) mt-1 text-center">
            <span>Frente</span><span>Esquerda</span><span>Direita</span>
          </div>
        </div>
      )}
      <p className="text-sm text-(--color-ink-muted) text-center max-w-xs">{session.currentPose?.cue}</p>
      <div className="flex items-center gap-3">
        <Button variant="secondary" onClick={session.skipPose} icon={<SkipForward size={16} />}>Próxima postura</Button>
        <Button variant="ghost" onClick={session.stop} icon={<Square size={14} fill="currentColor" />}>Parar</Button>
      </div>
    </div>
  );
}
