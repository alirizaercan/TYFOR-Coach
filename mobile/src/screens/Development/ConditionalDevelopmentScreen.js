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
  fetchConditionalDataByDate,
  addConditionalData,
  updateConditionalData
} from '../../services/conditionalService';

const ConditionalDevelopmentScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
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
  
  // Fetch leagues on component mount
  useEffect(() => {
    loadLeagues();
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
          <Text style={developmentStyles.sectionTitle}>Performance Metrics</Text>
          
          <View style={developmentStyles.inputRow}>
            <MetricInput
              label="VO2 Max"
              value={conditionalData.vo2_max}
              onChangeText={(text) => handleInputChange('vo2_max', text)}
              unit="ml/kg/min"
              containerStyle={developmentStyles.inputContainer}
            />
            
            <MetricInput
              label="Lactate Levels"
              value={conditionalData.lactate_levels}
              onChangeText={(text) => handleInputChange('lactate_levels', text)}
              unit="mmol/L"
              containerStyle={developmentStyles.inputContainer}
            />
          </View>
          
          <View style={developmentStyles.inputRow}>
            <MetricInput
              label="Training Intensity"
              value={conditionalData.training_intensity}
              onChangeText={(text) => handleInputChange('training_intensity', text)}
              unit="1-10"
              decimal={false}
              containerStyle={developmentStyles.inputContainer}
            />
            
            <MetricInput
              label="Recovery Times"
              value={conditionalData.recovery_times}
              onChangeText={(text) => handleInputChange('recovery_times', text)}
              unit="hours"
              containerStyle={developmentStyles.inputContainer}
            />
          </View>
        </View>
        
        <View style={developmentStyles.formSection}>
          <Text style={developmentStyles.sectionTitle}>Current Metrics</Text>
          
          <View style={developmentStyles.inputRow}>
            <MetricInput
              label="Current VO2 Max"
              value={conditionalData.current_vo2_max}
              onChangeText={(text) => handleInputChange('current_vo2_max', text)}
              unit="ml/kg/min"
              containerStyle={developmentStyles.inputContainer}
            />
            
            <MetricInput
              label="Current Lactate Levels"
              value={conditionalData.current_lactate_levels}
              onChangeText={(text) => handleInputChange('current_lactate_levels', text)}
              unit="mmol/L"
              containerStyle={developmentStyles.inputContainer}
            />
          </View>
          
          <View style={developmentStyles.inputRow}>
            <MetricInput
              label="Current Muscle Strength"
              value={conditionalData.current_muscle_strength}
              onChangeText={(text) => handleInputChange('current_muscle_strength', text)}
              unit="kg"
              containerStyle={developmentStyles.inputContainer}
            />
          </View>
        </View>
        
        <View style={developmentStyles.formSection}>
          <Text style={developmentStyles.sectionTitle}>Target Metrics</Text>
          
          <View style={developmentStyles.inputRow}>
            <MetricInput
              label="Target VO2 Max"
              value={conditionalData.target_vo2_max}
              onChangeText={(text) => handleInputChange('target_vo2_max', text)}
              unit="ml/kg/min"
              containerStyle={developmentStyles.inputContainer}
            />
            
            <MetricInput
              label="Target Lactate Level"
              value={conditionalData.target_lactate_level}
              onChangeText={(text) => handleInputChange('target_lactate_level', text)}
              unit="mmol/L"
              containerStyle={developmentStyles.inputContainer}
            />
          </View>
          
          <View style={developmentStyles.inputRow}>
            <MetricInput
              label="Target Muscle Strength"
              value={conditionalData.target_muscle_strength}
              onChangeText={(text) => handleInputChange('target_muscle_strength', text)}
              unit="kg"
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
        <Text style={developmentStyles.headerTitle}>Conditional Development</Text>
      </View>
      
      {renderContent()}
    </View>
  );
};

export default ConditionalDevelopmentScreen;