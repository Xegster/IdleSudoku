import React, { useEffect, useState } from 'react';
import { VStack, Button, ButtonText, HStack, Box, Text, Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicatorWrapper, SelectDragIndicator, SelectItem } from '@gluestack-ui/themed';
import { ChevronDownIcon, CheckIcon } from '@gluestack-ui/themed';
import { SudokuBoard } from '@/components/sudoku/SudokuBoard';
import { useGameStore } from '@/stores/gameStore';
import { usePlayerStore } from '@/stores/playerStore';
import { useAbilitiesStore } from '@/stores/abilitiesStore';
import { isValidSudoku } from '@/game/sudoku/validator';
import { __DEV__ } from 'react-native';

// More reliable debug mode detection
const isDebugMode = __DEV__ || process.env.NODE_ENV !== 'production';
import { useHintV1 } from '@/game/abilities/hintV1';
import { useHintV2 } from '@/game/abilities/hintV2';
import { useFillRow, useFillColumn, useFillQuadrant } from '@/game/abilities/fillRowColumnQuadrant';
import { useAutofill } from '@/game/abilities/autofill';

export const CompleteSudokuTab = () => {
  const gameStore = useGameStore();
  const playerStore = usePlayerStore();
  const abilitiesStore = useAbilitiesStore();
  const [fillModalOpen, setFillModalOpen] = useState(false);
  const [fillType, setFillType] = useState(null);
  const [isCompleting, setIsCompleting] = useState(false);

  const hintV1 = useHintV1();
  const hintV2 = useHintV2();
  const fillRow = useFillRow();
  const fillColumn = useFillColumn();
  const fillQuadrant = useFillQuadrant();

  useAutofill();

  useEffect(() => {
    if (!gameStore.currentBoard) {
      gameStore.loadNewBoard();
    }
  }, []);

  // Reset ability uses when board changes
  useEffect(() => {
    const abilities = ['hintV1', 'hintV2', 'fillRow', 'fillColumn', 'fillQuadrant'];
    abilities.forEach(abilityId => {
      if (abilitiesStore.isAbilityUnlocked(abilityId)) {
        abilitiesStore.resetAbilityUses(abilityId);
      }
    });
  }, [gameStore.currentBoard]);

  const handleComplete = async () => {
    if (isCompleting) return; // Prevent double-clicks
    
    if (!gameStore.isComplete) {
      console.warn('Cannot complete: board is not complete');
      return;
    }

    if (!gameStore.currentBoard) {
      console.error('Cannot complete: no current board');
      return;
    }

    try {
      setIsCompleting(true);
      
      const isValid = isValidSudoku(gameStore.playerBoard);
      if (isValid) {
        await playerStore.completeSudoku(gameStore.currentBoard.difficulty || 'easy');
        gameStore.loadNewBoard();
        abilitiesStore.checkUnlocks();
      } else {
        // Handle invalid board
        console.warn('Board is invalid, adding mistake');
        playerStore.addMistake();
      }
    } catch (error) {
      console.error('Error completing sudoku:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleRestart = () => {
    gameStore.resetBoard();
  };

  const handleNewSudoku = () => {
    if (abilitiesStore.canUseAbility('newSudoku')) {
      abilitiesStore.useAbility('newSudoku');
      gameStore.loadNewBoard();
    }
  };

  const handleAutofillSudoku = () => {
    if (isDebugMode && gameStore.currentBoard) {
      const { currentBoard } = gameStore;
      // Fill all empty cells with the solution
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (currentBoard.puzzle[row][col] === 0) {
            const correctValue = currentBoard.solution[row][col];
            gameStore.setCell(row, col, correctValue);
          }
        }
      }
    }
  };

  const handleFill = (type) => {
    setFillType(type);
    setFillModalOpen(true);
  };

  const handleFillConfirm = (value) => {
    if (!fillType) return;
    const numValue = parseInt(value);
    
    if (fillType === 'row') {
      fillRow(numValue);
    } else if (fillType === 'column') {
      fillColumn(numValue);
    } else if (fillType === 'quadrant') {
      fillQuadrant(numValue);
    }
    
    setFillModalOpen(false);
    setFillType(null);
  };

  return (
    <VStack space="lg" flex={1} p="$4">
      <SudokuBoard />
      
      <VStack space="sm">
        <HStack space="sm" justifyContent="center" flexWrap="wrap">
          <Button onPress={handleRestart} size="md">
            <ButtonText>Restart</ButtonText>
          </Button>

          {abilitiesStore.isAbilityUnlocked('newSudoku') && (
            <Button
              onPress={handleNewSudoku}
              isDisabled={!abilitiesStore.canUseAbility('newSudoku')}
              size="md"
            >
              <ButtonText>New Sudoku</ButtonText>
            </Button>
          )}

          {gameStore.isComplete && (
            <Button 
              onPress={handleComplete} 
              action="positive" 
              size="md"
              isDisabled={isCompleting}
            >
              <ButtonText>{isCompleting ? 'Completing...' : 'Complete Sudoku'}</ButtonText>
            </Button>
          )}

          {isDebugMode && (
            <Button onPress={handleAutofillSudoku} action="negative" size="md">
              <ButtonText>Autofill Sudoku</ButtonText>
            </Button>
          )}
        </HStack>

        <HStack space="sm" justifyContent="center" flexWrap="wrap">
          {abilitiesStore.isAbilityUnlocked('hintV1') && (
            <Button
              onPress={hintV1}
              isDisabled={!abilitiesStore.canUseAbility('hintV1')}
              size="sm"
              variant="outline"
            >
              <ButtonText>Hint V1</ButtonText>
            </Button>
          )}

          {abilitiesStore.isAbilityUnlocked('hintV2') && (
            <Button
              onPress={hintV2}
              isDisabled={!abilitiesStore.canUseAbility('hintV2')}
              size="sm"
              variant="outline"
            >
              <ButtonText>Hint V2</ButtonText>
            </Button>
          )}

          {abilitiesStore.isAbilityUnlocked('fillRow') && (
            <Button
              onPress={() => handleFill('row')}
              isDisabled={!abilitiesStore.canUseAbility('fillRow')}
              size="sm"
              variant="outline"
            >
              <ButtonText>Fill Row</ButtonText>
            </Button>
          )}

          {abilitiesStore.isAbilityUnlocked('fillColumn') && (
            <Button
              onPress={() => handleFill('column')}
              isDisabled={!abilitiesStore.canUseAbility('fillColumn')}
              size="sm"
              variant="outline"
            >
              <ButtonText>Fill Column</ButtonText>
            </Button>
          )}

          {abilitiesStore.isAbilityUnlocked('fillQuadrant') && (
            <Button
              onPress={() => handleFill('quadrant')}
              isDisabled={!abilitiesStore.canUseAbility('fillQuadrant')}
              size="sm"
              variant="outline"
            >
              <ButtonText>Fill Quadrant</ButtonText>
            </Button>
          )}
        </HStack>
      </VStack>

      <Modal isOpen={fillModalOpen} onClose={() => setFillModalOpen(false)}>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Text>Select {fillType === 'row' ? 'Row' : fillType === 'column' ? 'Column' : 'Quadrant'}</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Select onValueChange={handleFillConfirm}>
              <SelectTrigger variant="outline" size="md">
                <SelectInput placeholder={`Choose ${fillType}`} />
                <SelectIcon mr="$3">
                  <ChevronDownIcon />
                </SelectIcon>
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  {Array.from({ length: 9 }, (_, i) => (
                    <SelectItem key={i} label={`${fillType === 'row' ? 'Row' : fillType === 'column' ? 'Column' : 'Quadrant'} ${i + 1}`} value={i.toString()} />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

