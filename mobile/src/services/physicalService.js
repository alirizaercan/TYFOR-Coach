// mobile/src/services/physicalService.js
import { PHYSICAL_ENDPOINTS } from '../constants/api';
import { get, post, put, del } from './api';

// Get all leagues
export const fetchLeagues = async () => {
  try {
    return await get(PHYSICAL_ENDPOINTS.LEAGUES);
  } catch (error) {
    console.error('Error fetching leagues:', error);
    throw error;
  }
};

// Get teams by league ID
export const fetchTeamsByLeague = async (leagueId) => {
  try {
    return await get(`${PHYSICAL_ENDPOINTS.TEAMS}/${leagueId}`);
  } catch (error) {
    console.error(`Error fetching teams for league ${leagueId}:`, error);
    throw error;
  }
};

// Get footballers by team ID
export const fetchFootballersByTeam = async (teamId) => {
  try {
    return await get(`${PHYSICAL_ENDPOINTS.FOOTBALLERS}/${teamId}`);
  } catch (error) {
    console.error(`Error fetching footballers for team ${teamId}:`, error);
    throw error;
  }
};

// Get physical data for a footballer
export const fetchPhysicalData = async (footballerId, startDate = null, endDate = null) => {
  try {
    let url = `${PHYSICAL_ENDPOINTS.PHYSICAL_DATA}/${footballerId}`;
    
    // Add date range if provided
    if (startDate && endDate) {
      url += `?start_date=${startDate}&end_date=${endDate}`;
    }
    
    return await get(url);
  } catch (error) {
    console.error(`Error fetching physical data for footballer ${footballerId}:`, error);
    throw error;
  }
};

// Get physical data for a specific date
export const fetchPhysicalDataByDate = async (footballerId, date) => {
  try {
    return await get(`${PHYSICAL_ENDPOINTS.PHYSICAL_DATA}/${footballerId}/${date}`);
  } catch (error) {
    console.error(`Error fetching physical data for date ${date}:`, error);
    throw error;
  }
};

// Add new physical data
export const addPhysicalData = async (footballerId, data) => {
  try {
    return await post(`${PHYSICAL_ENDPOINTS.PHYSICAL_DATA}/${footballerId}`, data);
  } catch (error) {
    console.error('Error adding physical data:', error);
    throw error;
  }
};

// Update existing physical data
export const updatePhysicalData = async (entryId, data) => {
  try {
    return await put(`${PHYSICAL_ENDPOINTS.PHYSICAL_DATA}/${entryId}`, data);
  } catch (error) {
    console.error(`Error updating physical data entry ${entryId}:`, error);
    throw error;
  }
};

// Delete physical data entry
export const deletePhysicalData = async (entryId) => {
  try {
    return await del(`${PHYSICAL_ENDPOINTS.PHYSICAL_DATA}/${entryId}`);
  } catch (error) {
    console.error(`Error deleting physical data entry ${entryId}:`, error);
    throw error;
  }
};

// Get physical data history
export const fetchPhysicalHistory = async (footballerId, limit = 10) => {
  try {
    return await get(`${PHYSICAL_ENDPOINTS.PHYSICAL_HISTORY}/${footballerId}?limit=${limit}`);
  } catch (error) {
    console.error(`Error fetching physical history for footballer ${footballerId}:`, error);
    throw error;
  }
};

// Generate graph for physical data
export const generatePhysicalGraph = async (graphParams) => {
  try {
    return await post(PHYSICAL_ENDPOINTS.GENERATE_GRAPH, graphParams);
  } catch (error) {
    console.error('Error generating physical graph:', error);
    throw error;
  }
};