import React, { useEffect, useState } from 'react';
import { Box, HStack, VStack, Text, Button, ButtonText, Image, Progress, ProgressFilledTrack } from '@gluestack-ui/themed';
import { getIdlers } from '@/config/loadConfig';
import { useIdlersStore } from '@/stores/idlersStore';
import { usePlayerStore } from '@/stores/playerStore';
import { getIdlerImageSource } from '@/config/idlerImages';

export const IdlerRow = ({ idlerId }) => {
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
      borderColor="$gray300"
      borderRadius="$md"
      p="$4"
      mb="$2"
      bg="$white"
    >
      <HStack space="lg" alignItems="center">
        <VStack>
          <Text size="sm" color="$gray500">Level</Text>
          <Text size="xl" fontWeight="$bold">{currentLevel}</Text>
        </VStack>

        <Box width={50} height={50} bg="$gray200" borderRadius="$md" overflow="hidden" justifyContent="center" alignItems="center">
          {(() => {
            const imageSource = getIdlerImageSource(idlerConfig.image);
            if (imageSource) {
              return (
                <Image
                  source={imageSource}
                  alt={idlerConfig.name}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="contain"
                />
              );
            }
            return <Text size="xs">{idlerConfig.name.substring(0, 2)}</Text>;
          })()}
        </Box>

        <VStack flex={1}>
          <Text size="sm" fontWeight="$bold">{idlerConfig.name}</Text>
          <Text size="xs" color="$gray500">
            {levelConfig.sudokusProduced} sudokus per cycle
          </Text>
          <Text size="xs" color="$gray500">
            {levelConfig.ratePerMinute} cycles per minute
          </Text>
          <Progress value={progress * 100} mt="$2">
            <ProgressFilledTrack />
          </Progress>
        </VStack>

        <Button
          onPress={handleUpgrade}
          isDisabled={!canUpgrade || !nextLevel}
          size="sm"
        >
          <ButtonText>{nextLevel ? `Upgrade (${nextLevel.upgradeCost})` : 'Max Level'}</ButtonText>
        </Button>
      </HStack>
    </Box>
  );
};

