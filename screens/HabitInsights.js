import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS, SPACING } from '../constants/colors';
import HeatMap from '../components/HeatMap';
import AIMotivationCard from '../components/AIMotivationCard';
import AITipsCard from '../components/AITipsCard';

const { width } = Dimensions.get('window');

export default function HabitInsights({ route, navigation }) {
  const { habit } = route.params;
  
  const insights = useMemo(() => {
    const history = habit.completionHistory || [];
    const now = new Date();
    
    // Calculate streaks
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate = null;
    
    // Sort history by date
    const sortedHistory = [...history].sort((a, b) => new Date(b) - new Date(a));
    
    sortedHistory.forEach((dateStr) => {
      const date = new Date(dateStr);
      if (!lastDate) {
        tempStreak = 1;
        lastDate = date;
      } else {
        const diffDays = Math.floor((lastDate - date) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else {
          if (tempStreak > longestStreak) longestStreak = tempStreak;
          tempStreak = 1;
        }
        lastDate = date;
      }
    });
    
    if (tempStreak > longestStreak) longestStreak = tempStreak;
    currentStreak = habit.streak || 0;
    
    // Calculate completion rate (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const last30DaysCompletions = history.filter(d => new Date(d) >= thirtyDaysAgo).length;
    const completionRate30Days = Math.round((last30DaysCompletions / 30) * 100);
    
    // Calculate completion rate (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const last7DaysCompletions = history.filter(d => new Date(d) >= sevenDaysAgo).length;
    const completionRate7Days = Math.round((last7DaysCompletions / 7) * 100);
    
    // Average time analysis
    const completionTimes = history.map(dateStr => {
      const date = new Date(dateStr);
      return date.getHours();
    });
    
    let avgCompletionHour = 0;
    if (completionTimes.length > 0) {
      avgCompletionHour = Math.round(
        completionTimes.reduce((sum, hour) => sum + hour, 0) / completionTimes.length
      );
    }
    
    const formatTime = (hour) => {
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${displayHour}:00 ${period}`;
    };
    
    // Best day of week
    const dayCompletions = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    history.forEach(dateStr => {
      const day = new Date(dateStr).getDay();
      dayCompletions[day]++;
    });
    
    const bestDay = Object.keys(dayCompletions).reduce((a, b) => 
      dayCompletions[a] > dayCompletions[b] ? a : b
    );
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Consistency score (completion rate over time)
    const consistencyScore = completionRate30Days;
    
    // Predict next completion (based on average frequency)
    let predictedNextCompletion = 'Tomorrow';
    if (history.length >= 2) {
      const avgDaysBetween = history.length > 1 ? 30 / last30DaysCompletions : 1;
      if (avgDaysBetween <= 1.2) predictedNextCompletion = 'Tomorrow';
      else if (avgDaysBetween <= 2) predictedNextCompletion = 'In 2 days';
      else predictedNextCompletion = `In ${Math.round(avgDaysBetween)} days`;
    }
    
    return {
      totalCompletions: history.length,
      currentStreak,
      longestStreak,
      completionRate30Days,
      completionRate7Days,
      avgCompletionTime: formatTime(avgCompletionHour),
      bestDay: dayNames[bestDay],
      consistencyScore,
      predictedNextCompletion,
      last30DaysCompletions,
      last7DaysCompletions,
    };
  }, [habit]);
  
  const getConsistencyColor = (score) => {
    if (score >= 80) return COLORS.success[500];
    if (score >= 60) return COLORS.info[500];
    if (score >= 40) return COLORS.warning[500];
    return COLORS.error[500];
  };
  
  const getConsistencyLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Work';
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <LinearGradient
        colors={[habit.color || COLORS.primary[600], habit.color + 'dd' || COLORS.primary[700]]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{habit.name}</Text>
            <Text style={styles.headerSubtitle}>Detailed Insights</Text>
          </View>
          <View style={styles.backButton} />
        </View>
      </LinearGradient>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* AI Motivation Card */}
        <View style={styles.section}>
          <AIMotivationCard 
            habit={{
              name: habit.name,
              streak: insights.currentStreak,
              completionRate: insights.completionRate30Days,
            }}
            userStats={{
              totalHabits: 1, // You can pass actual total from context
              averageStreak: insights.averageStreak,
              consistencyScore: insights.consistencyScore,
            }}
          />
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCardSmall}>
              <MaterialCommunityIcons name="check-all" size={24} color={COLORS.primary[600]} />
              <Text style={styles.statValueSmall}>{insights.totalCompletions}</Text>
              <Text style={styles.statLabelSmall}>Total</Text>
            </View>
            
            <View style={styles.statCardSmall}>
              <MaterialCommunityIcons name="fire" size={24} color={COLORS.error[500]} />
              <Text style={styles.statValueSmall}>{insights.currentStreak}</Text>
              <Text style={styles.statLabelSmall}>Current</Text>
            </View>
            
            <View style={styles.statCardSmall}>
              <MaterialCommunityIcons name="trophy" size={24} color={COLORS.warning[500]} />
              <Text style={styles.statValueSmall}>{insights.longestStreak}</Text>
              <Text style={styles.statLabelSmall}>Best</Text>
            </View>
            
            <View style={styles.statCardSmall}>
              <MaterialCommunityIcons name="clock-outline" size={24} color={COLORS.info[500]} />
              <Text style={styles.statValueSmall}>{insights.avgCompletionTime}</Text>
              <Text style={styles.statLabelSmall}>Avg Time</Text>
            </View>
          </View>
        </View>
        
        {/* Consistency Score */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Consistency Score</Text>
          <View style={styles.consistencyCard}>
            <View style={styles.consistencyHeader}>
              <Text style={styles.consistencyScore}>{insights.consistencyScore}%</Text>
              <View style={[styles.consistencyBadge, { backgroundColor: getConsistencyColor(insights.consistencyScore) + '20' }]}>
                <Text style={[styles.consistencyBadgeText, { color: getConsistencyColor(insights.consistencyScore) }]}>
                  {getConsistencyLabel(insights.consistencyScore)}
                </Text>
              </View>
            </View>
            
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${insights.consistencyScore}%`, backgroundColor: getConsistencyColor(insights.consistencyScore) }]} />
            </View>
            
            <Text style={styles.consistencyText}>
              Based on your 30-day completion rate
            </Text>
          </View>
        </View>
        
        {/* Activity Heatmap */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Heatmap</Text>
          <View style={styles.heatmapCard}>
            <HeatMap 
              completionHistory={habit.completionHistory || []}
              onDayPress={(date) => console.log('Day pressed:', date)}
            />
          </View>
        </View>
        
        {/* Performance Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance</Text>
          
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <MaterialCommunityIcons name="calendar-month" size={20} color={COLORS.primary[600]} />
              <Text style={styles.metricTitle}>Last 30 Days</Text>
            </View>
            <View style={styles.metricContent}>
              <Text style={styles.metricValue}>{insights.last30DaysCompletions} / 30</Text>
              <Text style={styles.metricPercentage}>{insights.completionRate30Days}%</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${insights.completionRate30Days}%`, backgroundColor: COLORS.primary[600] }]} />
            </View>
          </View>
          
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <MaterialCommunityIcons name="calendar-week" size={20} color={COLORS.info[600]} />
              <Text style={styles.metricTitle}>Last 7 Days</Text>
            </View>
            <View style={styles.metricContent}>
              <Text style={styles.metricValue}>{insights.last7DaysCompletions} / 7</Text>
              <Text style={styles.metricPercentage}>{insights.completionRate7Days}%</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${insights.completionRate7Days}%`, backgroundColor: COLORS.info[600] }]} />
            </View>
          </View>
        </View>
        
        {/* AI Tips */}
        <View style={styles.section}>
          <AITipsCard 
            habit={{
              name: habit.name,
              description: habit.description || '',
              category: habit.category || 'General',
            }}
            insights={{
              bestDay: insights.bestDay,
              avgCompletionTime: insights.avgCompletionTime,
              consistencyScore: insights.consistencyScore,
              trend: insights.completionRate7Days >= insights.completionRate30Days ? 'improving' : 'declining',
            }}
          />
        </View>

        {/* Insights & Predictions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Insights</Text>
          
          <View style={styles.insightCard}>
            <MaterialCommunityIcons name="calendar-star" size={24} color={COLORS.success[600]} />
            <View style={styles.insightContent}>
              <Text style={styles.insightLabel}>Best Day</Text>
              <Text style={styles.insightValue}>{insights.bestDay}</Text>
              <Text style={styles.insightDescription}>You're most consistent on this day</Text>
            </View>
          </View>
          
          <View style={styles.insightCard}>
            <MaterialCommunityIcons name="lightbulb-on" size={24} color={COLORS.warning[600]} />
            <View style={styles.insightContent}>
              <Text style={styles.insightLabel}>Prediction</Text>
              <Text style={styles.insightValue}>{insights.predictedNextCompletion}</Text>
              <Text style={styles.insightDescription}>Expected next completion</Text>
            </View>
          </View>
          
          <View style={styles.insightCard}>
            <MaterialCommunityIcons name="chart-timeline-variant" size={24} color={COLORS.info[600]} />
            <View style={styles.insightContent}>
              <Text style={styles.insightLabel}>Trend</Text>
              <Text style={styles.insightValue}>
                {insights.completionRate7Days >= insights.completionRate30Days ? '📈 Improving' : '📉 Declining'}
              </Text>
              <Text style={styles.insightDescription}>
                {insights.completionRate7Days >= insights.completionRate30Days 
                  ? "You're doing better this week!" 
                  : "Let's get back on track"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.secondary,
  },
  header: {
    paddingBottom: SPACING['2xl'],
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.white + 'cc',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING['4xl'],
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING['2xl'],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  statCardSmall: {
    width: (width - SPACING.lg * 2 - SPACING.md) / 2,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  statValueSmall: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginTop: SPACING.sm,
  },
  statLabelSmall: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  consistencyCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING['2xl'],
    ...SHADOWS.medium,
  },
  consistencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  consistencyScore: {
    fontSize: 40,
    fontWeight: '800',
    color: COLORS.text.primary,
  },
  consistencyBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
  },
  consistencyBadgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: COLORS.slate[200],
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  progressBar: {
    height: '100%',
    borderRadius: RADIUS.full,
  },
  consistencyText: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  heatmapCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.medium,
  },
  metricCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  metricTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginLeft: SPACING.sm,
  },
  metricContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: SPACING.md,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  metricPercentage: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  insightContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  insightLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  insightValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  insightDescription: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
});
