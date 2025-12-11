import { useSettingsStore } from '@/stores/settingsStore';
import { useAbilitiesStore } from '@/stores/abilitiesStore';

export function isCheckAnswersEnabled() {
  const settingsStore = useSettingsStore.getState();
  const abilitiesStore = useAbilitiesStore.getState();
  
  return (
    abilitiesStore.isAbilityUnlocked('checkAnswers') &&
    settingsStore.checkAnswersEnabled
  );
}

