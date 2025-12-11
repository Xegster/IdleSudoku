import levelsConfig from '../../data/levels.json';
import abilitiesConfig from '../../data/abilities.json';
import idlersConfig from '../../data/idlers.json';

export function getLevelRequirements() {
  return levelsConfig.levelRequirements;
}

export function getAbilities() {
  return abilitiesConfig.abilities;
}

export function getIdlers() {
  return idlersConfig.idlers;
}

