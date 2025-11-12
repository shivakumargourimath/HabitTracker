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
