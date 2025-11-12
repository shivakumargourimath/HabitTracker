import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import aiService from '../services/aiService';

const AIWeeklySummaryCard = ({ weeklyData }) => {
  const [loading, setLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState(null);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.95))[0];

  // Check if there's meaningful data to show insights
  const hasMeaningfulData = () => {
    if (!weeklyData || !weeklyData.habits || weeklyData.habits.length === 0) {
      return false;
    }
    
    // Show insights if any habit has at least one completion in the last 7 days
    const hasAnyCompletions = weeklyData.habits.some(h => h.completionCount > 0);
    return hasAnyCompletions;
  };

  // Create data signature for change detection - Memoized to prevent recalculation
  const dataSignature = useMemo(() => JSON.stringify({
    weekId: weeklyData?.weekId,
    avg: weeklyData?.overallStats?.avgCompletionRate,
    count: weeklyData?.habits?.length,
    rates: weeklyData?.habits?.map(h => h.completionRate).sort().join('-')
  }), [weeklyData]);

  // Fetch AI insight when data signature changes
  useEffect(() => {
    // Only fetch if there's meaningful data
    if (!hasMeaningfulData()) {
      setLoading(false);
      return;
    }
    
    const fetchAIInsight = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await aiService.generateWeeklyAnalysis(weeklyData);

        if (result.success) {
          setAiInsight({
            analysis: result.analysis,
            stats: result.stats,
          });
        } else {
          setAiInsight({
            analysis: result.fallback,
            stats: result.stats || weeklyData?.overallStats,
          });
          setError('Using offline insights');
        }
      } catch (err) {
        setError('Could not load AI insights');
        setAiInsight({
          analysis: aiService.getFallbackWeeklyAnalysis(weeklyData?.overallStats),
          stats: weeklyData?.overallStats,
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAIInsight();
  }, [dataSignature]); // Re-run when data signature changes

  useEffect(() => {
    if (aiInsight && !loading) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [aiInsight, loading]);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  const handleManualRefresh = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await aiService.generateWeeklyAnalysis(weeklyData);

      if (result.success) {
        setAiInsight({
          analysis: result.analysis,
          stats: result.stats,
        });
      } else {
        setAiInsight({
          analysis: result.fallback,
          stats: result.stats || weeklyData?.overallStats,
        });
        setError('Using offline insights');
      }
    } catch (err) {
      setError('Could not load AI insights');
      setAiInsight({
        analysis: aiService.getFallbackWeeklyAnalysis(weeklyData?.overallStats),
        stats: weeklyData?.overallStats,
      });
    } finally {
      setLoading(false);
    }
  };

  // Don't show card if there's no meaningful data
  if (!hasMeaningfulData()) {
    return null;
  }

  // Show loading state inline if we already have data
  const showFullLoading = loading && !aiInsight;
  
  if (showFullLoading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.loadingText}>AI is analyzing your week...</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  if (!aiInsight && !loading) {
    return null;
  }

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="creation" size={24} color="#fff" />
            </View>
            <View>
              <Text style={styles.title}>AI Weekly Insight</Text>
              <Text style={styles.subtitle}>Last 7 Days Analysis</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            {loading && (
              <View style={styles.updatingBadge}>
                <ActivityIndicator size="small" color="#4ade80" />
              </View>
            )}
            {!loading && error && (
              <View style={styles.offlineBadge}>
                <MaterialCommunityIcons name="wifi-off" size={12} color="#fbbf24" />
              </View>
            )}
          </View>
        </View>

        {/* AI Analysis */}
        {expanded && (
          <View style={styles.content}>
            <View style={styles.analysisContainer}>
              <MaterialCommunityIcons 
                name="message-text-outline" 
                size={20} 
                color="#ffffff90" 
                style={styles.messageIcon}
              />
              <Text style={styles.analysisText}>{aiInsight.analysis}</Text>
            </View>

            {/* Quick Stats - Always show real-time data from weeklyData */}
            {weeklyData.overallStats && (
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <MaterialCommunityIcons name="chart-line" size={16} color="#4ade80" />
                  <Text style={styles.statLabel}>Avg. Rate</Text>
                  <Text style={styles.statValue}>{weeklyData.overallStats.avgCompletionRate}%</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <MaterialCommunityIcons name="calendar-check" size={16} color="#60a5fa" />
                  <Text style={styles.statLabel}>Best Day</Text>
                  <Text style={styles.statValue}>{weeklyData.overallStats.bestDay}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <MaterialCommunityIcons name="fire" size={16} color="#f87171" />
                  <Text style={styles.statLabel}>Total Habits</Text>
                  <Text style={styles.statValue}>{weeklyData.overallStats.totalHabits}</Text>
                </View>
              </View>
            )}

            {/* Refresh Button */}
            <TouchableOpacity 
              style={styles.refreshButton} 
              onPress={handleManualRefresh}
              activeOpacity={0.7}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#ffffffcc" />
              ) : (
                <MaterialCommunityIcons name="refresh" size={14} color="#ffffffcc" />
              )}
              <Text style={styles.refreshText}>
                {loading ? 'Updating...' : 'Refresh Insight'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 12,
    borderRadius: 20,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  gradient: {
    borderRadius: 20,
    padding: 20,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  loadingText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 12,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#ffffff20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#ffffffcc',
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  updatingBadge: {
    backgroundColor: '#ffffff20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  offlineBadge: {
    backgroundColor: '#ffffff30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  content: {
    gap: 16,
  },
  analysisContainer: {
    backgroundColor: '#ffffff15',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#4ade80',
  },
  messageIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  analysisText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#fff',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff10',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#ffffff20',
  },
  statLabel: {
    fontSize: 11,
    color: '#ffffffaa',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff15',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignSelf: 'center',
    gap: 6,
  },
  refreshText: {
    color: '#ffffffcc',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default AIWeeklySummaryCard;
