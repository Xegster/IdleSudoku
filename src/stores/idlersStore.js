import { create } from 'zustand';
import { getDatabase } from '@/database/db';
import { getIdlers } from '@/config/loadConfig';
import { usePlayerStore } from './playerStore';

export const useIdlersStore = create((set, get) => ({
  idlerProgress: new Map(),

  loadIdlers: async () => {
    try {
      const db = getDatabase();
      const results = await db.getAllAsync(
        'SELECT * FROM idlerProgress'
      );
      
      const progress = new Map();
      results.forEach(idler => {
        progress.set(idler.idlerId, {
          idlerId: idler.idlerId,
          level: idler.level,
          lastUpdateTime: idler.lastUpdateTime,
        });
      });
      
      set({ idlerProgress: progress });
    } catch (error) {
      console.error('Error loading idlers:', error);
    }
  },

  saveIdler: async (idlerId, level, lastUpdateTime) => {
    try {
      const db = getDatabase();
      await db.runAsync(
        `INSERT OR REPLACE INTO idlerProgress (idlerId, level, lastUpdateTime)
         VALUES (?, ?, ?)`,
        [idlerId, level, lastUpdateTime]
      );
      
      const state = get();
      const newProgress = new Map(state.idlerProgress);
      newProgress.set(idlerId, {
        idlerId,
        level,
        lastUpdateTime,
      });
      set({ idlerProgress: newProgress });
    } catch (error) {
      console.error('Error saving idler:', error);
    }
  },

  upgradeIdler: (idlerId) => {
    const idlerConfig = getIdlers().find(i => i.id === idlerId);
    if (!idlerConfig) return;
    
    const progress = get().idlerProgress.get(idlerId);
    if (!progress) {
      // Initialize idler at level 1
      const now = Date.now();
      get().saveIdler(idlerId, 1, now);
      return;
    }
    
    const currentLevel = progress.level;
    if (currentLevel >= idlerConfig.levels.length) return;
    
    const nextLevel = idlerConfig.levels[currentLevel];
    const cost = nextLevel.upgradeCost;
    
    const playerStore = usePlayerStore.getState();
    if (playerStore.availableSudokus < cost) return;
    
    playerStore.spendSudokus(cost);
    const now = Date.now();
    get().saveIdler(idlerId, currentLevel + 1, now);
  },

  updateIdlerProgress: (idlerId, lastUpdateTime) => {
    const progress = get().idlerProgress.get(idlerId);
    if (!progress) return;
    
    get().saveIdler(idlerId, progress.level, lastUpdateTime);
  },

  calculateProduction: (idlerId) => {
    const idlerConfig = getIdlers().find(i => i.id === idlerId);
    if (!idlerConfig) return 0;
    
    const progress = get().idlerProgress.get(idlerId);
    if (!progress) return 0;
    
    const levelConfig = idlerConfig.levels.find(l => l.level === progress.level);
    if (!levelConfig) return 0;
    
    const now = Date.now();
    const elapsedMs = now - progress.lastUpdateTime;
    const elapsedMinutes = elapsedMs / (1000 * 60);
    
    const cyclesCompleted = Math.floor(elapsedMinutes * levelConfig.ratePerMinute);
    const sudokusProduced = cyclesCompleted * levelConfig.sudokusProduced;
    
    if (sudokusProduced > 0) {
      usePlayerStore.getState().addSudokus(sudokusProduced);
      get().updateIdlerProgress(idlerId, now);
    }
    
    return sudokusProduced;
  },

  getUnlockedIdlers: () => {
    const playerLevel = usePlayerStore.getState().level;
    return getIdlers()
      .filter(idler => playerLevel >= idler.unlockLevel)
      .map(idler => idler.id);
  },
}));

