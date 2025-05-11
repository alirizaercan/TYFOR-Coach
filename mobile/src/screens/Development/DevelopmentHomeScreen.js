// mobile/src/screens/Development/DevelopmentHomeScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Platform
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { colors, commonStyles } from '../../styles/commonStyles';

// Images could be imported from assets
// These are placeholders for the actual image imports
const physicalIcon = require('../../assets/images/physical_page_icon.png');
const conditionalIcon = require('../../assets/images/conditioning_page_icon.png');
const enduranceIcon = require('../../assets/images/endurance_page_icon.png');

const DevelopmentCard = ({ icon, title, onPress }) => (
  <TouchableOpacity 
    style={styles.developmentButton}
    onPress={onPress}
    activeOpacity={0.85}
  >
    <View style={styles.cardContent}>
      <View style={styles.iconContainer}>
        <Image source={icon} style={styles.developmentIcon} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.developmentText}>{title}</Text>
        <Text style={styles.developmentSubtext}>Track and analyze progress</Text>
      </View>
    </View>
    <View style={styles.arrowContainer}>
      <MaterialIcons name="arrow-forward-ios" size={20} color={colors.primary} />
    </View>
  </TouchableOpacity>
);

const DevelopmentHomeScreen = ({ navigation }) => {
  const navigateBack = () => {
    navigation.goBack();
  };
  
  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={navigateBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Player Development</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Development Areas</Text>
        
        <DevelopmentCard
          icon={physicalIcon}
          title="PHYSICAL"
          onPress={() => navigateTo('PhysicalDevelopment')}
        />
        
        <DevelopmentCard
          icon={conditionalIcon}
          title="CONDITIONING"
          onPress={() => navigateTo('ConditionalDevelopment')}
        />
        
        <DevelopmentCard
          icon={enduranceIcon}
          title="ENDURANCE"
          onPress={() => navigateTo('EnduranceDevelopment')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingVertical: 15,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 225, 255, 0.2)',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(64, 65, 148, 0.3)',
  },
  headerTitle: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 25,
    letterSpacing: 0.5,
  },
  developmentButton: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: 'rgba(64, 65, 148, 0.5)',
    borderRadius: 12,
    padding: 18,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 225, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 1,
    borderColor: 'rgba(0, 225, 255, 0.15)',
  },
  developmentIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    tintColor: colors.primary,
  },
  textContainer: {
    flex: 1,
  },
  developmentText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.7,
    marginBottom: 4,
  },
  developmentSubtext: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    letterSpacing: 0.2,
  },
  arrowContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 225, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default DevelopmentHomeScreen;