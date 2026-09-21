import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { SessionsProvider } from './context/SessionsContext';
import { JournalProvider } from './context/JournalContext';
import { CheckInsProvider } from './context/CheckInsContext';
import { FriendsProvider } from './context/FriendsContext';
import { MascotProvider } from './context/MascotContext';
import { ToastProvider } from './context/ToastContext';
import { ToastStack } from './components/ToastStack';
import { AppLayout } from './components/AppLayout';
import { ProtectedRoute, PublicOnlyRoute } from './components/RouteGuards';
import { useAuth } from './hooks/useAuth';

import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Foco } from './pages/Foco';
import { Journal } from './pages/Journal';
import { CheckIn } from './pages/CheckIn';
import { Relax } from './pages/Relax';
import { Statistics } from './pages/Statistics';
import { Friends } from './pages/Friends';
import { Mascot } from './pages/Mascot';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import type { ReactNode } from 'react';

/**
 * These providers hold data that belongs to the logged-in user. Keying on
 * the user id forces a clean remount (fresh read from scoped localStorage)
 * whenever someone logs in, logs out, or switches accounts on this device.
 */
function UserScopedProviders({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  return (
    <SessionsProvider key={currentUser?.id ?? 'anon'}>
      <JournalProvider key={currentUser?.id ?? 'anon'}>
        <CheckInsProvider key={currentUser?.id ?? 'anon'}>
          <FriendsProvider key={currentUser?.id ?? 'anon'}>
            <MascotProvider key={currentUser?.id ?? 'anon'}>{children}</MascotProvider>
          </FriendsProvider>
        </CheckInsProvider>
      </JournalProvider>
    </SessionsProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <UserScopedProviders>
          <ToastProvider>
            <BrowserRouter>
              <ToastStack />
              <Routes>
                <Route element={<PublicOnlyRoute />}>
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                  <Route element={<AppLayout />}>
                    <Route path="/app" element={<Dashboard />} />
                    <Route path="/app/foco" element={<Foco />} />
                    <Route path="/app/diario" element={<Journal />} />
                    <Route path="/app/checkin" element={<CheckIn />} />
                    <Route path="/app/relaxar" element={<Relax />} />
                    <Route path="/app/estatisticas" element={<Statistics />} />
                    <Route path="/app/amigos" element={<Friends />} />
                    <Route path="/app/mascote" element={<Mascot />} />
                    <Route path="/app/perfil" element={<Profile />} />
                    <Route path="/app/configuracoes" element={<Settings />} />
                  </Route>
                </Route>
              </Routes>
            </BrowserRouter>
          </ToastProvider>
        </UserScopedProviders>
      </SettingsProvider>
    </AuthProvider>
  );
}
