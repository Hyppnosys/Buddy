import { Link } from 'react-router-dom';
import { Sparkles, Wind } from 'lucide-react';
import { CompanionScene } from '../components/CompanionScene';
import { Card } from '../components/Card';
import { useAuth } from '../hooks/useAuth';
import { useMascot } from '../hooks/useMascot';
import { useCheckIns } from '../hooks/useCheckIns';

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

const SEQUENCES = [
  { label: 'Respiração', to: '/app/relaxar?tab=respirar', icon: Wind },
  { label: 'Relaxamento', to: '/app/relaxar?tab=yoga&combo=relaxamento-noturno', icon: Sparkles },
  { label: 'Alongamento', to: '/app/relaxar?tab=yoga&combo=alongamento-rapido', icon: Sparkles },
  { label: 'Combo Diário', to: '/app/relaxar?tab=yoga&combo=combo-diario', icon: Sparkles },
];

export function Dashboard() {
  const { currentUser } = useAuth();
  const { mascot, stage } = useMascot();
  const { todayCheckIn } = useCheckIns();
  const firstName = currentUser?.name.split(' ')[0] ?? '';

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 flex flex-col items-center gap-8 animate-fade-up text-center">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold">{greeting()}, {firstName}! 👋</h1>
        <p className="text-(--color-ink-muted) mt-1.5">{mascot.name} está aqui para acompanhar você hoje.</p>
      </div>

      <CompanionScene stage={stage} color={mascot.color} />

      {!todayCheckIn && (
        <Link to="/app/checkin" className="text-sm font-semibold text-(--color-focus) hover:underline">
          Ainda não fez o check-in de hoje — responder agora
        </Link>
      )}

      <div className="w-full">
        <h2 className="font-display text-lg font-semibold mb-3">Escolha uma sequência</h2>
        <div className="grid grid-cols-2 gap-3">
          {SEQUENCES.map(({ label, to, icon: Icon }) => (
            <Link key={label} to={to}>
              <Card className="flex flex-col items-center gap-2 py-6 hover:border-(--color-focus) transition-colors">
                <span className="w-10 h-10 rounded-full bg-(--color-focus-soft) text-(--color-focus) flex items-center justify-center">
                  <Icon size={18} />
                </span>
                <span className="font-semibold text-sm">{label}</span>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
