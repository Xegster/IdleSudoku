import { useGameStore } from '@/stores/gameStore';
import { useAbilitiesStore } from '@/stores/abilitiesStore';

export function useHintV1() {
  const gameStore = useGameStore();
  const abilitiesStore = useAbilitiesStore();

  return () => {
    if (!abilitiesStore.canUseAbility('hintV1')) return;
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

    if (emptyCells.length < 3) return;

    // Pick 3 random empty cells
    const shuffled = emptyCells.sort(() => Math.random() - 0.5);
    const selectedCells = shuffled.slice(0, 3);

    // Find a number that could go in one of them
    const solution = currentBoard.solution;
    const possibleNumbers = new Set<number>();
    
    selectedCells.forEach(cell => {
      const correctValue = solution[cell.row][cell.col];
      if (correctValue > 0 && correctValue <= 9) {
        possibleNumbers.add(correctValue);
      }
    });

    if (possibleNumbers.size > 0) {
      const hintNumber = Array.from(possibleNumbers)[0];
      gameStore.setHintCells(selectedCells, hintNumber);
      abilitiesStore.useAbility('hintV1');
    }
  };
}
