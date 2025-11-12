import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS, RADIUS, SPACING } from '../constants/colors';

export default function Card({
  children,
  variant = 'default', // default, elevated, outlined, gradient
  gradient,
  onPress,
  style,
  padding = 'medium', // small, medium, large
  ...props
}) {
  const getPaddingValue = () => {
    switch (padding) {
      case 'small':
        return SPACING.md;
      case 'large':
        return SPACING['2xl'];
      default:
        return SPACING.lg;
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          ...SHADOWS.large,
          backgroundColor: COLORS.white,
          borderRadius: RADIUS.xl,
        };
      case 'outlined':
        return {
          backgroundColor: COLORS.white,
          borderRadius: RADIUS.xl,
          borderWidth: 1,
          borderColor: COLORS.border.medium,
        };
      case 'gradient':
        return {
          borderRadius: RADIUS.xl,
          overflow: 'hidden',
        };
      default:
        return {
          ...SHADOWS.medium,
          backgroundColor: COLORS.white,
          borderRadius: RADIUS.xl,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const paddingValue = getPaddingValue();

  const content = (
    <View style={[styles.card, variantStyles, { padding: paddingValue }, style]}>
      {children}
    </View>
  );

  if (gradient && variant === 'gradient') {
    return (
      <TouchableOpacity
        disabled={!onPress}
        onPress={onPress}
        activeOpacity={onPress ? 0.8 : 1}
        style={[variantStyles, style]}
        {...props}
      >
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ padding: paddingValue }}
        >
          {children}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={[styles.card, variantStyles, { padding: paddingValue }, style]}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    // Base styles are applied via variants
  },
});
