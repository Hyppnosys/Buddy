export type Theme = 'light' | 'dark';

export interface SoundSettings {
  enabled: boolean;
  volume: number; // 0 to 1
  activeSoundId: string | null;
}

export interface UserSettings {
  theme: Theme;
  animationsEnabled: boolean;
  notificationsEnabled: boolean;
  distractionFreeEnabled: boolean;
  sound: SoundSettings;
}
