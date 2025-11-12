import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { COLORS, SHADOWS, RADIUS, SPACING } from '../constants/colors';

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
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={COLORS.gradients.purple}
        style={styles.gradient}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <LinearGradient
                  colors={[COLORS.white + '30', COLORS.white + '10']}
                  style={styles.iconGradient}
                >
                  <MaterialCommunityIcons name="account-plus" size={56} color={COLORS.white} />
                </LinearGradient>
              </View>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join thousands building better habits</Text>
            </View>

            {/* Form Card */}
            <View style={styles.formCard}>
              <View style={styles.formCardInner}>
                {/* Email Input */}
                <View style={styles.inputGroup}>
                  <View style={styles.inputIconContainer}>
                    <MaterialCommunityIcons 
                      name="email-outline" 
                      size={20} 
                      color={COLORS.slate[400]} 
                    />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Email address"
                    placeholderTextColor={COLORS.slate[400]}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                {/* Password Input */}
                <View style={styles.inputGroup}>
                  <View style={styles.inputIconContainer}>
                    <MaterialCommunityIcons 
                      name="lock-outline" 
                      size={20} 
                      color={COLORS.slate[400]} 
                    />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={COLORS.slate[400]}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCorrect={false}
                  />
                </View>

                {/* Confirm Password Input */}
                <View style={styles.inputGroup}>
                  <View style={styles.inputIconContainer}>
                    <MaterialCommunityIcons 
                      name="lock-check-outline" 
                      size={20} 
                      color={COLORS.slate[400]} 
                    />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm password"
                    placeholderTextColor={COLORS.slate[400]}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoCorrect={false}
                  />
                </View>

                {/* Sign Up Button */}
                <Button
                  title={loading ? 'Creating Account...' : 'Sign Up'}
                  onPress={handleSignup}
                  disabled={loading}
                  loading={loading}
                  gradient={true}
                  size="large"
                  fullWidth
                  icon="account-plus"
                  style={styles.signUpButton}
                />

                {/* Divider */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Sign In Link */}
                <Button
                  title="Sign In to Existing Account"
                  onPress={() => navigation.goBack()}
                  variant="outline"
                  size="large"
                  fullWidth
                  icon="login"
                  style={styles.signInButton}
                />
              </View>
            </View>

            {/* Features */}
            <View style={styles.features}>
              <View style={styles.feature}>
                <MaterialCommunityIcons name="shield-check" size={20} color={COLORS.white} />
                <Text style={styles.featureText}>100% free, no credit card required</Text>
              </View>
              <View style={styles.feature}>
                <MaterialCommunityIcons name="cloud-sync" size={20} color={COLORS.white} />
                <Text style={styles.featureText}>Sync across all devices</Text>
              </View>
              <View style={styles.feature}>
                <MaterialCommunityIcons name="lock" size={20} color={COLORS.white} />
                <Text style={styles.featureText}>Your data is safe & private</Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary[600],
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING['2xl'],
    paddingBottom: SPACING['3xl'],
  },
  header: {
    alignItems: 'center',
    paddingTop: SPACING['3xl'],
    paddingBottom: SPACING['2xl'],
  },
  iconContainer: {
    marginBottom: SPACING.xl,
  },
  iconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white + '30',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.white + 'dd',
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS['3xl'],
    ...SHADOWS.xlarge,
    marginBottom: SPACING['2xl'],
  },
  formCardInner: {
    padding: SPACING['3xl'],
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.slate[50],
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.slate[200],
    paddingHorizontal: SPACING.lg,
  },
  inputIconContainer: {
    marginRight: SPACING.md,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.lg,
    fontSize: 16,
    color: COLORS.slate[900],
  },
  signUpButton: {
    marginTop: SPACING.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING['2xl'],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.slate[200],
  },
  dividerText: {
    marginHorizontal: SPACING.lg,
    color: COLORS.slate[400],
    fontSize: 14,
    fontWeight: '500',
  },
  signInButton: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.slate[300],
  },
  features: {
    marginTop: SPACING.lg,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  featureText: {
    marginLeft: SPACING.md,
    fontSize: 15,
    color: COLORS.white + 'ee',
    fontWeight: '500',
  },
});
