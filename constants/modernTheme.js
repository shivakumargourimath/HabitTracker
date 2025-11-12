// Modern Design System - Premium UI/UX
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Modern Color Palette with Gradients
export const colors = {
  // Primary Gradients
  primaryGradient: ['#667eea', '#764ba2'],
  secondaryGradient: ['#f093fb', '#f5576c'],
  successGradient: ['#4facfe', '#00f2fe'],
  warningGradient: ['#fa709a', '#fee140'],
  
  // Solid Colors
  primary: '#667eea',
  secondary: '#764ba2',
  accent: '#f093fb',
  success: '#00f2fe',
  warning: '#fee140',
  danger: '#f5576c',
  
  // Neutrals
  dark: '#1a1a2e',
  darkLight: '#16213e',
  light: '#ffffff',
  lightGray: '#f8f9fa',
  mediumGray: '#e9ecef',
  textDark: '#212529',
  textLight: '#6c757d',
  
  // Glass Effect
  glassBackground: 'rgba(255, 255, 255, 0.1)',
  glassBorder: 'rgba(255, 255, 255, 0.2)',
  
  // Shadows
  shadowColor: '#000',
  cardShadow: 'rgba(0, 0, 0, 0.1)',
};

// Habit Color Palette - Modern & Vibrant
export const habitColors = [
  { name: 'Purple Dream', value: '#667eea', gradient: ['#667eea', '#764ba2'] },
  { name: 'Pink Sunset', value: '#f093fb', gradient: ['#f093fb', '#f5576c'] },
  { name: 'Ocean Blue', value: '#4facfe', gradient: ['#4facfe', '#00f2fe'] },
  { name: 'Sunny Yellow', value: '#fee140', gradient: ['#fa709a', '#fee140'] },
  { name: 'Mint Green', value: '#00f2fe', gradient: ['#a8edea', '#fed6e3'] },
  { name: 'Orange Blast', value: '#ff6b6b', gradient: ['#ff6b6b', '#feca57'] },
  { name: 'Deep Space', value: '#4e54c8', gradient: ['#4e54c8', '#8f94fb'] },
  { name: 'Rose Gold', value: '#f093fb', gradient: ['#f093fb', '#f5576c'] },
];

// Typography
export const typography = {
  // Font Sizes - Responsive
  xs: width * 0.03,
  sm: width * 0.035,
  base: width * 0.04,
  lg: width * 0.045,
  xl: width * 0.05,
  '2xl': width * 0.06,
  '3xl': width * 0.07,
  '4xl': width * 0.09,
  
  // Font Weights
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  
  // Line Heights
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
};

// Spacing System
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
};

// Border Radius
export const borderRadius = {
  sm: 8,
  base: 12,
  md: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  full: 9999,
};

// Shadows - Modern & Soft
export const shadows = {
  sm: {
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  base: {
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  md: {
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  lg: {
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  xl: {
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 15,
  },
};

// Card Styles - Modern Glass Effect
export const cardStyles = {
  glass: {
    backgroundColor: colors.glassBackground,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backdropFilter: 'blur(10px)',
  },
  elevated: {
    backgroundColor: colors.light,
    ...shadows.base,
  },
  premium: {
    backgroundColor: colors.light,
    ...shadows.lg,
    borderRadius: borderRadius.xl,
  },
};

// Animation Timings
export const animations = {
  fast: 200,
  base: 300,
  slow: 500,
  verySlow: 800,
};

// Layout
export const layout = {
  screenWidth: width,
  screenHeight: height,
  padding: spacing.base,
  paddingLg: spacing.xl,
};

// Modern Button Styles
export const buttonStyles = {
  gradient: {
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.base,
  },
  outline: {
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    borderRadius: borderRadius.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
};

// Input Styles
export const inputStyles = {
  modern: {
    backgroundColor: colors.light,
    borderRadius: borderRadius.base,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    fontSize: typography.base,
    borderWidth: 1,
    borderColor: colors.mediumGray,
    ...shadows.sm,
  },
  floating: {
    backgroundColor: colors.light,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    fontSize: typography.base,
    borderWidth: 0,
    ...shadows.base,
  },
};

export default {
  colors,
  habitColors,
  typography,
  spacing,
  borderRadius,
  shadows,
  cardStyles,
  animations,
  layout,
  buttonStyles,
  inputStyles,
};