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

/**
 * Finds all cells that have duplicate values in their row, column, or quadrant.
 * Returns a Set of cell keys in the format "row,col" for cells that have duplicates.
 */
export function findDuplicateCells(board) {
  const duplicateCells = new Set();

  // Safety check: ensure board is valid
  if (!board || !Array.isArray(board) || board.length !== 9) {
    return duplicateCells;
  }

  // Check rows
  for (let row = 0; row < 9; row++) {
    // Safety check: ensure row exists
    if (!board[row] || !Array.isArray(board[row]) || board[row].length !== 9) {
      continue;
    }

    const valueCounts = new Map();
    const cellPositions = new Map();
    
    for (let col = 0; col < 9; col++) {
      const value = board[row][col];
      if (value !== 0 && value !== null && value !== undefined) {
        if (!valueCounts.has(value)) {
          valueCounts.set(value, []);
        }
        valueCounts.get(value).push({ row, col });
        cellPositions.set(`${row},${col}`, value);
      }
    }
    
    // Mark all cells with duplicate values
    valueCounts.forEach((positions, value) => {
      if (positions.length > 1) {
        positions.forEach(pos => {
          duplicateCells.add(`${pos.row},${pos.col}`);
        });
      }
    });
  }

  // Check columns
  for (let col = 0; col < 9; col++) {
    const valueCounts = new Map();
    
    for (let row = 0; row < 9; row++) {
      // Safety check: ensure row and column exist
      if (!board[row] || !Array.isArray(board[row]) || board[row].length <= col) {
        continue;
      }

      const value = board[row][col];
      if (value !== 0 && value !== null && value !== undefined) {
        if (!valueCounts.has(value)) {
          valueCounts.set(value, []);
        }
        valueCounts.get(value).push({ row, col });
      }
    }
    
    // Mark all cells with duplicate values
    valueCounts.forEach((positions, value) => {
      if (positions.length > 1) {
        positions.forEach(pos => {
          duplicateCells.add(`${pos.row},${pos.col}`);
        });
      }
    });
  }

  // Check quadrants
  for (let quadrantRow = 0; quadrantRow < 3; quadrantRow++) {
    for (let quadrantCol = 0; quadrantCol < 3; quadrantCol++) {
      const startRow = quadrantRow * 3;
      const startCol = quadrantCol * 3;
      const valueCounts = new Map();
      
      for (let row = startRow; row < startRow + 3; row++) {
        // Safety check: ensure row exists
        if (!board[row] || !Array.isArray(board[row])) {
          continue;
        }

        for (let col = startCol; col < startCol + 3; col++) {
          // Safety check: ensure column exists
          if (board[row].length <= col) {
            continue;
          }

          const value = board[row][col];
          if (value !== 0 && value !== null && value !== undefined) {
            if (!valueCounts.has(value)) {
              valueCounts.set(value, []);
            }
            valueCounts.get(value).push({ row, col });
          }
        }
      }
      
      // Mark all cells with duplicate values
      valueCounts.forEach((positions, value) => {
        if (positions.length > 1) {
          positions.forEach(pos => {
            duplicateCells.add(`${pos.row},${pos.col}`);
          });
        }
      });
    }
  }

  return duplicateCells;
}

