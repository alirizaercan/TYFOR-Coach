// mobile/src/services/auth.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_ENDPOINTS } from '../constants/api';
import { post, get } from './api';

// Login user and store token
export const loginUser = async (username, password) => {
  try {
    const response = await post(AUTH_ENDPOINTS.LOGIN, { username, password });
    
    if (response && response.user && response.user.token) {
      await AsyncStorage.setItem('token', response.user.token);
      await AsyncStorage.setItem('user', JSON.stringify({
        id: response.user.id,
        username: response.user.username,
        role: response.user.role,
        club: response.user.club,
        email: response.user.email,
        firstname: response.user.firstname,
        lastname: response.user.lastname,
        team_id: response.user.team_id,
        access_key: response.user.access_key,
        is_admin: response.user.is_admin,
        needs_password_change: response.user.needs_password_change
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

// Check if current user is admin
export const isUserAdmin = async () => {
  try {
    const userJson = await AsyncStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      return user.is_admin === true;
    }
    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Get current user's team ID
export const getCurrentUserTeamId = async () => {
  try {
    const userJson = await AsyncStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      return user.team_id;
    }
    return null;
  } catch (error) {
    console.error('Error getting user team ID:', error);
    return null;
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
        await post(AUTH_ENDPOINTS.LOGOUT);
      } catch (apiError) {
        console.warn('Logout API call failed:', apiError);
      }
    }

    const keysToRemove = ['token', 'user'];
    await AsyncStorage.multiRemove(keysToRemove);

    return {
      success: true,
      message: 'Logged out successfully'
    };
  } catch (error) {
    console.error('Logout error:', error);
    
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

// Get current user with team information including logo
export const getCurrentUserWithTeam = async () => {
  try {
    const response = await get(AUTH_ENDPOINTS.PROFILE_WITH_TEAM);
    return {
      success: true,
      user: response.user
    };
  } catch (error) {
    console.error('Get user with team error:', error);
    return {
      success: false,
      message: error.message
    };
  }
};