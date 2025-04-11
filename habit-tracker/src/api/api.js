// src/api/api.js

<<<<<<< HEAD
import { auth } from '../components/firebase';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

// Helper function to get the current user's token
const getToken = async () => {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
};

=======
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

>>>>>>> b5d5f4024fac6820cf4bd30cef41cbbbe94b58b1
// Helper function for handling responses
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

<<<<<<< HEAD
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

=======
>>>>>>> b5d5f4024fac6820cf4bd30cef41cbbbe94b58b1
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
<<<<<<< HEAD

  verifyToken: async () => {
    const token = await getToken();
    return makeRequest('/api/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },
=======
>>>>>>> b5d5f4024fac6820cf4bd30cef41cbbbe94b58b1
};

// User API
export const userAPI = {
  getProfile: async () => {
<<<<<<< HEAD
    return makeRequest('/api/users/me');
  },

  updateProfile: async (userData) => {
    return makeRequest('/api/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
=======
    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return handleResponse(response);
  },

  updateProfile: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
>>>>>>> b5d5f4024fac6820cf4bd30cef41cbbbe94b58b1
  },
};

// Habits API
export const habitAPI = {
  getAllHabits: async () => {
<<<<<<< HEAD
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
=======
    const response = await fetch(`${API_BASE_URL}/api/habits`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      credentials: 'include',
    });
    return handleResponse(response);
  },

  createHabit: async (habitData) => {
    const response = await fetch(`${API_BASE_URL}/api/habits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(habitData),
    });
    return handleResponse(response);
  },

  updateHabit: async (habitId, habitData) => {
    const response = await fetch(`${API_BASE_URL}/api/habits/${habitId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(habitData),
    });
    return handleResponse(response);
  },

  deleteHabit: async (habitId) => {
    const response = await fetch(`${API_BASE_URL}/api/habits/${habitId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return handleResponse(response);
  },
};

// Tasks API
export const taskAPI = {
  getTasksByDate: async (date) => {
    const response = await fetch(`${API_BASE_URL}/api/tasks?date=${date}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      credentials: 'include',
    });
    return handleResponse(response);
  },

  createTask: async (taskData) => {
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(taskData),
    });
    return handleResponse(response);
  },

  updateTask: async (taskId, taskData) => {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(taskData),
    });
    return handleResponse(response);
  },

  deleteTask: async (taskId) => {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return handleResponse(response);
  },

  toggleTaskCompletion: async (taskId, completed) => {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/completion`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ completed }),
    });
    return handleResponse(response);
  },
};

// Progress API
export const progressAPI = {
  getProgress: async () => {
    const response = await fetch(`${API_BASE_URL}/api/progress`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      credentials: 'include',
    });
    return handleResponse(response);
  },

  getLeaderboard: async () => {
    const response = await fetch(`${API_BASE_URL}/api/progress/leaderboard`, {
      credentials: 'include',
    });
    return handleResponse(response);
  },

  updateProgress: async (category, points) => {
    const response = await fetch(`${API_BASE_URL}/api/progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ category, points }),
    });
    return handleResponse(response);
  },
};

// Analytics API
export const analyticsAPI = {
  getHabitAnalytics: async (habitId) => {
    const response = await fetch(`${API_BASE_URL}/api/analytics/habits/${habitId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return handleResponse(response);
  },

  getUserAnalytics: async () => {
    const response = await fetch(`${API_BASE_URL}/api/analytics/user`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return handleResponse(response);
>>>>>>> b5d5f4024fac6820cf4bd30cef41cbbbe94b58b1
  },
};