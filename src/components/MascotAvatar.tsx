import type { MascotStage } from '../types/social';

interface MascotAvatarProps {
  size?: number;
  animated?: boolean;
  stage: MascotStage;
}

// All four stages use the same three pieces of real illustrated artwork,
// in their original colors (no per-user color customization — the mascot
// has one fixed, consistent appearance everywhere it appears). "egg"
// (recém-nascido) reuses the hatchling art — the youngest-looking pose —
// with a couple of floating "z"s layered on top to read as resting/
// just-starting-out, rather than a separate, lower-quality hand-drawn image.
const STAGE_IMAGE: Record<MascotStage, string> = {
  egg: '/mascot/hatchling.png',
  hatchling: '/mascot/hatchling.png',
  young: '/mascot/young.png',
  grown: '/mascot/grown.png',
};

/**
 * The mascot is a friendly otter, illustrated with real artwork in its
 * original green palette, for all four evolution stages.
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
      {stage === 'egg' && (
        <svg
          viewBox="0 0 100 100"
          width={size * 0.4}
          height={size * 0.4}
          className="absolute -top-1 -right-1 animate-soft-pulse"
          style={{ animationDuration: '2.2s' }}
          aria-hidden
        >
          <text x="46" y="52" fontSize="26" fill="#24332A" opacity="0.55" fontFamily="Fraunces, serif">z</text>
          <text x="64" y="34" fontSize="18" fill="#24332A" opacity="0.4" fontFamily="Fraunces, serif">z</text>
        </svg>
      )}
    </div>
  );
}
