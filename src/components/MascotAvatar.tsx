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
 * The mascot is a friendly otter — a warm, companion-like character meant to
 * feel like it's genuinely keeping the user company. Every evolution stage
 * (egg → hatchling → young → grown) shares the same round head, cheek
 * tufts, whiskers and "paws together" pose so they all read as the same
 * character at different ages, just drawn with more refined proportions,
 * a soft sticker-style highlight, and a gentler, rounder line quality than
 * the previous version.
 */
export function MascotAvatar({ stage, color, size = 140, animated = true }: MascotAvatarProps) {
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
      <ellipse cx="80" cy="142" rx="38" ry="7" fill={color} opacity="0.14" />

      {stage === 'egg' && (
        // Sleepy, curled-up pup — soft and round, eyes closed, resting.
        <g>
          <ellipse cx="80" cy="70" rx="16" ry="8" fill={color} opacity="0.55" />
          <ellipse cx="80" cy="104" rx="46" ry="32" fill={color} stroke={INK} strokeWidth="1.5" />
          <ellipse cx="66" cy="90" rx="16" ry="13" fill="white" opacity="0.18" />
          <ellipse cx="80" cy="112" rx="24" ry="15" fill="white" />
          <circle cx="46" cy="86" r="19" fill={color} stroke={INK} strokeWidth="1.5" />
          <ellipse cx="33" cy="72" rx="6.5" ry="8" fill={color} stroke={INK} strokeWidth="1.3" />
          <ellipse cx="52" cy="68" rx="6.5" ry="8" fill={color} stroke={INK} strokeWidth="1.3" />
          <ellipse cx="35" cy="90" rx="6" ry="4.5" fill={BLUSH} opacity="0.75" />
          <path d="M38 84c1.8 1.6 4.6 1.6 6.4 0" stroke={INK} strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path d="M48 88c1.8 1.6 4.6 1.6 6.4 0" stroke={INK} strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path d="M44 92c1 1.1 3 1.1 4 0" stroke={INK} strokeWidth="1.6" strokeLinecap="round" fill="none" />
          <g stroke={INK} strokeWidth="1" strokeLinecap="round" opacity="0.5">
            <path d="M28 88h-9M28 91h-9" />
          </g>
          <text x="104" y="58" fontSize="13" fill={color} fontFamily="Fraunces, serif" opacity="0.8">z</text>
          <text x="114" y="46" fontSize="10" fill={color} fontFamily="Fraunces, serif" opacity="0.65">z</text>
        </g>
      )}

      {stage === 'hatchling' && (
        // Small pup standing, one paw raised in a little wave hello.
        <g>
          <ellipse cx="80" cy="104" rx="27" ry="30" fill={color} stroke={INK} strokeWidth="1.5" />
          <ellipse cx="80" cy="110" rx="14" ry="18" fill="white" />
          <ellipse cx="52" cy="98" rx="8" ry="7" fill={color} stroke={INK} strokeWidth="1.4" />
          <circle cx="80" cy="58" r="27" fill={color} stroke={INK} strokeWidth="1.5" />
          <ellipse cx="66" cy="49" rx="9" ry="11" fill={color} stroke={INK} strokeWidth="1.4" />
          <ellipse cx="94" cy="49" rx="9" ry="11" fill={color} stroke={INK} strokeWidth="1.4" />
          <ellipse cx="66" cy="50" rx="4.6" ry="5.6" fill="white" opacity="0.55" />
          <ellipse cx="94" cy="50" rx="4.6" ry="5.6" fill="white" opacity="0.55" />
          <ellipse cx="80" cy="66" rx="13" ry="10.5" fill="white" />
          <ellipse cx="65" cy="52" rx="9" ry="7" fill="white" opacity="0.16" />
          <circle cx="68" cy="57" r="4.6" fill={INK} />
          <circle cx="92" cy="57" r="4.6" fill={INK} />
          <circle cx="69.6" cy="55.2" r="1.6" fill="white" />
          <circle cx="93.6" cy="55.2" r="1.6" fill="white" />
          <ellipse cx="59" cy="66" rx="6.5" ry="4.5" fill={BLUSH} opacity="0.75" />
          <ellipse cx="101" cy="66" rx="6.5" ry="4.5" fill={BLUSH} opacity="0.75" />
          <ellipse cx="80" cy="65" rx="3.2" ry="2.4" fill={INK} />
          <path d="M72 71c3 3.2 13 3.2 16 0" stroke={INK} strokeWidth="2" strokeLinecap="round" fill="none" />
          <g stroke={INK} strokeWidth="1.1" strokeLinecap="round" opacity="0.55">
            <path d="M56 60h-11M56 64h-11M104 60h11M104 64h11" />
          </g>
          <path
            d="M53 100c-9-2-15 6-13 13"
            stroke={color}
            strokeWidth="9"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="41" cy="111" r="6.4" fill={color} stroke={INK} strokeWidth="1.3" />
          <path d="M104 118c8 3 14-3 14-3" stroke={color} strokeWidth="9" strokeLinecap="round" fill="none" />
          <ellipse cx="66" cy="130" rx="9" ry="6" fill={color} stroke={INK} strokeWidth="1.3" />
          <ellipse cx="94" cy="130" rx="9" ry="6" fill={color} stroke={INK} strokeWidth="1.3" />
        </g>
      )}

      {stage === 'young' && (
        // Sitting up, paws held together — the classic, endearing otter pose.
        <g>
          <path d="M114 96c10 4 12 20 2 30" stroke={color} strokeWidth="12" strokeLinecap="round" fill="none" />
          <ellipse cx="80" cy="110" rx="32" ry="36" fill={color} stroke={INK} strokeWidth="1.6" />
          <ellipse cx="80" cy="116" rx="17" ry="23" fill="white" />
          <path d="M46 92c-11-2-18 7-15 15" stroke={color} strokeWidth="10" strokeLinecap="round" fill="none" />
          <path d="M114 92c11-2 18 7 15 15" stroke={color} strokeWidth="10" strokeLinecap="round" fill="none" />
          <circle cx="80" cy="56" r="30" fill={color} stroke={INK} strokeWidth="1.6" />
          <ellipse cx="64" cy="46" rx="10" ry="12" fill={color} stroke={INK} strokeWidth="1.5" />
          <ellipse cx="96" cy="46" rx="10" ry="12" fill={color} stroke={INK} strokeWidth="1.5" />
          <ellipse cx="64" cy="47" rx="5.2" ry="6.4" fill="white" opacity="0.55" />
          <ellipse cx="96" cy="47" rx="5.2" ry="6.4" fill="white" opacity="0.55" />
          <ellipse cx="80" cy="64" rx="15" ry="12" fill="white" />
          <ellipse cx="63" cy="48" rx="10" ry="7.5" fill="white" opacity="0.16" />
          <circle cx="66" cy="55" r="5.2" fill={INK} />
          <circle cx="94" cy="55" r="5.2" fill={INK} />
          <circle cx="68" cy="52.8" r="1.9" fill="white" />
          <circle cx="96" cy="52.8" r="1.9" fill="white" />
          <ellipse cx="55" cy="65" rx="7.5" ry="5.2" fill={BLUSH} opacity="0.75" />
          <ellipse cx="105" cy="65" rx="7.5" ry="5.2" fill={BLUSH} opacity="0.75" />
          <ellipse cx="80" cy="63" rx="3.6" ry="2.8" fill={INK} />
          <path d="M70 70c4 3.6 16 3.6 20 0" stroke={INK} strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <g stroke={INK} strokeWidth="1.2" strokeLinecap="round" opacity="0.55">
            <path d="M52 58h-12M52 63h-12M108 58h12M108 63h12" />
          </g>
          <ellipse cx="63" cy="128" rx="11" ry="13" fill={color} stroke={INK} strokeWidth="1.5" />
          <ellipse cx="97" cy="128" rx="11" ry="13" fill={color} stroke={INK} strokeWidth="1.5" />
          <ellipse cx="63" cy="132" rx="6.4" ry="7" fill="white" opacity="0.6" />
          <ellipse cx="97" cy="132" rx="6.4" ry="7" fill="white" opacity="0.6" />
          <ellipse cx="60" cy="146" rx="9" ry="6" fill={color} stroke={INK} strokeWidth="1.3" />
          <ellipse cx="100" cy="146" rx="9" ry="6" fill={color} stroke={INK} strokeWidth="1.3" />
        </g>
      )}

      {stage === 'grown' && (
        // Confident, upright, paws together — a steady companion presence.
        <g>
          <path d="M118 92c12 4 14 24 2 34" stroke={color} strokeWidth="13" strokeLinecap="round" fill="none" />
          <ellipse cx="80" cy="112" rx="36" ry="42" fill={color} stroke={INK} strokeWidth="1.7" />
          <ellipse cx="80" cy="119" rx="19" ry="27" fill="white" />
          <path d="M40 88c-13-2-21 8-17 17" stroke={color} strokeWidth="11" strokeLinecap="round" fill="none" />
          <path d="M120 88c13-2 21 8 17 17" stroke={color} strokeWidth="11" strokeLinecap="round" fill="none" />
          <circle cx="80" cy="54" r="33" fill={color} stroke={INK} strokeWidth="1.7" />
          <ellipse cx="61" cy="42" rx="11" ry="13" fill={color} stroke={INK} strokeWidth="1.6" />
          <ellipse cx="99" cy="42" rx="11" ry="13" fill={color} stroke={INK} strokeWidth="1.6" />
          <ellipse cx="61" cy="43" rx="5.7" ry="7" fill="white" opacity="0.55" />
          <ellipse cx="99" cy="43" rx="5.7" ry="7" fill="white" opacity="0.55" />
          <ellipse cx="80" cy="62" rx="17" ry="13.5" fill="white" />
          <ellipse cx="60" cy="44" rx="11" ry="8" fill="white" opacity="0.16" />
          <circle cx="64" cy="52" r="5.7" fill={INK} />
          <circle cx="96" cy="52" r="5.7" fill={INK} />
          <circle cx="66.2" cy="49.6" r="2.1" fill="white" />
          <circle cx="98.2" cy="49.6" r="2.1" fill="white" />
          <ellipse cx="51" cy="62" rx="8.2" ry="5.7" fill={BLUSH} opacity="0.75" />
          <ellipse cx="109" cy="62" rx="8.2" ry="5.7" fill={BLUSH} opacity="0.75" />
          <ellipse cx="80" cy="60" rx="4" ry="3" fill={INK} />
          <path d="M68 68c4.5 4 19 4 24 0" stroke={INK} strokeWidth="2.4" strokeLinecap="round" fill="none" />
          <g stroke={INK} strokeWidth="1.3" strokeLinecap="round" opacity="0.55">
            <path d="M48 55h-13M48 60h-13M112 55h13M112 60h13" />
          </g>
          <ellipse cx="62" cy="132" rx="12.5" ry="15" fill={color} stroke={INK} strokeWidth="1.6" />
          <ellipse cx="98" cy="132" rx="12.5" ry="15" fill={color} stroke={INK} strokeWidth="1.6" />
          <ellipse cx="62" cy="137" rx="7.2" ry="8" fill="white" opacity="0.6" />
          <ellipse cx="98" cy="137" rx="7.2" ry="8" fill="white" opacity="0.6" />
          <ellipse cx="58" cy="152" rx="10" ry="6.5" fill={color} stroke={INK} strokeWidth="1.4" />
          <ellipse cx="102" cy="152" rx="10" ry="6.5" fill={color} stroke={INK} strokeWidth="1.4" />
        </g>
      )}
    </svg>
  );
}
