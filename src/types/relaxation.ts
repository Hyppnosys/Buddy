export interface BreathingPhaseConfig {
  key: 'inhale' | 'hold' | 'exhale';
  label: string;
  seconds: number;
}

export interface RelaxationExercise {
  id: string;
  name: string;
  description: string;
  phases: BreathingPhaseConfig[];
}

export interface Sound {
  id: string;
  name: string;
  icon: string;
  /** Path to an audio file. Left empty until real assets are added. */
  src: string | null;
}
