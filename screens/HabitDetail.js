import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useHabits } from '../context/HabitContext';

const { width } = Dimensions.get('window');

export default function HabitDetail({ route, navigation }) {
  const { habit: initialHabit } = route.params;
  const { habits, updateHabit, deleteHabit } = useHabits();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  
  // Get the latest habit data from context to ensure it stays in sync
  const habit = habits.find(h => h.id === initialHabit.id) || initialHabit;
  
  // Refresh when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('🔄 HabitDetail screen focused - refreshing data');
    });
    return unsubscribe;
  }, [navigation]);

  // Calculate comprehensive stats
  const stats = useMemo(() => {
    // Ensure completionHistory exists and is an array
    const completionHistory = Array.isArray(habit.completionHistory) ? habit.completionHistory : [];
    const totalDays = completionHistory.length;
    const currentStreak = habit.streak || 0;
    
    // Calculate longest streak from history
    let longestStreak = 0;
    let tempStreak = 0;
    
    const sortedHistory = [...completionHistory].sort((a, b) => 
      new Date(a) - new Date(b)
    );
    
    for (let i = 0; i < sortedHistory.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prevDate = new Date(sortedHistory[i - 1]);
        const currDate = new Date(sortedHistory[i]);
        const diffDays = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);
    
    // Calculate completion rate (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentCompletions = completionHistory.filter(date => 
      new Date(date) >= thirtyDaysAgo
    ).length;
    
    const completionRate = Math.round((recentCompletions / 30) * 100);
    
    // Calculate best week
    const weekCompletions = {};
    completionHistory.forEach(date => {
      const d = new Date(date);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      weekCompletions[weekKey] = (weekCompletions[weekKey] || 0) + 1;
    });
    
    const bestWeek = Math.max(0, ...Object.values(weekCompletions));
    
    return {
      totalDays,
      currentStreak,
      longestStreak,
      completionRate,
      bestWeek,
      recentCompletions,
    };
  }, [habit]);

  // Calculate badges earned
  const badges = useMemo(() => {
    const earned = [];
    
    if (stats.totalDays >= 1) {
      earned.push({ 
        icon: 'flag-checkered', 
        title: 'First Day', 
        desc: 'Started the journey',
        color: '#667eea' 
      });
    }
    if (stats.currentStreak >= 3) {
      earned.push({ 
        icon: 'fire', 
        title: '3-Day Flame', 
        desc: '3-day streak',
        color: '#f87171' 
      });
    }
    if (stats.currentStreak >= 7) {
      earned.push({ 
        icon: 'flash', 
        title: 'Week Warrior', 
        desc: '7-day streak',
        color: '#fbbf24' 
      });
    }
    if (stats.currentStreak >= 14) {
      earned.push({ 
        icon: 'medal', 
        title: 'Two Weeks Strong', 
        desc: '14-day streak',
        color: '#a78bfa' 
      });
    }
    if (stats.currentStreak >= 30) {
      earned.push({ 
        icon: 'trophy', 
        title: 'Monthly Master', 
        desc: '30-day streak',
        color: '#ffa502' 
      });
    }
    if (stats.longestStreak >= 50) {
      earned.push({ 
        icon: 'crown', 
        title: 'Legendary', 
        desc: '50+ day streak',
        color: '#f093fb' 
      });
    }
    if (stats.completionRate >= 80) {
      earned.push({ 
        icon: 'check-all', 
        title: 'Consistent', 
        desc: '80%+ completion',
        color: '#22c55e' 
      });
    }
    if (stats.bestWeek === 7) {
      earned.push({ 
        icon: 'star', 
        title: 'Perfect Week', 
        desc: 'All 7 days completed',
        color: '#4facfe' 
      });
    }
    
    return earned;
  }, [stats]);

  // Generate calendar data
  const calendarData = useMemo(() => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Ensure completionHistory exists and is an array
    const completionHistory = Array.isArray(habit.completionHistory) ? habit.completionHistory : [];
    const completionSet = new Set(
      completionHistory.map(date => new Date(date).toISOString().split('T')[0])
    );
    
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ day: null, completed: false, isToday: false });
    }
    
    // Add days of the month
    const today = new Date().toISOString().split('T')[0];
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = new Date(year, month, day).toISOString().split('T')[0];
      days.push({
        day,
        completed: completionSet.has(dateStr),
        isToday: dateStr === today,
        date: dateStr,
      });
    }
    
    return days;
  }, [selectedMonth, habit.completionHistory]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const changeMonth = (direction) => {
    const newMonth = new Date(selectedMonth);
    newMonth.setMonth(selectedMonth.getMonth() + direction);
    setSelectedMonth(newMonth);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habit.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteHabit(habit.id);
            navigation.goBack();
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[habit.color, habit.color + 'dd']}
        style={styles.header}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.headerTop}>
            <TouchableOpacity 
              onPress={() => navigation.goBack()} 
              style={styles.backButton}
            >
              <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Habit Details</Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('UpdateHabit', { habit })}
              style={styles.editButton}
            >
              <MaterialCommunityIcons name="pencil" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          {/* Habit Info */}
          <View style={styles.habitInfo}>
            <Text style={styles.habitName}>{habit.name || 'Unnamed Habit'}</Text>
            {habit.description && habit.description.trim() !== '' && (
              <Text style={styles.habitDescription}>{habit.description}</Text>
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* Current Streak Card */}
        <View style={styles.streakCard}>
          <LinearGradient
            colors={['#ff6b6b', '#ff8e53']}
            style={styles.streakGradient}
          >
            <MaterialCommunityIcons name="fire" size={48} color="#fff" />
            <Text style={styles.streakValue}>{stats.currentStreak}</Text>
            <Text style={styles.streakLabel}>Day Streak</Text>
            <Text style={styles.streakSubtext}>Keep it burning! 🔥</Text>
          </LinearGradient>
        </View>

        {/* View Insights Button */}
        <TouchableOpacity 
          style={styles.insightsButton}
          onPress={() => navigation.navigate('HabitInsights', { habit })}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.insightsButtonGradient}
          >
            <MaterialCommunityIcons name="chart-timeline-variant" size={24} color="#fff" />
            <Text style={styles.insightsButtonText}>View Detailed Insights</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <LinearGradient colors={['#667eea15', '#764ba215']} style={styles.statGradient}>
              <MaterialCommunityIcons name="calendar-check" size={28} color="#667eea" />
              <Text style={styles.statValue}>{stats.totalDays}</Text>
              <Text style={styles.statLabel}>Total Days</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.statCard}>
            <LinearGradient colors={['#ffa50215', '#ff634715']} style={styles.statGradient}>
              <MaterialCommunityIcons name="trophy" size={28} color="#ffa502" />
              <Text style={styles.statValue}>{stats.longestStreak}</Text>
              <Text style={styles.statLabel}>Best Streak</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.statCard}>
            <LinearGradient colors={['#22c55e15', '#16a34a15']} style={styles.statGradient}>
              <MaterialCommunityIcons name="chart-line" size={28} color="#22c55e" />
              <Text style={styles.statValue}>{stats.completionRate}%</Text>
              <Text style={styles.statLabel}>30-Day Rate</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.statCard}>
            <LinearGradient colors={['#4facfe15', '#00f2fe15']} style={styles.statGradient}>
              <MaterialCommunityIcons name="calendar-week" size={28} color="#4facfe" />
              <Text style={styles.statValue}>{stats.bestWeek}/7</Text>
              <Text style={styles.statLabel}>Best Week</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Badges Section */}
        {badges.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="shield-star" size={24} color="#ffa502" />
              <Text style={styles.sectionTitle}>Achievements</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{badges.length}</Text>
              </View>
            </View>
            
            <View style={styles.badgesGrid}>
              {badges.map((badge, index) => (
                <View key={index} style={styles.badgeCard}>
                  <LinearGradient
                    colors={[badge.color + '20', badge.color + '10']}
                    style={styles.badgeGradient}
                  >
                    <View style={[styles.badgeIcon, { backgroundColor: badge.color }]}>
                      <MaterialCommunityIcons name={badge.icon} size={24} color="#fff" />
                    </View>
                    <Text style={styles.badgeTitle}>{badge.title}</Text>
                    <Text style={styles.badgeDesc}>{badge.desc}</Text>
                  </LinearGradient>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Calendar Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="calendar-month" size={24} color="#667eea" />
            <Text style={styles.sectionTitle}>Completion History</Text>
          </View>
          
          <View style={styles.calendarCard}>
            {/* Month Navigation */}
            <View style={styles.monthNav}>
              <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.monthButton}>
                <MaterialCommunityIcons name="chevron-left" size={24} color="#64748b" />
              </TouchableOpacity>
              <Text style={styles.monthTitle}>
                {monthNames[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
              </Text>
              <TouchableOpacity onPress={() => changeMonth(1)} style={styles.monthButton}>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            {/* Day Labels */}
            <View style={styles.dayLabels}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <Text key={index} style={styles.dayLabel}>{day}</Text>
              ))}
            </View>

            {/* Calendar Grid */}
            <View style={styles.calendarGrid}>
              {calendarData.map((dayData, index) => (
                <View key={index} style={styles.dayCell}>
                  {dayData.day && (
                    <View style={[
                      styles.dayCircle,
                      dayData.completed && styles.dayCompleted,
                      dayData.isToday && styles.dayToday,
                      dayData.completed && { backgroundColor: habit.color },
                    ]}>
                      <Text style={[
                        styles.dayText,
                        dayData.completed && styles.dayTextCompleted,
                        dayData.isToday && !dayData.completed && styles.dayTextToday,
                      ]}>
                        {dayData.day}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>

            {/* Calendar Legend */}
            <View style={styles.calendarLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: habit.color }]} />
                <Text style={styles.legendText}>Completed</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { borderWidth: 2, borderColor: '#667eea' }]} />
                <Text style={styles.legendText}>Today</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="chart-box" size={24} color="#667eea" />
            <Text style={styles.sectionTitle}>Quick Stats</Text>
          </View>
          
          <View style={styles.quickStatsCard}>
            <View style={styles.quickStatRow}>
              <MaterialCommunityIcons name="calendar-today" size={20} color="#64748b" />
              <Text style={styles.quickStatLabel}>This Month</Text>
              <Text style={styles.quickStatValue}>
                {calendarData.filter(d => d.completed).length} days
              </Text>
            </View>
            
            <View style={styles.quickStatRow}>
              <MaterialCommunityIcons name="calendar-range" size={20} color="#64748b" />
              <Text style={styles.quickStatLabel}>Last 30 Days</Text>
              <Text style={styles.quickStatValue}>
                {stats.recentCompletions} days
              </Text>
            </View>
            
            <View style={styles.quickStatRow}>
              <MaterialCommunityIcons name="calendar-clock" size={20} color="#64748b" />
              <Text style={styles.quickStatLabel}>Created</Text>
              <Text style={styles.quickStatValue}>
                {habit.createdAt ? new Date(habit.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                }) : 'Recently'}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.editActionButton}
            onPress={() => navigation.navigate('UpdateHabit', { habit })}
          >
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.actionButtonGradient}>
              <MaterialCommunityIcons name="pencil" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Edit Habit</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.deleteActionButton}
            onPress={handleDelete}
          >
            <View style={styles.deleteButtonContent}>
              <MaterialCommunityIcons name="delete" size={20} color="#ef4444" />
              <Text style={styles.deleteButtonText}>Delete Habit</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitInfo: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 12,
  },
  habitName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  habitDescription: {
    fontSize: 16,
    color: '#ffffffcc',
    lineHeight: 22,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  streakCard: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  streakGradient: {
    padding: 24,
    alignItems: 'center',
  },
  streakValue: {
    fontSize: 56,
    fontWeight: '700',
    color: '#fff',
    marginTop: 12,
  },
  streakLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginTop: 4,
  },
  streakSubtext: {
    fontSize: 14,
    color: '#ffffffcc',
    marginTop: 8,
  },
  insightsButton: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  insightsButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  insightsButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    width: (width - 44) / 2,
  },
  statGradient: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00000008',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
  },
  badge: {
    backgroundColor: '#ffa502',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    width: (width - 44) / 2,
  },
  badgeGradient: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00000008',
  },
  badgeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
    textAlign: 'center',
  },
  badgeDesc: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  calendarCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthButton: {
    padding: 8,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  dayLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  dayLabel: {
    width: (width - 96) / 7,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: (width - 96) / 7,
    aspectRatio: 1,
    padding: 2,
  },
  dayCircle: {
    flex: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCompleted: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  dayToday: {
    borderWidth: 2,
    borderColor: '#667eea',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  dayTextCompleted: {
    color: '#fff',
    fontWeight: '700',
  },
  dayTextToday: {
    color: '#667eea',
    fontWeight: '700',
  },
  calendarLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#64748b',
  },
  quickStatsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  quickStatLabel: {
    flex: 1,
    fontSize: 14,
    color: '#64748b',
    marginLeft: 12,
  },
  quickStatValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  actionButtons: {
    paddingHorizontal: 16,
    marginTop: 24,
    gap: 12,
  },
  editActionButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteActionButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fee2e2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  deleteButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  deleteButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
});
