import { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useAbilitiesStore } from '@/stores/abilitiesStore';
import { useHintV2 } from './hintV2';

export function useAutofill() {
  const gameStore = useGameStore();
  const settingsStore = useSettingsStore();
  const abilitiesStore = useAbilitiesStore();
  const hintV2 = useHintV2();
  const autofillTimer = gameStore.autofillTimer;
  const autofillEnabled = settingsStore.autofillEnabled;
  const autofillUnlocked = abilitiesStore.isAbilityUnlocked('autofill');

  useEffect(() => {
    if (!autofillUnlocked || !autofillEnabled) {
      gameStore.stopAutofillTimer();
      return;
    }

    gameStore.startAutofillTimer();

    return () => {
      gameStore.stopAutofillTimer();
    };
  }, [autofillEnabled, autofillUnlocked]);

  useEffect(() => {
    if (
      autofillTimer === 0 &&
      autofillEnabled &&
      autofillUnlocked &&
      gameStore.currentBoard
    ) {
      hintV2();
      // Reset timer after autofill
      setTimeout(() => {
        gameStore.resetAutofillTimer();
      }, 100);
    }
  }, [autofillTimer, autofillEnabled, autofillUnlocked]);
}

