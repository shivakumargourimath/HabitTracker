import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../constants/colors';

export default function HeatMap({ completionHistory = [], onDayPress }) {
  // Generate last 10 weeks (70 days) of data
  const heatmapData = useMemo(() => {
    const weeks = [];
    const today = new Date();
    const daysToShow = 70; // 10 weeks
    
    // Create array of dates
    const dates = [];
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date);
    }
    
    // Group by weeks (starting Monday)
    let currentWeek = [];
    dates.forEach((date, index) => {
      const dayOfWeek = date.getDay(); // 0 = Sunday
      const mondayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to Monday = 0
      
      // Check if this date has completion
      const dateStr = date.toISOString().split('T')[0];
      const isCompleted = completionHistory.some(h => {
        const hDate = new Date(h).toISOString().split('T')[0];
        return hDate === dateStr;
      });
      
      currentWeek[mondayIndex] = {
        date,
        completed: isCompleted,
        dateStr,
      };
      
      // Start new week on Sunday (end of week)
      if (dayOfWeek === 0 || index === dates.length - 1) {
        // Fill missing days at start of first week
        for (let i = 0; i < 7; i++) {
          if (!currentWeek[i]) {
            currentWeek[i] = { date: null, completed: false, dateStr: null };
          }
        }
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });
    
    return weeks;
  }, [completionHistory]);
  
  const getIntensityColor = (completed) => {
    if (!completed) return COLORS.slate[800];
    return COLORS.success[500];
  };
  
  const getDayLabel = (index) => {
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    return days[index];
  };
  
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Day labels */}
        <View style={styles.labelsContainer}>
          {[0, 1, 2, 3, 4, 5, 6].map((index) => (
            <Text key={index} style={styles.dayLabel}>
              {getDayLabel(index)}
            </Text>
          ))}
        </View>
        
        {/* Heatmap grid */}
        <View style={styles.grid}>
          {heatmapData.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.week}>
              {week.map((day, dayIndex) => (
                <TouchableOpacity
                  key={`${weekIndex}-${dayIndex}`}
                  style={[
                    styles.day,
                    { 
                      backgroundColor: day.date 
                        ? getIntensityColor(day.completed) 
                        : 'transparent',
                    },
                    !day.date && styles.emptyDay,
                  ]}
                  onPress={() => day.date && onDayPress && onDayPress(day.date)}
                  disabled={!day.date}
                  activeOpacity={0.7}
                >
                  {day.completed && (
                    <View style={styles.completedIndicator} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
      
      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendText}>Less</Text>
        <View style={[styles.legendBox, { backgroundColor: COLORS.slate[800] }]} />
        <View style={[styles.legendBox, { backgroundColor: COLORS.success[500] }]} />
        <Text style={styles.legendText}>More</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.md,
  },
  scrollContent: {
    paddingRight: SPACING.lg,
  },
  labelsContainer: {
    marginRight: SPACING.sm,
    justifyContent: 'space-around',
  },
  dayLabel: {
    fontSize: 10,
    color: COLORS.slate[400],
    fontWeight: '500',
    height: 12,
    marginVertical: 1,
  },
  grid: {
    flexDirection: 'row',
    gap: 3,
  },
  week: {
    gap: 3,
  },
  day: {
    width: 12,
    height: 12,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyDay: {
    backgroundColor: 'transparent',
  },
  completedIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.white,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: SPACING.md,
    gap: SPACING.xs,
  },
  legendText: {
    fontSize: 10,
    color: COLORS.slate[400],
    fontWeight: '500',
  },
  legendBox: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
});
