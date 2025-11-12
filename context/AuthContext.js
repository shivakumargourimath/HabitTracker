import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CryptoDigestAlgorithm, digestStringAsync } from 'expo-crypto';
import { initDB, signupUserDB, loginUserDB, updateUserDB } from '../database/database';
import { 
  validateEmail, 
  validatePasswordStrength, 
  validatePasswordMatch,
  validateName,
  sanitizeInput 
} from '../utils/validation';

const AuthContext = createContext();

// Hash password using SHA256 with salt
const hashPassword = async (password, salt = 'habit-tracker-salt-2024') => {
  try {
    const saltedPassword = salt + password + salt;
    return await digestStringAsync(CryptoDigestAlgorithm.SHA256, saltedPassword);
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Failed to secure password');
  }
};

// Generate authentication token
const generateAuthToken = async (userId, email) => {
  const tokenData = `${userId}-${email}-${Date.now()}`;
  return await digestStringAsync(CryptoDigestAlgorithm.SHA256, tokenData);
};

// Validate session
const isSessionValid = (user) => {
  if (!user || !user.sessionTimestamp) return false;
  
  const sessionAge = Date.now() - user.sessionTimestamp;
  const maxSessionAge = 30 * 24 * 60 * 60 * 1000; // 30 days
  
  return sessionAge < maxSessionAge;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Initialize DB and check for stored user on app start
    const init = async () => {
      try {
        await initDB();
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          
          // Validate session
          if (isSessionValid(parsedUser)) {
            setUser(parsedUser);
          } else {
            // Session expired, clear storage
            await AsyncStorage.removeItem('user');
            console.log('Session expired, user logged out');
          }
        }
      } catch (error) {
        console.error('Error initializing:', error);
        setAuthError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const signup = async (email, password, confirmPassword = null, name = null) => {
    try {
      setAuthError(null);
      
      // Validate email
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        return { success: false, error: emailValidation.error };
      }
      
      // Sanitize email
      const sanitizedEmail = sanitizeInput(emailValidation.value);
      
      // Validate password strength
      const passwordValidation = validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        return { success: false, error: passwordValidation.error };
      }
      
      // Validate password match if confirmPassword provided
      if (confirmPassword !== null) {
        const matchValidation = validatePasswordMatch(password, confirmPassword);
        if (!matchValidation.isValid) {
          return { success: false, error: matchValidation.error };
        }
      }
      
      // Validate and sanitize name if provided
      let sanitizedName = 'User';
      if (name) {
        const nameValidation = validateName(name, 'Name');
        if (!nameValidation.isValid) {
          return { success: false, error: nameValidation.error };
        }
        sanitizedName = sanitizeInput(nameValidation.value);
      }
      
      // Check if user already exists
      const existingUser = await AsyncStorage.getItem(`user_${sanitizedEmail}`);
      if (existingUser) {
        return { success: false, error: 'An account with this email already exists' };
      }
      
      // Hash password
      const hashedPassword = await hashPassword(password);
      
      // Generate user ID and auth token
      const userId = Date.now();
      const authToken = await generateAuthToken(userId, sanitizedEmail);
      
      // Create user data
      const userData = {
        id: userId,
        name: sanitizedName,
        email: sanitizedEmail,
        password: hashedPassword,
        avatar: null,
        authToken,
        sessionTimestamp: Date.now(),
        createdAt: new Date().toISOString(),
      };
      
      try {
        // Try to save to database
        const result = await signupUserDB(userData);
        if (result.insertId) {
          userData.id = result.insertId;
        }
      } catch (dbError) {
        console.log('Database unavailable, using local storage only:', dbError);
      }
      
      // Save to AsyncStorage (primary storage)
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem(`user_${sanitizedEmail}`, JSON.stringify(userData));
      
      setUser(userData);
      return { success: true, user: userData };
      
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.message || 'An error occurred during signup. Please try again.';
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const login = async (email, password) => {
    try {
      setAuthError(null);
      
      // Validate email
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        return { success: false, error: emailValidation.error };
      }
      
      // Sanitize email
      const sanitizedEmail = sanitizeInput(emailValidation.value);
      
      // Validate password is provided
      if (!password || !password.trim()) {
        return { success: false, error: 'Password is required' };
      }
      
      // Hash password
      const hashedPassword = await hashPassword(password);
      
      // Try to get user from AsyncStorage first (primary storage)
      const storedUser = await AsyncStorage.getItem(`user_${sanitizedEmail}`);
      
      if (storedUser) {
        const user = JSON.parse(storedUser);
        
        // Verify password
        if (user.password === hashedPassword) {
          // Update session
          const updatedUser = {
            ...user,
            sessionTimestamp: Date.now(),
            lastLoginAt: new Date().toISOString(),
          };
          
          setUser(updatedUser);
          await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
          await AsyncStorage.setItem(`user_${sanitizedEmail}`, JSON.stringify(updatedUser));
          
          return { success: true, user: updatedUser };
        } else {
          return { success: false, error: 'Invalid email or password' };
        }
      }
      
      // Try database as fallback
      try {
        const userData = await loginUserDB(sanitizedEmail, hashedPassword);
        if (userData) {
          const updatedUser = {
            ...userData,
            sessionTimestamp: Date.now(),
            lastLoginAt: new Date().toISOString(),
          };
          
          setUser(updatedUser);
          await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
          await AsyncStorage.setItem(`user_${sanitizedEmail}`, JSON.stringify(updatedUser));
          
          return { success: true, user: updatedUser };
        }
      } catch (dbError) {
        console.log('Database not available:', dbError);
      }
      
      return { success: false, error: 'Invalid email or password' };
      
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'An error occurred during login. Please try again.';
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setAuthError(null);
      // Remove current session but keep user data for re-login
      await AsyncStorage.removeItem('user');
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (updatedData) => {
    try {
      setAuthError(null);
      
      // Validate name if provided
      if (updatedData.name) {
        const nameValidation = validateName(updatedData.name, 'Name');
        if (!nameValidation.isValid) {
          return { success: false, error: nameValidation.error };
        }
        updatedData.name = sanitizeInput(nameValidation.value);
      }
      
      // Create updated user object
      const newUser = { 
        ...user, 
        ...updatedData,
        updatedAt: new Date().toISOString(),
      };
      
      try {
        // Try to update in database
        await updateUserDB(user.id, updatedData);
      } catch (dbError) {
        console.log('Database unavailable, updating local storage only:', dbError);
      }
      
      // Update AsyncStorage
      setUser(newUser);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      await AsyncStorage.setItem(`user_${user.email}`, JSON.stringify(newUser));
      
      return { success: true, user: newUser };
      
    } catch (error) {
      console.error('Update profile error:', error);
      const errorMessage = error.message || 'Failed to update profile';
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };
  
  const changePassword = async (currentPassword, newPassword, confirmNewPassword) => {
    try {
      setAuthError(null);
      
      if (!user) {
        return { success: false, error: 'No user logged in' };
      }
      
      // Validate current password
      const hashedCurrentPassword = await hashPassword(currentPassword);
      if (user.password !== hashedCurrentPassword) {
        return { success: false, error: 'Current password is incorrect' };
      }
      
      // Validate new password
      const passwordValidation = validatePasswordStrength(newPassword);
      if (!passwordValidation.isValid) {
        return { success: false, error: passwordValidation.error };
      }
      
      // Validate password match
      const matchValidation = validatePasswordMatch(newPassword, confirmNewPassword);
      if (!matchValidation.isValid) {
        return { success: false, error: matchValidation.error };
      }
      
      // Hash new password
      const hashedNewPassword = await hashPassword(newPassword);
      
      // Update user
      const updatedUser = {
        ...user,
        password: hashedNewPassword,
        passwordChangedAt: new Date().toISOString(),
      };
      
      try {
        await updateUserDB(user.id, { password: hashedNewPassword });
      } catch (dbError) {
        console.log('Database unavailable, updating local storage only:', dbError);
      }
      
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      await AsyncStorage.setItem(`user_${user.email}`, JSON.stringify(updatedUser));
      
      return { success: true };
      
    } catch (error) {
      console.error('Change password error:', error);
      const errorMessage = error.message || 'Failed to change password';
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      authError,
      signup, 
      login, 
      logout, 
      updateProfile,
      changePassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);