const fs = require('fs');
const path = require('path');

const boardsPath = path.resolve(__dirname, '..', 'data', 'boards', 'boards.json');

const boards = JSON.parse(fs.readFileSync(boardsPath, 'utf8'));

const formatGrid = grid => {
  const rows = grid.map(row => `      [${row.join(', ')}]`).join(',\n');
  return `[\n${rows}\n    ]`;
};

const output = `[\n${boards.map(board => `  {\n    "Id": ${board.Id},\n    "puzzle": ${formatGrid(board.puzzle)},\n    "solution": ${formatGrid(board.solution)},\n    "difficulty": "${board.difficulty}"\n  }`).join(',\n')}\n]\n`;

fs.writeFileSync(boardsPath, output);

console.log(`Formatted ${boards.length} boards to ${boardsPath}`);

