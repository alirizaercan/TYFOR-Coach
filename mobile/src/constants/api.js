// mobile/src/constants/api.js
// Base API configuration for the application

export const API_BASE_URL = "http://localhost:5000/api";

// Authentication endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  PROFILE: `${API_BASE_URL}/auth/profile`,
  PROFILE_WITH_TEAM: `${API_BASE_URL}/auth/profile/with-team`,
  VERIFY_TOKEN: `${API_BASE_URL}/auth/verify-token`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
};

// Physical development endpoints
export const PHYSICAL_ENDPOINTS = {
  LEAGUES: `${API_BASE_URL}/physical/leagues`,
  TEAMS: `${API_BASE_URL}/physical/teams`,
  FOOTBALLERS: `${API_BASE_URL}/physical/footballers`,
  PHYSICAL_DATA: `${API_BASE_URL}/physical/physical-data`,
  PHYSICAL_HISTORY: `${API_BASE_URL}/physical/physical-history`,
  GENERATE_GRAPH: `${API_BASE_URL}/physical/generate-graph`,
};

// Conditional development endpoints
export const CONDITIONAL_ENDPOINTS = {
  LEAGUES: `${API_BASE_URL}/conditional/leagues`,
  TEAMS: `${API_BASE_URL}/conditional/teams`,
  FOOTBALLERS: `${API_BASE_URL}/conditional/footballers`,
  CONDITIONAL_DATA: `${API_BASE_URL}/conditional/conditional-data`,
  CONDITIONAL_HISTORY: `${API_BASE_URL}/conditional/conditional-history`,
  GENERATE_GRAPH: `${API_BASE_URL}/conditional/generate-graph`,
};

// Endurance development endpoints
export const ENDURANCE_ENDPOINTS = {
  LEAGUES: `${API_BASE_URL}/endurance/leagues`,
  TEAMS: `${API_BASE_URL}/endurance/teams`,
  FOOTBALLERS: `${API_BASE_URL}/endurance/footballers`,
  ENDURANCE_DATA: `${API_BASE_URL}/endurance/endurance-data`,
  ENDURANCE_HISTORY: `${API_BASE_URL}/endurance/endurance-history`,
  GENERATE_GRAPH: `${API_BASE_URL}/endurance/generate-graph`,
};

// Helper function to build headers with authentication token
export const getAuthHeaders = (token) => {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};