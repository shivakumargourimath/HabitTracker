// context/ThemeContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { lightTheme, darkTheme } from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);
  const [theme, setTheme] = useState(darkTheme);

  useEffect(() => {
    loadThemePreference();
  }, []);

  useEffect(() => {
    setTheme(isDark ? darkTheme : lightTheme);
    saveThemePreference(isDark);
  }, [isDark]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('themePreference');
      if (savedTheme !== null) {
        const isCurrentlyDark = JSON.parse(savedTheme);
        setIsDark(isCurrentlyDark);
      }
    } catch (error) {
      console.error('Failed to load theme preference:', error);
    }
  };

  const saveThemePreference = async (isDarkTheme) => {
    try {
      await AsyncStorage.setItem('themePreference', JSON.stringify(isDarkTheme));
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

export const useTheme = () => {
  const { theme } = useThemeContext();
  return theme;
};
