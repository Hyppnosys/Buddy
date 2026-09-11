import { Link } from 'react-router-dom';
import { BookHeart, Leaf, Timer as TimerIcon, Users } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { MascotAvatar } from '../components/MascotAvatar';
import { Logo } from '../components/Logo';

const FEATURES = [
  { icon: TimerIcon, title: 'Foco com Pomodoro', description: 'Sessões de 25 minutos, pausas automáticas e um modo sem distrações para o que precisa de atenção total.', color: 'var(--color-focus)' },
  { icon: BookHeart, title: 'Diário e check-in diário', description: 'Registre como foi o seu dia e seu estado emocional em poucos toques.', color: 'var(--color-short)' },
  { icon: Leaf, title: 'Respiração e yoga', description: 'Exercícios guiados com animações suaves para desacelerar quando precisar.', color: 'var(--color-relax)' },
  { icon: Users, title: 'Amigos e mascote', description: 'Conecte-se com amigos e cuidem juntos de um mascote que evolui com suas atividades.', color: 'var(--color-long)' },
];

export function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="max-w-6xl mx-auto w-full px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-display font-semibold text-lg">
          <Logo size={32} />
          Buddy
        </div>
        <div className="flex items-center gap-2">
          <Link to="/login"><Button variant="ghost">Entrar</Button></Link>
          <Link to="/login?modo=cadastro"><Button>Criar conta</Button></Link>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12 sm:py-20 flex flex-col items-center text-center gap-6">
        <MascotAvatar stage="young" color="#3F6B58" size={140} />
        <h1 className="font-display text-3xl sm:text-5xl font-semibold max-w-2xl">Sua rotina de foco e bem-estar, em um só lugar</h1>
        <p className="text-(--color-ink-muted) max-w-xl text-lg">
          Organize seu foco, cuide da sua mente e cultive um mascote junto com seus amigos. Simples, tranquilo e sempre com você.
        </p>
        <Link to="/login?modo=cadastro"><Button size="lg">Começar agora</Button></Link>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 w-full max-w-3xl text-left">
          {FEATURES.map(({ icon: Icon, title, description, color }) => (
            <Card key={title} className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'color-mix(in srgb, ' + color + ' 14%, transparent)', color }}>
                <Icon size={18} />
              </div>
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-(--color-ink-muted) mt-1">{description}</p>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <footer className="text-center text-xs text-(--color-ink-muted) py-6">Buddy — feito para ajudar sua rotina, um dia de cada vez.</footer>
    </div>
  );
}
