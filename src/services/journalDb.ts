import { supabase } from './supabaseClient';
import type { JournalEntry, Mood } from '../types/wellness';

interface JournalEntryRow {
  id: string;
  user_id: string;
  content: string;
  mood: Mood;
  created_at: string;
}

function rowToEntry(row: JournalEntryRow): JournalEntry {
  return { id: row.id, content: row.content, mood: row.mood, createdAt: row.created_at };
}

/** Busca todas as entradas do Diário de um usuário, mais recentes primeiro. */
export async function fetchJournalEntries(userId: string): Promise<JournalEntry[]> {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as JournalEntryRow[] | null)?.map(rowToEntry) ?? [];
}

/**
 * Cria uma entrada. `createdAt` é opcional e só é usado pela migração (ver
 * JournalContext.tsx) para preservar a data/hora original de uma entrada
 * que só existia no localStorage — numa entrada nova normal, o banco usa o
 * próprio `now()` dele (ver `default now()` no schema).
 */
export async function insertJournalEntry(userId: string, content: string, mood: Mood, createdAt?: string): Promise<JournalEntry> {
  const { data, error } = await supabase
    .from('journal_entries')
    .insert({ user_id: userId, content, mood, ...(createdAt ? { created_at: createdAt } : {}) })
    .select()
    .single();
  if (error) throw error;
  return rowToEntry(data as JournalEntryRow);
}

export async function deleteJournalEntry(userId: string, id: string): Promise<void> {
  const { error } = await supabase.from('journal_entries').delete().eq('id', id).eq('user_id', userId);
  if (error) throw error;
}
