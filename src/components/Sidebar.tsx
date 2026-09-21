import { NavLink, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  BookHeart,
  Bot,
  ClipboardList,
  Leaf,
  LineChart,
  LogOut,
  Moon,
  ShieldOff,
  Sun,
  Timer as TimerIcon,
  User as UserIcon,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useSettings } from '../hooks/useSettings';
import { Logo } from './Logo';

const NAV_ITEMS = [
  { to: '/app', label: 'Início', icon: BarChart3, end: true },
  { to: '/app/foco', label: 'Foco', icon: TimerIcon, end: false },
  { to: '/app/diario', label: 'Diário', icon: BookHeart, end: false },
  { to: '/app/checkin', label: 'Como você está', icon: ClipboardList, end: false },
  { to: '/app/relaxar', label: 'Relaxar', icon: Leaf, end: false },
  { to: '/app/estatisticas', label: 'Estatísticas', icon: LineChart, end: false },
  { to: '/app/amigos', label: 'Amigos', icon: Users, end: false },
  { to: '/app/mascote', label: 'Mascote', icon: Bot, end: false },
];

function Avatar({ name, avatarDataUrl, size = 36 }: { name: string; avatarDataUrl: string | null; size?: number }) {
  if (avatarDataUrl) {
    return <img src={avatarDataUrl} alt="" className="rounded-full object-cover shrink-0" style={{ width: size, height: size }} />;
  }
  const initial = name.trim().charAt(0).toUpperCase() || '?';
  return (
    <div className="rounded-full bg-(--color-focus) text-white flex items-center justify-center font-semibold shrink-0" style={{ width: size, height: size }} aria-hidden>
      {initial}
    </div>
  );
}

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { currentUser, logOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { settings, updateSettings } = useSettings();
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut();
    navigate('/');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="hidden lg:flex items-center gap-2 px-5 h-16 shrink-0 font-display font-semibold text-lg">
        <Logo size={32} />
        Buddy
      </div>

      <nav aria-label="Navegação principal" className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
              ${isActive ? 'bg-(--color-focus-soft) text-(--color-focus)' : 'text-(--color-ink-muted) hover:text-(--color-ink) hover:bg-(--color-surface-alt)'}`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-3 flex flex-col gap-1 border-t border-(--color-border) pt-3">
        <button
          onClick={() => updateSettings((prev) => ({ ...prev, distractionFreeEnabled: !prev.distractionFreeEnabled }))}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
            ${settings.distractionFreeEnabled ? 'bg-(--color-long-soft) text-(--color-long)' : 'text-(--color-ink-muted) hover:text-(--color-ink) hover:bg-(--color-surface-alt)'}`}
        >
          <ShieldOff size={18} />
          Modo sem distrações
          {settings.distractionFreeEnabled && <span className="ml-auto w-2 h-2 rounded-full bg-(--color-long)" />}
        </button>

        <button onClick={toggleTheme} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-(--color-ink-muted) hover:text-(--color-ink) hover:bg-(--color-surface-alt) transition-colors">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          {theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
        </button>

        <NavLink
          to="/app/configuracoes"
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
            ${isActive ? 'bg-(--color-focus-soft) text-(--color-focus)' : 'text-(--color-ink-muted) hover:text-(--color-ink) hover:bg-(--color-surface-alt)'}`
          }
        >
          <UserIcon size={18} />
          Configurações
        </NavLink>

        <NavLink to="/app/perfil" onClick={onNavigate} className="flex items-center gap-3 px-3 py-2 mt-1 rounded-xl hover:bg-(--color-surface-alt) transition-colors">
          <Avatar name={currentUser?.name ?? '?'} avatarDataUrl={currentUser?.avatarDataUrl ?? null} />
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{currentUser?.name}</p>
            <p className="text-xs text-(--color-ink-muted) truncate">Ver perfil</p>
          </div>
        </NavLink>

        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-(--color-danger) hover:bg-(--color-danger)/10 transition-colors">
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-(--color-border) bg-(--color-surface) h-screen sticky top-0">
      <SidebarContent />
    </aside>
  );
}

export function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="lg:hidden fixed inset-0 z-50">
      <button aria-label="Fechar menu" className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-(--color-surface) shadow-(--shadow-lift) animate-pop-in">
        <div className="flex items-center gap-2 px-5 h-16 font-display font-semibold text-lg border-b border-(--color-border)">
          <Logo size={32} />
          Buddy
          <button onClick={onClose} aria-label="Fechar menu" className="ml-auto p-2 rounded-full hover:bg-(--color-surface-alt) text-(--color-ink-muted)">
            <X size={18} />
          </button>
        </div>
        <SidebarContent onNavigate={onClose} />
      </div>
    </div>
  );
}
