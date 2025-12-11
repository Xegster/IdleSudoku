import React from 'react';
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
import { usePlayerStore } from '@/stores/playerStore';

export const StatsModal = ({
  isOpen,
  onClose,
}) => {
  const playerStore = usePlayerStore();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading>Statistics</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack space="lg">
            <Box>
              <Text size="lg" fontWeight="$bold">Level</Text>
              <Text size="2xl">{playerStore.level}</Text>
            </Box>

            <Divider />

            <Box>
              <Text size="lg" fontWeight="$bold">Available Sudoku Points</Text>
              <Text size="2xl">{playerStore.availableSudokus}</Text>
            </Box>

            <Divider />

            <Box>
              <Text size="lg" fontWeight="$bold">Total Completed Sudokus</Text>
              <Text size="2xl">{playerStore.totalCompletedSudokus}</Text>
            </Box>

            <Divider />

            <Box>
              <Text size="lg" fontWeight="$bold">Completed by Difficulty</Text>
              <VStack space="sm" mt="$2">
                <HStack justifyContent="space-between">
                  <Text>Easy:</Text>
                  <Text fontWeight="$bold">{playerStore.completedSudokus.easy}</Text>
                </HStack>
                <HStack justifyContent="space-between">
                  <Text>Medium:</Text>
                  <Text fontWeight="$bold">{playerStore.completedSudokus.medium}</Text>
                </HStack>
                <HStack justifyContent="space-between">
                  <Text>Hard:</Text>
                  <Text fontWeight="$bold">{playerStore.completedSudokus.hard}</Text>
                </HStack>
                <HStack justifyContent="space-between">
                  <Text>Advanced:</Text>
                  <Text fontWeight="$bold">{playerStore.completedSudokus.advanced}</Text>
                </HStack>
              </VStack>
            </Box>

            <Divider />

            <Box>
              <Text size="lg" fontWeight="$bold">Lives</Text>
              <Text size="2xl">
                {playerStore.currentLives} / {playerStore.maxLives}
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

