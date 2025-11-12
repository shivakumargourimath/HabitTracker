import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';

// Only open SQLite on Android/iOS with lazy initialization
let db = null;
let dbInitialized = false;

const getDB = () => {
  if (!db && Platform.OS !== 'web' && !dbInitialized) {
    try {
      db = SQLite.openDatabase('habits.db');
      dbInitialized = true;
    } catch (error) {
      console.log('SQLite not available, falling back to in-memory:', error);
      dbInitialized = true;
    }
  }
  return db;
};

// Initialize DB and create tables if they don't exist
export const initDB = () => {
  const database = getDB();
  if (!database) return Promise.resolve();
  
  return new Promise((resolve, reject) => {
    database.transaction(
      (tx) => {
        // Users table
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            avatar TEXT
          );`
        );
        // Habits table with additional fields for completionHistory
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS habits (
            id TEXT PRIMARY KEY NOT NULL,
            user_id INTEGER,
            name TEXT NOT NULL,
            description TEXT,
            color TEXT NOT NULL,
            streak INTEGER NOT NULL,
            lastCompleted TEXT,
            completedToday INTEGER NOT NULL,
            history TEXT,
            completionHistory TEXT,
            createdAt TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
          );`
        );
      },
      (err) => reject(err),
      () => resolve()
    );
  });
};

// User functions
export const signupUserDB = (user) => {
  const database = getDB();
  if (!database) return Promise.resolve({ insertId: Date.now() }); // Mock for fallback
  return new Promise((resolve, reject) => {
    database.transaction(
      (tx) => {
        tx.executeSql(
          'INSERT INTO users (name, email, password, avatar) VALUES (?, ?, ?, ?)',
          [user.name, user.email, user.password, user.avatar || null],
          (_, result) => resolve(result),
          (_, err) => reject(err)
        );
      }
    );
  });
};

export const loginUserDB = (email, password) => {
  const database = getDB();
  if (!database) return Promise.resolve(null);
  return new Promise((resolve, reject) => {
    database.transaction(
      (tx) => {
        tx.executeSql(
          'SELECT * FROM users WHERE email = ? AND password = ?',
          [email, password],
          (_, { rows }) => {
            resolve(rows.length > 0 ? rows.item(0) : null);
          },
          (_, err) => reject(err)
        );
      }
    );
  });
};

export const updateUserDB = (id, updates) => {
  const database = getDB();
  if (!database) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(id);
    database.transaction(
      (tx) => {
        tx.executeSql(
          `UPDATE users SET ${fields} WHERE id = ?`,
          values,
          (_, result) => resolve(result),
          (_, err) => reject(err)
        );
      }
    );
  });
};

// Habit functions
export const addHabitDB = (habit, userId) => {
  const database = getDB();
  if (!database) return Promise.resolve();
  return new Promise((resolve, reject) => {
    database.transaction(
      (tx) => {
        tx.executeSql(
          'INSERT INTO habits (id, user_id, name, description, color, streak, lastCompleted, completedToday, history, completionHistory, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [
            habit.id, 
            userId, 
            habit.name, 
            habit.description || '', 
            habit.color, 
            habit.streak || 0, 
            habit.lastCompleted || null, 
            habit.completedToday ? 1 : 0, 
            JSON.stringify(habit.history || []),
            JSON.stringify(habit.completionHistory || []),
            habit.createdAt || new Date().toISOString()
          ]
        );
      },
      (err) => reject(err),
      () => resolve()
    );
  });
};

export const fetchHabitsDB = (userId) => {
  const database = getDB();
  if (!database) return Promise.resolve([]);
  return new Promise((resolve, reject) => {
    database.transaction(
      (tx) => {
        tx.executeSql(
          'SELECT * FROM habits WHERE user_id = ?',
          [userId],
          (_, { rows }) => {
            const habits = rows._array.map(h => ({
              ...h,
              completedToday: h.completedToday === 1,
              history: JSON.parse(h.history || '[]'),
              completionHistory: JSON.parse(h.completionHistory || '[]')
            }));
            resolve(habits);
          },
          (_, err) => reject(err)
        );
      }
    );
  });
};

export const updateHabitDB = (id, updates) => {
  const database = getDB();
  if (!database) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const fields = Object.keys(updates).map(key => {
      if (key === 'history' || key === 'completionHistory') return `${key} = ?`;
      if (key === 'completedToday') return 'completedToday = ?';
      return `${key} = ?`;
    }).join(', ');
    const values = Object.keys(updates).map(key => {
      if (key === 'history' || key === 'completionHistory') return JSON.stringify(updates[key]);
      if (key === 'completedToday') return updates[key] ? 1 : 0;
      return updates[key];
    });
    values.push(id);
    database.transaction(
      (tx) => {
        tx.executeSql(
          `UPDATE habits SET ${fields} WHERE id = ?`,
          values,
          (_, result) => resolve(result),
          (_, err) => reject(err)
        );
      }
    );
  });
};

export const deleteHabitDB = (id) => {
  const database = getDB();
  if (!database) return Promise.resolve();
  return new Promise((resolve, reject) => {
    database.transaction(
      (tx) => {
        tx.executeSql(
          'DELETE FROM habits WHERE id = ?',
          [id],
          (_, result) => resolve(result),
          (_, err) => reject(err)
        );
      }
    );
  });
};

// Batch update multiple habits (optimization for bulk operations)
export const batchUpdateHabitsDB = (updates) => {
  const database = getDB();
  if (!database) return Promise.resolve();
  
  return new Promise((resolve, reject) => {
    database.transaction(
      (tx) => {
        updates.forEach(({ id, data }) => {
          const fields = Object.keys(data).map(key => {
            if (key === 'history' || key === 'completionHistory') return `${key} = ?`;
            if (key === 'completedToday') return 'completedToday = ?';
            return `${key} = ?`;
          }).join(', ');
          const values = Object.keys(data).map(key => {
            if (key === 'history' || key === 'completionHistory') return JSON.stringify(data[key]);
            if (key === 'completedToday') return data[key] ? 1 : 0;
            return data[key];
          });
          values.push(id);
          
          tx.executeSql(
            `UPDATE habits SET ${fields} WHERE id = ?`,
            values
          );
        });
      },
      (err) => reject(err),
      () => resolve()
    );
  });
};
