import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LogBox, Platform } from 'react-native';
import 'react-native-gesture-handler';

// Navigators
import AppNavigator from './src/navigation/AppNavigator';

// Ignore specific warnings (optional)
LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'AsyncStorage has been extracted from react-native'
]);

// Web-specific CSS injection for scrolling fixes
const injectWebCSS = () => {
  if (Platform.OS === 'web') {
    const style = document.createElement('style');
    style.textContent = `
      /* Ensure ScrollView works properly on web */
      div[style*="overflow-x: hidden"], 
      div[style*="overflow-y: hidden"] {
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch;
      }
      
      /* Fix for React Native Web ScrollView */
      div[data-focusable="true"] {
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch;
      }
      
      /* Ensure proper scrolling for containers */
      div[style*="flex: 1"] {
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }
    `;
    document.head.appendChild(style);
  }
};

export default function App() {
  useEffect(() => {
    // Inject web-specific CSS for scrolling fixes
    injectWebCSS();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}