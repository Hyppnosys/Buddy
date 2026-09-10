import type { MascotStage } from '../types/social';

interface MascotAvatarProps {
  stage: MascotStage;
  color: string;
  size?: number;
  animated?: boolean;
}

const INK = '#243329';
const BLUSH = '#F5B9A6';

/**
 * The mascot is a friendly otter companion, drawn from a single symmetric
 * template so every evolution stage reads as the same character just growing
 * up. Everything is mirrored around the vertical center line (x = 80) and
 * built from smooth, consistent shapes — no lopsided limbs or stray tails.
 *
 * The head is drawn last and positioned to overlap the top of the body so the
 * whole figure connects into one creature (never a floating head above a
 * body). Each stage is the same otter at a different scale, sitting with its
 * paws together, plus one small stage-specific accent.
 */

/** The seated body with paws held together and two feet, centered on (80, cy). */
function Body({ cy, unit, color }: { cy: number; unit: number; color: string }) {
  const cx = 80;
  const stroke = 1.8 * unit;
  const bodyRx = 30 * unit;
  const bodyRy = 34 * unit;

  return (
    <g>
      {/* tail, mirrored pair so it never looks lopsided */}
      <ellipse cx={cx - bodyRx * 0.72} cy={cy + bodyRy * 0.62} rx={10 * unit} ry={6 * unit} fill={color} stroke={INK} strokeWidth={stroke} />
      <ellipse cx={cx + bodyRx * 0.72} cy={cy + bodyRy * 0.62} rx={10 * unit} ry={6 * unit} fill={color} stroke={INK} strokeWidth={stroke} />

      {/* feet */}
      <ellipse cx={cx - 15 * unit} cy={cy + bodyRy - 2 * unit} rx={9 * unit} ry={6 * unit} fill={color} stroke={INK} strokeWidth={stroke} />
      <ellipse cx={cx + 15 * unit} cy={cy + bodyRy - 2 * unit} rx={9 * unit} ry={6 * unit} fill={color} stroke={INK} strokeWidth={stroke} />

      {/* body + belly */}
      <ellipse cx={cx} cy={cy} rx={bodyRx} ry={bodyRy} fill={color} stroke={INK} strokeWidth={stroke} />
      <ellipse cx={cx} cy={cy + 4 * unit} rx={bodyRx * 0.55} ry={bodyRy * 0.62} fill="#ffffff" />

      {/* arms resting along the sides — mirrored */}
      <ellipse cx={cx - bodyRx * 0.8} cy={cy + 2 * unit} rx={7 * unit} ry={12 * unit} fill={color} stroke={INK} strokeWidth={stroke} />
      <ellipse cx={cx + bodyRx * 0.8} cy={cy + 2 * unit} rx={7 * unit} ry={12 * unit} fill={color} stroke={INK} strokeWidth={stroke} />
      {/* paws held together on the belly */}
      <circle cx={cx - 6 * unit} cy={cy + 12 * unit} r={6 * unit} fill={color} stroke={INK} strokeWidth={stroke} />
      <circle cx={cx + 6 * unit} cy={cy + 12 * unit} r={6 * unit} fill={color} stroke={INK} strokeWidth={stroke} />
    </g>
  );
}

/** The otter's head, centered on (80, cy). `sleeping` draws closed eyes. */
function Head({ cy, unit, color, sleeping }: { cy: number; unit: number; color: string; sleeping?: boolean }) {
  const cx = 80;
  const r = 30 * unit;
  const stroke = 1.8 * unit;

  const earDx = 21 * unit;
  const earDy = 20 * unit;
  const earR = 9.5 * unit;
  const eyeDx = 12 * unit;
  const eyeDy = 2 * unit;
  const eyeR = 5 * unit;

  return (
    <g>
      {/* ears */}
      <circle cx={cx - earDx} cy={cy - earDy} r={earR} fill={color} stroke={INK} strokeWidth={stroke} />
      <circle cx={cx + earDx} cy={cy - earDy} r={earR} fill={color} stroke={INK} strokeWidth={stroke} />
      <circle cx={cx - earDx} cy={cy - earDy} r={earR * 0.52} fill="#ffffff" opacity="0.35" />
      <circle cx={cx + earDx} cy={cy - earDy} r={earR * 0.52} fill="#ffffff" opacity="0.35" />

      {/* head */}
      <circle cx={cx} cy={cy} r={r} fill={color} stroke={INK} strokeWidth={stroke} />

      {/* muzzle patch + soft top highlight */}
      <ellipse cx={cx} cy={cy + 8 * unit} rx={16 * unit} ry={13 * unit} fill="#ffffff" />
      <ellipse cx={cx - 10 * unit} cy={cy - 12 * unit} rx={9 * unit} ry={6 * unit} fill="#ffffff" opacity="0.18" />

      {/* eyes */}
      {sleeping ? (
        <g stroke={INK} strokeWidth={2.2 * unit} strokeLinecap="round" fill="none">
          <path d={`M${cx - eyeDx - 4 * unit} ${cy - eyeDy}q${4 * unit} ${4 * unit} ${8 * unit} 0`} />
          <path d={`M${cx + eyeDx - 4 * unit} ${cy - eyeDy}q${4 * unit} ${4 * unit} ${8 * unit} 0`} />
        </g>
      ) : (
        <g>
          <circle cx={cx - eyeDx} cy={cy - eyeDy} r={eyeR} fill={INK} />
          <circle cx={cx + eyeDx} cy={cy - eyeDy} r={eyeR} fill={INK} />
          <circle cx={cx - eyeDx + 1.6 * unit} cy={cy - eyeDy - 1.8 * unit} r={eyeR * 0.4} fill="#ffffff" />
          <circle cx={cx + eyeDx + 1.6 * unit} cy={cy - eyeDy - 1.8 * unit} r={eyeR * 0.4} fill="#ffffff" />
        </g>
      )}

      {/* blush */}
      <ellipse cx={cx - 24 * unit} cy={cy + 9 * unit} rx={7 * unit} ry={4.6 * unit} fill={BLUSH} opacity="0.7" />
      <ellipse cx={cx + 24 * unit} cy={cy + 9 * unit} rx={7 * unit} ry={4.6 * unit} fill={BLUSH} opacity="0.7" />

      {/* nose + mouth */}
      <ellipse cx={cx} cy={cy + 6 * unit} rx={3.4 * unit} ry={2.6 * unit} fill={INK} />
      <path d={`M${cx} ${cy + 8.6 * unit}v${3.2 * unit}`} stroke={INK} strokeWidth={1.8 * unit} strokeLinecap="round" fill="none" />
      <path d={`M${cx - 9 * unit} ${cy + 12 * unit}q${9 * unit} ${7 * unit} ${18 * unit} 0`} stroke={INK} strokeWidth={2.2 * unit} strokeLinecap="round" fill="none" />

      {/* whiskers */}
      <g stroke={INK} strokeWidth={1.2 * unit} strokeLinecap="round" opacity="0.5">
        <path d={`M${cx - 20 * unit} ${cy + 4 * unit}h${-12 * unit}`} />
        <path d={`M${cx - 20 * unit} ${cy + 9 * unit}h${-12 * unit}`} />
        <path d={`M${cx + 20 * unit} ${cy + 4 * unit}h${12 * unit}`} />
        <path d={`M${cx + 20 * unit} ${cy + 9 * unit}h${12 * unit}`} />
      </g>
    </g>
  );
}

export function MascotAvatar({ stage, color, size = 140, animated = true }: MascotAvatarProps) {
  // Same otter, scaled up as it "grows". headCy sits above bodyCy by less than
  // the head radius so the head always overlaps the body into one figure.
  const config: Record<MascotStage, { unit: number; headCy: number; bodyCy: number }> = {
    egg: { unit: 0.72, headCy: 66, bodyCy: 104 },
    hatchling: { unit: 0.82, headCy: 62, bodyCy: 106 },
    young: { unit: 0.92, headCy: 58, bodyCy: 107 },
    grown: { unit: 1.02, headCy: 56, bodyCy: 108 },
  };
  const { unit, headCy, bodyCy } = config[stage];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      role="img"
      aria-label={`Mascote lontra na fase ${stage}`}
      className={animated ? 'animate-soft-pulse' : ''}
      style={{ animationDuration: '3.5s' }}
    >
      <ellipse cx="80" cy="150" rx={40 * unit} ry="6" fill={color} opacity="0.14" />

      <Body cy={bodyCy} unit={unit} color={color} />
      <Head cy={headCy} unit={unit} color={color} sleeping={stage === 'egg'} />

      {stage === 'egg' && (
        <g fill={color} fontFamily="Fraunces, serif" opacity="0.75">
          <text x="112" y="52" fontSize="13">z</text>
          <text x="122" y="40" fontSize="10">z</text>
        </g>
      )}

      {stage === 'grown' && (
        // A couple of small sparkles to signal the fully-grown, thriving stage.
        <g fill={color} opacity="0.7">
          <path d="M124 34l1.6 3.4 3.4 1.6-3.4 1.6-1.6 3.4-1.6-3.4-3.4-1.6 3.4-1.6Z" />
          <path d="M32 40l1.1 2.3 2.3 1.1-2.3 1.1-1.1 2.3-1.1-2.3-2.3-1.1 2.3-1.1Z" />
        </g>
      )}
    </svg>
  );
}
