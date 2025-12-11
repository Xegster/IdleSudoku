export const CREATE_TABLES = `
  CREATE TABLE IF NOT EXISTS player (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    level INTEGER NOT NULL DEFAULT 1,
    totalCompletedSudokus INTEGER NOT NULL DEFAULT 0,
    availableSudokus INTEGER NOT NULL DEFAULT 0,
    maxLives INTEGER NOT NULL DEFAULT 1,
    currentLives INTEGER NOT NULL DEFAULT 1,
    mistakes INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS completedSudokus (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    difficulty TEXT NOT NULL,
    count INTEGER NOT NULL DEFAULT 0,
    UNIQUE(difficulty)
  );

  CREATE TABLE IF NOT EXISTS idlerProgress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idlerId TEXT NOT NULL,
    level INTEGER NOT NULL DEFAULT 1,
    lastUpdateTime INTEGER NOT NULL,
    UNIQUE(idlerId)
  );

  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    soundEnabled INTEGER NOT NULL DEFAULT 1,
    checkAnswersEnabled INTEGER NOT NULL DEFAULT 0,
    autofillEnabled INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS abilityUnlocks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    abilityId TEXT NOT NULL,
    unlocked INTEGER NOT NULL DEFAULT 0,
    usesRemaining INTEGER,
    UNIQUE(abilityId)
  );
`;

export const INITIALIZE_PLAYER = `
  INSERT OR IGNORE INTO player (id, level, totalCompletedSudokus, availableSudokus, maxLives, currentLives, mistakes)
  VALUES (1, 1, 0, 0, 1, 1, 0);
`;

export const INITIALIZE_COMPLETED_SUDOKUS = `
  INSERT OR IGNORE INTO completedSudokus (difficulty, count) VALUES
  ('easy', 0),
  ('medium', 0),
  ('hard', 0),
  ('advanced', 0);
`;

export const INITIALIZE_SETTINGS = `
  INSERT OR IGNORE INTO settings (id, soundEnabled, checkAnswersEnabled, autofillEnabled)
  VALUES (1, 1, 0, 0);
`;

