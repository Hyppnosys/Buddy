import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Leaf, Menu, ShieldOff } from 'lucide-react';
import { Sidebar, MobileDrawer } from './Sidebar';
import { useSettings } from '../hooks/useSettings';

export function AppLayout() {
  const { settings } = useSettings();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {/* Everything to the right of the desktop sidebar lives in this column,
          so the mobile top bar naturally gets the full available width
          instead of being sized as a sibling flex item next to the sidebar. */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-(--color-surface) border-b border-(--color-border)">
          <div className="flex items-center gap-2 font-display font-semibold">
            <span className="w-7 h-7 rounded-lg bg-(--color-focus) text-white flex items-center justify-center">
              <Leaf size={14} />
            </span>
            Buddy
          </div>
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menu"
            className="p-2 rounded-full hover:bg-(--color-surface-alt) text-(--color-ink-muted)"
          >
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
