// mobile/src/components/AuthForm.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { colors } from '../styles/commonStyles';

const AuthForm = ({ isLogin, onSubmit, onToggleMode }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstname: '',
    lastname: '',
    email: '',
    role: '',
    club: '',
  });

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarContainer}>
          <Image 
            source={require('../assets/images/user_icon.png')} 
            style={styles.avatar} 
          />
          <Text style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
        </View>

        {/* Register Form Fields */}
        {!isLogin && (
          <>
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.inputHalf}
                placeholder="First Name"
                placeholderTextColor={colors.placeholderText}
                value={formData.firstname}
                onChangeText={(text) => handleChange('firstname', text)}
              />
              <TextInput
                style={styles.inputHalf}
                placeholder="Last Name"
                placeholderTextColor={colors.placeholderText}
                value={formData.lastname}
                onChangeText={(text) => handleChange('lastname', text)}
              />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={colors.placeholderText}
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
            />
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.inputHalf}
                placeholder="Role"
                placeholderTextColor={colors.placeholderText}
                value={formData.role}
                onChangeText={(text) => handleChange('role', text)}
              />
              <TextInput
                style={styles.inputHalf}
                placeholder="Club"
                placeholderTextColor={colors.placeholderText}
                value={formData.club}
                onChangeText={(text) => handleChange('club', text)}
              />
            </View>
          </>
        )}

        {/* Login Form Fields */}
        {isLogin && (
          <>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor={colors.placeholderText}
              autoCapitalize="none"
              value={formData.username}
              onChangeText={(text) => handleChange('username', text)}
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={colors.placeholderText}
              secureTextEntry
              value={formData.password}
              onChangeText={(text) => handleChange('password', text)}
            />
          </>
        )}

        {/* Common fields for both forms */}
        {!isLogin && (
          <>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor={colors.placeholderText}
              autoCapitalize="none"
              value={formData.username}
              onChangeText={(text) => handleChange('username', text)}
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={colors.placeholderText}
              secureTextEntry
              value={formData.password}
              onChangeText={(text) => handleChange('password', text)}
            />
          </>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.switchButton} 
            onPress={onToggleMode}
          >
            <Text style={styles.switchButtonText}>
              {isLogin ? 'Create Account' : 'Back to Login'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>
              {isLogin ? 'Log In' : 'Sign Up'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
    marginBottom: 20,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#00E1FF',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#000',
  },
  inputGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  inputHalf: {
    width: '48%',
    height: 50,
    backgroundColor: '#00E1FF',
    borderRadius: 5,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  switchButton: {
    flex: 1,
    backgroundColor: '#00E1FF',
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  switchButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#00E1FF',
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  submitButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AuthForm;