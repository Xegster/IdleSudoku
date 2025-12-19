import levelsData from '@data/levels.json';
import abilitiesData from '@data/abilities.json';
import idlersData from '@data/idlers.json';
import boardsEasy from '@data/boards/boardsEasy.json';
import boardsMedium from '@data/boards/boardsMedium.json';
import boardsHard from '@data/boards/boardsHard.json';
import boardsAdvanced from '@data/boards/boardsAdvanced.json';

const allBoards = [
  ...boardsEasy,
  ...boardsMedium,
  ...boardsHard,
  ...boardsAdvanced,
];

export function loadLevelRequirements() {
  return levelsData.levelRequirements;
}

export function loadAbilities() {
  return abilitiesData.abilities;
}

export function loadIdlers() {
  return idlersData.idlers;
}

export async function loadSudokuBoard(boardNumber) {
  const board = allBoards[boardNumber - 1];
  if (!board) {
    throw new Error(`Invalid board number: ${boardNumber}`);
  }
  return board;
}

export function getRandomBoardNumber() {
  return Math.floor(Math.random() * allBoards.length) + 1;
}

