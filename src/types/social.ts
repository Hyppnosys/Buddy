export interface Friend {
  /** id da relação de amizade (linha em `friendships`), não do usuário. */
  id: string;
  /** id do OUTRO usuário nessa amizade. */
  userId: string;
  name: string;
  avatarDataUrl: string | null;
  colorSeed: string;
  status: 'accepted' | 'pending_sent' | 'pending_received';
  addedAt: string;
}

export type MascotStage = 'hatchling' | 'young' | 'grown';

export interface MascotActivityLog {
  id: string;
  reason: string;
  points: number;
  at: string;
  by: string;
}

export interface MascotState {
  name: string;
  /** Fase atual: 'hatchling' (Bebê) -> 'young' (Jovem) -> 'grown' (Adulto). */
  stage: MascotStage;
  /** Pontos dentro da barra da fase ATUAL. Volta a 0 a cada evolução. */
  phaseProgress: number;
  /** Só cresce depois que stage = 'grown' — a "pontuação extra". */
  extraPoints: number;
  /** Total histórico de pontos, nunca reseta (estatística/histórico). */
  totalXp: number;
  /** Fases já concluídas, em ordem. */
  completedPhases: MascotStage[];
  log: MascotActivityLog[];
  sharedWithFriendIds: string[];
}
