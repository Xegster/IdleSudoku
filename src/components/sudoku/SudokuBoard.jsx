import React, { useEffect } from 'react';
import { Box, HStack, VStack, Button, ButtonText } from '@gluestack-ui/themed';
import { Cell } from './Cell';
import { useGameStore } from '@/stores/gameStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { isCellValid } from '@/game/sudoku/validator';
import { usePlayerStore } from '@/stores/playerStore';

export const SudokuBoard = () => {
  const gameStore = useGameStore();
  const settingsStore = useSettingsStore();
  const playerStore = usePlayerStore();

  const { currentBoard, playerBoard, selectedCell, hintCells, hintNumber } = gameStore;

  useEffect(() => {
    if (!currentBoard) {
      gameStore.loadNewBoard();
    }
  }, []);

  if (!currentBoard) {
    return null;
  }

  const handleCellPress = (row, col) => {
    gameStore.selectCell(row, col);
  };

  const handleNumberInput = (value) => {
    if (selectedCell) {
      const { row, col } = selectedCell;
      if (currentBoard.puzzle[row][col] === 0) {
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
  };

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
                  onPress={handleCellPress}
                  onSetValue={gameStore.setCell}
                />
              );
            })}
          </HStack>
        ))}
      </Box>
      {renderNumberPad()}
    </VStack>
  );
};

