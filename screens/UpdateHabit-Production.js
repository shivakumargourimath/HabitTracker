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

export default function UpdateHabitProduction({ route, navigation }) {
  const { habit } = route.params;
  const [name, setName] = useState(habit.name);
  const [color, setColor] = useState(habit.color);
  const [loading, setLoading] = useState(false);
  const { updateHabit } = useHabits();

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    setLoading(true);
    try {
      await updateHabit(habit.id, name.trim(), color);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update habit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>Habit Name *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter habit name"
            placeholderTextColor="#94a3b8"
          />
        </View>

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

        <TouchableOpacity
          style={[styles.button, { backgroundColor: color }]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.buttonText, { color: '#64748b' }]}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 20 },
  section: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: '600', color: '#1e293b', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 16, fontSize: 16, color: '#1e293b', borderWidth: 1, borderColor: '#e2e8f0' },
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  colorButton: { width: 50, height: 50, borderRadius: 25, margin: 8, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  button: { borderRadius: 8, padding: 16, alignItems: 'center', marginBottom: 12 },
  cancelButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0' },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});
