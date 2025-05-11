// mobile/src/services/auth.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_ENDPOINTS } from '../constants/api';
import { post, get } from './api';

// Login user and store token
export const loginUser = async (username, password) => {
  try {
    const response = await post(AUTH_ENDPOINTS.LOGIN, { username, password });
    
    if (response && response.user && response.user.token) {
      // Store user data and token
      await AsyncStorage.setItem('token', response.user.token);
      await AsyncStorage.setItem('user', JSON.stringify({
        id: response.user.id,
        username: response.user.username,
        role: response.user.role,
        club: response.user.club,
        email: response.user.email,
        firstname: response.user.firstname,
        lastname: response.user.lastname
      }));
      
      return {
        success: true,
        user: response.user
      };
    }
    
    return {
      success: false,
      message: response.message || 'Login failed'
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false, 
      message: error.message || 'Login failed'
    };
  }
};

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await post(AUTH_ENDPOINTS.REGISTER, userData);
    
    if (response && response.user && response.user.token) {
      // Store user data and token
      await AsyncStorage.setItem('token', response.user.token);
      await AsyncStorage.setItem('user', JSON.stringify({
        id: response.user.id,
        username: response.user.username,
        role: response.user.role,
        club: response.user.club,
        email: response.user.email,
        firstname: response.user.firstname,
        lastname: response.user.lastname
      }));
      
      return {
        success: true,
        user: response.user
      };
    }
    
    return {
      success: false,
      message: response.message || 'Registration failed'
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: error.message || 'Registration failed'
    };
  }
};

// Get current user profile
export const getUserProfile = async () => {
  try {
    const response = await get(AUTH_ENDPOINTS.PROFILE);
    return {
      success: true,
      user: response.user
    };
  } catch (error) {
    console.error('Get profile error:', error);
    return {
      success: false,
      message: error.message
    };
  }
};

// Logout user and clear storage
export const logoutUser = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      try {
        // Try to call logout endpoint
        await post(AUTH_ENDPOINTS.LOGOUT);
      } catch (apiError) {
        console.warn('Logout API call failed:', apiError);
        // Continue with local cleanup even if API call fails
      }
    }

    // Clear all auth-related data from storage
    const keysToRemove = ['token', 'user'];
    await AsyncStorage.multiRemove(keysToRemove);

    return {
      success: true,
      message: 'Logged out successfully'
    };
  } catch (error) {
    console.error('Logout error:', error);
    
    // Attempt to clear storage even if there was an error
    try {
      await AsyncStorage.multiRemove(['token', 'user']);
    } catch (storageError) {
      console.error('Failed to clear storage:', storageError);
    }

    return {
      success: false,
      message: 'Failed to logout properly, please restart the app'
    };
  }
};

// Verify if the stored token is valid
export const verifyToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      return { valid: false };
    }
    
    const response = await get(AUTH_ENDPOINTS.VERIFY_TOKEN);
    return { valid: true, user: response.user };
  } catch (error) {
    console.error('Token verification error:', error);
    return { valid: false, message: error.message };
  }
};

// Check if user is authenticated
export const isAuthenticated = async () => {
  const token = await AsyncStorage.getItem('token');
  return !!token;
};

// Get the current user data from storage
export const getCurrentUser = async () => {
  try {
    const userJson = await AsyncStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};