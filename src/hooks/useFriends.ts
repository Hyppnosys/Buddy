import { useContext } from 'react';
import { FriendsContext } from '../context/FriendsContext';

export function useFriends() {
  const ctx = useContext(FriendsContext);
  if (!ctx) throw new Error('useFriends deve ser usado dentro de <FriendsProvider>.');
  return ctx;
}
