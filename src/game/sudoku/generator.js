import { getRandomBoard } from '@/config/loadBoards';

export function loadRandomBoard(difficulty = 'easy') {
  return getRandomBoard(difficulty);
}

export function initializeBoardState(board) {
  return board.puzzle.map(row => [...row]);
}

