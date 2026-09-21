import type { MascotStage } from '../types/social';
import { MascotAvatar } from './MascotAvatar';

interface CompanionSceneProps {
  stage: MascotStage;
  color: string;
}

function PersonSilhouette({ size = 130 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 140 140" role="presentation" aria-hidden>
      {/* Fixed light backdrop so this always has good contrast, in both
          light and dark mode, matching the mascot's photographed stages. */}
      <circle cx="70" cy="70" r="66" fill="#E9F2E6" />
      <ellipse cx="70" cy="118" rx="30" ry="6" fill="#24332A" opacity="0.08" />

      {/* seated, cross-legged, meditating */}
      <path d="M40 108c-6-10-4-20 6-24 8-3 14 2 16 8" fill="#3F6B58" stroke="#24332A" strokeWidth="2" />
      <path d="M100 108c6-10 4-20-6-24-8-3-14 2-16 8" fill="#3F6B58" stroke="#24332A" strokeWidth="2" />
      <ellipse cx="70" cy="112" rx="9" ry="7" fill="#3F6B58" stroke="#24332A" strokeWidth="2" />

      <path d="M42 100c-4-24 8-42 28-42s32 18 28 42c-16 8-40 8-56 0Z" fill="#3F6B58" stroke="#24332A" strokeWidth="2" />
      <ellipse cx="70" cy="88" rx="14" ry="18" fill="white" opacity="0.9" />

      <path d="M44 76c-8 6-12 14-10 22" stroke="#3F6B58" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M96 76c8 6 12 14 10 22" stroke="#3F6B58" strokeWidth="9" strokeLinecap="round" fill="none" />
      <circle cx="34" cy="99" r="6.5" fill="#3F6B58" stroke="#24332A" strokeWidth="1.6" />
      <circle cx="106" cy="99" r="6.5" fill="#3F6B58" stroke="#24332A" strokeWidth="1.6" />

      <circle cx="70" cy="42" r="22" fill="#3F6B58" stroke="#24332A" strokeWidth="2" />
      <ellipse cx="70" cy="49" rx="13" ry="10" fill="white" opacity="0.9" />
      <path d="M62 45q2 4 4 0" stroke="#24332A" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M74 45q2 4 4 0" stroke="#24332A" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M64 52c3 3 9 3 12 0" stroke="#24332A" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <ellipse cx="58" cy="50" rx="5" ry="3.5" fill="#F5B9A6" opacity="0.7" />
      <ellipse cx="82" cy="50" rx="5" ry="3.5" fill="#F5B9A6" opacity="0.7" />
      <path d="M62 22c3-6 13-6 16 0" stroke="#24332A" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function CompanionScene({ stage, color }: CompanionSceneProps) {
  return (
    <div className="flex items-end justify-center gap-3">
      <PersonSilhouette size={130} />
      <MascotAvatar stage={stage} color={color} size={110} />
    </div>
  );
}
