import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS, SPACING } from '../constants/colors';
import aiService from '../services/aiService';

export default function AIMotivationCard({ habit, userStats, onRefresh }) {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    generateMessage();
  }, [habit.id]);

  const generateMessage = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await aiService.generateMotivationalMessage(habit, userStats);
      
      if (result.success) {
        setMessage(result.message);
      } else {
        // Use fallback message
        setMessage(result.fallback);
        if (result.error) {
          console.log('AI API error, using fallback:', result.error);
        }
      }
    } catch (err) {
      console.error('Motivation generation error:', err);
      setMessage(aiService.getFallbackMotivation(habit.streak, habit.completionRate || 0));
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    generateMessage();
    if (onRefresh) onRefresh();
  };

  if (!message && !loading) return null;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={COLORS.gradients.purple}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="creation" size={20} color={COLORS.white} />
          </View>
          <Text style={styles.headerText}>AI Coach</Text>
          <TouchableOpacity 
            onPress={handleRefresh} 
            style={styles.refreshButton}
            disabled={loading}
          >
            <MaterialCommunityIcons 
              name="refresh" 
              size={18} 
              color={COLORS.white} 
            />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={COLORS.white} size="small" />
            <Text style={styles.loadingText}>Generating motivation...</Text>
          </View>
        ) : (
          <Text style={styles.message}>{message}</Text>
        )}

        <View style={styles.footer}>
          <MaterialCommunityIcons name="robot-excited" size={16} color={COLORS.white + 'cc'} />
          <Text style={styles.footerText}>Powered by AI</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  gradient: {
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  headerText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  refreshButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.white + 'dd',
    marginLeft: SPACING.sm,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.white,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
    gap: SPACING.xs,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.white + 'cc',
  },
});
