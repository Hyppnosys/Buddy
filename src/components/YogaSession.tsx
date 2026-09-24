import { ChevronLeft, Play, RotateCcw, SkipForward, Square } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { YogaRoutine } from '../types/wellness';
import { useYogaSession, type PoseFeedback } from '../hooks/useYogaSession';
import { useMascot } from '../hooks/useMascot';
import { ProgressIndicator } from './ProgressIndicator';
import { Button } from './Button';

interface YogaSessionProps {
  routine: YogaRoutine;
  onExit?: () => void;
}

const FEEDBACK_LABEL: Record<PoseFeedback, string> = {
  aguardando: 'Posicione-se na pose',
  correta: 'Pose correta!',
  incorreta: 'Ajuste a postura',
  sem_deteccao: 'Não conseguimos ver você',
};

const FEEDBACK_RING: Record<PoseFeedback, string> = {
  aguardando: 'ring-(--color-border)',
  correta: 'ring-(--color-success)',
  incorreta: 'ring-(--color-short)',
  sem_deteccao: 'ring-(--color-border)',
};

export function YogaSession({ routine, onExit }: YogaSessionProps) {
  const session = useYogaSession(routine);
  const { addActivity } = useMascot();
  const hasCreditedRef = useRef(false);

  useEffect(() => {
    if (session.isComplete && !hasCreditedRef.current) {
      addActivity(`Rotina de yoga concluída (${routine.name})`, 2);
      hasCreditedRef.current = true;
    }
    if (session.isActive) {
      hasCreditedRef.current = false;
    }
  }, [session.isComplete, session.isActive, addActivity, routine.name]);

  const cameraFeed = (
    <div
      className={`relative aspect-video w-full max-w-xs overflow-hidden rounded-2xl bg-black ring-4 transition-colors duration-300 ${FEEDBACK_RING[session.feedback]}`}
    >
      <video
        ref={session.videoRef}
        autoPlay
        playsInline
        muted
        className="h-full w-full -scale-x-100 object-cover"
      />
      {session.isActive && (
        <div className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-lg font-bold tabular-nums text-white">
          {session.secondsLeft}s
        </div>
      )}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
        {session.isActive ? FEEDBACK_LABEL[session.feedback] : 'Prévia da câmera'}
      </div>
    </div>
  );

  // Diagnóstico temporário: mostra o que o modelo está realmente enxergando
  // (classe + confiança), independente de passar do limiar ou não. Remova
  // este bloco quando a detecção estiver calibrada e funcionando bem.
  const debugReadout = session.isActive && session.lastDetection && (
    <p className="max-w-xs text-center text-[11px] text-(--color-ink-muted)">
      Debug: {session.lastDetection.class} ({Math.round(session.lastDetection.confidence * 100)}%)
    </p>
  );

  const statusNotice = (() => {
    if (session.cameraStatus === 'denied' || session.cameraStatus === 'error') {
      return <p className="max-w-xs text-center text-sm text-(--color-danger)">{session.cameraError}</p>;
    }
    if (session.modelError) {
      return <p className="max-w-xs text-center text-sm text-(--color-danger)">{session.modelError}</p>;
    }
    if (session.cameraStatus === 'ready' && !session.modelReady) {
      return <p className="max-w-xs text-center text-xs text-(--color-ink-muted)">Carregando modelo de detecção…</p>;
    }
    return null;
  })();

  if (session.isComplete) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <p className="text-3xl">🦦</p>
        <h3 className="font-display text-lg font-semibold">Rotina concluída!</h3>
        <p className="text-sm text-(--color-ink-muted)">
          Você completou as {routine.poses.length} posturas de {routine.name}.
        </p>
        <div className="flex items-center gap-3">
          <Button onClick={session.start} icon={<RotateCcw size={16} />}>
            Fazer de novo
          </Button>
          {onExit && (
            <Button variant="ghost" onClick={onExit}>
              Voltar aos combos
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (!session.isActive) {
    const previewPose = routine.poses[0];
    return (
      <div className="flex flex-col items-center gap-5 py-4 text-center">
        {onExit && (
          <button
            onClick={onExit}
            className="self-start flex items-center gap-1 text-sm text-(--color-ink-muted) hover:text-(--color-ink)"
          >
            <ChevronLeft size={16} />
            Combos
          </button>
        )}
        <h3 className="font-display text-lg font-semibold">{routine.name}</h3>
        <p className="text-sm text-(--color-ink-muted) max-w-xs">{routine.description}</p>
        <p className="text-xs text-(--color-ink-muted)">{routine.poses.length} posturas guiadas</p>

        {previewPose?.imageUrl && (
          <img
            src={previewPose.imageUrl}
            alt={previewPose.name}
            className="h-28 w-28 object-contain opacity-80"
          />
        )}

        {cameraFeed}
        {statusNotice}
        {session.apiError && <p className="max-w-xs text-center text-xs text-(--color-short)">{session.apiError}</p>}

        <Button
          size="lg"
          onClick={session.start}
          disabled={!session.canStart}
          icon={<Play size={18} fill="currentColor" />}
        >
          {session.cameraStatus === 'requesting'
            ? 'Ativando câmera…'
            : !session.modelReady
              ? 'Carregando modelo…'
              : 'Começar rotina'}
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
        size={200}
        strokeWidth={10}
      >
        <div className="flex flex-col items-center px-6 text-center">
          <span className="text-xs font-semibold uppercase tracking-wide text-(--color-relax)">
            Postura {session.poseIndex + 1} de {session.totalPoses}
          </span>
          {session.currentPose?.imageUrl && (
            <img
              src={session.currentPose.imageUrl}
              alt={session.currentPose.name}
              className="h-16 w-16 object-contain my-1"
            />
          )}
          <span className="font-display text-xl font-semibold">{session.currentPose?.name}</span>
          <span className="text-xs italic text-(--color-ink-muted)">{session.currentPose?.sanskritName}</span>
        </div>
      </ProgressIndicator>

      {cameraFeed}
      {debugReadout}
      {session.apiError && <p className="max-w-xs text-center text-xs text-(--color-short)">{session.apiError}</p>}

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
