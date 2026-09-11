import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, ShieldOff } from 'lucide-react';
import { Sidebar, MobileDrawer } from './Sidebar';
import { Logo } from './Logo';
import { useSettings } from '../hooks/useSettings';

export function AppLayout() {
  const { settings } = useSettings();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-(--color-surface) border-b border-(--color-border)">
          <div className="flex items-center gap-2 font-display font-semibold">
            <Logo size={28} />
            Buddy
          </div>
          <button onClick={() => setDrawerOpen(true)} aria-label="Abrir menu" className="p-2 rounded-full hover:bg-(--color-surface-alt) text-(--color-ink-muted)">
            <Menu size={20} />
          </button>
        </div>

        {settings.distractionFreeEnabled && (
          <div className="flex items-center justify-center gap-2 bg-(--color-long) text-white text-sm font-medium py-2 px-4 text-center">
            <ShieldOff size={14} />
            Modo sem distrações ativo — notificações estão silenciadas.
          </div>
        )}

        <Outlet />
      </div>
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
