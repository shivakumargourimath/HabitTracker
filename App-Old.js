import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import Home from './screens/Home';
import AddHabit from './screens/AddHabit-Simple';
import { HabitProvider } from './context/HabitContext';
import Stats from './screens/Stats';
import Settings from './screens/Settings';
import UpdateHabit from './screens/UpdateHabit';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Profile from './screens/Profile';
import Calendar from './screens/Calendar';
import Achievements from './screens/Achievements';
import HeaderProfileIcon from './components/HeaderProfileIcon';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const Stack = createNativeStackNavigator();

function MainStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: '#121212' },
        headerTintColor: '#fff',
        headerTranslucent: true,
        headerRight: () => <HeaderProfileIcon />,
      }}
    >
      <Stack.Screen name="UpdateHabit" component={UpdateHabit} options={{ title: 'Update Habit' }} />
      <Stack.Screen name="Settings" component={Settings} options={{ title: 'Settings' }} />
      <Stack.Screen name="Stats" component={Stats} options={{ title: 'Stats' }} />
      <Stack.Screen name="Calendar" component={Calendar} options={{ title: 'Calendar' }} />
      <Stack.Screen name="Achievements" component={Achievements} options={{ title: 'Achievements' }} />
      <Stack.Screen name="Home" component={Home} options={{ title: 'Habit Tracker' }} />
      <Stack.Screen name="AddHabit" component={AddHabit} options={{ title: 'Add Habit' }} />
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
      <StatusBar style="auto" translucent />
      <AuthProvider>
        <PaperProvider>
          <ThemeProvider>
            <HabitProvider>
              <AppContent />
              <Toast />
            </HabitProvider>
          </ThemeProvider>
        </PaperProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
