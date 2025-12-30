import { create } from 'zustand';
import { getDatabase } from '@/database/db';
import { getLevelRequirements } from '@/config/loadConfig';

export const usePlayerStore = create((set, get) => ({
  level: 1,
  highestLevel: 1, // Track highest level achieved - never decreases
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
      const playerResult = await db.getFirstAsync(
        'SELECT * FROM player WHERE id = 1'
      );
      
      if (playerResult) {
        set({
          level: playerResult.level,
          highestLevel: playerResult.highestLevel || playerResult.level || 1,
          totalCompletedSudokus: playerResult.totalCompletedSudokus,
          availableSudokus: playerResult.availableSudokus,
          maxLives: playerResult.maxLives,
          currentLives: playerResult.currentLives,
          mistakes: playerResult.mistakes,
        });
      }

      // Load completed sudokus
      const completedResult = await db.getAllAsync(
        'SELECT * FROM completedSudokus'
      );
      
      const completed = {
        easy: 0,
        medium: 0,
        hard: 0,
        advanced: 0,
      };
      
      completedResult.forEach(row => {
        const diff = row.difficulty;
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
          highestLevel = ?,
          totalCompletedSudokus = ?, 
          availableSudokus = ?, 
          maxLives = ?, 
          currentLives = ?, 
          mistakes = ?
        WHERE id = 1`,
        [
          state.level,
          state.highestLevel,
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

  completeSudoku: async (difficulty) => {
    const state = get();
    const newTotal = state.totalCompletedSudokus + 1;
    const newAvailable = state.availableSudokus + 1;
    
    const completed = { ...state.completedSudokus };
    const diff = difficulty;
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

  spendSudokus: (amount) => {
    const state = get();
    const newAvailable = Math.max(0, state.availableSudokus - amount);
    set({ availableSudokus: newAvailable });
    
    get().savePlayerData();
    get().updateLevel();
  },

  addSudokus: (amount) => {
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
    
    // Find the highest level the player qualifies for based on available sudokus
    let calculatedLevel = 1;
    for (const req of requirements) {
      if (state.availableSudokus >= req.requiredSudokus) {
        calculatedLevel = req.level;
      } else {
        break;
      }
    }
    
    // Level should never decrease - use the maximum of calculated level and highest level achieved
    const newLevel = Math.max(calculatedLevel, state.highestLevel || 1);
    const newHighestLevel = Math.max(newLevel, state.highestLevel || 1);
    
    // Update max lives based on highest level (for unlock purposes)
    let newMaxLives = 1;
    if (newHighestLevel >= 4) {
      newMaxLives = 5;
    } else if (newHighestLevel >= 2) {
      newMaxLives = 3;
    }
    
    set({
      level: newLevel,
      highestLevel: newHighestLevel,
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

  resetGame: async () => {
    try {
      const db = getDatabase();
      
      // Ensure player row exists, then reset to initial values
      await db.runAsync(
        `INSERT OR REPLACE INTO player (id, level, highestLevel, totalCompletedSudokus, availableSudokus, maxLives, currentLives, mistakes)
         VALUES (1, 1, 1, 0, 0, 1, 1, 0)`
      );
      
      // Reset completed sudokus counts - ensure rows exist first
      const difficulties = ['easy', 'medium', 'hard', 'advanced'];
      for (const difficulty of difficulties) {
        await db.runAsync(
          `INSERT OR REPLACE INTO completedSudokus (difficulty, count) VALUES (?, ?)`,
          [difficulty, 0]
        );
      }
      
      // Reset player store state
      set({
        level: 1,
        highestLevel: 1,
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
      });
      
      // Force update level calculation
      get().updateLevel();
    } catch (error) {
      console.error('Error resetting game:', error);
      throw error;
    }
  },
}));

