import { POSE_FIGURES } from '../utils/poseFigures';

interface PoseIllustrationProps {
  poseId: string;
  view: 'front' | 'left' | 'right';
  size?: number;
}

export function PoseIllustration({ poseId, view, size = 96 }: PoseIllustrationProps) {
  const data = POSE_FIGURES[poseId];
  if (!data) return null;

  const spec = view === 'front' ? data.front : data.side;
  const mirror = view === 'right';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={`Postura vista de ${view === 'front' ? 'frente' : view === 'left' ? 'lado esquerdo' : 'lado direito'}`}
      className="bg-(--color-relax-soft) rounded-2xl"
    >
      <g transform={mirror ? 'translate(100,0) scale(-1,1)' : undefined}>
        <line x1="8" y1="92" x2="92" y2="92" stroke="var(--color-border)" strokeWidth="2" strokeDasharray="3 4" />
        {spec.limbs.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--color-relax)" strokeWidth="5" strokeLinecap="round" />
        ))}
        <circle cx={spec.head[0]} cy={spec.head[1]} r="7" fill="var(--color-relax)" />
      </g>
    </svg>
  );
}
