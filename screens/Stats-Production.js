import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useHabits } from '../context/HabitContext';

export default function StatsProduction() {
  const { habits } = useHabits();

  const totalHabits = habits.length;
  const completedToday = habits.filter(h => h.completedToday).length;
  const totalStreak = habits.reduce((sum, h) => sum + (h.streak || 0), 0);
  const averageStreak = totalHabits > 0 ? Math.round(totalStreak / totalHabits) : 0;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  const stats = [
    { icon: 'target', label: 'Total Habits', value: totalHabits, color: '#0ea5e9' },
    { icon: 'check-circle', label: 'Completed Today', value: completedToday, color: '#22c55e' },
    { icon: 'fire', label: 'Average Streak', value: `${averageStreak} days`, color: '#f59e0b' },
    { icon: 'chart-line', label: 'Completion Rate', value: `${completionRate}%`, color: '#8b5cf6' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.grid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.iconContainer, { backgroundColor: stat.color + '20' }]}>
                <MaterialCommunityIcons name={stat.icon} size={32} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {habits.length > 0 && (
          <View style={styles.listSection}>
            <Text style={styles.sectionTitle}>Habit Details</Text>
            {habits.map((habit) => (
              <View key={habit.id} style={[styles.habitItem, { borderLeftColor: habit.color }]}>
                <Text style={styles.habitName}>{habit.name}</Text>
                <View style={styles.habitStats}>
                  <View style={styles.habitStat}>
                    <MaterialCommunityIcons name="fire" size={16} color="#f59e0b" />
                    <Text style={styles.habitStatText}>{habit.streak || 0} day{(habit.streak || 0) !== 1 ? 's' : ''}</Text>
                  </View>
                  <View style={styles.habitStat}>
                    <MaterialCommunityIcons 
                      name={habit.completedToday ? "check-circle" : "circle-outline"} 
                      size={16} 
                      color={habit.completedToday ? "#22c55e" : "#94a3b8"} 
                    />
                    <Text style={styles.habitStatText}>
                      {habit.completedToday ? "Done" : "Pending"}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 24 },
  statCard: { width: '48%', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, marginRight: '2%', alignItems: 'center', elevation: 2 },
  iconContainer: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statValue: { fontSize: 24, fontWeight: '700', color: '#1e293b', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#64748b', textAlign: 'center' },
  listSection: { marginTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginBottom: 12 },
  habitItem: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 12, borderLeftWidth: 4, elevation: 1 },
  habitName: { fontSize: 16, fontWeight: '600', color: '#1e293b', marginBottom: 8 },
  habitStats: { flexDirection: 'row', justifyContent: 'space-between' },
  habitStat: { flexDirection: 'row', alignItems: 'center' },
  habitStatText: { fontSize: 14, color: '#64748b', marginLeft: 4 },
});
