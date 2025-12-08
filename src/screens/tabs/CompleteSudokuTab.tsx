import React, { useEffect, useState } from 'react';
import { VStack, Button, HStack, Box, Text, Modal, Select, CheckIcon } from 'native-base';
import { SudokuBoard } from '@/components/sudoku/SudokuBoard';
import { useGameStore } from '@/stores/gameStore';
import { usePlayerStore } from '@/stores/playerStore';
import { useAbilitiesStore } from '@/stores/abilitiesStore';
import { isValidSudoku } from '@/game/sudoku/validator';
import { __DEV__ } from 'react-native';
import { useHintV1 } from '@/game/abilities/hintV1';
import { useHintV2 } from '@/game/abilities/hintV2';
import { useFillRow, useFillColumn, useFillQuadrant } from '@/game/abilities/fillRowColumnQuadrant';
import { useAutofill } from '@/game/abilities/autofill';

export const CompleteSudokuTab: React.FC = () => {
  const gameStore = useGameStore();
  const playerStore = usePlayerStore();
  const abilitiesStore = useAbilitiesStore();
  const [fillModalOpen, setFillModalOpen] = useState(false);
  const [fillType, setFillType] = useState<'row' | 'column' | 'quadrant' | null>(null);

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
    if (!gameStore.isComplete) return;

    const isValid = isValidSudoku(gameStore.playerBoard);
    if (isValid) {
      await playerStore.completeSudoku(gameStore.currentBoard?.difficulty || 'easy');
      gameStore.loadNewBoard();
      abilitiesStore.checkUnlocks();
    } else {
      // Handle invalid board
      playerStore.addMistake();
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

  const handleDebugComplete = () => {
    if (__DEV__) {
      playerStore.completeSudoku(gameStore.currentBoard?.difficulty || 'easy');
      gameStore.loadNewBoard();
      abilitiesStore.checkUnlocks();
    }
  };

  const handleFill = (type: 'row' | 'column' | 'quadrant') => {
    setFillType(type);
    setFillModalOpen(true);
  };

  const handleFillConfirm = (value: string) => {
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
    <VStack space={4} flex={1} p={4}>
      <SudokuBoard />
      
      <VStack space={2}>
        <HStack space={2} justifyContent="center" flexWrap="wrap">
          <Button onPress={handleRestart} size="md">
            Restart
          </Button>

          {abilitiesStore.isAbilityUnlocked('newSudoku') && (
            <Button
              onPress={handleNewSudoku}
              isDisabled={!abilitiesStore.canUseAbility('newSudoku')}
              size="md"
            >
              New Sudoku
            </Button>
          )}

          {gameStore.isComplete && (
            <Button onPress={handleComplete} colorScheme="green" size="md">
              Complete Sudoku
            </Button>
          )}

          {__DEV__ && (
            <Button onPress={handleDebugComplete} colorScheme="red" size="md">
              Complete Now (Debug)
            </Button>
          )}
        </HStack>

        <HStack space={2} justifyContent="center" flexWrap="wrap">
          {abilitiesStore.isAbilityUnlocked('hintV1') && (
            <Button
              onPress={hintV1}
              isDisabled={!abilitiesStore.canUseAbility('hintV1')}
              size="sm"
              variant="outline"
            >
              Hint V1
            </Button>
          )}

          {abilitiesStore.isAbilityUnlocked('hintV2') && (
            <Button
              onPress={hintV2}
              isDisabled={!abilitiesStore.canUseAbility('hintV2')}
              size="sm"
              variant="outline"
            >
              Hint V2
            </Button>
          )}

          {abilitiesStore.isAbilityUnlocked('fillRow') && (
            <Button
              onPress={() => handleFill('row')}
              isDisabled={!abilitiesStore.canUseAbility('fillRow')}
              size="sm"
              variant="outline"
            >
              Fill Row
            </Button>
          )}

          {abilitiesStore.isAbilityUnlocked('fillColumn') && (
            <Button
              onPress={() => handleFill('column')}
              isDisabled={!abilitiesStore.canUseAbility('fillColumn')}
              size="sm"
              variant="outline"
            >
              Fill Column
            </Button>
          )}

          {abilitiesStore.isAbilityUnlocked('fillQuadrant') && (
            <Button
              onPress={() => handleFill('quadrant')}
              isDisabled={!abilitiesStore.canUseAbility('fillQuadrant')}
              size="sm"
              variant="outline"
            >
              Fill Quadrant
            </Button>
          )}
        </HStack>
      </VStack>

      <Modal isOpen={fillModalOpen} onClose={() => setFillModalOpen(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>
            Select {fillType === 'row' ? 'Row' : fillType === 'column' ? 'Column' : 'Quadrant'}
          </Modal.Header>
          <Modal.Body>
            <Select
              placeholder={`Choose ${fillType}`}
              selectedValue=""
              onValueChange={handleFillConfirm}
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />
              }}
            >
              {Array.from({ length: 9 }, (_, i) => (
                <Select.Item key={i} label={`${fillType === 'row' ? 'Row' : fillType === 'column' ? 'Column' : 'Quadrant'} ${i + 1}`} value={i.toString()} />
              ))}
            </Select>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </VStack>
  );
};
