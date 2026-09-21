import { describe, expect, it } from 'vitest';
import { nextStageInfo, stageForXp } from './MascotContext';

describe('stageForXp', () => {
  it('starts as hatchling (bebê)', () => {
    expect(stageForXp(0)).toBe('hatchling');
    expect(stageForXp(39)).toBe('hatchling');
  });
  it('grows young at the young threshold (2x the base unit)', () => {
    expect(stageForXp(40)).toBe('young');
    expect(stageForXp(59)).toBe('young');
  });
  it('reaches grown (adulto) at the grown threshold (3x the base unit)', () => {
    expect(stageForXp(60)).toBe('grown');
    expect(stageForXp(500)).toBe('grown');
  });
});

describe('nextStageInfo', () => {
  it('reports how many points remain for the next stage', () => {
    expect(nextStageInfo(0)).toEqual({ stage: 'young', xpToGo: 40 });
    expect(nextStageInfo(50)).toEqual({ stage: 'grown', xpToGo: 10 });
  });
  it('returns null once fully grown', () => {
    expect(nextStageInfo(60)).toBeNull();
    expect(nextStageInfo(1000)).toBeNull();
  });
});
