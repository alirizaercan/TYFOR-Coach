// mobile/src/screens/Development/ConditionalDevelopmentScreen.js
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
  fetchConditionalDataByDate,
  addConditionalData,
  updateConditionalData,
  fetchUserAccessibleTeams
} from '../../services/conditionalService';
import { getCurrentUser, isUserAdmin } from '../../services/auth';

const ConditionalDevelopmentScreen = ({ navigation }) => {
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
  
  const [conditionalData, setConditionalData] = useState({
    vo2_max: '',
    lactate_levels: '',
    training_intensity: '',
    recovery_times: '',
    current_vo2_max: '',
    current_lactate_levels: '',
    current_muscle_strength: '',
    target_vo2_max: '',
    target_lactate_level: '',
    target_muscle_strength: ''
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
      const data = await fetchConditionalDataByDate(
        selectedFootballer.footballer_id,
        formattedDate
      );
      if (data) {
        setExistingEntry(data);
        setConditionalData({
          vo2_max: data.vo2_max ? data.vo2_max.toString() : '',
          muscle_strength: data.muscle_strength ? data.muscle_strength.toString() : '',
          muscle_endurance: data.muscle_endurance ? data.lactate_levels.toString() : '',
          training_intensity: data.training_intensity ? data.training_intensity.toString() : '',
          recovery_times: data.recovery_times ? data.recovery_times.toString() : '',
          current_vo2_max: data.current_vo2_max ? data.current_vo2_max.toString() : '',
          current_lactate_levels: data.current_lactate_levels ? data.current_lactate_levels.toString() : '',
          current_muscle_strength: data.current_muscle_strength ? data.current_muscle_strength.toString() : '',
          target_vo2_max: data.target_vo2_max ? data.target_vo2_max.toString() : '',
          target_lactate_level: data.target_lactate_level ? data.target_lactate_level.toString() : '',
          target_muscle_strength: data.target_muscle_strength ? data.target_muscle_strength.toString() : ''
        });
      } else {
        // Reset form for new entry
        setExistingEntry(null);
        setConditionalData({
            vo2_max: '',
            lactate_levels: '',
            training_intensity: '',
            recovery_times: '',
            current_vo2_max: '',
            current_lactate_levels: '',
            current_muscle_strength: '',
            target_vo2_max: '',
            target_lactate_level: '',
            target_muscle_strength: ''
        });
      }
    } catch (error) {
      console.error('Error checking existing data:', error);
      setExistingEntry(null);
      setConditionalData({
        vo2_max: '',
        lactate_levels: '',
        training_intensity: '',
        recovery_times: '',
        current_vo2_max: '',
        current_lactate_levels: '',
        current_muscle_strength: '',
        target_vo2_max: '',
        target_lactate_level: '',
        target_muscle_strength: ''
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
        const data = await fetchConditionalDataByDate(
          selectedFootballer.footballer_id,
          formattedDate
        );
        
        if (data && data.id) {
          setExistingEntry(data);
          setConditionalData({
            vo2_max: data.vo2_max ? data.vo2_max.toString() : '',
            muscle_strength: data.muscle_strength ? data.muscle_strength.toString() : '',
            muscle_endurance: data.muscle_endurance ? data.lactate_levels.toString() : '',
            training_intensity: data.training_intensity ? data.training_intensity.toString() : '',
            recovery_times: data.recovery_times ? data.recovery_times.toString() : '',
            current_vo2_max: data.current_vo2_max ? data.current_vo2_max.toString() : '',
            current_lactate_levels: data.current_lactate_levels ? data.current_lactate_levels.toString() : '',
            current_muscle_strength: data.current_muscle_strength ? data.current_muscle_strength.toString() : '',
            target_vo2_max: data.target_vo2_max ? data.target_vo2_max.toString() : '',
            target_lactate_level: data.target_lactate_level ? data.target_lactate_level.toString() : '',
            target_muscle_strength: data.target_muscle_strength ? data.target_muscle_strength.toString() : ''
          });
        } else {
          setExistingEntry(null);
          setConditionalData({
            vo2_max: '',
            lactate_levels: '',
            training_intensity: '',
            recovery_times: '',
            current_vo2_max: '',
            current_lactate_levels: '',
            current_muscle_strength: '',
            target_vo2_max: '',
            target_lactate_level: '',
            target_muscle_strength: ''
          });
        }
      } catch (error) {
        console.error('Error fetching data by date:', error);
        setExistingEntry(null);
        setConditionalData({
          vo2_max: '',
          lactate_levels: '',
          training_intensity: '',
          recovery_times: '',
          current_vo2_max: '',
          current_lactate_levels: '',
          current_muscle_strength: '',
          target_vo2_max: '',
          target_lactate_level: '',
          target_muscle_strength: ''
        });
      }
    }
  };
  
  const handleInputChange = (field, value) => {
    setConditionalData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = async () => {
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    const dataToSubmit = {
      ...conditionalData,
      created_at: formattedDate // Tarihi veriye ekle
    };
    
    // API çağrılarını güncelle
    if (existingEntry) {
      await updateConditionalData(existingEntry.id, dataToSubmit);
    } else {
      await addConditionalData(selectedFootballer.footballer_id, dataToSubmit);
    }
  };
  
  const navigateBack = () => {
    navigation.goBack();
  };
  
  // Render selection screens
  const renderLeagueSelection = () => (
    <View style={styles.selectionContainer}>
      <View style={styles.selectionHeader}>
        <View style={styles.headerIconContainer}>
          <Ionicons name="trophy-outline" size={24} color="#0EA5E9" />
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
              colors={['rgba(14, 165, 233, 0.08)', 'rgba(14, 165, 233, 0.04)']}
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
                <MaterialIcons name="arrow-forward-ios" size={16} color="#0EA5E9" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

    const renderTeamSelection = () => (
    <View style={styles.selectionContainer}>
      <View style={styles.selectionHeader}>
        <View style={styles.headerIconContainer}>
          <Ionicons name="people-outline" size={24} color="#0EA5E9" />
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
              colors={['rgba(14, 165, 233, 0.08)', 'rgba(14, 165, 233, 0.04)']}
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
                <MaterialIcons name="arrow-forward-ios" size={16} color="#0EA5E9" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
  const renderFootballerSelection = () => (
    <View style={styles.selectionContainer}>
      <View style={styles.selectionHeader}>
        <View style={styles.headerIconContainer}>
          <Ionicons name="person-outline" size={24} color="#0EA5E9" />
        </View>
        <Text style={styles.selectionTitle}>Select Player</Text>
        <Text style={styles.selectionSubtitle}>Choose the player for conditioning assessment</Text>
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
              colors={['rgba(14, 165, 233, 0.08)', 'rgba(14, 165, 233, 0.04)']}
              style={styles.playerCardGradient}
            >              <View style={styles.playerCardContent}>
                <View style={styles.playerImageContainer}>
                  {footballer.footballer_img_path ? (
                    <Image 
                      source={{ uri: footballer.footballer_img_path }} 
                      style={styles.playerImage} 
                    />
                  ) : (
                    <View style={styles.playerImagePlaceholder}>
                      <Ionicons name="person" size={32} color="#0EA5E9" />
                    </View>
                  )}                  {footballer.trikot_num && (
                    <JerseyNumber 
                      number={footballer.trikot_num}
                      color="#0EA5E9"
                      size="small"
                      style={styles.jerseyComponent}
                    />
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
                        <Text style={styles.playerDetailValue}>{footballer.height}</Text>                      </View>
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
                          color="#0EA5E9"
                          size="small"
                          style={styles.jerseyComponent}
                        />
                      )}
                    </View>
                  </View>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={20} color="#0EA5E9" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
    const renderDataForm = () => (
    <View style={styles.formContainer}>
      {/* Player Header */}
      <View style={styles.playerHeader}>
        <LinearGradient
          colors={['rgba(14, 165, 233, 0.1)', 'rgba(14, 165, 233, 0.05)']}
          style={styles.playerHeaderGradient}
        >
          <View style={styles.playerHeaderContent}>            <View style={styles.playerHeaderImageContainer}>
              {selectedFootballer.footballer_img_path ? (
                <Image 
                  source={{ uri: selectedFootballer.footballer_img_path }} 
                  style={styles.playerHeaderImage} 
                />
              ) : (
                <View style={styles.playerHeaderImagePlaceholder}>
                  <Ionicons name="person" size={32} color="#0EA5E9" />
                </View>              )}
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
                      color="#0EA5E9"
                      size="small"
                      style={styles.jerseyComponent}
                    />
                  )}
                </View>
              </View>              <View style={styles.assessmentBadge}>
                <Feather name="activity" size={12} color="#0EA5E9" />
                <Text style={styles.assessmentBadgeText}>Conditioning Data Entry</Text>
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
                
          {/* Performance Metrics Section */}
          <View style={styles.formSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <Ionicons name="speedometer-outline" size={20} color="#0EA5E9" />
              </View>
              <Text style={styles.sectionTitle}>Performance Metrics</Text>
            </View>
            
            <View style={styles.inputGrid}>
              <MetricInput
                label="VO2 Max"
                value={conditionalData.vo2_max}
                onChangeText={(text) => handleInputChange('vo2_max', text)}
                unit="ml/kg/min"
                containerStyle={styles.inputContainer}
              />
              
              <MetricInput
                label="Lactate Levels"
                value={conditionalData.lactate_levels}
                onChangeText={(text) => handleInputChange('lactate_levels', text)}
                unit="mmol/L"
                containerStyle={styles.inputContainer}
              />
              
              <MetricInput
                label="Training Intensity"
                value={conditionalData.training_intensity}
                onChangeText={(text) => handleInputChange('training_intensity', text)}
                unit="1-10"
                decimal={false}
                containerStyle={styles.inputContainer}
              />
              
              <MetricInput
                label="Recovery Times"
                value={conditionalData.recovery_times}
                onChangeText={(text) => handleInputChange('recovery_times', text)}
                unit="hours"
                containerStyle={styles.inputContainer}
              />
            </View>
          </View>
          
          {/* Current Metrics Section */}
          <View style={styles.formSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <Ionicons name="analytics-outline" size={20} color="#00B8CC" />
              </View>
              <Text style={styles.sectionTitle}>Current Metrics</Text>
            </View>
            
            <View style={styles.inputGrid}>
              <MetricInput
                label="Current VO2 Max"
                value={conditionalData.current_vo2_max}
                onChangeText={(text) => handleInputChange('current_vo2_max', text)}
                unit="ml/kg/min"
                containerStyle={styles.inputContainer}
              />
              
              <MetricInput
                label="Current Lactate"
                value={conditionalData.current_lactate_levels}
                onChangeText={(text) => handleInputChange('current_lactate_levels', text)}
                unit="mmol/L"
                containerStyle={styles.inputContainer}
              />
              
              <MetricInput
                label="Current Strength"
                value={conditionalData.current_muscle_strength}
                onChangeText={(text) => handleInputChange('current_muscle_strength', text)}
                unit="kg"
                containerStyle={styles.inputContainer}
              />
            </View>
          </View>
          
          {/* Target Metrics Section */}
          <View style={styles.formSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <Ionicons name="target-outline" size={20} color="#8B5FBF" />
              </View>
              <Text style={styles.sectionTitle}>Target Metrics</Text>
            </View>
            
            <View style={styles.inputGrid}>
              <MetricInput
                label="Target VO2 Max"
                value={conditionalData.target_vo2_max}
                onChangeText={(text) => handleInputChange('target_vo2_max', text)}
                unit="ml/kg/min"
                containerStyle={styles.inputContainer}
              />
              
              <MetricInput
                label="Target Lactate"
                value={conditionalData.target_lactate_level}
                onChangeText={(text) => handleInputChange('target_lactate_level', text)}
                unit="mmol/L"
                containerStyle={styles.inputContainer}
              />
              
              <MetricInput
                label="Target Strength"
                value={conditionalData.target_muscle_strength}
                onChangeText={(text) => handleInputChange('target_muscle_strength', text)}
                unit="kg"
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
              colors={['#0EA5E9', '#00B8CC']}
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
          </TouchableOpacity>        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0EA5E9" />
          <Text style={styles.loadingText}>Loading data...</Text>
        </View>
      );
    }
    
    // For non-admin users, skip league selection if they have an auto-selected team
    if (isAdmin && !selectedLeague) return renderLeagueSelection();
    if (!selectedTeam) return renderTeamSelection();
    if (!selectedFootballer) return renderFootballerSelection();
    
    return renderDataForm();
  };
  
  return (
    <View style={styles.container}>
      {/* Professional Header */}
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
              <Text style={styles.headerTitle}>Conditioning Data Entry</Text>
              <Text style={styles.headerSubtitle}>Performance conditioning and metabolic data recording</Text>
            </View>
            <View style={styles.headerRight}>
              <View style={styles.headerBadge}>
                <Ionicons name="speedometer-outline" size={16} color="#0EA5E9" />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
      
      {renderContent()}
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
    backgroundColor: 'rgba(14, 165, 233, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.25)',
  },

  // Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '500',
  },

  // Selection Styles
  selectionContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  selectionHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(14, 165, 233, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(14, 165, 233, 0.25)',
  },
  selectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  selectionSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
  },
  selectionList: {
    flex: 1,
  },
  selectionCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  selectionCardGradient: {
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.15)',
    borderRadius: 16,
  },
  selectionCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  selectionImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(14, 165, 233, 0.2)',
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
  },
  playerCardGradient: {
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.15)',
    borderRadius: 16,
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
    borderColor: 'rgba(14, 165, 233, 0.2)',
    elevation: 4,
    shadowColor: '#0EA5E9',
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
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },    jerseyComponent: {
    elevation: 6,
    shadowColor: '#0EA5E9',
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
    color: '#0EA5E9',
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
    borderColor: 'rgba(14, 165, 233, 0.3)',
  },
  
  nationalityFlag: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  // Form Styles
  formContainer: {
    flex: 1,
  },
  playerHeader: {
    marginHorizontal: 24,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  playerHeaderGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.15)',
  },
  playerHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },  playerHeaderImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 20,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'rgba(14, 165, 233, 0.2)',
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
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
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
    color: '#0EA5E9',
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
    backgroundColor: 'rgba(14, 165, 233, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 4,
  },
  assessmentBadgeText: {
    fontSize: 11,
    color: '#0EA5E9',
    fontWeight: '600',
  },

  // Date Section
  dateSection: {
    marginHorizontal: 24,
    marginBottom: 20,
  },
  dateSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  dateSelector: {
    // DatePicker component styles
  },

  // Form Section Styles
  formScrollView: {
    flex: 1,
  },
  formScrollContent: {
    paddingBottom: 40,
  },
  formSection: {
    marginHorizontal: 24,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  sectionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(14, 165, 233, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.25)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
    letterSpacing: 0.2,
  },
  inputGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  inputContainer: {
    width: '48%',
  },

  // Submit Button
  submitButton: {
    marginHorizontal: 24,
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#0EA5E9',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  submitButtonGradient: {
    padding: 18,
  },
  submitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});

export default ConditionalDevelopmentScreen;