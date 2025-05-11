// mobile/src/screens/Auth/RegisterScreen.js
import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Image, 
  SafeAreaView, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AuthForm from '../../components/AuthForm';
import { registerUser } from '../../services/auth';
import { colors } from '../../styles/commonStyles';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (formData) => {
    // Form validation
    if (!formData.username || !formData.password || !formData.email || 
        !formData.firstname || !formData.lastname || !formData.role || !formData.club) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const result = await registerUser(formData);
      if (result.success) {
        Alert.alert(
          'Registration Successful',
          'Your account has been created successfully.',
          [{ text: 'OK', onPress: () => navigation.reset({
            index: 0,
            routes: [{ name: 'Dashboard' }],
          })}]
        );
      } else {
        Alert.alert('Registration Failed', result.message || 'Please try again with different credentials');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMode = () => {
    navigation.navigate('Login');
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
            isLogin={false} 
            onSubmit={handleRegister} 
            onToggleMode={handleToggleMode} 
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: '100%',
    height: '60%',
    maxHeight: 150,
  },
  formContainer: {
    flex: 4,
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

export default RegisterScreen;