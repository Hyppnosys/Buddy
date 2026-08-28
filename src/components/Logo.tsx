interface LogoProps {
  size?: number;
}

const BODY = '#3F6B58';
const INK = '#24332A';
const MINT = '#CFEBD8';
const BLUSH = '#F5B9A6';

/**
 * App logo: a round sticker-style badge with the otter's face and
 * shoulders — thick ink outline, glossy eyes, a soft mint "sky" behind it,
 * and a couple of tiny sparkles. Kept deliberately simple (no arms/tail)
 * so the face reads clearly even at small nav-bar sizes.
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

      <circle cx="50" cy="50" r="47" fill="white" stroke={INK} strokeWidth="3" />

      <g clipPath="url(#buddy-logo-clip)">
        <circle cx="66" cy="32" r="30" fill={MINT} />
        <circle cx="47" cy="40" r="27" fill="white" />
        <path d="M74 44l1.6 3.4L79 49l-3.4 1.6L74 54l-1.6-3.4L69 49l3.4-1.6Z" fill="white" opacity="0.9" />
        <path d="M81 26l1.1 2.3 2.3 1.1-2.3 1.1-1.1 2.3-1.1-2.3-2.3-1.1 2.3-1.1Z" fill="white" opacity="0.85" />

        {/* shoulders */}
        <ellipse cx="50" cy="92" rx="30" ry="22" fill={BODY} stroke={INK} strokeWidth="1.8" />
        <ellipse cx="50" cy="96" rx="15" ry="14" fill="white" />

        {/* head */}
        <circle cx="50" cy="48" r="23" fill={BODY} stroke={INK} strokeWidth="1.8" />
        <circle cx="30" cy="46" r="8" fill={BODY} stroke={INK} strokeWidth="1.6" />
        <circle cx="70" cy="46" r="8" fill={BODY} stroke={INK} strokeWidth="1.6" />
        <circle cx="34" cy="35" r="7.5" fill={BODY} stroke={INK} strokeWidth="1.6" />
        <circle cx="66" cy="35" r="7.5" fill={BODY} stroke={INK} strokeWidth="1.6" />
        <circle cx="34" cy="35.6" r="3.6" fill="#5C8873" />
        <circle cx="66" cy="35.6" r="3.6" fill="#5C8873" />

        <ellipse cx="50" cy="56" rx="15" ry="12" fill="white" />

        <circle cx="41.5" cy="47" r="5" fill={INK} />
        <circle cx="58.5" cy="47" r="5" fill={INK} />
        <circle cx="43.5" cy="44.8" r="1.9" fill="white" />
        <circle cx="60.5" cy="44.8" r="1.9" fill="white" />

        <ellipse cx="29" cy="57" rx="6.6" ry="4.6" fill={BLUSH} opacity="0.8" />
        <ellipse cx="71" cy="57" rx="6.6" ry="4.6" fill={BLUSH} opacity="0.8" />

        <ellipse cx="50" cy="56" rx="3" ry="2.2" fill={INK} />
        <path d="M42 61c3 3.6 13 3.6 16 0" stroke={INK} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      </g>

      <circle cx="50" cy="50" r="44" fill="none" stroke={INK} strokeWidth="1" opacity="0.2" />
    </svg>
  );
}
