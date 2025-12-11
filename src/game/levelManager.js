import { getLevelRequirements } from '@/config/loadConfig';

export function calculateLevel(availableSudokus) {
  const requirements = getLevelRequirements();
  let level = 1;
  
  for (const req of requirements) {
    if (availableSudokus >= req.requiredSudokus) {
      level = req.level;
    } else {
      break;
    }
  }
  
  return level;
}

export function getMaxLives(level) {
  if (level >= 4) return 5;
  if (level >= 2) return 3;
  return 1;
}

