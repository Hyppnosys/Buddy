import { useEffect, useState } from 'react';
import { Search, UserPlus, Users, X } from 'lucide-react';
import { Card } from '../components/Card';
import { useFriends } from '../hooks/useFriends';
import { useAuth } from '../hooks/useAuth';
import type { PublicUser } from '../types/user';

function PersonAvatar({ name, avatarDataUrl, color }: { name: string; avatarDataUrl: string | null; color?: string }) {
  if (avatarDataUrl) return <img src={avatarDataUrl} alt="" className="w-11 h-11 rounded-full object-cover shrink-0" />;
  return (
    <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold shrink-0" style={{ backgroundColor: color ?? 'var(--color-focus)' }} aria-hidden>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export function Friends() {
  const { friends, addFriend, removeFriend, isFriend } = useFriends();
  const { searchUsers } = useAuth();

  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<PublicUser[] | null>(null);

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setResults(null);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const timeout = window.setTimeout(() => {
      setResults(searchUsers(term));
      setIsSearching(false);
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [query, searchUsers]);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8 animate-fade-up">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold">Amigos</h1>
        <p className="text-(--color-ink-muted) mt-1.5">Busque outras pessoas cadastradas no app e conecte-se para cuidar do mascote junto.</p>
      </div>

      <Card>
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--color-ink-muted)" />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nome ou e-mail" className="w-full rounded-xl border border-(--color-border) bg-(--color-bg) pl-10 pr-4 py-2.5 text-sm" />
        </div>

        <div className="mt-4">
          {query.trim().length < 2 && <p className="text-xs text-(--color-ink-muted)">Digite pelo menos 2 letras para buscar entre as contas cadastradas neste dispositivo.</p>}
          {query.trim().length >= 2 && isSearching && <p className="text-sm text-(--color-ink-muted)">Buscando...</p>}
          {query.trim().length >= 2 && !isSearching && results !== null && results.length === 0 && <p className="text-sm text-(--color-ink-muted)">Nenhum usuário encontrado.</p>}
          {query.trim().length >= 2 && !isSearching && results !== null && results.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-(--color-ink-muted) uppercase tracking-wide">Usuários encontrados</p>
              {results.map((user) => {
                const alreadyFriend = isFriend(user.id);
                return (
                  <div key={user.id} className="flex items-center gap-3 py-1.5">
                    <PersonAvatar name={user.name} avatarDataUrl={user.avatarDataUrl} />
                    <span className="flex-1 text-sm font-medium truncate">{user.name}</span>
                    <button onClick={() => addFriend(user)} disabled={alreadyFriend} className="flex items-center gap-1.5 text-sm font-semibold text-(--color-focus) disabled:text-(--color-ink-muted) disabled:cursor-default">
                      <UserPlus size={15} />
                      {alreadyFriend ? 'Já é seu amigo' : 'Adicionar'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      {friends.length === 0 ? (
        <Card className="text-center py-10 flex flex-col items-center gap-2">
          <Users size={28} className="text-(--color-ink-muted)" />
          <p className="text-sm text-(--color-ink-muted)">Você ainda não tem amigos conectados. Use a busca acima para encontrar alguém.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          <h2 className="font-display text-lg font-semibold">Seus amigos</h2>
          {friends.map((friend) => (
            <Card key={friend.id} className="flex items-center gap-3">
              <PersonAvatar name={friend.name} avatarDataUrl={friend.avatarDataUrl} color={friend.colorSeed} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm truncate">{friend.name}</p>
                <p className="text-xs text-(--color-ink-muted)">Conectado(a)</p>
              </div>
              <button onClick={() => removeFriend(friend.id)} aria-label={`Remover ${friend.name}`} className="p-2 rounded-full text-(--color-ink-muted) hover:text-(--color-danger) hover:bg-(--color-danger)/10 transition-colors">
                <X size={16} />
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
