import { createContext, useCallback, useRef, useState, type ReactNode } from 'react';

export interface ToastMessage {
  id: number;
  title: string;
  description?: string;
}

interface ToastContextValue {
  toasts: ToastMessage[];
  showToast: (title: string, description?: string) => void;
  dismissToast: (id: number) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const counter = useRef(0);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (title: string, description?: string) => {
      const id = ++counter.current;
      setToasts((prev) => [...prev, { id, title, description }]);
      window.setTimeout(() => dismissToast(id), 4500);
    },
    [dismissToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
    </ToastContext.Provider>
  );
}
