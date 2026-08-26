/**
 * Thin wrapper around localStorage so that the rest of the app never touches
 * `window.localStorage` directly. This is the seam where a future backend
 * (REST API + PostgreSQL) could be swapped in without touching consumers.
 */

const PREFIX = 'foco-relax:';

export const STORAGE_KEYS = {
  settings: `${PREFIX}settings`,
  timerSettings: `${PREFIX}timer-settings`,
  sessions: `${PREFIX}sessions`,
  timerState: `${PREFIX}timer-state`,
} as const;

export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`[storage] Falha ao ler "${key}", usando valor padrão.`, error);
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`[storage] Falha ao salvar "${key}".`, error);
  }
}

export function removeStorage(key: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(key);
}
