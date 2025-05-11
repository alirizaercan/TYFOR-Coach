// mobile/src/screens/Development/PhysicalDevelopmentScreen.js
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
  fetchPhysicalDataByDate,
  addPhysicalData,
  updatePhysicalData
} from '../../services/physicalService';

const PhysicalDevelopmentScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [leagues, setLeagues] = useState([]);
  const [teams, setTeams] = useState([]);
  const [footballers, setFootballers] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedFootballer, setSelectedFootballer] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [existingEntry, setExistingEntry] = useState(null);

  const [physicalData, setPhysicalData] = useState({
    muscle_mass: '',
    muscle_strength: '',
    muscle_endurance: '',
    flexibility: '',
    weight: '',
    body_fat_percentage: '',
    heights: '',
    thigh_circumference: '',
    shoulder_circumference: '',
    arm_circumference: '',
    chest_circumference: '',
    back_circumference: '',
    waist_circumference: '',
    leg_circumference: '',
    calf_circumference: ''
  });

  // Fetch data functions
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
      const data = await fetchPhysicalDataByDate(
        selectedFootballer.footballer_id,
        formattedDate
      );
  
      if (data) {
        setExistingEntry(data);
        setPhysicalData({
          muscle_mass: data.muscle_mass?.toString() || '',
          muscle_strength: data.muscle_strength?.toString() || '',
          muscle_endurance: data.muscle_endurance?.toString() || '',
          flexibility: data.flexibility?.toString() || '',
          weight: data.weight?.toString() || '',
          body_fat_percentage: data.body_fat_percentage?.toString() || '',
          heights: data.heights?.toString() || '',
          thigh_circumference: data.thigh_circumference?.toString() || '',
          shoulder_circumference: data.shoulder_circumference?.toString() || '',
          arm_circumference: data.arm_circumference?.toString() || '',
          chest_circumference: data.chest_circumference?.toString() || '',
          back_circumference: data.back_circumference?.toString() || '',
          waist_circumference: data.waist_circumference?.toString() || '',
          leg_circumference: data.leg_circumference?.toString() || '',
          calf_circumference: data.calf_circumference?.toString() || ''
        });
      } else {
        // Boş veri dönmüşse formu temizle
        setExistingEntry(null);
        setPhysicalData({
          muscle_mass: '',
          muscle_strength: '',
          muscle_endurance: '',
          flexibility: '',
          weight: '',
          body_fat_percentage: '',
          heights: '',
          thigh_circumference: '',
          shoulder_circumference: '',
          arm_circumference: '',
          chest_circumference: '',
          back_circumference: '',
          waist_circumference: '',
          leg_circumference: '',
          calf_circumference: ''
        });
      }
    } catch (error) {
      console.error('Error checking existing data:', error);
      setExistingEntry(null);
      setPhysicalData({
          muscle_mass: '',
          muscle_strength: '',
          muscle_endurance: '',
          flexibility: '',
          weight: '',
          body_fat_percentage: '',
          heights: '',
          thigh_circumference: '',
          shoulder_circumference: '',
          arm_circumference: '',
          chest_circumference: '',
          back_circumference: '',
          waist_circumference: '',
          leg_circumference: '',
          calf_circumference: ''
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
        const data = await fetchPhysicalDataByDate(
          selectedFootballer.footballer_id,
          formattedDate
        );
  
        if (data && data.id) {
          setExistingEntry(data);
          setPhysicalData({
            muscle_mass: data.muscle_mass?.toString() || '',
            muscle_strength: data.muscle_strength?.toString() || '',
            muscle_endurance: data.muscle_endurance?.toString() || '',
            flexibility: data.flexibility?.toString() || '',
            weight: data.weight?.toString() || '',
            body_fat_percentage: data.body_fat_percentage?.toString() || '',
            heights: data.heights?.toString() || '',
            thigh_circumference: data.thigh_circumference?.toString() || '',
            shoulder_circumference: data.shoulder_circumference?.toString() || '',
            arm_circumference: data.arm_circumference?.toString() || '',
            chest_circumference: data.chest_circumference?.toString() || '',
            back_circumference: data.back_circumference?.toString() || '',
            waist_circumference: data.waist_circumference?.toString() || '',
            leg_circumference: data.leg_circumference?.toString() || '',
            calf_circumference: data.calf_circumference?.toString() || ''
          });
        } else {
          // Clear form for new entry
          setExistingEntry(null);
          setPhysicalData({
            muscle_mass: '',
            muscle_strength: '',
            muscle_endurance: '',
            flexibility: '',
            weight: '',
            body_fat_percentage: '',
            heights: '',
            thigh_circumference: '',
            shoulder_circumference: '',
            arm_circumference: '',
            chest_circumference: '',
            back_circumference: '',
            waist_circumference: '',
            leg_circumference: '',
            calf_circumference: ''
          });
        }
      } catch (error) {
        console.log('Error fetching data for date:', error);
        // Clear form on error
        setExistingEntry(null);
        setPhysicalData({
          muscle_mass: '',
          muscle_strength: '',
          muscle_endurance: '',
          flexibility: '',
          weight: '',
          body_fat_percentage: '',
          heights: '',
          thigh_circumference: '',
          shoulder_circumference: '',
          arm_circumference: '',
          chest_circumference: '',
          back_circumference: '',
          waist_circumference: '',
          leg_circumference: '',
          calf_circumference: ''
        });
      }
    }
  };
  

  const handleInputChange = (field, value) => {
    setPhysicalData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    const dataToSubmit = {
      ...physicalData,
      created_at: formattedDate // Tarihi veriye ekle
    };
    
    // API çağrılarını güncelle
    if (existingEntry) {
      await updatePhysicalData(existingEntry.id, dataToSubmit);
    } else {
      await addPhysicalData(selectedFootballer.footballer_id, dataToSubmit);
    }
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
          <Text style={developmentStyles.sectionTitle}>Muscle Metrics</Text>
          
          <View style={developmentStyles.inputRow}>
            <MetricInput
              label="Muscle Mass"
              value={physicalData.muscle_mass}
              onChangeText={(text) => handleInputChange('muscle_mass', text)}
              unit="kg"
              containerStyle={developmentStyles.inputContainer}
            />
            
            <MetricInput
              label="Muscle Strength"
              value={physicalData.muscle_strength}
              onChangeText={(text) => handleInputChange('muscle_strength', text)}
              unit="kg"
              containerStyle={developmentStyles.inputContainer}
            />
          </View>
          
          <View style={developmentStyles.inputRow}>
            <MetricInput
              label="Muscle Endurance"
              value={physicalData.muscle_endurance}
              onChangeText={(text) => handleInputChange('muscle_endurance', text)}
              unit="reps"
              decimal={false}
              containerStyle={developmentStyles.inputContainer}
            />
            
            <MetricInput
              label="Flexibility"
              value={physicalData.flexibility}
              onChangeText={(text) => handleInputChange('flexibility', text)}
              unit="cm"
              containerStyle={developmentStyles.inputContainer}
            />
          </View>
        </View>
        
        <View style={developmentStyles.formSection}>
          <Text style={developmentStyles.sectionTitle}>Body Composition</Text>
          
          <View style={developmentStyles.inputRow}>
            <MetricInput
              label="Weight"
              value={physicalData.weight}
              onChangeText={(text) => handleInputChange('weight', text)}
              unit="kg"
              containerStyle={developmentStyles.inputContainer}
            />
            
            <MetricInput
              label="Body Fat"
              value={physicalData.body_fat_percentage}
              onChangeText={(text) => handleInputChange('body_fat_percentage', text)}
              unit="%"
              containerStyle={developmentStyles.inputContainer}
            />
          </View>
          
          <View style={developmentStyles.inputRow}>
            <MetricInput
              label="Height"
              value={physicalData.heights}
              onChangeText={(text) => handleInputChange('heights', text)}
              unit="cm"
              containerStyle={{ width: '48%' }}
            />
          </View>
        </View>
        
        <View style={developmentStyles.formSection}>
          <Text style={developmentStyles.sectionTitle}>Body Measurements</Text>
          
          <View style={developmentStyles.inputRow}>
            <MetricInput
              label="Thigh"
              value={physicalData.thigh_circumference}
              onChangeText={(text) => handleInputChange('thigh_circumference', text)}
              unit="cm"
              containerStyle={developmentStyles.inputContainer}
            />
            
            <MetricInput
              label="Shoulder"
              value={physicalData.shoulder_circumference}
              onChangeText={(text) => handleInputChange('shoulder_circumference', text)}
              unit="cm"
              containerStyle={developmentStyles.inputContainer}
            />
          </View>
          
          <View style={developmentStyles.inputRow}>
            <MetricInput
              label="Arm"
              value={physicalData.arm_circumference}
              onChangeText={(text) => handleInputChange('arm_circumference', text)}
              unit="cm"
              containerStyle={developmentStyles.inputContainer}
            />
            
            <MetricInput
              label="Chest"
              value={physicalData.chest_circumference}
              onChangeText={(text) => handleInputChange('chest_circumference', text)}
              unit="cm"
              containerStyle={developmentStyles.inputContainer}
            />
          </View>
          
          <View style={developmentStyles.inputRow}>
            <MetricInput
              label="Back"
              value={physicalData.back_circumference}
              onChangeText={(text) => handleInputChange('back_circumference', text)}
              unit="cm"
              containerStyle={developmentStyles.inputContainer}
            />
            
            <MetricInput
              label="Waist"
              value={physicalData.waist_circumference}
              onChangeText={(text) => handleInputChange('waist_circumference', text)}
              unit="cm"
              containerStyle={developmentStyles.inputContainer}
            />
          </View>
          
          <View style={developmentStyles.inputRow}>
            <MetricInput
              label="Leg"
              value={physicalData.leg_circumference}
              onChangeText={(text) => handleInputChange('leg_circumference', text)}
              unit="cm"
              containerStyle={developmentStyles.inputContainer}
            />
            
            <MetricInput
              label="Calf"
              value={physicalData.calf_circumference}
              onChangeText={(text) => handleInputChange('calf_circumference', text)}
              unit="cm"
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
        <Text style={developmentStyles.headerTitle}>Physical Development</Text>
      </View>
      
      {renderContent()}
    </View>
  );
};

export default PhysicalDevelopmentScreen;