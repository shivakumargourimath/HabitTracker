import React, { useState, useEffect } from 'react';
import { View, ScrollView, Dimensions, Text, TouchableOpacity } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { useHabits } from '../context/HabitContext';
import { useTheme } from '../context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const screenWidth = Dimensions.get('window').width;

export default function Stats() {
  const { habits } = useHabits();
  const theme = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState('week'); // 'week' or 'month'
  const [insights, setInsights] = useState({});

  // Calculate insights
  useEffect(() => {
    if (habits.length > 0) {
      const totalHabits = habits.length;
      const completedToday = habits.filter(h => h.completedToday).length;
      const averageStreak = Math.round(habits.reduce((sum, h) => sum + h.streak, 0) / totalHabits);
      const bestStreak = Math.max(...habits.map(h => h.streak));
      const completionRate = Math.round((completedToday / totalHabits) * 100);
      
      setInsights({
        totalHabits,
        completedToday,
        averageStreak,
        bestStreak,
        completionRate,
      });
    }
  }, [habits]);

  const getChartData = () => {
    if (habits.length === 0) return null;

    const labels = selectedPeriod === 'week' ? 
      ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
      Array.from({ length: 30 }, (_, i) => String(i + 1));

    const data = labels.map((_, index) => {
      return habits.reduce((sum, habit) => {
        // Simplified: just show current completion for demo
        if (selectedPeriod === 'week' && index === 6) {
          return sum + (habit.completedToday ? 1 : 0);
        }
        return sum + Math.floor(Math.random() * 2); // Random data for demo
      }, 0);
    });

    return {
      labels: selectedPeriod === 'week' ? labels : labels.filter((_, i) => i % 5 === 0),
      datasets: [{ data: data.length > 0 ? data : [0] }]
    };
  };

  const StatCard = ({ icon, title, value, subtitle, color }) => (
    <View style={{
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[4],
      margin: theme.spacing[2],
      flex: 1,
      minWidth: '45%',
      ...theme.shadows.base,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing[2] }}>
        <View style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: color || theme.colors.primaryLight,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: theme.spacing[3],
        }}>
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color={color === theme.colors.primaryLight ? theme.colors.primary : '#ffffff'}
          />
        </View>
        <Text style={{
          fontSize: theme.fontSizes.sm,
          color: theme.colors.textSecondary,
          fontWeight: theme.fontWeights.medium,
          flex: 1,
        }}>
          {title}
        </Text>
      </View>
      <Text style={{
        fontSize: theme.fontSizes['3xl'],
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing[1],
      }}>
        {value}
      </Text>
      {subtitle && (
        <Text style={{
          fontSize: theme.fontSizes.xs,
          color: theme.colors.textTertiary,
        }}>
          {subtitle}
        </Text>
      )}
    </View>
  );

  const EmptyState = () => (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing[6],
    }}>
      <MaterialCommunityIcons
        name="chart-line"
        size={80}
        color={theme.colors.textTertiary}
      />
      <Text style={{
        fontSize: theme.fontSizes['2xl'],
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.text,
        marginTop: theme.spacing[4],
        textAlign: 'center',
      }}>
        No Data Yet
      </Text>
      <Text style={{
        fontSize: theme.fontSizes.base,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing[2],
        textAlign: 'center',
        lineHeight: 24,
      }}>
        Start completing habits to see your progress statistics
      </Text>
    </View>
  );

  const chartData = getChartData();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={{
          paddingHorizontal: theme.spacing[4],
          paddingVertical: theme.spacing[4],
        }}>
          <Text style={{
            fontSize: theme.fontSizes['3xl'],
            fontWeight: theme.fontWeights.bold,
            color: theme.colors.text,
            marginBottom: theme.spacing[2],
          }}>
            Statistics
          </Text>
          <Text style={{
            fontSize: theme.fontSizes.base,
            color: theme.colors.textSecondary,
          }}>
            Track your habit building progress
          </Text>
        </View>

        {habits.length === 0 ? (
          <EmptyState />
        ) : (
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: theme.spacing[8] }}
          >
            {/* Overview Cards */}
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              paddingHorizontal: theme.spacing[2],
              marginBottom: theme.spacing[6],
            }}>
              <StatCard
                icon="target"
                title="Total Habits"
                value={insights.totalHabits}
                color={theme.colors.primary}
              />
              <StatCard
                icon="check-circle"
                title="Completed Today"
                value={insights.completedToday}
                subtitle={`${insights.completionRate}% completion rate`}
                color={theme.colors.success}
              />
              <StatCard
                icon="fire"
                title="Average Streak"
                value={insights.averageStreak}
                subtitle="days"
                color={theme.colors.warning}
              />
              <StatCard
                icon="trophy"
                title="Best Streak"
                value={insights.bestStreak}
                subtitle="days"
                color={theme.colors.error}
              />
            </View>

            {/* Period Selector */}
            <View style={{
              flexDirection: 'row',
              marginHorizontal: theme.spacing[4],
              marginBottom: theme.spacing[4],
              backgroundColor: theme.colors.card,
              borderRadius: theme.borderRadius.lg,
              padding: theme.spacing[1],
            }}>
              {['week', 'month'].map((period) => (
                <TouchableOpacity
                  key={period}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedPeriod(period);
                  }}
                  style={{
                    flex: 1,
                    paddingVertical: theme.spacing[2],
                    paddingHorizontal: theme.spacing[4],
                    borderRadius: theme.borderRadius.md,
                    backgroundColor: selectedPeriod === period ? theme.colors.primary : 'transparent',
                  }}
                >
                  <Text style={{
                    fontSize: theme.fontSizes.base,
                    fontWeight: theme.fontWeights.medium,
                    color: selectedPeriod === period ? '#ffffff' : theme.colors.text,
                    textAlign: 'center',
                    textTransform: 'capitalize',
                  }}>
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Chart */}
            {chartData && (
              <View style={{
                marginHorizontal: theme.spacing[4],
                backgroundColor: theme.colors.card,
                borderRadius: theme.borderRadius.lg,
                padding: theme.spacing[4],
                ...theme.shadows.base,
              }}>
                <Text style={{
                  fontSize: theme.fontSizes.lg,
                  fontWeight: theme.fontWeights.semibold,
                  color: theme.colors.text,
                  marginBottom: theme.spacing[4],
                }}>
                  Completion Trend
                </Text>
                
                <LineChart
                  data={chartData}
                  width={screenWidth - theme.spacing[8] - theme.spacing[8]}
                  height={220}
                  chartConfig={{
                    backgroundColor: 'transparent',
                    backgroundGradientFrom: theme.colors.card,
                    backgroundGradientTo: theme.colors.card,
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(14, 165, 233, ${opacity})`,
                    labelColor: (opacity = 1) => theme.colors.textSecondary,
                    style: {
                      borderRadius: theme.borderRadius.lg,
                    },
                    propsForDots: {
                      r: '6',
                      strokeWidth: '2',
                      stroke: theme.colors.primary,
                    },
                  }}
                  bezier
                  style={{
                    marginVertical: 8,
                    borderRadius: theme.borderRadius.lg,
                  }}
                />
              </View>
            )}

            {/* Habit Streaks */}
            <View style={{
              marginHorizontal: theme.spacing[4],
              marginTop: theme.spacing[6],
            }}>
              <Text style={{
                fontSize: theme.fontSizes.lg,
                fontWeight: theme.fontWeights.semibold,
                color: theme.colors.text,
                marginBottom: theme.spacing[4],
              }}>
                Current Streaks
              </Text>
              
              {habits.map((habit, index) => (
                <View
                  key={habit.id}
                  style={{
                    backgroundColor: theme.colors.card,
                    borderRadius: theme.borderRadius.lg,
                    padding: theme.spacing[4],
                    marginBottom: theme.spacing[3],
                    borderLeftWidth: 4,
                    borderLeftColor: habit.color,
                    ...theme.shadows.sm,
                  }}
                >
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <Text style={{
                      fontSize: theme.fontSizes.base,
                      fontWeight: theme.fontWeights.medium,
                      color: theme.colors.text,
                      flex: 1,
                    }}>
                      {habit.name}
                    </Text>
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                      <MaterialCommunityIcons
                        name="fire"
                        size={16}
                        color={habit.streak > 0 ? theme.colors.warning : theme.colors.textTertiary}
                      />
                      <Text style={{
                        fontSize: theme.fontSizes.lg,
                        fontWeight: theme.fontWeights.bold,
                        color: theme.colors.text,
                        marginLeft: theme.spacing[1],
                      }}>
                        {habit.streak}
                      </Text>
                      <Text style={{
                        fontSize: theme.fontSizes.sm,
                        color: theme.colors.textSecondary,
                        marginLeft: theme.spacing[1],
                      }}>
                        days
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}
