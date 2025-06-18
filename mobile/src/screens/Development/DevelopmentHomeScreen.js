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
  Platform,
  ScrollView,
  Dimensions
} from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, commonStyles } from '../../styles/commonStyles';

const { width } = Dimensions.get('window');

// Images could be imported from assets
// These are placeholders for the actual image imports
const physicalIcon = require('../../assets/images/physical_page_icon.png');
const conditionalIcon = require('../../assets/images/conditioning_page_icon.png');
const enduranceIcon = require('../../assets/images/endurance_page_icon.png');

const DevelopmentCard = ({ icon, title, description, onPress, gradientColors, accentColor }) => (
  <TouchableOpacity 
    style={styles.developmentCard}
    onPress={onPress}
    activeOpacity={0.9}
  >
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.cardGradient}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { borderColor: accentColor }]}>
          <Image source={icon} style={[styles.developmentIcon, { tintColor: accentColor }]} />
          <View style={[styles.iconGlow, { backgroundColor: `${accentColor}15` }]} />
        </View>
        <View style={styles.cardStatus}>
          <Feather name="activity" size={16} color={accentColor} />
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
        
        <View style={styles.cardFooter}>          <View style={styles.progressIndicator}>
            <View style={[styles.progressBar, { backgroundColor: `${accentColor}30` }]}>
              <View style={[styles.progressFill, { backgroundColor: accentColor, width: '65%' }]} />
            </View>
            <Text style={styles.progressText}>Data Entry Ready</Text>
          </View>
          
          <View style={styles.actionButton}>
            <Text style={[styles.actionText, { color: accentColor }]}>Start Data Entry</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color={accentColor} />
          </View>
        </View>
      </View>
    </LinearGradient>
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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      {/* Professional Header */}
      <LinearGradient
        colors={['rgba(0, 225, 255, 0.08)', 'rgba(64, 65, 148, 0.12)', 'transparent']}
        style={styles.headerGradient}
      >
        <SafeAreaView style={styles.headerSafeArea}>
          <View style={styles.header}>
            <TouchableOpacity onPress={navigateBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={22} color="#F8FAFC" />
            </TouchableOpacity>            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Data Collection</Text>
              <Text style={styles.headerSubtitle}>Performance Data Entry Modules</Text>
            </View>
            <View style={styles.headerRight}>
              <View style={styles.headerBadge}>
                <Feather name="target" size={16} color="#00B8CC" />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
      
      {/* Main Content */}
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>          {/* Section Header */}          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Data Entry Modules</Text>
              <Text style={styles.sectionSubtitle}>Systematic recording and tracking of player performance data</Text>
            </View>
            <View style={styles.sectionAccent} />
          </View>
          
          {/* Development Cards */}
          <View style={styles.cardsContainer}>            <DevelopmentCard
              icon={physicalIcon}
              title="PHYSICAL DATA ENTRY"
              description="Record and track strength, power, agility and motor skill performance data"
              gradientColors={['rgba(0, 184, 204, 0.12)', 'rgba(0, 184, 204, 0.06)', 'rgba(17, 5, 85, 0.15)']}
              accentColor="#00B8CC"
              onPress={() => navigateTo('PhysicalDevelopment')}
            />
            
            <DevelopmentCard
              icon={conditionalIcon}
              title="CONDITIONING DATA ENTRY"
              description="Input sport-specific conditioning and metabolic capacity performance data"
              gradientColors={['rgba(14, 165, 233, 0.12)', 'rgba(14, 165, 233, 0.06)', 'rgba(17, 5, 85, 0.15)']}
              accentColor="#0EA5E9"
              onPress={() => navigateTo('ConditionalDevelopment')}
            />
            
            <DevelopmentCard
              icon={enduranceIcon}
              title="ENDURANCE DATA ENTRY"
              description="Record cardiovascular fitness and endurance capacity performance metrics"
              gradientColors={['rgba(139, 95, 191, 0.12)', 'rgba(139, 95, 191, 0.06)', 'rgba(17, 5, 85, 0.15)']}
              accentColor="#8B5FBF"
              onPress={() => navigateTo('EnduranceDevelopment')}
            />
          </View>
          
          {/* Performance Insights */}
          <View style={styles.insightsCard}>
            <LinearGradient
              colors={['rgba(64, 65, 148, 0.08)', 'rgba(139, 95, 191, 0.08)']}
              style={styles.insightsGradient}
            >              <View style={styles.insightsHeader}>
                <Ionicons name="analytics-outline" size={22} color="#8B5FBF" />
                <Text style={styles.insightsTitle}>Data Analytics</Text>
              </View>
              <Text style={styles.insightsDescription}>
                Each data entry module provides comprehensive analytics and progress tracking to optimize player development strategies
              </Text>
              
              <View style={styles.insightsFeatures}>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle-outline" size={14} color="#8B5FBF" />
                  <Text style={styles.featureText}>Data-driven insights</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="trending-up-outline" size={14} color="#8B5FBF" />
                  <Text style={styles.featureText}>Progress monitoring</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="bar-chart-outline" size={14} color="#8B5FBF" />
                  <Text style={styles.featureText}>Performance benchmarking</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header Styles
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
  },
  headerSafeArea: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 15 : 10,
  },
  backButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(248, 250, 252, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(248, 250, 252, 0.12)',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F8FAFC',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
  headerRight: {
    alignItems: 'center',
  },
  headerBadge: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 184, 204, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 184, 204, 0.25)',
  },

  // Scroll Container
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Content Styles
  content: {
    paddingHorizontal: 24,
    paddingTop: 30,
  },

  // Section Header
  sectionHeader: {
    marginBottom: 30,
  },
  sectionTitleContainer: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  sectionSubtitle: {
    fontSize: 15,
    color: '#94A3B8',
    fontWeight: '500',
    lineHeight: 20,
  },
  sectionAccent: {
    width: 50,
    height: 4,
    backgroundColor: '#00B8CC',
    borderRadius: 2,
  },

  // Cards Container
  cardsContainer: {
    gap: 20,
    marginBottom: 30,
  },

  // Development Card Styles
  developmentCard: {
    borderRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#00B8CC',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  cardGradient: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 184, 204, 0.2)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 184, 204, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0, 184, 204, 0.3)',
    position: 'relative',
  },
  iconGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 32,
    zIndex: -1,
  },
  developmentIcon: {
    width: 30,
    height: 30,
  },
  cardStatus: {
    padding: 8,
    backgroundColor: 'rgba(0, 184, 204, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 184, 204, 0.3)',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  cardDescription: {
    fontSize: 14,
    color: '#CBD5E1',
    lineHeight: 20,
    marginBottom: 20,
    fontWeight: '500',
  },
  cardFooter: {
    gap: 16,
  },
  progressIndicator: {
    gap: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 184, 204, 0.15)',
    gap: 8,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
  },

  // Insights Card
  insightsCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  insightsGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 95, 191, 0.15)',
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightsTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#F8FAFC',
    marginLeft: 10,
  },
  insightsDescription: {
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 18,
    marginBottom: 16,
    fontWeight: '500',
  },
  insightsFeatures: {
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 12,
    color: '#E2E8F0',
    fontWeight: '600',
  },
});

export default DevelopmentHomeScreen;