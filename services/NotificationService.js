// services/NotificationService.js
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  constructor() {
    this.motivationalQuotes = [
      "Small steps every day lead to big changes! 🌟",
      "You're building something amazing, one habit at a time! 💪",
      "Consistency is your superpower! ⚡",
      "Your future self will thank you for this! 🚀",
      "Progress, not perfection. Keep going! 🎯",
      "Champions are made of daily habits! 🏆",
      "Every day is a new chance to grow! 🌱",
      "You've got this! Your streak is waiting! 🔥",
    ];

    this.streakEncouragement = [
      "🔥 Your {streak}-day streak is on fire! Keep it burning!",
      "💪 {streak} days strong! You're unstoppable!",
      "🌟 Amazing! {streak} consecutive days of growth!",
      "🎯 {streak} days of commitment. That's the spirit!",
      "🚀 Your {streak}-day journey continues. Next stop: success!",
    ];
  }

  // Initialize notification permissions
  async initialize() {
    if (!Device.isDevice) {
      console.log('Must use physical device for Push Notifications');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return false;
    }

    // Configure notification channel for Android
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('habit-reminders', {
        name: 'Habit Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#0ea5e9',
      });

      Notifications.setNotificationChannelAsync('achievements', {
        name: 'Achievements',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#22c55e',
      });
    }

    return true;
  }

  // Schedule daily habit reminders
  async scheduleHabitReminder(habit, reminderTime = '09:00') {
    try {
      const [hours, minutes] = reminderTime.split(':').map(Number);
      const now = new Date();
      const scheduledTime = new Date();
      scheduledTime.setHours(hours, minutes, 0, 0);

      // If the time has passed today, schedule for tomorrow
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `Time for: ${habit.name}`,
          body: this.getMotivationalMessage(),
          data: { habitId: habit.id, type: 'habit_reminder' },
          sound: 'default',
        },
        trigger: {
          hour: hours,
          minute: minutes,
          repeats: true,
        },
      });

      // Store notification ID for later cancellation
      await this.storeNotificationId(habit.id, notificationId);
      return notificationId;
    } catch (error) {
      console.error('Error scheduling habit reminder:', error);
      return null;
    }
  }

  // Schedule streak celebration
  async scheduleStreakCelebration(habit, streakCount) {
    if (streakCount % 7 === 0 && streakCount > 0) { // Celebrate weekly milestones
      const message = this.streakEncouragement[
        Math.floor(Math.random() * this.streakEncouragement.length)
      ].replace('{streak}', streakCount);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `🎉 Streak Milestone!`,
          body: message,
          data: { habitId: habit.id, type: 'streak_celebration', streak: streakCount },
          sound: 'default',
        },
        trigger: {
          seconds: 2,
        },
      });
    }
  }

  // Schedule smart reminders based on user behavior
  async scheduleSmartReminder(habit, userPattern) {
    const bestTime = this.analyzeBestReminderTime(userPattern);
    const smartMessage = this.generateSmartMessage(habit, userPattern);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Smart reminder: ${habit.name}`,
        body: smartMessage,
        data: { habitId: habit.id, type: 'smart_reminder' },
        sound: 'default',
      },
      trigger: {
        hour: bestTime.hour,
        minute: bestTime.minute,
        repeats: true,
      },
    });
  }

  // Analyze best time for reminders based on completion patterns
  analyzeBestReminderTime(userPattern) {
    // Default to 9 AM if no pattern available
    if (!userPattern || userPattern.length === 0) {
      return { hour: 9, minute: 0 };
    }

    // Find the most common completion hour
    const hourCounts = {};
    userPattern.forEach(completion => {
      const hour = new Date(completion.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    const bestHour = Object.keys(hourCounts).reduce((a, b) => 
      hourCounts[a] > hourCounts[b] ? a : b
    );

    // Suggest reminder 1 hour before the most common completion time
    const reminderHour = Math.max(0, parseInt(bestHour) - 1);
    return { hour: reminderHour, minute: 0 };
  }

  // Generate personalized message based on user behavior
  generateSmartMessage(habit, userPattern) {
    if (!userPattern || userPattern.length === 0) {
      return this.getMotivationalMessage();
    }

    const recentCompletions = userPattern.filter(
      p => Date.now() - new Date(p.timestamp).getTime() < 7 * 24 * 60 * 60 * 1000
    ).length;

    if (recentCompletions === 0) {
      return "It's been a while! Let's get back on track with your habits 💪";
    } else if (recentCompletions >= 5) {
      return "You're on a roll! Keep up the amazing consistency 🔥";
    } else {
      return this.getMotivationalMessage();
    }
  }

  // Get random motivational message
  getMotivationalMessage() {
    return this.motivationalQuotes[
      Math.floor(Math.random() * this.motivationalQuotes.length)
    ];
  }

  // Store notification ID for management
  async storeNotificationId(habitId, notificationId) {
    try {
      const stored = await AsyncStorage.getItem('notification_ids');
      const notificationIds = stored ? JSON.parse(stored) : {};
      notificationIds[habitId] = notificationId;
      await AsyncStorage.setItem('notification_ids', JSON.stringify(notificationIds));
    } catch (error) {
      console.error('Error storing notification ID:', error);
    }
  }

  // Cancel habit reminder
  async cancelHabitReminder(habitId) {
    try {
      const stored = await AsyncStorage.getItem('notification_ids');
      const notificationIds = stored ? JSON.parse(stored) : {};
      
      if (notificationIds[habitId]) {
        await Notifications.cancelScheduledNotificationAsync(notificationIds[habitId]);
        delete notificationIds[habitId];
        await AsyncStorage.setItem('notification_ids', JSON.stringify(notificationIds));
      }
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  // Cancel all notifications
  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await AsyncStorage.removeItem('notification_ids');
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  }

  // Schedule achievement notification
  async scheduleAchievementNotification(achievement) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🎉 Achievement Unlocked!',
          body: `${achievement.title}: ${achievement.description}`,
          data: { achievementId: achievement.id, type: 'achievement' },
          sound: 'default',
        },
        trigger: {
          seconds: 1,
        },
      });
    } catch (error) {
      console.error('Error scheduling achievement notification:', error);
    }
  }

  // Get scheduled notifications count
  async getScheduledNotificationsCount() {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      return notifications.length;
    } catch (error) {
      console.error('Error getting notifications count:', error);
      return 0;
    }
  }
}

export default new NotificationService();