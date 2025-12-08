import React from 'react';
import { Box, Text, Pressable } from 'native-base';
import { isCellValid } from '@/game/sudoku/validator';

interface CellProps {
  value: number;
  row: number;
  col: number;
  isSelected: boolean;
  isHint: boolean;
  isOriginal: boolean;
  board: number[][];
  checkAnswers: boolean;
  onPress: (row: number, col: number) => void;
  onSetValue: (row: number, col: number, value: number) => void;
}

export const Cell: React.FC<CellProps> = ({
  value,
  row,
  col,
  isSelected,
  isHint,
  isOriginal,
  board,
  checkAnswers,
  onPress,
  onSetValue,
}) => {
  const isEmpty = value === 0;
  const isValid = isEmpty || isCellValid(board, row, col);
  const showError = checkAnswers && !isEmpty && !isValid;

  const getBackgroundColor = () => {
    if (isSelected) return 'blue.200';
    if (isHint) return 'yellow.200';
    if (showError) return 'red.200';
    return 'white';
  };

  const getBorderColor = () => {
    if (isSelected) return 'blue.500';
    return 'gray.300';
  };

  const getTextColor = () => {
    if (showError) return 'red.600';
    if (isOriginal) return 'black';
    return 'blue.600';
  };

  return (
    <Pressable
      onPress={() => onPress(row, col)}
      flex={1}
      aspectRatio={1}
      borderWidth={1}
      borderColor={getBorderColor()}
      bg={getBackgroundColor()}
      justifyContent="center"
      alignItems="center"
    >
      <Text
        fontSize="lg"
        fontWeight={isOriginal ? 'bold' : 'normal'}
        color={getTextColor()}
      >
        {isEmpty ? '' : value}
      </Text>
    </Pressable>
  );
};
