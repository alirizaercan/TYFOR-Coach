// mobile/src/services/enduranceService.js
import { ENDURANCE_ENDPOINTS } from '../constants/api';
import { get, post, put, del } from './api';

// Get all leagues
export const fetchLeagues = async () => {
  try {
    return await get(ENDURANCE_ENDPOINTS.LEAGUES);
  } catch (error) {
    console.error('Error fetching leagues:', error);
    throw error;
  }
};

// Get teams by league ID
export const fetchTeamsByLeague = async (leagueId) => {
  try {
    return await get(`${ENDURANCE_ENDPOINTS.TEAMS}/${leagueId}`);
  } catch (error) {
    console.error(`Error fetching teams for league ${leagueId}:`, error);
    throw error;
  }
};

// Get footballers by team ID
export const fetchFootballersByTeam = async (teamId) => {
  try {
    return await get(`${ENDURANCE_ENDPOINTS.FOOTBALLERS}/${teamId}`);
  } catch (error) {
    console.error(`Error fetching footballers for team ${teamId}:`, error);
    throw error;
  }
};

// Get endurance data for a footballer
export const fetchEnduranceData = async (footballerId, startDate = null, endDate = null) => {
  try {
    let url = `${ENDURANCE_ENDPOINTS.ENDURANCE_DATA}/${footballerId}`;
    
    // Add date range if provided
    if (startDate && endDate) {
      url += `?start_date=${startDate}&end_date=${endDate}`;
    }
    
    return await get(url);
  } catch (error) {
    console.error(`Error fetching endurance data for footballer ${footballerId}:`, error);
    throw error;
  }
};

// Get endurance data for a specific date
export const fetchEnduranceDataByDate = async (footballerId, date) => {
  try {
    return await get(`${ENDURANCE_ENDPOINTS.ENDURANCE_DATA}/${footballerId}/${date}`);
  } catch (error) {
    console.error(`Error fetching endurance data for date ${date}:`, error);
    throw error;
  }
};

// Add new endurance data
export const addEnduranceData = async (footballerId, data) => {
  try {
    return await post(`${ENDURANCE_ENDPOINTS.ENDURANCE_DATA}/${footballerId}`, data);
  } catch (error) {
    console.error('Error adding endurance data:', error);
    throw error;
  }
};

// Update existing endurance data
export const updateEnduranceData = async (entryId, data) => {
  try {
    return await put(`${ENDURANCE_ENDPOINTS.ENDURANCE_DATA}/${entryId}`, data);
  } catch (error) {
    console.error(`Error updating endurance data entry ${entryId}:`, error);
    throw error;
  }
};

// Delete endurance data entry
export const deleteEnduranceData = async (entryId) => {
  try {
    return await del(`${ENDURANCE_ENDPOINTS.ENDURANCE_DATA}/${entryId}`);
  } catch (error) {
    console.error(`Error deleting endurance data entry ${entryId}:`, error);
    throw error;
  }
};

// Get endurance data history
export const fetchEnduranceHistory = async (footballerId, limit = 10) => {
  try {
    return await get(`${ENDURANCE_ENDPOINTS.ENDURANCE_HISTORY}/${footballerId}?limit=${limit}`);
  } catch (error) {
    console.error(`Error fetching endurance history for footballer ${footballerId}:`, error);
    throw error;
  }
};

// Generate graph for endurance data
export const generateEnduranceGraph = async (graphParams) => {
  try {
    return await post(ENDURANCE_ENDPOINTS.GENERATE_GRAPH, graphParams);
  } catch (error) {
    console.error('Error generating endurance graph:', error);
    throw error;
  }
};