import type { MascotStage } from '../types/social';

interface MascotAvatarProps {
  stage: MascotStage;
  color: string;
  size?: number;
  animated?: boolean;
}

const INK = '#24332A';
const BLUSH = '#F5B9A6';

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

const STAGE_IMAGE: Record<'hatchling' | 'young' | 'grown', string> = {
  hatchling: '/mascot/hatchling.png',
  young: '/mascot/young.png',
  grown: '/mascot/grown.png',
};

/**
 * The mascot is a friendly otter. The hatchling, young, and grown stages
 * use real illustrated artwork (recolored to the app's green palette and
 * hue-shiftable to any of the mascot's customizable colors). The newborn
 * stage — a sleepy curled-up pup — is drawn as SVG since it has no
 * matching reference art, but shares the same color, outline, and blush
 * styling so it still reads as the same character.
 */
export function MascotAvatar({ stage, color, size = 140, animated = true }: MascotAvatarProps) {
  if (stage === 'egg') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        role="img"
        aria-label="Mascote lontra na fase recém-nascido"
        className={animated ? 'animate-soft-pulse' : ''}
        style={{ animationDuration: '3.5s' }}
      >
        {/* Fixed light backdrop (not theme-dependent) so this stage keeps the
            same contrast as the photographed stages, which always sit on a
            light circle regardless of light/dark mode. */}
        <circle cx="80" cy="80" r="76" fill="#E9F2E6" />
        <circle cx="102" cy="46" r="30" fill="#D7E9D2" />

        <ellipse cx="70" cy="122" rx="34" ry="6" fill={INK} opacity="0.08" />
        <ellipse cx="80" cy="104" rx="46" ry="32" fill={color} stroke={INK} strokeWidth="1.8" />
        <ellipse cx="80" cy="112" rx="24" ry="15" fill="white" />
        <ellipse cx="66" cy="92" rx="16" ry="12" fill="white" opacity="0.18" />
        <circle cx="46" cy="86" r="19" fill={color} stroke={INK} strokeWidth="1.8" />
        <ellipse cx="33" cy="72" rx="6.5" ry="8" fill={color} stroke={INK} strokeWidth="1.5" />
        <ellipse cx="52" cy="68" rx="6.5" ry="8" fill={color} stroke={INK} strokeWidth="1.5" />
        <ellipse cx="33" cy="72.6" rx="3" ry="4" fill="#5C8873" />
        <ellipse cx="52" cy="68.6" rx="3" ry="4" fill="#5C8873" />
        <ellipse cx="35" cy="90" rx="6" ry="4.5" fill={BLUSH} opacity="0.8" />
        <path d="M38 84c1.8 1.6 4.6 1.6 6.4 0" stroke={INK} strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M48 88c1.8 1.6 4.6 1.6 6.4 0" stroke={INK} strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M44 92c1 1.1 3 1.1 4 0" stroke={INK} strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <g stroke={INK} strokeWidth="1" strokeLinecap="round" opacity="0.35">
          <path d="M28 88h-9M28 91h-9" />
        </g>
        <text x="102" y="56" fontSize="14" fill={INK} fontFamily="Fraunces, serif" opacity="0.5">z</text>
        <text x="113" y="42" fontSize="11" fill={INK} fontFamily="Fraunces, serif" opacity="0.4">z</text>
      </svg>
    );
  }

  const hueRotate = (hexToHue(color) - BASE_HUE + 360) % 360;

  return (
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
  );
}
