import React, { useState } from 'react';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  VStack,
  HStack,
  Text,
  Switch,
  SwitchTrack,
  SwitchThumb,
  Button,
  ButtonText,
  Heading,
  Divider,
} from '@gluestack-ui/themed';
import { Alert } from 'react-native';
import { useSettingsStore } from '@/stores/settingsStore';
import { useAbilitiesStore } from '@/stores/abilitiesStore';
import { usePlayerStore } from '@/stores/playerStore';
import { useIdlersStore } from '@/stores/idlersStore';
import { useGameStore } from '@/stores/gameStore';
import { __DEV__ } from 'react-native';

// More reliable debug mode detection
const isDebugMode = __DEV__ || process.env.NODE_ENV !== 'production';

export const SettingsModal = ({
  isOpen,
  onClose,
}) => {
  const settingsStore = useSettingsStore();
  const abilitiesStore = useAbilitiesStore();
  const playerStore = usePlayerStore();
  const idlersStore = useIdlersStore();
  const gameStore = useGameStore();
  const autofillUnlocked = abilitiesStore.isAbilityUnlocked('autofill');
  const [isResetting, setIsResetting] = useState(false);

  const executeReset = async () => {
    setIsResetting(true);
    try {
      console.log('Starting game reset...');
      
      // Reset all stores
      console.log('Resetting player data...');
      await playerStore.resetGame();
      
      console.log('Resetting idlers...');
      await idlersStore.resetIdlers();
      
      console.log('Resetting abilities...');
      await abilitiesStore.resetAbilities();
      
      console.log('Resetting game state...');
      gameStore.resetGameState();
      
      // Reload data
      console.log('Reloading player data...');
      await playerStore.loadPlayerData();
      
      console.log('Reloading idlers...');
      await idlersStore.loadIdlers();
      
      console.log('Reloading abilities...');
      await abilitiesStore.loadAbilities();
      
      // Load a new board
      console.log('Loading new board...');
      gameStore.loadNewBoard('easy');
      
      console.log('Reset complete!');
      
      const isWeb = typeof window !== 'undefined';
      if (isWeb) {
        window.alert('Success! Game has been reset to the beginning.');
      } else {
        Alert.alert('Success', 'Game has been reset to the beginning.');
      }
      onClose();
    } catch (error) {
      console.error('Error resetting game:', error);
      console.error('Error stack:', error.stack);
      const isWeb = typeof window !== 'undefined';
      if (isWeb) {
        window.alert(`Error: Failed to reset game: ${error.message}. Please check the console for details.`);
      } else {
        Alert.alert('Error', `Failed to reset game: ${error.message}. Please check the console for details.`);
      }
    } finally {
      setIsResetting(false);
    }
  };

  const handleResetGame = () => {
    console.log('Reset game button clicked');
    
    // Use window.confirm for web, Alert.alert for native
    const isWeb = typeof window !== 'undefined';
    
    if (isWeb) {
      const confirmed = window.confirm(
        'Are you sure you want to reset all game progress? This will reset your level, sudokus, idlers, and abilities. This action cannot be undone.'
      );
      if (!confirmed) return;
      
      // Execute reset directly on web
      executeReset();
    } else {
      Alert.alert(
        'Reset Game',
        'Are you sure you want to reset all game progress? This will reset your level, sudokus, idlers, and abilities. This action cannot be undone.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Reset',
            style: 'destructive',
            onPress: executeReset,
          },
        ]
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading>Settings</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack space="md">
            <HStack justifyContent="space-between" alignItems="center">
              <Text size="md">Sound</Text>
              <Switch
                value={settingsStore.soundEnabled}
                onValueChange={settingsStore.toggleSound}
              >
                <SwitchTrack>
                  <SwitchThumb />
                </SwitchTrack>
              </Switch>
            </HStack>

            {abilitiesStore.isAbilityUnlocked('checkAnswers') && (
              <HStack justifyContent="space-between" alignItems="center">
                <Text size="md">Check Answers</Text>
                <Switch
                  value={settingsStore.checkAnswersEnabled}
                  onValueChange={settingsStore.toggleCheckAnswers}
                >
                  <SwitchTrack>
                    <SwitchThumb />
                  </SwitchTrack>
                </Switch>
              </HStack>
            )}

            {autofillUnlocked && (
              <HStack justifyContent="space-between" alignItems="center">
                <Text size="md">Autofill</Text>
                <Switch
                  value={settingsStore.autofillEnabled}
                  onValueChange={settingsStore.toggleAutofill}
                >
                  <SwitchTrack>
                    <SwitchThumb />
                  </SwitchTrack>
                </Switch>
              </HStack>
            )}

            {isDebugMode && (
              <HStack justifyContent="space-between" alignItems="center">
                <Text size="md">Debug Errors</Text>
                <Switch
                  value={settingsStore.debugErrorsEnabled}
                  onValueChange={settingsStore.toggleDebugErrors}
                >
                  <SwitchTrack>
                    <SwitchThumb />
                  </SwitchTrack>
                </Switch>
              </HStack>
            )}

            <Divider mt="$4" />

            <Box>
              <Text size="md" fontWeight="$bold" mb="$2" color="$red600">
                Danger Zone
              </Text>
              <Button
                onPress={handleResetGame}
                isDisabled={isResetting}
                variant="outline"
                action="negative"
                size="md"
              >
                <ButtonText color="$red600">
                  {isResetting ? 'Resetting...' : 'Reset Game'}
                </ButtonText>
              </Button>
              <Text size="xs" color="$gray500" mt="$1">
                Reset all progress and start from the beginning
              </Text>
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button onPress={onClose}>
            <ButtonText>Close</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
