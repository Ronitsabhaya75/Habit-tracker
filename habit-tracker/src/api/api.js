// src/api/api.js

import { auth } from '../components/firebase';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Helper function to get the current user's token
const getToken = async () => {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
};

// Helper function for making API requests
const makeRequest = async (endpoint, options = {}) => {
  const token = await getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }

  return response.json();
};

// Auth API
export const verifyToken = async () => {
  const token = await getToken();
  return makeRequest('/auth/verify', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
};

export const getUserProfile = async () => {
  const token = await getToken();
  return makeRequest(`/auth/profile?token=${token}`);
};

// Habits API
export const getHabits = async () => {
  return makeRequest('/habits');
};

export const createHabit = async (habitData) => {
  return makeRequest('/habits', {
    method: 'POST',
    body: JSON.stringify(habitData),
  });
};

export const updateHabit = async (id, habitData) => {
  return makeRequest(`/habits/${id}`, {
    method: 'PUT',
    body: JSON.stringify(habitData),
  });
};

export const deleteHabit = async (id) => {
  return makeRequest(`/habits/${id}`, {
    method: 'DELETE',
  });
};

export const completeHabit = async (id) => {
  return makeRequest(`/habits/${id}/complete`, {
    method: 'POST',
  });
};

// Shop API
export const getShopItems = async () => {
  return makeRequest('/shop');
};

export const purchaseItem = async (itemId) => {
  return makeRequest(`/shop/purchase/${itemId}`, {
    method: 'POST',
  });
};

export const getInventory = async () => {
  return makeRequest('/shop/inventory');
};

// Games API
export const completeGame = async (gameType, score) => {
  return makeRequest('/games/complete', {
    method: 'POST',
    body: JSON.stringify({ gameType, score }),
  });
};

export const getGameStats = async () => {
  return makeRequest('/games/stats');
};