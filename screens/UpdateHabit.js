import React, { useState } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RadioButton } from 'react-native-paper';
import { useHabits } from '../context/HabitContext';
import { useThemeContext } from '../context/ThemeContext';

export default function UpdateHabit({ route, navigation }) {
  const { habit } = route.params;
  const { updateHabit } = useHabits();
  const { isDark } = useThemeContext();

  const [name, setName] = useState(habit.name);
  const [color, setColor] = useState(habit.color);

  const saveUpdate = () => {
    if (!name.trim()) return alert('Enter a habit name');
    updateHabit(habit.id, name, color);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#1c1c1e' : '#f0f0f0' }]}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Habit Name */}
        <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Habit Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter habit name"
          placeholderTextColor={isDark ? '#888' : '#aaa'}
          style={[
            styles.input,
            {
              backgroundColor: isDark ? '#2a2a2a' : '#fff',
              color: isDark ? '#fff' : '#000',
              borderColor: isDark ? '#555' : '#ccc',
            },
          ]}
        />

        {/* Select Color */}
        <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Select Color</Text>
        <RadioButton.Group onValueChange={setColor} value={color}>
          <View style={styles.radioRow}>
            {[
              { value: '#6200ee', label: 'Purple' },
              { value: '#4caf50', label: 'Green' },
              { value: '#f44336', label: 'Red' },
              { value: '#ff9800', label: 'Orange' },
            ].map((c) => (
              <View key={c.value} style={styles.radioItem}>
                <RadioButton value={c.value} color={c.value} />
                <Text style={[styles.radioLabel, { color: isDark ? '#fff' : '#000' }]}>
                  {c.label}
                </Text>
              </View>
            ))}
          </View>
        </RadioButton.Group>

        {/* Save Button */}
        <TouchableOpacity
          onPress={saveUpdate}
          style={[styles.saveButton, { backgroundColor: color }]}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flexGrow: 1, padding: 16 },
  label: { fontSize: 16, marginBottom: 8, fontWeight: '500' },
  input: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  radioRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 24 },
  radioItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  radioLabel: { fontSize: 16 },
  saveButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
