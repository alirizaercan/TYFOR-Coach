// mobile/src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { verifyToken } from '../services/auth';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const tokenResult = await verifyToken();
        setUserToken(tokenResult.valid ? token : null);
      } else {
        setUserToken(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUserToken(null);
    }
  };

  const signIn = async () => {
    // Login işleminden sonra token kontrolü yap
    await checkAuthState();
  };

  const signOut = async () => {
    // Logout işleminden sonra token'ı temizle
    setUserToken(null);
  };

  useEffect(() => {
    const bootstrapAsync = async () => {
      setIsLoading(true);
      await checkAuthState();
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  const value = {
    userToken,
    isLoading,
    signIn,
    signOut,
    checkAuthState
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
