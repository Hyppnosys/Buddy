import { useContext, useMemo } from 'react';
import { SessionsContext } from '../context/SessionsContext';
import { calculateStatistics } from '../utils/statistics';

export function useSessions() {
  const ctx = useContext(SessionsContext);
  if (!ctx) throw new Error('useSessions deve ser usado dentro de <SessionsProvider>.');
  const statistics = useMemo(() => calculateStatistics(ctx.sessions), [ctx.sessions]);
  return { ...ctx, statistics };
}
