import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useHabits } from '../context/HabitContext';

export default function ProfileEditable({ navigation }) {
  const { user, updateProfile } = useAuth();
  const { habits } = useHabits();

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.name || user?.email?.split('@')[0] || 'User');
  const [loading, setLoading] = useState(false);

  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
  const completedHabits = habits.filter(h => h.completedToday).length;

  // Sync displayName when user changes
  React.useEffect(() => {
    setDisplayName(user?.name || user?.email?.split('@')[0] || 'User');
  }, [user]);

  const handleSave = async () => {
    if (!displayName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    setLoading(true);
    try {
      // Update the user profile in context and AsyncStorage
      await updateProfile({ name: displayName.trim() });
      Alert.alert('Success', 'Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setDisplayName(user?.name || user?.email?.split('@')[0] || 'User');
    setIsEditing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account" size={60} color="#fff" />
          </View>

          {isEditing ? (
            <View style={styles.editContainer}>
              <Text style={styles.editLabel}>Display Name</Text>
              <TextInput
                style={styles.input}
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Enter your name"
                placeholderTextColor="#94a3b8"
                maxLength={30}
                editable={!loading}
              />
            </View>
          ) : (
            <>
              <Text style={styles.name}>{displayName}</Text>
              <Text style={styles.email}>{user?.email}</Text>
            </>
          )}

          {/* Edit/Save Buttons */}
          {isEditing ? (
            <View style={styles.editButtons}>
              <TouchableOpacity
                style={[styles.editActionButton, styles.saveButton]}
                onPress={handleSave}
                disabled={loading}
              >
                <MaterialCommunityIcons name="check" size={20} color="#fff" />
                <Text style={styles.saveButtonText}>
                  {loading ? 'Saving...' : 'Save'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.editActionButton, styles.cancelButton]}
                onPress={handleCancel}
                disabled={loading}
              >
                <MaterialCommunityIcons name="close" size={20} color="#64748b" />
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <MaterialCommunityIcons name="pencil" size={16} color="#0ea5e9" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <MaterialCommunityIcons name="target" size={32} color="#0ea5e9" />
            <Text style={styles.statValue}>{habits.length}</Text>
            <Text style={styles.statLabel}>Habits</Text>
          </View>
          <View style={styles.statBox}>
            <MaterialCommunityIcons name="fire" size={32} color="#f59e0b" />
            <Text style={styles.statValue}>{totalStreak}</Text>
            <Text style={styles.statLabel}>Total Streak</Text>
          </View>
          <View style={styles.statBox}>
            <MaterialCommunityIcons name="check-circle" size={32} color="#22c55e" />
            <Text style={styles.statValue}>{completedHabits}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        {/* Account Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="email" size={20} color="#64748b" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.email}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="calendar" size={20} color="#64748b" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Member Since</Text>
                <Text style={styles.infoValue}>
                  {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                </Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="shield-check" size={20} color="#64748b" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Account Status</Text>
                <Text style={[styles.infoValue, { color: '#22c55e' }]}>Active</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <MaterialCommunityIcons name="cog" size={24} color="#0ea5e9" />
            <Text style={styles.actionButtonText}>Settings</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#cbd5e1" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Stats')}
          >
            <MaterialCommunityIcons name="chart-line" size={24} color="#0ea5e9" />
            <Text style={styles.actionButtonText}>Statistics</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#cbd5e1" />
          </TouchableOpacity>
        </View>
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
  header: {
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#0ea5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 16,
  },
  editContainer: {
    width: '100%',
    marginBottom: 16,
  },
  editLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1e293b',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    textAlign: 'center',
  },
  editButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  editActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  saveButton: {
    backgroundColor: '#0ea5e9',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  cancelButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0ea5e9',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginLeft: 12,
  },
});