import React, { useEffect } from 'react';
import { Box } from 'native-base';
import { IdlersList } from '@/components/idlers/IdlersList';
import { usePlayerStore } from '@/stores/playerStore';
import { useIdlersStore } from '@/stores/idlersStore';

export const IdlersTab: React.FC = () => {
  const playerStore = usePlayerStore();
  const idlersStore = useIdlersStore();

  useEffect(() => {
    idlersStore.loadIdlers();
  }, []);

  if (playerStore.level < 5) {
    return (
      <Box p={4} alignItems="center" justifyContent="center" flex={1}>
        <Box>Reach level 5 to unlock idlers!</Box>
      </Box>
    );
  }

  return <IdlersList />;
};
