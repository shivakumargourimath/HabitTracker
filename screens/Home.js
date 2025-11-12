// screens/Home.js
import React, { useState } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HabitCard from '../components/HabitCard';
import { useHabits } from '../context/HabitContext';
import { useTheme } from '../context/ThemeContext';

export default function Home() {
  const navigation = useNavigation();
  const { habits, toggleCompletion, deleteHabit, refreshHabits } = useHabits();
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  
  // Simplified without animations for now

  // Delete habit confirmation
  const handleDelete = (id, name) => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => deleteHabit(id)
        },
      ]
    );
  };

  // Handle pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await refreshHabits?.();
    setRefreshing(false);
  };

  // Calculate today's progress
  const completedToday = habits.filter(habit => habit.completedToday).length;
  const totalHabits = habits.length;
  const progressPercentage = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;

  const handleAddPress = () => {
    navigation.navigate('AddHabit');
  };

  const EmptyState = () => (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      paddingHorizontal: theme.spacing[6]
    }}>
      <MaterialCommunityIcons
        name="target"
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
        Start Building Habits
      </Text>
      <Text style={{
        fontSize: theme.fontSizes.base,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing[2],
        textAlign: 'center',
        lineHeight: 24,
      }}>
        Create your first habit and begin your journey towards a better you
      </Text>
    </View>
  );

  return (
    <View style={{ 
      flex: 1,
      backgroundColor: theme.colors.background
    }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header with Progress */}
        <View
          style={{
            paddingHorizontal: theme.spacing[4],
            paddingVertical: theme.spacing[4],
          }}
        >
          <Text style={{
            fontSize: theme.fontSizes['3xl'],
            fontWeight: theme.fontWeights.bold,
            color: theme.colors.text,
            marginBottom: theme.spacing[2],
          }}>
            Today's Progress
          </Text>
          
          {totalHabits > 0 && (
            <View>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: theme.spacing[2],
              }}>
                <Text style={{
                  fontSize: theme.fontSizes.base,
                  color: theme.colors.textSecondary,
                  fontWeight: theme.fontWeights.medium,
                }}>
                  {completedToday} of {totalHabits} completed
                </Text>
                <Text style={{
                  fontSize: theme.fontSizes.lg,
                  color: theme.colors.primary,
                  fontWeight: theme.fontWeights.bold,
                }}>
                  {Math.round(progressPercentage)}%
                </Text>
              </View>
              
              {/* Progress Bar */}
              <View style={{
                height: 8,
                backgroundColor: theme.colors.borderLight,
                borderRadius: theme.borderRadius.full,
                overflow: 'hidden',
              }}>
                <View style={{
                  height: '100%',
                  width: `${progressPercentage}%`,
                  backgroundColor: theme.colors.primary,
                  borderRadius: theme.borderRadius.full,
                }} />
              </View>
            </View>
          )}
        </View>

        {/* Habits List */}
        {totalHabits === 0 ? (
          <EmptyState />
        ) : (
          <FlatList
            data={habits}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <HabitCard
                habit={item}
                index={index}
                onToggle={() => toggleCompletion(item.id)}
                onDelete={handleDelete}
              />
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={theme.colors.primary}
                colors={[theme.colors.primary]}
              />
            }
            contentContainerStyle={{
              paddingBottom: theme.spacing[20],
              flexGrow: 1,
            }}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Navigation Bar */}
        <View style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: theme.colors.card,
          paddingHorizontal: theme.spacing[4],
          paddingTop: theme.spacing[4],
          paddingBottom: theme.spacing[6],
          ...theme.shadows.lg,
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
            {/* Calendar Button */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Calendar')}
              style={{
                padding: theme.spacing[3],
                borderRadius: theme.borderRadius.full,
                backgroundColor: theme.colors.primaryLight,
              }}
            >
              <MaterialCommunityIcons
                name="calendar-month"
                size={24}
                color={theme.colors.primary}
              />
            </TouchableOpacity>

            {/* Stats Button */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Stats')}
              style={{
                padding: theme.spacing[3],
                borderRadius: theme.borderRadius.full,
                backgroundColor: theme.colors.primaryLight,
              }}
            >
              <MaterialCommunityIcons
                name="chart-line"
                size={24}
                color={theme.colors.primary}
              />
            </TouchableOpacity>

            {/* Add Habit FAB */}
            <TouchableOpacity
              onPress={handleAddPress}
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: theme.colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
                ...theme.shadows.lg,
              }}
            >
              <MaterialCommunityIcons
                name="plus"
                size={32}
                color="#ffffff"
              />
            </TouchableOpacity>

            {/* Achievements Button */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Achievements')}
              style={{
                padding: theme.spacing[3],
                borderRadius: theme.borderRadius.full,
                backgroundColor: theme.colors.primaryLight,
              }}
            >
              <MaterialCommunityIcons
                name="trophy"
                size={24}
                color={theme.colors.primary}
              />
            </TouchableOpacity>

            {/* Settings Button */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Settings')}
              style={{
                padding: theme.spacing[3],
                borderRadius: theme.borderRadius.full,
                backgroundColor: theme.colors.primaryLight,
              }}
            >
              <MaterialCommunityIcons
                name="cog"
                size={24}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
