// mobile/src/screens/Auth/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import AuthForm from '../../components/AuthForm';
import { loginUser } from '../../services/auth';
import { colors } from '../../styles/commonStyles';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  
  // Add this function
  const handleToggleMode = () => {
    navigation.navigate('Register');
  };
  
  const handleLogin = async (formData) => {
    if (!formData.username || !formData.password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }
    
    setLoading(true);
    try {
      const result = await loginUser(formData.username, formData.password);
      console.log('Login result:', result); // Debug satırı
      
      if (result.success) {
        // FIXED: Instead of reset, use dispatch to navigate the right way
        navigation.dispatch(
          CommonActions.navigate({
            name: 'Dashboard',
          })
        );
      } else {
        Alert.alert('Login Failed', result.message || 'Please check your credentials');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/IQAS_auth.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.formContainer}>
        <View style={styles.logoOverlayContainer}>
          <Image
            source={require('../../assets/images/IQAS_logo_circle.png')}
            style={styles.logoOverlay}
            resizeMode="contain"
          />
        </View>
        
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <AuthForm 
            isLogin={true}
            onSubmit={handleLogin}
            onToggleMode={handleToggleMode} // Add this prop
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#110555',
  },
  logoContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: '100%',
    height: '60%',
    maxHeight: 200,
  },
  formContainer: {
    flex: 3,
    backgroundColor: '#404194',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 60,
    position: 'relative',
  },
  logoOverlayContainer: {
    position: 'absolute',
    top: -50,
    alignSelf: 'center',
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  logoOverlay: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
});

export default LoginScreen;