import React from 'react';
import { VStack, Box, Text } from '@gluestack-ui/themed';
import { IdlerRow } from './IdlerRow';
import { LockedIdlerRow } from './LockedIdlerRow';
import { useIdlersStore } from '@/stores/idlersStore';
import { usePlayerStore } from '@/stores/playerStore';
import { getIdlers } from '@/config/loadConfig';

export const IdlersList = () => {
  const idlersStore = useIdlersStore();
  const playerStore = usePlayerStore();
  const unlockedIdlers = idlersStore.getUnlockedIdlers();
  const allIdlers = getIdlers();
  // Use highestLevel so next unlock doesn't change when sudokus are spent
  const playerHighestLevel = playerStore.highestLevel || playerStore.level;

  // Find the next idler to be unlocked (first locked idler)
  const nextUnlockIdler = allIdlers.find(idler => playerHighestLevel < idler.unlockLevel);

  return (
    <VStack space="sm" p="$4">
      {allIdlers.map(idler => {
        const isUnlocked = unlockedIdlers.includes(idler.id);
        const isNextUnlock = nextUnlockIdler && idler.id === nextUnlockIdler.id;

        if (isUnlocked) {
          return <IdlerRow key={idler.id} idlerId={idler.id} />;
        } else {
          return (
            <LockedIdlerRow
              key={idler.id}
              idlerId={idler.id}
              isNextUnlock={isNextUnlock}
              unlockLevel={idler.unlockLevel}
            />
          );
        }
      })}
    </VStack>
  );
};

