import type { MascotStage } from '../types/social';

interface MascotAvatarProps {
  size?: number;
  animated?: boolean;
  color: string;
  stage: MascotStage;
}

// The reference images were recolored with this green as their "base" body
// color. To let users pick a different mascot color, we rotate the image's
// hue in the browser (via CSS filter) by the difference between the chosen
// color's hue and this base hue — shifting the whole illustration (fur and
// outline together) toward the requested color.
const BASE_HUE = 154;

function hexToHue(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  if (delta === 0) return 0;
  let h: number;
  if (max === r) h = ((g - b) / delta) % 6;
  else if (max === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;
  h *= 60;
  return h < 0 ? h + 360 : h;
}

// All four stages use the same three pieces of real illustrated artwork.
// "egg" (recém-nascido) reuses the hatchling art — the youngest-looking
// pose — with a couple of floating "z"s layered on top to read as resting/
// just-starting-out, rather than a separate, lower-quality hand-drawn image.
const STAGE_IMAGE: Record<MascotStage, string> = {
  egg: '/mascot/hatchling.png',
  hatchling: '/mascot/hatchling.png',
  young: '/mascot/young.png',
  grown: '/mascot/grown.png',
};

/**
 * The mascot is a friendly otter, illustrated with real artwork (recolored
 * to the app's green palette and hue-shiftable to any of the mascot's
 * customizable colors) for all four evolution stages.
 */
export function MascotAvatar({ stage, color, size = 140, animated = true }: MascotAvatarProps) {
  const hueRotate = (hexToHue(color) - BASE_HUE + 360) % 360;

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
          filter: hueRotate !== 0 ? `hue-rotate(${hueRotate}deg)` : undefined,
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
