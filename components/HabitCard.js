import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function HabitCard({ habit, onToggle, onDelete, index }) {
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const completionScale = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();

  // Simple press handling without complex animations
  const [isPressed, setIsPressed] = useState(false);

  // Animate completion status
  useEffect(() => {
    Animated.spring(completionScale, {
      toValue: habit.completedToday ? 1.2 : 1,
      friction: 6,
      tension: 300,
      useNativeDriver: true,
    }).start();
  }, [habit.completedToday]);

  // Entrance animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        tension: 100,
        friction: 8,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);


  const getCardStyle = () => ({
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    marginHorizontal: theme.spacing[4],
    marginVertical: theme.spacing[2],
    padding: theme.spacing[4],
    ...theme.shadows.md,
    borderLeftWidth: 4,
    borderLeftColor: habit.color,
    opacity: habit.completedToday ? 0.8 : 1,
  });

  return (
    <View style={{ marginBottom: theme.spacing[2] }}>
      <TouchableOpacity
        style={getCardStyle()}
        onPress={onToggle}
        activeOpacity={0.8}
      >
        {/* Completion Status Indicator */}
        {habit.completedToday && (
          <View
            style={{
              position: 'absolute',
              top: theme.spacing[3],
              right: theme.spacing[3],
              backgroundColor: habit.color,
              borderRadius: theme.borderRadius.full,
              width: 12,
              height: 12,
            }}
          />
        )}

        {/* Main Content */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: theme.fontSizes.lg,
                fontWeight: theme.fontWeights.semibold,
                color: theme.colors.text,
                marginBottom: theme.spacing[1],
                textDecorationLine: habit.completedToday ? 'line-through' : 'none',
                opacity: habit.completedToday ? 0.7 : 1,
              }}
            >
              {habit.name}
            </Text>
            
            {/* Streak Info */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons
                name="fire"
                size={16}
                color={habit.streak > 0 ? theme.colors.warning : theme.colors.textTertiary}
              />
              <Text
                style={{
                  fontSize: theme.fontSizes.sm,
                  color: theme.colors.textSecondary,
                  marginLeft: theme.spacing[1],
                  fontWeight: theme.fontWeights.medium,
                }}
              >
                {habit.streak} day{habit.streak === 1 ? '' : 's'} streak
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3] }}>
            {/* Edit Button */}
            <TouchableOpacity
              onPress={() => navigation.navigate('UpdateHabit', { habit })}
              style={{
                padding: theme.spacing[2],
                borderRadius: theme.borderRadius.base,
                backgroundColor: theme.colors.primaryLight,
              }}
            >
              <MaterialCommunityIcons
                name="pencil"
                size={16}
                color={theme.colors.primary}
              />
            </TouchableOpacity>

            {/* Delete Button */}
            <TouchableOpacity
              onPress={() => onDelete(habit.id, habit.name)}
              style={{
                padding: theme.spacing[2],
                borderRadius: theme.borderRadius.base,
                backgroundColor: `${theme.colors.error}15`,
              }}
            >
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={16}
                color={theme.colors.error}
              />
            </TouchableOpacity>

            {/* Completion Button */}
            <TouchableOpacity
              onPress={onToggle}
              style={{
                padding: theme.spacing[2],
                borderRadius: theme.borderRadius.full,
                backgroundColor: habit.completedToday ? habit.color : 'transparent',
                borderWidth: 2,
                borderColor: habit.color,
              }}
            >
              <MaterialCommunityIcons
                name={habit.completedToday ? 'check' : 'plus'}
                size={20}
                color={habit.completedToday ? '#ffffff' : habit.color}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
