import React from 'react';
import { Box, Text, Pressable } from '@gluestack-ui/themed';
import { isCellValid } from '@/game/sudoku/validator';

export const Cell = ({
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
    if (isSelected) return '$blue200';
    if (isHint) return '$yellow200';
    if (showError) return '$red200';
    return '$white';
  };

  const getBorderColor = () => {
    if (isSelected) return '$blue500';
    return '$gray300';
  };

  const getTextColor = () => {
    if (showError) return '$red600';
    if (isOriginal) return '$black';
    return '$blue600';
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
        size="lg"
        fontWeight={isOriginal ? '$bold' : '$normal'}
        color={getTextColor()}
      >
        {isEmpty ? '' : value}
      </Text>
    </Pressable>
  );
};

