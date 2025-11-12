import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useThemeContext } from '../context/ThemeContext';

export default function ProfileModal({ visible, onClose }) {
  const { user, logout } = useAuth();
  const { isDark } = useThemeContext();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: () => { logout(); onClose(); } },
    ]);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={[
            styles.modal,
            { backgroundColor: isDark ? '#1e1e1e' : '#fff' },
          ]}
          onStartShouldSetResponder={() => true} // Prevent closing when tapping inside
        >
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <MaterialCommunityIcons
              name="account-circle"
              size={60}
              color={isDark ? '#fff' : '#000'}
            />
          </View>

          {/* User Info */}
          <Text style={[styles.name, { color: isDark ? '#fff' : '#000' }]}>
            {user?.name || 'User'}
          </Text>
          <Text style={[styles.email, { color: isDark ? '#888' : '#666' }]}>
            {user?.email || ''}
          </Text>

          {/* Logout Button */}
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: '#f44336' }]}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '80%',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    marginBottom: 20,
  },
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});