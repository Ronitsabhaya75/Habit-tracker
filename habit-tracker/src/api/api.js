// src/api/api.js

import { auth } from '../components/firebase';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

// Helper function to get the current user's token
const getToken = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken(true); // Force refresh token
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Helper function for handling responses
const handleResponse = async (response) => {
  if (response.status === 204) return null; // Handle no content
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

// Helper function for making API requests
const makeRequest = async (endpoint, options = {}) => {
  try {
    const token = await getToken();
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const config = {
      ...options,
      headers,
      credentials: 'include',
      mode: 'cors',
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (response.status === 401) {
      // Token expired or invalid, try to refresh
      const newToken = await auth.currentUser?.getIdToken(true);
      if (newToken) {
        headers.Authorization = `Bearer ${newToken}`;
        const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...config,
          headers,
        });
        return handleResponse(retryResponse);
      }
      throw new Error('Authentication failed');
    }

    return handleResponse(response);
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  verifyToken: async (token, username) => {
    return makeRequest('/api/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ token, username }),
    });
  },

  getProfile: async (token) => {
    return makeRequest(`/api/auth/profile?token=${token}`);
  },
};

// Habits API
export const habitAPI = {
  getAllHabits: async () => {
    return makeRequest('/api/habits');
  },

  createHabit: async (habitData) => {
    return makeRequest('/api/habits', {
      method: 'POST',
      body: JSON.stringify(habitData),
    });
  },

  updateHabit: async (id, habitData) => {
    return makeRequest(`/api/habits/${id}`, {
      method: 'PUT',
      body: JSON.stringify(habitData),
    });
  },

  deleteHabit: async (id) => {
    return makeRequest(`/api/habits/${id}`, {
      method: 'DELETE',
    });
  },

  completeHabit: async (id) => {
    return makeRequest(`/api/habits/${id}/complete`, {
      method: 'POST',
    });
  },
};

// Shop API
export const shopAPI = {
  getItems: async () => {
    return makeRequest('/api/shop');
  },

  purchaseItem: async (itemId) => {
    return makeRequest(`/api/shop/purchase/${itemId}`, {
      method: 'POST',
    });
  },

  getInventory: async () => {
    return makeRequest('/api/shop/inventory');
  },
};

// Games API
export const gamesAPI = {
  completeGame: async (gameType, score) => {
    return makeRequest('/api/games/complete', {
      method: 'POST',
      body: JSON.stringify({ gameType, score }),
    });
  },

  getStats: async () => {
    return makeRequest('/api/games/stats');
  },
};