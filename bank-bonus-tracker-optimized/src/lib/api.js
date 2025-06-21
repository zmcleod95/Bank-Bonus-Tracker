import axios from 'axios';

// Define the API base URL
const API_URL = 'https://2g8h3ilclk0x.manus.space/api';

// Create axios instance with optimized configuration
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens and request optimization
api.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching issues
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and response optimization
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 404:
          console.warn('Resource not found:', error.config.url);
          break;
        case 500:
          console.error('Server error:', data?.message || 'Internal server error');
          break;
        case 503:
          console.error('Service unavailable');
          break;
        default:
          console.error('API Error:', data?.message || error.message);
      }
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.message);
    } else {
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Simple in-memory cache for GET requests
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

// Enhanced API functions with caching for banks
export const getBanks = async () => {
  const cacheKey = 'banks';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;
  
  try {
    const response = await api.get('/banks');
    setCachedData(cacheKey, response.data);
    return response.data;
  } catch (error) {
    // Return empty array as fallback
    return [];
  }
};

export const getBank = async (id) => {
  const cacheKey = `bank-${id}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;
  
  try {
    const response = await api.get(`/banks/${id}`);
    setCachedData(cacheKey, response.data);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch bank with ID ${id}`);
  }
};

export const createBank = async (bankData) => {
  try {
    const response = await api.post('/banks', bankData);
    // Invalidate banks cache
    cache.delete('banks');
    return response.data;
  } catch (error) {
    throw new Error('Failed to create bank');
  }
};

export const updateBank = async (id, bankData) => {
  try {
    const response = await api.put(`/banks/${id}`, bankData);
    // Invalidate related caches
    cache.delete('banks');
    cache.delete(`bank-${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update bank with ID ${id}`);
  }
};

export const deleteBank = async (id) => {
  try {
    await api.delete(`/banks/${id}`);
    // Invalidate related caches
    cache.delete('banks');
    cache.delete(`bank-${id}`);
    return true;
  } catch (error) {
    throw new Error(`Failed to delete bank with ID ${id}`);
  }
};

// Enhanced API functions with caching for bonuses
export const getBonuses = async () => {
  const cacheKey = 'bonuses';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;
  
  try {
    const response = await api.get('/bonuses');
    setCachedData(cacheKey, response.data);
    return response.data;
  } catch (error) {
    // Return empty array as fallback
    return [];
  }
};

export const getBonus = async (id) => {
  const cacheKey = `bonus-${id}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;
  
  try {
    const response = await api.get(`/bonuses/${id}`);
    setCachedData(cacheKey, response.data);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch bonus with ID ${id}`);
  }
};

export const getBankBonuses = async (bankId) => {
  const cacheKey = `bank-bonuses-${bankId}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;
  
  try {
    const response = await api.get(`/banks/${bankId}/bonuses`);
    setCachedData(cacheKey, response.data);
    return response.data;
  } catch (error) {
    return [];
  }
};

export const createBonus = async (bonusData) => {
  try {
    const response = await api.post('/bonuses', bonusData);
    // Invalidate bonuses cache
    cache.delete('bonuses');
    if (bonusData.bank_id) {
      cache.delete(`bank-bonuses-${bonusData.bank_id}`);
    }
    return response.data;
  } catch (error) {
    throw new Error('Failed to create bonus');
  }
};

export const updateBonus = async (id, bonusData) => {
  try {
    const response = await api.put(`/bonuses/${id}`, bonusData);
    // Invalidate related caches
    cache.delete('bonuses');
    cache.delete(`bonus-${id}`);
    if (bonusData.bank_id) {
      cache.delete(`bank-bonuses-${bonusData.bank_id}`);
    }
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update bonus with ID ${id}`);
  }
};

export const deleteBonus = async (id) => {
  try {
    await api.delete(`/bonuses/${id}`);
    // Invalidate related caches
    cache.delete('bonuses');
    cache.delete(`bonus-${id}`);
    return true;
  } catch (error) {
    throw new Error(`Failed to delete bonus with ID ${id}`);
  }
};

// Enhanced API functions for tracked bonuses
export const getTrackedBonuses = async () => {
  try {
    const response = await api.get('/tracked-bonuses');
    return response.data;
  } catch (error) {
    return [];
  }
};

export const getTrackedBonus = async (id) => {
  try {
    const response = await api.get(`/tracked-bonuses/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch tracked bonus with ID ${id}`);
  }
};

export const getPlayerTrackedBonuses = async (playerId) => {
  const cacheKey = `player-tracked-bonuses-${playerId}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;
  
  try {
    const response = await api.get(`/players/${playerId}/tracked-bonuses`);
    setCachedData(cacheKey, response.data);
    return response.data;
  } catch (error) {
    return [];
  }
};

export const createTrackedBonus = async (trackedBonusData) => {
  try {
    const response = await api.post('/tracked-bonuses', trackedBonusData);
    // Invalidate player cache
    if (trackedBonusData.player_id) {
      cache.delete(`player-tracked-bonuses-${trackedBonusData.player_id}`);
    }
    cache.delete('dashboard');
    return response.data;
  } catch (error) {
    throw new Error('Failed to create tracked bonus');
  }
};

export const updateTrackedBonus = async (id, trackedBonusData) => {
  try {
    const response = await api.put(`/tracked-bonuses/${id}`, trackedBonusData);
    // Invalidate related caches
    if (trackedBonusData.player_id) {
      cache.delete(`player-tracked-bonuses-${trackedBonusData.player_id}`);
    }
    cache.delete('dashboard');
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update tracked bonus with ID ${id}`);
  }
};

export const deleteTrackedBonus = async (id) => {
  try {
    await api.delete(`/tracked-bonuses/${id}`);
    // Clear all player caches since we don't know which player this belonged to
    for (const key of cache.keys()) {
      if (key.startsWith('player-tracked-bonuses-')) {
        cache.delete(key);
      }
    }
    cache.delete('dashboard');
    return true;
  } catch (error) {
    throw new Error(`Failed to delete tracked bonus with ID ${id}`);
  }
};

// Enhanced API functions for player settings
export const getPlayerSettings = async (playerId) => {
  const cacheKey = `player-settings-${playerId}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;
  
  try {
    const response = await api.get(`/player-settings/${playerId}`);
    setCachedData(cacheKey, response.data);
    return response.data;
  } catch (error) {
    // Return default settings
    return {
      player_id: playerId,
      player_name: `Player ${playerId}`,
      email_notifications: true,
      default_deposit_amount: 1000
    };
  }
};

export const updatePlayerSettings = async (playerId, settingsData) => {
  try {
    const response = await api.put(`/player-settings/${playerId}`, settingsData);
    // Invalidate player settings cache
    cache.delete(`player-settings-${playerId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update settings for player ${playerId}`);
  }
};

// Enhanced API function for dashboard data
export const getDashboardData = async () => {
  const cacheKey = 'dashboard';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;
  
  try {
    const response = await api.get('/dashboard');
    setCachedData(cacheKey, response.data);
    return response.data;
  } catch (error) {
    // Return default dashboard data
    return {
      total_earnings: 0,
      completed_bonuses: 0,
      pending_bonuses: 0,
      active_bonuses: 0,
      upcoming_dates: []
    };
  }
};

// Utility function to clear all caches
export const clearCache = () => {
  cache.clear();
};

// Utility function to preload critical data
export const preloadCriticalData = async () => {
  try {
    // Preload banks and bonuses in parallel
    await Promise.all([
      getBanks(),
      getBonuses(),
      getDashboardData()
    ]);
  } catch (error) {
    console.warn('Failed to preload some critical data:', error);
  }
};

export default {
  getBanks,
  getBank,
  createBank,
  updateBank,
  deleteBank,
  getBonuses,
  getBonus,
  getBankBonuses,
  createBonus,
  updateBonus,
  deleteBonus,
  getTrackedBonuses,
  getTrackedBonus,
  getPlayerTrackedBonuses,
  createTrackedBonus,
  updateTrackedBonus,
  deleteTrackedBonus,
  getPlayerSettings,
  updatePlayerSettings,
  getDashboardData,
  clearCache,
  preloadCriticalData
};

