import { useEffect } from 'react';
import { useSettings } from './useSettings';

export function useTheme() {
  const { settings, updateSettings } = useSettings();

  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [settings.theme]);

  const toggleTheme = () => {
    updateSettings((prev) => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
  };

  return { theme: settings.theme, toggleTheme };
}
