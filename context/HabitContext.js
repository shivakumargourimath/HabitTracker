// context/HabitContext.js
import React, { createContext, useState, useContext, useEffect, useRef, useMemo, useCallback } from 'react';
import { requestNotificationPermission, scheduleDailyReminder, cancelAllReminders } from '../src/utils/notificationHelper';
import { addHabitDB, fetchHabitsDB, updateHabitDB, deleteHabitDB } from '../database/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

// Utility: simple unique ID
const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

// Utility: Calculate streak from completion history
const calculateStreak = (completionHistory) => {
  if (!completionHistory || completionHistory.length === 0) return 0;
  
  // Sort dates in descending order (most recent first)
  const sortedDates = [...completionHistory].sort((a, b) => new Date(b) - new Date(a));
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let streak = 0;
  let currentDate = new Date(today);
  
  // Check if today or yesterday was completed (streak can continue)
  const mostRecent = new Date(sortedDates[0]);
  mostRecent.setHours(0, 0, 0, 0);
  
  const daysDiff = Math.floor((today - mostRecent) / (1000 * 60 * 60 * 24));
  
  // If last completion was more than 1 day ago, streak is broken
  if (daysDiff > 1) return 0;
  
  // Count consecutive days
  for (let i = 0; i < sortedDates.length; i++) {
    const checkDate = new Date(sortedDates[i]);
    checkDate.setHours(0, 0, 0, 0);
    
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    expectedDate.setHours(0, 0, 0, 0);
    
    if (checkDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

// Create Context
const HabitContext = createContext();

export const HabitProvider = ({ children }) => {
  const { user } = useAuth();
  const [dbAvailable, setDbAvailable] = useState(false);
  const lastResetDate = useRef(null);

  // 🧠 Habits state
  const [habits, setHabits] = useState([]);

  // ⚙️ App-wide settings
  const [settings, setSettings] = useState({
    reminderEnabled: false,
    streakProtection: false,
  });

  // Load habits from DB or AsyncStorage when user logs in
  useEffect(() => {
    if (user) {
      const loadHabits = async () => {
        let loadedHabits = [];
        try {
          const habitsFromDB = await fetchHabitsDB(user.id);
          if (habitsFromDB.length > 0) {
            loadedHabits = habitsFromDB;
          } else {
            // DB empty, try AsyncStorage
            const storedHabits = await AsyncStorage.getItem(`habits_${user.id}`);
            if (storedHabits) {
              loadedHabits = JSON.parse(storedHabits);
            }
          }
          setDbAvailable(true);
        } catch (error) {
          console.error('Load habits DB error, trying AsyncStorage:', error);
          setDbAvailable(false);
          // Fallback to AsyncStorage
          const storedHabits = await AsyncStorage.getItem(`habits_${user.id}`);
          if (storedHabits) {
            loadedHabits = JSON.parse(storedHabits);
          }
        }
        
        // Recalculate streaks for all loaded habits to ensure accuracy
        loadedHabits = loadedHabits.map(habit => ({
          ...habit,
          streak: calculateStreak(habit.completionHistory || []),
          completionHistory: habit.completionHistory || [],
          description: habit.description || '',
          createdAt: habit.createdAt || new Date().toISOString(),
        }));
        
        // NO SAMPLE HABITS - Users start with empty state
        // They will create their own habits from scratch
        setHabits(loadedHabits);
      };
      loadHabits();
    } else {
      setHabits([]);
    }
  }, [user]);

  // Reset completedToday based on date
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (lastResetDate.current !== today && habits.length > 0) {
      lastResetDate.current = today;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      setHabits((prev) =>
        prev.map((h) => {
          let newHistory = h.history ? [...h.history] : Array(7).fill(false);
          if (h.lastCompleted !== today && h.lastCompleted !== null) {
            // New day, shift history and add yesterday's completion
            newHistory.shift();
            newHistory.push(h.lastCompleted === yesterdayStr);
          }
          const updated = {
            ...h,
            completedToday: h.lastCompleted === today,
            history: newHistory,
          };
          // Save to DB if available
          if (dbAvailable && user) {
            updateHabitDB(h.id, { completedToday: updated.completedToday, history: updated.history }).catch(console.error);
          }
          return updated;
        })
      );
    }
  }, [habits.length, dbAvailable, user]);

  // ------------------------------------------------
  // 🔔 Reminder logic
  // ------------------------------------------------
  const toggleReminder = async () => {
    const newValue = !settings.reminderEnabled;
    setSettings((prev) => ({ ...prev, reminderEnabled: newValue }));

    if (newValue) {
      const granted = await requestNotificationPermission();
      if (granted) {
        await scheduleDailyReminder();
        console.log("✅ Daily reminder scheduled");
      } else {
        console.warn("⚠️ Notification permission not granted");
      }
    } else {
      await cancelAllReminders();
      console.log("🚫 All reminders cancelled");
    }
  };

  // ------------------------------------------------
  // 🛡️ Streak Protection toggle
  // ------------------------------------------------
  const toggleStreakProtection = () => {
    setSettings((prev) => ({
      ...prev,
      streakProtection: !prev.streakProtection,
    }));
  };

  // ------------------------------------------------
  // ➕ Add a new habit
  // ------------------------------------------------
  const addHabit = async (name, color, description = '') => {
    const newHabit = {
      id: generateId(),
      name,
      description,
      color,
      streak: 0,
      completedToday: false,
      history: Array(7).fill(false),
      completionHistory: [],
      lastCompleted: null,
      createdAt: new Date().toISOString(),
    };
    setHabits((prev) => {
      const newHabits = [...prev, newHabit];
      // Save to storage
      if (user) {
        AsyncStorage.setItem(`habits_${user.id}`, JSON.stringify(newHabits)).catch(console.error);
        if (dbAvailable) {
          addHabitDB(newHabit, user.id).catch(console.error);
        }
      }
      return newHabits;
    });
  };

  // ------------------------------------------------
  // ✏️ Update habit details
  // ------------------------------------------------
  const updateHabit = async (id, newName, newColor, newDescription = '') => {
    setHabits((prev) => {
      const newHabits = prev.map((h) => (h.id === id ? { ...h, name: newName, color: newColor, description: newDescription } : h));
      // Save to storage
      if (user) {
        AsyncStorage.setItem(`habits_${user.id}`, JSON.stringify(newHabits)).catch(console.error);
        if (dbAvailable) {
          updateHabitDB(id, { name: newName, color: newColor, description: newDescription }).catch(console.error);
        }
      }
      return newHabits;
    });
  };

  // ------------------------------------------------
  // 🗑️ Delete habit
  // ------------------------------------------------
  const deleteHabit = async (id) => {
    setHabits((prev) => {
      const newHabits = prev.filter((h) => h.id !== id);
      // Save to storage
      if (user) {
        AsyncStorage.setItem(`habits_${user.id}`, JSON.stringify(newHabits)).catch(console.error);
        if (dbAvailable) {
          deleteHabitDB(id).catch(console.error);
        }
      }
      return newHabits;
    });
  };

  // ------------------------------------------------
  // ✅ Toggle completion for today (handles streak + history)
  // ------------------------------------------------
  // Toggle completion for today
  const toggleCompletion = async (habitId) => {
    const today = new Date().toISOString().split('T')[0];
    setHabits((prev) => {
      const newHabits = prev.map((h) => {
        if (h.id === habitId) {
          const completedToday = !h.completedToday;
  
          // Update completion history
          let newCompletionHistory = h.completionHistory || [];
          if (completedToday) {
            // Add today to completion history if not already there
            if (!newCompletionHistory.includes(today)) {
              newCompletionHistory = [...newCompletionHistory, today];
            }
          } else {
            // Remove today from completion history
            newCompletionHistory = newCompletionHistory.filter(date => date !== today);
          }
  
          // Calculate streak from completion history
          const newStreak = calculateStreak(newCompletionHistory);
  
          return {
            ...h, 
            completedToday, 
            streak: newStreak, 
            completionHistory: newCompletionHistory,
            lastCompleted: completedToday ? today : null 
          };
        }
        return h;
      });
      // Save to storage
      if (user) {
        AsyncStorage.setItem(`habits_${user.id}`, JSON.stringify(newHabits)).catch(console.error);
        if (dbAvailable) {
          const habit = newHabits.find(h => h.id === habitId);
          if (habit) {
            updateHabitDB(habitId, { 
              completedToday: habit.completedToday, 
              streak: habit.streak, 
              completionHistory: habit.completionHistory,
              lastCompleted: habit.lastCompleted 
            }).catch(console.error);
          }
        }
      }
      return newHabits;
    });
  };


  // ------------------------------------------------
  // 🧩 Context value - Memoized to prevent unnecessary re-renders
  // ------------------------------------------------
  const contextValue = useMemo(() => ({
    habits,
    settings,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion,
    toggleReminder,
    toggleStreakProtection,
  }), [habits, settings]);

  return (
    <HabitContext.Provider value={contextValue}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => useContext(HabitContext);
