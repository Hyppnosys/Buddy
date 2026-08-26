import type { YogaRoutine } from '../types/wellness';

export const YOGA_ROUTINE: YogaRoutine = {
  id: 'gentle-flow',
  name: 'Fluxo suave',
  description: 'Uma sequência curta para alongar o corpo e acalmar a mente.',
  poses: [
    { id: 'mountain', name: 'Postura da montanha', seconds: 20, cue: 'Fique em pé, ombros relaxados, respire fundo.' },
    { id: 'forward-fold', name: 'Flexão para frente', seconds: 25, cue: 'Incline o tronco à frente, deixe os braços soltos.' },
    { id: 'cat-cow', name: 'Gato-vaca', seconds: 30, cue: 'De quatro apoios, alterne arquear e curvar as costas.' },
    { id: 'downward-dog', name: 'Cão olhando para baixo', seconds: 25, cue: 'Eleve os quadris, mãos e pés no chão, forme um V invertido.' },
    { id: 'child-pose', name: 'Postura da criança', seconds: 30, cue: 'Sente sobre os calcanhares, estenda os braços à frente.' },
    { id: 'seated-twist', name: 'Torção sentada', seconds: 20, cue: 'Sentado, gire suavemente o tronco para cada lado.' },
    { id: 'final-rest', name: 'Relaxamento final', seconds: 30, cue: 'Deite-se, feche os olhos, respire naturalmente.' },
  ],
};
