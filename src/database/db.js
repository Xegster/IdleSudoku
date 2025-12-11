import * as SQLite from 'expo-sqlite';
import { CREATE_TABLES, INITIALIZE_PLAYER, INITIALIZE_COMPLETED_SUDOKUS, INITIALIZE_SETTINGS } from './schema';

let db = null;

export async function initializeDatabase() {
  if (db) {
    return db;
  }

  try {
    db = await SQLite.openDatabaseAsync('idleSudoku.db');
    
    // Create tables
    await db.execAsync(CREATE_TABLES);
    
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

export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
}

