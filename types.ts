
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

export type Theme = 'light' | 'dark' | 'neon';
export type Difficulty = 'bootstrapper' | 'venture-scale';

export interface FounderProfile {
  name: string;
  degree: Degree;
  background: string;
  specialty: string;
  theme: Theme;
  difficulty: Difficulty;
}

export interface WorldState {
  marketCycle: 'Bull' | 'Bear' | 'Stagnant';
  trendingTech: string[];
  globalEvent?: string;
}

export interface GameStats {
  cash: number;
  users: number;
  productQuality: number;
  marketFit: number;
  stress: number;
  valuation: number;
  turn: number;
  burnRate: number;
}

export interface StoryChoice {
  id: string;
  text: string;
  type: 'risky' | 'safe' | 'expensive' | 'innovative';
  icon?: string;
}

export interface TurnResponse {
  narrative: string;
  feedback: string;
  visualVibe: string; // Tailwind color classes or specific keywords
  choices: StoryChoice[];
  statChanges: {
    cash: number;
    users: number;
    productQuality: number;
    marketFit: number;
    stress: number;
    valuation: number;
  };
  worldUpdate?: WorldState;
  eventSummary: string;
  isGameOver: boolean;
  gameOverReason?: string;
}

export interface HistoryItem {
  turn: number;
  narrative: string;
  eventSummary: string;
  statsSnapshot: GameStats;
  choiceMade: string;
}
