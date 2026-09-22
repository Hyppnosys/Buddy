import { supabase } from './supabaseClient';
import type { Friend } from '../types/social';
import type { PublicUser } from '../types/user';

interface ProfileRow {
  id: string;
  name: string;
  avatar_data_url: string | null;
}

interface FriendshipRow {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: 'pending' | 'accepted';
  created_at: string;
  requester: ProfileRow;
  addressee: ProfileRow;
}

const SEED_PALETTE = ['#3F6B58', '#C98A4B', '#4C7F92', '#4F9D74', '#B4544A'];

/** Cor estável por usuário (sempre a mesma para a mesma pessoa), sem precisar guardar nada a mais no banco. */
function colorSeedFor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
  return SEED_PALETTE[hash % SEED_PALETTE.length];
}

function rowToFriend(row: FriendshipRow, myUserId: string): Friend {
  const iAmRequester = row.requester_id === myUserId;
  const other = iAmRequester ? row.addressee : row.requester;
  const status: Friend['status'] = row.status === 'accepted' ? 'accepted' : iAmRequester ? 'pending_sent' : 'pending_received';
  return {
    id: row.id,
    userId: other.id,
    name: other.name,
    avatarDataUrl: other.avatar_data_url,
    colorSeed: colorSeedFor(other.id),
    status,
    addedAt: row.created_at,
  };
}

/** Todas as amizades (aceitas, pedidos enviados e recebidos) que envolvem esse usuário. */
export async function fetchFriends(userId: string): Promise<Friend[]> {
  const { data, error } = await supabase
    .from('friendships')
    .select(
      '*, requester:profiles!friendships_requester_id_fkey(id,name,avatar_data_url), addressee:profiles!friendships_addressee_id_fkey(id,name,avatar_data_url)'
    )
    .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return ((data as unknown as FriendshipRow[]) ?? []).map((row) => rowToFriend(row, userId));
}

export async function searchProfiles(query: string, excludeUserId: string): Promise<PublicUser[]> {
  const term = query.trim();
  if (term.length < 2) return [];
  const { data, error } = await supabase
    .from('profiles')
    .select('id,name,avatar_data_url')
    .neq('id', excludeUserId)
    .or(`name.ilike.%${term}%,email.ilike.%${term}%`)
    .limit(20);
  if (error) throw error;
  return ((data as ProfileRow[]) ?? []).map((row) => ({ id: row.id, name: row.name, avatarDataUrl: row.avatar_data_url }));
}

export async function sendFriendRequest(requesterId: string, addresseeId: string): Promise<void> {
  const { error } = await supabase.from('friendships').insert({ requester_id: requesterId, addressee_id: addresseeId, status: 'pending' });
  if (error) throw error;
}

export async function acceptFriendRequest(friendshipId: string): Promise<void> {
  const { error } = await supabase.from('friendships').update({ status: 'accepted' }).eq('id', friendshipId);
  if (error) throw error;
}

/** Recusa um pedido pendente OU desfaz uma amizade já aceita (mesma operação: apagar a linha). */
export async function removeFriendship(friendshipId: string): Promise<void> {
  const { error } = await supabase.from('friendships').delete().eq('id', friendshipId);
  if (error) throw error;
}
