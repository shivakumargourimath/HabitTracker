import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useThemeContext } from '../context/ThemeContext';

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const { isDark } = useThemeContext();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  const handleSave = () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Error', 'Name and email are required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }
    updateProfile({ name, email, avatar });
    Alert.alert('Success', 'Profile updated');
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#1c1c1e' : '#f0f0f0' }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>Profile</Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Name"
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

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor={isDark ? '#888' : '#aaa'}
          style={[
            styles.input,
            {
              backgroundColor: isDark ? '#2a2a2a' : '#fff',
              color: isDark ? '#fff' : '#000',
              borderColor: isDark ? '#555' : '#ccc',
            },
          ]}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          value={avatar}
          onChangeText={setAvatar}
          placeholder="Avatar URL"
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

        <TouchableOpacity
          onPress={handleSave}
          style={[styles.button, { backgroundColor: '#4caf50' }]}
        >
          <Text style={styles.buttonText}>Save Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogout}
          style={[styles.button, { backgroundColor: '#f44336', marginTop: 16 }]}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 32 },
  input: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});