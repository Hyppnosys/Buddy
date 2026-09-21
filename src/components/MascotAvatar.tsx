import type { MascotStage } from '../types/social';

interface MascotAvatarProps {
  size?: number;
  animated?: boolean;
  stage: MascotStage;
}

// Three stages, three distinct real illustrations, in their original
// brown/orange/cream colors — no per-user color customization, and no
// stage silently reusing another stage's image (that was what made
// evolution look broken: two stages sharing one picture meant crossing
// that threshold produced no visible change at all).
const STAGE_IMAGE: Record<MascotStage, string> = {
  hatchling: '/mascot/hatchling.png',
  young: '/mascot/young.png',
  grown: '/mascot/grown.png',
};

/**
 * The mascot is a friendly otter, illustrated with real artwork in its
 * original colors, for each of its three evolution stages.
 */
export function MascotAvatar({ stage, size = 140, animated = true }: MascotAvatarProps) {
  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <img
        src={STAGE_IMAGE[stage]}
        alt={`Mascote lontra na fase ${stage}`}
        width={size}
        height={size}
        className={animated ? 'animate-soft-pulse' : ''}
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          animationDuration: '3.5s',
        }}
      />
    </div>
  );
}
