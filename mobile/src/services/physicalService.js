// mobile/src/services/physicalService.js
import { PHYSICAL_ENDPOINTS } from '../constants/api';
import { get, post, put, del } from './api';
import { getCurrentUser, isUserAdmin } from './auth';

// Get all leagues
export const fetchLeagues = async () => {
  try {
    return await get(PHYSICAL_ENDPOINTS.LEAGUES);
  } catch (error) {
    console.error('Error fetching leagues:', error);
    throw error;
  }
};

// Get teams by league ID (filtered by user permissions)
export const fetchTeamsByLeague = async (leagueId) => {
  try {
    const teams = await get(`${PHYSICAL_ENDPOINTS.TEAMS}/${leagueId}`);
    
    // Backend already filters teams based on user permissions
    // No need for additional filtering here
    return teams;
  } catch (error) {
    console.error(`Error fetching teams for league ${leagueId}:`, error);
    throw error;
  }
};

// Get footballers by team ID (with permission check)
export const fetchFootballersByTeam = async (teamId) => {
  try {
    const currentUser = await getCurrentUser();
    const isAdmin = await isUserAdmin();
    
    // Check if user has access to this team
    if (!isAdmin && currentUser?.team_id && teamId) {
      // Convert both to strings for comparison to avoid type issues
      const userTeamId = String(currentUser.team_id);
      const requestedTeamId = String(teamId);
      
      if (userTeamId !== requestedTeamId) {
        throw new Error('You do not have permission to access this team\'s footballers');
      }
    }
    
    return await get(`${PHYSICAL_ENDPOINTS.FOOTBALLERS}/${teamId}`);
  } catch (error) {
    console.error(`Error fetching footballers for team ${teamId}:`, error);
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