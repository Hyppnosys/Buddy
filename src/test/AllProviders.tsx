import type { ReactNode } from 'react';
import { SettingsProvider } from '../context/SettingsContext';
import { SessionsProvider } from '../context/SessionsContext';
import { ToastProvider } from '../context/ToastContext';

export function AllProviders({ children }: { children: ReactNode }) {
  return (
    <SettingsProvider>
      <SessionsProvider>
        <ToastProvider>{children}</ToastProvider>
      </SessionsProvider>
    </SettingsProvider>
  );
}
