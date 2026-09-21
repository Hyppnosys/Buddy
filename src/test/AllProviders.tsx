import type { ReactNode } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { SettingsProvider } from '../context/SettingsContext';
import { SessionsProvider } from '../context/SessionsContext';
import { MascotProvider } from '../context/MascotContext';
import { ToastProvider } from '../context/ToastContext';

export function AllProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SettingsProvider>
        <SessionsProvider>
          <MascotProvider>
            <ToastProvider>{children}</ToastProvider>
          </MascotProvider>
        </SessionsProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
