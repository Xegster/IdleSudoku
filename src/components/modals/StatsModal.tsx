import React from 'react';
import {
  Modal,
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Heading,
  Divider,
} from 'native-base';
import { usePlayerStore } from '@/stores/playerStore';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const playerStore = usePlayerStore();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>
          <Heading>Statistics</Heading>
        </Modal.Header>
        <Modal.Body>
          <VStack space={4}>
            <Box>
              <Text fontSize="lg" fontWeight="bold">Level</Text>
              <Text fontSize="2xl">{playerStore.level}</Text>
            </Box>

            <Divider />

            <Box>
              <Text fontSize="lg" fontWeight="bold">Available Sudoku Points</Text>
              <Text fontSize="2xl">{playerStore.availableSudokus}</Text>
            </Box>

            <Divider />

            <Box>
              <Text fontSize="lg" fontWeight="bold">Total Completed Sudokus</Text>
              <Text fontSize="2xl">{playerStore.totalCompletedSudokus}</Text>
            </Box>

            <Divider />

            <Box>
              <Text fontSize="lg" fontWeight="bold">Completed by Difficulty</Text>
              <VStack space={2} mt={2}>
                <HStack justifyContent="space-between">
                  <Text>Easy:</Text>
                  <Text fontWeight="bold">{playerStore.completedSudokus.easy}</Text>
                </HStack>
                <HStack justifyContent="space-between">
                  <Text>Medium:</Text>
                  <Text fontWeight="bold">{playerStore.completedSudokus.medium}</Text>
                </HStack>
                <HStack justifyContent="space-between">
                  <Text>Hard:</Text>
                  <Text fontWeight="bold">{playerStore.completedSudokus.hard}</Text>
                </HStack>
                <HStack justifyContent="space-between">
                  <Text>Advanced:</Text>
                  <Text fontWeight="bold">{playerStore.completedSudokus.advanced}</Text>
                </HStack>
              </VStack>
            </Box>

            <Divider />

            <Box>
              <Text fontSize="lg" fontWeight="bold">Lives</Text>
              <Text fontSize="2xl">
                {playerStore.currentLives} / {playerStore.maxLives}
              </Text>
            </Box>
          </VStack>
        </Modal.Body>
        <Modal.Footer>
          <Button onPress={onClose}>Close</Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
