import levelsData from '../../data/levels.json';
import abilitiesData from '../../data/abilities.json';
import idlersData from '../../data/idlers.json';

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
  try {
    // Dynamic import for JSON files
    let boardModule;
    switch (boardNumber) {
      case 1:
        boardModule = await import('../../data/boards/board1.json');
        break;
      case 2:
        boardModule = await import('../../data/boards/board2.json');
        break;
      case 3:
        boardModule = await import('../../data/boards/board3.json');
        break;
      case 4:
        boardModule = await import('../../data/boards/board4.json');
        break;
      case 5:
        boardModule = await import('../../data/boards/board5.json');
        break;
      case 6:
        boardModule = await import('../../data/boards/board6.json');
        break;
      case 7:
        boardModule = await import('../../data/boards/board7.json');
        break;
      case 8:
        boardModule = await import('../../data/boards/board8.json');
        break;
      case 9:
        boardModule = await import('../../data/boards/board9.json');
        break;
      case 10:
        boardModule = await import('../../data/boards/board10.json');
        break;
      default:
        throw new Error(`Invalid board number: ${boardNumber}`);
    }
    return boardModule.default || boardModule;
  } catch (error) {
    throw new Error(`Failed to load board ${boardNumber}: ${error}`);
  }
}

export function getRandomBoardNumber() {
  return Math.floor(Math.random() * 10) + 1;
}

