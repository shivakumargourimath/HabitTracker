// context/SettingsContext.js
import React, { createContext, useContext, useState } from 'react';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [streakProtection, setStreakProtection] = useState(true); // default ON

  const toggleStreakProtection = () => setStreakProtection(prev => !prev);

  return (
    <SettingsContext.Provider value={{ streakProtection, toggleStreakProtection }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => useContext(SettingsContext);
