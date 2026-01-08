import React, { useState, useEffect } from 'react';
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
  Button,
  ButtonText,
  Heading,
  Divider,
} from '@gluestack-ui/themed';
import { Alert, Switch } from 'react-native';
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
  // Hooks must be called unconditionally
  const settingsStore = useSettingsStore();
  const abilitiesStore = useAbilitiesStore();
  const playerStore = usePlayerStore();
  const idlersStore = useIdlersStore();
  const gameStore = useGameStore();

  const [isResetting, setIsResetting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Safely check if abilities are unlocked with error handling
  let autofillUnlocked = false;
  let checkAnswersUnlocked = false;
  
  try {
    if (abilitiesStore && typeof abilitiesStore.isAbilityUnlocked === 'function') {
      autofillUnlocked = abilitiesStore.isAbilityUnlocked('autofill');
      checkAnswersUnlocked = abilitiesStore.isAbilityUnlocked('checkAnswers');
    }
  } catch (error) {
    console.error('Error checking ability unlocks:', error);
  }

  // Reset error state when modal opens
  useEffect(() => {
    if (isOpen) {
      setHasError(false);
      setErrorMessage(null);
    }
  }, [isOpen]);


  const executeReset = async () => {
    setIsResetting(true);
    setHasError(false);
    setErrorMessage(null);
    
    try {
      console.log('Starting game reset...');
      
      // Validate stores exist before using them
      if (!playerStore || !idlersStore || !abilitiesStore || !gameStore) {
        throw new Error('One or more stores are not available');
      }
      
      // Reset all stores with error handling
      console.log('Resetting player data...');
      if (playerStore.resetGame && typeof playerStore.resetGame === 'function') {
        await playerStore.resetGame();
      } else {
        console.warn('playerStore.resetGame is not available');
      }
      
      console.log('Resetting idlers...');
      if (idlersStore.resetIdlers && typeof idlersStore.resetIdlers === 'function') {
        await idlersStore.resetIdlers();
      } else {
        console.warn('idlersStore.resetIdlers is not available');
      }
      
      console.log('Resetting abilities...');
      if (abilitiesStore.resetAbilities && typeof abilitiesStore.resetAbilities === 'function') {
        await abilitiesStore.resetAbilities();
      } else {
        console.warn('abilitiesStore.resetAbilities is not available');
      }
      
      console.log('Resetting game state...');
      if (gameStore.resetGameState && typeof gameStore.resetGameState === 'function') {
        gameStore.resetGameState();
      } else {
        console.warn('gameStore.resetGameState is not available');
      }
      
      // Reload data
      console.log('Reloading player data...');
      if (playerStore.loadPlayerData && typeof playerStore.loadPlayerData === 'function') {
        await playerStore.loadPlayerData();
      }
      
      console.log('Reloading idlers...');
      if (idlersStore.loadIdlers && typeof idlersStore.loadIdlers === 'function') {
        await idlersStore.loadIdlers();
      }
      
      console.log('Reloading abilities...');
      if (abilitiesStore.loadAbilities && typeof abilitiesStore.loadAbilities === 'function') {
        await abilitiesStore.loadAbilities();
      }
      
      // Load a new board
      console.log('Loading new board...');
      if (gameStore.loadNewBoard && typeof gameStore.loadNewBoard === 'function') {
        gameStore.loadNewBoard('easy');
      }
      
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
      setHasError(true);
      setErrorMessage(error.message || 'Unknown error occurred');
      
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

  // Don't render modal if stores aren't available
  if (!settingsStore || !abilitiesStore || !playerStore || !idlersStore || !gameStore) {
    if (!isOpen) return null;
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading>Settings</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text color="$red600">Error: Stores not initialized. Please restart the app.</Text>
          </ModalBody>
          <ModalFooter>
            <Button onPress={onClose}>
              <ButtonText>Close</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  // Don't render if modal is closed
  if (!isOpen) return null;

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
            {hasError && errorMessage && (
              <Box bg="$red50" p="$2" borderRadius="$md" mb="$2">
                <Text size="sm" color="$red600">{errorMessage}</Text>
              </Box>
            )}
            
            <HStack justifyContent="space-between" alignItems="center">
              <Text size="md">Sound</Text>
              <Switch
                value={settingsStore?.soundEnabled ?? true}
                onValueChange={() => {
                  try {
                    if (settingsStore?.toggleSound) {
                      settingsStore.toggleSound();
                    }
                  } catch (error) {
                    console.error('Error toggling sound:', error);
                    setHasError(true);
                    setErrorMessage('Failed to toggle sound setting');
                  }
                }}
              />
            </HStack>

            {checkAnswersUnlocked && (
              <HStack justifyContent="space-between" alignItems="center">
                <Text size="md">Check Answers</Text>
                <Switch
                  value={settingsStore?.checkAnswersEnabled ?? false}
                  onValueChange={() => {
                    try {
                      if (settingsStore?.toggleCheckAnswers) {
                        settingsStore.toggleCheckAnswers();
                      }
                    } catch (error) {
                      console.error('Error toggling check answers:', error);
                      setHasError(true);
                      setErrorMessage('Failed to toggle check answers setting');
                    }
                  }}
                />
              </HStack>
            )}

            {autofillUnlocked && (
              <HStack justifyContent="space-between" alignItems="center">
                <Text size="md">Autofill</Text>
                <Switch
                  value={settingsStore?.autofillEnabled ?? false}
                  onValueChange={() => {
                    try {
                      if (settingsStore?.toggleAutofill) {
                        settingsStore.toggleAutofill();
                      }
                    } catch (error) {
                      console.error('Error toggling autofill:', error);
                      setHasError(true);
                      setErrorMessage('Failed to toggle autofill setting');
                    }
                  }}
                />
              </HStack>
            )}

            {isDebugMode && (
              <HStack justifyContent="space-between" alignItems="center">
                <Text size="md">Debug Errors</Text>
                <Switch
                  value={settingsStore?.debugErrorsEnabled ?? true}
                  onValueChange={() => {
                    try {
                      if (settingsStore?.toggleDebugErrors) {
                        settingsStore.toggleDebugErrors();
                      }
                    } catch (error) {
                      console.error('Error toggling debug errors:', error);
                      setHasError(true);
                      setErrorMessage('Failed to toggle debug errors setting');
                    }
                  }}
                />
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
