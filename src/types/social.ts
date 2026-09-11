export interface Friend {
  id: string;
  userId: string;
  name: string;
  avatarDataUrl: string | null;
  colorSeed: string;
  status: 'accepted' | 'pending_sent' | 'pending_received';
  addedAt: string;
}

export type MascotStage = 'egg' | 'hatchling' | 'young' | 'grown';

export interface MascotActivityLog {
  id: string;
  reason: string;
  points: number;
  at: string;
  by: string;
}

export interface MascotState {
  name: string;
  xp: number;
  log: MascotActivityLog[];
  sharedWithFriendIds: string[];
  color: string;
}
