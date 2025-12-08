import React, { useEffect, useState } from 'react';
import { Box, HStack, VStack, Text, Button, Image, Progress } from 'native-base';
import { getIdlers } from '@/config/loadConfig';
import { useIdlersStore } from '@/stores/idlersStore';
import { usePlayerStore } from '@/stores/playerStore';

interface IdlerRowProps {
  idlerId: string;
}

export const IdlerRow: React.FC<IdlerRowProps> = ({ idlerId }) => {
  const idlerConfig = getIdlers().find(i => i.id === idlerId);
  const idlersStore = useIdlersStore();
  const playerStore = usePlayerStore();
  const [progress, setProgress] = useState(0);

  if (!idlerConfig) return null;

  const progressData = idlersStore.idlerProgress.get(idlerId);
  const currentLevel = progressData?.level || 1;
  const levelConfig = idlerConfig.levels.find(l => l.level === currentLevel);
  
  if (!levelConfig) return null;

  // Initialize idler if it doesn't exist
  useEffect(() => {
    if (!progressData) {
      const now = Date.now();
      idlersStore.saveIdler(idlerId, 1, now);
    }
  }, [idlerId, progressData]);

  const nextLevel = idlerConfig.levels.find(l => l.level === currentLevel + 1);
  const canUpgrade = nextLevel && playerStore.availableSudokus >= nextLevel.upgradeCost;

  useEffect(() => {
    const currentProgress = idlersStore.idlerProgress.get(idlerId);
    if (!currentProgress) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedMs = now - currentProgress.lastUpdateTime;
      const elapsedMinutes = elapsedMs / (1000 * 60);
      const cycleProgress = (elapsedMinutes * levelConfig.ratePerMinute) % 1;
      setProgress(cycleProgress);
      
      // Calculate and add production
      idlersStore.calculateProduction(idlerId);
    }, 100);

    return () => clearInterval(interval);
  }, [idlerId, levelConfig]);

  const handleUpgrade = () => {
    if (canUpgrade) {
      idlersStore.upgradeIdler(idlerId);
    }
  };

  return (
    <Box
      borderWidth={1}
      borderColor="gray.300"
      borderRadius="md"
      p={4}
      mb={2}
      bg="white"
    >
      <HStack space={4} alignItems="center">
        <VStack>
          <Text fontSize="sm" color="gray.500">Level</Text>
          <Text fontSize="xl" fontWeight="bold">{currentLevel}</Text>
        </VStack>

        <Box width={50} height={50} bg="gray.200" borderRadius="md" justifyContent="center" alignItems="center">
          <Text fontSize="xs">{idlerConfig.name.substring(0, 2)}</Text>
        </Box>

        <VStack flex={1}>
          <Text fontSize="sm" fontWeight="bold">{idlerConfig.name}</Text>
          <Text fontSize="xs" color="gray.500">
            {levelConfig.sudokusProduced} sudokus per cycle
          </Text>
          <Text fontSize="xs" color="gray.500">
            {levelConfig.ratePerMinute} cycles per minute
          </Text>
          <Progress value={progress * 100} colorScheme="blue" mt={2} />
        </VStack>

        <Button
          onPress={handleUpgrade}
          isDisabled={!canUpgrade || !nextLevel}
          size="sm"
        >
          {nextLevel ? `Upgrade (${nextLevel.upgradeCost})` : 'Max Level'}
        </Button>
      </HStack>
    </Box>
  );
};
