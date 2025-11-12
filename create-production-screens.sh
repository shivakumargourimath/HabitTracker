#!/bin/bash

# Stats-Production.js
cat > /home/user/Desktop/Projects/HabitTrackerApp/screens/Stats-Production.js << 'EOF'
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useHabits } from '../context/HabitContext';

export default function StatsProduction() {
  const { habits } = useHabits();

  const totalHabits = habits.length;
  const completedToday = habits.filter(h => h.completedToday).length;
  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
  const averageStreak = totalHabits > 0 ? Math.round(totalStreak / totalHabits) : 0;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  const stats = [
    { icon: 'target', label: 'Total Habits', value: totalHabits, color: '#0ea5e9' },
    { icon: 'check-circle', label: 'Completed Today', value: completedToday, color: '#22c55e' },
    { icon: 'fire', label: 'Average Streak', value: `${averageStreak} days`, color: '#f59e0b' },
    { icon: 'chart-line', label: 'Completion Rate', value: `${completionRate}%`, color: '#8b5cf6' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.grid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.iconContainer, { backgroundColor: stat.color + '20' }]}>
                <MaterialCommunityIcons name={stat.icon} size={32} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {habits.length > 0 && (
          <View style={styles.listSection}>
            <Text style={styles.sectionTitle}>Habit Details</Text>
            {habits.map((habit) => (
              <View key={habit.id} style={[styles.habitItem, { borderLeftColor: habit.color }]}>
                <Text style={styles.habitName}>{habit.name}</Text>
                <View style={styles.habitStats}>
                  <View style={styles.habitStat}>
                    <MaterialCommunityIcons name="fire" size={16} color="#f59e0b" />
                    <Text style={styles.habitStatText}>{habit.streak} days</Text>
                  </View>
                  <View style={styles.habitStat}>
                    <MaterialCommunityIcons 
                      name={habit.completedToday ? "check-circle" : "circle-outline"} 
                      size={16} 
                      color={habit.completedToday ? "#22c55e" : "#94a3b8"} 
                    />
                    <Text style={styles.habitStatText}>
                      {habit.completedToday ? "Done" : "Pending"}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 24 },
  statCard: { width: '48%', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, marginRight: '2%', alignItems: 'center', elevation: 2 },
  iconContainer: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statValue: { fontSize: 24, fontWeight: '700', color: '#1e293b', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#64748b', textAlign: 'center' },
  listSection: { marginTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginBottom: 12 },
  habitItem: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 12, borderLeftWidth: 4, elevation: 1 },
  habitName: { fontSize: 16, fontWeight: '600', color: '#1e293b', marginBottom: 8 },
  habitStats: { flexDirection: 'row', justifyContent: 'space-between' },
  habitStat: { flexDirection: 'row', alignItems: 'center' },
  habitStatText: { fontSize: 14, color: '#64748b', marginLeft: 4 },
});
EOF

# Settings-Production.js
cat > /home/user/Desktop/Projects/HabitTrackerApp/screens/Settings-Production.js << 'EOF'
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function SettingsProduction({ navigation }) {
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const settings = [
    { icon: 'account', label: 'Profile', onPress: () => navigation.navigate('Profile') },
    { icon: 'bell', label: 'Notifications', onPress: () => Alert.alert('Coming Soon', 'Notifications feature coming soon!') },
    { icon: 'shield-check', label: 'Privacy', onPress: () => Alert.alert('Coming Soon', 'Privacy settings coming soon!') },
    { icon: 'help-circle', label: 'Help & Support', onPress: () => Alert.alert('Help', 'Need help? Contact us at support@habittracker.com') },
    { icon: 'information', label: 'About', onPress: () => Alert.alert('About', 'Habit Tracker v1.0.0\nBuilt with React Native') },
    { icon: 'logout', label: 'Logout', onPress: handleLogout, danger: true },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {settings.map((setting, index) => (
          <TouchableOpacity
            key={index}
            style={styles.settingItem}
            onPress={setting.onPress}
          >
            <View style={styles.settingLeft}>
              <MaterialCommunityIcons 
                name={setting.icon} 
                size={24} 
                color={setting.danger ? '#ef4444' : '#0ea5e9'} 
              />
              <Text style={[styles.settingLabel, setting.danger && styles.dangerText]}>
                {setting.label}
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#cbd5e1" />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16 },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 12, elevation: 1 },
  settingLeft: { flexDirection: 'row', alignItems: 'center' },
  settingLabel: { fontSize: 16, fontWeight: '500', color: '#1e293b', marginLeft: 16 },
  dangerText: { color: '#ef4444' },
});
EOF

# Login-Production.js
cat > /home/user/Desktop/Projects/HabitTrackerApp/screens/Login-Production.js << 'EOF'
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function LoginProduction({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      if (!result.success) {
        Alert.alert('Login Failed', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="target" size={48} color="#fff" />
          </View>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Sign in to continue tracking your habits</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Signing In...' : 'Sign In'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, padding: 24 },
  header: { alignItems: 'center', marginTop: 40, marginBottom: 40 },
  iconContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#0ea5e9', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '700', color: '#1e293b', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#64748b', textAlign: 'center' },
  form: { flex: 1 },
  input: { backgroundColor: '#f8fafc', borderRadius: 8, padding: 16, fontSize: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  button: { backgroundColor: '#0ea5e9', borderRadius: 8, padding: 16, alignItems: 'center', marginBottom: 16 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  linkText: { color: '#0ea5e9', textAlign: 'center', fontSize: 14 },
});
EOF

# Signup-Production.js
cat > /home/user/Desktop/Projects/HabitTrackerApp/screens/Signup-Production.js << 'EOF'
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function SignupProduction({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleSignup = async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const result = await signup(email, password);
      if (!result.success) {
        Alert.alert('Signup Failed', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="account-plus" size={48} color="#fff" />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Start your habit tracking journey</Text>
        </View>

        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
          <TextInput style={styles.input} placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
          <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Creating Account...' : 'Sign Up'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.linkText}>Already have an account? Sign In</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, padding: 24 },
  header: { alignItems: 'center', marginTop: 40, marginBottom: 40 },
  iconContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#0ea5e9', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '700', color: '#1e293b', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#64748b', textAlign: 'center' },
  form: { flex: 1 },
  input: { backgroundColor: '#f8fafc', borderRadius: 8, padding: 16, fontSize: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  button: { backgroundColor: '#0ea5e9', borderRadius: 8, padding: 16, alignItems: 'center', marginBottom: 16 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  linkText: { color: '#0ea5e9', textAlign: 'center', fontSize: 14 },
});
EOF

# Profile-Production.js
cat > /home/user/Desktop/Projects/HabitTrackerApp/screens/Profile-Production.js << 'EOF'
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useHabits } from '../context/HabitContext';

export default function ProfileProduction() {
  const { user } = useAuth();
  const { habits } = useHabits();

  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account" size={60} color="#fff" />
          </View>
          <Text style={styles.name}>{user?.email?.split('@')[0] || 'User'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{habits.length}</Text>
            <Text style={styles.statLabel}>Habits</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{totalStreak}</Text>
            <Text style={styles.statLabel}>Total Streak</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{habits.filter(h => h.completedToday).length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 24 },
  header: { alignItems: 'center', marginBottom: 32 },
  avatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#0ea5e9', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  name: { fontSize: 24, fontWeight: '700', color: '#1e293b', marginBottom: 4 },
  email: { fontSize: 16, color: '#64748b' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around' },
  statBox: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 20, flex: 1, marginHorizontal: 4, elevation: 2 },
  statValue: { fontSize: 32, fontWeight: '700', color: '#0ea5e9', marginBottom: 4 },
  statLabel: { fontSize: 14, color: '#64748b' },
});
EOF

echo "All production screens created successfully!"
