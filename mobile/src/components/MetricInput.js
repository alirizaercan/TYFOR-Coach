// mobile/src/components/MetricInput.js
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';

const MetricInput = ({
  label,
  value,
  onChangeText,
  placeholder = '0.0',
  keyboardType = 'numeric',
  unit = '',
  containerStyle = {},
  inputStyle = {},
  labelStyle = {},
  decimal = true
}) => {
  // Handle value change and apply decimal-only validation if needed
  const handleChange = (text) => {
    if (decimal) {
      // Only allow numbers and a single decimal point
      if (text === '' || /^\d*\.?\d*$/.test(text)) {
        onChangeText(text);
      }
    } else {
      // Only allow whole numbers
      if (text === '' || /^\d*$/.test(text)) {
        onChangeText(text);
      }
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, labelStyle]}>
        {label}{unit ? ` (${unit})` : ''}
      </Text>
      <TextInput
        style={[styles.input, inputStyle]}
        value={value}
        onChangeText={handleChange}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholderText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: colors.white,
    marginBottom: 5,
  },
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: 5,
    padding: 10,
    color: colors.inputText,
    fontSize: 14,
  }
});

export default MetricInput;