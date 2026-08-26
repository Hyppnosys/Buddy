import { Link } from 'react-router-dom';
import { BookHeart, ClipboardList, Flame, ListChecks, Timer as TimerIcon, Users } from 'lucide-react';
import { Card } from '../components/Card';
import { StatsCard } from '../components/StatsCard';
import { MascotAvatar } from '../components/MascotAvatar';
import { HistoryList } from '../components/HistoryList';
import { useAuth } from '../hooks/useAuth';
import { useSessions } from '../hooks/useSessions';
import { useJournal } from '../hooks/useJournal';
import { useCheckIns } from '../hooks/useCheckIns';
import { useFriends } from '../hooks/useFriends';
import { useMascot } from '../hooks/useMascot';
import { useSettings } from '../hooks/useSettings';
import { nextStageInfo } from '../context/MascotContext';

const STAGE_LABEL: Record<string, string> = {
  egg: 'Ovo',
  hatchling: 'Filhote',
  young: 'Jovem',
  grown: 'Adulto',
};

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

export function Dashboard() {
  const { currentUser } = useAuth();
  const { sessions, statistics } = useSessions();
  const { entries } = useJournal();
  const { todayCheckIn } = useCheckIns();
  const { friends } = useFriends();
  const { mascot, stage } = useMascot();
  const { settings, updateSettings } = useSettings();

  const firstName = currentUser?.name.split(' ')[0] ?? '';
  const nextStage = nextStageInfo(mascot.xp);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8 animate-fade-up">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold">
          {greeting()}, {firstName} 👋
        </h1>
        <p className="text-(--color-ink-muted) mt-1.5">
          Aqui está um resumo da sua rotina hoje.
        </p>
      </div>

      {!todayCheckIn && (
        <Card className="flex items-center justify-between gap-4 border-(--color-focus) bg-(--color-focus-soft)">
          <div>
            <p className="font-semibold text-(--color-focus)">Você ainda não fez o check-in de hoje</p>
            <p className="text-sm text-(--color-ink-muted) mt-0.5">Leva menos de um minuto.</p>
          </div>
          <Link
            to="/app/checkin"
            className="shrink-0 px-4 py-2 rounded-full bg-(--color-focus) text-white text-sm font-semibold"
          >
            Responder
          </Link>
        </Card>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatsCard label="Sessões hoje" value={statistics.sessionsToday} icon={<ListChecks size={18} />} />
        <StatsCard
          label="Foco hoje"
          value={`${statistics.focusMinutesToday} min`}
          icon={<TimerIcon size={18} />}
          accent="var(--color-long)"
        />
        <StatsCard
          label="Sequência"
          value={`${statistics.currentStreak} dias`}
          icon={<Flame size={18} />}
          accent="var(--color-short)"
        />
        <StatsCard
          label="Entradas no diário"
          value={entries.length}
          icon={<BookHeart size={18} />}
          accent="var(--color-relax)"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/app/foco">
          <Card className="h-full flex items-center gap-4 hover:border-(--color-focus) transition-colors">
            <div className="w-11 h-11 rounded-2xl bg-(--color-focus-soft) text-(--color-focus) flex items-center justify-center shrink-0">
              <TimerIcon size={18} />
            </div>
            <div>
              <p className="font-semibold">Iniciar uma sessão de foco</p>
              <p className="text-sm text-(--color-ink-muted)">25 minutos de concentração, no seu ritmo.</p>
            </div>
          </Card>
        </Link>
        <Link to="/app/amigos">
          <Card className="h-full flex items-center gap-4 hover:border-(--color-focus) transition-colors">
            <div className="w-11 h-11 rounded-2xl bg-(--color-long-soft) text-(--color-long) flex items-center justify-center shrink-0">
              <Users size={18} />
            </div>
            <div>
              <p className="font-semibold">{friends.length} amigo{friends.length === 1 ? '' : 's'} conectado{friends.length === 1 ? '' : 's'}</p>
              <p className="text-sm text-(--color-ink-muted)">Adicione mais gente para cuidar do mascote junto.</p>
            </div>
          </Card>
        </Link>
      </div>

      {settings.showMascotOnDashboard && (
        <Card className="flex flex-col sm:flex-row items-center gap-6">
          <MascotAvatar stage={stage} color={mascot.color} size={110} />
          <div className="flex-1 text-center sm:text-left">
            <p className="font-display text-lg font-semibold">
              {mascot.name} · fase {STAGE_LABEL[stage]}
            </p>
            <p className="text-sm text-(--color-ink-muted) mt-1">
              {nextStage
                ? `Faltam ${nextStage.xpToGo} pontos para a próxima fase.`
                : 'Seu mascote alcançou a fase máxima! 🎉'}
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-3 mt-3">
              <Link
                to="/app/mascote"
                className="text-sm font-semibold text-(--color-focus) hover:underline"
              >
                Ver mascote
              </Link>
              <button
                onClick={() => updateSettings((prev) => ({ ...prev, showMascotOnDashboard: false }))}
                className="text-sm text-(--color-ink-muted) hover:text-(--color-ink) hover:underline"
              >
                Ocultar daqui
              </button>
            </div>
          </div>
        </Card>
      )}

      {!settings.showMascotOnDashboard && (
        <button
          onClick={() => updateSettings((prev) => ({ ...prev, showMascotOnDashboard: true }))}
          className="text-sm text-(--color-ink-muted) hover:text-(--color-ink) underline self-start"
        >
          Mostrar o mascote no painel
        </button>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg font-semibold">Sessões recentes</h2>
          <Link to="/app/foco" className="text-sm text-(--color-focus) hover:underline">
            Ver tudo
          </Link>
        </div>
        <HistoryList sessions={sessions} limit={5} />
      </div>

      <Card className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-2xl bg-(--color-short-soft) text-(--color-short) flex items-center justify-center shrink-0">
          <ClipboardList size={18} />
        </div>
        <div>
          <p className="font-semibold text-sm">Dica</p>
          <p className="text-sm text-(--color-ink-muted)">
            Registrar seu humor todos os dias ajuda a perceber padrões ao longo do tempo.
          </p>
        </div>
      </Card>
    </div>
  );
}
