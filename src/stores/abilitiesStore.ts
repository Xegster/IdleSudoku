import { create } from 'zustand';
import { getDatabase } from '@/database/db';
import { getAbilities } from '@/config/loadConfig';
import { AbilityUnlock } from '@/types';
import { usePlayerStore } from './playerStore';

interface AbilitiesStore {
  unlockedAbilities: Map<string, AbilityUnlock>;
  loadAbilities: () => Promise<void>;
  saveAbility: (abilityId: string, unlocked: boolean, usesRemaining?: number) => Promise<void>;
  isAbilityUnlocked: (abilityId: string) => boolean;
  canUseAbility: (abilityId: string) => boolean;
  useAbility: (abilityId: string) => void;
  resetAbilityUses: (abilityId: string) => void;
  checkUnlocks: () => void;
}

export const useAbilitiesStore = create<AbilitiesStore>((set, get) => ({
  unlockedAbilities: new Map(),

  loadAbilities: async () => {
    try {
      const db = getDatabase();
      const results = await db.getAllAsync<AbilityUnlock>(
        'SELECT * FROM abilityUnlocks'
      );
      
      const unlocked = new Map<string, AbilityUnlock>();
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

  saveAbility: async (abilityId: string, unlocked: boolean, usesRemaining?: number) => {
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

  isAbilityUnlocked: (abilityId: string) => {
    const ability = get().unlockedAbilities.get(abilityId);
    return ability?.unlocked ?? false;
  },

  canUseAbility: (abilityId: string) => {
    const ability = get().unlockedAbilities.get(abilityId);
    if (!ability?.unlocked) return false;
    if (ability.usesRemaining === undefined) return true;
    return ability.usesRemaining > 0;
  },

  useAbility: (abilityId: string) => {
    const ability = get().unlockedAbilities.get(abilityId);
    if (!ability) return;
    
    if (ability.usesRemaining !== undefined && ability.usesRemaining > 0) {
      const newUses = ability.usesRemaining - 1;
      get().saveAbility(abilityId, true, newUses);
    }
  },

  resetAbilityUses: (abilityId: string) => {
    const abilityConfig = getAbilities().find(a => a.id === abilityId);
    if (abilityConfig) {
      get().saveAbility(abilityId, true, abilityConfig.maxUses);
    }
  },

  checkUnlocks: () => {
    const playerLevel = usePlayerStore.getState().level;
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
}));
