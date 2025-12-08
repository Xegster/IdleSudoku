import { useGameStore } from '@/stores/gameStore';
import { useAbilitiesStore } from '@/stores/abilitiesStore';

export function useHintV2() {
  const gameStore = useGameStore();
  const abilitiesStore = useAbilitiesStore();

  return () => {
    if (!abilitiesStore.canUseAbility('hintV2')) return;
    if (!gameStore.currentBoard) return;

    const { playerBoard, currentBoard } = gameStore;
    const emptyCells: { row: number; col: number }[] = [];

    // Find all empty cells
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (playerBoard[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length === 0) return;

    // Pick a random empty cell
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const correctValue = currentBoard.solution[randomCell.row][randomCell.col];

    gameStore.setCell(randomCell.row, randomCell.col, correctValue);
    abilitiesStore.useAbility('hintV2');
  };
}
