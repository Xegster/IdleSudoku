import { usePlayerStore } from '@/stores/playerStore';

export function handleMistake() {
  const playerStore = usePlayerStore.getState();
  playerStore.addMistake();
}

export function handleLifeLoss() {
  const playerStore = usePlayerStore.getState();
  playerStore.loseLife();
}

export function restoreLifeOnCompletion() {
  const playerStore = usePlayerStore.getState();
  playerStore.restoreLife();
}

