import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useHabits } from '../context/HabitContext';

export default function ProfileEnhanced({ navigation }) {
  const { user, updateProfile, logout } = useAuth();
  const { habits } = useHabits();

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.name || user?.email?.split('@')[0] || 'User');
  const [loading, setLoading] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  // Calculate comprehensive stats
  const stats = useMemo(() => {
    const total = habits.length;
    const completed = habits.filter(h => h.completedToday).length;
    const totalStreak = habits.reduce((sum, h) => sum + (h.streak || 0), 0);
    const longestStreak = total > 0 ? Math.max(...habits.map(h => h.streak || 0)) : 0;
    const avgStreak = total > 0 ? Math.round(totalStreak / total) : 0;
    const habitsOnFire = habits.filter(h => h.streak >= 7).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, totalStreak, longestStreak, avgStreak, habitsOnFire, completionRate };
  }, [habits]);

  // Calculate achievements
  const achievements = useMemo(() => {
    const earned = [];
    
    if (stats.total >= 1) earned.push({ icon: 'flag', title: 'First Step', desc: 'Created your first habit', color: '#667eea' });
    if (stats.total >= 5) earned.push({ icon: 'star', title: 'Habit Master', desc: 'Created 5 habits', color: '#f093fb' });
    if (stats.total >= 10) earned.push({ icon: 'crown', title: 'Dedication', desc: 'Created 10 habits', color: '#fbbf24' });
    if (stats.longestStreak >= 7) earned.push({ icon: 'fire', title: 'Week Warrior', desc: '7-day streak achieved', color: '#f87171' });
    if (stats.longestStreak >= 30) earned.push({ icon: 'trophy', title: 'Monthly Champion', desc: '30-day streak achieved', color: '#ffa502' });
    if (stats.habitsOnFire >= 3) earned.push({ icon: 'rocket', title: 'On Fire', desc: '3+ habits with 7-day streaks', color: '#4facfe' });
    if (stats.completionRate === 100 && stats.total > 0) earned.push({ icon: 'check-all', title: 'Perfectionist', desc: '100% completion today', color: '#22c55e' });
    
    return earned;
  }, [stats]);

  // Recent activity
  const recentActivity = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return habits
      .filter(h => h.lastCompleted === today)
      .slice(0, 5)
      .map(h => ({
        habit: h.name,
        color: h.color,
        time: 'Today',
      }));
  }, [habits]);

  React.useEffect(() => {
    setDisplayName(user?.name || user?.email?.split('@')[0] || 'User');
  }, [user]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleSave = async () => {
    if (!displayName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    setLoading(true);
    try {
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

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive', 
          onPress: () => logout() 
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header with Gradient */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.headerGradient}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <MaterialCommunityIcons name="logout" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          {/* Avatar */}
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.avatarGradient}
          >
            <MaterialCommunityIcons name="account" size={60} color="#fff" />
          </LinearGradient>

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
                style={styles.saveButton}
                onPress={handleSave}
                disabled={loading}
              >
                <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradientButton}>
                  <MaterialCommunityIcons name="check" size={20} color="#fff" />
                  <Text style={styles.saveButtonText}>
                    {loading ? 'Saving...' : 'Save'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
                disabled={loading}
              >
                <MaterialCommunityIcons name="close" size={20} color="#64748b" />
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
              <MaterialCommunityIcons name="pencil" size={16} color="#667eea" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <LinearGradient colors={['#667eea15', '#764ba215']} style={styles.statGradient}>
              <MaterialCommunityIcons name="target" size={32} color="#667eea" />
              <Text style={styles.statValue}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total Habits</Text>
            </LinearGradient>
          </View>
          <View style={styles.statCard}>
            <LinearGradient colors={['#f093fb15', '#f5576c15']} style={styles.statGradient}>
              <MaterialCommunityIcons name="check-circle" size={32} color="#f5576c" />
              <Text style={styles.statValue}>{stats.completed}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </LinearGradient>
          </View>
          <View style={styles.statCard}>
            <LinearGradient colors={['#4facfe15', '#00f2fe15']} style={styles.statGradient}>
              <MaterialCommunityIcons name="fire" size={32} color="#ff6b6b" />
              <Text style={styles.statValue}>{stats.longestStreak}</Text>
              <Text style={styles.statLabel}>Best Streak</Text>
            </LinearGradient>
          </View>
          <View style={styles.statCard}>
            <LinearGradient colors={['#43e97b15', '#38f9d715']} style={styles.statGradient}>
              <MaterialCommunityIcons name="chart-line" size={32} color="#ffa502" />
              <Text style={styles.statValue}>{stats.completionRate}%</Text>
              <Text style={styles.statLabel}>Completion</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Achievements */}
        {achievements.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="trophy" size={24} color="#ffa502" />
              <Text style={styles.sectionTitle}>Achievements</Text>
              <Text style={styles.badge}>{achievements.length}</Text>
            </View>
            <View style={styles.achievementsGrid}>
              {achievements.map((achievement, index) => (
                <Animated.View 
                  key={index} 
                  style={[styles.achievementCard, { transform: [{ scale: scaleAnim }] }]}
                >
                  <TouchableOpacity onPress={handlePress}>
                    <LinearGradient
                      colors={[achievement.color + '20', achievement.color + '10']}
                      style={styles.achievementGradient}
                    >
                      <View style={[styles.achievementIcon, { backgroundColor: achievement.color }]}>
                        <MaterialCommunityIcons name={achievement.icon} size={24} color="#fff" />
                      </View>
                      <Text style={styles.achievementTitle}>{achievement.title}</Text>
                      <Text style={styles.achievementDesc}>{achievement.desc}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </View>
        )}

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="clock-outline" size={24} color="#667eea" />
              <Text style={styles.sectionTitle}>Recent Activity</Text>
            </View>
            <View style={styles.activityCard}>
              {recentActivity.map((activity, index) => (
                <View key={index} style={styles.activityItem}>
                  <View style={[styles.activityDot, { backgroundColor: activity.color }]} />
                  <View style={styles.activityContent}>
                    <Text style={styles.activityText}>Completed <Text style={styles.activityHabit}>{activity.habit}</Text></Text>
                    <Text style={styles.activityTime}>{activity.time}</Text>
                  </View>
                  <MaterialCommunityIcons name="check" size={20} color="#22c55e" />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Account Info */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="information-outline" size={24} color="#667eea" />
            <Text style={styles.sectionTitle}>Account Information</Text>
          </View>
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
                  {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="shield-check" size={20} color="#22c55e" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Account Status</Text>
                <Text style={[styles.infoValue, { color: '#22c55e' }]}>Active</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="lightning-bolt" size={24} color="#667eea" />
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Settings')}>
            <View style={styles.actionIconContainer}>
              <MaterialCommunityIcons name="cog" size={24} color="#667eea" />
            </View>
            <Text style={styles.actionButtonText}>Settings</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#cbd5e1" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Stats')}>
            <View style={styles.actionIconContainer}>
              <MaterialCommunityIcons name="chart-line" size={24} color="#667eea" />
            </View>
            <Text style={styles.actionButtonText}>View Statistics</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#cbd5e1" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('AddHabit')}>
            <View style={styles.actionIconContainer}>
              <MaterialCommunityIcons name="plus-circle" size={24} color="#667eea" />
            </View>
            <Text style={styles.actionButtonText}>Add New Habit</Text>
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
  headerGradient: {
    paddingTop: 16,
    paddingBottom: 80,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginTop: -50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    zIndex: 10,
  },
  avatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
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
    fontSize: 14,
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
  saveButton: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    gap: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
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
    color: '#667eea',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 12,
  },
  statCard: {
    width: '48%',
  },
  statGradient: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00000008',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
  },
  badge: {
    backgroundColor: '#ffa502',
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    width: '48%',
  },
  achievementGradient: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00000008',
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementDesc: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  activityHabit: {
    fontWeight: '600',
    color: '#1e293b',
  },
  activityTime: {
    fontSize: 12,
    color: '#94a3b8',
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
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
});
