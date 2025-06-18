// mobile/src/screens/Auth/LoginScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  Platform,
  Animated,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import AuthForm from '../../components/AuthForm';
import { loginUser } from '../../services/auth';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../styles/commonStyles';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
  const navigation = useNavigation();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);
  const scaleAnim = new Animated.Value(0.8);
  const logoRotateAnim = new Animated.Value(0);

  useEffect(() => {
    // Start entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Subtle logo pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(logoRotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotateAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();
  }, []);

  const handleLogin = async (formData) => {
    if (!formData.username || !formData.password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }
    
    setLoading(true);
    try {
      const result = await loginUser(formData.username, formData.password);
      console.log('Login result:', result);
      
      if (result.success) {
        // Auth context'e giriş yapıldığını bildir
        await signIn();
        Alert.alert('Success', 'Login successful!');
      } else {
        Alert.alert('Login Failed', result.message || 'Please check your credentials');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };    return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0A0344" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <LinearGradient
          colors={['#0A0344', '#110555', '#1a0866', '#2c1075']}
          style={styles.container}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >          <SafeAreaView style={styles.safeArea}>            <ScrollView 
              contentContainerStyle={[
                styles.scrollContainer,
                Platform.OS === 'web' && { minHeight: '100vh' }
              ]}
              showsVerticalScrollIndicator={Platform.OS === 'web'}
              keyboardShouldPersistTaps="handled"
              bounces={false}
              overScrollMode="never"
              nestedScrollEnabled={true}
              scrollEnabled={true}
              style={[
                { flex: 1 },
                Platform.OS === 'web' && {
                  overflow: 'auto',
                  WebkitOverflowScrolling: 'touch'
                }
              ]}
            >
              {/* Header Section with Logo Animation */}
              <Animated.View 
                style={[
                  styles.headerSection,
                  {
                    opacity: fadeAnim,
                    transform: [
                      { translateY: slideAnim },
                      { scale: scaleAnim }
                    ]
                  }
                ]}
              >
                <View style={styles.logoAnimationContainer}>
                  <Animated.Image
                    source={require('../../assets/images/TYFOR_auth.gif')}
                    style={[
                      styles.mainLogo,
                      {
                        transform: [{
                          rotate: logoRotateAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '360deg']
                          })
                        }]
                      }
                    ]}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.welcomeText}>Welcome Back</Text>
                <Text style={styles.subtitleText}>Sign in to continue your training journey</Text>
                
                {/* Floating decorative elements */}
                <View style={styles.decorativeElements}>
                  <Animated.View style={[styles.floatingDot, styles.dot1]} />
                  <Animated.View style={[styles.floatingDot, styles.dot2]} />
                  <Animated.View style={[styles.floatingDot, styles.dot3]} />
                </View>
              </Animated.View>

              {/* Form Section */}
              <Animated.View 
                style={[
                  styles.formSection,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                  }
                ]}
              >
                {/* Floating Logo Circle */}
                <View style={styles.floatingLogoContainer}>
                  <LinearGradient
                    colors={['#ffffff', '#f8f9ff', '#e8efff']}
                    style={styles.floatingLogoGradient}
                  >
                    <Image
                      source={require('../../assets/images/TYFOR_logo_circle.png')}
                      style={styles.floatingLogo}
                      resizeMode="contain"
                    />
                  </LinearGradient>
                </View>

                {/* Form Content */}
                <View style={styles.formContent}>
                  {loading ? (
                    <View style={styles.loadingContainer}>
                      <View style={styles.loadingSpinner}>
                        <ActivityIndicator size="large" color="#4A90E2" />
                      </View>
                      <Text style={styles.loadingText}>Signing you in...</Text>
                      <Text style={styles.loadingSubtext}>Please wait a moment</Text>
                    </View>
                  ) : (
                    <>
                      <Text style={styles.formTitle}>Sign In</Text>
                      <Text style={styles.formSubtitle}>Enter your credentials to access your account</Text>
                      <AuthForm onSubmit={handleLogin} />
                    </>
                  )}
                </View>
              </Animated.View>

              {/* Footer Section */}
              <Animated.View 
                style={[
                  styles.footerSection,
                  { opacity: fadeAnim }
                ]}
              >
                <View style={styles.footerContent}>
                  <Ionicons name="shield-checkmark" size={16} color="#B8C7E0" />
                  <Text style={styles.footerText}>
                    Secured by <Text style={styles.brandText}>TYFOR</Text> Training System
                  </Text>
                </View>
              </Animated.View>
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({  container: {
    flex: 1,
    ...(Platform.OS === 'web' && {
      minHeight: '100vh',
      overflow: 'auto',
    }),
  },  safeArea: {
    flex: 1,
    ...(Platform.OS === 'web' && {
      height: '100%',
    }),
  },  scrollContainer: {
    flexGrow: 1,
    minHeight: height,
    justifyContent: 'space-between',
    paddingBottom: Platform.OS === 'ios' ? 20 : 30,
  },
  // Header Section Styles
  headerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: Platform.OS === 'ios' ? 50 : 70,
    paddingBottom: 30,
  },
  logoAnimationContainer: {
    width: width * 0.5,
    height: height * 0.12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  mainLogo: {
    width: '100%',
    height: '100%',
  },
  welcomeText: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitleText: {
    fontSize: 17,
    color: '#E1E9F4',
    textAlign: 'center',
    fontWeight: '400',
    opacity: 0.95,
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  decorativeElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  floatingDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dot1: {
    top: '20%',
    left: '15%',
  },
  dot2: {
    top: '60%',
    right: '20%',
  },
  dot3: {
    bottom: '30%',
    left: '10%',
  },
  
  // Form Section Styles
  formSection: {
    flex: 2,
    position: 'relative',
    marginTop: 20,
  },
  floatingLogoContainer: {
    position: 'absolute',
    top: -40,
    alignSelf: 'center',
    zIndex: 10,
    elevation: 10,
  },
  floatingLogoGradient: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 20,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  floatingLogo: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
  },  formContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 40,
    minHeight: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 25,
  },
  formTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1A202C',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },  formSubtitle: {
    fontSize: 15,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
    fontWeight: '400',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingSpinner: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#4A90E2',
    fontWeight: '600',
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#718096',
    fontWeight: '400',
  },
    // Footer Section Styles
  footerSection: {
    paddingVertical: 30,
    paddingHorizontal: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.9,
  },
  footerText: {
    fontSize: 14,
    color: '#E1E9F4',
    textAlign: 'center',
    marginLeft: 8,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  brandText: {
    fontWeight: '700',
    color: '#64B5F6',
    textShadowColor: 'rgba(100, 181, 246, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default LoginScreen;
