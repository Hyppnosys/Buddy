import { useContext } from 'react';
import { CheckInsContext } from '../context/CheckInsContext';

export function useCheckIns() {
  const ctx = useContext(CheckInsContext);
  if (!ctx) throw new Error('useCheckIns deve ser usado dentro de <CheckInsProvider>.');
  return ctx;
}
