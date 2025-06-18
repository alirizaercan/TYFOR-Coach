// mobile/src/services/conditionalService.js
import { CONDITIONAL_ENDPOINTS } from '../constants/api';
import { get, post, put, del } from './api';
import { getCurrentUser, isUserAdmin } from './auth';

// Get all leagues
export const fetchLeagues = async () => {
  try {
    return await get(CONDITIONAL_ENDPOINTS.LEAGUES);
  } catch (error) {
    console.error('Error fetching leagues:', error);
    throw error;
  }
};

// Get teams by league ID (filtered by user permissions)
export const fetchTeamsByLeague = async (leagueId) => {
  try {
    const teams = await get(`${CONDITIONAL_ENDPOINTS.TEAMS}/${leagueId}`);
    
    // Backend already filters teams based on user permissions
    return teams;
  } catch (error) {
    console.error(`Error fetching teams for league ${leagueId}:`, error);
    throw error;
  }
};

// Get footballers by team ID (with permission check)
export const fetchFootballersByTeam = async (teamId) => {
  try {
    // Takım ID'sini integer'a çevir
    const intTeamId = parseInt(teamId);
    if (isNaN(intTeamId)) {
      console.error('Invalid team ID, must be integer:', teamId);
      throw new Error('Invalid team ID format');
    }
    
    const currentUser = await getCurrentUser();
    const isAdmin = await isUserAdmin();
    
    // Check if user has access to this team
    if (!isAdmin && currentUser?.team_id && intTeamId) {
      const userTeamId = parseInt(currentUser.team_id);
      if (isNaN(userTeamId)) {
        throw new Error('Invalid user team ID format');
      }
      if (userTeamId !== intTeamId) {
        throw new Error('You do not have permission to access this team\'s footballers');
      }
    }
    // Backend'e integer olarak gönder
    const response = await get(`${CONDITIONAL_ENDPOINTS.FOOTBALLERS}/${intTeamId}`);
    return response;
  } catch (error) {
    console.error(`Error fetching footballers for team ${teamId}:`, error);
    
    // If it's a permission error, re-throw it
    if (error.message.includes('permission') || error.message.includes('Invalid team ID')) {
      throw error;
    }
    
    // For other errors, check if it's a 500 and provide better error message
    if (error.status === 500) {
      throw new Error('Server error while fetching footballers. Please try again.');
    }
    
    throw error;
  }
};

// Get accessible teams for current user
export const fetchUserAccessibleTeams = async () => {
  try {
    const currentUser = await getCurrentUser();
    const isAdmin = await isUserAdmin();
    
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // If admin, get all leagues and teams
    if (isAdmin) {
      const leagues = await fetchLeagues();
      const allTeams = [];
      
      for (const league of leagues) {
        try {
          const teams = await fetchTeamsByLeague(league.league_id);
          allTeams.push(...teams.map(team => ({
            ...team,
            league_name: league.league_name,
            league_id: league.league_id
          })));
        } catch (error) {
          console.warn(`Failed to fetch teams for league ${league.league_id}:`, error);
        }
      }
      
      return allTeams;
    } else {
      // Non-admin users: find their specific team
      if (!currentUser.team_id) {
        return [];
      }
      
      const leagues = await fetchLeagues();
      
      for (const league of leagues) {
        try {
          const teams = await fetchTeamsByLeague(league.league_id);
          const userTeam = teams.find(team => team.team_id === currentUser.team_id);
          
          if (userTeam) {
            return [{
              ...userTeam,
              league_name: league.league_name,
              league_id: league.league_id
            }];
          }
        } catch (error) {
          console.warn(`Failed to fetch teams for league ${league.league_id}:`, error);
        }
      }
      
      return [];
    }
  } catch (error) {
    console.error('Error fetching user accessible teams:', error);
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