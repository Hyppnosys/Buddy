import { useContext } from 'react';
import { MascotContext } from '../context/MascotContext';

export function useMascot() {
  const ctx = useContext(MascotContext);
  if (!ctx) throw new Error('useMascot deve ser usado dentro de <MascotProvider>.');
  return ctx;
}
