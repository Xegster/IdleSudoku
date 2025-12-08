import { useGameStore } from '@/stores/gameStore';
import { useAbilitiesStore } from '@/stores/abilitiesStore';
import { getQuadrantCells } from '@/game/sudoku/validator';

export function useFillRow() {
  const gameStore = useGameStore();
  const abilitiesStore = useAbilitiesStore();

  return (row: number) => {
    if (!abilitiesStore.canUseAbility('fillRow')) return;
    if (!gameStore.currentBoard) return;

    const { currentBoard } = gameStore;
    for (let col = 0; col < 9; col++) {
      if (currentBoard.puzzle[row][col] === 0) {
        const correctValue = currentBoard.solution[row][col];
        gameStore.setCell(row, col, correctValue);
      }
    }
    abilitiesStore.useAbility('fillRow');
  };
}

export function useFillColumn() {
  const gameStore = useGameStore();
  const abilitiesStore = useAbilitiesStore();

  return (col: number) => {
    if (!abilitiesStore.canUseAbility('fillColumn')) return;
    if (!gameStore.currentBoard) return;

    const { currentBoard } = gameStore;
    for (let row = 0; row < 9; row++) {
      if (currentBoard.puzzle[row][col] === 0) {
        const correctValue = currentBoard.solution[row][col];
        gameStore.setCell(row, col, correctValue);
      }
    }
    abilitiesStore.useAbility('fillColumn');
  };
}

export function useFillQuadrant() {
  const gameStore = useGameStore();
  const abilitiesStore = useAbilitiesStore();

  return (quadrantIndex: number) => {
    if (!abilitiesStore.canUseAbility('fillQuadrant')) return;
    if (!gameStore.currentBoard) return;

    const { currentBoard } = gameStore;
    const cells = getQuadrantCells(quadrantIndex);
    
    cells.forEach(cell => {
      if (currentBoard.puzzle[cell.row][cell.col] === 0) {
        const correctValue = currentBoard.solution[cell.row][cell.col];
        gameStore.setCell(cell.row, cell.col, correctValue);
      }
    });
    
    abilitiesStore.useAbility('fillQuadrant');
  };
}
