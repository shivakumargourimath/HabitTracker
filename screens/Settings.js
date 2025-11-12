import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Switch } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useThemeContext } from '../context/ThemeContext';
import { useHabits } from '../context/HabitContext';

export default function Settings() {
  const navigation = useNavigation();
  const { isDark, toggleTheme } = useThemeContext();
  const { settings = {}, toggleReminder, toggleStreakProtection } = useHabits();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#121212' : '#f9f9f9' }]}>
      <View style={styles.container}>
        {/* 🌙 Dark Theme */}
        <View style={[styles.row, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Dark Theme</Text>
          <Switch value={isDark} onValueChange={toggleTheme} color="#6200ee" />
        </View>

        {/* 🛡️ Streak Protection Mode */}
        <View style={[styles.row, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>
            Streak Protection Mode
          </Text>
          <Switch
            value={settings.streakProtection || false}
            onValueChange={toggleStreakProtection}
            color="#03dac6"
          />
        </View>

        {/* 🔔 Daily Reminder */}
        <View style={[styles.row, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Daily Reminder</Text>
          <Switch
            value={settings.reminderEnabled || false}
            onValueChange={toggleReminder}
            color="#ff9800"
          />
        </View>

        {/* 👤 Profile */}
        <TouchableOpacity
          style={[styles.row, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Profile</Text>
          <Text style={[styles.arrow, { color: isDark ? '#fff' : '#000' }]}>{'>'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 16 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    // subtle shadow for light theme
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: { fontSize: 16, fontWeight: '500' },
  arrow: { fontSize: 16, fontWeight: 'bold' },
});
