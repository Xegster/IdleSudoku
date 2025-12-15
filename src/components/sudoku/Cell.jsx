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
  isDuplicate,
  onPress,
  onSetValue,
}) => {
  const isEmpty = value === 0;
  const isValid = isEmpty || isCellValid(board, row, col);
  const showError = checkAnswers && !isEmpty && !isValid;
  const showDuplicate = isDuplicate && !isEmpty;

  const getBackgroundColor = () => {
    if (isSelected) return '$blue200';
    if (showDuplicate) return '$red200';
    if (isHint) return '$yellow200';
    if (showError) return '$red200';
    return '$white';
  };

  const getBorderColor = () => {
    if (isSelected) return '$blue500';
    return '$gray300';
  };

  const getTextColor = () => {
    if (showDuplicate || showError) return '$red600';
    if (isOriginal) return '$black';
    return '$blue600';
  };

  // Determine border widths for 3x3 section dividers
  // Thick borders after columns 2 and 5, and after rows 2 and 5
  // Also need thick borders before columns 3 and 6, and before rows 3 and 6
  const isRightThickBorder = col === 2 || col === 5;
  const isBottomThickBorder = row === 2 || row === 5;
  const isLeftThickBorder = col === 3 || col === 6;
  const isTopThickBorder = row === 3 || row === 6;
  
  const rightBorderWidth = isRightThickBorder ? 3 : 1;
  const bottomBorderWidth = isBottomThickBorder ? 3 : 1;
  const leftBorderWidth = isLeftThickBorder ? 3 : 1;
  const topBorderWidth = isTopThickBorder ? 3 : 1;

  return (
    <Pressable
      onPress={() => onPress(row, col)}
      flex={1}
      aspectRatio={1}
      borderLeftWidth={leftBorderWidth}
      borderRightWidth={rightBorderWidth}
      borderTopWidth={topBorderWidth}
      borderBottomWidth={bottomBorderWidth}
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

