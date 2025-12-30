import { CREATE_TABLES, INITIALIZE_PLAYER, INITIALIZE_COMPLETED_SUDOKUS, INITIALIZE_SETTINGS } from './schema';
import * as SQLite from 'expo-sqlite';

let db = null;

// Native database using expo-sqlite
async function createNativeDatabase() {
  try {
    return await SQLite.openDatabaseAsync('idleSudoku.db');
  } catch (error) {
    console.error('Failed to load expo-sqlite:', error);
    throw new Error('expo-sqlite is required for native platforms. Please ensure it is installed.');
  }
}

export async function initializeDatabase() {
  if (db) {
    return db;
  }

  try {
    db = await createNativeDatabase();
    
    // Create tables
    await db.execAsync(CREATE_TABLES);
    
    // Run migrations for existing databases
    await runMigrations(db);
    
    // Initialize default data
    await db.execAsync(INITIALIZE_PLAYER);
    await db.execAsync(INITIALIZE_COMPLETED_SUDOKUS);
    await db.execAsync(INITIALIZE_SETTINGS);
    
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Run database migrations
async function runMigrations(database) {
  try {
    // Migration: Add debugErrorsEnabled column if it doesn't exist
    // SQLite doesn't support IF NOT EXISTS for ALTER TABLE, so we check first
    try {
      // Try to query the column - if it fails, the column doesn't exist
      await database.getFirstAsync('SELECT debugErrorsEnabled FROM settings LIMIT 1');
    } catch (error) {
      // Column doesn't exist, add it
      console.log('Adding debugErrorsEnabled column to settings table...');
      await database.runAsync('ALTER TABLE settings ADD COLUMN debugErrorsEnabled INTEGER NOT NULL DEFAULT 1');
      console.log('Migration completed: debugErrorsEnabled column added');
    }

    // Migration: Add highestLevel column if it doesn't exist
    try {
      await database.getFirstAsync('SELECT highestLevel FROM player LIMIT 1');
    } catch (error) {
      // Column doesn't exist, add it and initialize with current level
      console.log('Adding highestLevel column to player table...');
      await database.runAsync('ALTER TABLE player ADD COLUMN highestLevel INTEGER NOT NULL DEFAULT 1');
      // Initialize highestLevel with current level for existing players
      await database.runAsync('UPDATE player SET highestLevel = level WHERE highestLevel IS NULL OR highestLevel < level');
      console.log('Migration completed: highestLevel column added');
    }
  } catch (error) {
    // If tables don't exist yet, that's fine - CREATE_TABLES will handle it
    console.log('Migration check skipped (table may not exist yet):', error.message);
  }
}

export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
}

