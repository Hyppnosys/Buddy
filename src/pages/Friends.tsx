import { useState, type FormEvent } from 'react';
import { UserPlus, Users, X } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useFriends } from '../hooks/useFriends';

function FriendAvatar({ name, color }: { name: string; color: string }) {
  return (
    <div
      className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold shrink-0"
      style={{ backgroundColor: color }}
      aria-hidden
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export function Friends() {
  const { friends, addFriend, removeFriend } = useFriends();
  const [name, setName] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addFriend(name);
    setName('');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8 animate-fade-up">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold">Amigos</h1>
        <p className="text-(--color-ink-muted) mt-1.5">
          Adicione pessoas para acompanhar sua rotina e cuidar do mascote em conjunto.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome do seu amigo"
            className="flex-1 rounded-xl border border-(--color-border) bg-(--color-bg) px-4 py-2.5 text-sm"
          />
          <Button type="submit" icon={<UserPlus size={16} />} disabled={!name.trim()}>
            Adicionar
          </Button>
        </form>
        <p className="text-xs text-(--color-ink-muted) mt-3">
          As conexões ficam salvas neste dispositivo. Convites reais entre contas exigiriam um
          servidor — a estrutura do app já está pronta para isso no futuro.
        </p>
      </Card>

      {friends.length === 0 ? (
        <Card className="text-center py-10 flex flex-col items-center gap-2">
          <Users size={28} className="text-(--color-ink-muted)" />
          <p className="text-sm text-(--color-ink-muted)">
            Você ainda não adicionou nenhum amigo.
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {friends.map((friend) => (
            <Card key={friend.id} className="flex items-center gap-3">
              <FriendAvatar name={friend.name} color={friend.colorSeed} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm truncate">{friend.name}</p>
                <p className="text-xs text-(--color-ink-muted)">Conectado(a)</p>
              </div>
              <button
                onClick={() => removeFriend(friend.id)}
                aria-label={`Remover ${friend.name}`}
                className="p-2 rounded-full text-(--color-ink-muted) hover:text-(--color-danger) hover:bg-(--color-danger)/10 transition-colors"
              >
                <X size={16} />
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
