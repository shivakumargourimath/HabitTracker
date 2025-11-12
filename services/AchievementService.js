// services/AchievementService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationService from './NotificationService';
import * as Haptics from 'expo-haptics';

export const achievements = [
  // Beginner Achievements
  {
    id: 'first_habit',
    title: 'Getting Started',
    description: 'Create your first habit',
    icon: 'star-outline',
    color: '#3b82f6',
    type: 'milestone',
    condition: { type: 'habits_created', value: 1 },
    points: 10
  },
  {
    id: 'first_completion',
    title: 'First Step',
    description: 'Complete your first habit',
    icon: 'check-circle',
    color: '#22c55e',
    type: 'milestone',
    condition: { type: 'total_completions', value: 1 },
    points: 15
  },
  
  // Streak Achievements
  {
    id: 'streak_3',
    title: 'On a Roll',
    description: 'Maintain a 3-day streak',
    icon: 'fire',
    color: '#f59e0b',
    type: 'streak',
    condition: { type: 'max_streak', value: 3 },
    points: 30
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: 'fire',
    color: '#f59e0b',
    type: 'streak',
    condition: { type: 'max_streak', value: 7 },
    points: 50
  },
  {
    id: 'streak_30',
    title: 'Month Master',
    description: 'Maintain a 30-day streak',
    icon: 'fire',
    color: '#ef4444',
    type: 'streak',
    condition: { type: 'max_streak', value: 30 },
    points: 200
  },
  {
    id: 'streak_100',
    title: 'Century Club',
    description: 'Maintain a 100-day streak',
    icon: 'trophy',
    color: '#fbbf24',
    type: 'streak',
    condition: { type: 'max_streak', value: 100 },
    points: 500
  },
  
  // Consistency Achievements
  {
    id: 'perfect_week',
    title: 'Perfect Week',
    description: 'Complete all habits for 7 days',
    icon: 'calendar-check',
    color: '#8b5cf6',
    type: 'consistency',
    condition: { type: 'perfect_days', value: 7 },
    points: 75
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Complete habits before 8 AM for 5 days',
    icon: 'weather-sunny',
    color: '#fbbf24',
    type: 'timing',
    condition: { type: 'early_completions', value: 5 },
    points: 40
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Complete habits after 10 PM for 5 days',
    icon: 'weather-night',
    color: '#6366f1',
    type: 'timing',
    condition: { type: 'late_completions', value: 5 },
    points: 40
  },
  
  // Quantity Achievements
  {
    id: 'completions_50',
    title: 'Half Century',
    description: 'Complete 50 total habits',
    icon: 'numeric-5',
    color: '#06b6d4',
    type: 'quantity',
    condition: { type: 'total_completions', value: 50 },
    points: 100
  },
  {
    id: 'completions_100',
    title: 'Centurion',
    description: 'Complete 100 total habits',
    icon: 'numeric-1',
    color: '#06b6d4',
    type: 'quantity',
    condition: { type: 'total_completions', value: 100 },
    points: 200
  },
  {
    id: 'completions_365',
    title: 'Year Round',
    description: 'Complete 365 total habits',
    icon: 'calendar',
    color: '#ef4444',
    type: 'quantity',
    condition: { type: 'total_completions', value: 365 },
    points: 500
  },
  
  // Social Achievements
  {
    id: 'habit_variety',
    title: 'Renaissance Person',
    description: 'Create habits in 5 different categories',
    icon: 'view-grid',
    color: '#ec4899',
    type: 'variety',
    condition: { type: 'categories_used', value: 5 },
    points: 150
  },
  {
    id: 'comeback_kid',
    title: 'Comeback Kid',
    description: 'Restart a habit after a 7-day break',
    icon: 'backup-restore',
    color: '#10b981',
    type: 'resilience',
    condition: { type: 'comeback', value: 1 },
    points: 100
  }
];

class AchievementService {
  constructor() {
    this.userAchievements = [];
    this.userStats = {
      habitsCreated: 0,
      totalCompletions: 0,
      maxStreak: 0,
      perfectDays: 0,
      earlyCompletions: 0,
      lateCompletions: 0,
      categoriesUsed: 0,
      comebacks: 0,
      totalPoints: 0
    };
  }

  // Initialize achievements system
  async initialize() {
    await this.loadUserAchievements();
    await this.loadUserStats();
  }

  // Load user achievements from storage
  async loadUserAchievements() {
    try {
      const stored = await AsyncStorage.getItem('user_achievements');
      this.userAchievements = stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading achievements:', error);
      this.userAchievements = [];
    }
  }

  // Load user stats from storage
  async loadUserStats() {
    try {
      const stored = await AsyncStorage.getItem('user_stats');
      if (stored) {
        this.userStats = { ...this.userStats, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  }

  // Save user achievements to storage
  async saveUserAchievements() {
    try {
      await AsyncStorage.setItem('user_achievements', JSON.stringify(this.userAchievements));
    } catch (error) {
      console.error('Error saving achievements:', error);
    }
  }

  // Save user stats to storage
  async saveUserStats() {
    try {
      await AsyncStorage.setItem('user_stats', JSON.stringify(this.userStats));
    } catch (error) {
      console.error('Error saving user stats:', error);
    }
  }

  // Update user stats and check for new achievements
  async updateStats(event, data = {}) {
    let statsUpdated = false;

    switch (event) {
      case 'habit_created':
        this.userStats.habitsCreated++;
        if (data.category) {
          // Track unique categories
          const categoriesSet = new Set(data.categoriesUsed || []);
          categoriesSet.add(data.category);
          this.userStats.categoriesUsed = categoriesSet.size;
        }
        statsUpdated = true;
        break;
        
      case 'habit_completed':
        this.userStats.totalCompletions++;
        
        // Check completion time for early/late achievements
        const hour = new Date().getHours();
        if (hour < 8) {
          this.userStats.earlyCompletions++;
        } else if (hour >= 22) {
          this.userStats.lateCompletions++;
        }
        
        // Update max streak
        if (data.currentStreak > this.userStats.maxStreak) {
          this.userStats.maxStreak = data.currentStreak;
        }
        
        statsUpdated = true;
        break;
        
      case 'perfect_day':
        this.userStats.perfectDays++;
        statsUpdated = true;
        break;
        
      case 'comeback':
        this.userStats.comebacks++;
        statsUpdated = true;
        break;
    }

    if (statsUpdated) {
      await this.saveUserStats();
      await this.checkForNewAchievements();
    }
  }

  // Check if user has earned new achievements
  async checkForNewAchievements() {
    const newAchievements = [];

    for (const achievement of achievements) {
      // Skip if already earned
      if (this.userAchievements.some(ua => ua.id === achievement.id)) {
        continue;
      }

      // Check if condition is met
      if (this.isConditionMet(achievement.condition)) {
        const userAchievement = {
          ...achievement,
          earnedAt: new Date().toISOString(),
          points: achievement.points
        };
        
        this.userAchievements.push(userAchievement);
        this.userStats.totalPoints += achievement.points;
        newAchievements.push(userAchievement);
        
        // Show achievement notification
        await this.showAchievementNotification(userAchievement);
      }
    }

    if (newAchievements.length > 0) {
      await this.saveUserAchievements();
      await this.saveUserStats();
    }

    return newAchievements;
  }

  // Check if achievement condition is met
  isConditionMet(condition) {
    switch (condition.type) {
      case 'habits_created':
        return this.userStats.habitsCreated >= condition.value;
      case 'total_completions':
        return this.userStats.totalCompletions >= condition.value;
      case 'max_streak':
        return this.userStats.maxStreak >= condition.value;
      case 'perfect_days':
        return this.userStats.perfectDays >= condition.value;
      case 'early_completions':
        return this.userStats.earlyCompletions >= condition.value;
      case 'late_completions':
        return this.userStats.lateCompletions >= condition.value;
      case 'categories_used':
        return this.userStats.categoriesUsed >= condition.value;
      case 'comeback':
        return this.userStats.comebacks >= condition.value;
      default:
        return false;
    }
  }

  // Show achievement notification
  async showAchievementNotification(achievement) {
    try {
      // Haptic feedback for achievement
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Show notification
      await NotificationService.scheduleAchievementNotification(achievement);
    } catch (error) {
      console.error('Error showing achievement notification:', error);
    }
  }

  // Get user level based on total points
  getUserLevel() {
    const points = this.userStats.totalPoints;
    
    if (points < 100) return { level: 1, title: 'Beginner', nextLevelPoints: 100 };
    if (points < 300) return { level: 2, title: 'Novice', nextLevelPoints: 300 };
    if (points < 600) return { level: 3, title: 'Apprentice', nextLevelPoints: 600 };
    if (points < 1000) return { level: 4, title: 'Skilled', nextLevelPoints: 1000 };
    if (points < 1500) return { level: 5, title: 'Expert', nextLevelPoints: 1500 };
    if (points < 2500) return { level: 6, title: 'Master', nextLevelPoints: 2500 };
    if (points < 4000) return { level: 7, title: 'Champion', nextLevelPoints: 4000 };
    if (points < 6000) return { level: 8, title: 'Legend', nextLevelPoints: 6000 };
    return { level: 9, title: 'Grandmaster', nextLevelPoints: null };
  }

  // Get achievement progress
  getAchievementProgress(achievementId) {
    const achievement = achievements.find(a => a.id === achievementId);
    if (!achievement) return null;

    const condition = achievement.condition;
    let currentValue = 0;

    switch (condition.type) {
      case 'habits_created':
        currentValue = this.userStats.habitsCreated;
        break;
      case 'total_completions':
        currentValue = this.userStats.totalCompletions;
        break;
      case 'max_streak':
        currentValue = this.userStats.maxStreak;
        break;
      case 'perfect_days':
        currentValue = this.userStats.perfectDays;
        break;
      case 'early_completions':
        currentValue = this.userStats.earlyCompletions;
        break;
      case 'late_completions':
        currentValue = this.userStats.lateCompletions;
        break;
      case 'categories_used':
        currentValue = this.userStats.categoriesUsed;
        break;
      case 'comeback':
        currentValue = this.userStats.comebacks;
        break;
    }

    return {
      current: Math.min(currentValue, condition.value),
      target: condition.value,
      percentage: Math.min((currentValue / condition.value) * 100, 100),
      completed: currentValue >= condition.value
    };
  }

  // Get recent achievements
  getRecentAchievements(limit = 5) {
    return this.userAchievements
      .sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt))
      .slice(0, limit);
  }

  // Get achievements by category
  getAchievementsByType(type) {
    return achievements.filter(a => a.type === type);
  }

  // Reset all achievements (for testing)
  async resetAchievements() {
    this.userAchievements = [];
    this.userStats = {
      habitsCreated: 0,
      totalCompletions: 0,
      maxStreak: 0,
      perfectDays: 0,
      earlyCompletions: 0,
      lateCompletions: 0,
      categoriesUsed: 0,
      comebacks: 0,
      totalPoints: 0
    };
    
    await this.saveUserAchievements();
    await this.saveUserStats();
  }
}

export default new AchievementService();