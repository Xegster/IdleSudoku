import boardsEasy from '@data/boards/boardsEasy.json';
import boardsMedium from '@data/boards/boardsMedium.json';
import boardsHard from '@data/boards/boardsHard.json';
import boardsAdvanced from '@data/boards/boardsAdvanced.json';

const boards = [
  ...boardsEasy,
  ...boardsMedium,
  ...boardsHard,
  ...boardsAdvanced,
];

export function getRandomBoard(difficulty = 'easy') {
  const filteredBoards = boards.filter(b => b.difficulty === difficulty);
  if (filteredBoards.length === 0) {
    return boards[0];
  }
  const randomIndex = Math.floor(Math.random() * filteredBoards.length);
  return filteredBoards[randomIndex];
}

export function getAllBoards() {
  return boards;
}

