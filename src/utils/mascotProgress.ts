import type { MascotStage } from '../types/social';

export const STAGE_ORDER: MascotStage[] = ['hatchling', 'young', 'grown'];

export const STAGE_LABEL: Record<MascotStage, string> = {
  hatchling: 'Bebê',
  young: 'Jovem',
  grown: 'Adulto',
};

/**
 * Points needed to fill the CURRENT phase's bar and evolve to the next
 * stage. There is no goal for 'grown': once the mascote is Adulto, points
 * keep accumulating forever as "pontuação extra" instead of triggering
 * another evolution (there is no stage after Adulto).
 */
export const PHASE_GOALS: Record<'hatchling' | 'young', number> = {
  hatchling: 20,
  young: 40,
};

export interface MascotProgressState {
  /** Current evolution stage of the mascot. */
  stage: MascotStage;
  /** Points earned inside the CURRENT phase's bar. Resets on every evolution. */
  phaseProgress: number;
  /** Only grows once `stage === 'grown'` — the "pontuação extra" from item 5/7 of the spec. */
  extraPoints: number;
  /** Lifetime total, never reset by an evolution — kept for stats/history (item 7). */
  totalXp: number;
  /** Phases already completed, in order (e.g. ['hatchling', 'young'] once Adulto). */
  completedPhases: MascotStage[];
}

export const INITIAL_MASCOT_PROGRESS: MascotProgressState = {
  stage: 'hatchling',
  phaseProgress: 0,
  extraPoints: 0,
  totalXp: 0,
  completedPhases: [],
};

export function nextStage(stage: MascotStage): MascotStage | null {
  const idx = STAGE_ORDER.indexOf(stage);
  return STAGE_ORDER[idx + 1] ?? null;
}

export function phaseGoalFor(stage: MascotStage): number | null {
  return stage === 'grown' ? null : PHASE_GOALS[stage];
}

/**
 * Applies points earned from a completed activity (check-in, diário,
 * respiração/relaxamento, foco, yoga...) to the mascot's progress,
 * handling phase evolution exactly as requested:
 *
 *  - Bebê and Jovem each have their own bar (`PHASE_GOALS`). Filling it
 *    evolves the mascot to the next stage and the bar goes back to 0 —
 *    it does NOT stay full. Any points earned *past* the goal in the same
 *    activity are carried over into the new bar (nothing is lost/discarded).
 *  - Adulto has no bar to fill — from then on, every point earned just
 *    accumulates as `extraPoints` ("pontuação extra") forever. There is no
 *    evolution after Adulto.
 *  - `totalXp` is a separate, ever-increasing lifetime counter, untouched
 *    by any of the resets above.
 *
 * A single very large activity can, in theory, cross more than one phase
 * boundary at once — the loop below handles that correctly (e.g. Bebê with
 * 0/20 receiving +70 points ends up Adulto with 10 extra points).
 */
export function applyActivityPoints(state: MascotProgressState, points: number): MascotProgressState {
  if (points === 0) return state;

  let stage = state.stage;
  let remaining = state.phaseProgress + points;
  let extraPoints = state.extraPoints;
  let completedPhases = state.completedPhases;
  const totalXp = state.totalXp + points;

  if (stage === 'grown') {
    return { stage, phaseProgress: state.phaseProgress, extraPoints: extraPoints + points, totalXp, completedPhases };
  }

  while (stage !== 'grown') {
    const goal = PHASE_GOALS[stage as 'hatchling' | 'young'];
    if (remaining < goal) break;
    remaining -= goal;
    completedPhases = [...completedPhases, stage];
    const next = nextStage(stage);
    if (!next) break;
    stage = next;
    if (stage === 'grown') {
      // The bar resets to 0; anything left over becomes the starting extra points.
      extraPoints += remaining;
      remaining = 0;
    }
  }

  return { stage, phaseProgress: remaining, extraPoints, totalXp, completedPhases };
}

export function nextStageInfo(state: MascotProgressState): { stage: MascotStage; label: string; toGo: number } | null {
  const goal = phaseGoalFor(state.stage);
  if (goal === null) return null;
  const next = nextStage(state.stage);
  if (!next) return null;
  return { stage: next, label: STAGE_LABEL[next], toGo: Math.max(0, goal - state.phaseProgress) };
}
