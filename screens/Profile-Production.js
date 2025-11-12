import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useHabits } from '../context/HabitContext';

export default function ProfileProduction() {
  const { user } = useAuth();
  const { habits } = useHabits();

  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account" size={60} color="#fff" />
          </View>
          <Text style={styles.name}>{user?.email?.split('@')[0] || 'User'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{habits.length}</Text>
            <Text style={styles.statLabel}>Habits</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{totalStreak}</Text>
            <Text style={styles.statLabel}>Total Streak</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{habits.filter(h => h.completedToday).length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 24 },
  header: { alignItems: 'center', marginBottom: 32 },
  avatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#0ea5e9', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  name: { fontSize: 24, fontWeight: '700', color: '#1e293b', marginBottom: 4 },
  email: { fontSize: 16, color: '#64748b' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around' },
  statBox: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 20, flex: 1, marginHorizontal: 4, elevation: 2 },
  statValue: { fontSize: 32, fontWeight: '700', color: '#0ea5e9', marginBottom: 4 },
  statLabel: { fontSize: 14, color: '#64748b' },
});
