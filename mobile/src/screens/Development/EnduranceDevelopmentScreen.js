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
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

// Custom components
import DatePicker from '../../components/DatePicker';
import MetricInput from '../../components/MetricInput';

// Styles
import { colors } from '../../styles/commonStyles';
import developmentStyles from '../../styles/developmentStyles';

// Services
import {
  fetchLeagues,
  fetchTeamsByLeague,
  fetchFootballersByTeam,
  fetchEnduranceDataByDate,
  addEnduranceData,
  updateEnduranceData
} from '../../services/enduranceService';

const EnduranceDevelopmentScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
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
  
  // Fetch leagues on component mount
  useEffect(() => {
    loadLeagues();
  }, []);

  useEffect(() => {
    if (selectedLeague) {
      loadTeams(selectedLeague.league_id);
      setSelectedTeam(null);
      setSelectedFootballer(null);
    }
  }, [selectedLeague]);

  useEffect(() => {
    if (selectedTeam) {
      loadFootballers(selectedTeam.team_id);
      setSelectedFootballer(null);
    }
  }, [selectedTeam]);

  useEffect(() => {
    if (selectedFootballer && selectedDate) {
      checkExistingData();
    }
  }, [selectedFootballer, selectedDate]);
  

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
  };
  
  // Render functions
  const renderLeagueSelection = () => (
    <ScrollView style={developmentStyles.selectionContainer}>
      <Text style={developmentStyles.selectionTitle}>Select a League</Text>
      {leagues.map(league => (
        <TouchableOpacity
          key={league.league_id}
          style={developmentStyles.selectionItem}
          onPress={() => setSelectedLeague(league)}
        >
          {league.league_logo_path && (
            <Image 
              source={{ uri: league.league_logo_path }} 
              style={developmentStyles.selectionImage} 
            />
          )}
          <Text style={developmentStyles.selectionText}>{league.league_name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderTeamSelection = () => (
    <ScrollView style={developmentStyles.selectionContainer}>
      <Text style={developmentStyles.selectionTitle}>Select a Team</Text>
      {teams.map(team => (
        <TouchableOpacity
          key={team.team_id}
          style={developmentStyles.selectionItem}
          onPress={() => setSelectedTeam(team)}
        >
          {team.img_path && (
            <Image 
              source={{ uri: team.img_path }} 
              style={developmentStyles.selectionImage} 
            />
          )}
          <Text style={developmentStyles.selectionText}>{team.team_name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderFootballerSelection = () => (
    <ScrollView style={developmentStyles.selectionContainer}>
      <Text style={developmentStyles.selectionTitle}>Select a Footballer</Text>
      {footballers.map(footballer => (
        <TouchableOpacity
          key={footballer.footballer_id}
          style={developmentStyles.selectionItem}
          onPress={() => setSelectedFootballer(footballer)}
        >
          {footballer.footballer_img_path && (
            <Image 
              source={{ uri: footballer.footballer_img_path }} 
              style={developmentStyles.selectionImage} 
            />
          )}
          <View style={developmentStyles.footballerInfo}>
            <Text style={developmentStyles.selectionText}>{footballer.footballer_name}</Text>
            <Text style={developmentStyles.footballerDetail}>{footballer.position}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  
  // Render data form when footballer is selected
  const renderDataForm = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView style={developmentStyles.formContainer}>
        <View style={developmentStyles.footballerHeader}>
          {selectedFootballer.footballer_img_path && (
            <Image 
              source={{ uri: selectedFootballer.footballer_img_path }} 
              style={developmentStyles.footballerImage} 
            />
          )}
          <View style={developmentStyles.footballerHeaderInfo}>
            <Text style={developmentStyles.footballerName}>{selectedFootballer.footballer_name}</Text>
            <Text style={developmentStyles.footballerPosition}>{selectedFootballer.position}</Text>
          </View>
        </View>
        
        <DatePicker 
          label="Select Date"
          date={selectedDate}
          onDateChange={handleDateChange}
          containerStyle={developmentStyles.dateSelector}
        />
        
        <View style={developmentStyles.formSection}>
          <Text style={developmentStyles.sectionTitle}>Running Performance</Text>
          
          <View style={developmentStyles.inputRow}>
            <MetricInput
              label="Distance"
              value={enduranceData.running_distance}
              onChangeText={(text) => handleInputChange('running_distance', text)}
              unit="km"
              containerStyle={developmentStyles.inputContainer}
            />
            
            <MetricInput
              label="Avg Speed"
              value={enduranceData.average_speed}
              onChangeText={(text) => handleInputChange('average_speed', text)}
              unit="km/h"
              containerStyle={developmentStyles.inputContainer}
            />
          </View>
        </View>
        
        <View style={developmentStyles.formSection}>
          <Text style={developmentStyles.sectionTitle}>Cardiovascular Metrics</Text>
          
          <View style={developmentStyles.inputRow}>
            <MetricInput
              label="Heart Rate"
              value={enduranceData.heart_rate}
              onChangeText={(text) => handleInputChange('heart_rate', text)}
              unit="bpm"
              decimal={false}
              containerStyle={developmentStyles.inputContainer}
            />
            
            <MetricInput
              label="Peak Heart Rate"
              value={enduranceData.peak_heart_rate}
              onChangeText={(text) => handleInputChange('peak_heart_rate', text)}
              unit="bpm"
              decimal={false}
              containerStyle={developmentStyles.inputContainer}
            />
          </View>
        </View>
        
        <View style={developmentStyles.formSection}>
          <Text style={developmentStyles.sectionTitle}>Training Information</Text>
          
          <View style={developmentStyles.inputRow}>
            <MetricInput
              label="Training Intensity"
              value={enduranceData.training_intensity}
              onChangeText={(text) => handleInputChange('training_intensity', text)}
              unit="1-10"
              decimal={false}
              containerStyle={developmentStyles.inputContainer}
            />
            
            <MetricInput
              label="Session Number"
              value={enduranceData.session}
              onChangeText={(text) => handleInputChange('session', text)}
              unit="#"
              decimal={false}
              containerStyle={developmentStyles.inputContainer}
            />
          </View>
        </View>
        
        <TouchableOpacity 
          style={developmentStyles.submitButton} 
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={developmentStyles.submitButtonText}>
            {existingEntry ? 'Update Data' : 'Save Data'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
  
  const renderContent = () => {
    if (loading) {
      return (
        <View style={developmentStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }
    
    if (!selectedLeague) return renderLeagueSelection();
    if (!selectedTeam) return renderTeamSelection();
    if (!selectedFootballer) return renderFootballerSelection();
    
    return renderDataForm();
  };
  
  return (
    <View style={developmentStyles.container}>
      <View style={developmentStyles.header}>
        <TouchableOpacity 
          style={developmentStyles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={developmentStyles.headerTitle}>Endurance Development</Text>
      </View>
      
      {renderContent()}
    </View>
  );
};

export default EnduranceDevelopmentScreen;