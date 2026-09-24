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

/**
 * Duas rotinas montadas a partir das 9 posturas do modelo treinado
 * (rotinas_ioga.json / data.yaml). Cada pose fica 30s na tela e é validada
 * em tempo real comparando com `englishName` (classe prevista pela IA local).
 */
export const YOGA_COMBOS: YogaRoutine[] = [
  buildRoutine(
    'equilibrio-alongamento',
    'Equilíbrio & Alongamento',
    'Posturas de base para equilíbrio, alongamento e concentração.',
    [9, 41, 42, 101], // chair pose, Tree Pose, Triangel pose, Namaskara pose
  ),
  buildRoutine(
    'forca-fluxo',
    'Força & Fluxo',
    'Sequência mais intensa para fortalecer pernas, core e postura.',
    [44, 45, 100, 102, 103], // Warrior 1, Warrior 2, Goddess, Raised arm, Side bend
  ),
];

export function findYogaCombo(id: string | null): YogaRoutine {
  return YOGA_COMBOS.find((c) => c.id === id) ?? YOGA_COMBOS[0];
}

export function estimatedMinutes(routine: YogaRoutine): number {
  const totalSeconds = routine.poses.reduce((sum, pose) => sum + pose.seconds, 0);
  return Math.max(1, Math.round(totalSeconds / 60));
}

/** Mantido por compatibilidade com qualquer import existente. */
export const YOGA_ROUTINE = YOGA_COMBOS[0];
