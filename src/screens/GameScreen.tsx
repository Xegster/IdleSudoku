import React, { useState, useEffect } from 'react';
import { Box, HStack, Button, VStack } from 'native-base';
import { SettingsModal } from '@/components/modals/SettingsModal';
import { StatsModal } from '@/components/modals/StatsModal';
import { CompleteSudokuTab } from './tabs/CompleteSudokuTab';
import { IdlersTab } from './tabs/IdlersTab';
import { usePlayerStore } from '@/stores/playerStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useAbilitiesStore } from '@/stores/abilitiesStore';
import { useIdlersStore } from '@/stores/idlersStore';
import { useGameStore } from '@/stores/gameStore';
import { setupAppLifecycle } from '@/utils/appLifecycle';

type Tab = 'tab1' | 'tab2' | 'complete' | 'tab4' | 'tab5';

export const GameScreen: React.FC = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('complete');

  const playerStore = usePlayerStore();
  const settingsStore = useSettingsStore();
  const abilitiesStore = useAbilitiesStore();
  const idlersStore = useIdlersStore();
  const gameStore = useGameStore();

  useEffect(() => {
    const initialize = async () => {
      await playerStore.loadPlayerData();
      await settingsStore.loadSettings();
      await abilitiesStore.loadAbilities();
      await idlersStore.loadIdlers();
      abilitiesStore.checkUnlocks();
      
      // Calculate idler production on startup
      idlersStore.idlerProgress.forEach((progress, idlerId) => {
        idlersStore.calculateProduction(idlerId);
      });
    };
    initialize();

    // Setup app lifecycle handlers
    const cleanup = setupAppLifecycle();
    return cleanup;
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'complete':
        return <CompleteSudokuTab />;
      case 'tab2':
        if (playerStore.level >= 5) {
          return <IdlersTab />;
        }
        return <Box p={4}>Tab 2 - Locked</Box>;
      default:
        return <Box p={4}>Tab {activeTab} - Coming Soon</Box>;
    }
  };

  return (
    <VStack flex={1} bg="gray.100">
      {/* Top Bar */}
      <HStack
        justifyContent="space-between"
        alignItems="center"
        p={4}
        bg="white"
        borderBottomWidth={1}
        borderBottomColor="gray.300"
      >
        <Box flex={1} />
        <HStack space={2}>
          <Button
            onPress={() => setSettingsOpen(true)}
            variant="ghost"
            size="sm"
          >
            ⚙️
          </Button>
          <Button
            onPress={() => setStatsOpen(true)}
            variant="ghost"
            size="sm"
          >
            📊
          </Button>
        </HStack>
      </HStack>

      {/* Main Content */}
      <Box flex={1}>
        {renderTabContent()}
      </Box>

      {/* Bottom Tab Bar */}
      <HStack
        justifyContent="space-around"
        alignItems="center"
        bg="white"
        borderTopWidth={1}
        borderTopColor="gray.300"
        p={2}
      >
        <Button
          onPress={() => setActiveTab('tab1')}
          isDisabled={true}
          variant="ghost"
          size="sm"
        >
          1
        </Button>
        <Button
          onPress={() => setActiveTab('tab2')}
          isDisabled={playerStore.level < 5}
          variant="ghost"
          size="sm"
        >
          {playerStore.level >= 5 ? 'Idlers' : '2'}
        </Button>
        <Button
          onPress={() => setActiveTab('complete')}
          variant={activeTab === 'complete' ? 'solid' : 'ghost'}
          size="sm"
        >
          ✓
        </Button>
        <Button
          onPress={() => setActiveTab('tab4')}
          isDisabled={true}
          variant="ghost"
          size="sm"
        >
          4
        </Button>
        <Button
          onPress={() => setActiveTab('tab5')}
          isDisabled={true}
          variant="ghost"
          size="sm"
        >
          5
        </Button>
      </HStack>

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
      <StatsModal isOpen={statsOpen} onClose={() => setStatsOpen(false)} />
    </VStack>
  );
};
