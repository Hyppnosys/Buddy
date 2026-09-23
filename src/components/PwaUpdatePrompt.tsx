import { RefreshCw, WifiOff } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';

/**
 * The PWA's service worker (see vite.config.ts) downloads a new version of
 * the app in the background as soon as one is published, but never swaps
 * it in under someone who already has the app open — that could mix old
 * HTML with new JS mid-session. Instead it waits here: a small banner
 * offers the update, and only applies it (reloading with the new version)
 * when the person taps "Atualizar". Until then they keep using the version
 * they already had, uninterrupted — exactly the trade-off described to the
 * user for how PWA updates propagate.
 */
export function PwaUpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      // Check for a new version every time the app tab becomes visible
      // again, not just at first load — so someone who keeps a tab open
      // for hours still sees the update banner without needing a manual
      // refresh to trigger the check.
      if (!registration) return;
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') registration.update();
      });
    },
  });

  if (!needRefresh && !offlineReady) return null;

  const dismiss = () => {
    setNeedRefresh(false);
    setOfflineReady(false);
  };

  return (
    <div className="fixed bottom-4 inset-x-0 z-[60] flex justify-center px-4 pointer-events-none">
      <div
        role="status"
        className="animate-toast-in pointer-events-auto flex items-center gap-3 w-full max-w-sm
          rounded-2xl bg-(--color-surface) border border-(--color-border) shadow-(--shadow-lift) p-4"
      >
        <span className="text-(--color-focus) shrink-0">
          {needRefresh ? <RefreshCw size={18} /> : <WifiOff size={18} />}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">
            {needRefresh ? 'Nova versão disponível' : 'Pronto para uso offline'}
          </p>
          {!needRefresh && <p className="text-xs text-(--color-ink-muted) mt-0.5">O app já funciona mesmo sem internet.</p>}
        </div>
        {needRefresh ? (
          <button
            onClick={() => updateServiceWorker(true)}
            className="shrink-0 text-sm font-semibold text-(--color-focus) hover:opacity-80 transition-opacity"
          >
            Atualizar
          </button>
        ) : (
          <button onClick={dismiss} className="shrink-0 text-sm font-semibold text-(--color-ink-muted) hover:text-(--color-ink) transition-colors">
            OK
          </button>
        )}
      </div>
    </div>
  );
}
