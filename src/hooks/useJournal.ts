import { useContext } from 'react';
import { JournalContext } from '../context/JournalContext';

export function useJournal() {
  const ctx = useContext(JournalContext);
  if (!ctx) throw new Error('useJournal deve ser usado dentro de <JournalProvider>.');
  return ctx;
}
