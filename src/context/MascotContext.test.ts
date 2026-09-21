import { describe, expect, it } from 'vitest';
import { nextStageInfo, stageForXp } from './MascotContext';

describe('stageForXp', () => {
  it('starts as hatchling (bebê)', () => {
    expect(stageForXp(0)).toBe('hatchling');
    expect(stageForXp(19)).toBe('hatchling');
  });
  it('grows young at 20 XP', () => {
    expect(stageForXp(20)).toBe('young');
    expect(stageForXp(59)).toBe('young');
  });
  it('reaches grown (adulto) at 60 XP', () => {
    expect(stageForXp(60)).toBe('grown');
    expect(stageForXp(500)).toBe('grown');
  });
});

describe('nextStageInfo', () => {
  it('reports how many points remain for the next stage', () => {
    expect(nextStageInfo(0)).toEqual({ stage: 'young', xpToGo: 20 });
    expect(nextStageInfo(50)).toEqual({ stage: 'grown', xpToGo: 10 });
  });
  it('returns null once fully grown', () => {
    expect(nextStageInfo(60)).toBeNull();
    expect(nextStageInfo(1000)).toBeNull();
  });
});
