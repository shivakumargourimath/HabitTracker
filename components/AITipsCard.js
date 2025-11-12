import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS, SPACING } from '../constants/colors';
import aiService from '../services/aiService';

export default function AITipsCard({ habit, insights, onRefresh }) {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    generateTips();
  }, [habit.id]);

  const generateTips = async () => {
    setLoading(true);

    try {
      const result = await aiService.generateHabitTips(habit, insights);
      
      if (result.success && result.tips.length > 0) {
        setTips(result.tips);
      } else {
        setTips(result.fallback || aiService.getFallbackTips(habit));
      }
    } catch (err) {
      console.error('Tips generation error:', err);
      setTips(aiService.getFallbackTips(habit));
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    generateTips();
    if (onRefresh) onRefresh();
  };

  if (!tips.length && !loading) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="lightbulb-on" size={20} color={COLORS.warning[600]} />
        </View>
        <Text style={styles.headerText}>AI Tips</Text>
        <TouchableOpacity onPress={handleRefresh} disabled={loading}>
          <MaterialCommunityIcons 
            name="refresh" 
            size={20} 
            color={COLORS.text.secondary} 
          />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={COLORS.primary[600]} size="small" />
          <Text style={styles.loadingText}>Generating tips...</Text>
        </View>
      ) : (
        <View style={styles.tipsContainer}>
          {tips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <View style={styles.tipNumber}>
                <Text style={styles.tipNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.footer}>
        <MaterialCommunityIcons 
          name="robot-excited" 
          size={14} 
          color={COLORS.text.tertiary} 
        />
        <Text style={styles.footerText}>AI-powered recommendations</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.medium,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.warning[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  headerText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginLeft: SPACING.sm,
  },
  tipsContainer: {
    gap: SPACING.md,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
    marginTop: 2,
  },
  tipNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary[700],
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.text.primary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
    gap: SPACING.xs,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.text.tertiary,
  },
});
