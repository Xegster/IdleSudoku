import React, { useEffect, useMemo, useCallback } from 'react';
import { Box, HStack, VStack, Button, ButtonText, Text } from '@gluestack-ui/themed';
import { Platform } from 'react-native';
import { Cell } from './Cell';
import { useGameStore } from '@/stores/gameStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { isCellValid, findDuplicateCells } from '@/game/sudoku/validator';
import { usePlayerStore } from '@/stores/playerStore';

export const SudokuBoard = () => {
  const gameStore = useGameStore();
  const settingsStore = useSettingsStore();
  const playerStore = usePlayerStore();

  const { currentBoard, playerBoard, selectedCell, hintCells, hintNumber } = gameStore;

  // Calculate duplicate cells when debug errors is enabled
  const duplicateCells = useMemo(() => {
    if (settingsStore.debugErrorsEnabled && playerBoard && Array.isArray(playerBoard) && playerBoard.length === 9) {
      return findDuplicateCells(playerBoard);
    }
    return new Set();
  }, [playerBoard, settingsStore.debugErrorsEnabled]);

  useEffect(() => {
    if (!currentBoard) {
      gameStore.loadNewBoard();
    }
  }, []);

  const handleCellPress = useCallback((row, col) => {
    gameStore.selectCell(row, col);
  }, [gameStore]);

  const handleNumberInput = useCallback((value) => {
    if (selectedCell) {
      const { row, col } = selectedCell;
      if (currentBoard && currentBoard.puzzle[row][col] === 0) {
        gameStore.setCell(row, col, value);
        
        // Check if the value is incorrect and checkAnswers is enabled
        if (settingsStore.checkAnswersEnabled) {
          const newBoard = playerBoard.map(r => [...r]);
          newBoard[row][col] = value;
          if (!isCellValid(newBoard, row, col)) {
            playerStore.addMistake();
          }
        }
      }
    }
  }, [selectedCell, currentBoard, gameStore, settingsStore, playerStore, playerBoard]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!selectedCell) return;

      const { row, col } = selectedCell;
      
      // Don't allow editing original puzzle cells
      if (currentBoard && currentBoard.puzzle[row][col] !== 0) {
        return;
      }

      const key = event.key;

      // Handle number keys 1-9
      if (key >= '1' && key <= '9') {
        const value = parseInt(key, 10);
        handleNumberInput(value);
        event.preventDefault();
      }
      // Handle Delete or Backspace to clear cell
      else if (key === 'Delete' || key === 'Backspace') {
        gameStore.setCell(row, col, 0);
        event.preventDefault();
      }
      // Handle arrow keys for navigation
      else if (key === 'ArrowUp' && row > 0) {
        gameStore.selectCell(row - 1, col);
        event.preventDefault();
      }
      else if (key === 'ArrowDown' && row < 8) {
        gameStore.selectCell(row + 1, col);
        event.preventDefault();
      }
      else if (key === 'ArrowLeft' && col > 0) {
        gameStore.selectCell(row, col - 1);
        event.preventDefault();
      }
      else if (key === 'ArrowRight' && col < 8) {
        gameStore.selectCell(row, col + 1);
        event.preventDefault();
      }
    };

    // For web platform, use DOM events
    if (Platform.OS === 'web') {
      window.addEventListener('keydown', handleKeyPress);
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    }
    // For native platforms, you might want to use React Native's Keyboard API
    // For now, we'll focus on web support
  }, [selectedCell, currentBoard, gameStore, handleNumberInput]);

  if (!currentBoard) {
    return null;
  }

  const renderNumberPad = () => {
    return (
      <HStack space={2} justifyContent="center" mt={4} flexWrap="wrap">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <Button
            key={num}
            onPress={() => handleNumberInput(num)}
            size="md"
            variant="outline"
            minWidth={40}
          >
            <ButtonText>{num}</ButtonText>
          </Button>
        ))}
      </HStack>
    );
  };

  return (
    <VStack space="lg" alignItems="center" p="$4">
      <Box
        width="100%"
        maxWidth="400px"
        borderWidth={2}
        borderColor="$gray400"
        bg="$gray50"
      >
        {playerBoard.map((row, rowIndex) => (
          <HStack key={rowIndex}>
            {row.map((cell, colIndex) => {
              const isSelected =
                selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
              const isHint = hintCells.some(
                h => h.row === rowIndex && h.col === colIndex
              );
              const isOriginal = currentBoard.puzzle[rowIndex][colIndex] !== 0;
              const isDuplicate = duplicateCells.has(`${rowIndex},${colIndex}`);

              return (
                <Cell
                  key={`${rowIndex}-${colIndex}`}
                  value={cell}
                  row={rowIndex}
                  col={colIndex}
                  isSelected={isSelected}
                  isHint={isHint}
                  isOriginal={isOriginal}
                  board={playerBoard}
                  checkAnswers={settingsStore.checkAnswersEnabled}
                  isDuplicate={isDuplicate}
                  onPress={handleCellPress}
                  onSetValue={gameStore.setCell}
                />
              );
            })}
          </HStack>
        ))}
      </Box>
      {renderNumberPad()}
      {currentBoard?.difficulty && (
        <Text size="sm" color="$gray600" mt={2} textTransform="capitalize">
          Difficulty: {currentBoard.difficulty}
        </Text>
      )}
    </VStack>
  );
};

