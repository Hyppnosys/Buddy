import type { MascotStage } from '../types/social';
import { MascotAvatar } from './MascotAvatar';

interface CompanionSceneProps {
  stage: MascotStage;
}

/**
 * The home screen previously showed two figures side by side — a hand-drawn
 * meditating person (an earlier placeholder, before the real otter artwork
 * existed) plus the actual otter mascot — which read as "two mascots" at
 * once. Only the real mascot illustration is shown now.
 */
export function CompanionScene({ stage }: CompanionSceneProps) {
  return (
    <div className="flex items-end justify-center">
      <MascotAvatar stage={stage} size={150} />
    </div>
  );
}
