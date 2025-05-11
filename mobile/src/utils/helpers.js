// mobile/src/utils/helpers.js
import { format, parseISO } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Format a date string to a desired format
 * @param {string|Date} date - The date to format
 * @param {string} formatStr - The format pattern
 * @returns {string} The formatted date string
 */
export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
  if (!date) return 'N/A';
  
  try {
    // If date is a string, parse it first
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

/**
 * Format a numeric value with specified precision
 * @param {number|string} value - The value to format
 * @param {number} precision - Number of decimal places
 * @returns {string} The formatted value
 */
export const formatNumber = (value, precision = 1) => {
  if (value === null || value === undefined || value === '') return 'N/A';
  
  try {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return num.toFixed(precision);
  } catch (error) {
    return 'N/A';
  }
};

/**
 * Calculate age from date of birth
 * @param {string|Date} dateOfBirth - Date of birth
 * @returns {number} Age in years
 */
export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;
  
  try {
    const birthDate = typeof dateOfBirth === 'string' ? parseISO(dateOfBirth) : dateOfBirth;
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  } catch (error) {
    console.error('Error calculating age:', error);
    return null;
  }
};

/**
 * Save user data to AsyncStorage
 * @param {Object} userData - The user data to save
 * @returns {Promise<void>}
 */
export const saveUserData = async (userData) => {
  try {
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};

/**
 * Get user data from AsyncStorage
 * @returns {Promise<Object|null>} The user data or null if not found
 */
export const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Clear all app data from AsyncStorage
 * @returns {Promise<void>}
 */
export const clearAppData = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(keys);
  } catch (error) {
    console.error('Error clearing app data:', error);
    throw error;
  }
};

/**
 * Calculate BMI (Body Mass Index)
 * @param {number} weightKg - Weight in kilograms
 * @param {number} heightCm - Height in centimeters
 * @returns {number|null} BMI value or null if inputs are invalid
 */
export const calculateBMI = (weightKg, heightCm) => {
  if (!weightKg || !heightCm) return null;
  
  try {
    // Height needs to be in meters for BMI calculation
    const heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
  } catch (error) {
    console.error('Error calculating BMI:', error);
    return null;
  }
};

/**
 * Get BMI category
 * @param {number} bmi - BMI value
 * @returns {string} BMI category
 */
export const getBMICategory = (bmi) => {
  if (bmi === null || bmi === undefined) return 'Unknown';
  
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

/**
 * Check if a value exists and is not empty
 * @param {*} value - The value to check
 * @returns {boolean} True if the value exists and is not empty
 */
export const hasValue = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  if (Array.isArray(value) && value.length === 0) return false;
  if (typeof value === 'object' && Object.keys(value).length === 0) return false;
  
  return true;
};

/**
 * Create a truncated version of a string with ellipsis
 * @param {string} str - The string to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated string
 */
export const truncateString = (str, maxLength = 30) => {
  if (!str) return '';
  
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};