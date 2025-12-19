const fs = require('fs');
const path = require('path');

const boardsDir = path.resolve(__dirname, '..', 'data', 'boards');

console.log('Boards directory:', boardsDir);
console.log('Directory exists:', fs.existsSync(boardsDir));

const boardFiles = fs.readdirSync(boardsDir)
  .filter(f => f.startsWith('board') && f.endsWith('.json'))
  .sort((a, b) => {
    const numA = parseInt(a.replace('board', '').replace('.json', ''));
    const numB = parseInt(b.replace('board', '').replace('.json', ''));
    return numA - numB;
  });

console.log(`Found ${boardFiles.length} board files`);

const allBoards = [];
let boardId = 1;

for (const boardFile of boardFiles) {
  const filePath = path.join(boardsDir, boardFile);
  const boardData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  allBoards.push({
    Id: boardId,
    puzzle: boardData.puzzle,
    solution: boardData.solution,
    difficulty: boardData.difficulty
  });
  
  boardId++;
}

const outputPath = path.join(boardsDir, 'boards.json');
console.log('Writing to:', outputPath);

fs.writeFileSync(outputPath, JSON.stringify(allBoards, null, 2), 'utf-8');

console.log(`File written. Exists: ${fs.existsSync(outputPath)}`);
if (fs.existsSync(outputPath)) {
  const stats = fs.statSync(outputPath);
  console.log(`File size: ${stats.size} bytes`);
}
console.log(`Created ${outputPath} with ${allBoards.length} boards`);
