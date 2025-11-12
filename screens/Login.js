import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const theme = useTheme();

  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await login(email, password);
      if (!result.success) {
        Alert.alert('Login Failed', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={{
            paddingHorizontal: theme.spacing[6],
            paddingTop: theme.spacing[12],
            paddingBottom: theme.spacing[8],
            alignItems: 'center',
          }}>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: theme.colors.primary,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: theme.spacing[6],
              ...theme.shadows.lg,
            }}>
              <MaterialCommunityIcons
                name="account-circle"
                size={40}
                color="#ffffff"
              />
            </View>
            
            <Text style={{
              fontSize: theme.fontSizes['4xl'],
              fontWeight: theme.fontWeights.bold,
              color: theme.colors.text,
              marginBottom: theme.spacing[2],
              textAlign: 'center',
            }}>
              Welcome Back
            </Text>
            
            <Text style={{
              fontSize: theme.fontSizes.base,
              color: theme.colors.textSecondary,
              textAlign: 'center',
              lineHeight: 24,
            }}>
              Sign in to continue building your habits
            </Text>
          </View>

          {/* Form */}
          <View style={{
            paddingHorizontal: theme.spacing[6],
            flex: 1,
          }}>
            <Input
              label="Email Address"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) {
                  setErrors(prev => ({ ...prev, email: '' }));
                }
              }}
              leftIcon="email-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              style={{ marginBottom: theme.spacing[2] }}
            />

            <Input
              label="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) {
                  setErrors(prev => ({ ...prev, password: '' }));
                }
              }}
              leftIcon="lock-outline"
              secureTextEntry
              error={errors.password}
              style={{ marginBottom: theme.spacing[6] }}
            />

            <Button
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              size="large"
              style={{ marginBottom: theme.spacing[6] }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            {/* Footer */}
            <View style={{
              alignItems: 'center',
              paddingBottom: theme.spacing[8],
            }}>
              <Text style={{
                fontSize: theme.fontSizes.base,
                color: theme.colors.textSecondary,
                marginBottom: theme.spacing[2],
              }}>
                Don't have an account?
              </Text>
              
              <Button
                variant="ghost"
                onPress={() => {
                  navigation.navigate('Signup');
                }}
              >
                Create Account
              </Button>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
