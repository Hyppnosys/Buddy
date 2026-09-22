import { describe, expect, it } from 'vitest';
import {
  applyActivityPoints,
  INITIAL_MASCOT_PROGRESS,
  nextStageInfo,
  type MascotProgressState,
} from './mascotProgress';

describe('applyActivityPoints', () => {
  it('starts every new mascot as Bebê with an empty bar (0/20)', () => {
    expect(INITIAL_MASCOT_PROGRESS.stage).toBe('hatchling');
    expect(INITIAL_MASCOT_PROGRESS.phaseProgress).toBe(0);
    expect(nextStageInfo(INITIAL_MASCOT_PROGRESS)).toEqual({ stage: 'young', label: 'Jovem', toGo: 20 });
  });

  it('fills the Bebê bar without evolving before reaching the goal', () => {
    const s1 = applyActivityPoints(INITIAL_MASCOT_PROGRESS, 3);
    expect(s1).toMatchObject({ stage: 'hatchling', phaseProgress: 3, extraPoints: 0, totalXp: 3 });
    const s2 = applyActivityPoints(s1, 5);
    expect(s2).toMatchObject({ stage: 'hatchling', phaseProgress: 8, totalXp: 8 });
  });

  it('evolves Bebê -> Jovem exactly at 20/20 and resets the bar to 0 (not staying full)', () => {
    const almost: MascotProgressState = { ...INITIAL_MASCOT_PROGRESS, phaseProgress: 17, totalXp: 17 };
    const evolved = applyActivityPoints(almost, 3);
    expect(evolved.stage).toBe('young');
    expect(evolved.phaseProgress).toBe(0);
    expect(evolved.completedPhases).toEqual(['hatchling']);
    expect(evolved.totalXp).toBe(20);
  });

  it('carries leftover points past the goal into the new bar instead of discarding them', () => {
    const almost: MascotProgressState = { ...INITIAL_MASCOT_PROGRESS, phaseProgress: 17, totalXp: 17 };
    const evolved = applyActivityPoints(almost, 8); // 17 + 8 = 25 -> 20 used, 5 left over
    expect(evolved.stage).toBe('young');
    expect(evolved.phaseProgress).toBe(5);
    expect(evolved.totalXp).toBe(25);
  });

  it('evolves Jovem -> Adulto at 40/40 in the Jovem bar and resets again', () => {
    const almostGrown: MascotProgressState = {
      stage: 'young',
      phaseProgress: 38,
      extraPoints: 0,
      totalXp: 58,
      completedPhases: ['hatchling'],
    };
    const evolved = applyActivityPoints(almostGrown, 2);
    expect(evolved.stage).toBe('grown');
    expect(evolved.phaseProgress).toBe(0);
    expect(evolved.completedPhases).toEqual(['hatchling', 'young']);
    expect(evolved.totalXp).toBe(60);
  });

  it('never evolves past Adulto — extra points accumulate forever instead', () => {
    const grown: MascotProgressState = {
      stage: 'grown',
      phaseProgress: 0,
      extraPoints: 12,
      totalXp: 72,
      completedPhases: ['hatchling', 'young'],
    };
    const s1 = applyActivityPoints(grown, 5);
    expect(s1).toEqual({ stage: 'grown', phaseProgress: 0, extraPoints: 17, totalXp: 77, completedPhases: ['hatchling', 'young'] });
    const s2 = applyActivityPoints(s1, 1000);
    expect(s2.stage).toBe('grown');
    expect(s2.extraPoints).toBe(1017);
  });

  it('handles a single activity big enough to cross two phase boundaries at once', () => {
    const evolved = applyActivityPoints(INITIAL_MASCOT_PROGRESS, 70); // 20 (bebê) + 40 (jovem) + 10 extra
    expect(evolved.stage).toBe('grown');
    expect(evolved.phaseProgress).toBe(0);
    expect(evolved.extraPoints).toBe(10);
    expect(evolved.completedPhases).toEqual(['hatchling', 'young']);
    expect(evolved.totalXp).toBe(70);
  });

  it('keeps totalXp as an ever-increasing lifetime counter, unaffected by bar resets', () => {
    let state = INITIAL_MASCOT_PROGRESS;
    for (const points of [3, 2, 5, 4, 6, 10, 15, 8, 20]) {
      state = applyActivityPoints(state, points);
    }
    const sum = 3 + 2 + 5 + 4 + 6 + 10 + 15 + 8 + 20;
    expect(state.totalXp).toBe(sum);
  });
});

describe('nextStageInfo', () => {
  it('reports the remaining points and label for the next stage', () => {
    expect(nextStageInfo({ stage: 'hatchling', phaseProgress: 12, extraPoints: 0, totalXp: 12, completedPhases: [] })).toEqual({
      stage: 'young',
      label: 'Jovem',
      toGo: 8,
    });
    expect(nextStageInfo({ stage: 'young', phaseProgress: 10, extraPoints: 0, totalXp: 30, completedPhases: ['hatchling'] })).toEqual({
      stage: 'grown',
      label: 'Adulto',
      toGo: 30,
    });
  });

  it('returns null once fully grown — there is no next stage', () => {
    expect(nextStageInfo({ stage: 'grown', phaseProgress: 0, extraPoints: 40, totalXp: 100, completedPhases: ['hatchling', 'young'] })).toBeNull();
  });
});
