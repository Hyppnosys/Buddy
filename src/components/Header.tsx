import { NavLink } from 'react-router-dom';
import { BarChart3, Leaf, Moon, Settings, Sun, Timer as TimerIcon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const NAV_ITEMS = [
  { to: '/', label: 'Início', icon: TimerIcon, end: true },
  { to: '/stats', label: 'Estatísticas', icon: BarChart3, end: false },
  { to: '/relax', label: 'Relaxar', icon: Leaf, end: false },
];

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-(--color-bg)/85 backdrop-blur-md border-b border-(--color-border)">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-display font-semibold text-lg shrink-0">
          <span className="w-8 h-8 rounded-xl bg-(--color-focus) text-white flex items-center justify-center">
            <Leaf size={16} />
          </span>
          <span className="hidden sm:inline">Foco &amp; Relax</span>
        </div>

        <nav aria-label="Navegação principal" className="flex items-center gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors
                ${isActive ? 'bg-(--color-focus-soft) text-(--color-focus)' : 'text-(--color-ink-muted) hover:text-(--color-ink) hover:bg-(--color-surface-alt)'}`
              }
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
            className="p-2.5 rounded-full text-(--color-ink-muted) hover:text-(--color-ink) hover:bg-(--color-surface-alt) transition-colors"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <NavLink
            to="/settings"
            aria-label="Configurações"
            className={({ isActive }) =>
              `p-2.5 rounded-full transition-colors ${isActive ? 'bg-(--color-focus-soft) text-(--color-focus)' : 'text-(--color-ink-muted) hover:text-(--color-ink) hover:bg-(--color-surface-alt)'}`
            }
          >
            <Settings size={18} />
          </NavLink>
        </div>
      </div>
    </header>
  );
}
