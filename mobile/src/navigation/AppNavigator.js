// mobile/src/navigation/AppNavigator.js
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Navigators
import AuthNavigator from './AuthNavigator';

// Screens
import DashboardScreen from '../screens/DashboardScreen';
import DevelopmentHomeScreen from '../screens/Development/DevelopmentHomeScreen';
import PhysicalDevelopmentScreen from '../screens/Development/PhysicalDevelopmentScreen';
import ConditionalDevelopmentScreen from '../screens/Development/ConditionalDevelopmentScreen';
import EnduranceDevelopmentScreen from '../screens/Development/EnduranceDevelopmentScreen';

// Services
import { verifyToken } from '../services/auth';
import { colors } from '../styles/commonStyles';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const tokenResult = await verifyToken();
          setUserToken(tokenResult.valid ? token : null);
        } else {
          setUserToken(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUserToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // IMPORTANT: Create a listener to update authentication state when it changes
  const onStateChange = (state) => {
    // Check AsyncStorage token on each navigation state change
    const checkAuthState = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token !== userToken) {
        setUserToken(token);
      }
    };
    
    checkAuthState();
  };

  return (
    <NavigationContainer onStateChange={onStateChange}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        {userToken == null ? (
          // Auth screens
          <Stack.Screen 
            name="Auth"
            component={AuthNavigator}
            options={{ animationEnabled: false }}
          />
        ) : (
          // App screens
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="DevelopmentHome" component={DevelopmentHomeScreen} />
            <Stack.Screen name="PhysicalDevelopment" component={PhysicalDevelopmentScreen} />
            <Stack.Screen name="ConditionalDevelopment" component={ConditionalDevelopmentScreen} />
            <Stack.Screen name="EnduranceDevelopment" component={EnduranceDevelopmentScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

export default AppNavigator;