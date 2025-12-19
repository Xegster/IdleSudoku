const fs = require('fs');
const path = require('path');

const boardsPath = path.resolve(__dirname, '..', 'data', 'boards', 'boards.json');

const boards = JSON.parse(fs.readFileSync(boardsPath, 'utf8'));

const formatGrid = grid => {
  const rows = grid.map(row => `      [${row.join(', ')}]`).join(',\n');
  return `[\n${rows}\n    ]`;
};

const formatBoards = list => `[\n${list.map(board => `  {\n    "Id": ${board.Id},\n    "puzzle": ${formatGrid(board.puzzle)},\n    "solution": ${formatGrid(board.solution)},\n    "difficulty": "${board.difficulty}"\n  }`).join(',\n')}\n]\n`;

const groups = {};
boards.forEach(board => {
  if (!groups[board.difficulty]) {
    groups[board.difficulty] = [];
  }
  groups[board.difficulty].push(board);
});

Object.entries(groups).forEach(([difficulty, list]) => {
  const fileName = `boards${difficulty.charAt(0).toUpperCase()}${difficulty.slice(1)}.json`;
  const outPath = path.resolve(__dirname, '..', 'data', 'boards', fileName);
  fs.writeFileSync(outPath, formatBoards(list));
  console.log(`Wrote ${fileName} with ${list.length} boards`);
});

fs.unlinkSync(boardsPath);
console.log(`Removed ${path.basename(boardsPath)}`);

