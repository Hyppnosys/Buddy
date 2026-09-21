export type Theme = 'light' | 'dark';

export interface SoundSettings {
  enabled: boolean;
  volume: number;
  activeSoundId: string | null;
}

export interface UserSettings {
  theme: Theme;
  animationsEnabled: boolean;
  notificationsEnabled: boolean;
  distractionFreeEnabled: boolean;
  sound: SoundSettings;
}
