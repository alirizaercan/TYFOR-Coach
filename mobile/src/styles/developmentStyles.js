// mobile/src/styles/developmentStyles.js
import { StyleSheet, Platform } from 'react-native';
import { colors } from './commonStyles';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 225, 255, 0.2)',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(64, 65, 148, 0.3)',
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 15,
    marginTop: 20,
    letterSpacing: 0.5,
  },
  itemContainer: {
    backgroundColor: 'rgba(64, 65, 148, 0.5)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 225, 255, 0.3)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 5,
    letterSpacing: 0.3,
  },
  itemDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 5,
  },
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
    maxHeight: '80%',
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
  formSection: {
    marginBottom: 20,
  },
  selectionContainer: {
    flex: 1,
    padding: 20,
  },
  selectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  selectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(64, 65, 148, 0.5)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    minHeight: 70,
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
  selectionImage: {
    width: 45,
    height: 45,
    marginRight: 15,
    resizeMode: 'contain',
    backgroundColor: 'transparent',
  },
  selectionText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  // Form styles
  formContainer: {
    padding: 15,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  inputContainer: {
    width: '48%',
  },
  inputLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: 'rgba(0, 225, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    color: colors.white,
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 225, 255, 0.3)',
  },
  submitButton: {
    backgroundColor: colors.buttonBackground,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.buttonText,
    letterSpacing: 0.5,
  },
  // Footballer header
  footballerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(64, 65, 148, 0.5)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    minHeight: 90,
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
  footballerImage: {
    width: 60,
    height: 60,
    marginRight: 15,
    resizeMode: 'contain',
    backgroundColor: 'transparent',
    alignSelf: 'center',
  },
  footballerHeaderInfo: {
    flex: 1,
  },
  footballerName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
    letterSpacing: 0.3,
  },
  footballerPosition: {
    fontSize: 14,
    color: colors.primary,
    marginTop: 5,
  },
  // Date selection
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(64, 65, 148, 0.5)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  dateLabel: {
    fontSize: 16,
    color: colors.white,
    marginRight: 10,
    letterSpacing: 0.3,
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  // Cards for development types
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 15,
  },
  card: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: 'rgba(64, 65, 148, 0.5)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 225, 255, 0.3)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardIcon: {
    marginBottom: 15,
    tintColor: colors.primary,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.white,
    letterSpacing: 0.5,
  },
  // No data placeholder
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noDataText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: 15,
    letterSpacing: 0.3,
  },
});