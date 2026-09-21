import { Pause, Play, RotateCcw, SkipForward } from 'lucide-react';
import type { TimerStatus } from '../types/timer';
import { Button } from './Button';

interface TimerControlsProps {
  status: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export function TimerControls({ status, onStart, onPause, onReset, onSkip }: TimerControlsProps) {
  const isRunning = status === 'running';
  const isIdleFresh = status === 'idle';

  return (
    <div className="flex items-center justify-center gap-3 flex-wrap">
      {!isRunning ? (
        <Button size="lg" onClick={onStart} icon={<Play size={20} fill="currentColor" />}>
          {status === 'paused' ? 'Continuar' : 'Iniciar'}
        </Button>
      ) : (
        <Button size="lg" variant="secondary" onClick={onPause} icon={<Pause size={20} fill="currentColor" />}>
          Pausar
        </Button>
      )}
      <Button size="lg" variant="ghost" onClick={onReset} disabled={isIdleFresh} icon={<RotateCcw size={18} />} aria-label="Reiniciar sessão">
        Reiniciar
      </Button>
      <Button size="lg" variant="ghost" onClick={onSkip} icon={<SkipForward size={18} />} aria-label="Pular para a próxima sessão">
        Pular
      </Button>
    </div>
  );
}
