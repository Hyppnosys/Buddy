import { createContext, useMemo, type ReactNode } from 'react';
import type { Friend } from '../types/social';
import type { PublicUser } from '../types/user';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAuth } from '../hooks/useAuth';
import { STORAGE_KEYS, scopedKey } from '../services/storage';

interface FriendsContextValue {
  friends: Friend[];
  addFriend: (user: PublicUser) => void;
  removeFriend: (id: string) => void;
  isFriend: (userId: string) => boolean;
}

export const FriendsContext = createContext<FriendsContextValue | null>(null);

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const SEED_PALETTE = ['#3F6B58', '#C98A4B', '#4C7F92', '#4F9D74', '#B4544A'];

export function FriendsProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [friends, setFriends] = useLocalStorage<Friend[]>(
    scopedKey(STORAGE_KEYS.friends, currentUser?.id ?? null),
    []
  );

  const value = useMemo<FriendsContextValue>(
    () => ({
      friends,
      addFriend: (user) => {
        if (friends.some((f) => f.userId === user.id)) return;
        const friend: Friend = {
          id: createId(),
          userId: user.id,
          name: user.name,
          avatarDataUrl: user.avatarDataUrl,
          colorSeed: SEED_PALETTE[friends.length % SEED_PALETTE.length],
          status: 'accepted',
          addedAt: new Date().toISOString(),
        };
        setFriends((prev) => [...prev, friend]);
      },
      removeFriend: (id) => setFriends((prev) => prev.filter((f) => f.id !== id)),
      isFriend: (userId) => friends.some((f) => f.userId === userId),
    }),
    [friends, setFriends]
  );

  return <FriendsContext.Provider value={value}>{children}</FriendsContext.Provider>;
}
