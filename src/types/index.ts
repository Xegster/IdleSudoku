export type Difficulty = 'easy' | 'medium' | 'hard' | 'advanced';

export interface SudokuBoard {
  puzzle: number[][];
  solution: number[][];
  difficulty: Difficulty;
}

export interface PlayerData {
  level: number;
  totalCompletedSudokus: number;
  availableSudokus: number;
  maxLives: number;
  currentLives: number;
  mistakes: number;
}

export interface CompletedSudokusData {
  easy: number;
  medium: number;
  hard: number;
  advanced: number;
}

export interface IdlerProgress {
  idlerId: string;
  level: number;
  lastUpdateTime: number;
}

export interface Settings {
  soundEnabled: boolean;
  checkAnswersEnabled: boolean;
  autofillEnabled: boolean;
}

export interface AbilityUnlock {
  abilityId: string;
  unlocked: boolean;
  usesRemaining: number;
}

export interface LevelRequirement {
  level: number;
  requiredSudokus: number;
}

export interface AbilityConfig {
  id: string;
  name: string;
  unlockLevel: number;
  maxUses?: number;
}

export interface IdlerLevel {
  level: number;
  sudokusProduced: number;
  ratePerMinute: number;
  upgradeCost: number;
}

export interface IdlerConfig {
  id: string;
  name: string;
  image: string;
  unlockLevel: number;
  levels: IdlerLevel[];
}
