import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HabitProvider } from './context/HabitContext';
import { View, ActivityIndicator, StyleSheet, StatusBar as RNStatusBar, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import HomeProduction from './screens/Home-Modern';
import AddHabitProduction from './screens/AddHabit-Simple-Final';
import UpdateHabitProduction from './screens/UpdateHabit-Simple-Final';
import StatsProduction from './screens/Stats-Enhanced';
import SettingsProduction from './screens/Settings-Production';
import LoginProduction from './screens/Login-Production';
import SignupProduction from './screens/Signup-Production';
import ProfileProduction from './screens/Profile-Enhanced';
import HabitDetail from './screens/HabitDetail';
import HabitInsights from './screens/HabitInsights';

const Stack = createNativeStackNavigator();

function MainStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeProduction} 
        options={{ title: '🎯 Habit Tracker' }} 
      />
      <Stack.Screen 
        name="AddHabit" 
        component={AddHabitProduction} 
        options={{ title: 'Add New Habit' }} 
      />
      <Stack.Screen 
        name="UpdateHabit" 
        component={UpdateHabitProduction} 
        options={{ title: 'Edit Habit' }} 
      />
      <Stack.Screen 
        name="Stats" 
        component={StatsProduction} 
        options={{ title: 'Statistics' }} 
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsProduction} 
        options={{ title: 'Settings' }} 
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileProduction} 
        options={{ title: 'Profile' }} 
      />
      <Stack.Screen 
        name="HabitDetail" 
        component={HabitDetail} 
        options={{ title: 'Habit Details' }} 
      />
      <Stack.Screen 
        name="HabitInsights" 
        component={HabitInsights} 
        options={{ title: 'Habit Insights' }} 
      />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginProduction} />
      <Stack.Screen name="Signup" component={SignupProduction} />
    </Stack.Navigator>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  // Configure Android status bar
  React.useEffect(() => {
    if (Platform.OS === 'android') {
      RNStatusBar.setBackgroundColor('#667eea');
      RNStatusBar.setBarStyle('light-content');
      RNStatusBar.setTranslucent(false);
    }
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#667eea" translucent={false} />
      <AuthProvider>
        <ThemeProvider>
          <HabitProvider>
            <AppContent />
          </HabitProvider>
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});