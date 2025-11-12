import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useHabits } from '../context/HabitContext';
import { getRandomQuote } from '../constants/motivationalQuotes';

const { width } = Dimensions.get('window');

export default function StatsEnhanced({ navigation }) {
  const { habits } = useHabits();
  const [motivationalQuote] = useState(getRandomQuote());

  // Calculate comprehensive statistics
  const stats = useMemo(() => {
    const totalHabits = habits.length;
    const completedToday = habits.filter(h => h.completedToday).length;
    const pendingToday = totalHabits - completedToday;
    
    // Streak calculations
    const totalStreak = habits.reduce((sum, h) => sum + (h.streak || 0), 0);
    const averageStreak = totalHabits > 0 ? Math.round(totalStreak / totalHabits) : 0;
    const longestStreak = totalHabits > 0 ? Math.max(...habits.map(h => h.streak || 0)) : 0;
    const habitsOnFire = habits.filter(h => (h.streak || 0) >= 7).length;
    
    // Completion rates
    const completionRateToday = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
    
    // Calculate 7-day completion rate
    const last7Days = habits.map(h => {
      const history = h.completionHistory || [];
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentCompletions = history.filter(date => new Date(date) >= sevenDaysAgo).length;
      return recentCompletions;
    });
    const total7DayCompletions = last7Days.reduce((sum, count) => sum + count, 0);
    const possible7DayCompletions = totalHabits * 7;
    const completionRate7Days = possible7DayCompletions > 0 
      ? Math.round((total7DayCompletions / possible7DayCompletions) * 100) 
      : 0;
    
    // Total completions all time
    const totalCompletions = habits.reduce((sum, h) => 
      sum + (h.completionHistory || []).length, 0);
    
    // Best performing habit
    const bestHabit = habits.length > 0 
      ? habits.reduce((best, h) => ((h.streak || 0) > (best.streak || 0) ? h : best), habits[0])
      : null;
    
    // Consistency score (habits with streak > 0)
    const consistentHabits = habits.filter(h => (h.streak || 0) > 0).length;
    const consistencyScore = totalHabits > 0 
      ? Math.round((consistentHabits / totalHabits) * 100) 
      : 0;

    return {
      totalHabits,
      completedToday,
      pendingToday,
      averageStreak,
      longestStreak,
      habitsOnFire,
      completionRateToday,
      completionRate7Days,
      totalCompletions,
      bestHabit,
      consistencyScore,
      consistentHabits,
    };
  }, [habits]);

  // Get top 3 habits by streak
  const topHabits = useMemo(() => {
    return [...habits]
      .filter(h => (h.streak || 0) > 0)
      .sort((a, b) => (b.streak || 0) - (a.streak || 0))
      .slice(0, 3);
  }, [habits]);

  // Get habits needing attention (not completed today)
  const needsAttention = useMemo(() => {
    return habits.filter(h => !h.completedToday).slice(0, 3);
  }, [habits]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Statistics & Insights</Text>
          <View style={styles.backButton} />
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* Overview Cards Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <LinearGradient colors={['#667eea15', '#764ba215']} style={styles.statGradient}>
                <MaterialCommunityIcons name="target" size={32} color="#667eea" />
                <Text style={styles.statValue}>{stats.totalHabits}</Text>
                <Text style={styles.statLabel}>Total Habits</Text>
              </LinearGradient>
            </View>
            
            <View style={styles.statCard}>
              <LinearGradient colors={['#22c55e15', '#16a34a15']} style={styles.statGradient}>
                <MaterialCommunityIcons name="check-circle" size={32} color="#22c55e" />
                <Text style={styles.statValue}>{stats.completedToday}</Text>
                <Text style={styles.statLabel}>Done Today</Text>
              </LinearGradient>
            </View>
            
            <View style={styles.statCard}>
              <LinearGradient colors={['#ff6b6b15', '#ff8e5315']} style={styles.statGradient}>
                <MaterialCommunityIcons name="fire" size={32} color="#ff6b6b" />
                <Text style={styles.statValue}>{stats.longestStreak}</Text>
                <Text style={styles.statLabel}>Best Streak</Text>
              </LinearGradient>
            </View>
            
            <View style={styles.statCard}>
              <LinearGradient colors={['#fbbf2415', '#f59e0b15']} style={styles.statGradient}>
                <MaterialCommunityIcons name="chart-line" size={32} color="#fbbf24" />
                <Text style={styles.statValue}>{stats.completionRateToday}%</Text>
                <Text style={styles.statLabel}>Today's Rate</Text>
              </LinearGradient>
            </View>
          </View>
        </View>

        {/* Detailed Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detailed Metrics</Text>
          
          <View style={styles.metricCard}>
            <View style={styles.metricRow}>
              <View style={styles.metricIcon}>
                <MaterialCommunityIcons name="calendar-check" size={24} color="#667eea" />
              </View>
              <View style={styles.metricContent}>
                <Text style={styles.metricLabel}>Total Completions</Text>
                <Text style={styles.metricValue}>{stats.totalCompletions} times</Text>
              </View>
              <View style={[styles.metricBadge, { backgroundColor: '#667eea15' }]}>
                <Text style={[styles.metricBadgeText, { color: '#667eea' }]}>All Time</Text>
              </View>
            </View>

            <View style={styles.metricRow}>
              <View style={styles.metricIcon}>
                <MaterialCommunityIcons name="calendar-week" size={24} color="#22c55e" />
              </View>
              <View style={styles.metricContent}>
                <Text style={styles.metricLabel}>7-Day Success Rate</Text>
                <Text style={styles.metricValue}>{stats.completionRate7Days}%</Text>
              </View>
              <View style={[styles.metricBadge, { backgroundColor: '#22c55e15' }]}>
                <Text style={[styles.metricBadgeText, { color: '#22c55e' }]}>This Week</Text>
              </View>
            </View>

            <View style={styles.metricRow}>
              <View style={styles.metricIcon}>
                <MaterialCommunityIcons name="flash" size={24} color="#ff6b6b" />
              </View>
              <View style={styles.metricContent}>
                <Text style={styles.metricLabel}>Habits On Fire</Text>
                <Text style={styles.metricValue}>{stats.habitsOnFire} habits</Text>
              </View>
              <View style={[styles.metricBadge, { backgroundColor: '#ff6b6b15' }]}>
                <Text style={[styles.metricBadgeText, { color: '#ff6b6b' }]}>7+ Days</Text>
              </View>
            </View>

            <View style={styles.metricRow}>
              <View style={styles.metricIcon}>
                <MaterialCommunityIcons name="shield-check" size={24} color="#8b5cf6" />
              </View>
              <View style={styles.metricContent}>
                <Text style={styles.metricLabel}>Consistency Score</Text>
                <Text style={styles.metricValue}>{stats.consistencyScore}%</Text>
              </View>
              <View style={[styles.metricBadge, { backgroundColor: '#8b5cf615' }]}>
                <Text style={[styles.metricBadgeText, { color: '#8b5cf6' }]}>
                  {stats.consistentHabits}/{stats.totalHabits}
                </Text>
              </View>
            </View>

            <View style={styles.metricRow}>
              <View style={styles.metricIcon}>
                <MaterialCommunityIcons name="trending-up" size={24} color="#fbbf24" />
              </View>
              <View style={styles.metricContent}>
                <Text style={styles.metricLabel}>Average Streak</Text>
                <Text style={styles.metricValue}>{stats.averageStreak} days</Text>
              </View>
              <View style={[styles.metricBadge, { backgroundColor: '#fbbf2415' }]}>
                <Text style={[styles.metricBadgeText, { color: '#fbbf24' }]}>Per Habit</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Top Performers */}
        {topHabits.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="trophy" size={24} color="#ffa502" />
              <Text style={styles.sectionTitle}>Top Performers</Text>
            </View>
            
            {topHabits.map((habit, index) => (
              <TouchableOpacity 
                key={habit.id}
                style={styles.topHabitCard}
                onPress={() => navigation.navigate('HabitDetail', { habit })}
              >
                <View style={styles.topHabitRank}>
                  <Text style={styles.topHabitRankText}>#{index + 1}</Text>
                </View>
                <View style={[styles.topHabitIndicator, { backgroundColor: habit.color }]} />
                <View style={styles.topHabitContent}>
                  <Text style={styles.topHabitName}>{habit.name}</Text>
                  <View style={styles.topHabitMeta}>
                    <MaterialCommunityIcons name="fire" size={16} color="#ff6b6b" />
                    <Text style={styles.topHabitStreak}>{habit.streak} day streak</Text>
                  </View>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#cbd5e1" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Needs Attention */}
        {needsAttention.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="alert-circle" size={24} color="#f59e0b" />
              <Text style={styles.sectionTitle}>Needs Attention</Text>
            </View>
            
            {needsAttention.map((habit) => (
              <TouchableOpacity 
                key={habit.id}
                style={styles.attentionCard}
                onPress={() => navigation.navigate('HabitDetail', { habit })}
              >
                <View style={[styles.attentionIndicator, { backgroundColor: habit.color }]} />
                <View style={styles.attentionContent}>
                  <Text style={styles.attentionName}>{habit.name}</Text>
                  <Text style={styles.attentionText}>Not completed today</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#cbd5e1" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Best Habit Highlight */}
        {stats.bestHabit && stats.bestHabit.streak > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🌟 Star Habit</Text>
            <TouchableOpacity 
              style={styles.bestHabitCard}
              onPress={() => navigation.navigate('HabitDetail', { habit: stats.bestHabit })}
            >
              <LinearGradient
                colors={['#ffa502', '#ff6348']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.bestHabitGradient}
              >
                <MaterialCommunityIcons name="crown" size={48} color="#fff" />
                <Text style={styles.bestHabitName}>{stats.bestHabit.name}</Text>
                <Text style={styles.bestHabitStreak}>
                  {stats.bestHabit.streak} day streak
                </Text>
                <Text style={styles.bestHabitSubtext}>Your longest running habit!</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Motivational Quote */}
        <View style={styles.section}>
          <View style={styles.quoteCard}>
            <LinearGradient
              colors={['#667eea15', '#764ba215']}
              style={styles.quoteGradient}
            >
              <MaterialCommunityIcons name="lightbulb-on" size={32} color="#667eea" />
              <Text style={styles.quoteText}>"{motivationalQuote.text}"</Text>
              <Text style={styles.quoteAuthor}>— {motivationalQuote.author}</Text>
            </LinearGradient>
          </View>
        </View>

        {/* All Habits List */}
        {habits.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>All Habits</Text>
            {habits.map((habit) => (
              <TouchableOpacity 
                key={habit.id}
                style={styles.habitListItem}
                onPress={() => navigation.navigate('HabitDetail', { habit })}
              >
                <View style={[styles.habitListIndicator, { backgroundColor: habit.color }]} />
                <View style={styles.habitListContent}>
                  <Text style={styles.habitListName}>{habit.name}</Text>
                  <View style={styles.habitListMeta}>
                    <View style={styles.habitListStat}>
                      <MaterialCommunityIcons name="fire" size={14} color="#f59e0b" />
                      <Text style={styles.habitListStatText}>
                        {habit.streak || 0} day{(habit.streak || 0) !== 1 ? 's' : ''}
                      </Text>
                    </View>
                    <View style={styles.habitListStat}>
                      <MaterialCommunityIcons 
                        name={habit.completedToday ? "check-circle" : "circle-outline"} 
                        size={14} 
                        color={habit.completedToday ? "#22c55e" : "#94a3b8"} 
                      />
                      <Text style={styles.habitListStatText}>
                        {habit.completedToday ? "Done" : "Pending"}
                      </Text>
                    </View>
                  </View>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color="#cbd5e1" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingBottom: 20,
  },
  headerContent: {
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  metricCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  metricContent: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  metricBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  metricBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  topHabitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  topHabitRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffa50220',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  topHabitRankText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffa502',
  },
  topHabitIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  topHabitContent: {
    flex: 1,
  },
  topHabitName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  topHabitMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topHabitStreak: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 4,
  },
  attentionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  attentionIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  attentionContent: {
    flex: 1,
  },
  attentionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  attentionText: {
    fontSize: 14,
    color: '#f59e0b',
  },
  bestHabitCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  bestHabitGradient: {
    padding: 32,
    alignItems: 'center',
  },
  bestHabitName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginTop: 16,
    textAlign: 'center',
  },
  bestHabitStreak: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginTop: 8,
  },
  bestHabitSubtext: {
    fontSize: 14,
    color: '#ffffffcc',
    marginTop: 4,
  },
  quoteCard: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quoteGradient: {
    padding: 24,
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#1e293b',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 12,
    lineHeight: 24,
  },
  quoteAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
  },
  habitListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  habitListIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  habitListContent: {
    flex: 1,
  },
  habitListName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 6,
  },
  habitListMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  habitListStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitListStatText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 4,
  },
});
