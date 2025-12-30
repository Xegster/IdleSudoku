import { create } from 'zustand';
import { getDatabase } from '@/database/db';
import { getAbilities } from '@/config/loadConfig';
import { usePlayerStore } from './playerStore';

export const useAbilitiesStore = create((set, get) => ({
  unlockedAbilities: new Map(),

  loadAbilities: async () => {
    try {
      const db = getDatabase();
      const results = await db.getAllAsync(
        'SELECT * FROM abilityUnlocks'
      );
      
      const unlocked = new Map();
      results.forEach(ability => {
        unlocked.set(ability.abilityId, {
          abilityId: ability.abilityId,
          unlocked: Boolean(ability.unlocked),
          usesRemaining: ability.usesRemaining ?? undefined,
        });
      });
      
      set({ unlockedAbilities: unlocked });
      get().checkUnlocks();
    } catch (error) {
      console.error('Error loading abilities:', error);
    }
  },

  saveAbility: async (abilityId, unlocked, usesRemaining) => {
    try {
      const db = getDatabase();
      await db.runAsync(
        `INSERT OR REPLACE INTO abilityUnlocks (abilityId, unlocked, usesRemaining)
         VALUES (?, ?, ?)`,
        [abilityId, unlocked ? 1 : 0, usesRemaining ?? null]
      );
      
      const state = get();
      const newUnlocked = new Map(state.unlockedAbilities);
      newUnlocked.set(abilityId, {
        abilityId,
        unlocked,
        usesRemaining,
      });
      set({ unlockedAbilities: newUnlocked });
    } catch (error) {
      console.error('Error saving ability:', error);
    }
  },

  isAbilityUnlocked: (abilityId) => {
    const ability = get().unlockedAbilities.get(abilityId);
    return ability?.unlocked ?? false;
  },

  canUseAbility: (abilityId) => {
    const ability = get().unlockedAbilities.get(abilityId);
    if (!ability?.unlocked) return false;
    if (ability.usesRemaining === undefined) return true;
    return ability.usesRemaining > 0;
  },

  useAbility: (abilityId) => {
    const ability = get().unlockedAbilities.get(abilityId);
    if (!ability) return;
    
    if (ability.usesRemaining !== undefined && ability.usesRemaining > 0) {
      const newUses = ability.usesRemaining - 1;
      get().saveAbility(abilityId, true, newUses);
    }
  },

  resetAbilityUses: (abilityId) => {
    const abilityConfig = getAbilities().find(a => a.id === abilityId);
    if (abilityConfig) {
      get().saveAbility(abilityId, true, abilityConfig.maxUses);
    }
  },

  checkUnlocks: () => {
    // Use highestLevel instead of level so abilities don't re-lock when sudokus are spent
    const playerStore = usePlayerStore.getState();
    const playerLevel = playerStore.highestLevel || playerStore.level;
    const abilities = getAbilities();
    
    abilities.forEach(ability => {
      if (playerLevel >= ability.unlockLevel) {
        const current = get().unlockedAbilities.get(ability.id);
        if (!current?.unlocked) {
          get().saveAbility(ability.id, true, ability.maxUses);
        }
      }
    });
  },

  resetAbilities: async () => {
    try {
      const db = getDatabase();
      
      // Delete all ability unlocks
      await db.runAsync('DELETE FROM abilityUnlocks');
      
      // Reset store state
      set({ unlockedAbilities: new Map() });
    } catch (error) {
      console.error('Error resetting abilities:', error);
      throw error;
    }
  },
}));

