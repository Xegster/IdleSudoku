import { useGameStore } from '@/stores/gameStore';
import { useAbilitiesStore } from '@/stores/abilitiesStore';

export function useNewSudoku() {
  const gameStore = useGameStore();
  const abilitiesStore = useAbilitiesStore();

  return () => {
    if (abilitiesStore.canUseAbility('newSudoku')) {
      abilitiesStore.useAbility('newSudoku');
      gameStore.loadNewBoard();
    }
  };
}
