// mobile/src/screens/Development/EnduranceDevelopmentScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Dimensions,
  StyleSheet
} from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';

// Custom components
import DatePicker from '../../components/DatePicker';
import MetricInput from '../../components/MetricInput';
import JerseyNumber from '../../components/JerseyNumber';

// Styles
import { colors } from '../../styles/commonStyles';

const { width } = Dimensions.get('window');

// Services
import {
  fetchLeagues,
  fetchTeamsByLeague,
  fetchFootballersByTeam,
  fetchEnduranceDataByDate,
  addEnduranceData,
  updateEnduranceData,
  fetchUserAccessibleTeams
} from '../../services/enduranceService';
import { getCurrentUser, isUserAdmin } from '../../services/auth';

const EnduranceDevelopmentScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [leagues, setLeagues] = useState([]);
  const [teams, setTeams] = useState([]);
  const [footballers, setFootballers] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedFootballer, setSelectedFootballer] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [existingEntry, setExistingEntry] = useState(null);
  
  // State for endurance data form
  const [enduranceData, setEnduranceData] = useState({
    running_distance: '',
    average_speed: '',
    heart_rate: '',
    peak_heart_rate: '',
    training_intensity: '',
    session: ''
  });  
  // Fetch user data and teams on component mount
  useEffect(() => {
    loadUserDataAndTeams();
  }, []);

  // Reset teams when league changes
  useEffect(() => {
    if (selectedLeague) {
      loadTeams(selectedLeague.league_id);
      setSelectedTeam(null);
      setSelectedFootballer(null);
    }
  }, [selectedLeague]);

  // Reset footballers when team changes
  useEffect(() => {
    if (selectedTeam) {
      loadFootballers(selectedTeam.team_id);
      setSelectedFootballer(null);
    }
  }, [selectedTeam]);

  // Check for existing data when footballer and date selected
  useEffect(() => {
    if (selectedFootballer && selectedDate) {
      checkExistingData();
    }
  }, [selectedFootballer, selectedDate]);

  const loadUserDataAndTeams = async () => {
    setLoading(true);
    try {
      const userData = await getCurrentUser();
      const adminStatus = await isUserAdmin();
      setCurrentUser(userData);
      setIsAdmin(adminStatus);

      if (adminStatus) {
        // Admin users can see all leagues
        await loadLeagues();
      } else {
        // Non-admin users see only their accessible teams
        const accessibleTeams = await fetchUserAccessibleTeams();
        setTeams(accessibleTeams);
        
        // Auto-select the user's team if they have one
        if (accessibleTeams.length === 1) {
          setSelectedTeam(accessibleTeams[0]);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load user data and teams');
    } finally {
      setLoading(false);
    }
  };
  

  const loadLeagues = async () => {
    setLoading(true);
    try {
      const leaguesData = await fetchLeagues();
      setLeagues(leaguesData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load leagues');
    } finally {
      setLoading(false);
    }
  };

  const loadTeams = async (leagueId) => {
    setLoading(true);
    try {
      const teamsData = await fetchTeamsByLeague(leagueId);
      setTeams(teamsData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  const loadFootballers = async (teamId) => {
    setLoading(true);
    try {
      const footballersData = await fetchFootballersByTeam(teamId);
      setFootballers(footballersData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load footballers');
    } finally {
      setLoading(false);
    }
  };

  const checkExistingData = async () => {
    if (!selectedFootballer) return;
    
    setLoading(true);
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const data = await fetchEnduranceDataByDate(
        selectedFootballer.footballer_id,
        formattedDate
      );
  
      if (data) {
        setExistingEntry(data);
        setEnduranceData({
          vo2_max: data.vo2_max ? data.vo2_max.toString() : '',
          running_distance: data.running_distance ? data.running_distance.toString() : '',
          average_speed: data.average_speed ? data.average_speed.toString() : '',
          heart_rate: data.heart_rate ? data.heart_rate.toString() : '',
          peak_heart_rate: data.peak_heart_rate ? data.peak_heart_rate.toString() : '',
          training_intensity: data.training_intensity ? data.training_intensity.toString() : '',
          session: data.session ? data.session.toString() : ''
        });
      } else {
        setExistingEntry(null);
        setEnduranceData({
            running_distance: '',
            average_speed: '',
            heart_rate: '',
            peak_heart_rate: '',
            training_intensity: '',
            session: ''
        });
      }
    } catch (error) {
      console.error('Error checking for existing data:', error);
      setExistingEntry(null);
      setEnduranceData({
          running_distance: '',
          average_speed: '',
          heart_rate: '',
          peak_heart_rate: '',
          training_intensity: '',
          session: ''
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDateChange = async (date) => {
    setSelectedDate(date);
    if (selectedFootballer) {
      try {
        const formattedDate = format(date, 'yyyy-MM-dd');
        const data = await fetchEnduranceDataByDate(
          selectedFootballer.footballer_id,
          formattedDate
        );
  
        if (data && data.id) {
          setExistingEntry(data);
          setEnduranceData({
            vo2_max: data.vo2_max ? data.vo2_max.toString() : '',
            running_distance: data.running_distance ? data.running_distance.toString() : '',
            average_speed: data.average_speed ? data.average_speed.toString() : '',
            heart_rate: data.heart_rate ? data.heart_rate.toString() : '',
            peak_heart_rate: data.peak_heart_rate ? data.peak_heart_rate.toString() : '',
            training_intensity: data.training_intensity ? data.training_intensity.toString() : '',
            session: data.session ? data.session.toString() : ''
          });
        } else {
          // Clear form for new entry
          setExistingEntry(null);
          setEnduranceData({
              running_distance: '',
              average_speed: '',
              heart_rate: '',
              peak_heart_rate: '',
              training_intensity: '',
              session: ''
          });
        }
      } catch (error) {
        console.log('Error fetching data for date:', error);
        // Clear form on error
        setExistingEntry(null);
        setEnduranceData({
            running_distance: '',
            average_speed: '',
            heart_rate: '',
            peak_heart_rate: '',
            training_intensity: '',
            session: ''
        });
      }
    }
  };
  
  const handleInputChange = (field, value) => {
    setEnduranceData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = async () => {
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    const dataToSubmit = {
      ...enduranceData,
      created_at: formattedDate // Tarihi veriye ekle
    };
    
    // API çağrılarını güncelle
    if (existingEntry) {
      await updateEnduranceData(existingEntry.id, dataToSubmit);
    } else {
      await addEnduranceData(selectedFootballer.footballer_id, dataToSubmit);
    }
  };
  
  const navigateBack = () => {
    navigation.goBack();
  };  // Render functions
  const renderLeagueSelection = () => (
    <View style={styles.selectionContainer}>
      <View style={styles.selectionHeader}>
        <View style={styles.headerIconContainer}>
          <Ionicons name="trophy-outline" size={24} color="#8B5FBF" />
        </View>
        <Text style={styles.selectionTitle}>Select League</Text>
        <Text style={styles.selectionSubtitle}>Choose the competition league</Text>
      </View>
      
      <ScrollView style={styles.selectionList} showsVerticalScrollIndicator={false}>
        {leagues.map(league => (
          <TouchableOpacity
            key={league.league_id}
            style={styles.selectionCard}
            onPress={() => setSelectedLeague(league)}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['rgba(139, 95, 191, 0.08)', 'rgba(139, 95, 191, 0.04)']}
              style={styles.selectionCardGradient}
            >
              <View style={styles.selectionCardContent}>
                {league.league_logo_path && (
                  <View style={styles.selectionImageContainer}>
                    <Image 
                      source={{ uri: league.league_logo_path }} 
                      style={styles.selectionImage} 
                    />
                  </View>
                )}
                <Text style={styles.selectionText}>{league.league_name}</Text>
                <MaterialIcons name="arrow-forward-ios" size={16} color="#8B5FBF" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}      </ScrollView>
    </View>
  );

  const renderTeamSelection = () => (
    <View style={styles.selectionContainer}>
      <View style={styles.selectionHeader}>
        <View style={styles.headerIconContainer}>
          <Ionicons name="people-outline" size={24} color="#8B5FBF" />
        </View>
        <Text style={styles.selectionTitle}>Select Team</Text>
        <Text style={styles.selectionSubtitle}>Choose your football team</Text>
      </View>
      
      <ScrollView style={styles.selectionList} showsVerticalScrollIndicator={false}>
        {teams.map(team => (
          <TouchableOpacity
            key={team.team_id}
            style={styles.selectionCard}
            onPress={() => setSelectedTeam(team)}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['rgba(139, 95, 191, 0.08)', 'rgba(139, 95, 191, 0.04)']}
              style={styles.selectionCardGradient}
            >
              <View style={styles.selectionCardContent}>
                {team.img_path && (
                  <View style={styles.selectionImageContainer}>
                    <Image 
                      source={{ uri: team.img_path }} 
                      style={styles.selectionImage} 
                    />
                  </View>
                )}
                <Text style={styles.selectionText}>{team.team_name}</Text>
                <MaterialIcons name="arrow-forward-ios" size={16} color="#8B5FBF" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}      </ScrollView>
    </View>
  );

  const renderFootballerSelection = () => (
    <View style={styles.selectionContainer}>
      <View style={styles.selectionHeader}>
        <View style={styles.headerIconContainer}>
          <Ionicons name="person-outline" size={24} color="#8B5FBF" />
        </View>
        <Text style={styles.selectionTitle}>Select Player</Text>
        <Text style={styles.selectionSubtitle}>Choose the player for endurance assessment</Text>
      </View>
      
      <ScrollView style={styles.selectionList} showsVerticalScrollIndicator={false}>
        {footballers.map(footballer => (
          <TouchableOpacity
            key={footballer.footballer_id}
            style={styles.playerCard}
            onPress={() => setSelectedFootballer(footballer)}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['rgba(139, 95, 191, 0.08)', 'rgba(139, 95, 191, 0.04)']}
              style={styles.playerCardGradient}
            >              <View style={styles.playerCardContent}>                <View style={styles.playerImageContainer}>
                  {footballer.footballer_img_path ? (
                    <Image 
                      source={{ uri: footballer.footballer_img_path }} 
                      style={styles.playerImage} 
                    />
                  ) : (
                    <View style={styles.playerImagePlaceholder}>
                      <Ionicons name="person" size={32} color="#8B5FBF" />
                    </View>
                  )}
                </View>
                <View style={styles.playerMainInfo}>
                  <Text style={styles.playerName}>{footballer.footballer_name}</Text>
                  <Text style={styles.playerPosition}>{footballer.position}</Text>
                  <View style={styles.playerDetailsContainer}>
                    <View style={styles.playerDetailItem}>
                      <Text style={styles.playerDetailLabel}>Age</Text>
                      <Text style={styles.playerDetailValue}>{footballer.age || 'N/A'}</Text>
                    </View>
                    {footballer.height && (
                      <View style={styles.playerDetailItem}>
                        <Text style={styles.playerDetailLabel}>Height</Text>
                        <Text style={styles.playerDetailValue}>{footballer.height}</Text>
                      </View>
                    )}
                    <View style={styles.playerIconsContainer}>
                      {footballer.nationality_img_path && (
                        <View style={styles.nationalityContainer}>
                          <Image 
                            source={{ uri: footballer.nationality_img_path }} 
                            style={styles.nationalityFlag} 
                          />
                        </View>
                      )}
                      {footballer.trikot_num && (
                        <JerseyNumber 
                          number={footballer.trikot_num}
                          color="#8B5FBF"
                          size="small"
                          style={styles.jerseyComponent}
                        />
                      )}
                    </View>
                  </View>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={20} color="#8B5FBF" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}      </ScrollView>
    </View>
  );

  // Render data form when footballer is selected
  const renderDataForm = () => (
    <View style={styles.formContainer}>
      {/* Player Header */}
      <View style={styles.playerHeader}>
        <LinearGradient
          colors={['rgba(139, 95, 191, 0.1)', 'rgba(139, 95, 191, 0.05)']}
          style={styles.playerHeaderGradient}
        >          <View style={styles.playerHeaderContent}>            <View style={styles.playerHeaderImageContainer}>
              {selectedFootballer.footballer_img_path ? (
                <Image 
                  source={{ uri: selectedFootballer.footballer_img_path }} 
                  style={styles.playerHeaderImage} 
                />
              ) : (
                <View style={styles.playerHeaderImagePlaceholder}>
                  <Ionicons name="person" size={32} color="#8B5FBF" />
                </View>
              )}
            </View>
            <View style={styles.playerHeaderInfo}>
              <Text style={styles.playerHeaderName}>{selectedFootballer.footballer_name}</Text>
              <Text style={styles.playerHeaderPosition}>{selectedFootballer.position}</Text>
              <View style={styles.playerHeaderDetails}>
                {selectedFootballer.age && (
                  <View style={styles.playerHeaderDetailItem}>
                    <Text style={styles.playerHeaderDetailLabel}>Age: </Text>
                    <Text style={styles.playerHeaderDetailValue}>{selectedFootballer.age}</Text>
                  </View>
                )}
                {selectedFootballer.height && (
                  <View style={styles.playerHeaderDetailItem}>
                    <Text style={styles.playerHeaderDetailLabel}>Height: </Text>
                    <Text style={styles.playerHeaderDetailValue}>{selectedFootballer.height}</Text>
                  </View>
                )}
                <View style={styles.playerHeaderIconsContainer}>
                  {selectedFootballer.nationality_img_path && (
                    <View style={styles.nationalityContainer}>
                      <Image 
                        source={{ uri: selectedFootballer.nationality_img_path }} 
                        style={styles.nationalityFlag} 
                      />
                    </View>
                  )}
                  {selectedFootballer.trikot_num && (
                    <JerseyNumber 
                      number={selectedFootballer.trikot_num}
                      color="#8B5FBF"
                      size="small"
                      style={styles.jerseyComponent}
                    />
                  )}
                </View>
              </View>              <View style={styles.assessmentBadge}>
                <Feather name="activity" size={12} color="#8B5FBF" />
                <Text style={styles.assessmentBadgeText}>Endurance Data Entry</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={styles.formScrollView}
          contentContainerStyle={styles.formScrollContent}
          showsVerticalScrollIndicator={false}
        >          {/* Date Selection */}
          <View style={styles.dateSection}>
            <Text style={styles.dateSectionTitle}>Data Entry Date</Text>
            <DatePicker 
              label="Select Date"
              date={selectedDate}
              onDateChange={handleDateChange}
              containerStyle={styles.dateSelector}
            />
          </View>
                
          {/* Running Performance Section */}
          <View style={styles.formSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <Ionicons name="walk-outline" size={20} color="#8B5FBF" />
              </View>
              <Text style={styles.sectionTitle}>Running Performance</Text>
            </View>
            
            <View style={styles.inputGrid}>
              <MetricInput
                label="Distance"
                value={enduranceData.running_distance}
                onChangeText={(text) => handleInputChange('running_distance', text)}
                unit="km"
                containerStyle={styles.inputContainer}
              />
              
              <MetricInput
                label="Avg Speed"
                value={enduranceData.average_speed}
                onChangeText={(text) => handleInputChange('average_speed', text)}
                unit="km/h"
                containerStyle={styles.inputContainer}
              />
            </View>
          </View>
          
          {/* Cardiovascular Metrics Section */}
          <View style={styles.formSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>              <Ionicons name="heart-outline" size={20} color="#8B5FBF" />
              </View>
              <Text style={styles.sectionTitle}>Cardiovascular Metrics</Text>
            </View>
            
            <View style={styles.inputGrid}>
              <MetricInput
                label="Heart Rate"
                value={enduranceData.heart_rate}
                onChangeText={(text) => handleInputChange('heart_rate', text)}
                unit="bpm"
                decimal={false}
                containerStyle={styles.inputContainer}
              />
              
              <MetricInput
                label="Peak Heart Rate"
                value={enduranceData.peak_heart_rate}
                onChangeText={(text) => handleInputChange('peak_heart_rate', text)}
                unit="bpm"
                decimal={false}
                containerStyle={styles.inputContainer}
              />
            </View>
          </View>
          
          {/* Training Details Section */}
          <View style={styles.formSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <Ionicons name="fitness-outline" size={20} color="#8B5FBF" />
              </View>
              <Text style={styles.sectionTitle}>Training Details</Text>
            </View>
            
            <View style={styles.inputGrid}>
              <MetricInput
                label="Training Intensity"
                value={enduranceData.training_intensity}
                onChangeText={(text) => handleInputChange('training_intensity', text)}
                unit="1-10"
                decimal={false}
                containerStyle={styles.inputContainer}
              />
              
              <MetricInput
                label="Session Duration"
                value={enduranceData.session}
                onChangeText={(text) => handleInputChange('session', text)}
                unit="min"
                decimal={false}
                containerStyle={styles.inputContainer}
              />
            </View>
          </View>
          
          {/* Submit Button */}
          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#8B5FBF', '#A855F7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.submitButtonGradient}
            >
              <View style={styles.submitButtonContent}>
                <Ionicons 
                  name={existingEntry ? "checkmark-circle-outline" : "save-outline"} 
                  size={20} 
                  color="#FFFFFF" 
                />                <Text style={styles.submitButtonText}>
                  {existingEntry ? 'Update Data Entry' : 'Save Data Entry'}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5FBF" />
        </View>
      );
    }
    
    // For admin users, show league selection first
    if (isAdmin && !selectedLeague) return renderLeagueSelection();
    
    // For non-admin users or admin users who selected a league, show team selection
    if (!selectedTeam) return renderTeamSelection();
    
    // Show footballer selection
    if (!selectedFootballer) return renderFootballerSelection();
    
    // Show data form
    return renderDataForm();
  };
    return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(0, 225, 255, 0.08)', 'rgba(64, 65, 148, 0.12)', 'transparent']}
        style={styles.headerGradient}
      >
        <SafeAreaView style={styles.headerSafeArea}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={22} color="#F8FAFC" />
            </TouchableOpacity>            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Endurance Data Entry</Text>
              <Text style={styles.headerSubtitle}>Cardiovascular endurance and stamina data recording</Text>
            </View>
            <View style={styles.headerRight}>
              <View style={styles.headerBadge}>
                <Ionicons name="heart-outline" size={16} color="#8B5FBF" />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
      
      {renderContent()}
    </View>
  );
};

export default EnduranceDevelopmentScreen;

// Professional Stylesheet
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
    backgroundColor: 'rgba(139, 95, 191, 0.08)',
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'ios' ? 16 : 36,
  },
  
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 95, 191, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
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
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  
  headerRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  headerBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 95, 191, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },  // Selection Screen Styles
  selectionContainer: {
    flex: 1,
    padding: 20,
  },
  
  selectionHeader: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 20,
  },
  
  headerIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(139, 95, 191, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(139, 95, 191, 0.2)',
  },
  
  selectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 8,
    textAlign: 'center',
  },
  
  selectionSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },
  
  selectionList: {
    flex: 1,
  },
  
  selectionCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#8B5FBF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  selectionCardGradient: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 95, 191, 0.1)',
  },  selectionCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
    selectionImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(139, 95, 191, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(139, 95, 191, 0.2)',
  },
  
  selectionImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
    selectionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#F8FAFC',
    letterSpacing: 0.2,
  },
  
  // Player Card Styles
  playerCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#8B5FBF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  playerCardGradient: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 95, 191, 0.1)',
  },  playerCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(248, 250, 252, 0.08)',
  },
  
  playerImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'rgba(139, 95, 191, 0.2)',
    elevation: 4,
    shadowColor: '#8B5FBF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    position: 'relative',
  },
  
  playerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  
  playerImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(139, 95, 191, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },    jerseyComponent: {
    elevation: 6,
    shadowColor: '#8B5FBF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  
  playerIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  
  playerHeaderIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  
  playerMainInfo: {
    flex: 1,
  },
  
  playerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  
  playerPosition: {
    fontSize: 14,
    color: '#8B5FBF',
    fontWeight: '600',
    marginBottom: 8,
  },
  
  playerDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  
  playerDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  
  playerDetailLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginRight: 4,
  },
  
  playerDetailValue: {
    fontSize: 12,
    color: '#F8FAFC',
    fontWeight: '600',
  },
  
  nationalityContainer: {
    width: 20,
    height: 15,
    borderRadius: 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(139, 95, 191, 0.3)',
  },
  
  nationalityFlag: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },// Form Styles
  formContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  playerHeader: {
    margin: 20,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#8B5FBF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  
  playerHeaderGradient: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 95, 191, 0.1)',
  },  playerHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(248, 250, 252, 0.08)',
  },
    playerHeaderImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 20,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'rgba(139, 95, 191, 0.2)',
    position: 'relative',
  },
  
  playerHeaderImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  
  playerHeaderImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(139, 95, 191, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  playerHeaderInfo: {
    flex: 1,
  },
  
  playerHeaderName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  
  playerHeaderPosition: {
    fontSize: 16,
    color: '#8B5FBF',
    fontWeight: '600',
    marginBottom: 8,
  },
  
  playerHeaderDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  playerHeaderDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  
  playerHeaderDetailLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  
  playerHeaderDetailValue: {
    fontSize: 14,
    color: '#F8FAFC',
    fontWeight: '600',
  },
  
  assessmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 95, 191, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  
  assessmentBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8B5FBF',
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  formScrollView: {
    flex: 1,
  },
  
  formScrollContent: {
    padding: 20,
    paddingTop: 0,
  },  // Date Section
  dateSection: {
    marginBottom: 24,
    padding: 20,
    backgroundColor: 'rgba(248, 250, 252, 0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 95, 191, 0.1)',
    elevation: 2,
    shadowColor: '#8B5FBF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  
  dateSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 16,
  },
  
  dateSelector: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 95, 191, 0.2)',
  },  // Form Section Styles
  formSection: {
    marginBottom: 24,
    padding: 20,
    backgroundColor: 'rgba(248, 250, 252, 0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 95, 191, 0.1)',
    elevation: 2,
    shadowColor: '#8B5FBF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  sectionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(139, 95, 191, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  
  inputGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  
  inputContainer: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  
  // Submit Button
  submitButton: {
    marginTop: 16,
    marginBottom: 40,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#8B5FBF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  
  submitButtonGradient: {
    borderRadius: 16,
  },
  
  submitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  
  submitButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
});