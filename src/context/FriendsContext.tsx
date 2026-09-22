import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Friend } from '../types/social';
import type { PublicUser } from '../types/user';
import { useAuth } from '../hooks/useAuth';
import {
  acceptFriendRequest,
  fetchFriends,
  removeFriendship,
  searchProfiles,
  sendFriendRequest as sendFriendRequestDb,
} from '../services/friendsDb';

export type ConnectionStatus = 'none' | 'accepted' | 'pending_sent' | 'pending_received';

interface FriendsContextValue {
  /** Amizades já aceitas dos dois lados. */
  friends: Friend[];
  /** Pedidos que OUTRAS pessoas te enviaram, aguardando você aceitar/recusar. */
  incomingRequests: Friend[];
  /** Pedidos que VOCÊ enviou, aguardando a outra pessoa aceitar. */
  outgoingRequests: Friend[];
  isLoading: boolean;
  searchUsers: (query: string) => Promise<PublicUser[]>;
  sendFriendRequest: (user: PublicUser) => Promise<void>;
  acceptRequest: (friendshipId: string) => Promise<void>;
  declineRequest: (friendshipId: string) => Promise<void>;
  removeFriend: (friendshipId: string) => Promise<void>;
  connectionStatus: (userId: string) => ConnectionStatus;
}

export const FriendsContext = createContext<FriendsContextValue | null>(null);

/**
 * Amizades agora vivem no banco de dados (tabela `friendships`, ligada aos
 * usuários pelos seus ids — veja supabase/schema.sql), com um fluxo real de
 * pedido -> pendente -> aceito/recusado, em vez de "adicionar" direto como
 * antes. A amizade de um usuário nunca aparece para outro: cada linha só é
 * lida por quem participa dela (RLS no banco) e o filtro por `userId` aqui
 * garante o mesmo isolamento no cliente.
 */
export function FriendsProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [all, setAll] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const reload = useCallback(async () => {
    if (!currentUser) {
      setAll([]);
      return;
    }
    setIsLoading(true);
    try {
      setAll(await fetchFriends(currentUser.id));
    } catch (error) {
      console.warn('[friends] Falha ao carregar amizades do banco de dados.', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    reload();
  }, [reload]);

  const friends = useMemo(() => all.filter((f) => f.status === 'accepted'), [all]);
  const incomingRequests = useMemo(() => all.filter((f) => f.status === 'pending_received'), [all]);
  const outgoingRequests = useMemo(() => all.filter((f) => f.status === 'pending_sent'), [all]);

  const value = useMemo<FriendsContextValue>(
    () => ({
      friends,
      incomingRequests,
      outgoingRequests,
      isLoading,
      searchUsers: (query) => (currentUser ? searchProfiles(query, currentUser.id) : Promise.resolve([])),
      sendFriendRequest: async (user) => {
        if (!currentUser) return;
        await sendFriendRequestDb(currentUser.id, user.id);
        await reload();
      },
      acceptRequest: async (friendshipId) => {
        await acceptFriendRequest(friendshipId);
        await reload();
      },
      declineRequest: async (friendshipId) => {
        await removeFriendship(friendshipId);
        await reload();
      },
      removeFriend: async (friendshipId) => {
        await removeFriendship(friendshipId);
        await reload();
      },
      connectionStatus: (userId) => all.find((f) => f.userId === userId)?.status ?? 'none',
    }),
    [friends, incomingRequests, outgoingRequests, isLoading, currentUser, all, reload]
  );

  return <FriendsContext.Provider value={value}>{children}</FriendsContext.Provider>;
}
