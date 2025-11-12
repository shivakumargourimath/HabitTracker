// components/UI/LoadingSpinner.js
import React, { useRef, useEffect } from 'react';
import { View, Animated, Easing } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

export const LoadingSpinner = ({ size = 40, color, style }) => {
  const theme = useTheme();
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spin = () => {
      spinValue.setValue(0);
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => spin());
    };
    spin();
  }, [spinValue]);

  const spinInterpolate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[{ alignItems: 'center', justifyContent: 'center' }, style]}>
      <Animated.View
        style={{
          transform: [{ rotate: spinInterpolate }],
        }}
      >
        <MaterialCommunityIcons
          name="loading"
          size={size}
          color={color || theme.colors.primary}
        />
      </Animated.View>
    </View>
  );
};

export const SkeletonPlaceholder = ({ width, height, borderRadius, style }) => {
  const theme = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };
    animate();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width: width || '100%',
          height: height || 20,
          backgroundColor: theme.colors.borderLight,
          borderRadius: borderRadius || theme.borderRadius.base,
          opacity,
        },
        style,
      ]}
    />
  );
};