// mobile/src/components/DatePicker.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { colors } from '../styles/commonStyles';

// Import DateTimePicker conditionally for non-web platforms
let DateTimePicker;
if (Platform.OS !== 'web') {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
}

const DatePicker = ({
  label = 'Select Date:',
  date,
  onDateChange,
  containerStyle = {}
}) => {
  const [showPicker, setShowPicker] = useState(false);
  
  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      onDateChange(selectedDate);
    }
    
    // Only close the picker if it's Android (iOS handles this with the "Done" button)
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
  };

  const handleWebDateChange = (event) => {
    const selectedDate = new Date(event.target.value);
    onDateChange(selectedDate);
  };

  const renderIOSPicker = () => {
    return (
      <Modal
        transparent={true}
        visible={showPicker}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowPicker(false)}
              >
                <MaterialIcons name="close" size={22} color={colors.primary} />
              </TouchableOpacity>
            </View>
            
            {DateTimePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                style={styles.datePicker}
                textColor={colors.white}
              />
            )}

            <TouchableOpacity 
              style={styles.submitButton}
              onPress={() => setShowPicker(false)}
            >
              <Text style={styles.submitButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const renderAndroidPicker = () => {
    return showPicker && (
      <DateTimePicker
        value={date}
        mode="date"
        display="default"
        onChange={handleDateChange}
      />
    );
  };

  const renderWebPicker = () => {
    return (
      <input
        type="date"
        value={format(date, 'yyyy-MM-dd')}
        onChange={handleWebDateChange}
        style={styles.webDateInput}
      />
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      
      {Platform.OS === 'web' ? (
        <View style={styles.dateButton}>
          <Text style={styles.dateText}>{format(date, 'dd/MM/yyyy')}</Text>
          {renderWebPicker()}
        </View>
      ) : (
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.dateText}>{format(date, 'dd/MM/yyyy')}</Text>
          <MaterialIcons name="calendar-today" size={20} color={colors.primary} />
        </TouchableOpacity>
      )}

      {Platform.OS === 'ios' 
        ? renderIOSPicker() 
        : Platform.OS === 'android' 
          ? renderAndroidPicker() 
          : null
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(64, 65, 148, 0.5)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 225, 255, 0.3)',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  label: {
    fontSize: 16,
    color: colors.white,
    marginRight: 10,
    letterSpacing: 0.3,
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 5, 85, 0.8)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 225, 255, 0.2)',
  },
  dateText: {
    fontSize: 15,
    color: colors.white,
  },
  webDateInput: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  // Modal styles for iOS custom picker
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 5, 85, 0.8)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 225, 255, 0.2)',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 225, 255, 0.3)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 225, 255, 0.1)',
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(64, 65, 148, 0.3)',
  },
  datePicker: {
    width: '100%',
    backgroundColor: 'rgba(64, 65, 148, 0.5)',
    borderRadius: 12,
  },
  submitButton: {
    backgroundColor: colors.buttonBackground,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.buttonText,
    letterSpacing: 0.5,
  },
});

export default DatePicker;