import React from 'react';
import {
  Modal,
  Box,
  VStack,
  HStack,
  Text,
  Switch,
  Button,
  Heading,
} from 'native-base';
import { useSettingsStore } from '@/stores/settingsStore';
import { useAbilitiesStore } from '@/stores/abilitiesStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const settingsStore = useSettingsStore();
  const abilitiesStore = useAbilitiesStore();
  const autofillUnlocked = abilitiesStore.isAbilityUnlocked('autofill');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>
          <Heading>Settings</Heading>
        </Modal.Header>
        <Modal.Body>
          <VStack space={4}>
            <HStack justifyContent="space-between" alignItems="center">
              <Text fontSize="md">Sound</Text>
              <Switch
                isChecked={settingsStore.soundEnabled}
                onToggle={settingsStore.toggleSound}
              />
            </HStack>

            {abilitiesStore.isAbilityUnlocked('checkAnswers') && (
              <HStack justifyContent="space-between" alignItems="center">
                <Text fontSize="md">Check Answers</Text>
                <Switch
                  isChecked={settingsStore.checkAnswersEnabled}
                  onToggle={settingsStore.toggleCheckAnswers}
                />
              </HStack>
            )}

            {autofillUnlocked && (
              <HStack justifyContent="space-between" alignItems="center">
                <Text fontSize="md">Autofill</Text>
                <Switch
                  isChecked={settingsStore.autofillEnabled}
                  onToggle={settingsStore.toggleAutofill}
                />
              </HStack>
            )}
          </VStack>
        </Modal.Body>
        <Modal.Footer>
          <Button onPress={onClose}>Close</Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
