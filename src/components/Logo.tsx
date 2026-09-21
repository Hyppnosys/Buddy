interface LogoProps {
  size?: number;
}

/**
 * App logo — a recolored (orange/blue → green) version of the reference
 * otter badge artwork, saved as a real, high-resolution image asset at
 * public/logo-otter.png. The circle is cropped with an even margin on every
 * side in the source file itself, and rendered with `object-contain` (not
 * `cover`) so the CSS circular mask never clips into the artwork — using
 * `cover` here was what made the badge look cut off/square before.
 */
export function Logo({ size = 32 }: LogoProps) {
  return (
    <img
      src="/logo-otter.png"
      alt="Buddy"
      width={size}
      height={size}
      className="shrink-0 rounded-full object-contain"
      style={{ width: size, height: size }}
    />
  );
}
