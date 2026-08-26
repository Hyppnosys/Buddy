export type Mood = 'great' | 'good' | 'okay' | 'low' | 'rough';

export interface JournalEntry {
  id: string;
  content: string;
  mood: Mood;
  createdAt: string;
}

export interface DailyCheckIn {
  id: string;
  date: string; // yyyy-mm-dd, one per day
  mood: Mood;
  sleepQuality: number; // 1-5
  energyLevel: number; // 1-5
  gratitude: string;
  createdAt: string;
}

export interface YogaPose {
  id: string;
  name: string;
  seconds: number;
  cue: string;
}

export interface YogaRoutine {
  id: string;
  name: string;
  description: string;
  poses: YogaPose[];
}
