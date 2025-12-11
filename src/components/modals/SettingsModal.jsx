import React from 'react';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  VStack,
  HStack,
  Text,
  Switch,
  SwitchTrack,
  SwitchThumb,
  Button,
  ButtonText,
  Heading,
} from '@gluestack-ui/themed';
import { useSettingsStore } from '@/stores/settingsStore';
import { useAbilitiesStore } from '@/stores/abilitiesStore';

export const SettingsModal = ({
  isOpen,
  onClose,
}) => {
  const settingsStore = useSettingsStore();
  const abilitiesStore = useAbilitiesStore();
  const autofillUnlocked = abilitiesStore.isAbilityUnlocked('autofill');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading>Settings</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack space="md">
            <HStack justifyContent="space-between" alignItems="center">
              <Text size="md">Sound</Text>
              <Switch
                value={settingsStore.soundEnabled}
                onValueChange={settingsStore.toggleSound}
              >
                <SwitchTrack>
                  <SwitchThumb />
                </SwitchTrack>
              </Switch>
            </HStack>

            {abilitiesStore.isAbilityUnlocked('checkAnswers') && (
              <HStack justifyContent="space-between" alignItems="center">
                <Text size="md">Check Answers</Text>
                <Switch
                  value={settingsStore.checkAnswersEnabled}
                  onValueChange={settingsStore.toggleCheckAnswers}
                >
                  <SwitchTrack>
                    <SwitchThumb />
                  </SwitchTrack>
                </Switch>
              </HStack>
            )}

            {autofillUnlocked && (
              <HStack justifyContent="space-between" alignItems="center">
                <Text size="md">Autofill</Text>
                <Switch
                  value={settingsStore.autofillEnabled}
                  onValueChange={settingsStore.toggleAutofill}
                >
                  <SwitchTrack>
                    <SwitchThumb />
                  </SwitchTrack>
                </Switch>
              </HStack>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button onPress={onClose}>
            <ButtonText>Close</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

