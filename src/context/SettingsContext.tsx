import { createContext, useMemo, type ReactNode } from 'react';
import type { UserSettings } from '../types/settings';
import type { TimerSettings } from '../types/timer';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../services/storage';

export const DEFAULT_USER_SETTINGS: UserSettings = {
  theme: 'light',
  animationsEnabled: true,
  notificationsEnabled: false,
  distractionFreeEnabled: false,
  showMascotOnDashboard: true,
  sound: {
    enabled: true,
    volume: 0.6,
    activeSoundId: null,
  },
};

export const DEFAULT_TIMER_SETTINGS: TimerSettings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  sessionsBeforeLongBreak: 4,
  autoStartNext: false,
};

interface SettingsContextValue {
  settings: UserSettings;
  updateSettings: (updater: UserSettings | ((prev: UserSettings) => UserSettings)) => void;
  timerSettings: TimerSettings;
  updateTimerSettings: (
    updater: TimerSettings | ((prev: TimerSettings) => TimerSettings)
  ) => void;
}

export const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, updateSettings] = useLocalStorage<UserSettings>(
    STORAGE_KEYS.settings,
    DEFAULT_USER_SETTINGS
  );
  const [timerSettings, updateTimerSettings] = useLocalStorage<TimerSettings>(
    STORAGE_KEYS.timerSettings,
    DEFAULT_TIMER_SETTINGS
  );

  const value = useMemo(
    () => ({ settings, updateSettings, timerSettings, updateTimerSettings }),
    [settings, updateSettings, timerSettings, updateTimerSettings]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}
