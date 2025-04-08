// src/api/api.js

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

// Helper function for handling responses
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
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
};

// User API
export const userAPI = {
  getProfile: async () => {
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
  },
};

// Habits API
export const habitAPI = {
  getAllHabits: async () => {
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
  },
};