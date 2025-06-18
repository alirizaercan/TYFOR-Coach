// mobile/src/styles/commonStyles.js
import { StyleSheet, Platform } from 'react-native';

// Color palette for the app
export const colors = {
  primary: '#00E1FF',
  secondary: '#404194',
  background: '#110555',
  formBackground: 'rgba(64, 65, 148, 0.5)',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#E0E0E0',
  inputBackground: 'rgba(0, 225, 255, 0.1)',
  inputText: '#FFFFFF',
  placeholderText: 'rgba(255, 255, 255, 0.5)',
  buttonBackground: '#00E1FF',
  buttonText: '#110555',
  error: '#FF3B30',
  success: '#34C759',
};

// Common styles that can be used across the app
export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    ...(Platform.OS === 'web' && {
      height: '100vh',
      overflow: 'auto',
    }),
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.white,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: colors.inputText,
    borderWidth: 1,
    borderColor: 'rgba(0, 225, 255, 0.3)',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: colors.buttonBackground,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  shadow: {
    shadowColor: 'rgba(0, 225, 255, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  card: {
    backgroundColor: 'rgba(64, 65, 148, 0.5)',
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    width: '100%',
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    ...StyleSheet.flatten([{
      shadowColor: 'rgba(0, 225, 255, 0.3)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    }]),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 225, 255, 0.2)',
    marginVertical: 10,
    width: '100%',
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginBottom: 10,
  },
  successText: {
    color: colors.success,
    fontSize: 14,
    marginBottom: 10,
  },
});