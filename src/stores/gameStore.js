import { create } from 'zustand';
import { getRandomBoard } from '@/config/loadBoards';

export const useGameStore = create((set, get) => ({
  currentBoard: null,
  playerBoard: [],
  selectedCell: null,
  hintCells: [],
  hintNumber: null,
  autofillTimer: 60,
  autofillInterval: null,
  mistakes: 0,
  isComplete: false,

  loadNewBoard: (difficulty = 'easy') => {
    const board = getRandomBoard(difficulty);
    const playerBoard = board.puzzle.map(row => [...row]);
    
    set({
      currentBoard: board,
      playerBoard,
      selectedCell: null,
      hintCells: [],
      hintNumber: null,
      mistakes: 0,
      isComplete: false,
    });
    
    get().resetAutofillTimer();
  },

  setCell: (row, col, value) => {
    const state = get();
    if (!state.currentBoard) return;
    
    // Don't allow editing original puzzle cells
    if (state.currentBoard.puzzle[row][col] !== 0) return;
    
    const newBoard = state.playerBoard.map(r => [...r]);
    newBoard[row][col] = value;
    
    set({ playerBoard: newBoard });
    get().checkComplete();
  },

  selectCell: (row, col) => {
    set({ selectedCell: { row, col } });
  },

  clearSelection: () => {
    set({ selectedCell: null });
  },

  resetBoard: () => {
    const state = get();
    if (!state.currentBoard) return;
    
    const playerBoard = state.currentBoard.puzzle.map(row => [...row]);
    set({
      playerBoard,
      selectedCell: null,
      hintCells: [],
      hintNumber: null,
      mistakes: 0,
      isComplete: false,
    });
    
    get().resetAutofillTimer();
  },

  setHintCells: (cells, number) => {
    set({ hintCells: cells, hintNumber: number });
  },

  clearHints: () => {
    set({ hintCells: [], hintNumber: null });
  },

  startAutofillTimer: () => {
    get().stopAutofillTimer(); // Clear any existing timer
    
    const interval = setInterval(() => {
      const state = get();
      if (state.autofillTimer <= 0) {
        // Don't reset here - let the autofill hook handle it
        clearInterval(interval);
        set({ autofillInterval: null });
      } else {
        set({ autofillTimer: state.autofillTimer - 1 });
      }
    }, 1000);
    
    set({ autofillInterval: interval });
  },

  stopAutofillTimer: () => {
    const state = get();
    if (state.autofillInterval) {
      clearInterval(state.autofillInterval);
      set({ autofillInterval: null });
    }
  },

  resetAutofillTimer: () => {
    get().stopAutofillTimer();
    set({ autofillTimer: 60 });
    get().startAutofillTimer();
  },

  checkComplete: () => {
    const state = get();
    const isFilled = state.playerBoard.every(row => 
      row.every(cell => cell !== 0)
    );
    set({ isComplete: isFilled });
    return isFilled;
  },

  resetGameState: () => {
    get().stopAutofillTimer();
    set({
      currentBoard: null,
      playerBoard: [],
      selectedCell: null,
      hintCells: [],
      hintNumber: null,
      autofillTimer: 60,
      autofillInterval: null,
      mistakes: 0,
      isComplete: false,
    });
  },
}));

