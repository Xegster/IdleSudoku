import React, { useState, useEffect } from 'react';
import { Box, HStack, Button, ButtonText, VStack, Text } from '@gluestack-ui/themed';
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
import ErrorBoundary from '@/components/ErrorBoundary';

export const GameScreen = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('complete');

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
        // Use highestLevel so tab doesn't re-lock when sudokus are spent
        const playerHighestLevel = playerStore.highestLevel || playerStore.level;
        if (playerHighestLevel >= 5) {
          return <IdlersTab />;
        }
        return <Box p={4}>Tab 2 - Locked</Box>;
      default:
        return <Box p={4}>Tab {activeTab} - Coming Soon</Box>;
    }
  };

  return (
    <VStack flex={1} bg="$gray100">
      {/* Top Bar */}
      <HStack
        justifyContent="space-between"
        alignItems="center"
        p={4}
        bg="$white"
        borderBottomWidth={1}
        borderBottomColor="$gray300"
      >
        <Box flex={1}>
          <HStack space="sm" alignItems="center">
            <Text size="md" fontWeight="$semibold" color="$gray700">
              Level:
            </Text>
            <Box
              bg="$green100"
              px="$3"
              py="$1"
              borderRadius="$md"
              borderWidth={1}
              borderColor="$green300"
            >
              <Text size="lg" fontWeight="$bold" color="$green700">
                {playerStore.level}
              </Text>
            </Box>
            <Text size="md" fontWeight="$semibold" color="$gray700">
              Available Sudokus:
            </Text>
            <Box
              bg="$blue100"
              px="$3"
              py="$1"
              borderRadius="$md"
              borderWidth={1}
              borderColor="$blue300"
            >
              <Text size="lg" fontWeight="$bold" color="$blue700">
                {playerStore.availableSudokus}
              </Text>
            </Box>
          </HStack>
        </Box>
        <HStack space="sm">
          <Button
            onPress={() => setSettingsOpen(true)}
            variant="ghost"
            size="sm"
          >
            <ButtonText>⚙️</ButtonText>
          </Button>
          <Button
            onPress={() => setStatsOpen(true)}
            variant="ghost"
            size="sm"
          >
            <ButtonText>📊</ButtonText>
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
        bg="$white"
        borderTopWidth={1}
        borderTopColor="$gray300"
        p={2}
      >
        <Button
          onPress={() => setActiveTab('tab1')}
          isDisabled={true}
          variant="ghost"
          size="sm"
        >
          <ButtonText>1</ButtonText>
        </Button>
        <Button
          onPress={() => setActiveTab('tab2')}
          isDisabled={(playerStore.highestLevel || playerStore.level) < 5}
          variant="ghost"
          size="sm"
        >
          <ButtonText>{(playerStore.highestLevel || playerStore.level) >= 5 ? 'Idlers' : '2'}</ButtonText>
        </Button>
        <Button
          onPress={() => setActiveTab('complete')}
          variant={activeTab === 'complete' ? 'solid' : 'ghost'}
          size="sm"
        >
          <ButtonText>✓</ButtonText>
        </Button>
        <Button
          onPress={() => setActiveTab('tab4')}
          isDisabled={true}
          variant="ghost"
          size="sm"
        >
          <ButtonText>4</ButtonText>
        </Button>
        <Button
          onPress={() => setActiveTab('tab5')}
          isDisabled={true}
          variant="ghost"
          size="sm"
        >
          <ButtonText>5</ButtonText>
        </Button>
      </HStack>

      <ErrorBoundary>
        <SettingsModal
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
        />
      </ErrorBoundary>
      <ErrorBoundary>
        <StatsModal isOpen={statsOpen} onClose={() => setStatsOpen(false)} />
      </ErrorBoundary>
    </VStack>
  );
};

