import { getDatabase } from './db';

export async function getPlayerData() {
  const db = getDatabase();
  const result = await db.getFirstAsync(
    'SELECT * FROM player WHERE id = 1'
  );
  return result;
}

export async function updatePlayerData(data) {
  const db = getDatabase();
  const fields = Object.keys(data);
  const values = Object.values(data);
  const setClause = fields.map(f => `${f} = ?`).join(', ');
  
  await db.runAsync(
    `UPDATE player SET ${setClause} WHERE id = 1`,
    values
  );
}

export async function getCompletedSudokus() {
  const db = getDatabase();
  const results = await db.getAllAsync(
    'SELECT difficulty, count FROM completedSudokus'
  );
  
  const completed = {
    easy: 0,
    medium: 0,
    hard: 0,
    advanced: 0,
  };
  
  results.forEach(row => {
    const difficulty = row.difficulty;
    if (difficulty in completed) {
      completed[difficulty] = row.count;
    }
  });
  
  return completed;
}

export async function incrementCompletedSudoku(difficulty) {
  const db = getDatabase();
  await db.runAsync(
    'UPDATE completedSudokus SET count = count + 1 WHERE difficulty = ?',
    [difficulty]
  );
}

export async function getIdlerProgress(idlerId) {
  const db = getDatabase();
  return await db.getFirstAsync(
    'SELECT * FROM idlerProgress WHERE idlerId = ?',
    [idlerId]
  );
}

export async function getAllIdlerProgress() {
  const db = getDatabase();
  return await db.getAllAsync('SELECT * FROM idlerProgress');
}

export async function updateIdlerProgress(idlerId, level, lastUpdateTime) {
  const db = getDatabase();
  await db.runAsync(
    'INSERT OR REPLACE INTO idlerProgress (idlerId, level, lastUpdateTime) VALUES (?, ?, ?)',
    [idlerId, level, lastUpdateTime]
  );
}

export async function getSettings() {
  const db = getDatabase();
  const results = await db.getAllAsync(
    'SELECT * FROM settings WHERE id = 1'
  );
  
  const settings = {
    soundEnabled: true,
    checkAnswersEnabled: false,
    autofillEnabled: false,
    debugErrorsEnabled: true,
  };
  
  if (results && results.length > 0) {
    const result = results[0];
    settings.soundEnabled = Boolean(result.soundEnabled);
    settings.checkAnswersEnabled = Boolean(result.checkAnswersEnabled);
    settings.autofillEnabled = Boolean(result.autofillEnabled);
    settings.debugErrorsEnabled = result.debugErrorsEnabled !== undefined ? Boolean(result.debugErrorsEnabled) : true;
  }
  
  return settings;
}

export async function updateSetting(key, value) {
  const db = getDatabase();
  await db.runAsync(
    `UPDATE settings SET ${key} = ? WHERE id = 1`,
    [value ? 1 : 0]
  );
}

export async function getAbilityUnlock(abilityId) {
  const db = getDatabase();
  return await db.getFirstAsync(
    'SELECT * FROM abilityUnlocks WHERE abilityId = ?',
    [abilityId]
  );
}

export async function getAllAbilityUnlocks() {
  const db = getDatabase();
  return await db.getAllAsync('SELECT * FROM abilityUnlocks');
}

export async function updateAbilityUnlock(abilityId, unlocked, usesRemaining) {
  const db = getDatabase();
  await db.runAsync(
    'INSERT OR REPLACE INTO abilityUnlocks (abilityId, unlocked, usesRemaining) VALUES (?, ?, ?)',
    [abilityId, unlocked ? 1 : 0, usesRemaining]
  );
}

