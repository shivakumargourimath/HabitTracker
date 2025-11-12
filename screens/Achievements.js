// screens/Achievements.js
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import AchievementService, { achievements } from '../services/AchievementService';
import * as Haptics from 'expo-haptics';

export default function Achievements() {
  const theme = useTheme();
  const [userLevel, setUserLevel] = useState({ level: 1, title: 'Beginner', nextLevelPoints: 100 });
  const [userStats, setUserStats] = useState({});
  const [userAchievements, setUserAchievements] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'All', icon: 'view-grid' },
    { id: 'milestone', name: 'Milestones', icon: 'flag' },
    { id: 'streak', name: 'Streaks', icon: 'fire' },
    { id: 'consistency', name: 'Consistency', icon: 'calendar-check' },
    { id: 'quantity', name: 'Quantity', icon: 'numeric' },
    { id: 'variety', name: 'Variety', icon: 'palette' },
  ];

  useEffect(() => {
    loadAchievementData();
  }, []);

  const loadAchievementData = async () => {
    await AchievementService.initialize();
    setUserLevel(AchievementService.getUserLevel());
    setUserStats(AchievementService.userStats);
    setUserAchievements(AchievementService.userAchievements);
  };

  const getFilteredAchievements = () => {
    if (selectedCategory === 'all') {
      return achievements;
    }
    return achievements.filter(achievement => achievement.type === selectedCategory);
  };

  const isAchievementUnlocked = (achievementId) => {
    return userAchievements.some(ua => ua.id === achievementId);
  };

  const getAchievementProgress = (achievementId) => {
    return AchievementService.getAchievementProgress(achievementId);
  };

  const LevelCard = () => (
    <View style={{
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing[6],
      margin: theme.spacing[4],
      alignItems: 'center',
      ...theme.shadows.lg,
    }}>
      {/* Level Badge */}
      <View style={{
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing[4],
        ...theme.shadows.md,
      }}>
        <Text style={{
          fontSize: theme.fontSizes['2xl'],
          fontWeight: theme.fontWeights.bold,
          color: '#ffffff',
        }}>
          {userLevel.level}
        </Text>
      </View>

      {/* Level Title */}
      <Text style={{
        fontSize: theme.fontSizes['2xl'],
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing[2],
      }}>
        {userLevel.title}
      </Text>

      {/* Points */}
      <Text style={{
        fontSize: theme.fontSizes.base,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing[4],
      }}>
        {userStats.totalPoints} points earned
      </Text>

      {/* Progress to Next Level */}
      {userLevel.nextLevelPoints && (
        <View style={{ width: '100%' }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: theme.spacing[2],
          }}>
            <Text style={{
              fontSize: theme.fontSizes.sm,
              color: theme.colors.textSecondary,
            }}>
              Next Level
            </Text>
            <Text style={{
              fontSize: theme.fontSizes.sm,
              color: theme.colors.textSecondary,
            }}>
              {userLevel.nextLevelPoints - userStats.totalPoints} points to go
            </Text>
          </View>
          
          <View style={{
            height: 8,
            backgroundColor: theme.colors.borderLight,
            borderRadius: theme.borderRadius.full,
            overflow: 'hidden',
          }}>
            <View style={{
              height: '100%',
              width: `${Math.min((userStats.totalPoints / userLevel.nextLevelPoints) * 100, 100)}%`,
              backgroundColor: theme.colors.primary,
              borderRadius: theme.borderRadius.full,
            }} />
          </View>
        </View>
      )}
    </View>
  );

  const CategoryFilter = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: theme.spacing[4],
        paddingVertical: theme.spacing[2],
      }}
    >
      {categories.map(category => (
        <TouchableOpacity
          key={category.id}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setSelectedCategory(category.id);
          }}
          style={{
            paddingHorizontal: theme.spacing[4],
            paddingVertical: theme.spacing[2],
            borderRadius: theme.borderRadius.full,
            backgroundColor: selectedCategory === category.id ? theme.colors.primary : theme.colors.card,
            marginRight: theme.spacing[2],
            flexDirection: 'row',
            alignItems: 'center',
            ...theme.shadows.sm,
          }}
        >
          <MaterialCommunityIcons
            name={category.icon}
            size={16}
            color={selectedCategory === category.id ? '#ffffff' : theme.colors.textSecondary}
          />
          <Text style={{
            fontSize: theme.fontSizes.sm,
            fontWeight: theme.fontWeights.medium,
            color: selectedCategory === category.id ? '#ffffff' : theme.colors.text,
            marginLeft: theme.spacing[1],
          }}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const AchievementItem = ({ achievement }) => {
    const isUnlocked = isAchievementUnlocked(achievement.id);
    const progress = getAchievementProgress(achievement.id);
    
    return (
      <TouchableOpacity
        onPress={() => {
          if (isUnlocked) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          } else {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        }}
        style={{
          backgroundColor: theme.colors.card,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing[4],
          marginHorizontal: theme.spacing[4],
          marginVertical: theme.spacing[2],
          flexDirection: 'row',
          alignItems: 'center',
          opacity: isUnlocked ? 1 : 0.7,
          borderWidth: isUnlocked ? 2 : 0,
          borderColor: isUnlocked ? achievement.color : 'transparent',
          ...theme.shadows.base,
        }}
      >
        {/* Achievement Icon */}
        <View style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: isUnlocked ? achievement.color : theme.colors.borderLight,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: theme.spacing[4],
        }}>
          <MaterialCommunityIcons
            name={achievement.icon}
            size={24}
            color={isUnlocked ? '#ffffff' : theme.colors.textTertiary}
          />
          {isUnlocked && (
            <View style={{
              position: 'absolute',
              top: -4,
              right: -4,
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: theme.colors.success,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <MaterialCommunityIcons
                name="check"
                size={12}
                color="#ffffff"
              />
            </View>
          )}
        </View>

        {/* Achievement Info */}
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontWeights.semibold,
            color: theme.colors.text,
            marginBottom: theme.spacing[1],
          }}>
            {achievement.title}
          </Text>
          
          <Text style={{
            fontSize: theme.fontSizes.sm,
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing[2],
          }}>
            {achievement.description}
          </Text>

          {/* Progress Bar (for unfinished achievements) */}
          {!isUnlocked && progress && (
            <View>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: theme.spacing[1],
              }}>
                <Text style={{
                  fontSize: theme.fontSizes.xs,
                  color: theme.colors.textSecondary,
                }}>
                  Progress
                </Text>
                <Text style={{
                  fontSize: theme.fontSizes.xs,
                  color: theme.colors.textSecondary,
                }}>
                  {progress.current} / {progress.target}
                </Text>
              </View>
              
              <View style={{
                height: 4,
                backgroundColor: theme.colors.borderLight,
                borderRadius: 2,
                overflow: 'hidden',
              }}>
                <View style={{
                  height: '100%',
                  width: `${progress.percentage}%`,
                  backgroundColor: achievement.color,
                  borderRadius: 2,
                }} />
              </View>
            </View>
          )}
        </View>

        {/* Points Badge */}
        <View style={{
          backgroundColor: theme.colors.primaryLight,
          borderRadius: theme.borderRadius.full,
          paddingHorizontal: theme.spacing[2],
          paddingVertical: theme.spacing[1],
        }}>
          <Text style={{
            fontSize: theme.fontSizes.xs,
            fontWeight: theme.fontWeights.semibold,
            color: theme.colors.primary,
          }}>
            {achievement.points}pts
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const filteredAchievements = getFilteredAchievements();
  const unlockedCount = filteredAchievements.filter(a => isAchievementUnlocked(a.id)).length;

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
          <Text style={{
            fontSize: theme.fontSizes['2xl'],
            fontWeight: theme.fontWeights.bold,
            color: theme.colors.text,
            textAlign: 'center',
          }}>
            Achievements
          </Text>
          
          <Text style={{
            fontSize: theme.fontSizes.base,
            color: theme.colors.textSecondary,
            textAlign: 'center',
            marginTop: theme.spacing[1],
          }}>
            {unlockedCount} of {filteredAchievements.length} unlocked
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Level Card */}
          <LevelCard />

          {/* Quick Stats */}
          <View style={{
            flexDirection: 'row',
            paddingHorizontal: theme.spacing[4],
            marginBottom: theme.spacing[4],
          }}>
            <View style={{
              flex: 1,
              backgroundColor: theme.colors.card,
              borderRadius: theme.borderRadius.lg,
              padding: theme.spacing[3],
              alignItems: 'center',
              marginRight: theme.spacing[2],
              ...theme.shadows.sm,
            }}>
              <MaterialCommunityIcons
                name="trophy"
                size={24}
                color={theme.colors.warning}
              />
              <Text style={{
                fontSize: theme.fontSizes.lg,
                fontWeight: theme.fontWeights.bold,
                color: theme.colors.text,
                marginTop: theme.spacing[1],
              }}>
                {userAchievements.length}
              </Text>
              <Text style={{
                fontSize: theme.fontSizes.xs,
                color: theme.colors.textSecondary,
              }}>
                Earned
              </Text>
            </View>

            <View style={{
              flex: 1,
              backgroundColor: theme.colors.card,
              borderRadius: theme.borderRadius.lg,
              padding: theme.spacing[3],
              alignItems: 'center',
              ...theme.shadows.sm,
            }}>
              <MaterialCommunityIcons
                name="fire"
                size={24}
                color={theme.colors.error}
              />
              <Text style={{
                fontSize: theme.fontSizes.lg,
                fontWeight: theme.fontWeights.bold,
                color: theme.colors.text,
                marginTop: theme.spacing[1],
              }}>
                {userStats.maxStreak || 0}
              </Text>
              <Text style={{
                fontSize: theme.fontSizes.xs,
                color: theme.colors.textSecondary,
              }}>
                Best Streak
              </Text>
            </View>
          </View>

          {/* Category Filter */}
          <CategoryFilter />

          {/* Achievement List */}
          <View style={{ paddingVertical: theme.spacing[4] }}>
            {filteredAchievements.map(achievement => (
              <AchievementItem
                key={achievement.id}
                achievement={achievement}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}