import { getDatabase } from './db';
import { PlayerData, CompletedSudokus, IdlerProgress, Settings, AbilityUnlock } from '@/types';

export async function getPlayerData(): Promise<PlayerData | null> {
  const db = getDatabase();
  const result = await db.getFirstAsync<PlayerData>(
    'SELECT * FROM player WHERE id = 1'
  );
  return result;
}

export async function updatePlayerData(data: Partial<PlayerData>): Promise<void> {
  const db = getDatabase();
  const fields = Object.keys(data);
  const values = Object.values(data);
  const setClause = fields.map(f => `${f} = ?`).join(', ');
  
  await db.runAsync(
    `UPDATE player SET ${setClause} WHERE id = 1`,
    values
  );
}

export async function getCompletedSudokus(): Promise<CompletedSudokus> {
  const db = getDatabase();
  const results = await db.getAllAsync<{ difficulty: string; count: number }>(
    'SELECT difficulty, count FROM completedSudokus'
  );
  
  const completed: CompletedSudokus = {
    easy: 0,
    medium: 0,
    hard: 0,
    advanced: 0,
  };
  
  results.forEach(row => {
    const difficulty = row.difficulty as keyof CompletedSudokus;
    if (difficulty in completed) {
      completed[difficulty] = row.count;
    }
  });
  
  return completed;
}

export async function incrementCompletedSudoku(difficulty: keyof CompletedSudokus): Promise<void> {
  const db = getDatabase();
  await db.runAsync(
    'UPDATE completedSudokus SET count = count + 1 WHERE difficulty = ?',
    [difficulty]
  );
}

export async function getIdlerProgress(idlerId: string): Promise<IdlerProgress | null> {
  const db = getDatabase();
  return await db.getFirstAsync<IdlerProgress>(
    'SELECT * FROM idlerProgress WHERE idlerId = ?',
    [idlerId]
  );
}

export async function getAllIdlerProgress(): Promise<IdlerProgress[]> {
  const db = getDatabase();
  return await db.getAllAsync<IdlerProgress>('SELECT * FROM idlerProgress');
}

export async function updateIdlerProgress(idlerId: string, level: number, lastUpdateTime: number): Promise<void> {
  const db = getDatabase();
  await db.runAsync(
    'INSERT OR REPLACE INTO idlerProgress (idlerId, level, lastUpdateTime) VALUES (?, ?, ?)',
    [idlerId, level, lastUpdateTime]
  );
}

export async function getSettings(): Promise<Settings> {
  const db = getDatabase();
  const results = await db.getAllAsync<{ key: string; value: string }>(
    'SELECT key, value FROM settings'
  );
  
  const settings: Settings = {
    soundEnabled: true,
    checkAnswersEnabled: false,
    autofillEnabled: false,
  };
  
  results.forEach(row => {
    if (row.key === 'soundEnabled') {
      settings.soundEnabled = row.value === 'true';
    } else if (row.key === 'checkAnswersEnabled') {
      settings.checkAnswersEnabled = row.value === 'true';
    } else if (row.key === 'autofillEnabled') {
      settings.autofillEnabled = row.value === 'true';
    }
  });
  
  return settings;
}

export async function updateSetting(key: keyof Settings, value: boolean): Promise<void> {
  const db = getDatabase();
  await db.runAsync(
    'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
    [key, value.toString()]
  );
}

export async function getAbilityUnlock(abilityId: string): Promise<AbilityUnlock | null> {
  const db = getDatabase();
  return await db.getFirstAsync<AbilityUnlock>(
    'SELECT * FROM abilityUnlocks WHERE abilityId = ?',
    [abilityId]
  );
}

export async function getAllAbilityUnlocks(): Promise<AbilityUnlock[]> {
  const db = getDatabase();
  return await db.getAllAsync<AbilityUnlock>('SELECT * FROM abilityUnlocks');
}

export async function updateAbilityUnlock(abilityId: string, unlocked: boolean, usesRemaining: number): Promise<void> {
  const db = getDatabase();
  await db.runAsync(
    'INSERT OR REPLACE INTO abilityUnlocks (abilityId, unlocked, usesRemaining) VALUES (?, ?, ?)',
    [abilityId, unlocked ? 1 : 0, usesRemaining]
  );
}
