export enum Degree {
  BACHELORS = "Bachelor's",
  MASTERS = "Master's",
  PHD = "PhD",
  DROPOUT = "Dropout"
}

export enum GamePhase {
  CREATION = 'CREATION',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER'
}

export interface FounderProfile {
  name: string;
  degree: Degree;
  background: string; // e.g., "Computer Science", "Arts", "Bio-engineering"
  specialty: string; // "Coding", "Marketing", "Visionary"
}

export interface GameStats {
  cash: number;
  users: number;
  productQuality: number; // 0-100
  hype: number; // 0-100
  stress: number; // 0-100
  valuation: number;
  turn: number;
}

export interface StoryChoice {
  id: string;
  text: string;
  type: 'risky' | 'safe' | 'expensive' | 'innovative';
}

export interface TurnResponse {
  narrative: string;
  feedback: string; // Reaction to the LAST choice
  choices: StoryChoice[];
  statChanges: {
    cash: number;
    users: number;
    productQuality: number;
    hype: number;
    stress: number;
    valuation: number;
  };
  eventSummary: string; // Short headline for the turn
  isGameOver: boolean;
  gameOverReason?: string;
}

export interface HistoryItem {
  turn: number;
  narrative: string;
  eventSummary: string;
  statsSnapshot: GameStats;
}
