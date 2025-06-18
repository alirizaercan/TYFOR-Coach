import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
  Dimensions
} from 'react-native';
import { AntDesign, MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, commonStyles } from '../styles/commonStyles';
import { getCurrentUser, getCurrentUserWithTeam, logoutUser, isUserAdmin } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const { signOut } = useAuth();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [teamLogo, setTeamLogo] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Get user data with team information
        const userWithTeamResponse = await getCurrentUserWithTeam();
        if (userWithTeamResponse.success && userWithTeamResponse.user) {
          setUser(userWithTeamResponse.user);
          
          // Set team logo if available
          if (userWithTeamResponse.user.team_info?.img_path) {
            setTeamLogo(userWithTeamResponse.user.team_info.img_path);
          }
        } else {
          // Fallback to regular user data
          const userData = await getCurrentUser();
          setUser(userData);
        }
        
        const adminStatus = await isUserAdmin();
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  const handleLogout = async () => {
    // On web, show window.confirm; on native, use Alert.alert
    const confirmed =
      Platform.OS === 'web'
        ? window.confirm('Are you sure you want to logout?')
        : await new Promise(resolve =>
            Alert.alert(
              'Logout',
              'Are you sure you want to logout?',
              [
                { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
                { text: 'Logout', onPress: () => resolve(true) },
              ],
              { cancelable: false }
            )
          );
  
    if (!confirmed) return;
    try {
      setLoading(true);    console.log('Logout confirmed');
  
      // Token kontrolü
      const token = await AsyncStorage.getItem('token');
      console.log('Current token:', token);
  
      // Logout API çağrısı ve storage temizleme
      const result = await logoutUser();
      console.log('Logout API result:', result);
  
      // Auth context'e çıkış yapıldığını bildir
      await signOut();
      console.log('Logout completed, waiting for automatic navigation');
    } catch (error) {
      console.error('Logout error details:', error);
      // Hata durumunda da storage'ı temizle ve signOut çağır
      try {
        await AsyncStorage.multiRemove(['token', 'user']);
        await signOut();
      } catch (storageError) {
        console.error('Failed to clear storage on error:', storageError);
      }
    } finally {
      setLoading(false);
    }
  };

  const navigateTo = (screenName) => {
    navigation.navigate(screenName);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }  return (
    <View style={styles.container}>
      {/* Professional Header with Team Logo */}
      <LinearGradient
        colors={['rgba(0, 225, 255, 0.08)', 'rgba(64, 65, 148, 0.12)', 'transparent']}
        style={styles.headerGradient}
      >
        <View style={styles.headerContainer}>
          {/* Top Row with Team Logo, TYFOR Logo and Logout */}
          <View style={styles.topHeaderRow}>
            <View style={styles.logoSection}>
              <View style={styles.teamLogoContainer}>
                {teamLogo ? (
                  <Image 
                    source={{ uri: teamLogo }}
                    style={styles.teamLogo}
                    defaultSource={require('../assets/images/TYFOR_logo_circle.png')}
                    onError={() => setTeamLogo(null)}
                  />
                ) : (
                  <Image 
                    source={require('../assets/images/TYFOR_logo_circle.png')}
                    style={styles.teamLogo}
                  />
                )}
                <View style={styles.logoGlow} />
              </View>
              <View style={styles.teamInfo}>
                <Text style={styles.teamName}>
                  {user?.team_info?.team_name || user?.club || 'TYFOR'}
                </Text>
                <Text style={styles.teamSubtitle}>Football Academy</Text>
                <Text style={styles.teamMotto}>Excellence in Development</Text>
              </View>            </View>
            <View style={styles.headerRightSection}>
              {/* TYFOR Application Logo */}
              <View style={styles.headerTyforLogoContainer}>
                <Image 
                  source={require('../assets/images/TYFOR_logo_circle.png')}
                  style={styles.headerTyforLogo}
                  resizeMode="contain"
                />
                <View style={styles.headerTyforGlow} />
              </View>
              
              <TouchableOpacity 
                onPress={handleLogout} 
                style={styles.logoutButton}
                activeOpacity={0.8}
              >
                <Ionicons name="log-out-outline" size={22} color="#E8E8E8" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Welcome Section */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Welcome,</Text>
            <Text style={styles.userNameText}>{user?.firstname} {user?.lastname}</Text>
            <View style={styles.userBadgeContainer}>
              <View style={styles.userBadge}>
                <Feather name="user" size={12} color="#00B8CC" />
                <Text style={styles.userRoleText}>{user?.role}</Text>
              </View>
              <View style={styles.clubBadge}>
                <Ionicons name="business-outline" size={12} color="#8B5FBF" />
                <Text style={styles.userClubText}>{user?.club}</Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Main Content */}
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={Platform.OS === 'web'}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        overScrollMode="never"
        nestedScrollEnabled={true}
      >
        {/* Data Collection Dashboard */}
        <View style={styles.mainSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>TYFOR Data Collection</Text>
              <Text style={styles.sectionSubtitle}>Professional athlete performance data management system</Text>
            </View>
            <View style={styles.sectionAccent} />
          </View>
          {/* Mission Statement */}
          <View style={styles.missionCard}>
            <LinearGradient
              colors={['rgba(0, 184, 204, 0.08)', 'rgba(139, 95, 191, 0.08)']}
              style={styles.missionGradient}
            >
              <View style={styles.missionHeader}>
                <Ionicons name="analytics" size={24} color="#00B8CC" />
                <Text style={styles.missionTitle}>Technology-Driven Decisions</Text>
              </View>
              <Text style={styles.missionText}>
                Collect comprehensive athlete data to enable data-driven coaching decisions on the TYFOR platform. Your input powers our 6-module analysis system.
              </Text>
            </LinearGradient>
          </View>

          <View style={styles.dataModulesGrid}>
            {/* Physical Development Data Card */}
            <TouchableOpacity
              style={styles.dataModuleCard}
              onPress={() => navigateTo('DevelopmentHome')}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['rgba(0, 184, 204, 0.12)', 'rgba(0, 184, 204, 0.06)', 'rgba(17, 5, 85, 0.15)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.moduleGradient}
              >
                <View style={styles.moduleHeader}>
                  <View style={styles.moduleIconContainer}>
                    <Image 
                      source={require('../assets/images/youth_development_icon.png')}
                      style={styles.moduleIcon}
                    />
                    <View style={styles.moduleIconGlow} />
                  </View>
                  <View style={styles.moduleStatus}>
                    <Ionicons name="cloud-upload-outline" size={16} color="#00B8CC" />
                  </View>
                </View>
                
                <View style={styles.moduleContent}>
                  <Text style={styles.moduleTitle}>Performance Data Entry</Text>
                  <Text style={styles.moduleDescription}>
                    Input and track athlete performance metrics across Physical, Endurance, and Conditional development modules
                  </Text>
                  
                  <View style={styles.dataTypeTags}>
                    <View style={[styles.dataTag, styles.tagPhysical]}>
                      <Ionicons name="barbell-outline" size={12} color="#00B8CC" />
                      <Text style={styles.dataTagText}>Physical</Text>
                    </View>
                    <View style={[styles.dataTag, styles.tagEndurance]}>
                      <Ionicons name="heart-outline" size={12} color="#0EA5E9" />
                      <Text style={styles.dataTagText}>Endurance</Text>
                    </View>
                    <View style={[styles.dataTag, styles.tagConditional]}>
                      <Ionicons name="speedometer-outline" size={12} color="#8B5FBF" />
                      <Text style={styles.dataTagText}>Conditional</Text>
                    </View>
                  </View>
                  
                  <View style={styles.moduleAction}>
                    <Text style={styles.moduleActionText}>Start Data Entry</Text>
                    <AntDesign name="arrowright" size={16} color="#00B8CC" />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* TYFOR Platform Integration Info */}
            <View style={styles.platformInfoCard}>
              <LinearGradient
                colors={['rgba(139, 95, 191, 0.08)', 'rgba(64, 65, 148, 0.08)']}
                style={styles.platformGradient}
              >
                <View style={styles.platformHeader}>
                  <Ionicons name="globe-outline" size={22} color="#8B5FBF" />
                  <Text style={styles.platformTitle}>TYFOR Integration</Text>
                </View>
                <Text style={styles.platformDescription}>
                  Data collected here syncs with the TYFOR web platform's 6-module analysis system for comprehensive athlete evaluation
                </Text>
                
                <View style={styles.platformFeatures}>
                  <View style={styles.featureItem}>
                    <Ionicons name="sync-outline" size={14} color="#8B5FBF" />
                    <Text style={styles.featureText}>Real-time Sync</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="shield-checkmark-outline" size={14} color="#8B5FBF" />
                    <Text style={styles.featureText}>Secure Database</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="trending-up-outline" size={14} color="#8B5FBF" />
                    <Text style={styles.featureText}>Data-Driven Insights</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },

  // Header Styles
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 25,
  },
  headerContainer: {
    paddingHorizontal: 24,
  },
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  teamLogoContainer: {
    position: 'relative',
    marginRight: 18,
  },
  teamLogo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2.5,
    borderColor: '#00B8CC',
  },
  logoGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 184, 204, 0.2)',
    zIndex: -1,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F8FAFC',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  teamSubtitle: {
    fontSize: 14,
    color: '#00B8CC',
    fontWeight: '600',
    marginBottom: 2,
  },  teamMotto: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
    fontStyle: 'italic',
  },
  headerRightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerTyforLogoContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },  headerTyforLogo: {
    width: 40,
    height: 40,
  },  headerTyforGlow: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    backgroundColor: 'rgba(0, 184, 204, 0.08)',
    borderRadius: 23,
    zIndex: -1,
  },
  logoutButton: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(248, 250, 252, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(248, 250, 252, 0.12)',
  },

  // Welcome Section
  welcomeContainer: {
    marginTop: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: '#94A3B8',
    marginBottom: 6,
    fontWeight: '500',
  },
  userNameText: {
    fontSize: 30,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  userBadgeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 184, 204, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 184, 204, 0.25)',
  },
  clubBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 95, 191, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 95, 191, 0.25)',
  },
  userRoleText: {
    fontSize: 13,
    color: '#E2E8F0',
    marginLeft: 6,
    fontWeight: '600',
  },
  userClubText: {
    fontSize: 13,
    color: '#E2E8F0',
    marginLeft: 6,
    fontWeight: '600',
  },

  // Scroll Container
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Main Section Styles
  mainSection: {
    marginTop: 30,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    marginBottom: 25,
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
  // Development Cards - Enhanced
  developmentGrid: {
    gap: 20,
  },
  
  // Mission Statement Card
  missionCard: {
    marginBottom: 25,
    borderRadius: 20,
    overflow: 'hidden',
  },
  missionGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 184, 204, 0.15)',
  },
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  missionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
    marginLeft: 12,
  },  missionText: {
    fontSize: 14,
    color: '#CBD5E1',
    lineHeight: 20,
    fontWeight: '500',  },

  // Data Modules Grid
  dataModulesGrid: {
    gap: 20,
  },
  dataModuleCard: {
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
  moduleGradient: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 184, 204, 0.2)',
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  moduleIconContainer: {
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
  moduleIconGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 184, 204, 0.1)',
    zIndex: -1,
  },
  moduleIcon: {
    width: 30,
    height: 30,
    tintColor: '#00B8CC',
  },
  moduleStatus: {
    padding: 8,
    backgroundColor: 'rgba(0, 184, 204, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 184, 204, 0.3)',
  },
  moduleContent: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  moduleDescription: {
    fontSize: 14,
    color: '#CBD5E1',
    lineHeight: 20,
    marginBottom: 16,
    fontWeight: '500',
  },
  dataTypeTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  dataTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  dataTagText: {
    fontSize: 11,
    color: '#E2E8F0',
    fontWeight: '600',
  },
  tagPhysical: {
    backgroundColor: 'rgba(0, 184, 204, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 184, 204, 0.3)',
  },
  tagEndurance: {
    backgroundColor: 'rgba(14, 165, 233, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.3)',
  },
  tagConditional: {
    backgroundColor: 'rgba(139, 95, 191, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(139, 95, 191, 0.3)',
  },
  moduleAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 184, 204, 0.15)',
    gap: 8,
  },
  moduleActionText: {
    fontSize: 15,
    color: '#00B8CC',
    fontWeight: '600',
  },

  // Platform Integration Card
  platformInfoCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 15,
  },
  platformGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 95, 191, 0.15)',
  },
  platformHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  platformTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#F8FAFC',
    marginLeft: 10,
  },
  platformDescription: {
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 18,
    marginBottom: 16,
    fontWeight: '500',
  },
  platformFeatures: {
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

export default DashboardScreen;