const PREFIX = 'buddy:';

export function scopedKey(base: string, userId: string | null): string {
  return userId ? `${base}:${userId}` : base;
}

// Usuários, progresso/pontuação/fase do mascote e amizades agora vivem no
// banco de dados (Supabase — veja src/services/supabaseClient.ts e
// supabase/schema.sql), não mais aqui. As chaves abaixo continuam guardando
// só o que não precisa sincronizar entre dispositivos (preferências locais,
// diário, check-ins, sessões).
export const STORAGE_KEYS = {
  settings: `${PREFIX}settings`,
  timerSettings: `${PREFIX}timer-settings`,
  sessions: `${PREFIX}sessions`,
  timerState: `${PREFIX}timer-state`,
  journal: `${PREFIX}journal`,
  checkins: `${PREFIX}checkins`,
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
