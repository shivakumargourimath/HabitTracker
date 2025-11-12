// screens/Calendar.js
import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useHabits } from '../context/HabitContext';
import * as Haptics from 'expo-haptics';

const screenWidth = Dimensions.get('window').width;

export default function Calendar() {
  const theme = useTheme();
  const { habits, getHabitHistory } = useHabits();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'year'
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get days in current month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Add previous month's trailing days
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = new Date(year, month, -i);
      days.push({ date: day, isCurrentMonth: false });
    }

    // Add current month's days
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push({ date, isCurrentMonth: true });
    }

    // Add next month's leading days to complete the week
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({ date, isCurrentMonth: false });
    }

    return days;
  };

  // Get year view months
  const getYearMonths = (date) => {
    const year = date.getFullYear();
    const months = [];
    
    for (let month = 0; month < 12; month++) {
      const monthDate = new Date(year, month, 1);
      months.push(monthDate);
    }
    
    return months;
  };

  // Calculate completion percentage for a date
  const getCompletionData = (date) => {
    if (habits.length === 0) return { percentage: 0, completed: 0, total: 0 };

    const dateString = date.toISOString().split('T')[0];
    let completed = 0;

    habits.forEach(habit => {
      const history = getHabitHistory(habit.id);
      if (history && history[dateString]) {
        completed++;
      }
    });

    return {
      percentage: (completed / habits.length) * 100,
      completed,
      total: habits.length
    };
  };

  // Get heat map color intensity
  const getHeatMapColor = (percentage) => {
    if (percentage === 0) return theme.colors.borderLight;
    if (percentage <= 25) return `${theme.colors.primary}40`;
    if (percentage <= 50) return `${theme.colors.primary}60`;
    if (percentage <= 75) return `${theme.colors.primary}80`;
    return theme.colors.primary;
  };

  // Navigate months
  const navigateMonth = (direction) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Navigate years
  const navigateYear = (direction) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newDate = new Date(currentDate);
    newDate.setFullYear(currentDate.getFullYear() + direction);
    setCurrentDate(newDate);
  };

  // Month view component
  const MonthView = () => {
    const days = getDaysInMonth(currentDate);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <View style={{ padding: theme.spacing[4] }}>
        {/* Month Header */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: theme.spacing[6],
        }}>
          <TouchableOpacity
            onPress={() => navigateMonth(-1)}
            style={{
              padding: theme.spacing[2],
              borderRadius: theme.borderRadius.full,
              backgroundColor: theme.colors.primaryLight,
            }}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>

          <Text style={{
            fontSize: theme.fontSizes['2xl'],
            fontWeight: theme.fontWeights.bold,
            color: theme.colors.text,
          }}>
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Text>

          <TouchableOpacity
            onPress={() => navigateMonth(1)}
            style={{
              padding: theme.spacing[2],
              borderRadius: theme.borderRadius.full,
              backgroundColor: theme.colors.primaryLight,
            }}
          >
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Week Days Header */}
        <View style={{
          flexDirection: 'row',
          marginBottom: theme.spacing[2],
        }}>
          {weekDays.map(day => (
            <View
              key={day}
              style={{
                flex: 1,
                alignItems: 'center',
                paddingVertical: theme.spacing[2],
              }}
            >
              <Text style={{
                fontSize: theme.fontSizes.sm,
                fontWeight: theme.fontWeights.semibold,
                color: theme.colors.textSecondary,
              }}>
                {day}
              </Text>
            </View>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {days.map((day, index) => {
            const completionData = getCompletionData(day.date);
            const isSelected = selectedDate.toDateString() === day.date.toDateString();
            const isToday = new Date().toDateString() === day.date.toDateString();

            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedDate(day.date);
                }}
                style={{
                  width: (screenWidth - theme.spacing[8]) / 7,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: 2,
                  borderRadius: theme.borderRadius.base,
                  backgroundColor: isSelected ? theme.colors.primary : getHeatMapColor(completionData.percentage),
                  borderWidth: isToday ? 2 : 0,
                  borderColor: theme.colors.warning,
                }}
              >
                <Text style={{
                  fontSize: theme.fontSizes.sm,
                  fontWeight: theme.fontWeights.medium,
                  color: isSelected ? '#ffffff' : 
                    day.isCurrentMonth ? theme.colors.text : theme.colors.textTertiary,
                  opacity: day.isCurrentMonth ? 1 : 0.5,
                }}>
                  {day.date.getDate()}
                </Text>
                {completionData.completed > 0 && (
                  <View style={{
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: isSelected ? '#ffffff' : theme.colors.success,
                    marginTop: 2,
                  }} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Selected Date Details */}
        {selectedDate && (
          <View style={{
            marginTop: theme.spacing[6],
            padding: theme.spacing[4],
            backgroundColor: theme.colors.card,
            borderRadius: theme.borderRadius.lg,
            ...theme.shadows.sm,
          }}>
            <Text style={{
              fontSize: theme.fontSizes.lg,
              fontWeight: theme.fontWeights.semibold,
              color: theme.colors.text,
              marginBottom: theme.spacing[2],
            }}>
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: getHeatMapColor(getCompletionData(selectedDate).percentage),
                marginRight: theme.spacing[2],
              }} />
              <Text style={{
                fontSize: theme.fontSizes.base,
                color: theme.colors.textSecondary,
              }}>
                {getCompletionData(selectedDate).completed} of {getCompletionData(selectedDate).total} habits completed
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  // Year view component
  const YearView = () => {
    const months = getYearMonths(currentDate);

    return (
      <View style={{ padding: theme.spacing[4] }}>
        {/* Year Header */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: theme.spacing[6],
        }}>
          <TouchableOpacity
            onPress={() => navigateYear(-1)}
            style={{
              padding: theme.spacing[2],
              borderRadius: theme.borderRadius.full,
              backgroundColor: theme.colors.primaryLight,
            }}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>

          <Text style={{
            fontSize: theme.fontSizes['2xl'],
            fontWeight: theme.fontWeights.bold,
            color: theme.colors.text,
          }}>
            {currentDate.getFullYear()}
          </Text>

          <TouchableOpacity
            onPress={() => navigateYear(1)}
            style={{
              padding: theme.spacing[2],
              borderRadius: theme.borderRadius.full,
              backgroundColor: theme.colors.primaryLight,
            }}
          >
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Months Grid */}
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}>
          {months.map((month, index) => {
            const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
            const monthCompletions = [];
            
            // Calculate completions for each day in month
            for (let day = 1; day <= daysInMonth; day++) {
              const date = new Date(month.getFullYear(), month.getMonth(), day);
              monthCompletions.push(getCompletionData(date).percentage);
            }
            
            const averageCompletion = monthCompletions.reduce((sum, p) => sum + p, 0) / monthCompletions.length;

            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setCurrentDate(month);
                  setViewMode('month');
                }}
                style={{
                  width: '48%',
                  aspectRatio: 1,
                  backgroundColor: theme.colors.card,
                  borderRadius: theme.borderRadius.lg,
                  padding: theme.spacing[3],
                  marginBottom: theme.spacing[3],
                  ...theme.shadows.sm,
                }}
              >
                <Text style={{
                  fontSize: theme.fontSizes.lg,
                  fontWeight: theme.fontWeights.semibold,
                  color: theme.colors.text,
                  marginBottom: theme.spacing[2],
                }}>
                  {month.toLocaleDateString('en-US', { month: 'short' })}
                </Text>
                
                <View style={{
                  flex: 1,
                  backgroundColor: getHeatMapColor(averageCompletion),
                  borderRadius: theme.borderRadius.base,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Text style={{
                    fontSize: theme.fontSizes.sm,
                    fontWeight: theme.fontWeights.medium,
                    color: averageCompletion > 50 ? '#ffffff' : theme.colors.text,
                  }}>
                    {Math.round(averageCompletion)}%
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

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
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Text style={{
              fontSize: theme.fontSizes['2xl'],
              fontWeight: theme.fontWeights.bold,
              color: theme.colors.text,
            }}>
              Calendar
            </Text>

            {/* View Toggle */}
            <View style={{
              flexDirection: 'row',
              backgroundColor: theme.colors.card,
              borderRadius: theme.borderRadius.lg,
              padding: theme.spacing[1],
            }}>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setViewMode('month');
                }}
                style={{
                  paddingHorizontal: theme.spacing[3],
                  paddingVertical: theme.spacing[2],
                  borderRadius: theme.borderRadius.base,
                  backgroundColor: viewMode === 'month' ? theme.colors.primary : 'transparent',
                }}
              >
                <Text style={{
                  fontSize: theme.fontSizes.sm,
                  fontWeight: theme.fontWeights.medium,
                  color: viewMode === 'month' ? '#ffffff' : theme.colors.text,
                }}>
                  Month
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setViewMode('year');
                }}
                style={{
                  paddingHorizontal: theme.spacing[3],
                  paddingVertical: theme.spacing[2],
                  borderRadius: theme.borderRadius.base,
                  backgroundColor: viewMode === 'year' ? theme.colors.primary : 'transparent',
                }}
              >
                <Text style={{
                  fontSize: theme.fontSizes.sm,
                  fontWeight: theme.fontWeights.medium,
                  color: viewMode === 'year' ? '#ffffff' : theme.colors.text,
                }}>
                  Year
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {viewMode === 'month' ? <MonthView /> : <YearView />}
        </ScrollView>

        {/* Heat Map Legend */}
        <View style={{
          paddingHorizontal: theme.spacing[4],
          paddingVertical: theme.spacing[3],
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
        }}>
          <Text style={{
            fontSize: theme.fontSizes.sm,
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing[2],
            textAlign: 'center',
          }}>
            Habit completion intensity
          </Text>
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Text style={{
              fontSize: theme.fontSizes.xs,
              color: theme.colors.textTertiary,
              marginRight: theme.spacing[2],
            }}>
              Less
            </Text>
            
            {[0, 25, 50, 75, 100].map((percentage, index) => (
              <View
                key={index}
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: getHeatMapColor(percentage),
                  marginHorizontal: 1,
                  borderRadius: 2,
                }}
              />
            ))}
            
            <Text style={{
              fontSize: theme.fontSizes.xs,
              color: theme.colors.textTertiary,
              marginLeft: theme.spacing[2],
            }}>
              More
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}