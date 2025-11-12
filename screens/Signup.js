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

export default function Signup({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const { isDark } = useThemeContext();

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    setLoading(true);
    const result = await signup(name, email, password, confirmPassword);
    setLoading(false);
    if (!result.success) {
      Alert.alert('Signup Failed', result.error);
    }
    // On success, user is set and navigation happens automatically via App.js
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#1c1c1e' : '#f0f0f0' }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>Sign Up</Text>

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
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor={isDark ? '#888' : '#aaa'}
          style={[
            styles.input,
            {
              backgroundColor: isDark ? '#2a2a2a' : '#fff',
              color: isDark ? '#fff' : '#000',
              borderColor: isDark ? '#555' : '#ccc',
            },
          ]}
          secureTextEntry
        />

        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm Password"
          placeholderTextColor={isDark ? '#888' : '#aaa'}
          style={[
            styles.input,
            {
              backgroundColor: isDark ? '#2a2a2a' : '#fff',
              color: isDark ? '#fff' : '#000',
              borderColor: isDark ? '#555' : '#ccc',
            },
          ]}
          secureTextEntry
        />

        <TouchableOpacity
          onPress={handleSignup}
          style={[styles.button, { backgroundColor: '#4caf50' }]}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Signing up...' : 'Sign Up'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={[styles.link, { color: isDark ? '#fff' : '#000' }]}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 16, justifyContent: 'center' },
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
    marginTop: 16,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { textAlign: 'center', marginTop: 16, fontSize: 16 },
});