import type { YogaPose, YogaRoutine } from '../types/wellness';

export const YOGA_POSES: Record<string, YogaPose> = {
  mountain: { id: 'mountain', name: 'Postura da montanha', seconds: 20, cue: 'Fique em pé, ombros relaxados, respire fundo.' },
  'forward-fold': { id: 'forward-fold', name: 'Flexão para frente', seconds: 25, cue: 'Incline o tronco à frente, deixe os braços soltos.' },
  'cat-cow': { id: 'cat-cow', name: 'Gato-vaca', seconds: 30, cue: 'De quatro apoios, alterne arquear e curvar as costas.' },
  'downward-dog': { id: 'downward-dog', name: 'Cão olhando para baixo', seconds: 25, cue: 'Eleve os quadris, mãos e pés no chão, forme um V invertido.' },
  'child-pose': { id: 'child-pose', name: 'Postura da criança', seconds: 30, cue: 'Sente sobre os calcanhares, estenda os braços à frente.' },
  'seated-twist': { id: 'seated-twist', name: 'Torção sentada', seconds: 20, cue: 'Sentado, gire suavemente o tronco para cada lado.' },
  'final-rest': { id: 'final-rest', name: 'Relaxamento final', seconds: 30, cue: 'Deite-se, feche os olhos, respire naturalmente.' },
};

function buildRoutine(id: string, name: string, description: string, poseIds: string[]): YogaRoutine {
  return { id, name, description, poses: poseIds.map((poseId) => YOGA_POSES[poseId]) };
}

export const YOGA_COMBOS: YogaRoutine[] = [
  buildRoutine('fluxo-suave', 'Fluxo suave', 'Uma sequência completa para alongar o corpo e acalmar a mente.',
    ['mountain', 'forward-fold', 'cat-cow', 'downward-dog', 'child-pose', 'seated-twist', 'final-rest']),
  buildRoutine('alongamento-rapido', 'Alongamento rápido', 'Três posturas simples para soltar o corpo em poucos minutos.',
    ['mountain', 'forward-fold', 'child-pose']),
  buildRoutine('energia-matinal', 'Energia matinal', 'Ative o corpo logo cedo com movimento e respiração.',
    ['cat-cow', 'downward-dog', 'mountain']),
  buildRoutine('relaxamento-noturno', 'Relaxamento noturno', 'Desacelere antes de dormir com posturas baixas e calmas.',
    ['child-pose', 'seated-twist', 'final-rest']),
  buildRoutine('combo-diario', 'Combo diário', 'A rotina completa recomendada para praticar todos os dias.',
    ['mountain', 'cat-cow', 'downward-dog', 'forward-fold', 'seated-twist', 'child-pose', 'final-rest']),
];

export function estimatedMinutes(routine: YogaRoutine): number {
  const totalSeconds = routine.poses.reduce((sum, pose) => sum + pose.seconds, 0);
  return Math.max(1, Math.round(totalSeconds / 60));
}

export function findYogaCombo(id: string | null): YogaRoutine {
  return YOGA_COMBOS.find((c) => c.id === id) ?? YOGA_COMBOS[0];
}

export const YOGA_ROUTINE = YOGA_COMBOS[0];
