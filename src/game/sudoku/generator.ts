import { getRandomBoard } from '@/config/loadBoards';
import { SudokuBoard, Difficulty } from '@/types';

export function loadRandomBoard(difficulty: Difficulty = 'easy'): SudokuBoard {
  return getRandomBoard(difficulty);
}

export function initializeBoardState(board: SudokuBoard): number[][] {
  return board.puzzle.map(row => [...row]);
}
