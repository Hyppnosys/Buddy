interface LogoProps {
  size?: number;
}

const BODY = '#3F6B58';
const INK = '#24332A';
const MINT = '#CFEBD8';
const BLUSH = '#F5B9A6';

/**
 * App logo: a round sticker-style badge with the otter's face. Everything is
 * mirrored around the vertical center line (x = 50) so the face always reads
 * as clean and balanced, even at small nav-bar sizes. Kept to the face and
 * shoulders only — no arms or tail — so nothing looks cramped when scaled down.
 */
export function Logo({ size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="Buddy"
      className="shrink-0"
    >
      <defs>
        <clipPath id="buddy-logo-clip">
          <circle cx="50" cy="50" r="44" />
        </clipPath>
      </defs>

      {/* badge */}
      <circle cx="50" cy="50" r="47" fill="white" stroke={INK} strokeWidth="3" />

      <g clipPath="url(#buddy-logo-clip)">
        {/* soft mint sky + sparkles */}
        <rect x="6" y="6" width="88" height="88" fill={MINT} />
        <circle cx="50" cy="58" r="34" fill="white" opacity="0.55" />
        <path d="M24 24l1.4 3 3 1.4-3 1.4-1.4 3-1.4-3-3-1.4 3-1.4Z" fill="white" opacity="0.9" />
        <path d="M78 30l1 2.1 2.1 1-2.1 1-1 2.1-1-2.1-2.1-1 2.1-1Z" fill="white" opacity="0.85" />

        {/* shoulders */}
        <ellipse cx="50" cy="96" rx="30" ry="20" fill={BODY} stroke={INK} strokeWidth="2" />
        <ellipse cx="50" cy="100" rx="15" ry="13" fill="white" />

        {/* ears (mirrored) */}
        <circle cx="31" cy="34" r="9" fill={BODY} stroke={INK} strokeWidth="2" />
        <circle cx="69" cy="34" r="9" fill={BODY} stroke={INK} strokeWidth="2" />
        <circle cx="31" cy="34" r="4.6" fill="white" opacity="0.35" />
        <circle cx="69" cy="34" r="4.6" fill="white" opacity="0.35" />

        {/* head */}
        <circle cx="50" cy="50" r="26" fill={BODY} stroke={INK} strokeWidth="2" />

        {/* muzzle patch + highlight */}
        <ellipse cx="50" cy="58" rx="15" ry="12" fill="white" />
        <ellipse cx="41" cy="40" rx="8" ry="5" fill="white" opacity="0.18" />

        {/* eyes (mirrored) */}
        <circle cx="40" cy="48" r="4.6" fill={INK} />
        <circle cx="60" cy="48" r="4.6" fill={INK} />
        <circle cx="41.6" cy="46.2" r="1.8" fill="white" />
        <circle cx="61.6" cy="46.2" r="1.8" fill="white" />

        {/* blush (mirrored) */}
        <ellipse cx="30" cy="58" rx="6" ry="4" fill={BLUSH} opacity="0.75" />
        <ellipse cx="70" cy="58" rx="6" ry="4" fill={BLUSH} opacity="0.75" />

        {/* nose + mouth */}
        <ellipse cx="50" cy="55" rx="3" ry="2.3" fill={INK} />
        <path d="M50 57.3v3" stroke={INK} strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M42 61c3 3.2 13 3.2 16 0" stroke={INK} strokeWidth="2.4" strokeLinecap="round" fill="none" />

        {/* whiskers (mirrored) */}
        <g stroke={INK} strokeWidth="1.1" strokeLinecap="round" opacity="0.5">
          <path d="M35 54h-9M35 58h-9M65 54h9M65 58h9" />
        </g>
      </g>

      <circle cx="50" cy="50" r="44" fill="none" stroke={INK} strokeWidth="1" opacity="0.2" />
    </svg>
  );
}
