export interface Friend {
  id: string;
  name: string;
  colorSeed: string;
  addedAt: string;
}

export type MascotStage = 'egg' | 'hatchling' | 'young' | 'grown';

export interface MascotActivityLog {
  id: string;
  reason: string;
  points: number;
  at: string;
  by: string; // friend id, or 'you'
}

export interface MascotState {
  name: string;
  xp: number;
  log: MascotActivityLog[];
  sharedWithFriendIds: string[];
  color: string;
}
