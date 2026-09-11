import type { MascotStage } from '../types/social';
import { MascotAvatar } from './MascotAvatar';

interface CompanionSceneProps {
  stage: MascotStage;
  color: string;
}

function PersonSilhouette({ size = 130 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 140 140" role="presentation" aria-hidden>
      {/* Fixed light backdrop so this always has good contrast, in both
          light and dark mode, matching the mascot's photographed stages. */}
      <circle cx="70" cy="70" r="66" fill="#E9F2E6" />
      <ellipse cx="70" cy="118" rx="30" ry="6" fill="#24332A" opacity="0.08" />
      <circle cx="70" cy="46" r="16" fill="#3F6B58" />
      <path d="M46 116c-2-28 6-48 24-48s26 20 24 48c-16 6-32 6-48 0Z" fill="#3F6B58" />
      <path d="M52 58c-8 6-12 15-11 25" stroke="#3F6B58" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M88 58c8 6 12 15 11 25" stroke="#3F6B58" strokeWidth="8" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function CompanionScene({ stage, color }: CompanionSceneProps) {
  return (
    <div className="flex items-end justify-center gap-3">
      <PersonSilhouette size={130} />
      <MascotAvatar stage={stage} color={color} size={110} />
    </div>
  );
}
