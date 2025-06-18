// mobile/src/navigation/AppNavigator.js
import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Contexts
import { AuthProvider, useAuth } from '../contexts/AuthContext';

// Navigators
import AuthNavigator from './AuthNavigator';

// Screens
import DashboardScreen from '../screens/DashboardScreen';
import DevelopmentHomeScreen from '../screens/Development/DevelopmentHomeScreen';
import PhysicalDevelopmentScreen from '../screens/Development/PhysicalDevelopmentScreen';
import ConditionalDevelopmentScreen from '../screens/Development/ConditionalDevelopmentScreen';
import EnduranceDevelopmentScreen from '../screens/Development/EnduranceDevelopmentScreen';

// Services
import { colors } from '../styles/commonStyles';

const Stack = createStackNavigator();

const AppStack = () => {
  const { userToken, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
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

const AppNavigator = () => {
  return (
    <AuthProvider>
      <AppStack />
    </AuthProvider>
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