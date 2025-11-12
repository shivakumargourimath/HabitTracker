// components/UI/Button.js
import React, { useRef } from 'react';
import { TouchableOpacity, Text, Animated, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export const Button = ({ 
  children, 
  onPress, 
  variant = 'primary', 
  size = 'medium', 
  loading = false, 
  disabled = false,
  style,
  ...props 
}) => {
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Simplified without complex animations for now

  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    const sizeStyles = {
      small: {
        paddingHorizontal: theme.spacing[3],
        paddingVertical: theme.spacing[2],
        minHeight: 36,
      },
      medium: {
        paddingHorizontal: theme.spacing[4],
        paddingVertical: theme.spacing[3],
        minHeight: 44,
      },
      large: {
        paddingHorizontal: theme.spacing[6],
        paddingVertical: theme.spacing[4],
        minHeight: 52,
      },
    };

    const variantStyles = {
      primary: {
        backgroundColor: disabled ? theme.colors.textTertiary : theme.colors.primary,
        ...theme.shadows.base,
      },
      secondary: {
        backgroundColor: disabled ? theme.colors.borderLight : theme.colors.surface,
        borderWidth: 1,
        borderColor: disabled ? theme.colors.border : theme.colors.primary,
        ...theme.shadows.sm,
      },
      ghost: {
        backgroundColor: 'transparent',
      },
      success: {
        backgroundColor: disabled ? theme.colors.textTertiary : theme.colors.success,
        ...theme.shadows.base,
      },
      warning: {
        backgroundColor: disabled ? theme.colors.textTertiary : theme.colors.warning,
        ...theme.shadows.base,
      },
      error: {
        backgroundColor: disabled ? theme.colors.textTertiary : theme.colors.error,
        ...theme.shadows.base,
      },
    };

    return [baseStyle, sizeStyles[size], variantStyles[variant]];
  };

  const getTextStyle = () => {
    const baseTextStyle = {
      fontWeight: theme.fontWeights.semibold,
    };

    const sizeTextStyles = {
      small: { fontSize: theme.fontSizes.sm },
      medium: { fontSize: theme.fontSizes.base },
      large: { fontSize: theme.fontSizes.lg },
    };

    const variantTextStyles = {
      primary: { color: '#ffffff' },
      secondary: { 
        color: disabled ? theme.colors.textTertiary : theme.colors.primary 
      },
      ghost: { 
        color: disabled ? theme.colors.textTertiary : theme.colors.text 
      },
      success: { color: '#ffffff' },
      warning: { color: '#ffffff' },
      error: { color: '#ffffff' },
    };

    return [baseTextStyle, sizeTextStyles[size], variantTextStyles[variant]];
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
        {loading && (
          <ActivityIndicator 
            size="small" 
            color={variant === 'secondary' || variant === 'ghost' ? theme.colors.primary : '#ffffff'}
            style={{ marginRight: theme.spacing[2] }}
          />
        )}
      <Text style={getTextStyle()}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};