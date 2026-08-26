import { createContext, useMemo, type ReactNode } from 'react';
import type { Friend } from '../types/social';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAuth } from '../hooks/useAuth';
import { STORAGE_KEYS, scopedKey } from '../services/storage';

interface FriendsContextValue {
  friends: Friend[];
  addFriend: (name: string) => void;
  removeFriend: (id: string) => void;
}

export const FriendsContext = createContext<FriendsContextValue | null>(null);

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const SEED_PALETTE = ['#3F6B58', '#C98A4B', '#4C7F92', '#7C6FB0', '#B4544A'];

export function FriendsProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [friends, setFriends] = useLocalStorage<Friend[]>(
    scopedKey(STORAGE_KEYS.friends, currentUser?.id ?? null),
    []
  );

  const value = useMemo<FriendsContextValue>(
    () => ({
      friends,
      addFriend: (name) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        const friend: Friend = {
          id: createId(),
          name: trimmed,
          colorSeed: SEED_PALETTE[friends.length % SEED_PALETTE.length],
          addedAt: new Date().toISOString(),
        };
        setFriends((prev) => [...prev, friend]);
      },
      removeFriend: (id) => setFriends((prev) => prev.filter((f) => f.id !== id)),
    }),
    [friends, setFriends]
  );

  return <FriendsContext.Provider value={value}>{children}</FriendsContext.Provider>;
}
