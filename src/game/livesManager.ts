import { usePlayerStore } from '@/stores/playerStore';

export function handleMistake(): void {
  const playerStore = usePlayerStore.getState();
  playerStore.addMistake();
}

export function handleLifeLoss(): void {
  const playerStore = usePlayerStore.getState();
  playerStore.loseLife();
}

export function restoreLifeOnCompletion(): void {
  const playerStore = usePlayerStore.getState();
  playerStore.restoreLife();
}
