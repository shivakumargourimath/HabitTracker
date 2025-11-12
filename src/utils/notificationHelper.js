import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Request notification permissions
export const requestNotificationPermission = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

// Schedule daily reminder
export const scheduleDailyReminder = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const trigger = new Date();
  trigger.setHours(20);
  trigger.setMinutes(0);
  trigger.setSeconds(0);

  if (trigger <= new Date()) trigger.setDate(trigger.getDate() + 1);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🛡️ Habit Reminder',
      body: 'Don’t forget to complete your habits today!',
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
      shouldShowBanner: true,
      shouldShowList: true,
    },
    trigger: {
      hour: trigger.getHours(),
      minute: trigger.getMinutes(),
      repeats: true,
    },
  });
};

// Cancel all reminders
export const cancelAllReminders = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};
