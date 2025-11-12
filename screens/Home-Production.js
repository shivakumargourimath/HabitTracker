import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useHabits } from '../context/HabitContext';
import { useAuth } from '../context/AuthContext';

export default function HomeProduction({ navigation }) {
  const { habits, toggleCompletion, deleteHabit } = useHabits();
  const { user } = useAuth();

  const getProgress = () => {
    if (habits.length === 0) return 0;
    const completed = habits.filter(h => h.completedToday).length;
    return Math.round((completed / habits.length) * 100);
  };

  const handleDeleteHabit = (habitId, habitName) => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habitName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteHabit(habitId),
        },
      ]
    );
  };

  const renderHabit = ({ item }) => (
    <View style={[styles.habitCard, { borderLeftColor: item.color }]}>
      <TouchableOpacity
        style={styles.habitContent}
        onPress={() => toggleCompletion(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.habitInfo}>
          <View style={[
            styles.checkbox,
            item.completedToday && { backgroundColor: item.color }
          ]}>
            {item.completedToday && (
              <MaterialCommunityIcons name="check" size={20} color="#fff" />
            )}
          </View>
          
          <View style={styles.habitDetails}>
            <Text style={[
              styles.habitName,
              item.completedToday && styles.habitNameCompleted
            ]}>
              {item.name}
            </Text>
            <View style={styles.habitMeta}>
              <MaterialCommunityIcons name="fire" size={16} color="#f59e0b" />
              <Text style={styles.streakText}>{item.streak} day streak</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.habitActions}>
        <TouchableOpacity
          onPress={() => navigation.navigate('UpdateHabit', { habit: item })}
          style={styles.actionButton}
        >
          <MaterialCommunityIcons name="pencil" size={20} color="#64748b" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteHabit(item.id, item.name)}
          style={styles.actionButton}
        >
          <MaterialCommunityIcons name="delete" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="target" size={64} color="#cbd5e1" />
      <Text style={styles.emptyTitle}>No Habits Yet</Text>
      <Text style={styles.emptyText}>
        Start building better habits by adding your first one!
      </Text>
      <TouchableOpacity
        style={styles.addFirstButton}
        onPress={() => navigation.navigate('AddHabit')}
      >
        <MaterialCommunityIcons name="plus" size={20} color="#fff" />
        <Text style={styles.addFirstButtonText}>Add Your First Habit</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Progress */}
      {habits.length > 0 && (
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {user?.name || user?.email?.split('@')[0] || 'User'}! 👋</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressText}>Today's Progress</Text>
              <Text style={styles.progressValue}>{getProgress()}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${getProgress()}%` }]} />
            </View>
          </View>
        </View>
      )}

      {/* Habits List */}
      <FlatList
        data={habits}
        renderItem={renderHabit}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
      />

      {/* Quick Actions */}
      {habits.length > 0 && (
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('Stats')}
          >
            <MaterialCommunityIcons name="chart-line" size={24} color="#0ea5e9" />
            <Text style={styles.quickActionText}>Stats</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionButton, styles.addButton]}
            onPress={() => navigation.navigate('AddHabit')}
          >
            <MaterialCommunityIcons name="plus-circle" size={32} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <MaterialCommunityIcons name="cog" size={24} color="#0ea5e9" />
            <Text style={styles.quickActionText}>Settings</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#64748b',
  },
  progressValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0ea5e9',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0ea5e9',
    borderRadius: 4,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  habitCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  habitContent: {
    flex: 1,
  },
  habitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  habitDetails: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  habitNameCompleted: {
    textDecorationLine: 'line-through',
    color: '#94a3b8',
  },
  habitMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 4,
  },
  habitActions: {
    flexDirection: 'row',
    marginLeft: 12,
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  addFirstButton: {
    flexDirection: 'row',
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addFirstButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  quickActionButton: {
    alignItems: 'center',
    padding: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#0ea5e9',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
});