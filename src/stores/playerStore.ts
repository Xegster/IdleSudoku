import { create } from 'zustand';
import { getDatabase } from '@/database/db';
import { PlayerData, CompletedSudokusData } from '@/types';
import { getLevelRequirements } from '@/config/loadConfig';

interface PlayerStore extends PlayerData {
  completedSudokus: CompletedSudokusData;
  loadPlayerData: () => Promise<void>;
  savePlayerData: () => Promise<void>;
  completeSudoku: (difficulty: string) => Promise<void>;
  spendSudokus: (amount: number) => void;
  addSudokus: (amount: number) => void;
  loseLife: () => void;
  restoreLife: () => void;
  updateLevel: () => void;
  addMistake: () => void;
  resetMistakes: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  level: 1,
  totalCompletedSudokus: 0,
  availableSudokus: 0,
  maxLives: 1,
  currentLives: 1,
  mistakes: 0,
  completedSudokus: {
    easy: 0,
    medium: 0,
    hard: 0,
    advanced: 0,
  },

  loadPlayerData: async () => {
    try {
      const db = getDatabase();
      
      // Load player data
      const playerResult = await db.getFirstAsync<PlayerData>(
        'SELECT * FROM player WHERE id = 1'
      );
      
      if (playerResult) {
        set({
          level: playerResult.level,
          totalCompletedSudokus: playerResult.totalCompletedSudokus,
          availableSudokus: playerResult.availableSudokus,
          maxLives: playerResult.maxLives,
          currentLives: playerResult.currentLives,
          mistakes: playerResult.mistakes,
        });
      }

      // Load completed sudokus
      const completedResult = await db.getAllAsync<{ difficulty: string; count: number }>(
        'SELECT * FROM completedSudokus'
      );
      
      const completed: CompletedSudokusData = {
        easy: 0,
        medium: 0,
        hard: 0,
        advanced: 0,
      };
      
      completedResult.forEach(row => {
        const diff = row.difficulty as keyof CompletedSudokusData;
        if (diff in completed) {
          completed[diff] = row.count;
        }
      });
      
      set({ completedSudokus: completed });
      get().updateLevel();
    } catch (error) {
      console.error('Error loading player data:', error);
    }
  },

  savePlayerData: async () => {
    try {
      const db = getDatabase();
      const state = get();
      
      await db.runAsync(
        `UPDATE player SET 
          level = ?, 
          totalCompletedSudokus = ?, 
          availableSudokus = ?, 
          maxLives = ?, 
          currentLives = ?, 
          mistakes = ?
        WHERE id = 1`,
        [
          state.level,
          state.totalCompletedSudokus,
          state.availableSudokus,
          state.maxLives,
          state.currentLives,
          state.mistakes,
        ]
      );
    } catch (error) {
      console.error('Error saving player data:', error);
    }
  },

  completeSudoku: async (difficulty: string) => {
    const state = get();
    const newTotal = state.totalCompletedSudokus + 1;
    const newAvailable = state.availableSudokus + 1;
    
    const completed = { ...state.completedSudokus };
    const diff = difficulty as keyof CompletedSudokusData;
    if (diff in completed) {
      completed[diff] = (completed[diff] || 0) + 1;
    }

    set({
      totalCompletedSudokus: newTotal,
      availableSudokus: newAvailable,
      completedSudokus: completed,
    });

    // Save to database
    try {
      const db = getDatabase();
      await db.runAsync(
        'UPDATE player SET totalCompletedSudokus = ?, availableSudokus = ? WHERE id = 1',
        [newTotal, newAvailable]
      );
      
      await db.runAsync(
        'UPDATE completedSudokus SET count = ? WHERE difficulty = ?',
        [completed[diff], difficulty]
      );
    } catch (error) {
      console.error('Error saving completed sudoku:', error);
    }

    get().updateLevel();
    get().restoreLife();
  },

  spendSudokus: (amount: number) => {
    const state = get();
    const newAvailable = Math.max(0, state.availableSudokus - amount);
    set({ availableSudokus: newAvailable });
    
    get().savePlayerData();
    get().updateLevel();
  },

  addSudokus: (amount: number) => {
    const state = get();
    const newAvailable = state.availableSudokus + amount;
    set({ availableSudokus: newAvailable });
    get().savePlayerData();
    get().updateLevel();
  },

  loseLife: () => {
    const state = get();
    const newLives = Math.max(0, state.currentLives - 1);
    const newAvailable = Math.max(0, state.availableSudokus - 1);
    
    set({
      currentLives: newLives,
      availableSudokus: newAvailable,
      mistakes: 0, // Reset mistakes after losing a life
    });
    
    get().savePlayerData();
    get().updateLevel();
  },

  restoreLife: () => {
    const state = get();
    const newLives = Math.min(state.maxLives, state.currentLives + 1);
    set({ currentLives: newLives });
    get().savePlayerData();
  },

  updateLevel: () => {
    const state = get();
    const requirements = getLevelRequirements();
    
    // Find the highest level the player qualifies for
    let newLevel = 1;
    for (const req of requirements) {
      if (state.availableSudokus >= req.requiredSudokus) {
        newLevel = req.level;
      } else {
        break;
      }
    }
    
    // Update max lives based on level
    let newMaxLives = 1;
    if (newLevel >= 4) {
      newMaxLives = 5;
    } else if (newLevel >= 2) {
      newMaxLives = 3;
    }
    
    set({
      level: newLevel,
      maxLives: newMaxLives,
      currentLives: Math.min(state.currentLives, newMaxLives),
    });
    
    get().savePlayerData();
  },

  addMistake: () => {
    const state = get();
    const newMistakes = state.mistakes + 1;
    set({ mistakes: newMistakes });
    
    if (newMistakes > state.currentLives) {
      get().loseLife();
    } else {
      get().savePlayerData();
    }
  },

  resetMistakes: () => {
    set({ mistakes: 0 });
    get().savePlayerData();
  },
}));
