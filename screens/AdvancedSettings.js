// screens/AdvancedSettings.js
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, useThemeContext } from '../context/ThemeContext';
import { useHabits } from '../context/HabitContext';
import NotificationService from '../services/NotificationService';
import AchievementService from '../services/AchievementService';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdvancedSettings() {
  const theme = useTheme();
  const { isDark, toggleTheme } = useThemeContext();
  const { habits, exportData, importData, clearAllData } = useHabits();
  
  const [notifications, setNotifications] = useState({
    enabled: true,
    dailyReminder: true,
    streakCelebrations: true,
    achievements: true,
    motivationalQuotes: true,
  });
  
  const [preferences, setPreferences] = useState({
    hapticFeedback: true,
    soundEffects: true,
    dataAnalytics: true,
    autoBackup: false,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const storedNotifications = await AsyncStorage.getItem('notification_settings');
      const storedPreferences = await AsyncStorage.getItem('user_preferences');
      
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
      
      if (storedPreferences) {
        setPreferences(JSON.parse(storedPreferences));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveNotificationSettings = async (newSettings) => {
    try {
      await AsyncStorage.setItem('notification_settings', JSON.stringify(newSettings));
      setNotifications(newSettings);
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  };

  const savePreferences = async (newPreferences) => {
    try {
      await AsyncStorage.setItem('user_preferences', JSON.stringify(newPreferences));
      setPreferences(newPreferences);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const handleNotificationToggle = (key, value) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newSettings = { ...notifications, [key]: value };
    saveNotificationSettings(newSettings);
  };

  const handlePreferenceToggle = (key, value) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newPreferences = { ...preferences, [key]: value };
    savePreferences(newPreferences);
  };

  const handleExportData = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const data = await exportData();
      const jsonString = JSON.stringify(data, null, 2);
      
      await Share.share({
        message: jsonString,
        title: 'Habit Tracker Data Export',
      });
    } catch (error) {
      Alert.alert('Export Failed', 'Unable to export data. Please try again.');
    }
  };

  const handleClearAllData = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your habits, progress, and achievements. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              await AchievementService.resetAchievements();
              await NotificationService.cancelAllNotifications();
              Alert.alert('Success', 'All data has been cleared.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data. Please try again.');
            }
          }
        }
      ]
    );
  };

  const SettingSection = ({ title, children }) => (
    <View style={{
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      marginHorizontal: theme.spacing[4],
      marginVertical: theme.spacing[2],
      ...theme.shadows.base,
    }}>
      <Text style={{
        fontSize: theme.fontSizes.lg,
        fontWeight: theme.fontWeights.semibold,
        color: theme.colors.text,
        padding: theme.spacing[4],
        paddingBottom: theme.spacing[2],
      }}>
        {title}
      </Text>
      {children}
    </View>
  );

  const SettingItem = ({ icon, title, description, value, onToggle, type = 'switch', onPress }) => (
    <TouchableOpacity
      onPress={type === 'button' ? onPress : () => onToggle(!value)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing[4],
        paddingVertical: theme.spacing[3],
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.borderLight,
      }}
      activeOpacity={0.7}
    >
      <View style={{
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: theme.colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing[3],
      }}>
        <MaterialCommunityIcons
          name={icon}
          size={18}
          color={theme.colors.primary}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: theme.fontSizes.base,
          fontWeight: theme.fontWeights.medium,
          color: theme.colors.text,
          marginBottom: 2,
        }}>
          {title}
        </Text>
        {description && (
          <Text style={{
            fontSize: theme.fontSizes.sm,
            color: theme.colors.textSecondary,
          }}>
            {description}
          </Text>
        )}
      </View>

      {type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: theme.colors.borderLight, true: theme.colors.primary }}
          thumbColor={value ? '#ffffff' : theme.colors.textTertiary}
        />
      ) : (
        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color={theme.colors.textSecondary}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={{
          paddingHorizontal: theme.spacing[4],
          paddingVertical: theme.spacing[4],
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
        }}>
          <Text style={{
            fontSize: theme.fontSizes['2xl'],
            fontWeight: theme.fontWeights.bold,
            color: theme.colors.text,
            textAlign: 'center',
          }}>
            Advanced Settings
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Appearance Settings */}
          <SettingSection title="Appearance">
            <SettingItem
              icon="brightness-6"
              title="Dark Theme"
              description="Use dark colors throughout the app"
              value={isDark}
              onToggle={toggleTheme}
            />
          </SettingSection>

          {/* Notification Settings */}
          <SettingSection title="Notifications">
            <SettingItem
              icon="bell"
              title="Enable Notifications"
              description="Receive habit reminders and updates"
              value={notifications.enabled}
              onToggle={(value) => handleNotificationToggle('enabled', value)}
            />
            <SettingItem
              icon="clock"
              title="Daily Reminders"
              description="Get reminded about your habits"
              value={notifications.dailyReminder}
              onToggle={(value) => handleNotificationToggle('dailyReminder', value)}
            />
            <SettingItem
              icon="fire"
              title="Streak Celebrations"
              description="Celebrate your winning streaks"
              value={notifications.streakCelebrations}
              onToggle={(value) => handleNotificationToggle('streakCelebrations', value)}
            />
            <SettingItem
              icon="trophy"
              title="Achievement Alerts"
              description="Get notified about new achievements"
              value={notifications.achievements}
              onToggle={(value) => handleNotificationToggle('achievements', value)}
            />
            <SettingItem
              icon="lightbulb"
              title="Motivational Quotes"
              description="Receive inspiring messages"
              value={notifications.motivationalQuotes}
              onToggle={(value) => handleNotificationToggle('motivationalQuotes', value)}
            />
          </SettingSection>

          {/* Experience Settings */}
          <SettingSection title="Experience">
            <SettingItem
              icon="vibrate"
              title="Haptic Feedback"
              description="Feel vibrations when interacting"
              value={preferences.hapticFeedback}
              onToggle={(value) => handlePreferenceToggle('hapticFeedback', value)}
            />
            <SettingItem
              icon="volume-high"
              title="Sound Effects"
              description="Play sounds for actions"
              value={preferences.soundEffects}
              onToggle={(value) => handlePreferenceToggle('soundEffects', value)}
            />
            <SettingItem
              icon="chart-line"
              title="Data Analytics"
              description="Help improve the app with usage data"
              value={preferences.dataAnalytics}
              onToggle={(value) => handlePreferenceToggle('dataAnalytics', value)}
            />
          </SettingSection>

          {/* Data Management */}
          <SettingSection title="Data Management">
            <SettingItem
              icon="export"
              title="Export Data"
              description="Share your habit data"
              type="button"
              onPress={handleExportData}
            />
            <SettingItem
              icon="cloud-upload"
              title="Auto Backup"
              description="Automatically backup your data"
              value={preferences.autoBackup}
              onToggle={(value) => handlePreferenceToggle('autoBackup', value)}
            />
          </SettingSection>

          {/* App Information */}
          <SettingSection title="App Information">
            <SettingItem
              icon="information"
              title="App Version"
              description="Version 1.0.0"
              type="button"
              onPress={() => {}}
            />
            <SettingItem
              icon="help-circle"
              title="Help & Support"
              description="Get help using the app"
              type="button"
              onPress={() => {}}
            />
            <SettingItem
              icon="star"
              title="Rate the App"
              description="Leave a review on the app store"
              type="button"
              onPress={() => {}}
            />
          </SettingSection>

          {/* Danger Zone */}
          <SettingSection title="Danger Zone">
            <TouchableOpacity
              onPress={handleClearAllData}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: theme.spacing[4],
                paddingVertical: theme.spacing[3],
                backgroundColor: `${theme.colors.error}10`,
              }}
            >
              <View style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: theme.colors.error,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: theme.spacing[3],
              }}>
                <MaterialCommunityIcons
                  name="delete"
                  size={18}
                  color="#ffffff"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: theme.fontSizes.base,
                  fontWeight: theme.fontWeights.medium,
                  color: theme.colors.error,
                  marginBottom: 2,
                }}>
                  Clear All Data
                </Text>
                <Text style={{
                  fontSize: theme.fontSizes.sm,
                  color: theme.colors.error,
                  opacity: 0.8,
                }}>
                  Permanently delete all habits and progress
                </Text>
              </View>

              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color={theme.colors.error}
              />
            </TouchableOpacity>
          </SettingSection>

          {/* Bottom spacing */}
          <View style={{ height: theme.spacing[8] }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}