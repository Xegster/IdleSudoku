import board1 from '../../data/boards/board1.json';
import board2 from '../../data/boards/board2.json';
import board3 from '../../data/boards/board3.json';
import board4 from '../../data/boards/board4.json';
import board5 from '../../data/boards/board5.json';
import board6 from '../../data/boards/board6.json';
import board7 from '../../data/boards/board7.json';
import board8 from '../../data/boards/board8.json';
import board9 from '../../data/boards/board9.json';
import board10 from '../../data/boards/board10.json';
import { SudokuBoard, Difficulty } from '@/types';

const boards: SudokuBoard[] = [
  board1 as SudokuBoard,
  board2 as SudokuBoard,
  board3 as SudokuBoard,
  board4 as SudokuBoard,
  board5 as SudokuBoard,
  board6 as SudokuBoard,
  board7 as SudokuBoard,
  board8 as SudokuBoard,
  board9 as SudokuBoard,
  board10 as SudokuBoard,
];

export function getRandomBoard(difficulty: Difficulty = 'easy'): SudokuBoard {
  const filteredBoards = boards.filter(b => b.difficulty === difficulty);
  if (filteredBoards.length === 0) {
    return boards[0];
  }
  const randomIndex = Math.floor(Math.random() * filteredBoards.length);
  return filteredBoards[randomIndex];
}

export function getAllBoards(): SudokuBoard[] {
  return boards;
}
