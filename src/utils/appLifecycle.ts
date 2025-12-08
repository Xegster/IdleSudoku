import { AppState, AppStateStatus } from 'react-native';
import { usePlayerStore } from '@/stores/playerStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useIdlersStore } from '@/stores/idlersStore';
import { useGameStore } from '@/stores/gameStore';
import { useAbilitiesStore } from '@/stores/abilitiesStore';

export function setupAppLifecycle() {
  const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
    if (nextAppState === 'background' || nextAppState === 'inactive') {
      // Save all state when app goes to background
      usePlayerStore.getState().savePlayerData();
      useSettingsStore.getState().saveSettings();
      
      // Save idler progress
      const idlersStore = useIdlersStore.getState();
      idlersStore.idlerProgress.forEach((progress, idlerId) => {
        idlersStore.saveIdler(idlerId, progress.level, Date.now());
      });
      
      // Stop autofill timer
      useGameStore.getState().stopAutofillTimer();
    } else if (nextAppState === 'active') {
      // Calculate idler production when app comes to foreground
      const idlersStore = useIdlersStore.getState();
      idlersStore.idlerProgress.forEach((progress, idlerId) => {
        idlersStore.calculateProduction(idlerId);
      });
      
      // Restart autofill timer if enabled
      const settingsStore = useSettingsStore.getState();
      const abilitiesStore = useAbilitiesStore.getState();
      if (settingsStore.autofillEnabled && abilitiesStore.isAbilityUnlocked('autofill')) {
        useGameStore.getState().startAutofillTimer();
      }
    }
  });

  return () => {
    subscription.remove();
  };
}
