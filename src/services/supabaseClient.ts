import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * The single Supabase client used by the whole app. Reads its connection
 * details from Vite env vars (see `.env.example`) — never hard-coded, so
 * each person who runs this project points it at their own free Supabase
 * project without touching any code.
 *
 * `isSupabaseConfigured` lets the rest of the app fail with one clear
 * message (instead of a confusing network error) when someone runs the
 * project before creating a `.env.local` — see `services/db/README` usage
 * in AuthContext/MascotContext.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);
