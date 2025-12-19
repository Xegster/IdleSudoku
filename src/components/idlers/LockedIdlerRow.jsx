import React from 'react';
import { Box, HStack, VStack, Text } from '@gluestack-ui/themed';
import { getIdlers } from '@/config/loadConfig';

export const LockedIdlerRow = ({ idlerId, isNextUnlock, unlockLevel }) => {
  const idlerConfig = getIdlers().find(i => i.id === idlerId);

  if (!idlerConfig) return null;

  return (
    <Box
      borderWidth={1}
      borderColor="$gray300"
      borderRadius="$md"
      p="$4"
      mb="$2"
      bg="$gray100"
      opacity={0.6}
    >
      <HStack space="lg" alignItems="center">
        <VStack>
          <Text size="sm" color="$gray500">Level</Text>
          <Text size="xl" fontWeight="$bold" color="$gray400">-</Text>
        </VStack>

        <Box width={50} height={50} bg="$gray200" borderRadius="$md" borderWidth={1} borderColor="$gray300" />

        <VStack flex={1}>
          <Text size="sm" fontWeight="$bold" color="$gray500">{idlerConfig.name}</Text>
          {isNextUnlock ? (
            <Text size="xs" color="$blue600" fontWeight="$semibold" mt="$1">
              Unlocked at level {unlockLevel}
            </Text>
          ) : (
            <Text size="xs" color="$gray400" mt="$1">
              Locked
            </Text>
          )}
        </VStack>
      </HStack>
    </Box>
  );
};

