import type { MascotStage } from '../types/social';

interface MascotAvatarProps {
  stage: MascotStage;
  color: string;
  size?: number;
  animated?: boolean;
}

export function MascotAvatar({ stage, color, size = 140, animated = true }: MascotAvatarProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 140 140"
      role="img"
      aria-label={`Mascote na fase ${stage}`}
      className={animated ? 'animate-soft-pulse' : ''}
      style={{ animationDuration: '3.5s' }}
    >
      {/* soft shadow */}
      <ellipse cx="70" cy="122" rx="32" ry="7" fill={color} opacity="0.12" />

      {stage === 'egg' && (
        <g>
          <path
            d="M70 24c22 0 34 30 34 54 0 20-15 32-34 32S36 98 36 78c0-24 12-54 34-54Z"
            fill={color}
            opacity="0.9"
          />
          <path d="M56 52c6-8 12-11 18-11" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.5" fill="none" />
          <circle cx="58" cy="70" r="3" fill="white" opacity="0.7" />
          <circle cx="82" cy="80" r="2.2" fill="white" opacity="0.6" />
        </g>
      )}

      {stage === 'hatchling' && (
        <g>
          <ellipse cx="70" cy="82" rx="34" ry="30" fill={color} />
          <circle cx="70" cy="42" r="20" fill={color} />
          <circle cx="62" cy="40" r="3.4" fill="#23261F" />
          <circle cx="78" cy="40" r="3.4" fill="#23261F" />
          <path d="M64 50c3 3 9 3 12 0" stroke="#23261F" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          <path d="M38 84c-10-2-16 4-16 4" stroke={color} strokeWidth="6" strokeLinecap="round" />
          <path d="M102 84c10-2 16 4 16 4" stroke={color} strokeWidth="6" strokeLinecap="round" />
        </g>
      )}

      {stage === 'young' && (
        <g>
          <ellipse cx="70" cy="86" rx="38" ry="32" fill={color} />
          <circle cx="70" cy="40" r="22" fill={color} />
          <circle cx="61" cy="38" r="3.6" fill="#23261F" />
          <circle cx="79" cy="38" r="3.6" fill="#23261F" />
          <path d="M62 48c4 4 12 4 16 0" stroke="#23261F" strokeWidth="2.6" strokeLinecap="round" fill="none" />
          <path d="M32 66c-12-6-18 2-18 2" stroke={color} strokeWidth="7" strokeLinecap="round" />
          <path d="M108 66c12-6 18 2 18 2" stroke={color} strokeWidth="7" strokeLinecap="round" />
          <ellipse cx="52" cy="94" rx="7" ry="5" fill="white" opacity="0.35" />
          <ellipse cx="88" cy="94" rx="7" ry="5" fill="white" opacity="0.35" />
          <path d="M46 16c4-6 12-8 16-4M94 16c-4-6-12-8-16-4" stroke={color} strokeWidth="4" strokeLinecap="round" fill="none" />
        </g>
      )}

      {stage === 'grown' && (
        <g>
          <ellipse cx="70" cy="88" rx="42" ry="34" fill={color} />
          <circle cx="70" cy="38" r="24" fill={color} />
          <circle cx="60" cy="36" r="4" fill="#23261F" />
          <circle cx="80" cy="36" r="4" fill="#23261F" />
          <path d="M60 46c5 5 15 5 20 0" stroke="#23261F" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M28 60c-14-8-22 2-22 2" stroke={color} strokeWidth="8" strokeLinecap="round" />
          <path d="M112 60c14-8 22 2 22 2" stroke={color} strokeWidth="8" strokeLinecap="round" />
          <ellipse cx="50" cy="96" rx="8" ry="6" fill="white" opacity="0.35" />
          <ellipse cx="90" cy="96" rx="8" ry="6" fill="white" opacity="0.35" />
          <path
            d="M42 10c4-8 14-10 20-5M98 10c-4-8-14-10-20-5"
            stroke={color}
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M52 118c6 6 30 6 36 0" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.8" />
        </g>
      )}
    </svg>
  );
}
