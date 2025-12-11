export function isValidSudoku(board) {
  // Check rows
  for (let i = 0; i < 9; i++) {
    if (!isValidRow(board, i)) return false;
  }

  // Check columns
  for (let j = 0; j < 9; j++) {
    if (!isValidColumn(board, j)) return false;
  }

  // Check 3x3 quadrants
  for (let i = 0; i < 9; i += 3) {
    for (let j = 0; j < 9; j += 3) {
      if (!isValidQuadrant(board, i, j)) return false;
    }
  }

  return true;
}

export function isValidRow(board, row) {
  const seen = new Set();
  for (let j = 0; j < 9; j++) {
    const value = board[row][j];
    if (value === 0) continue;
    if (value < 1 || value > 9) return false;
    if (seen.has(value)) return false;
    seen.add(value);
  }
  return true;
}

export function isValidColumn(board, col) {
  const seen = new Set();
  for (let i = 0; i < 9; i++) {
    const value = board[i][col];
    if (value === 0) continue;
    if (value < 1 || value > 9) return false;
    if (seen.has(value)) return false;
    seen.add(value);
  }
  return true;
}

export function isValidQuadrant(board, startRow, startCol) {
  const seen = new Set();
  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      const value = board[i][j];
      if (value === 0) continue;
      if (value < 1 || value > 9) return false;
      if (seen.has(value)) return false;
      seen.add(value);
    }
  }
  return true;
}

export function isCellValid(board, row, col) {
  if (board[row][col] === 0) return true;
  
  // Check row
  const rowValues = board[row].filter((v, idx) => idx !== col && v !== 0);
  if (rowValues.includes(board[row][col])) return false;

  // Check column
  const colValues = [];
  for (let i = 0; i < 9; i++) {
    if (i !== row && board[i][col] !== 0) {
      colValues.push(board[i][col]);
    }
  }
  if (colValues.includes(board[row][col])) return false;

  // Check quadrant
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  const quadrantValues = [];
  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if ((i !== row || j !== col) && board[i][j] !== 0) {
        quadrantValues.push(board[i][j]);
      }
    }
  }
  if (quadrantValues.includes(board[row][col])) return false;

  return true;
}

export function getQuadrantIndex(row, col) {
  const quadrantRow = Math.floor(row / 3);
  const quadrantCol = Math.floor(col / 3);
  return quadrantRow * 3 + quadrantCol;
}

export function getQuadrantCells(quadrantIndex) {
  const startRow = Math.floor(quadrantIndex / 3) * 3;
  const startCol = (quadrantIndex % 3) * 3;
  const cells = [];
  
  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      cells.push({ row: i, col: j });
    }
  }
  
  return cells;
}

