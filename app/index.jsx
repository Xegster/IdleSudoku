import { useEffect, useState } from 'react';
import { GameScreen } from '@/screens/GameScreen';
import { initializeDatabase } from '@/database/db';
import { Box, Text } from '@gluestack-ui/themed';

export default function Index() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeDatabase();
        setDbReady(true);
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };
    init();
  }, []);

  if (!dbReady) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Text>Loading...</Text>
      </Box>
    );
  }

  return <GameScreen />;
}

