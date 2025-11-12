import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Animated, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useHabits } from '../context/HabitContext';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, borderRadius, shadows, typography } from '../constants/modernTheme';
import { getQuoteOfTheDay } from '../constants/motivationalQuotes';
import AIWeeklySummaryCard from '../components/AIWeeklySummaryCard';
import { analyzeWeeklyHabits } from '../utils/weeklyAnalyzer';

export default function HomeModern({ navigation }) {
  const { habits, toggleCompletion, deleteHabit } = useHabits();
  const { user } = useAuth();
  const [scaleAnim] = useState(new Animated.Value(1));
  const [statusExpanded, setStatusExpanded] = useState(false);
  const [dailyQuote] = useState(getQuoteOfTheDay());
  
  // Analyze weekly habits data for AI insight - Only recalculate when habits array reference changes
  const weeklyData = useMemo(() => {
    return analyzeWeeklyHabits(habits);
  }, [habits]);
  
  // Animation values
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const heightAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const statCard1Anim = useRef(new Animated.Value(0)).current;
  const statCard2Anim = useRef(new Animated.Value(0)).current;
  const statCard3Anim = useRef(new Animated.Value(0)).current;
  const statCard4Anim = useRef(new Animated.Value(0)).current;

  // Memoize progress calculation
  const progress = useMemo(() => {
    if (habits.length === 0) return 0;
    const completed = habits.filter(h => h.completedToday).length;
    return Math.round((completed / habits.length) * 100);
  }, [habits]);

  const getProgress = useCallback(() => progress, [progress]);

  // Memoize stats calculation
  const stats = useMemo(() => {
    const totalHabits = habits.length;
    const completed = habits.filter(h => h.completedToday).length;
    const pending = totalHabits - completed;
    const totalStreak = habits.reduce((sum, h) => sum + (h.streak || 0), 0);
    const avgStreak = totalHabits > 0 ? Math.round(totalStreak / totalHabits) : 0;
    const longestStreak = totalHabits > 0 ? Math.max(...habits.map(h => h.streak || 0)) : 0;
    const completionRate = totalHabits > 0 ? Math.round((completed / totalHabits) * 100) : 0;
    const habitsOnFire = habits.filter(h => h.streak >= 7).length;
    const needsAttention = habits.filter(h => !h.completedToday).length;
    
    return { 
      totalHabits, 
      completed, 
      pending, 
      avgStreak, 
      longestStreak, 
      completionRate,
      habitsOnFire,
      needsAttention
    };
  }, [habits]);

  const getStats = useCallback(() => stats, [stats]);

  // Memoize motivational message
  const motivationalMessage = useMemo(() => {
    if (progress === 100) {
      return { emoji: '🎉', message: 'Perfect day! All habits completed!' };
    } else if (progress >= 75) {
      return { emoji: '🔥', message: 'Amazing progress! Keep it up!' };
    } else if (progress >= 50) {
      return { emoji: '💪', message: 'You\'re halfway there!' };
    } else if (progress >= 25) {
      return { emoji: '🌟', message: 'Good start! Keep going!' };
    } else if (stats.completed > 0) {
      return { emoji: '👍', message: 'Every step counts!' };
    } else {
      return { emoji: '🎯', message: 'Let\'s start your day right!' };
    }
  }, [progress, stats.completed]);

  const getMotivationalMessage = useCallback(() => motivationalMessage, [motivationalMessage]);

  // Toggle status section with animations
  const toggleStatusSection = () => {
    const toValue = statusExpanded ? 0 : 1;
    setStatusExpanded(!statusExpanded);
    
    // Native driver animations (transform and opacity)
    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue: toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(heightAnim, {
        toValue: toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: toValue,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();

    // Staggered stat card animations
    if (!statusExpanded) {
      Animated.stagger(60, [
        Animated.timing(statCard1Anim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(statCard2Anim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(statCard3Anim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(statCard4Anim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      [statCard1Anim, statCard2Anim, statCard3Anim, statCard4Anim].forEach(anim => {
        anim.setValue(0);
      });
    }
  };

  const chevronRotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const contentScale = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleDeleteHabit = (habitId, habitName) => {
    Alert.alert('Delete Habit', `Delete "${habitName}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteHabit(habitId) },
    ]);
  };

  const renderHabit = ({ item }) => (
    <Animated.View style={[styles.habitCard, { transform: [{ scale: scaleAnim }] }]}>
      <View style={styles.habitCardContainer}>
        <LinearGradient colors={[item.color + '15', item.color + '05']} style={styles.habitGradient}>
          {/* Streak indicator line */}
          {item.streak > 0 && (
            <View style={[styles.streakIndicator, { backgroundColor: item.color }]} />
          )}
          
          <View style={styles.habitContent}>
            <View style={styles.habitInfo}>
              <TouchableOpacity onPress={() => { handlePress(); toggleCompletion(item.id); }}>
                <LinearGradient
                  colors={item.completedToday ? [item.color, item.color + 'cc'] : ['transparent', 'transparent']}
                  style={[styles.checkbox, { borderColor: item.color, borderWidth: item.completedToday ? 0 : 2 }]}
                >
                  {item.completedToday && <MaterialCommunityIcons name="check" size={20} color="#fff" />}
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.habitDetails} 
                onPress={() => navigation.navigate('HabitDetail', { habit: item })}
              >
                <Text style={[styles.habitName, item.completedToday && styles.habitNameCompleted]}>{item.name}</Text>
                <View style={styles.habitMeta}>
                  {item.streak > 0 && (
                    <>
                      <MaterialCommunityIcons name="fire" size={14} color="#ff6b6b" />
                      <Text style={styles.streakText}>{item.streak || 0} day{item.streak !== 1 ? 's' : ''}</Text>
                    </>
                  )}
                  {item.completedToday && (
                    <View style={styles.completedBadge}>
                      <MaterialCommunityIcons name="check-circle" size={12} color="#22c55e" />
                      <Text style={styles.completedBadgeText}>Done</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.habitActions}>
            <TouchableOpacity onPress={() => navigation.navigate('HabitDetail', { habit: item })} style={styles.actionButton}>
              <MaterialCommunityIcons name="information-outline" size={18} color={colors.textLight} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('UpdateHabit', { habit: item })} style={styles.actionButton}>
              <MaterialCommunityIcons name="pencil" size={18} color={colors.textLight} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteHabit(item.id, item.name)} style={styles.actionButton}>
              <MaterialCommunityIcons name="delete" size={18} color={colors.danger} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Animated.View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <LinearGradient colors={colors.primaryGradient} style={styles.emptyIcon}>
        <MaterialCommunityIcons name="target" size={40} color="#fff" />
      </LinearGradient>
      <Text style={styles.emptyTitle}>Welcome! Let's Build Great Habits</Text>
      <Text style={styles.emptyText}>Start by creating your first habit. Track it daily, build streaks, and get AI-powered insights on your progress!</Text>
      <TouchableOpacity onPress={() => navigation.navigate('AddHabit')}>
        <LinearGradient colors={colors.primaryGradient} style={styles.emptyButton}>
          <MaterialCommunityIcons name="plus" size={20} color="#fff" />
          <Text style={styles.emptyButtonText}>Create Your First Habit</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.headerGradient}>
        <SafeAreaView edges={['top']}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Hello, {user?.name || 'User'}! 👋</Text>
              <Text style={styles.subGreeting}>Keep up the great work</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.avatar}>
              <LinearGradient colors={['#fff', '#f8f9fa']} style={styles.avatarGradient}>
                <MaterialCommunityIcons name="account" size={24} color={colors.primary} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* Motivational Quote Card */}
        <View style={styles.quoteCard}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.quoteGradient}
          >
            <MaterialCommunityIcons name="format-quote-open" size={32} color="#ffffff80" style={styles.quoteIconTop} />
            <Text style={styles.quoteText}>"{dailyQuote.text}"</Text>
            <Text style={styles.quoteAuthor}>— {dailyQuote.author}</Text>
            <MaterialCommunityIcons name="format-quote-close" size={32} color="#ffffff80" style={styles.quoteIconBottom} />
          </LinearGradient>
        </View>

        {/* AI Weekly Summary */}
        {weeklyData && (
          <AIWeeklySummaryCard weeklyData={weeklyData} />
        )}

        {habits.length > 0 && (
          <View style={styles.progressCard}>
              <View style={styles.progressInfo}>
                <View style={styles.progressLabelContainer}>
                  <Text style={styles.progressLabel}>Today's Progress</Text>
                  <Text style={styles.motivationalText}>
                    {getMotivationalMessage().emoji} {getMotivationalMessage().message}
                  </Text>
                </View>
                <Text style={styles.progressValue}>{getProgress()}%</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <LinearGradient colors={colors.successGradient} style={[styles.progressBar, { width: `${getProgress()}%` }]} />
              </View>
              <View style={styles.quickStats}>
                <View style={styles.quickStat}>
                  <MaterialCommunityIcons name="check-circle" size={16} color="#4ade80" />
                  <Text style={styles.quickStatText}>{getStats().completed} Done</Text>
                </View>
                <View style={styles.quickStat}>
                  <MaterialCommunityIcons name="clock-outline" size={16} color="#fbbf24" />
                  <Text style={styles.quickStatText}>{getStats().pending} Left</Text>
                </View>
                <View style={styles.quickStat}>
                  <MaterialCommunityIcons name="fire" size={16} color="#f87171" />
                  <Text style={styles.quickStatText}>{getStats().habitsOnFire} On Fire</Text>
                </View>
              </View>
          </View>
        )}

        {/* Habits List Section */}
        {habits.length > 0 ? (
          <View style={styles.habitsListContainer}>
            <View style={styles.habitsListHeader}>
              <Text style={styles.habitsListTitle}>Your Habits</Text>
              <Text style={styles.habitsListSubtitle}>{habits.length} habit{habits.length !== 1 ? 's' : ''}</Text>
            </View>
            {habits.map((item) => (
              <View key={item.id}>
                {renderHabit({ item })}
              </View>
            ))}
          </View>
        ) : (
          renderEmpty()
        )}

      {habits.length > 0 && (
        <View style={styles.statusSection}>
          <TouchableOpacity 
            onPress={toggleStatusSection} 
            style={styles.statusButton}
            activeOpacity={0.7}
          >
            <LinearGradient 
              colors={['#fff', '#f8f9fa']} 
              style={styles.statusButtonGradient}
            >
              <View style={styles.statusButtonContent}>
                <View style={styles.statusButtonLeft}>
                  <MaterialCommunityIcons name="chart-box" size={24} color={colors.primary} />
                  <View style={styles.statusButtonText}>
                    <Text style={styles.statusButtonTitle}>Habit Status</Text>
                    <Text style={styles.statusButtonSubtitle}>
                      {getStats().completed} of {getStats().totalHabits} completed
                    </Text>
                  </View>
                </View>
                <Animated.View style={[{ transform: [{ rotate: chevronRotation }] }]}>
                  <MaterialCommunityIcons 
                    name="chevron-down" 
                    size={24} 
                    color={colors.textLight} 
                  />
                </Animated.View>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {statusExpanded && (
            <Animated.View 
              style={[
                styles.statusDetails,
                { 
                  opacity: opacityAnim,
                  transform: [{ scaleY: contentScale }],
                }
              ]}
            >
              <View style={styles.statsGrid}>
                <Animated.View 
                  style={[
                    styles.statCard,
                    { 
                      opacity: statCard1Anim,
                      transform: [{ 
                        translateY: statCard1Anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        })
                      }]
                    }
                  ]}
                >
                  <LinearGradient colors={['#667eea15', '#764ba215']} style={styles.statCardGradient}>
                    <View style={styles.statCardBadge}>
                      <MaterialCommunityIcons name="checkbox-multiple-marked" size={28} color={colors.primary} />
                    </View>
                    <Text style={styles.statValue}>{getStats().completed}</Text>
                    <Text style={styles.statLabel}>Completed Today</Text>
                    <Text style={styles.statSubtext}>{getStats().completionRate}% rate</Text>
                  </LinearGradient>
                </Animated.View>

                <Animated.View 
                  style={[
                    styles.statCard,
                    { 
                      opacity: statCard2Anim,
                      transform: [{ 
                        translateY: statCard2Anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        })
                      }]
                    }
                  ]}
                >
                  <LinearGradient colors={['#f093fb15', '#f5576c15']} style={styles.statCardGradient}>
                    <View style={styles.statCardBadge}>
                      <MaterialCommunityIcons name="clock-alert-outline" size={28} color="#f5576c" />
                    </View>
                    <Text style={styles.statValue}>{getStats().pending}</Text>
                    <Text style={styles.statLabel}>Pending</Text>
                    <Text style={styles.statSubtext}>Focus needed</Text>
                  </LinearGradient>
                </Animated.View>

                <Animated.View 
                  style={[
                    styles.statCard,
                    { 
                      opacity: statCard3Anim,
                      transform: [{ 
                        translateY: statCard3Anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        })
                      }]
                    }
                  ]}
                >
                  <LinearGradient colors={['#4facfe15', '#00f2fe15']} style={styles.statCardGradient}>
                    <View style={styles.statCardBadge}>
                      <MaterialCommunityIcons name="fire" size={28} color="#ff6b6b" />
                    </View>
                    <Text style={styles.statValue}>{getStats().avgStreak}</Text>
                    <Text style={styles.statLabel}>Avg Streak</Text>
                    <Text style={styles.statSubtext}>{getStats().habitsOnFire} habits on fire</Text>
                  </LinearGradient>
                </Animated.View>

                <Animated.View 
                  style={[
                    styles.statCard,
                    { 
                      opacity: statCard4Anim,
                      transform: [{ 
                        translateY: statCard4Anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        })
                      }]
                    }
                  ]}
                >
                  <LinearGradient colors={['#43e97b15', '#38f9d715']} style={styles.statCardGradient}>
                    <View style={styles.statCardBadge}>
                      <MaterialCommunityIcons name="trophy" size={28} color="#ffa502" />
                    </View>
                    <Text style={styles.statValue}>{getStats().longestStreak}</Text>
                    <Text style={styles.statLabel}>Best Streak</Text>
                    <Text style={styles.statSubtext}>Personal record</Text>
                  </LinearGradient>
                </Animated.View>
              </View>

              <TouchableOpacity 
                style={styles.viewStatsButton}
                onPress={() => navigation.navigate('Stats')}
              >
                <LinearGradient colors={colors.primaryGradient} style={styles.viewStatsGradient}>
                  <MaterialCommunityIcons name="chart-line" size={18} color="#fff" />
                  <Text style={styles.viewStatsText}>View Detailed Stats</Text>
                  <MaterialCommunityIcons name="arrow-right" size={18} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      )}
      </ScrollView>

      {habits.length > 0 && (
        <View style={styles.fab}>
          <TouchableOpacity onPress={() => navigation.navigate('AddHabit')}>
            <LinearGradient colors={colors.primaryGradient} style={styles.fabButton}>
              <MaterialCommunityIcons name="plus" size={28} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.lightGray },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: spacing['2xl'] * 2 },
  headerGradient: { paddingBottom: spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.base },
  greeting: { fontSize: typography['2xl'], fontWeight: typography.bold, color: '#fff', marginBottom: 4 },
  subGreeting: { fontSize: typography.sm, color: '#ffffffcc' },
  avatar: { width: 48, height: 48, borderRadius: 24, ...shadows.base },
  avatarGradient: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  progressCard: { backgroundColor: '#fff', borderRadius: borderRadius.lg, padding: spacing.lg, marginHorizontal: spacing.lg, marginTop: spacing.base, ...shadows.base },
  progressInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md },
  progressLabelContainer: { flex: 1 },
  progressLabel: { fontSize: typography.base, color: colors.textDark, fontWeight: typography.bold, marginBottom: 4 },
  motivationalText: { fontSize: typography.xs, color: colors.textLight, fontStyle: 'italic' },
  progressValue: { fontSize: typography['2xl'], fontWeight: typography.bold, color: colors.primary },
  progressBarContainer: { height: 10, backgroundColor: colors.lightGray, borderRadius: borderRadius.full, overflow: 'hidden', marginBottom: spacing.md },
  progressBar: { height: '100%', borderRadius: borderRadius.full },
  quickStats: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.lightGray },
  quickStat: { flexDirection: 'row', alignItems: 'center' },
  quickStatText: { fontSize: typography.xs, color: colors.textDark, marginLeft: 4, fontWeight: typography.semibold },
  
  // Quote Card Styles
  quoteCard: { marginHorizontal: spacing.lg, marginTop: spacing.base, borderRadius: borderRadius.lg, overflow: 'hidden', ...shadows.base },
  quoteGradient: { padding: spacing.xl, position: 'relative' },
  quoteIconTop: { position: 'absolute', top: 8, left: 8, opacity: 0.3 },
  quoteIconBottom: { position: 'absolute', bottom: 8, right: 8, opacity: 0.3 },
  quoteText: { fontSize: typography.base, color: '#fff', fontStyle: 'italic', lineHeight: 24, textAlign: 'center', marginBottom: spacing.md, paddingHorizontal: spacing.md },
  quoteAuthor: { fontSize: typography.sm, color: '#ffffffcc', fontWeight: typography.semibold, textAlign: 'center' },
  
  // Status Section Styles
  statusSection: { marginHorizontal: spacing.lg, marginTop: spacing.base, marginBottom: spacing.md },
  statusButton: { marginBottom: spacing.sm },
  statusButtonGradient: { borderRadius: borderRadius.lg, ...shadows.base },
  statusButtonContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg },
  statusButtonLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  statusButtonText: { marginLeft: spacing.md },
  statusButtonTitle: { fontSize: typography.base, fontWeight: typography.bold, color: colors.textDark, marginBottom: 2 },
  statusButtonSubtitle: { fontSize: typography.sm, color: colors.textLight },
  
  statusDetails: { backgroundColor: '#fff', borderRadius: borderRadius.lg, padding: spacing.lg, ...shadows.base, marginTop: spacing.sm, overflow: 'hidden', transformOrigin: 'top' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -spacing.xs, marginBottom: spacing.md },
  statCard: { width: '50%', padding: spacing.xs },
  statCardGradient: { borderRadius: borderRadius.md, padding: spacing.lg, alignItems: 'center', borderWidth: 1, borderColor: '#00000008', minHeight: 140 },
  statCardBadge: { marginBottom: spacing.sm },
  statValue: { fontSize: typography['2xl'], fontWeight: typography.bold, color: colors.textDark, marginTop: spacing.xs },
  statLabel: { fontSize: typography.xs, color: colors.textLight, marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: typography.bold },
  statSubtext: { fontSize: typography.xs, color: colors.textLight, marginTop: 2, opacity: 0.7 },
  
  viewStatsButton: { marginTop: spacing.sm },
  viewStatsGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: spacing.md, borderRadius: borderRadius.md, ...shadows.sm },
  viewStatsText: { color: '#fff', fontSize: typography.sm, fontWeight: typography.semibold, marginHorizontal: spacing.sm },
  
  habitsListContainer: { paddingHorizontal: spacing.lg, paddingTop: spacing.base },
  habitsListHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  habitsListTitle: { fontSize: typography.lg, fontWeight: typography.bold, color: colors.textDark },
  habitsListSubtitle: { fontSize: typography.sm, color: colors.textLight },
  
  habitsList: { flex: 1 },
  listContent: { padding: spacing.lg, paddingTop: spacing.xs, paddingBottom: spacing['2xl'] * 2 },
  habitCard: { marginBottom: spacing.base },
  habitCardContainer: { position: 'relative' },
  habitGradient: { borderRadius: borderRadius.lg, padding: spacing.base, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', ...shadows.base, position: 'relative', overflow: 'hidden' },
  streakIndicator: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, borderTopLeftRadius: borderRadius.lg, borderBottomLeftRadius: borderRadius.lg },
  habitContent: { flex: 1 },
  habitInfo: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 32, height: 32, borderRadius: borderRadius.full, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  habitDetails: { flex: 1 },
  habitName: { fontSize: typography.base, fontWeight: typography.semibold, color: colors.textDark, marginBottom: 4 },
  habitNameCompleted: { textDecorationLine: 'line-through', color: colors.textLight },
  habitMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  streakText: { fontSize: typography.sm, color: colors.textLight, marginLeft: 4 },
  completedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#22c55e15', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, marginLeft: 8 },
  completedBadgeText: { fontSize: typography.xs, color: '#22c55e', fontWeight: typography.semibold, marginLeft: 2 },
  habitActions: { flexDirection: 'row', marginLeft: spacing.sm },
  actionButton: { padding: spacing.sm, marginLeft: 4 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing['2xl'] },
  emptyIcon: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.xl, ...shadows.lg },
  emptyTitle: { fontSize: typography['2xl'], fontWeight: typography.bold, color: colors.textDark, marginBottom: spacing.sm },
  emptyText: { fontSize: typography.base, color: colors.textLight, textAlign: 'center', marginBottom: spacing.xl, lineHeight: 24 },
  emptyButton: { flexDirection: 'row', paddingHorizontal: spacing.xl, paddingVertical: spacing.base, borderRadius: borderRadius.lg, alignItems: 'center', ...shadows.base },
  emptyButtonText: { color: '#fff', fontSize: typography.base, fontWeight: typography.semibold, marginLeft: spacing.sm },
  fab: { position: 'absolute', right: spacing.lg, bottom: spacing.xl },
  fabButton: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', ...shadows.lg },
});
