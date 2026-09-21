import { PartyPopper, X } from 'lucide-react';
import { useToast } from '../hooks/useToast';

export function ToastStack() {
  const { toasts, dismissToast } = useToast();
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 inset-x-0 z-[60] flex flex-col items-center gap-2 px-4 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className="animate-toast-in pointer-events-auto flex items-start gap-3 w-full max-w-sm
            rounded-2xl bg-(--color-surface) border border-(--color-border) shadow-(--shadow-lift) p-4"
        >
          <span className="mt-0.5 text-(--color-focus)">
            <PartyPopper size={18} />
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{toast.title}</p>
            {toast.description && <p className="text-sm text-(--color-ink-muted) mt-0.5">{toast.description}</p>}
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            aria-label="Dispensar notificação"
            className="text-(--color-ink-muted) hover:text-(--color-ink) transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
