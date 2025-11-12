import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS } from '../constants/colors';

export default function Button({
  title,
  onPress,
  variant = 'primary', // primary, secondary, outline, ghost, danger, success
  size = 'medium', // small, medium, large
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  gradient = false,
  style,
  textStyle,
  ...props
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          container: {
            backgroundColor: COLORS.primary[600],
          },
          text: {
            color: COLORS.white,
          },
          gradient: COLORS.gradients.primary,
        };
      case 'secondary':
        return {
          container: {
            backgroundColor: COLORS.secondary[600],
          },
          text: {
            color: COLORS.white,
          },
          gradient: COLORS.gradients.secondary,
        };
      case 'success':
        return {
          container: {
            backgroundColor: COLORS.success[600],
          },
          text: {
            color: COLORS.white,
          },
          gradient: COLORS.gradients.success,
        };
      case 'danger':
        return {
          container: {
            backgroundColor: COLORS.error[600],
          },
          text: {
            color: COLORS.white,
          },
          gradient: COLORS.gradients.fire,
        };
      case 'outline':
        return {
          container: {
            backgroundColor: COLORS.transparent,
            borderWidth: 2,
            borderColor: COLORS.primary[600],
          },
          text: {
            color: COLORS.primary[600],
          },
        };
      case 'ghost':
        return {
          container: {
            backgroundColor: COLORS.transparent,
          },
          text: {
            color: COLORS.primary[600],
          },
        };
      default:
        return {
          container: {
            backgroundColor: COLORS.primary[600],
          },
          text: {
            color: COLORS.white,
          },
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: {
            paddingVertical: 8,
            paddingHorizontal: 16,
          },
          text: {
            fontSize: 14,
          },
          icon: 18,
        };
      case 'large':
        return {
          container: {
            paddingVertical: 16,
            paddingHorizontal: 32,
          },
          text: {
            fontSize: 18,
          },
          icon: 24,
        };
      default: // medium
        return {
          container: {
            paddingVertical: 12,
            paddingHorizontal: 24,
          },
          text: {
            fontSize: 16,
          },
          icon: 20,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const isDisabled = disabled || loading;

  const buttonContent = (
    <View style={styles.content}>
      {loading ? (
        <ActivityIndicator color={variantStyles.text.color} size="small" />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <MaterialCommunityIcons
              name={icon}
              size={sizeStyles.icon}
              color={variantStyles.text.color}
              style={styles.iconLeft}
            />
          )}
          <Text
            style={[
              styles.text,
              variantStyles.text,
              sizeStyles.text,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <MaterialCommunityIcons
              name={icon}
              size={sizeStyles.icon}
              color={variantStyles.text.color}
              style={styles.iconRight}
            />
          )}
        </>
      )}
    </View>
  );

  if (gradient && variantStyles.gradient && !isDisabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        style={[
          fullWidth && styles.fullWidth,
          isDisabled && styles.disabled,
          style,
        ]}
        activeOpacity={0.8}
        {...props}
      >
        <LinearGradient
          colors={variantStyles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.button,
            sizeStyles.container,
            SHADOWS.medium,
          ]}
        >
          {buttonContent}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.button,
        variantStyles.container,
        sizeStyles.container,
        variant !== 'ghost' && SHADOWS.medium,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.8}
      {...props}
    >
      {buttonContent}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
});
