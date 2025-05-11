import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LogBox } from 'react-native';
import 'react-native-gesture-handler';

// Navigators
import AppNavigator from './src/navigation/AppNavigator';

// Ignore specific warnings (optional)
LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'AsyncStorage has been extracted from react-native'
]);

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}