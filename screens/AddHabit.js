import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useHabits } from '../context/HabitContext';
import { useTheme } from '../context/ThemeContext';
import { habitColors } from '../constants/theme';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';

export default function AddHabit({ navigation }) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(habitColors[0]?.value || '#0ea5e9');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { addHabit } = useHabits();
  const theme = useTheme();

  const validateForm = () => {
    if (!name.trim()) {
      setError('Please enter a habit name');
      return false;
    }
    if (name.trim().length < 2) {
      setError('Habit name must be at least 2 characters');
      return false;
    }
    setError('');
    return true;
  };

  const saveHabit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      await addHabit(name.trim(), color);
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Failed to create habit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors?.background || '#ffffff' }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={{
          paddingHorizontal: theme.spacing?.[4] || 16,
          paddingVertical: theme.spacing?.[4] || 16,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors?.border || '#e2e8f0',
        }}>
          <Text style={{
            fontSize: theme.fontSizes?.['2xl'] || 24,
            fontWeight: theme.fontWeights?.bold || '700',
            color: theme.colors?.text || '#000000',
            textAlign: 'center',
          }}>
            Create New Habit
          </Text>
        </View>

        <ScrollView 
          contentContainerStyle={{
            paddingHorizontal: theme.spacing[6],
            paddingVertical: theme.spacing[6],
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Habit Name Input */}
          <Input
            label="Habit Name"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (error) setError('');
            }}
            placeholder="e.g., Drink 8 glasses of water"
            leftIcon="target"
            error={error}
            style={{ marginBottom: theme.spacing[6] }}
          />

          {/* Color Selection */}
          <Text style={{
            fontSize: theme.fontSizes.lg,
            fontWeight: theme.fontWeights.semibold,
            color: theme.colors.text,
            marginBottom: theme.spacing[4],
          }}>
            Choose Color
          </Text>
          
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginBottom: theme.spacing[8],
          }}>
            {habitColors && habitColors.map((colorOption, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setColor(colorOption.value);
                }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: colorOption?.value || '#0ea5e9',
                  margin: theme.spacing?.[2] || 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: color === colorOption.value ? 3 : 0,
                  borderColor: theme.colors?.text || '#000000',
                  ...(theme.shadows?.base || {}),
                }}
              >
                {color === colorOption.value && (
                  <MaterialCommunityIcons
                    name="check"
                    size={24}
                    color="#ffffff"
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Color Preview */}
          <View style={{
            padding: theme.spacing[4],
            borderRadius: theme.borderRadius.lg,
            backgroundColor: theme.colors.card,
            borderLeftWidth: 4,
            borderLeftColor: color,
            marginBottom: theme.spacing[8],
            ...theme.shadows.sm,
          }}>
            <Text style={{
              fontSize: theme.fontSizes.base,
              color: theme.colors.textSecondary,
              marginBottom: theme.spacing[1],
            }}>
              Preview:
            </Text>
            <Text style={{
              fontSize: theme.fontSizes.lg,
              fontWeight: theme.fontWeights.semibold,
              color: theme.colors.text,
            }}>
              {name.trim() || 'Your habit name'}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={{ gap: theme.spacing[3] }}>
            <Button
              onPress={saveHabit}
              loading={loading}
              disabled={loading}
              size="large"
              style={{ backgroundColor: color }}
            >
              {loading ? 'Creating...' : 'Create Habit'}
            </Button>
            
            <Button
              variant="secondary"
              onPress={() => {
                navigation.goBack();
              }}
              disabled={loading}
            >
              Cancel
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
