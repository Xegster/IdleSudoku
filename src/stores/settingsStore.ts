import { create } from 'zustand';
import { getDatabase } from '@/database/db';
import { Settings } from '@/types';

interface SettingsStore extends Settings {
  loadSettings: () => Promise<void>;
  saveSettings: () => Promise<void>;
  toggleSound: () => void;
  toggleCheckAnswers: () => void;
  toggleAutofill: () => void;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  soundEnabled: true,
  checkAnswersEnabled: false,
  autofillEnabled: false,

  loadSettings: async () => {
    try {
      const db = getDatabase();
      const result = await db.getFirstAsync<Settings>(
        'SELECT * FROM settings WHERE id = 1'
      );
      
      if (result) {
        set({
          soundEnabled: Boolean(result.soundEnabled),
          checkAnswersEnabled: Boolean(result.checkAnswersEnabled),
          autofillEnabled: Boolean(result.autofillEnabled),
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  },

  saveSettings: async () => {
    try {
      const db = getDatabase();
      const state = get();
      
      await db.runAsync(
        `UPDATE settings SET 
          soundEnabled = ?, 
          checkAnswersEnabled = ?, 
          autofillEnabled = ?
        WHERE id = 1`,
        [
          state.soundEnabled ? 1 : 0,
          state.checkAnswersEnabled ? 1 : 0,
          state.autofillEnabled ? 1 : 0,
        ]
      );
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  },

  toggleSound: () => {
    set(state => ({ soundEnabled: !state.soundEnabled }));
    get().saveSettings();
  },

  toggleCheckAnswers: () => {
    set(state => ({ checkAnswersEnabled: !state.checkAnswersEnabled }));
    get().saveSettings();
  },

  toggleAutofill: () => {
    set(state => ({ autofillEnabled: !state.autofillEnabled }));
    get().saveSettings();
  },
}));
