import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AuthFormValues, StoredCredential, User } from '../types/user';
import { readStorage, writeStorage, STORAGE_KEYS } from '../services/storage';

interface AuthContextValue {
  currentUser: User | null;
  isLoading: boolean;
  signUp: (values: AuthFormValues) => { ok: true } | { ok: false; error: string };
  logIn: (values: AuthFormValues) => { ok: true } | { ok: false; error: string };
  logOut: () => void;
  updateProfile: (updater: (prev: User) => User) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => readStorage(STORAGE_KEYS.users, []));
  const [credentials, setCredentials] = useState<StoredCredential[]>(() =>
    readStorage(STORAGE_KEYS.credentials, [])
  );
  const [sessionUserId, setSessionUserId] = useState<string | null>(() =>
    readStorage<string | null>(STORAGE_KEYS.sessionUserId, null)
  );
  const [isLoading] = useState(false);

  useEffect(() => writeStorage(STORAGE_KEYS.users, users), [users]);
  useEffect(() => writeStorage(STORAGE_KEYS.credentials, credentials), [credentials]);
  useEffect(() => writeStorage(STORAGE_KEYS.sessionUserId, sessionUserId), [sessionUserId]);

  const currentUser = useMemo(
    () => users.find((u) => u.id === sessionUserId) ?? null,
    [users, sessionUserId]
  );

  const signUp = useCallback(
    (values: AuthFormValues): { ok: true } | { ok: false; error: string } => {
      const email = values.email.trim().toLowerCase();
      const name = values.name?.trim() ?? '';

      if (!name) return { ok: false, error: 'Digite seu nome.' };
      if (!isValidEmail(email)) return { ok: false, error: 'Digite um e-mail válido.' };
      if (values.password.length < 6) return { ok: false, error: 'A senha precisa ter ao menos 6 caracteres.' };
      if (credentials.some((c) => c.email === email)) {
        return { ok: false, error: 'Já existe uma conta com esse e-mail neste dispositivo.' };
      }

      const user: User = {
        id: createId(),
        name,
        email,
        avatarDataUrl: null,
        bio: '',
        createdAt: new Date().toISOString(),
      };

      setUsers((prev) => [...prev, user]);
      setCredentials((prev) => [...prev, { userId: user.id, email, password: values.password }]);
      setSessionUserId(user.id);
      return { ok: true };
    },
    [credentials]
  );

  const logIn = useCallback(
    (values: AuthFormValues): { ok: true } | { ok: false; error: string } => {
      const email = values.email.trim().toLowerCase();
      const match = credentials.find((c) => c.email === email);
      if (!match || match.password !== values.password) {
        return { ok: false, error: 'E-mail ou senha incorretos.' };
      }
      setSessionUserId(match.userId);
      return { ok: true };
    },
    [credentials]
  );

  const logOut = useCallback(() => setSessionUserId(null), []);

  const updateProfile = useCallback(
    (updater: (prev: User) => User) => {
      if (!sessionUserId) return;
      setUsers((prev) => prev.map((u) => (u.id === sessionUserId ? updater(u) : u)));
    },
    [sessionUserId]
  );

  const value = useMemo(
    () => ({ currentUser, isLoading, signUp, logIn, logOut, updateProfile }),
    [currentUser, isLoading, signUp, logIn, logOut, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
