export interface Friend {
  id: string;
  /** References the real account id from AuthContext's user list. */
  userId: string;
  name: string;
  avatarDataUrl: string | null;
  colorSeed: string;
  /** 'accepted' is used today (adding is immediate); the other states are
   * kept ready for a future request/accept flow without a data migration. */
  status: 'accepted' | 'pending_sent' | 'pending_received';
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
