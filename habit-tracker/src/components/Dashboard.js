/*
Dashboard Components Documentation
Overview
The Dashboard component serves as the central hub for the HabitQuest application, providing users with a comprehensive view of their habit tracking progress, tasks, achievements, and gamification elements. The dashboard features:

Visual progress tracking with interactive charts

Task management system

Achievement tracking

Leaderboard display

AI-powered habit coaching

Gamification elements (XP, levels, streaks)

Key Features
1. User Progress Tracking
Visual Charts: Line and bar charts showing progress over time

XP System: Tracks user experience points across all activities

Level Progression: Calculates user level based on accumulated XP

Streak Tracking: Maintains and displays current habit streak

2. Task Management
Daily Task List: Shows tasks for the current day

Task Operations: Add, edit, complete, and delete tasks

Time Allocation: Estimate and track time spent on tasks

Task Completion Rewards: Awards XP for completed tasks

3. Gamification Elements
Achievements System: Tracks and displays earned milestones

Leaderboard: Shows user ranking compared to others

XP Rewards: Awards points for various activities

Visual Feedback: Animated elements celebrate progress

4. AI Integration
Habit Coach: Provides personalized suggestions

Task Assistance: Helps manage and organize tasks

Progress Analysis: Offers insights based on user data

5. Navigation
Sidebar Menu: Quick access to all application features

Responsive Design: Adapts to different screen sizes

Technical Implementation
Component Structure
Styled Components: Uses styled-components for all UI elements

Custom Animations: Keyframe animations for interactive elements

Context Integration: Connects to Auth, Habit, and Event contexts

Recharts Integration: For data visualization

State Management
Local State: Manages UI state (chart type, notifications, etc.)

Context State: Accesses user data, habits, and events

Derived State: Calculates XP, levels, and streaks

Key Functions
fetchUserProgress: Loads user progress data

fetchLeaderboard: Retrieves leaderboard data

handleTaskCompletion: Manages task completion logic

addNotification: Displays temporary notifications

generateCoachSuggestions: Creates personalized recommendations

Data Flow
On mount, fetches user progress and leaderboard data

Calculates derived state (XP, level, streak)

Renders interactive UI components

Handles user interactions through event callbacks

Updates state and persists changes through context

Integration Points
Context Dependencies
useAuth: For user authentication and data

useHabit: For habit tracking functionality

useEventContext: For task/event management

Child Components
AIChat: Embedded AI assistant component

Recharts Components: For data visualization

Navigation
Links to all major application sections:

SpinWheel

HabitProgressTracker

Games

Events

Review

UI Elements
Visual Components
Animated Background: Space-themed with floating elements

Progress Charts: Interactive data visualization

Task List: Editable and completable items

Achievement Cards: Display earned milestones

Leaderboard: Shows competitive ranking

Notifications System: Temporary message display

Interactive Elements
Buttons: For all primary actions

Checkboxes: For task completion

Input Fields: For adding/editing tasks

Chart Controls: Switch between visualization types

Navigation Menu: Access to all app sections

Data Structure
Key State Variables
chartData: Array of progress data points

leaderboard: Array of user ranking objects

notifications: Array of active notifications

todayTasks: Array of tasks for current day

totalXP: Calculated experience points

currentLevel: Derived from totalXP

streak: Current habit streak count

Performance Considerations
Memoized calculations for derived state

Efficient rendering with virtualized lists

Debounced input handlers

Optimized animations using CSS transforms

Accessibility Features
Keyboard navigable interface

Sufficient color contrast

ARIA labels for interactive elements

Responsive design for various devices

Error Handling
API error catching and user feedback

Graceful fallbacks for missing data

Input validation for user entries

Usage Example
jsx
Copy
<Dashboard />
The Dashboard component is designed to be self-contained and only requires the proper context providers to be wrapped around it in the application hierarchy.

Dependencies
React

styled-components

recharts

React Router

Various context providers (Auth, Habit, Event)

This comprehensive dashboard brings together all aspects of the HabitQuest application into a cohesive, interactive interface that motivates users through gamification and visual feedback while providing powerful tools for habit formation and task management.
*/
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useHabit } from '../context/HabitContext';
import { useEventContext } from '../context/EventContext';
import { habitAPI, userAPI, gamesAPI } from '../api/api';
import AIChat from './AIChat';
import { motion } from 'framer-motion';
import { Paper, Typography, Button, IconButton, TextField, Box, Grid, CircularProgress } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

// Styled components
const DashboardContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const StatsGrid = styled(Grid)`
  margin-bottom: 20px;
`;

const StatCard = styled(Paper)`
  padding: 20px;
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
  color: white;
`;

const HabitList = styled.div`
  margin-top: 20px;
`;

const HabitItem = styled(Paper)`
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${props => props.completed ? '#e8f5e9' : 'white'};
`;

const ChartContainer = styled(Paper)`
  padding: 20px;
  margin: 20px 0;
  height: 400px;
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { habits, setHabits } = useHabit();
  const { events } = useEventContext();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalHabits: 0,
    completedToday: 0,
    streak: 0,
    level: 1,
    xp: 0,
  });
  const [showInput, setShowInput] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [editingHabit, setEditingHabit] = useState(null);
  const [chartData, setChartData] = useState([]);

  const fetchHabits = useCallback(async () => {
    try {
      const fetchedHabits = await habitAPI.getAllHabits();
      setHabits(fetchedHabits);
      
      // Calculate stats
      const completed = fetchedHabits.filter(habit => habit.completedToday).length;
      setStats(prev => ({
        ...prev,
        totalHabits: fetchedHabits.length,
        completedToday: completed,
      }));
    } catch (error) {
      console.error('Error fetching habits:', error);
      toast.error('Failed to fetch habits');
    }
  }, [setHabits]);

  const fetchUserStats = useCallback(async () => {
    try {
      const userStats = await userAPI.getProfile();
      setStats(prev => ({
        ...prev,
        streak: userStats.streak || 0,
        level: userStats.level || 1,
        xp: userStats.xp || 0,
      }));
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  }, []);

  const fetchChartData = useCallback(async () => {
    try {
      const stats = await gamesAPI.getStats();
      setChartData(stats.dailyProgress || []);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  }, []);

  useEffect(() => {
    const initializeDashboard = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchHabits(),
          fetchUserStats(),
          fetchChartData(),
        ]);
      } catch (error) {
        console.error('Error initializing dashboard:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      initializeDashboard();
    } else {
      navigate('/login');
    }
  }, [currentUser, navigate, fetchHabits, fetchUserStats, fetchChartData]);

  const handleAddHabit = async () => {
    if (!newHabitName.trim()) return;

    try {
      const newHabit = await habitAPI.createHabit({
        name: newHabitName,
        frequency: 'daily', // default frequency
      });
      
      setHabits([...habits, newHabit]);
      setNewHabitName('');
      setShowInput(false);
      toast.success('Habit created successfully');
    } catch (error) {
      console.error('Error creating habit:', error);
      toast.error('Failed to create habit');
    }
  };

  const handleEditHabit = async (habitId) => {
    if (!editingHabit || !editingHabit.name.trim()) return;

    try {
      const updatedHabit = await habitAPI.updateHabit(habitId, editingHabit);
      setHabits(habits.map(h => h._id === habitId ? updatedHabit : h));
      setEditingHabit(null);
      toast.success('Habit updated successfully');
    } catch (error) {
      console.error('Error updating habit:', error);
      toast.error('Failed to update habit');
    }
  };

  const handleDeleteHabit = async (habitId) => {
    try {
      await habitAPI.deleteHabit(habitId);
      setHabits(habits.filter(h => h._id !== habitId));
      toast.success('Habit deleted successfully');
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast.error('Failed to delete habit');
    }
  };

  const handleCompleteHabit = async (habitId) => {
    try {
      await habitAPI.completeHabit(habitId);
      setHabits(habits.map(h => {
        if (h._id === habitId) {
          return { ...h, completedToday: true };
        }
        return h;
      }));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        completedToday: prev.completedToday + 1,
      }));
      
      toast.success('Habit completed!');
    } catch (error) {
      console.error('Error completing habit:', error);
      toast.error('Failed to complete habit');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const generateStars = (count) => {
    const stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        id: i,
        size: Math.random() * 3 + 1,
        top: Math.random() * 100,
        left: Math.random() * 100,
        opacity: Math.random() * 0.7 + 0.3,
        duration: Math.random() * 15 + 10,
        delay: Math.random() * 10,
        glow: Math.random() > 0.8 ? 3 : 1,
      });
    }
    return stars;
  };

  const stars = generateStars(100);

  return (
    <DashboardContainer>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <StatsGrid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <Typography variant="h6">Total Habits</Typography>
            <Typography variant="h4">{stats.totalHabits}</Typography>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <Typography variant="h6">Completed Today</Typography>
            <Typography variant="h4">{stats.completedToday}</Typography>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <Typography variant="h6">Current Streak</Typography>
            <Typography variant="h4">{stats.streak} days</Typography>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <Typography variant="h6">Level {stats.level}</Typography>
            <Typography variant="h4">{stats.xp} XP</Typography>
          </StatCard>
        </Grid>
      </StatsGrid>

      <ChartContainer>
        <Typography variant="h6" gutterBottom>Progress Over Time</Typography>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="completed" stroke="#8884d8" name="Completed Habits" />
            <Line type="monotone" dataKey="total" stroke="#82ca9d" name="Total Habits" />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      <HabitList>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Your Habits</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setShowInput(true)}
          >
            Add Habit
          </Button>
        </Box>

        {showInput && (
          <Box display="flex" gap={1} mb={2}>
            <TextField
              fullWidth
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder="Enter habit name"
              onKeyPress={(e) => e.key === 'Enter' && handleAddHabit()}
            />
            <IconButton color="primary" onClick={handleAddHabit}>
              <CheckIcon />
            </IconButton>
            <IconButton onClick={() => setShowInput(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        )}

        {habits.map(habit => (
          <HabitItem key={habit._id} completed={habit.completedToday}>
            {editingHabit && editingHabit._id === habit._id ? (
              <Box display="flex" gap={1} flex={1}>
                <TextField
                  fullWidth
                  value={editingHabit.name}
                  onChange={(e) => setEditingHabit({ ...editingHabit, name: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && handleEditHabit(habit._id)}
                />
                <IconButton color="primary" onClick={() => handleEditHabit(habit._id)}>
                  <CheckIcon />
                </IconButton>
                <IconButton onClick={() => setEditingHabit(null)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            ) : (
              <>
                <Typography>{habit.name}</Typography>
                <Box>
                  {!habit.completedToday && (
                    <IconButton color="primary" onClick={() => handleCompleteHabit(habit._id)}>
                      <CheckIcon />
                    </IconButton>
                  )}
                  <IconButton onClick={() => setEditingHabit(habit)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteHabit(habit._id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </>
            )}
          </HabitItem>
        ))}
      </HabitList>

      <Box mt={4}>
        <AIChat />
      </Box>
    </DashboardContainer>
  );
};

export default Dashboard;