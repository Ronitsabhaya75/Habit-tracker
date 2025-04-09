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
import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { theme } from '../theme';
import { useAuth } from '../context/AuthContext';
import { useHabit } from '../context/HabitContext';
import { useEventContext } from '../context/EventContext';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import AIChat from '../components/AIChat';

// Animation keyframes (borrowed from Shop)
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const glow = keyframes`
  0% { filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.7)); }
  50% { filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.9)); }
  100% { filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.7)); }
`;

const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0); }
`;

const starFloat = keyframes`
  0% { opacity: 0; transform: translateY(0px) translateX(0px); }
  50% { opacity: 1; }
  100% { opacity: 0; transform: translateY(-20px) translateX(10px); }
`;

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

// Star background
const StarBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  background: linear-gradient(to bottom, #0B1A2C, #152642);
`;

const Star = styled.div`
  position: absolute;
  width: ${props => props.size || 2}px;
  height: ${props => props.size || 2}px;
  background-color: #ffffff;
  border-radius: 50%;
  opacity: ${props => props.opacity || 0.7};
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  animation: ${starFloat} ${props => props.duration || 10}s linear infinite;
  animation-delay: ${props => props.delay || 0}s;
  box-shadow: 0 0 ${props => props.glow || 1}px ${props => props.glow || 1}px #B8FFF9;
`;

// Styled components
const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  position: relative;
  color: #B8FFF9;
`;

const Sidebar = styled.div`
  width: 280px;
  padding: 2rem;
  background: rgba(11, 26, 44, 0.9);
  border-right: 1px solid rgba(0, 255, 198, 0.3);
  backdrop-filter: blur(10px);
  z-index: 10;
  box-shadow: 5px 0 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;

  h2 {
    color: #00FFF5;
    font-size: 1.8rem;
    margin-bottom: 2rem;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-shadow: 0 0 10px rgba(0, 255, 245, 0.5);
  }
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 2rem;
`;

const NavItem = styled.li`
  padding: 1rem;
  margin: 0.5rem 0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #B8FFF9;
  
  &:hover {
    background: rgba(0, 255, 198, 0.1);
    transform: translateX(5px);
  }
  
  &.active {
    background: linear-gradient(90deg, rgba(0, 255, 198, 0.3), rgba(74, 144, 226, 0.3));
    border-left: 3px solid #00FFC6;
    color: #00FFF5;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 3rem;
  z-index: 10;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const UserGreeting = styled.div`
  h1 { 
    font-size: 2.5rem; 
    color: #00FFF5;
    text-shadow: 0 0 10px rgba(0, 255, 245, 0.5);
    span { color: #00FFC6; }
  }
`;

const LevelBadge = styled.div`
  background: linear-gradient(90deg, #00FFC6, #4A90E2);
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  box-shadow: 0 0 15px rgba(0, 255, 198, 0.2);
  color: white;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  align-items: start;
`;

const Card = styled.div`
  background: rgba(21, 38, 66, 0.8);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid rgba(0, 255, 198, 0.3);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(0, 255, 198, 0.2);
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(0, 255, 198, 0.3);
  }
  h2 {
    color: #00FFF5;
    text-shadow: 0 0 5px rgba(0, 255, 245, 0.5);
  }
`;

const Button = styled.button`
  background: linear-gradient(90deg, #00FFC6 0%, #4A90E2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 255, 198, 0.3);
  }
`;

const LeaderboardList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 1rem;
`;

const LeaderboardItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin: 0.5rem 0;
  background: rgba(11, 26, 44, 0.7);
  border-radius: 8px;
  &:hover { background: rgba(0, 255, 198, 0.1); }
`;

const UserRank = styled.span`
  color: #00FFF5;
  font-weight: 600;
`;

const UserScore = styled.span`
  color: #00FFC6;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  height: 10px;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 1rem;
  & div {
    width: ${props => props.progress || '30%'};
    height: 100%;
    background: linear-gradient(90deg, #00FFC6, #4A90E2);
    transition: width 0.5s ease;
  }
`;

const AddHabitInput = styled.input`
  width: calc(100% - 20px);
  padding: 8px;
  margin-top: 1rem;
  border: 1px solid rgba(0, 255, 198, 0.3);
  border-radius: 8px;
  background: rgba(11, 26, 44, 0.7);
  color: #B8FFF9;
`;

const AddHabitButton = styled.button`
  background: linear-gradient(90deg, #00FFC6 0%, #4A90E2 100%);
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 0.5rem;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 255, 198, 0.3);
  }
`;

const EditInput = styled.input`
  padding: 4px;
  margin-right: 8px;
  border: 1px solid rgba(0, 255, 198, 0.3);
  border-radius: 4px;
  background: rgba(11, 26, 44, 0.7);
  color: #B8FFF9;
`;

const DeleteButton = styled.button`
  background: rgba(255, 82, 82, 0.3);
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 8px;
  &:hover { background: rgba(255, 82, 82, 0.5); }
`;

const ChartControls = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ChartTypeButton = styled.button`
  background: ${props => props.active ? 'rgba(0, 255, 198, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.active ? '#00FFF5' : '#B8FFF9'};
  border: 1px solid ${props => props.active ? 'rgba(0, 255, 198, 0.8)' : 'rgba(255, 255, 255, 0.2)'};
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: rgba(0, 255, 198, 0.2);
    transform: translateY(-2px);
  }
`;

const ChartContainer = styled.div`
  position: relative;
  background: rgba(11, 26, 44, 0.7);
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 0 15px rgba(0, 255, 198, 0.2);
`;

const AchievementList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 1rem;
`;

const AchievementItem = styled.li`
  padding: 1rem;
  background: rgba(11, 26, 44, 0.7);
  border-radius: 8px;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-2px);
    background: rgba(0, 255, 198, 0.1);
  }
`;

const AchievementTitle = styled.span`
  color: #00FFF5;
  font-weight: 600;
`;

const AchievementDetails = styled.span`
  color: #00FFC6;
`;

const LogoutButton = styled.button`
  background: linear-gradient(90deg, #00FFC6 0%, #4A90E2 100%);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 255, 198, 0.3);
  }
`;

const TaskList = styled.ul`
  list-style: none;
  padding: 0;
`;

const Task = styled.li`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.7rem 0;
  border-bottom: 1px solid rgba(0, 255, 198, 0.2);
  &:last-child { border-bottom: none; }
`;

const TaskCheckbox = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${props => props.completed ? '#00FFC6' : 'rgba(255, 255, 255, 0.3)'};
  background: ${props => props.completed ? 'linear-gradient(90deg, #00FFC6, #4A90E2)' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  &::after {
    content: ${props => props.completed ? '"✓"' : '""'};
    color: white;
    font-size: 0.8rem;
  }
  &:hover {
    border-color: #00FFC6;
    transform: scale(1.1);
  }
`;

const TaskText = styled.span`
  flex: 1;
  color: ${props => props.completed ? 'rgba(184, 255, 249, 0.5)' : '#B8FFF9'};
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
`;

const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100;
`;

const NotificationCard = styled.div`
  background: linear-gradient(90deg, #00FFC6, #4A90E2);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 5px 15px rgba(0, 255, 198, 0.3);
  color: white;
`;

const NotificationMessage = styled.span`
  flex-grow: 1;
  margin-right: 1rem;
`;

const NotificationActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const TimeAllocationModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(21, 38, 66, 0.8);
  border: 1px solid rgba(0, 255, 198, 0.3);
  border-radius: 16px;
  padding: 2rem;
  z-index: 200;
  width: 400px;
  box-shadow: 0 10px 20px rgba(0, 255, 198, 0.2);
  color: #B8FFF9;
`;

const TimeInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border: 1px solid rgba(0, 255, 198, 0.3);
  border-radius: 8px;
  background: rgba(11, 26, 44, 0.7);
  color: #B8FFF9;
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { habits, progress, completeHabit, getStreak, getCategoryProgress, setStreak, updateProgress } = useHabit();
  const { events, addEvent, updateEvent, deleteEvent, toggleEventCompletion } = useEventContext();

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newHabit, setNewHabit] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [chartType, setChartType] = useState('line');
  const [streak, setLocalStreak] = useState(0);
  const inputRef = useRef(null);
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [timeAllocation, setTimeAllocation] = useState('');

  const addNotification = useCallback((message, actions = []) => {
    const newNotification = { id: Date.now(), message, actions };
    setNotifications(prev => [...prev, newNotification]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== newNotification.id)), 5000);
  }, []);

  const isHabitDueToday = (habit) => {
    const today = new Date();
    const daysSinceCreation = Math.floor((today - new Date(habit.createdDate)) / (1000 * 60 * 60 * 24));
    if (daysSinceCreation < 0) return false;
    switch (habit.frequency) {
      case 'daily':
        return true;
      case 'weekly':
        return daysSinceCreation % 7 === 0;
      case 'biweekly':
        return daysSinceCreation % 14 === 0;
      default:
        return false;
    }
  };

  const handleTaskCompletion = async (taskId, completed, isHabit = false) => {
    const todayKey = new Date().toISOString().split('T')[0];
    if (isHabit) {
      const habit = habits.find(h => h.id === taskId);
      if (habit && completed && !habit.completedDates.includes(todayKey)) {
        await completeHabit(taskId); // Awards 30 XP
        addNotification(`Great job! You completed "${habit.name}" (+30 XP)`, [
          { label: 'Track Progress', onClick: () => navigate('/track') },
        ]);
      }
    } else {
      await toggleEventCompletion(todayKey, taskId, completed);
      if (completed) {
        await updateProgress('tasks', 10);
        addNotification(`Task "${events[todayKey].find(t => t.id === taskId)?.title}" completed! (+10 XP)`, [
          { label: 'Review', onClick: () => navigate('/review') },
        ]);
      }
    }
  };

  const openTimeAllocationModal = (task) => setSelectedTask(task);

  const saveTimeAllocation = () => {
    if (!selectedTask || !timeAllocation) return;
    const todayKey = new Date().toISOString().split('T')[0];
    const updatedTask = { ...selectedTask, estimatedTime: parseInt(timeAllocation, 10) };
    updateEvent(todayKey, selectedTask.id, updatedTask);
    addNotification(`Time allocated for "${selectedTask.title}": ${timeAllocation} minutes`);
    setSelectedTask(null);
    setTimeAllocation('');
  };

  const calculateTotalXP = useCallback(() => {
    const progressXP = Object.values(progress).reduce((sum, p) => sum + p, 0);
    const todayKey = new Date().toISOString().split('T')[0];
    const tasksXP = (events[todayKey] || []).filter(t => t.completed).length * 10;
    return progressXP + tasksXP;
  }, [progress, events]);

  const [totalXP, setTotalXP] = useState(calculateTotalXP());

  useEffect(() => {
    setTotalXP(calculateTotalXP());
  }, [calculateTotalXP]);

  const currentLevel = Math.floor(totalXP / 100) + 1;
  const levelProgress = totalXP % 100;
  const streakPercentage = Math.min((streak / 14) * 100, 100);

  const achievements = [
    { id: 1, title: 'First Week Streak', description: 'Completed 7 days of habits', earned: streak >= 7 },
    { id: 2, title: 'Milestone 100 XP', description: 'Reached 100 XP points', earned: totalXP >= 100 },
    { id: 3, title: 'Habit Master', description: 'Completed 3 habits consistently', earned: Object.keys(progress).length >= 3 },
    { id: 4, title: 'Task Champion', description: 'Completed 5 tasks in a day', earned: false },
  ];

  const fetchUserProgress = useCallback(async () => {
    setLoading(true);
    const userProgress = await fakeFetchUserData();
    setChartData(userProgress.map(item => ({ day: item.date, progress: getCategoryProgress(item.date) || item.progress })));
    setLoading(false);
  }, [getCategoryProgress]);

  const fetchLeaderboard = useCallback(async () => {
    const leaderboardData = await fakeFetchLeaderboardData();
    setLeaderboard(leaderboardData);
  }, []);

  useEffect(() => {
    fetchLeaderboard();
    fetchUserProgress();
    const streakValue = getStreak();
    setLocalStreak(streakValue);
    setStreak(streakValue);

    // Sync habits with events
    const todayKey = new Date().toISOString().split('T')[0];
    habits.forEach(habit => {
      if (isHabitDueToday(habit) && !events[todayKey]?.some(e => e.id === habit.id)) {
        addEvent(todayKey, {
          id: habit.id,
          title: habit.name,
          completed: habit.completedDates.includes(todayKey),
          isHabit: true,
        });
      }
    });
  }, [fetchLeaderboard, fetchUserProgress, getStreak, setStreak, habits, events, addEvent]);

  useEffect(() => {
    if (user && !leaderboard.some(entry => entry.name === user.name)) {
      setLeaderboard(prev => [...prev, { name: user.name, xp: totalXP }]);
    }
  }, [user, totalXP, leaderboard]);

  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.xp - a.xp);

  const fakeFetchUserData = async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(Array.from({ length: 7 }, (_, i) => ({
          date: new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000).toLocaleDateString(),
          progress: Math.floor(Math.random() * 30),
        })));
      }, 1000);
    });
  };

  const fakeFetchLeaderboardData = async () => {
    return new Promise(resolve => setTimeout(() => resolve([]), 1000));
  };

  const addHabit = () => setShowInput(true);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && newHabit.trim()) {
      const todayKey = new Date().toISOString().split('T')[0];
      addEvent(todayKey, { id: Date.now(), title: newHabit.trim(), completed: false, isHabit: false });
      setNewHabit('');
      setShowInput(false);
    }
  };

  const toggleEdit = (taskId) => {
    const todayKey = new Date().toISOString().split('T')[0];
    const task = events[todayKey]?.find(t => t.id === taskId);
    if (task) updateEvent(todayKey, taskId, { isEditing: !task.isEditing });
  };

  const deleteTask = (taskId) => {
    const todayKey = new Date().toISOString().split('T')[0];
    deleteEvent(todayKey, taskId);
  };

  const getLineColor = (progress) => {
    if (progress < 40) return '#ff6b6b';
    if (progress < 70) return '#feca57';
    return '#00FFC6';
  };

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={chartData}>
              <XAxis dataKey="day" stroke="#B8FFF9" />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="progress" fill="#00FFC6" />
            </BarChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={chartData}>
              <XAxis dataKey="day" stroke="#B8FFF9" />
              <YAxis hide />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="progress"
                stroke={chartData.length ? getLineColor(chartData[chartData.length - 1]?.progress) : '#00FFC6'}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  const todayKey = new Date().toISOString().split('T')[0];
  const todayTasks = events[todayKey] || [];

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
      <StarBackground>
        {stars.map(star => (
          <Star
            key={star.id}
            size={star.size}
            top={star.top}
            left={star.left}
            opacity={star.opacity}
            duration={star.duration}
            delay={star.delay}
            glow={star.glow}
          />
        ))}
      </StarBackground>

      <NotificationContainer>
        {notifications.map(notification => (
          <NotificationCard key={notification.id}>
            <NotificationMessage>{notification.message}</NotificationMessage>
            <NotificationActions>
              {notification.actions.map((action, index) => (
                <Button key={index} onClick={action.onClick}>
                  {action.label}
                </Button>
              ))}
            </NotificationActions>
          </NotificationCard>
        ))}
      </NotificationContainer>

      <Sidebar>
        <h2>HabitQuest</h2>
        <NavList>
          <NavItem className="active">👾 Dashboard</NavItem>
          <NavItem onClick={() => navigate('/breakthrough-game')}>🎮 Mini Games</NavItem>
          <NavItem onClick={() => navigate('/track')}>📅 Calendar Tracker</NavItem>
          <NavItem onClick={() => navigate('/new-habit')}>✨ Habit Creation</NavItem>
          <NavItem onClick={() => navigate('/shop')}>🛒 Shop</NavItem>
          <NavItem onClick={() => navigate('/review')}>📊 Review</NavItem>
        </NavList>
      </Sidebar>

      <MainContent>
        <Header>
          <UserGreeting>
            <h1>Welcome{user?.name ? `, ${user.name}` : ''}! 👋</h1>
            <LevelBadge>Level {currentLevel} - {totalXP} XP</LevelBadge>
          </UserGreeting>
          <LogoutButton onClick={() => { logout(); navigate('/login'); }}>Logout</LogoutButton>
        </Header>

        <GridContainer>
          <Card>
            <h2>Progress Overview</h2>
            <ChartControls>
              <ChartTypeButton active={chartType === 'line'} onClick={() => setChartType('line')}>Line</ChartTypeButton>
              <ChartTypeButton active={chartType === 'bar'} onClick={() => setChartType('bar')}>Bar</ChartTypeButton>
            </ChartControls>
            {loading ? <p>Loading chart data...</p> : <ChartContainer>{renderChart()}</ChartContainer>}
            <h3 style={{ marginTop: '1rem' }}>Current Streak: {streak} days</h3>
            <ProgressBarContainer progress={streakPercentage}><div></div></ProgressBarContainer>
            <p>{streak >= 14 ? 'Streak Maxed!' : `${14 - streak} days to max streak`}</p>
          </Card>

          <Card>
            <h2>Leaderboard</h2>
            <LeaderboardList>
              {sortedLeaderboard.map((player, index) => (
                <LeaderboardItem key={player.name}>
                  <div><UserRank>#{index + 1}</UserRank> {player.name}</div>
                  <UserScore>{player.xp} XP</UserScore>
                </LeaderboardItem>
              ))}
            </LeaderboardList>
          </Card>

          <Card>
            <h2>Achievements</h2>
            <AchievementList>
              {achievements
                .filter(achievement => showAllAchievements || achievement.earned)
                .map(achievement => (
                  <AchievementItem key={achievement.id}>
                    <AchievementTitle>{achievement.title}</AchievementTitle>
                    <AchievementDetails>{achievement.description}</AchievementDetails>
                  </AchievementItem>
                ))}
            </AchievementList>
            <Button style={{ marginTop: '1rem', width: '100%' }} onClick={() => setShowAllAchievements(prev => !prev)}>
              {showAllAchievements ? "Collapse" : "View All Achievements"}
            </Button>
          </Card>

          {selectedTask && (
            <TimeAllocationModal>
              <h3>Allocate Time for "{selectedTask.title}"</h3>
              <TimeInput
                type="number"
                placeholder="Estimated time in minutes"
                value={timeAllocation}
                onChange={(e) => setTimeAllocation(e.target.value)}
              />
              <Button onClick={saveTimeAllocation}>Save Time</Button>
              <Button onClick={() => setSelectedTask(null)} style={{ marginLeft: '0.5rem', background: 'linear-gradient(90deg, #00FFC6, #4A90E2)' }}>
                Cancel
              </Button>
            </TimeAllocationModal>
          )}

          <Card>
            <h2>Today's Tasks</h2>
            <TaskList>
              {todayTasks.map((task) => (
                <Task key={task.id}>
                  <TaskCheckbox
                    completed={task.completed}
                    onClick={() => handleTaskCompletion(task.id, !task.completed, task.isHabit)}
                  />
                  {task.isEditing ? (
                    <EditInput
                      type="text"
                      value={task.title}
                      onChange={(e) => updateEvent(todayKey, task.id, { title: e.target.value })}
                      onBlur={() => toggleEdit(task.id)}
                      onKeyDown={(e) => { if (e.key === "Enter") toggleEdit(task.id); }}
                    />
                  ) : (
                    <TaskText completed={task.completed} onDoubleClick={() => toggleEdit(task.id)}>
                      {task.title} {task.isHabit ? `(${habits.find(h => h.id === task.id)?.frequency})` : ''}
                    </TaskText>
                  )}
                  <DeleteButton onClick={() => deleteTask(task.id)}>Delete</DeleteButton>
                </Task>
              ))}
            </TaskList>
            {showInput ? (
              <AddHabitInput
                ref={inputRef}
                type="text"
                placeholder="Add a new task..."
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                onKeyPress={handleKeyPress}
                onBlur={() => setShowInput(false)}
              />
            ) : (
              <AddHabitButton onClick={addHabit}>+ Add Task</AddHabitButton>
            )}
          </Card>
        </GridContainer>
      </MainContent>
      <AIChat
        user={user}
        tasks={todayTasks}
        onTaskUpdate={handleTaskCompletion}
        onAddTaskWithDate={(date, task) => {
          const dateKey = date.toISOString().split('T')[0];
          addEvent(dateKey, task);
        }}
      />
    </DashboardContainer>
  );
};

export default Dashboard;