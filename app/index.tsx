import { useEffect } from 'react';
import { GameScreen } from '@/screens/GameScreen';
import { initializeDatabase } from '@/database/db';

export default function Index() {
  useEffect(() => {
    initializeDatabase();
  }, []);

  return <GameScreen />;
}
