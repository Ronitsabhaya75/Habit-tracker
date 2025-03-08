/**
 * Dashboard Component
 *
 * This file implements the Dashboard component for the application.
 * It provides an interactive dashboard that includes:
 * - A sidebar with navigation options.
 * - A header displaying user information.
 * - Various cards that display key metrics:
 *    • A progress overview using a responsive chart (Line, Bar) showing all available data.
 *    • A leaderboard ranking users based on performance.
 *    • A section for achievements and milestones.
 *    • A task list for managing activities.
 *    • A streak counter for tracking consistency.
 *    • Habit category progress with stages.
 *    • A calendar for tracking and adding events.
 *
 * The component utilizes React hooks (useState, useEffect, useRef) for state management
 * and side effects. It employs styled-components for CSS-in-JS styling and 
 * integrates with Recharts for data visualization.
 *
 * It also interacts with authentication context (useAuth) and habit context (useHabit) 
 * to fetch the current user's details and habit progress.
 *
 * 🔍 Simulated asynchronous functions (e.g., fetchUserData, fetchLeaderboardData) 
 * are used to mimic API requests.
 *
 * The code follows a modular structure, ensuring readability and maintainability.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../theme';
import { useAuth } from '../context/AuthContext';
import { useHabit } from '../context/HabitContext';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

const HABIT_CATEGORIES = [
  { id: 'addiction', name: 'Addiction Recovery', icon: '🚭', description: 'Break free from harmful dependencies', stages: [
    { level: 1, goal: 'First Week Clean', points: 50, reward: 'Self-Care Package' },
    { level: 2, goal: 'One Month Milestone', points: 200, reward: 'Wellness Session' },
    { level: 3, goal: 'Quarterly Achievement', points: 500, reward: 'Personal Experience Gift' },
  ]},
  { id: 'fitness', name: 'Fitness Transformation', icon: '💪', description: 'Build a healthier, stronger you', stages: [
    { level: 1, goal: 'Consistent Workouts', points: 75, reward: 'Healthy Meal Coupon' },
    { level: 2, goal: 'Nutrition Tracking', points: 250, reward: 'Fitness Gear' },
    { level: 3, goal: 'Body Composition Change', points: 600, reward: 'Personal Training' },
  ]},
];

const floatAnimation = keyframes`
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(2deg); }
  100% { transform: translateY(0) rotate(0deg); }
`;

const starGlow = keyframes`
  0% { opacity: 0.6; filter: blur(1px); }
  50% { opacity: 1; filter: blur(0px); }
  100% { opacity: 0.6; filter: blur(1px); }
`;

const slowRotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const trailAnimation = keyframes`
  0% { opacity: 0; transform: translateX(20px); }
  20% { opacity: 0.7; }
  100% { opacity: 0; transform: translateX(-100px); }
`;

const pulseGlow = keyframes`
  0% { transform: scale(1); opacity: 0.6; box-shadow: 0 0 10px rgba(100, 220, 255, 0.5); }
  50% { transform: scale(1.05); opacity: 0.8; box-shadow: 0 0 20px rgba(100, 220, 255, 0.8); }
  100% { transform: scale(1); opacity: 0.6; box-shadow: 0 0 10px rgba(100, 220, 255, 0.5); }
`;

const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: ${theme.colors.background};
  overflow: hidden;
`;

const GradientOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 50%, rgba(114, 137, 218, 0.15) 0%, transparent 70%),
              radial-gradient(circle at 70% 70%, rgba(90, 128, 244, 0.1) 0%, transparent 60%);
  z-index: 1;
`;

const Scenery = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30%;
  background: linear-gradient(180deg, transparent 0%, rgba(11, 38, 171, 0.2) 100%);
  z-index: 1;
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 5%;
    width: 30%;
    height: 80%;
    background: linear-gradient(135deg, #3b4874 20%, #2b3a67 100%);
    clip-path: polygon(0% 100%, 50% 30%, 100% 100%);
  }
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 15%;
    width: 40%;
    height: 90%;
    background: linear-gradient(135deg, #2b3a67 20%, #1a2233 100%);
    clip-path: polygon(0% 100%, 40% 20%, 80% 60%, 100% 100%);
  }
`;

const Star = styled.div`
  position: absolute;
  width: ${props => props.size || '30px'};
  height: ${props => props.size || '30px'};
  background: radial-gradient(circle, rgba(255, 210, 70, 0.9) 0%, rgba(255, 210, 70, 0) 70%);
  border-radius: 50%;
  z-index: 2;
  animation: ${starGlow} ${props => props.duration || '3s'} infinite ease-in-out;
  animation-delay: ${props => props.delay || '0s'};
  opacity: 0.7;
  &::before {
    content: '★';
    position: absolute;
    font-size: ${props => parseInt(props.size) * 0.8 || '24px'};
    color: rgba(255, 210, 70, 0.9);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const AchievementBadge = styled.div`
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(114, 137, 218, 0.2) 0%, rgba(114, 137, 218, 0) 70%);
  border: 2px solid rgba(114, 137, 218, 0.3);
  box-shadow: 0 0 15px rgba(114, 137, 218, 0.2);
  top: 15%;
  right: 15%;
  z-index: 2;
  animation: ${pulseGlow} 4s infinite ease-in-out;
  &::before {
    content: '🏆';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 24px;
  }
`;

const Rocket = styled.div`
  position: absolute;
  top: 30%;
  left: 15%;
  width: 50px;
  height: 50px;
  z-index: 3;
  animation: ${floatAnimation} 8s infinite ease-in-out;
  transform-origin: center center;
  &::before {
    content: '🚀';
    position: absolute;
    font-size: 28px;
    transform: rotate(45deg);
  }
`;

const RocketTrail = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  width: 80px;
  height: 8px;
  background: linear-gradient(90deg, rgba(100, 220, 255, 0) 0%, rgba(100, 220, 255, 0.7) 100%);
  border-radius: 4px;
  z-index: 2;
  opacity: 0.5;
  filter: blur(2px);
  transform: translateX(-80px);
  animation: ${trailAnimation} 2s infinite;
`;

const ProgressCircle = styled.div`
  position: absolute;
  bottom: 20%;
  right: 10%;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid rgba(100, 220, 255, 0.2);
  border-top: 3px solid rgba(100, 220, 255, 0.8);
  animation: ${slowRotate} 8s linear infinite;
  z-index: 2;
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70px;
    height: 70px;
    border-radius: 50%;
    border: 2px dashed rgba(100, 220, 255, 0.2);
  }
`;

const XPOrb = styled.div`
  position: absolute;
  width: 15px;
  height: 15px;
  background: radial-gradient(circle, rgba(160, 232, 255, 0.6) 30%, rgba(160, 232, 255, 0) 70%);
  border-radius: 50%;
  animation: ${floatAnimation} ${props => props.duration || '4s'} infinite ease-in-out;
  animation-delay: ${props => props.delay || '0s'};
  opacity: 0.5;
  z-index: 2;
`;

const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  position: relative;
  color: ${theme.colors.text};
`;

const Sidebar = styled.div`
  width: 250px;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-right: 1px solid ${theme.colors.borderWhite};
  backdrop-filter: blur(8px);
  z-index: 10;
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
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  &.active {
    background: ${theme.colors.secondary};
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 3rem;
  margin-left: 250px;
  z-index: 10;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const UserGreeting = styled.div`
  h1 { font-size: 2.5rem; span { color: ${theme.colors.accent}; } }
`;

const LevelBadge = styled.div`
  background: ${theme.colors.secondary};
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  box-shadow: ${theme.shadows.card};
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
  align-items: start;
`;

const Card = styled.div`
  background: ${theme.colors.glassWhite};
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid ${theme.colors.borderWhite};
  backdrop-filter: blur(8px);
  transition: transform 0.2s ease;
  &:hover { transform: translateY(-2px); }
`;

const CategoryCard = styled(Card)`
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin-bottom: 1rem;
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    &::after { transform: translateX(0); }
  }
  &::after {
    content: '→';
    position: absolute;
    right: 1rem;
    font-size: 1.5rem;
    transform: translateX(-20px);
    opacity: 0.7;
    transition: transform 0.2s ease;
  }
`;

const CategoryIcon = styled.span`
  font-size: 2rem;
`;

const CategoryInfo = styled.div`
  flex: 1;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin-top: 0.5rem;
  overflow: hidden;
  div {
    height: 100%;
    background: ${theme.colors.accent};
    width: ${props => props.progress}%;
    transition: width 0.3s ease;
  }
`;

const Button = styled.button`
  background: ${theme.colors.accent};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  &:hover { background: rgba(255, 255, 255, 0.1); }
`;

const UserRank = styled.span`
  color: ${theme.colors.accent};
  font-weight: 600;
`;

const UserScore = styled.span`
  color: ${theme.colors.secondary};
`;

const StagesList = styled.div`
  margin-top: 1rem;
`;

const StageItem = styled.div`
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &.completed { background: rgba(46, 213, 115, 0.1); }
  &.current { border: 1px solid ${theme.colors.accent}; }
`;

const RewardBadge = styled.span`
  background: ${theme.colors.accent};
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.9rem;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  background: rgba(255, 255, 255, 0.2);
  height: 10px;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 1rem;
  & div {
    width: ${props => props.progress || '30%'};
    height: 100%;
    background: ${theme.colors.accent};
    transition: width 0.3s ease;
  }
`;

const AddHabitInput = styled.input`
  width: calc(100% - 20px);
  padding: 8px;
  margin-top: 1rem;
  border: 1px solid ${theme.colors.borderWhite};
  border-radius: 8px;
`;

const AddHabitButton = styled.button`
  background: ${theme.colors.accent};
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 0.5rem;
  &:hover { background: ${theme.colors.secondary}; }
`;

const EditInput = styled.input`
  padding: 4px;
  margin-right: 8px;
  border: 1px solid ${theme.colors.borderWhite};
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: ${theme.colors.text};
`;

const DeleteButton = styled.button`
  background: rgba(255, 0, 0, 0.3);
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 8px;
  &:hover { background: rgba(255, 0, 0, 0.5); }
`;

const ChartControls = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ChartTypeButton = styled.button`
  background: ${props => props.active ? theme.colors.accent : 'rgba(114, 137, 218, 0.2)'};
  color: ${theme.colors.text};
  border: none;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: ${props => props.active ? theme.colors.accent : 'rgba(114, 137, 218, 0.3)'}; }
`;

const ChartContainer = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const AchievementList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 1rem;
`;

const AchievementItem = styled.li`
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s ease;
  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.1);
  }
`;

const AchievementTitle = styled.span`
  color: ${theme.colors.accent};
  font-weight: 600;
`;

const AchievementDetails = styled.span`
  color: ${theme.colors.secondary};
`;

const LogoutButton = styled.button`
  background: ${theme.colors.secondary}; // Use secondary color for consistency
  color: white; // Ensures readability
  border: 1px solid rgba(253, 3, 3, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  &:hover {
    background: ${theme.colors.accent}; // Use accent color on hover for visual interest
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

// Calendar styled components
const CalendarContainer = styled.div`
  margin-top: 1rem;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const MonthNavButton = styled.button`
  background: rgba(114, 137, 218, 0.2);
  color: ${theme.colors.text};
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: rgba(114, 137, 218, 0.4);
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
`;

const CalendarDay = styled.div`
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  background: ${props => 
    props.isToday 
      ? 'rgba(114, 137, 218, 0.3)' 
      : props.isSelected 
        ? theme.colors.accent 
        : props.hasEvent 
          ? 'rgba(100, 220, 255, 0.2)' 
          : 'rgba(255, 255, 255, 0.05)'
  };
  
  color: ${props => props.isCurrentMonth ? theme.colors.text : 'rgba(255, 255, 255, 0.4)'};
  font-weight: ${props => props.isToday || props.isSelected ? 'bold' : 'normal'};
  
  &:hover {
    background: ${props => props.isSelected ? theme.colors.accent : 'rgba(114, 137, 218, 0.3)'};
  }
  
  &::after {
    content: ${props => props.hasEvent ? '"•"' : '""'};
    position: absolute;
    bottom: 2px;
    color: ${theme.colors.accent};
    font-size: 14px;
  }
`;

const DayLabel = styled.div`
  text-align: center;
  padding: 0.5rem 0;
  font-weight: bold;
  color: ${theme.colors.secondary};
`;

const EventModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const EventModalContent = styled.div`
  background: ${theme.colors.glassWhite};
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid ${theme.colors.borderWhite};
  backdrop-filter: blur(8px);
  width: 90%;
  max-width: 500px;
`;

const EventInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin: 0.5rem 0;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid ${theme.colors.borderWhite};
  border-radius: 8px;
  color: ${theme.colors.text};
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const EventTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  margin: 0.5rem 0;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid ${theme.colors.borderWhite};
  border-radius: 8px;
  color: ${theme.colors.text};
  min-height: 100px;
  resize: vertical;
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const EventList = styled.div`
  margin-top: 1rem;
  max-height: 200px;
  overflow-y: auto;
`;

const EventItem = styled.div`
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const CancelButton = styled(Button)`
  background: rgba(255, 255, 255, 0.1);
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const AddEventButton = styled(Button)`
  margin-left: auto;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Add logout from AuthContext
  const { progress, getStreak, getCategoryProgress, setStreak } = useHabit();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [chartType, setChartType] = useState('line');
  const [streak, setLocalStreak] = useState(0);
  const [activeCategory, setActiveCategory] = useState(null);
  const inputRef = useRef(null);
  const [showAllAchievements, setShowAllAchievements] = useState(false);

  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [events, setEvents] = useState({});
  const [newEvent, setNewEvent] = useState({ title: '', description: '' });

  const achievements = [
    { id: 1, title: 'First Week Streak', description: 'Completed 7 days of habits', earned: streak >= 7 },
    { id: 2, title: 'Milestone 100 XP', description: 'Reached 100 XP points', earned: Object.values(progress).reduce((sum, p) => sum + p, 0) >= 100 },
    { id: 3, title: 'Habit Master', description: 'Completed 3 habits consistently', earned: Object.keys(progress).length >= 3 },
  ];

  const handleLogout = () => {
    logout(); // Call logout method from AuthContext
    navigate('/login'); // Redirect to login page after logout
  }

  const fetchUserProgress = useCallback(async () => {
    try {
      setLoading(true);
      const userProgress = await fakeFetchUserData();
      setData(userProgress.map((item, index) => ({
        progress: getCategoryProgress(item.date) || item.progress,
      })));
    } catch (error) {
      console.error('Error fetching user progress:', error);
    } finally {
      setLoading(false);
    }
  }, [getCategoryProgress]);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const leaderboardData = await fakeFetchLeaderboardData();
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
    fetchUserProgress();
    const streakValue = getStreak();
    setLocalStreak(streakValue);
    setStreak(streakValue); // Sync with context
  }, [fetchLeaderboard, fetchUserProgress, getStreak, setStreak]);

  useEffect(() => {
    if (user && !leaderboard.some(entry => entry.name === user.name)) {
      setLeaderboard(prev => [...prev, { name: user.name, xp: Object.values(progress).reduce((sum, p) => sum + p, 0) }]);
    }
  }, [user, progress, leaderboard]);

  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.xp - a.xp);

  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  const fakeFetchUserData = async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          Array.from({ length: 7 }, (_, i) => ({
            date: new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000).toLocaleDateString(),
            progress: Math.floor(Math.random() * 10),
          }))
        );
      }, 1000);
    });
  };

  const fakeFetchLeaderboardData = async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          { name: 'Sameer', xp: 450 },
          { name: 'Aarav', xp: 380 },
          { name: 'Priya', xp: 320 },
          { name: 'Vikram', xp: 290 },
          { name: 'Anika', xp: 250 },
        ]);
      }, 1000);
    });
  };

  const addHabit = () => setShowInput(true);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && newHabit.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newHabit.trim(), isEditing: false }]);
      setNewHabit('');
      setShowInput(false);
    }
  };

  const handleEditTask = (taskId, newText) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, text: newText, isEditing: false } : task
    ));
  };

  const toggleEdit = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, isEditing: !task.isEditing } : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const getLineColor = (progress) => {
    if (progress < 4) return 'red';
    if (progress < 6) return 'lightcoral';
    return 'lightgreen';
  };

  const calculateCategoryProgress = (categoryId) => {
    const category = HABIT_CATEGORIES.find(cat => cat.id === categoryId);
    if (!category) return 0;
    const currentPoints = getCategoryProgress(categoryId);
    const maxPoints = category.stages[category.stages.length - 1].points;
    return Math.min((currentPoints / maxPoints) * 100, 100);
  };

  const getCurrentStage = (categoryId) => {
    const category = HABIT_CATEGORIES.find(cat => cat.id === categoryId);
    if (!category) return null;
    const currentPoints = getCategoryProgress(categoryId);
    return category.stages.find(stage => currentPoints < stage.points) || category.stages[category.stages.length - 1];
  };

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    navigate(`/breakthrough-game?category=${categoryId}`, { state: { fromDashboard: true } });
  };

  const getStageStatus = (stage, categoryId) => {
    const currentPoints = getCategoryProgress(categoryId);
    if (currentPoints >= stage.points) return 'completed';
    if (currentPoints < stage.points && (!getCurrentStage(categoryId) || getCurrentStage(categoryId).level === stage.level)) return 'current';
    return '';
  };

  const calculateTotalLevel = () => {
    const totalPoints = Object.values(progress).reduce((sum, points) => sum + points, 0);
    return Math.floor(totalPoints / 100) + 1;
  };

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={data}>
              <XAxis dataKey="day" stroke={theme.colors.text} />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="progress" fill={theme.colors.accent} />
            </BarChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={data}>
              <XAxis dataKey="day" stroke={theme.colors.text} />
              <YAxis hide />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="progress"
                stroke={data.length ? getLineColor(data[data.length - 1]?.progress) : theme.colors.accent}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  // Calendar functions
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const previousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const handleDateClick = (year, month, day) => {
    const clickedDate = new Date(year, month, day);
    setSelectedDate(clickedDate);
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const handleOpenEventModal = () => {
    if (!selectedDate) {
      // If no date is selected, use today's date
      setSelectedDate(new Date());
    }
    setShowEventModal(true);
    setNewEvent({ title: '', description: '' });
  };

  const handleCloseEventModal = () => {
    setShowEventModal(false);
  };

  const handleAddEvent = () => {
    if (selectedDate && newEvent.title.trim()) {
      const dateKey = formatDate(selectedDate);
      const updatedEvents = { ...events };
      
      if (!updatedEvents[dateKey]) {
        updatedEvents[dateKey] = [];
      }
      
      updatedEvents[dateKey].push({
        id: Date.now(),
        title: newEvent.title,
        description: newEvent.description
      });
      
      setEvents(updatedEvents);
      setNewEvent({ title: '', description: '' });
      setShowEventModal(false);
    }
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Day labels (Mon, Tue, etc.)
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayLabels.forEach(day => {
      days.push(<DayLabel key={`label-${day}`}>{day}</DayLabel>);
    });
    
    // Empty cells for days from previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
      const prevMonthDay = new Date(year, month, 0 - (firstDayOfMonth - i - 1));
      days.push(
        <CalendarDay 
          key={`prev-${i}`} 
          isCurrentMonth={false}
          onClick={() => handleDateClick(prevMonthDay.getFullYear(), prevMonthDay.getMonth(), prevMonthDay.getDate())}
        >
          {prevMonthDay.getDate()}
        </CalendarDay>
      );
    }
    
    // Days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = formatDate(date);
      const hasEvents = events[dateKey] && events[dateKey].length > 0;
      
      const isSelectedDay = selectedDate && 
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();
      
      days.push(
        <CalendarDay 
          key={`current-${day}`}
          isCurrentMonth={true}
          isToday={isToday(date)}
          isSelected={isSelectedDay}
          hasEvent={hasEvents}
          onClick={() => handleDateClick(year, month, day)}
        >
          {day}
        </CalendarDay>
      );
    }
    
    // Fill remaining cells with days from next month
    const totalCells = 42; // 6 rows * 7 days
    const remainingCells = totalCells - (firstDayOfMonth + daysInMonth);
    
    for (let i = 1; i <= remainingCells; i++) {
      const nextMonthDay = new Date(year, month + 1, i);
      days.push(
        <CalendarDay 
          key={`next-${i}`} 
          isCurrentMonth={false}
          onClick={() => handleDateClick(nextMonthDay.getFullYear(), nextMonthDay.getMonth(), nextMonthDay.getDate())}
        >
          {i}
        </CalendarDay>
      );
    }
    
    return days;
  };

  const renderSelectedDateEvents = () => {
    if (!selectedDate) return null;
    
    const dateKey = formatDate(selectedDate);
    const dateEvents = events[dateKey] || [];
    
    if (dateEvents.length === 0) {
      return <p>No events scheduled for this date.</p>;
    }
    
    return (
      <EventList>
        {dateEvents.map(event => (
          <EventItem key={event.id}>
            <strong>{event.title}</strong>
            {event.description && <p>{event.description}</p>}
          </EventItem>
        ))}
      </EventList>
    );
  };

  return (
    <DashboardContainer>
      <Background>
        <GradientOverlay />
        <Scenery />
        <Star size="20px" style={{ top: '10%', left: '10%' }} duration="4s" delay="0.5s" />
        <Star size="15px" style={{ top: '25%', left: '25%' }} duration="3s" delay="1s" />
        <Star size="25px" style={{ top: '15%', right: '30%' }} duration="5s" delay="0.2s" />
        <Rocket><RocketTrail /></Rocket>
        <AchievementBadge />
        <ProgressCircle />
        <XPOrb style={{ top: '65%', left: '15%' }} duration="6s" delay="0.2s" />
        <XPOrb style={{ top: '30%', right: '25%' }} duration="5s" delay="1.2s" />
        <XPOrb style={{ top: '75%', right: '30%' }} duration="7s" delay="0.5s" />
        <XPOrb style={{ top: '45%', left: '60%' }} duration="5.5s" delay="1.5s" />
      </Background>

      <Sidebar>
        <h2>HabitQuest</h2>
        <NavList>
          <NavItem className="active">📊 Dashboard</NavItem>
          <NavItem onClick={() => navigate('/breakthrough-game')}>🎮 Breakthrough Game</NavItem>
          <NavItem>⚙️ Settings</NavItem>
        </NavList>
      </Sidebar>

      <MainContent>
        <Header>
          <UserGreeting>
            <h1>Welcome{user?.name ? `, ${user.name}` : ''}! 👋</h1>
            <LevelBadge>Level {calculateTotalLevel()} - {Object.values(progress).reduce((sum, p) => sum + p, 0)} XP</LevelBadge>
          </UserGreeting>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
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
          <ProgressBarContainer progress={Math.min((streak / 14) * 100, 100)}><div></div></ProgressBarContainer>
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
            .filter(achievement => showAllAchievements || achievement.earned) // Show all if expanded
            .map(achievement => (
              <AchievementItem key={achievement.id}>
                <AchievementTitle>{achievement.title}</AchievementTitle>
                <AchievementDetails>{achievement.description}</AchievementDetails>
              </AchievementItem>
          ))}
        </AchievementList>

        <Button 
          style={{ marginTop: '1rem', width: '100%' }} 
          onClick={() => setShowAllAchievements(prev => !prev)}
        >
          {showAllAchievements ? "Collapse" :  "View All Achievements"}
        </Button>
        </Card>

        <Card>
          <h2>Tasks</h2>
          <ul>
            {tasks.map(task => (
              <li key={task.id} style={{ margin: '8px 0' }}>
                {task.isEditing ? (
                  <EditInput
                    type="text"
                    value={task.text}
                    onChange={(e) => setTasks(tasks.map(t => t.id === task.id ? { ...t, text: e.target.value } : t))}
                    onKeyPress={(e) => { if (e.key === 'Enter') handleEditTask(task.id, e.target.value); }}
                    autoFocus
                    onBlur={() => toggleEdit(task.id)}
                    onKeyDown={(e) => { if (e.key === 'Escape') toggleEdit(task.id); }}
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ cursor: 'pointer', flexGrow: 1 }} onClick={() => toggleEdit(task.id)}>{task.text}</span>
                    <DeleteButton onClick={() => deleteTask(task.id)}>Delete</DeleteButton>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <AddHabitButton onClick={addHabit}>+ New Habit</AddHabitButton>
          {showInput && (
            <AddHabitInput
              ref={inputRef}
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter new habit"
            />
          )}
        </Card>

        {/* Calendar Card */}
        <Card>
          <h2>Calendar</h2>
          <CalendarContainer>
            <CalendarHeader>
              <MonthNavButton onClick={previousMonth}>← Prev</MonthNavButton>
              <h3>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
              <MonthNavButton onClick={nextMonth}>Next →</MonthNavButton>
            </CalendarHeader>
            
            {/* Add Event Button in Calendar Header */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <AddEventButton onClick={handleOpenEventModal}>+ Add Event</AddEventButton>
            </div>
            
            <CalendarGrid>
              {renderCalendarDays()}
            </CalendarGrid>
            
            {selectedDate && (
              <div style={{ marginTop: '1rem' }}>
                <h4>
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h4>
                {renderSelectedDateEvents()}
                <Button 
                  style={{ marginTop: '1rem', width: '100%' }} 
                  onClick={handleOpenEventModal}
                >
                  + Add Event
                </Button>
              </div>
            )}
          </CalendarContainer>
        </Card>
      </GridContainer>

      {/* Event Modal */}
      {showEventModal && (
        <EventModal>
          <EventModalContent>
            <h3>Add Event for {selectedDate.toLocaleDateString()}</h3>
            <EventInput
              type="text"
              placeholder="Event Title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
            />
            <EventTextarea
              placeholder="Event Description (optional)"
              value={newEvent.description}
              onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
            />
            <ModalButtonContainer>
              <CancelButton onClick={handleCloseEventModal}>Cancel</CancelButton>
              <Button onClick={handleAddEvent}>Save Event</Button>
            </ModalButtonContainer>
          </EventModalContent>
        </EventModal>
      )}
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;