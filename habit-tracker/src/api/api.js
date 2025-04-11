// src/api/api.js

import { auth } from '../components/firebase';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

// Helper function to get the current user's token
const getToken = async () => {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
};

// Helper function for handling responses
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

// Helper function for making API requests
const makeRequest = async (endpoint, options = {}) => {
  const token = await getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  return handleResponse(response);
};

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    return handleResponse(response);
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  verifyToken: async () => {
    const token = await getToken();
    return makeRequest('/api/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    return makeRequest('/api/users/me');
  },

  updateProfile: async (userData) => {
    return makeRequest('/api/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
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