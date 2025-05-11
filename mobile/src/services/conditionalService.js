// mobile/src/services/conditionalService.js
import { CONDITIONAL_ENDPOINTS } from '../constants/api';
import { get, post, put, del } from './api';

// Get all leagues
export const fetchLeagues = async () => {
  try {
    return await get(CONDITIONAL_ENDPOINTS.LEAGUES);
  } catch (error) {
    console.error('Error fetching leagues:', error);
    throw error;
  }
};

// Get teams by league ID
export const fetchTeamsByLeague = async (leagueId) => {
  try {
    return await get(`${CONDITIONAL_ENDPOINTS.TEAMS}/${leagueId}`);
  } catch (error) {
    console.error(`Error fetching teams for league ${leagueId}:`, error);
    throw error;
  }
};

// Get footballers by team ID
export const fetchFootballersByTeam = async (teamId) => {
  try {
    return await get(`${CONDITIONAL_ENDPOINTS.FOOTBALLERS}/${teamId}`);
  } catch (error) {
    console.error(`Error fetching footballers for team ${teamId}:`, error);
    throw error;
  }
};

// Get conditional data for a footballer
export const fetchConditionalData = async (footballerId, startDate = null, endDate = null) => {
  try {
    let url = `${CONDITIONAL_ENDPOINTS.CONDITIONAL_DATA}/${footballerId}`;
    
    // Add date range if provided
    if (startDate && endDate) {
      url += `?start_date=${startDate}&end_date=${endDate}`;
    }
    
    return await get(url);
  } catch (error) {
    console.error(`Error fetching conditional data for footballer ${footballerId}:`, error);
    throw error;
  }
};

// Get conditional data for a specific date
export const fetchConditionalDataByDate = async (footballerId, date) => {
  try {
    return await get(`${CONDITIONAL_ENDPOINTS.CONDITIONAL_DATA}/${footballerId}/${date}`);
  } catch (error) {
    console.error(`Error fetching conditional data for date ${date}:`, error);
    throw error;
  }
};

// Add new conditional data
export const addConditionalData = async (footballerId, data) => {
  try {
    return await post(`${CONDITIONAL_ENDPOINTS.CONDITIONAL_DATA}/${footballerId}`, data);
  } catch (error) {
    console.error('Error adding conditional data:', error);
    throw error;
  }
};

// Update existing conditional data
export const updateConditionalData = async (entryId, data) => {
  try {
    return await put(`${CONDITIONAL_ENDPOINTS.CONDITIONAL_DATA}/${entryId}`, data);
  } catch (error) {
    console.error(`Error updating conditional data entry ${entryId}:`, error);
    throw error;
  }
};

// Delete conditional data entry
export const deleteConditionalData = async (entryId) => {
  try {
    return await del(`${CONDITIONAL_ENDPOINTS.CONDITIONAL_DATA}/${entryId}`);
  } catch (error) {
    console.error(`Error deleting conditional data entry ${entryId}:`, error);
    throw error;
  }
};

// Get conditional data history
export const fetchConditionalHistory = async (footballerId, limit = 10) => {
  try {
    return await get(`${CONDITIONAL_ENDPOINTS.CONDITIONAL_HISTORY}/${footballerId}?limit=${limit}`);
  } catch (error) {
    console.error(`Error fetching conditional history for footballer ${footballerId}:`, error);
    throw error;
  }
};

// Generate graph for conditional data
export const generateConditionalGraph = async (graphParams) => {
  try {
    return await post(CONDITIONAL_ENDPOINTS.GENERATE_GRAPH, graphParams);
  } catch (error) {
    console.error('Error generating conditional graph:', error);
    throw error;
  }
};