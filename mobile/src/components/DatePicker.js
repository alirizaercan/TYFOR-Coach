// mobile/src/components/DatePicker.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { colors } from '../styles/commonStyles';

// Import DateTimePicker conditionally for non-web platforms
let DateTimePicker;
try {
  if (Platform.OS !== 'web') {
    DateTimePicker = require('@react-native-community/datetimepicker').default;
  }
} catch (error) {
  console.warn('DateTimePicker not available:', error);
}

const DatePicker = ({
  label = 'Select Date:',
  date,
  onDateChange,
  containerStyle = {}
}) => {
  const [showPicker, setShowPicker] = useState(false);
  
  // Debug showPicker state
  console.log('DatePicker showPicker state:', showPicker, 'Platform:', Platform.OS);
    const handleDateChange = (event, selectedDate) => {
    console.log('Date change event:', event, selectedDate);
    if (selectedDate) {
      onDateChange(selectedDate);
    }
    
    // Only close the picker if it's Android (iOS handles this with the "Done" button)
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
  };
  const handleWebDateChange = (event) => {
    console.log('Web date change:', event.target.value);
    const selectedDate = new Date(event.target.value + 'T12:00:00');
    if (!isNaN(selectedDate.getTime())) {
      onDateChange(selectedDate);
    }
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
  };  const renderAndroidPicker = () => {
    console.log('Rendering Android picker, showPicker:', showPicker, 'DateTimePicker available:', !!DateTimePicker);
    return showPicker && DateTimePicker && (
      <DateTimePicker
        value={date}
        mode="date"
        display="default"
        onChange={handleDateChange}
        style={styles.androidDatePicker}
      />
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>      {Platform.OS === 'web' ? (
        <View style={styles.webDateButton}>
          <Text style={styles.dateText}>{format(date, 'dd/MM/yyyy')}</Text>
          <View style={styles.webInputWrapper}>
            <input
              type="date"
              value={format(date, 'yyyy-MM-dd')}
              onChange={handleWebDateChange}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: 'pointer',
                zIndex: 3,
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '16px',
                fontFamily: 'inherit',
              }}
              title="Select date"
            />
            <MaterialIcons 
              name="calendar-today" 
              size={20} 
              color={colors.primary}
              style={{ 
                pointerEvents: 'none', 
                zIndex: 1,
                position: 'relative'
              }}
            />
          </View>
        </View>
      ) : (<TouchableOpacity
          style={styles.dateButton}
          onPress={() => {
            console.log('DatePicker button pressed');
            setShowPicker(true);
          }}
          activeOpacity={0.8}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.dateText}>{format(date, 'dd/MM/yyyy')}</Text>          <View style={styles.iconContainer}>
            <MaterialIcons name="calendar-today" size={20} color={colors.primary} />
          </View>
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
    backgroundColor: colors.formBackground,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  label: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
    textAlign: 'left',
  },  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 5, 85, 0.8)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 225, 255, 0.3)',
    minHeight: 56,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
      },
    }),
  },  dateText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 225, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },  webDateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 5, 85, 0.8)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 225, 255, 0.3)',
    minHeight: 56,
    position: 'relative',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },  webInputWrapper: {
    position: 'relative',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(0, 225, 255, 0.2)',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
    cursor: 'pointer',
    overflow: 'hidden',
  },webDateContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  webCalendarIcon: {
    marginLeft: 8,
    pointerEvents: 'none',
  },// Modal styles for iOS custom picker
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 5, 85, 0.9)',
    padding: 20,
  },
  modalContent: {
    width: '95%',
    maxWidth: 400,
    backgroundColor: colors.formBackground,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 225, 255, 0.3)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.3,
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 225, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 225, 255, 0.3)',
  },  datePicker: {
    width: '100%',
    backgroundColor: 'rgba(17, 5, 85, 0.6)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 225, 255, 0.3)',
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.background,
    letterSpacing: 0.3,
  },
  androidDatePicker: {
    backgroundColor: 'transparent',
  },
});

export default DatePicker;