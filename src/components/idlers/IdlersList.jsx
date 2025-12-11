import React from 'react';
import { VStack, Box, Text } from '@gluestack-ui/themed';
import { IdlerRow } from './IdlerRow';
import { useIdlersStore } from '@/stores/idlersStore';

export const IdlersList = () => {
  const idlersStore = useIdlersStore();
  const unlockedIdlers = idlersStore.getUnlockedIdlers();

  if (unlockedIdlers.length === 0) {
    return (
      <Box p={4} alignItems="center">
        <Text>No idlers unlocked yet. Reach level 5 to unlock!</Text>
      </Box>
    );
  }

  return (
    <VStack space="sm" p="$4">
      {unlockedIdlers.map(idlerId => (
        <IdlerRow key={idlerId} idlerId={idlerId} />
      ))}
    </VStack>
  );
};

