// mobile/src/services/api.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuthHeaders } from '../constants/api';

// Base API request function with authentication handling
export const apiRequest = async (url, method = 'GET', data = null) => {
  try {
    // Get token from storage
    const token = await AsyncStorage.getItem('token');
    
    // Configure request options
    const options = {
      method,
      headers: getAuthHeaders(token),
    };

    // Add body for non-GET requests
    if (method !== 'GET' && data) {
      options.body = JSON.stringify(data);
    }

    // Make the request
    const response = await fetch(url, options);
    
    // Check if unauthorized (401)
    if (response.status === 401) {
      // Clear token and redirect to login
      await AsyncStorage.removeItem('token');
      // Navigation would be handled by the calling component
      throw new Error('Authentication token expired');
    }

    // Parse the JSON response
    const responseData = await response.json();
    
    // Check if the response was successful
    if (!response.ok) {
      throw new Error(responseData.message || 'Something went wrong');
    }

    return responseData;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Helper methods for common request types
export const get = (url) => apiRequest(url, 'GET');
export const post = (url, data) => apiRequest(url, 'POST', data);
export const put = (url, data) => apiRequest(url, 'PUT', data);
export const del = (url) => apiRequest(url, 'DELETE');