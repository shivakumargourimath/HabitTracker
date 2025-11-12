import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { COLORS, SHADOWS, RADIUS, SPACING } from '../constants/colors';
import { validateEmail } from '../utils/validation';

export default function LoginProduction({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    
    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
    }
    
    // Validate password
    if (!password || !password.trim()) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    // Clear previous errors
    setErrors({});
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      if (!result.success) {
        // Show error message
        setErrors({ general: result.error || 'Login failed. Please try again.' });
      }
      // If successful, navigation happens automatically via AuthContext
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };
  
  const handleEmailChange = (text) => {
    setEmail(text);
    // Clear email error when user starts typing
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
  };
  
  const handlePasswordChange = (text) => {
    setPassword(text);
    // Clear password error when user starts typing
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: undefined }));
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={COLORS.gradients.primary}
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
                  <MaterialCommunityIcons name="target" size={56} color={COLORS.white} />
                </LinearGradient>
              </View>
              <Text style={styles.title}>Welcome Back!</Text>
              <Text style={styles.subtitle}>Sign in to continue your habit journey</Text>
            </View>

            {/* Form Card */}
            <View style={styles.formCard}>
              <View style={styles.formCardInner}>
                {/* General Error */}
                {errors.general && (
                  <View style={styles.errorContainer}>
                    <MaterialCommunityIcons name="alert-circle" size={20} color={COLORS.error[600]} />
                    <Text style={styles.errorText}>{errors.general}</Text>
                  </View>
                )}

                {/* Email Input */}
                <View style={[styles.inputGroup, errors.email && styles.inputGroupError]}>
                  <View style={styles.inputIconContainer}>
                    <MaterialCommunityIcons 
                      name="email-outline" 
                      size={20} 
                      color={errors.email ? COLORS.error[600] : COLORS.slate[400]} 
                    />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Email address"
                    placeholderTextColor={COLORS.slate[400]}
                    value={email}
                    onChangeText={handleEmailChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {errors.email && (
                  <Text style={styles.fieldErrorText}>{errors.email}</Text>
                )}

                {/* Password Input */}
                <View style={[styles.inputGroup, errors.password && styles.inputGroupError]}>
                  <View style={styles.inputIconContainer}>
                    <MaterialCommunityIcons 
                      name="lock-outline" 
                      size={20} 
                      color={errors.password ? COLORS.error[600] : COLORS.slate[400]} 
                    />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={COLORS.slate[400]}
                    value={password}
                    onChangeText={handlePasswordChange}
                    secureTextEntry={!showPassword}
                    autoCorrect={false}
                  />
                  <Button
                    variant="ghost"
                    size="small"
                    icon={showPassword ? "eye-off-outline" : "eye-outline"}
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.passwordToggle}
                  />
                </View>
                {errors.password && (
                  <Text style={styles.fieldErrorText}>{errors.password}</Text>
                )}

                {/* Sign In Button */}
                <Button
                  title={loading ? 'Signing In...' : 'Sign In'}
                  onPress={handleLogin}
                  disabled={loading}
                  loading={loading}
                  gradient={true}
                  size="large"
                  fullWidth
                  icon="login"
                  style={styles.signInButton}
                />

                {/* Divider */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Sign Up Link */}
                <Button
                  title="Create New Account"
                  onPress={() => navigation.navigate('Signup')}
                  variant="outline"
                  size="large"
                  fullWidth
                  icon="account-plus"
                  style={styles.signUpButton}
                />
              </View>
            </View>

            {/* Features */}
            <View style={styles.features}>
              <View style={styles.feature}>
                <MaterialCommunityIcons name="check-circle" size={20} color={COLORS.white} />
                <Text style={styles.featureText}>Track your daily habits</Text>
              </View>
              <View style={styles.feature}>
                <MaterialCommunityIcons name="chart-line" size={20} color={COLORS.white} />
                <Text style={styles.featureText}>Build lasting streaks</Text>
              </View>
              <View style={styles.feature}>
                <MaterialCommunityIcons name="trophy" size={20} color={COLORS.white} />
                <Text style={styles.featureText}>Achieve your goals</Text>
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
    paddingTop: SPACING['4xl'],
    paddingBottom: SPACING['3xl'],
  },
  iconContainer: {
    marginBottom: SPACING['2xl'],
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
    marginBottom: SPACING['3xl'],
  },
  formCardInner: {
    padding: SPACING['3xl'],
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.slate[50],
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.sm,
    borderWidth: 2,
    borderColor: COLORS.slate[200],
    paddingHorizontal: SPACING.lg,
  },
  inputGroupError: {
    borderColor: COLORS.error[500],
    backgroundColor: COLORS.error[50],
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
  signInButton: {
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
  signUpButton: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.slate[300],
  },
  features: {
    marginTop: SPACING.xl,
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
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.error[50],
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error[600],
  },
  errorText: {
    flex: 1,
    marginLeft: SPACING.sm,
    color: COLORS.error[700],
    fontSize: 14,
    fontWeight: '500',
  },
  fieldErrorText: {
    color: COLORS.error[600],
    fontSize: 12,
    marginTop: -SPACING.sm,
    marginBottom: SPACING.md,
    marginLeft: SPACING.xs,
  },
  passwordToggle: {
    marginLeft: SPACING.sm,
  },
});
