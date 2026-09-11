import { useState } from 'react';
import { Check, Pencil, Users } from 'lucide-react';
import { Card } from '../components/Card';
import { MascotAvatar } from '../components/MascotAvatar';
import { useMascot } from '../hooks/useMascot';
import { useFriends } from '../hooks/useFriends';
import { nextStageInfo, STAGE_LABEL } from '../context/MascotContext';
import { formatClock, formatDayLabel } from '../utils/time';

const COLOR_OPTIONS = ['#3F6B58', '#C98A4B', '#4C7F92', '#4F9D74', '#B4544A'];

export function Mascot() {
  const { mascot, stage, renameMascot, setMascotColor, toggleShareWithFriend } = useMascot();
  const { friends } = useFriends();
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(mascot.name);

  const nextStage = nextStageInfo(mascot.xp);
  const progressPercent = nextStage ? Math.min(100, (mascot.xp / (mascot.xp + nextStage.xpToGo)) * 100) : 100;

  const saveName = () => {
    renameMascot(nameDraft);
    setEditingName(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-6 animate-fade-up">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold">Seu mascote</h1>
        <p className="text-(--color-ink-muted) mt-1.5">Ele evolui conforme você (e seus amigos) completam atividades no app.</p>
      </div>

      <Card className="flex flex-col items-center gap-4 text-center py-8">
        <MascotAvatar stage={stage} color={mascot.color} size={160} />

        {editingName ? (
          <div className="flex items-center gap-2">
            <input autoFocus value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && saveName()} className="rounded-xl border border-(--color-border) bg-(--color-bg) px-3 py-1.5 text-sm text-center font-display font-semibold" />
            <button onClick={saveName} aria-label="Salvar nome" className="p-2 rounded-full bg-(--color-focus) text-white"><Check size={14} /></button>
          </div>
        ) : (
          <button onClick={() => { setNameDraft(mascot.name); setEditingName(true); }} className="flex items-center gap-2 font-display text-xl font-semibold hover:text-(--color-focus) transition-colors">
            {mascot.name}
            <Pencil size={14} className="text-(--color-ink-muted)" />
          </button>
        )}

        <span className="px-3 py-1 rounded-full bg-(--color-focus-soft) text-(--color-focus) text-xs font-semibold">Fase: {STAGE_LABEL[stage]}</span>

        <div className="w-full max-w-xs">
          <div className="h-2.5 rounded-full bg-(--color-surface-alt) overflow-hidden">
            <div className="h-full bg-(--color-focus) transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
          <p className="text-xs text-(--color-ink-muted) mt-2">
            {nextStage ? `${nextStage.xpToGo} pontos para a fase "${STAGE_LABEL[nextStage.stage]}"` : 'Fase máxima alcançada! 🎉'}
          </p>
        </div>
        <p className="text-xs text-(--color-ink-muted)">{mascot.xp} pontos de cuidado no total</p>
      </Card>

      <Card>
        <h2 className="font-display text-lg font-semibold mb-1">Cor do mascote</h2>
        <p className="text-sm text-(--color-ink-muted) mb-4">Escolha a cor que combina com ele.</p>
        <div className="flex gap-3">
          {COLOR_OPTIONS.map((color) => (
            <button key={color} onClick={() => setMascotColor(color)} aria-label={`Cor ${color}`} aria-pressed={mascot.color === color} className="w-9 h-9 rounded-full border-2 transition-transform hover:scale-110" style={{ backgroundColor: color, borderColor: mascot.color === color ? 'var(--color-ink)' : 'transparent' }} />
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-1">
          <Users size={16} className="text-(--color-ink-muted)" />
          <h2 className="font-display text-lg font-semibold">Compartilhar com amigos</h2>
        </div>
        <p className="text-sm text-(--color-ink-muted) mb-4">Amigos marcados aqui aparecem no registro de cuidados do mascote.</p>
        {friends.length === 0 ? (
          <p className="text-sm text-(--color-ink-muted)">Você ainda não tem amigos adicionados. Vá até a página Amigos para conectar alguém.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {friends.map((friend) => {
              const isShared = mascot.sharedWithFriendIds.includes(friend.id);
              return (
                <button key={friend.id} onClick={() => toggleShareWithFriend(friend.id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-colors ${isShared ? 'border-(--color-focus) bg-(--color-focus-soft)' : 'border-(--color-border) hover:bg-(--color-surface-alt)'}`}>
                  <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0" style={{ backgroundColor: friend.colorSeed }}>{friend.name.charAt(0).toUpperCase()}</span>
                  <span className="flex-1 text-sm font-medium">{friend.name}</span>
                  {isShared && <Check size={16} className="text-(--color-focus)" />}
                </button>
              );
            })}
          </div>
        )}
      </Card>

      <Card>
        <h2 className="font-display text-lg font-semibold mb-3">Histórico de cuidados</h2>
        {mascot.log.length === 0 ? (
          <p className="text-sm text-(--color-ink-muted)">Complete sessões de foco, diário, check-in ou yoga para ver o histórico aqui.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-(--color-border)">
            {mascot.log.slice(0, 15).map((entry) => (
              <li key={entry.id} className="flex items-center justify-between py-2.5 text-sm">
                <div>
                  <p className="font-medium">{entry.reason}</p>
                  <p className="text-xs text-(--color-ink-muted)">{entry.by} · {formatDayLabel(entry.at)} {formatClock(entry.at)}</p>
                </div>
                <span className="text-(--color-focus) font-semibold shrink-0">+{entry.points}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
