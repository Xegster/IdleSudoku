import levelsConfig from '../../data/levels.json';
import abilitiesConfig from '../../data/abilities.json';
import idlersConfig from '../../data/idlers.json';
import { LevelRequirement, AbilityConfig, IdlerConfig } from '@/types';

export function getLevelRequirements(): LevelRequirement[] {
  return levelsConfig.levelRequirements;
}

export function getAbilities(): AbilityConfig[] {
  return abilitiesConfig.abilities;
}

export function getIdlers(): IdlerConfig[] {
  return idlersConfig.idlers;
}
