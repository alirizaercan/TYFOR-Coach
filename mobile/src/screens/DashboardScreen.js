import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { colors, commonStyles } from '../styles/commonStyles';
import { getCurrentUser, logoutUser } from '../services/auth';

const DashboardScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  const handleLogout = async () => {
    // On web, show window.confirm; on native, use Alert.alert
    const confirmed =
      Platform.OS === 'web'
        ? window.confirm('Are you sure you want to logout?')
        : await new Promise(resolve =>
            Alert.alert(
              'Logout',
              'Are you sure you want to logout?',
              [
                { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
                { text: 'Logout', onPress: () => resolve(true) },
              ],
              { cancelable: false }
            )
          );
  
    if (!confirmed) return;
  
    try {
      setLoading(true);
      console.log('Logout confirmed');
  
      // Token kontrolü
      const token = await AsyncStorage.getItem('token');
      console.log('Current token:', token);
  
      // Storage temizleme
      await AsyncStorage.multiRemove(['token', 'user']);
      console.log('Storage cleared');
  
      // Logout API çağrısı
      const result = await logoutUser();
      console.log('Logout API result:', result);
  
      // Navigation - FIXED: Navigate to Login screen directly instead of using reset
      // Since we're inside the Auth navigator stack, we need to use CommonActions.navigate
      navigation.navigate('Auth', { screen: 'Login' });
      console.log('Navigation completed');
    } catch (error) {
      console.error('Logout error details:', error);
      // Even if there's an error, try to navigate back to login
      navigation.navigate('Auth', { screen: 'Login' });
    } finally {
      setLoading(false);
    }
  };

  const navigateTo = (screenName) => {
    navigation.navigate(screenName);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>IQAS Coach</Text>
          <TouchableOpacity 
            onPress={handleLogout} 
            style={styles.logoutButton}
            activeOpacity={0.7}
          >
            <MaterialIcons name="logout" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
  
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeSubtext}>Welcome back,</Text>
        <Text style={styles.nameText}>{user?.firstname} {user?.lastname}</Text>
        <Text style={styles.roleText}>{user?.role} • {user?.club}</Text>
      </View>
  
      <ScrollView style={styles.contentContainer}>
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Development Areas</Text>
  
          <View style={styles.categoriesGrid}>
            {/* Player Development Card */}
            <TouchableOpacity
              style={styles.categoryItem}
              onPress={() => navigateTo('DevelopmentHome')}
              activeOpacity={0.85}
            >
              <View style={styles.categoryContent}>
                <Image 
                  source={require('../assets/images/youth_development_icon.png')}
                  style={styles.categoryIcon}
                />
                <Text style={styles.categoryTitle}>Player Development</Text>
                <Text style={styles.categoryDescription}>
                  Physical • Conditional • Endurance
                </Text>
              </View>
              <View style={styles.categoryArrow}>
                <AntDesign name="arrowright" size={20} color={colors.primary} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.background,
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 225, 255, 0.2)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(64, 65, 148, 0.3)',
  },
  welcomeSection: {
    backgroundColor: 'rgba(0, 225, 255, 0.05)',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 225, 255, 0.1)',
  },
  welcomeSubtext: {
    fontSize: 14,
    color: 'rgba(0, 225, 255, 0.8)',
    marginBottom: 5,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  roleText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  contentContainer: {
    flex: 1,
  },
  categoriesSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  categoriesGrid: {
    marginTop: 10,
  },
  categoryItem: {
    backgroundColor: 'rgba(64, 65, 148, 0.5)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  categoryContent: {
    flex: 1,
  },
  categoryIcon: {
    width: 42,
    height: 42,
    marginBottom: 12,
    tintColor: colors.primary,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
  },
  categoryDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },
  categoryArrow: {
    padding: 8,
    backgroundColor: 'rgba(0, 225, 255, 0.1)',
    borderRadius: 8,
  },
});

export default DashboardScreen;