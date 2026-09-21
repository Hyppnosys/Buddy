import { describe, expect, it } from 'vitest';
import { nextStageInfo, stageForXp } from './MascotContext';

describe('stageForXp', () => {
  it('starts as an egg', () => {
    expect(stageForXp(0)).toBe('egg');
    expect(stageForXp(9)).toBe('egg');
  });
  it('hatches at the hatchling threshold', () => {
    expect(stageForXp(10)).toBe('hatchling');
    expect(stageForXp(29)).toBe('hatchling');
  });
  it('grows young then fully grown at their thresholds', () => {
    expect(stageForXp(30)).toBe('young');
    expect(stageForXp(69)).toBe('young');
    expect(stageForXp(70)).toBe('grown');
    expect(stageForXp(500)).toBe('grown');
  });
});

describe('nextStageInfo', () => {
  it('reports how many points remain for the next stage', () => {
    expect(nextStageInfo(0)).toEqual({ stage: 'hatchling', xpToGo: 10 });
    expect(nextStageInfo(25)).toEqual({ stage: 'young', xpToGo: 5 });
  });
  it('returns null once fully grown', () => {
    expect(nextStageInfo(70)).toBeNull();
    expect(nextStageInfo(1000)).toBeNull();
  });
});
