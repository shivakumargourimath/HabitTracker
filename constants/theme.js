// constants/theme.js - Modern Design System
export const colors = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  }
};

export const habitColors = [
  { name: 'Ocean Blue', value: colors.primary[500], light: colors.primary[100] },
  { name: 'Forest Green', value: colors.success[500], light: colors.success[100] },
  { name: 'Sunset Orange', value: colors.warning[500], light: colors.warning[100] },
  { name: 'Rose Red', value: colors.error[500], light: colors.error[100] },
  { name: 'Royal Purple', value: '#8b5cf6', light: '#f3e8ff' },
  { name: 'Emerald', value: '#10b981', light: '#d1fae5' },
  { name: 'Pink', value: '#ec4899', light: '#fce7f3' },
  { name: 'Indigo', value: '#6366f1', light: '#e0e7ff' },
];

export const typography = {
  fonts: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  lineHeights: {
    xs: 16,
    sm: 20,
    base: 24,
    lg: 28,
    xl: 28,
    '2xl': 32,
    '3xl': 36,
    '4xl': 40,
    '5xl': 48,
  },
  fontWeights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
};

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
};

export const borderRadius = {
  none: 0,
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  base: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 16,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 24,
  },
};

// Light Theme
export const lightTheme = {
  colors: {
    primary: colors.primary[500],
    primaryLight: colors.primary[100],
    secondary: colors.secondary[500],
    success: colors.success[500],
    warning: colors.warning[500],
    error: colors.error[500],
    
    // Backgrounds
    background: colors.neutral[50],
    surface: '#ffffff',
    card: '#ffffff',
    
    // Text
    text: colors.neutral[900],
    textSecondary: colors.neutral[600],
    textTertiary: colors.neutral[400],
    
    // Borders
    border: colors.neutral[200],
    borderLight: colors.neutral[100],
    
    // Status bar
    statusBar: 'dark',
  },
  ...typography,
  spacing,
  borderRadius,
  shadows,
};

// Dark Theme
export const darkTheme = {
  colors: {
    primary: colors.primary[400],
    primaryLight: colors.primary[900],
    secondary: colors.secondary[400],
    success: colors.success[400],
    warning: colors.warning[400],
    error: colors.error[400],
    
    // Backgrounds
    background: '#0a0a0a',
    surface: '#1a1a1a',
    card: '#2a2a2a',
    
    // Text
    text: colors.neutral[50],
    textSecondary: colors.neutral[300],
    textTertiary: colors.neutral[500],
    
    // Borders
    border: colors.neutral[700],
    borderLight: colors.neutral[800],
    
    // Status bar
    statusBar: 'light',
  },
  ...typography,
  spacing,
  borderRadius,
  shadows,
};