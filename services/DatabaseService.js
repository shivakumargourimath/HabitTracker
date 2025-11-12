// services/DatabaseService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Simple in-memory database fallback for Expo Go
class DatabaseService {
  constructor() {
    this.data = {
      habits: [],
      history: {},
      users: []
    };
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      // Try to load existing data from AsyncStorage
      const storedData = await AsyncStorage.getItem('app_database');
      if (storedData) {
        this.data = JSON.parse(storedData);
      }
      this.initialized = true;
      console.log('Database initialized with AsyncStorage fallback');
    } catch (error) {
      console.error('Database initialization error:', error);
      this.initialized = true; // Continue with empty data
    }
  }

  async saveData() {
    try {
      await AsyncStorage.setItem('app_database', JSON.stringify(this.data));
    } catch (error) {
      console.error('Database save error:', error);
    }
  }

  // Habits
  async createHabitsTable() {
    // No-op for AsyncStorage implementation
    return Promise.resolve();
  }

  async insertHabit(habit) {
    await this.initialize();
    this.data.habits.push(habit);
    await this.saveData();
    return habit;
  }

  async getAllHabits() {
    await this.initialize();
    return this.data.habits;
  }

  async updateHabit(id, updates) {
    await this.initialize();
    const index = this.data.habits.findIndex(h => h.id === id);
    if (index !== -1) {
      this.data.habits[index] = { ...this.data.habits[index], ...updates };
      await this.saveData();
      return this.data.habits[index];
    }
    return null;
  }

  async deleteHabit(id) {
    await this.initialize();
    this.data.habits = this.data.habits.filter(h => h.id !== id);
    await this.saveData();
  }

  // History
  async insertHabitHistory(habitId, date, completed) {
    await this.initialize();
    if (!this.data.history[habitId]) {
      this.data.history[habitId] = {};
    }
    this.data.history[habitId][date] = completed;
    await this.saveData();
  }

  async getHabitHistory(habitId) {
    await this.initialize();
    return this.data.history[habitId] || {};
  }

  // Users (for auth)
  async createUsersTable() {
    // No-op for AsyncStorage implementation
    return Promise.resolve();
  }

  async insertUser(user) {
    await this.initialize();
    this.data.users.push(user);
    await this.saveData();
    return user;
  }

  async getUserByEmail(email) {
    await this.initialize();
    return this.data.users.find(u => u.email === email) || null;
  }

  // Clear all data
  async clearAllData() {
    this.data = {
      habits: [],
      history: {},
      users: []
    };
    await this.saveData();
  }
}

export default new DatabaseService();