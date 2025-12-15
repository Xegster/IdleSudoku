import { create } from 'zustand';
import { getDatabase } from '@/database/db';

export const useSettingsStore = create((set, get) => ({
  soundEnabled: true,
  checkAnswersEnabled: false,
  autofillEnabled: false,
  debugErrorsEnabled: true,

  loadSettings: async () => {
    try {
      const db = getDatabase();
      const result = await db.getFirstAsync(
        'SELECT * FROM settings WHERE id = 1'
      );
      
      if (result) {
        set({
          soundEnabled: Boolean(result.soundEnabled),
          checkAnswersEnabled: Boolean(result.checkAnswersEnabled),
          autofillEnabled: Boolean(result.autofillEnabled),
          debugErrorsEnabled: result.debugErrorsEnabled !== undefined ? Boolean(result.debugErrorsEnabled) : true,
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
          autofillEnabled = ?,
          debugErrorsEnabled = ?
        WHERE id = 1`,
        [
          state.soundEnabled ? 1 : 0,
          state.checkAnswersEnabled ? 1 : 0,
          state.autofillEnabled ? 1 : 0,
          state.debugErrorsEnabled ? 1 : 0,
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

  toggleDebugErrors: () => {
    set(state => ({ debugErrorsEnabled: !state.debugErrorsEnabled }));
    get().saveSettings();
  },
}));

