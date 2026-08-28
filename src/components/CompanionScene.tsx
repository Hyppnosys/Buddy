import type { MascotStage } from '../types/social';
import { MascotAvatar } from './MascotAvatar';

interface CompanionSceneProps {
  stage: MascotStage;
  color: string;
}

/** A minimal, generic person silhouette — not meant to depict any real person. */
function PersonSilhouette({ size = 130 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 140" role="presentation" aria-hidden>
      <ellipse cx="50" cy="132" rx="26" ry="6" fill="var(--color-focus)" opacity="0.1" />
      <circle cx="50" cy="26" r="16" fill="var(--color-focus)" />
      <path
        d="M26 128c-2-30 6-52 24-52s26 22 24 52c-16 6-32 6-48 0Z"
        fill="var(--color-focus)"
      />
      <path
        d="M32 66c-8 6-12 16-11 27"
        stroke="var(--color-focus)"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M68 66c8 6 12 16 11 27"
        stroke="var(--color-focus)"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function CompanionScene({ stage, color }: CompanionSceneProps) {
  return (
    <div className="flex items-end justify-center gap-2">
      <PersonSilhouette size={130} />
      <MascotAvatar stage={stage} color={color} size={100} />
    </div>
  );
}
