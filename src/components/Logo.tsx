interface LogoProps {
  size?: number;
}

/**
 * App logo — a recolored (orange → green) version of the reference otter
 * badge artwork, saved as a real image asset at public/logo-otter.png.
 */
export function Logo({ size = 32 }: LogoProps) {
  return (
    <img
      src="/logo-otter.png"
      alt="Buddy"
      width={size}
      height={size}
      className="shrink-0 rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  );
}
