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
  { name: 'Ocean Blue', value: '#0ea5e9' },
  { name: 'Forest Green', value: '#22c55e' },
  { name: 'Sunset Orange', value: '#f59e0b' },
  { name: 'Rose Red', value: '#ef4444' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Indigo', value: '#6366f1' },
];

export default function AddHabitProduction({ navigation }) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLORS[0].value);
  const [loading, setLoading] = useState(false);
  const { addHabit } = useHabits();

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    if (name.trim().length < 2) {
      Alert.alert('Error', 'Habit name must be at least 2 characters');
      return;
    }

    setLoading(true);
    try {
      await addHabit(name.trim(), color);
      navigation.goBack();
    } catch (error) {
      console.error('Error adding habit:', error);
      Alert.alert('Error', 'Failed to create habit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Habit Name */}
        <View style={styles.section}>
          <Text style={styles.label}>Habit Name *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g., Drink 8 glasses of water"
            placeholderTextColor="#94a3b8"
            maxLength={50}
          />
        </View>

        {/* Color Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Choose Color</Text>
          <View style={styles.colorGrid}>
            {COLORS.map((colorOption) => (
              <TouchableOpacity
                key={colorOption.value}
                onPress={() => setColor(colorOption.value)}
                style={[
                  styles.colorButton,
                  {
                    backgroundColor: colorOption.value,
                    borderWidth: color === colorOption.value ? 3 : 0,
                    borderColor: '#1e293b',
                  },
                ]}
              >
                {color === colorOption.value && (
                  <MaterialCommunityIcons name="check" size={24} color="#fff" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Preview */}
        <View style={[styles.preview, { borderLeftColor: color }]}>
          <Text style={styles.previewLabel}>Preview:</Text>
          <Text style={styles.previewText}>
            {name.trim() || 'Your habit name'}
          </Text>
        </View>

        {/* Buttons */}
        <TouchableOpacity
          style={[styles.button, styles.createButton, { backgroundColor: color }]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creating...' : 'Create Habit'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
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
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#1e293b',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
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
    elevation: 3,
  },
  preview: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  previewLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  previewText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  button: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  createButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  cancelButtonText: {
    color: '#64748b',
  },
});