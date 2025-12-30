import React, { useEffect } from 'react';
import { Box } from '@gluestack-ui/themed';
import { IdlersList } from '@/components/idlers/IdlersList';
import { usePlayerStore } from '@/stores/playerStore';
import { useIdlersStore } from '@/stores/idlersStore';

export const IdlersTab = () => {
  const playerStore = usePlayerStore();
  const idlersStore = useIdlersStore();

  useEffect(() => {
    idlersStore.loadIdlers();
  }, []);

  // Use highestLevel instead of level so idlers tab doesn't re-lock when sudokus are spent
  const playerHighestLevel = playerStore.highestLevel || playerStore.level;
  if (playerHighestLevel < 5) {
    return (
      <Box p={4} alignItems="center" justifyContent="center" flex={1}>
        <Box>Reach level 5 to unlock idlers!</Box>
      </Box>
    );
  }

  return <IdlersList />;
};

