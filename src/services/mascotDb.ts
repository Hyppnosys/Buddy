import { supabase } from './supabaseClient';
import type { MascotActivityLog, MascotStage, MascotState } from '../types/social';
import { INITIAL_MASCOT_PROGRESS } from '../utils/mascotProgress';

interface MascotProgressRow {
  user_id: string;
  mascot_name: string;
  stage: MascotStage;
  phase_progress: number;
  extra_points: number;
  total_xp: number;
  completed_phases: MascotStage[] | null;
  shared_with_friend_ids: string[] | null;
}

interface ActivityLogRow {
  id: string;
  reason: string;
  points: number;
  by_name: string;
  created_at: string;
}

function rowToState(row: MascotProgressRow, log: MascotActivityLog[]): MascotState {
  return {
    name: row.mascot_name,
    stage: row.stage,
    phaseProgress: row.phase_progress,
    extraPoints: row.extra_points,
    totalXp: row.total_xp,
    completedPhases: row.completed_phases ?? [],
    sharedWithFriendIds: row.shared_with_friend_ids ?? [],
    log,
  };
}

function logRowToEntry(row: ActivityLogRow): MascotActivityLog {
  return { id: row.id, reason: row.reason, points: row.points, by: row.by_name, at: row.created_at };
}

/** Cria a linha inicial de um usuário novo: Bebê, barra 0/20, sem histórico. */
export async function createInitialMascotProgress(userId: string, mascotName = 'Rio'): Promise<void> {
  const { error } = await supabase.from('mascot_progress').insert({
    user_id: userId,
    mascot_name: mascotName,
    stage: INITIAL_MASCOT_PROGRESS.stage,
    phase_progress: INITIAL_MASCOT_PROGRESS.phaseProgress,
    extra_points: INITIAL_MASCOT_PROGRESS.extraPoints,
    total_xp: INITIAL_MASCOT_PROGRESS.totalXp,
    completed_phases: INITIAL_MASCOT_PROGRESS.completedPhases,
  });
  if (error) throw error;
}

export async function fetchMascotState(userId: string): Promise<MascotState> {
  const [{ data: progress, error: progressError }, { data: logRows, error: logError }] = await Promise.all([
    supabase.from('mascot_progress').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('mascot_activity_log').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(100),
  ]);
  if (progressError) throw progressError;
  if (logError) throw logError;

  let row = progress as MascotProgressRow | null;
  if (!row) {
    // Rede de segurança: um perfil sem linha de progresso ainda (ex: criado
    // antes dessa funcionalidade existir) ganha uma agora, em vez de quebrar
    // a página do mascote.
    await createInitialMascotProgress(userId);
    row = {
      user_id: userId,
      mascot_name: 'Rio',
      stage: INITIAL_MASCOT_PROGRESS.stage,
      phase_progress: INITIAL_MASCOT_PROGRESS.phaseProgress,
      extra_points: INITIAL_MASCOT_PROGRESS.extraPoints,
      total_xp: INITIAL_MASCOT_PROGRESS.totalXp,
      completed_phases: INITIAL_MASCOT_PROGRESS.completedPhases,
      shared_with_friend_ids: [],
    };
  }

  return rowToState(row, (logRows as ActivityLogRow[] | null)?.map(logRowToEntry) ?? []);
}

export async function persistMascotProgress(
  userId: string,
  progress: { stage: MascotStage; phaseProgress: number; extraPoints: number; totalXp: number; completedPhases: MascotStage[] }
): Promise<void> {
  const { error } = await supabase
    .from('mascot_progress')
    .update({
      stage: progress.stage,
      phase_progress: progress.phaseProgress,
      extra_points: progress.extraPoints,
      total_xp: progress.totalXp,
      completed_phases: progress.completedPhases,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);
  if (error) throw error;
}

export async function insertActivityLog(userId: string, reason: string, points: number, by: string): Promise<MascotActivityLog> {
  const { data, error } = await supabase
    .from('mascot_activity_log')
    .insert({ user_id: userId, reason, points, by_name: by })
    .select()
    .single();
  if (error) throw error;
  return logRowToEntry(data as ActivityLogRow);
}

export async function renameMascotDb(userId: string, name: string): Promise<void> {
  const { error } = await supabase
    .from('mascot_progress')
    .update({ mascot_name: name, updated_at: new Date().toISOString() })
    .eq('user_id', userId);
  if (error) throw error;
}

export async function setSharedWithFriendIdsDb(userId: string, ids: string[]): Promise<void> {
  const { error } = await supabase
    .from('mascot_progress')
    .update({ shared_with_friend_ids: ids, updated_at: new Date().toISOString() })
    .eq('user_id', userId);
  if (error) throw error;
}
