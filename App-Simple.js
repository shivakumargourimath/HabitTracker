// App-Simple.js - Working version without complex animations
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HabitProvider } from './context/HabitContext';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Home from './screens/Home';
import AddHabit from './screens/AddHabit';
import Stats from './screens/Stats';
import Settings from './screens/Settings';
import UpdateHabit from './screens/UpdateHabit';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Profile from './screens/Profile';
import HeaderProfileIcon from './components/HeaderProfileIcon';

const Stack = createNativeStackNavigator();

function MainStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: '#0ea5e9' },
        headerTintColor: '#fff',
        headerTranslucent: false,
        headerRight: () => <HeaderProfileIcon />,
      }}
    >
      <Stack.Screen name="Home" component={Home} options={{ title: 'Habit Tracker' }} />
      <Stack.Screen name="AddHabit" component={AddHabit} options={{ title: 'Add Habit' }} />
      <Stack.Screen name="UpdateHabit" component={UpdateHabit} options={{ title: 'Update Habit' }} />
      <Stack.Screen name="Stats" component={Stats} options={{ title: 'Statistics' }} />
      <Stack.Screen name="Settings" component={Settings} options={{ title: 'Settings' }} />
      <Stack.Screen name="Profile" component={Profile} options={{ title: 'Profile' }} />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
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
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AuthProvider>
        <PaperProvider>
          <ThemeProvider>
            <HabitProvider>
              <AppContent />
            </HabitProvider>
          </ThemeProvider>
        </PaperProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}