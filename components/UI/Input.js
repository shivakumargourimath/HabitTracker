// components/UI/Input.js
import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Text, Animated, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

export const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry,
  leftIcon,
  rightIcon,
  onRightIconPress,
  multiline = false,
  style,
  inputStyle,
  ...props
}) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  useEffect(() => {
    Animated.timing(borderAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const getBorderColor = () => {
    if (error) return theme.colors.error;
    if (isFocused) return theme.colors.primary;
    return theme.colors.border;
  };

  const labelStyle = {
    position: 'absolute',
    left: leftIcon ? 48 : theme.spacing[4],
    top: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [multiline ? 20 : 16, -8],
    }),
    fontSize: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.fontSizes.base, theme.fontSizes.sm],
    }),
    color: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.colors.textSecondary, isFocused ? theme.colors.primary : theme.colors.textSecondary],
    }),
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 4,
    fontWeight: theme.fontWeights.medium,
  };

  const containerStyle = {
    marginVertical: theme.spacing[2],
  };

  const inputContainerStyle = {
    flexDirection: 'row',
    alignItems: multiline ? 'flex-start' : 'center',
    borderWidth: 2,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    borderColor: getBorderColor(),
    paddingHorizontal: theme.spacing[4],
    paddingVertical: multiline ? theme.spacing[3] : theme.spacing[3],
    minHeight: multiline ? 100 : 52,
    ...theme.shadows.sm,
  };

  const textInputStyle = {
    flex: 1,
    fontSize: theme.fontSizes.base,
    color: theme.colors.text,
    paddingLeft: leftIcon ? theme.spacing[2] : 0,
    paddingRight: (rightIcon || secureTextEntry) ? theme.spacing[2] : 0,
    textAlignVertical: multiline ? 'top' : 'center',
    minHeight: multiline ? 80 : undefined,
  };

  const errorStyle = {
    marginTop: theme.spacing[1],
    marginLeft: theme.spacing[4],
  };

  const errorTextStyle = {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.error,
    fontWeight: theme.fontWeights.medium,
  };

  return (
    <View style={[containerStyle, style]}>
      <View style={inputContainerStyle}>
        {leftIcon && (
          <MaterialCommunityIcons
            name={leftIcon}
            size={20}
            color={isFocused ? theme.colors.primary : theme.colors.textSecondary}
          />
        )}
        
        <TextInput
          style={[textInputStyle, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={!label ? placeholder : undefined}
          placeholderTextColor={theme.colors.textTertiary}
          secureTextEntry={secureTextEntry && !showPassword}
          multiline={multiline}
          textContentType="none"
          autoComplete="off"
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{ padding: theme.spacing[1] }}
          >
            <MaterialCommunityIcons
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !secureTextEntry && (
          <TouchableOpacity onPress={onRightIconPress}>
            <MaterialCommunityIcons
              name={rightIcon}
              size={20}
              color={isFocused ? theme.colors.primary : theme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {label && (
        <Animated.Text style={labelStyle}>
          {label}
        </Animated.Text>
      )}
      
      {error && (
        <View style={errorStyle}>
          <Text style={errorTextStyle}>{error}</Text>
        </View>
      )}
    </View>
  );
};
