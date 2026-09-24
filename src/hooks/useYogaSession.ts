import rotinasIoga from '../data/rotinas_ioga.json';
import type { YogaPose, YogaRoutine } from '../types/wellness';

interface RawPose {
  id: number;
  nome_ingles: string;
  nome_sanskrit: string;
  nome_portugues: string;
  descricao_portugues: string;
  url_imagem: string;
}

const RAW_POSES = rotinasIoga as RawPose[];
const POSE_DURATION_SECONDS = 30;

function toPose(raw: RawPose): YogaPose {
  return {
    id: String(raw.id),
    name: raw.nome_portugues,
    seconds: POSE_DURATION_SECONDS,
    cue: raw.descricao_portugues,
    englishName: raw.nome_ingles,
    sanskritName: raw.nome_sanskrit,
    imageUrl: raw.url_imagem,
  };
}

function findRawPose(id: number): RawPose | undefined {
  return RAW_POSES.find((pose) => pose.id === id);
}

function buildRoutine(id: string, name: string, description: string, poseIds: number[]): YogaRoutine {
  return {
    id,
    name,
    description,
    poses: poseIds
      .map((poseId) => findRawPose(poseId))
      .filter((pose): pose is RawPose => pose !== undefined)
      .map(toPose),
  };
}

export const YOGA_COMBOS: Record<string, YogaRoutine> = {
  'equilibrio-alongamento': buildRoutine(
    'equilibrio-alongamento',
    'Equilíbrio & Alongamento',
    'Uma sequência calma para melhorar equilíbrio e alongar o corpo todo.',
    [9, 41, 42, 101],
  ),
  'forca-fluxo': buildRoutine(
    'forca-fluxo',
    'Força & Fluxo',
    'Uma sequência mais dinâmica para fortalecer pernas, braços e core.',
    [44, 45, 100, 102, 103],
  ),
};

export function findYogaCombo(id: string): YogaRoutine | undefined {
  return YOGA_COMBOS[id];
}

export function estimatedMinutes(routine: YogaRoutine): number {
  const totalSeconds = routine.poses.reduce((sum, pose) => sum + pose.seconds, 0);
  return Math.max(1, Math.round(totalSeconds / 60));
}

/** Alias de compatibilidade com código antigo que importava uma rotina única. */
export const YOGA_ROUTINE = YOGA_COMBOS['equilibrio-alongamento'];
