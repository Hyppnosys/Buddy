import { describe, expect, it } from 'vitest';
import { nextStageInfo, stageForXp } from './MascotContext';

describe('stageForXp', () => {
  it('starts as hatchling (bebê)', () => {
    expect(stageForXp(0)).toBe('hatchling');
    expect(stageForXp(11)).toBe('hatchling');
  });
  it('grows young at the young threshold', () => {
    expect(stageForXp(12)).toBe('young');
    expect(stageForXp(29)).toBe('young');
  });
  it('reaches grown (adulto) at the grown threshold', () => {
    expect(stageForXp(30)).toBe('grown');
    expect(stageForXp(500)).toBe('grown');
  });
});

describe('nextStageInfo', () => {
  it('reports how many points remain for the next stage', () => {
    expect(nextStageInfo(0)).toEqual({ stage: 'young', xpToGo: 12 });
    expect(nextStageInfo(20)).toEqual({ stage: 'grown', xpToGo: 10 });
  });
  it('returns null once fully grown', () => {
    expect(nextStageInfo(30)).toBeNull();
    expect(nextStageInfo(1000)).toBeNull();
  });
});
