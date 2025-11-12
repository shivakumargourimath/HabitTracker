import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useHabits } from '../context/HabitContext';

const COLORS = [
  '#0ea5e9', // Ocean Blue
  '#22c55e', // Forest Green
  '#f59e0b', // Sunset Orange
  '#ef4444', // Rose Red
  '#8b5cf6', // Purple
  '#10b981', // Emerald
  '#ec4899', // Pink
  '#6366f1', // Indigo
];

export default function AddHabitSimpleFinal({ navigation }) {
  const [habitName, setHabitName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const { addHabit } = useHabits();

  const handleCreateHabit = async () => {
    // Validation
    if (!habitName || habitName.trim().length === 0) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    if (habitName.trim().length < 2) {
      Alert.alert('Error', 'Habit name must be at least 2 characters');
      return;
    }

    setIsLoading(true);

    try {
      // Add the habit
      await addHabit(habitName.trim(), selectedColor, description.trim());
      
      // Success - go back
      Alert.alert('Success', 'Habit created successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Error creating habit:', error);
      Alert.alert('Error', 'Failed to create habit. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title */}
        <Text style={styles.title}>Create New Habit</Text>
        <Text style={styles.subtitle}>Build better habits one day at a time</Text>

        {/* Habit Name Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Habit Name *</Text>
          <TextInput
            style={styles.input}
            value={habitName}
            onChangeText={setHabitName}
            placeholder="e.g., Drink 8 glasses of water"
            placeholderTextColor="#94a3b8"
            maxLength={50}
            editable={!isLoading}
          />
          <Text style={styles.helperText}>
            {habitName.length}/50 characters
          </Text>
        </View>

        {/* Description Input (Optional) */}
        <View style={styles.section}>
          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="e.g., Stay hydrated throughout the day"
            placeholderTextColor="#94a3b8"
            maxLength={150}
            multiline
            numberOfLines={3}
            editable={!isLoading}
          />
          <Text style={styles.helperText}>
            {description.length}/150 characters
          </Text>
        </View>

        {/* Color Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Choose Color</Text>
          <View style={styles.colorGrid}>
            {COLORS.map((color, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedColor(color)}
                disabled={isLoading}
                style={[
                  styles.colorButton,
                  {
                    backgroundColor: color,
                    borderWidth: selectedColor === color ? 4 : 0,
                    borderColor: '#1e293b',
                  },
                ]}
              >
                {selectedColor === color && (
                  <MaterialCommunityIcons name="check" size={28} color="#fff" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Preview Card */}
        <View style={[styles.previewCard, { borderLeftColor: selectedColor }]}>
          <Text style={styles.previewLabel}>Preview:</Text>
          <View style={styles.previewContent}>
            <View
              style={[
                styles.previewCheckbox,
                { borderColor: selectedColor },
              ]}
            />
            <Text style={styles.previewText}>
              {habitName.trim() || 'Your habit name will appear here'}
            </Text>
          </View>
        </View>

        {/* Buttons */}
        <TouchableOpacity
          style={[
            styles.createButton,
            { backgroundColor: selectedColor },
            isLoading && styles.disabledButton,
          ]}
          onPress={handleCreateHabit}
          disabled={isLoading}
        >
          <Text style={styles.createButtonText}>
            {isLoading ? 'Creating...' : 'Create Habit'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 32,
  },
  section: {
    marginBottom: 28,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1e293b',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  helperText: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
    textAlign: 'right',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  colorButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  previewCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 28,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 12,
  },
  previewContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 12,
  },
  previewText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },
  createButton: {
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  disabledButton: {
    opacity: 0.6,
  },
  cancelButton: {
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
});