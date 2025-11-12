import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useHabits } from '../context/HabitContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';

// Simple color palette as fallback
const defaultColors = [
  { name: 'Ocean Blue', value: '#0ea5e9' },
  { name: 'Forest Green', value: '#22c55e' },
  { name: 'Sunset Orange', value: '#f59e0b' },
  { name: 'Rose Red', value: '#ef4444' },
  { name: 'Royal Purple', value: '#8b5cf6' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Indigo', value: '#6366f1' },
];

export default function AddHabitSimple({ navigation }) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(defaultColors[0].value);
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
      console.error('Error creating habit:', err);
      Alert.alert('Error', 'Failed to create habit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.colors?.background || '#ffffff' }]}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme?.colors?.border || '#e2e8f0' }]}>
          <Text style={[styles.headerText, { color: theme?.colors?.text || '#000000' }]}>
            Create New Habit
          </Text>
        </View>

        <ScrollView 
          contentContainerStyle={styles.content}
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
            style={styles.input}
          />

          {/* Color Selection */}
          <Text style={[styles.sectionTitle, { color: theme?.colors?.text || '#000000' }]}>
            Choose Color
          </Text>
          
          <View style={styles.colorGrid}>
            {defaultColors.map((colorOption, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setColor(colorOption.value);
                }}
                style={[
                  styles.colorButton,
                  { 
                    backgroundColor: colorOption.value,
                    borderWidth: color === colorOption.value ? 3 : 0,
                    borderColor: theme?.colors?.text || '#000000',
                  }
                ]}
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
          <View style={[
            styles.preview, 
            { 
              backgroundColor: theme?.colors?.card || '#f8f9fa',
              borderLeftColor: color,
            }
          ]}>
            <Text style={[styles.previewLabel, { color: theme?.colors?.textSecondary || '#666666' }]}>
              Preview:
            </Text>
            <Text style={[styles.previewText, { color: theme?.colors?.text || '#000000' }]}>
              {name.trim() || 'Your habit name'}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              onPress={saveHabit}
              loading={loading}
              disabled={loading}
              size="large"
              style={[styles.createButton, { backgroundColor: color }]}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  input: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 32,
  },
  colorButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  preview: {
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  previewLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  previewText: {
    fontSize: 18,
    fontWeight: '600',
  },
  buttonContainer: {
    gap: 12,
  },
  createButton: {
    // Custom styling for create button
  },
});