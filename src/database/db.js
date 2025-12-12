import { Platform } from 'react-native';
import { CREATE_TABLES, INITIALIZE_PLAYER, INITIALIZE_COMPLETED_SUDOKUS, INITIALIZE_SETTINGS } from './schema';

let db = null;

// Web-compatible database wrapper using sql.js
async function createWebDatabase() {
  let initSqlJs;
  try {
    initSqlJs = require('sql.js');
  } catch (error) {
    console.error('Failed to load sql.js:', error);
    throw new Error('sql.js is required for web platform. Please ensure it is installed.');
  }
  
  let SQL;
  try {
    SQL = await initSqlJs.default({
      locateFile: (file) => `https://sql.js.org/dist/${file}`
    });
  } catch (error) {
    console.error('Failed to initialize sql.js:', error);
    // Try alternative loading method
    try {
      SQL = await initSqlJs({
        locateFile: (file) => `https://sql.js.org/dist/${file}`
      });
    } catch (error2) {
      console.error('Failed to initialize sql.js with alternative method:', error2);
      throw error2;
    }
  }
  
  // Try to load existing database from localStorage
  let database;
  try {
    if (typeof localStorage !== 'undefined') {
      const savedDb = localStorage.getItem('idleSudoku.db');
      if (savedDb) {
        const buffer = new Uint8Array(JSON.parse(savedDb));
        database = new SQL.Database(buffer);
      } else {
        database = new SQL.Database();
      }
    } else {
      database = new SQL.Database();
    }
  } catch (error) {
    console.warn('Could not load database from localStorage, creating new one:', error);
    database = new SQL.Database();
  }

  // Save database to localStorage
  const saveDatabase = () => {
    try {
      if (typeof localStorage !== 'undefined') {
        const data = database.export();
        const buffer = Array.from(data);
        localStorage.setItem('idleSudoku.db', JSON.stringify(buffer));
      }
    } catch (error) {
      console.warn('Could not save database to localStorage:', error);
    }
  };

  // Create a wrapper that matches expo-sqlite API
  return {
    execAsync: async (sql) => {
      try {
        // Split multiple statements and execute them
        const statements = sql.split(';').filter(s => s.trim());
        for (const statement of statements) {
          if (statement.trim()) {
            database.run(statement);
          }
        }
        saveDatabase();
      } catch (error) {
        console.error('SQL execution error:', error, 'SQL:', sql);
        throw error;
      }
    },
    getFirstAsync: async (sql, params = []) => {
      try {
        const stmt = database.prepare(sql);
        if (params && params.length > 0) {
          // Bind parameters positionally - sql.js uses array for ? placeholders
          stmt.bind(params);
        }
        const result = stmt.step() ? stmt.getAsObject() : null;
        stmt.free();
        return result;
      } catch (error) {
        console.error('SQL getFirst error:', error, 'SQL:', sql, 'Params:', params);
        throw error;
      }
    },
    getAllAsync: async (sql, params = []) => {
      try {
        const stmt = database.prepare(sql);
        if (params && params.length > 0) {
          // Bind parameters positionally - sql.js uses array for ? placeholders
          stmt.bind(params);
        }
        const results = [];
        while (stmt.step()) {
          results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
      } catch (error) {
        console.error('SQL getAll error:', error, 'SQL:', sql, 'Params:', params);
        throw error;
      }
    },
    runAsync: async (sql, params = []) => {
      try {
        if (params && params.length > 0) {
          // Use prepare for parameterized queries
          const stmt = database.prepare(sql);
          // Bind parameters positionally - sql.js uses array for ? placeholders
          stmt.bind(params);
          stmt.step();
          stmt.free();
        } else {
          // Use run for non-parameterized queries
          database.run(sql);
        }
        saveDatabase();
      } catch (error) {
        console.error('SQL run error:', error, 'SQL:', sql, 'Params:', params);
        throw error;
      }
    },
  };
}

// Native database using expo-sqlite
async function createNativeDatabase() {
  try {
    const SQLite = require('expo-sqlite');
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
    if (Platform.OS === 'web') {
      db = await createWebDatabase();
    } else {
      db = await createNativeDatabase();
    }
    
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

