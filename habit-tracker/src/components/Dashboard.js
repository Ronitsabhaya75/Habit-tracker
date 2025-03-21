<<<<<<< HEAD
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

=======
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../theme';
import { useAuth } from '../context/AuthContext';
<<<<<<< HEAD
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
=======
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
>>>>>>> 2e0f76ccae73d42eb5f182615256275260503bfd

// **ANIMATIONS**
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
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

<<<<<<< HEAD
=======
// **BACKGROUND**
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
<<<<<<< HEAD
  background: ${theme.colors.background};
  overflow: hidden;
`;

=======
  background: linear-gradient(135deg, #2b3a67 0%, #1a2233 100%);
  overflow: hidden;
`;

// Gradient Overlay
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
const GradientOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 50%, rgba(114, 137, 218, 0.15) 0%, transparent 70%),
              radial-gradient(circle at 70% 70%, rgba(90, 128, 244, 0.1) 0%, transparent 60%);
  z-index: 1;
`;

<<<<<<< HEAD
=======
// Scenery
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
const Scenery = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30%;
<<<<<<< HEAD
  background: linear-gradient(180deg, transparent 0%, rgba(11, 38, 171, 0.2) 100%);
  z-index: 1;
=======
  background: linear-gradient(180deg, transparent 0%, rgba(48, 56, 97, 0.2) 100%);
  z-index: 1;
  
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
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
<<<<<<< HEAD
=======
  
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
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

<<<<<<< HEAD
=======
// Stars
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
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
<<<<<<< HEAD
=======
  
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
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

<<<<<<< HEAD
=======
// Achievement Badge
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
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
<<<<<<< HEAD
=======
  
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
  &::before {
    content: '🏆';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 24px;
  }
`;

<<<<<<< HEAD
=======
// Rocket
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
const Rocket = styled.div`
  position: absolute;
  top: 30%;
  left: 15%;
  width: 50px;
  height: 50px;
  z-index: 3;
  animation: ${floatAnimation} 8s infinite ease-in-out;
  transform-origin: center center;
<<<<<<< HEAD
=======
  
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
  &::before {
    content: '🚀';
    position: absolute;
    font-size: 28px;
    transform: rotate(45deg);
  }
`;

<<<<<<< HEAD
=======
// Rocket Trail
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
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

<<<<<<< HEAD
=======
// Progress Circle
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
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
<<<<<<< HEAD
=======
  
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
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

<<<<<<< HEAD
=======
// XP Orb
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
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

<<<<<<< HEAD
=======
// Dashboard Container
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  position: relative;
  color: ${theme.colors.text};
`;

<<<<<<< HEAD
=======
// Sidebar
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
const Sidebar = styled.div`
  width: 250px;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-right: 1px solid ${theme.colors.borderWhite};
  backdrop-filter: blur(8px);
  z-index: 10;
`;

<<<<<<< HEAD
=======
// Nav List
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 2rem;
`;

<<<<<<< HEAD
=======
// Nav Item
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
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

<<<<<<< HEAD
const MainContent = styled.div`
  flex: 1;
  padding: 3rem;
  margin-left: 20px;
  z-index: 10;
`;

=======
// Main Content
const MainContent = styled.div`
  flex: 1;
  padding: 3rem;
  margin-left: 250px;
  z-index: 10;
`;

// Header
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

<<<<<<< HEAD
const UserGreeting = styled.div`
  h1 { font-size: 2.5rem; span { color: ${theme.colors.accent}; } }
`;

=======
// User Greeting
const UserGreeting = styled.div`
  h1 {
    font-size: 2.5rem;
    span {
      color: ${theme.colors.accent};
    }
  }
`;

// Level Badge
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
const LevelBadge = styled.div`
  background: ${theme.colors.secondary};
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  box-shadow: ${theme.shadows.card};
`;

<<<<<<< HEAD
const GridContainer = styled.div`
  display: grid;
  gird-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
  align-items: start;
  justify-content: start;
`;

=======
// Grid Container
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
  align-items: start;
`;

// Card
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
const Card = styled.div`
  background: ${theme.colors.glassWhite};
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid ${theme.colors.borderWhite};
  backdrop-filter: blur(8px);
<<<<<<< HEAD
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

=======
`;

<<<<<<< HEAD
// Chart Controls
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
const ChartControls = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

<<<<<<< HEAD
=======
// Chart Type Button
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
const ChartTypeButton = styled.button`
  background: ${props => props.active ? theme.colors.accent : 'rgba(114, 137, 218, 0.2)'};
  color: ${theme.colors.text};
  border: none;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
<<<<<<< HEAD
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
=======
  
  &:hover {
    background: ${props => props.active ? theme.colors.accent : 'rgba(114, 137, 218, 0.3)'};
  }
`;

=======
>>>>>>> 2e0f76ccae73d42eb5f182615256275260503bfd
// Progress Bar Container
const ProgressBarContainer = styled.div`
  width: 100%;
  background: rgba(255, 255, 255, 0.2);
  height: 10px;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 1rem;
  & div {
    width: 30%;
    height: 100%;
    background: ${theme.colors.accent};
    transition: width 0.3s ease;
  }
`;

// Input Styles
const InputField = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(114, 137, 218, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: ${theme.colors.text};
  font-size: 1rem;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
    box-shadow: 0 0 0 2px rgba(114, 137, 218, 0.2);
  }
`;

// Button Styles
const Button = styled.button`
  background: ${props => props.primary ? theme.colors.accent : 'rgba(114, 137, 218, 0.2)'};
  color: ${theme.colors.text};
  border: 1px solid ${props => props.primary ? 'transparent' : 'rgba(114, 137, 218, 0.3)'};
  border-radius: 8px;
  padding: 0.8rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${props => props.primary ? 'rgba(114, 137, 218, 0.9)' : 'rgba(114, 137, 218, 0.3)'};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// Calendar Styles
const CalendarWrapper = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0 0.5rem;
`;

const MonthTitle = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${theme.colors.accent};
`;

const DayNames = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 0.5rem;
`;

const DayName = styled.div`
  padding: 0.5rem;
  font-weight: 600;
  color: ${theme.colors.secondary};
  font-size: 0.9rem;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
`;

const CalendarDay = styled.div`
  text-align: center;
  padding: 0.6rem 0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.isSelected ? 'rgba(114, 137, 218, 0.3)' : props.isToday ? 'rgba(114, 137, 218, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
  border: ${props => props.isToday ? '1px solid rgba(114, 137, 218, 0.5)' : props.hasEvent ? '1px solid rgba(160, 232, 255, 0.3)' : '1px solid transparent'};
  color: ${props => props.isOtherMonth ? 'rgba(255, 255, 255, 0.3)' : theme.colors.text};
  font-size: 0.9rem;
  position: relative;
  
  &:hover {
    background: rgba(114, 137, 218, 0.2);
  }
`;

const EventDot = styled.div`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: ${theme.colors.accent};
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
`;

const EventsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0;
`;

const EventItem = styled.li`
  padding: 0.8rem;
  margin: 0.5rem 0;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border-left: 3px solid ${theme.colors.accent};
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:hover {
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
    background: rgba(255, 255, 255, 0.1);
  }
`;

<<<<<<< HEAD
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
=======
const DeleteButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    color: rgba(255, 255, 255, 0.9);
  }
`;

const SelectedDateInfo = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const DateTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: ${theme.colors.accent};
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: linear-gradient(135deg, #2b3a67 0%, #1a2233 100%);
  border-radius: 16px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  border: 1px solid ${theme.colors.borderWhite};
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    margin: 0;
    color: ${theme.colors.accent};
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.5rem;
  cursor: pointer;
  
  &:hover {
    color: rgba(255, 255, 255, 0.9);
  }
`;

// Dashboard Component
const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const inputRef = useRef(null);
  
  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState("");
<<<<<<< HEAD
  
  // Chart state
  const [chartType, setChartType] = useState('line'); // 'line', 'bar', or 'pie'
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
    fetchCategoryData();
=======

  useEffect(() => {
    fetchLeaderboard();
>>>>>>> 2e0f76ccae73d42eb5f182615256275260503bfd
  }, []);

  useEffect(() => {
    if (user && !leaderboard.some(entry => entry.name === user.name)) {
      setLeaderboard(prev => [...prev, { name: user.name, xp: 0 }]);
    }
  }, [user, leaderboard]);
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf

  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.xp - a.xp);

  useEffect(() => {
<<<<<<< HEAD
=======
    fetchUserProgress();
  }, []);

  useEffect(() => {
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);
<<<<<<< HEAD

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
=======
  
  useEffect(() => {
    // Initialize some sample events
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    const initialEvents = {
      [formatDate(today)]: ['Complete daily meditation'],
      [formatDate(tomorrow)]: ['Workout session', 'Read for 30 minutes'],
      [formatDate(nextWeek)]: ['Weekly progress review']
    };
    
    setEvents(initialEvents);
  }, []);

  const fetchUserProgress = async () => {
    try {
      setLoading(true);
      const userProgress = await fakeFetchUserData();
      setData(userProgress);
    } catch (error) {
      console.error("Error fetching user progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const leaderboardData = await fakeFetchLeaderboardData();
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    }
  };

<<<<<<< HEAD
  const fetchCategoryData = async () => {
    // Simulate fetching category data
    const categories = [
      { name: 'Health', value: 45 },
      { name: 'Learning', value: 30 },
      { name: 'Productivity', value: 15 },
      { name: 'Social', value: 10 }
    ];
    setCategoryData(categories);
  };

=======
>>>>>>> 2e0f76ccae73d42eb5f182615256275260503bfd
  const fakeFetchUserData = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
<<<<<<< HEAD
          Array.from({ length: 7 }, (_, i) => ({ 
            day: `Day ${i+1}`,
            progress: Math.floor(Math.random() * 100) 
          }))
=======
          Array.from({ length: 5 }, (_, i) => ({ progress: Math.floor(Math.random() * 100) }))
>>>>>>> 2e0f76ccae73d42eb5f182615256275260503bfd
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
        );
      }, 1000);
    });
  };

  const fakeFetchLeaderboardData = async () => {
<<<<<<< HEAD
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
=======
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { name: 'Sameer', xp: 450 },
          { name: 'Aarav', xp: 380 },
          { name: 'Priya', xp: 320 },
          { name: 'Vikram', xp: 290 },
          { name: 'Anika', xp: 250 },
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
        ]);
      }, 1000);
    });
  };

<<<<<<< HEAD
  const addHabit = () => setShowInput(true);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && newHabit.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newHabit.trim(), isEditing: false }]);
      setNewHabit('');
=======
  const addHabit = () => {
    setShowInput(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && newHabit.trim()) {
      setTasks([...tasks, newHabit.trim()]);
      setNewHabit("");
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
      setShowInput(false);
    }
  };

<<<<<<< HEAD
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
    if (progress < 40) return 'red';
    if (progress > 40 && progress < 60) return 'lightcoral';
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
=======
<<<<<<< HEAD
  // Function to cycle through chart types
  const cycleChartType = () => {
    if (chartType === 'line') setChartType('bar');
    else if (chartType === 'bar') setChartType('pie');
    else setChartType('line');
  };

  // Function to set a random chart type
  const randomChartType = () => {
    const types = ['line', 'bar', 'pie'];
    const randomIndex = Math.floor(Math.random() * types.length);
    setChartType(types[randomIndex]);
  };

=======
>>>>>>> 2e0f76ccae73d42eb5f182615256275260503bfd
  const getLineColor = (progress) => {
    if (progress < 30) return 'red';
    if (progress < 60) return 'lightcoral';
    return 'lightgreen';
  };
<<<<<<< HEAD

  // Custom colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a64af5'];
=======
>>>>>>> 2e0f76ccae73d42eb5f182615256275260503bfd
  
  // Calendar functions
  const formatDate = (date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };
  
  const formatDisplayDate = (date) => {
    return date.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };
  
  const changeMonth = (amount) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + amount);
    setCurrentDate(newDate);
  };
  
  const handleDayClick = (date) => {
    setSelectedDate(date);
  };
  
  const openAddEventModal = () => {
    setShowModal(true);
    setNewEvent("");
  };
  
  const closeModal = () => {
    setShowModal(false);
  };
  
  const addEvent = () => {
    if (newEvent.trim()) {
      const dateStr = formatDate(selectedDate);
      setEvents(prev => ({
        ...prev,
        [dateStr]: [...(prev[dateStr] || []), newEvent.trim()]
      }));
      setNewEvent("");
      closeModal();
    }
  };
  
  const deleteEvent = (dateStr, index) => {
    setEvents(prev => {
      const updatedEvents = { ...prev };
      const eventList = [...updatedEvents[dateStr]];
      eventList.splice(index, 1);
      
      if (eventList.length === 0) {
        delete updatedEvents[dateStr];
      } else {
        updatedEvents[dateStr] = eventList;
      }
      
      return updatedEvents;
    });
  };
  
  // Calendar rendering functions
  const renderDayNames = () => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <DayNames>
        {dayNames.map(name => (
          <DayName key={name}>{name}</DayName>
        ))}
      </DayNames>
    );
  };
  
  const renderCalendarDays = () => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    const endDate = new Date(monthEnd);
    
    // Adjust to start from Sunday
    startDate.setDate(1 - monthStart.getDay());
    
    // Ensure we display 6 weeks
    endDate.setDate(monthEnd.getDate() + (6 - monthEnd.getDay()));
    
    const days = [];
    let day = new Date(startDate);
    
    while (day <= endDate) {
      const dateStr = formatDate(day);
      const isCurrentMonth = day.getMonth() === currentDate.getMonth();
      const hasEvents = events[dateStr] && events[dateStr].length > 0;
      const currentDay = new Date(day);
      
      days.push(
        <CalendarDay 
          key={dateStr}
          isOtherMonth={!isCurrentMonth}
          isToday={isToday(day)}
          isSelected={selectedDate && formatDate(selectedDate) === dateStr}
          hasEvent={hasEvents}
          onClick={() => handleDayClick(currentDay)}
        >
          {day.getDate()}
          {hasEvents && <EventDot />}
        </CalendarDay>
      );
      
      day.setDate(day.getDate() + 1);
    }
    
    return days;
  };
  
  const renderEvents = () => {
    const dateStr = formatDate(selectedDate);
    const dateEvents = events[dateStr] || [];
    
    if (dateEvents.length === 0) {
      return <p>No events scheduled.</p>;
    }
    
    return (
      <EventsList>
        {dateEvents.map((event, index) => (
          <EventItem key={index}>
            {event}
            <DeleteButton onClick={() => deleteEvent(dateStr, index)}>×</DeleteButton>
          </EventItem>
        ))}
      </EventsList>
    );
  };

<<<<<<< HEAD
  // Render chart based on type
  const renderChart = () => {
    switch(chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={200}>
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
            <BarChart data={data}>
              <XAxis dataKey="day" stroke={theme.colors.text} />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="progress" fill={theme.colors.accent} />
            </BarChart>
          </ResponsiveContainer>
        );
<<<<<<< HEAD
      default:
        return (
          <ResponsiveContainer width="100%" height={150}>
=======
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
{categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      default: // line chart
        return (
          <ResponsiveContainer width="100%" height={200}>
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
            <LineChart data={data}>
              <XAxis dataKey="day" stroke={theme.colors.text} />
              <YAxis hide />
              <Tooltip />
<<<<<<< HEAD
              <Line
                type="monotone"
                dataKey="progress"
                stroke={data.length ? getLineColor(data[data.length - 1]?.progress) : theme.colors.accent}
                strokeWidth={2}
              />
=======
              <Line type="monotone" dataKey="progress" stroke={theme.colors.accent} strokeWidth={2} dot={{ r: 4 }} />
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

<<<<<<< HEAD


=======
  return (
    <DashboardContainer>
      {/* Animated Background */}
      <Background>
        <GradientOverlay />
        <Star size="15px" style={{ top: '15%', left: '25%' }} duration="3s" />
        <Star size="10px" style={{ top: '45%', left: '8%' }} duration="4s" delay="1s" />
        <Star size="12px" style={{ top: '30%', left: '80%' }} duration="3.5s" delay="0.5s" />
        <Star size="8px" style={{ top: '60%', left: '70%' }} duration="2.5s" delay="0.2s" />
        <Star size="6px" style={{ top: '20%', left: '55%' }} duration="2s" delay="0.8s" />
        <Star size="10px" style={{ top: '70%', left: '30%' }} duration="3.2s" delay="1.2s" />
=======
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
  return (
    <DashboardContainer>
      <Background>
        <GradientOverlay />
        <Scenery />
        <Star size="20px" style={{ top: '10%', left: '10%' }} duration="4s" delay="0.5s" />
        <Star size="15px" style={{ top: '25%', left: '25%' }} duration="3s" delay="1s" />
        <Star size="25px" style={{ top: '15%', right: '30%' }} duration="5s" delay="0.2s" />
<<<<<<< HEAD
        <Rocket><RocketTrail /></Rocket>
        <AchievementBadge />
        <ProgressCircle />
=======
>>>>>>> 2e0f76ccae73d42eb5f182615256275260503bfd
        <Rocket>
          <RocketTrail />
        </Rocket>
        <AchievementBadge />
        <ProgressCircle />
<<<<<<< HEAD
        <XPOrb style={{ top: '40%', left: '35%' }} duration="5s" />
        <XPOrb style={{ top: '25%', left: '65%' }} duration="6s" delay="0.5s" />
        <XPOrb style={{ top: '65%', left: '20%' }} duration="4s" delay="0.3s" />
        <XPOrb style={{ top: '50%', left: '80%' }} duration="7s" delay="0.2s" />
        <Scenery />
      </Background>

      {/* Sidebar Navigation */}
      <Sidebar>
        <h2>HabitForge</h2>
        <NavList>
          <NavItem className="active">
            <span>📊</span> Dashboard
          </NavItem>
          <NavItem>
            <span>✅</span> Habits
          </NavItem>
          <NavItem>
            <span>🏆</span> Achievements
          </NavItem>
          <NavItem>
            <span>👥</span> Community
          </NavItem>
          <NavItem>
            <span>⚙️</span> Settings
          </NavItem>
        </NavList>
      </Sidebar>

      {/* Main Content */}
      <MainContent>
        <Header>
          <UserGreeting>
            <h1>Welcome back, <span>{user?.name || 'User'}</span>!</h1>
            <p>You're on track to build great habits.</p>
          </UserGreeting>
          <LevelBadge>Level 7 • 350 XP</LevelBadge>
        </Header>

        <GridContainer>
          {/* Progress Card */}
          <Card>
            <h2>Your Progress</h2>
            <ChartControls>
              <ChartTypeButton 
                active={chartType === 'line'} 
                onClick={() => setChartType('line')}
              >
                Line
              </ChartTypeButton>
              <ChartTypeButton 
                active={chartType === 'bar'} 
                onClick={() => setChartType('bar')}
              >
                Bar
              </ChartTypeButton>
              <ChartTypeButton 
                active={chartType === 'pie'} 
                onClick={() => setChartType('pie')}
              >
                Pie
              </ChartTypeButton>
            </ChartControls>
            
            {loading ? (
              <p>Loading chart data...</p>
            ) : (
              renderChart()
            )}
            
            <h3 style={{ marginTop: '2rem' }}>Current Streak: 7 days</h3>
            <ProgressBarContainer>
              <div style={{ width: '70%' }}></div>
            </ProgressBarContainer>
            <p>70% to your next level</p>
          </Card>

          {/* Calendar Card */}
=======
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
        <XPOrb style={{ top: '65%', left: '15%' }} duration="6s" delay="0.2s" />
        <XPOrb style={{ top: '30%', right: '25%' }} duration="5s" delay="1.2s" />
        <XPOrb style={{ top: '75%', right: '30%' }} duration="7s" delay="0.5s" />
        <XPOrb style={{ top: '45%', left: '60%' }} duration="5.5s" delay="1.5s" />
      </Background>

      <Sidebar>
        <h2>HabitQuest</h2>
        <NavList>
<<<<<<< HEAD
          <NavItem className="active">Dashboard</NavItem>
          <NavItem onClick={() => navigate('/spinWheel')}> SpinWheel</NavItem>
          <NavItem onClick={() => navigate('/habitProgressTracker')}>HabitProgressTracker</NavItem>
          <NavItem onClick={() => navigate('/breakthrough-game')}>Games</NavItem>
          <NavItem onClick={() => navigate('/track')}>Events</NavItem> {/* New Track Button */}
          <NavItem onClick={() => navigate('/review')}> Review</NavItem>
=======
          <NavItem className="active">📊 Dashboard</NavItem>
          <NavItem>📅 Calendar</NavItem>
          <NavItem>🏆 Achievements</NavItem>
          <NavItem>📈 Statistics</NavItem>
          <NavItem>⚙️ Settings</NavItem>
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
        </NavList>
      </Sidebar>

      <MainContent>
        <Header>
          <UserGreeting>
            <h1>Welcome{user?.name ? `, ${user.name}` : ''}! 👋</h1>
<<<<<<< HEAD
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
      </GridContainer>
      </MainContent>
=======
            <LevelBadge>Level 1 - 0 XP</LevelBadge>
          </UserGreeting>
        </Header>

        <GridContainer>
          <Card>
            <h1>Progress Overview</h1>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={data}>
                <XAxis dataKey="day" stroke={theme.colors.text} />
                <YAxis hide />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="progress" 
                  stroke={data.length ? getLineColor(data[data.length - 1].progress) : theme.colors.accent} 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h2>Leaderboard</h2>
            <EventsList>
              {sortedLeaderboard.map((leaderboardUser, index) => (
                <EventItem key={leaderboardUser.name}>
                  <div>
                    #{index + 1} {leaderboardUser.name}
                  </div>
                  <span>{leaderboardUser.xp} XP</span>
                </EventItem>
              ))}
            </EventsList>
          </Card>

>>>>>>> 2e0f76ccae73d42eb5f182615256275260503bfd
          <Card>
            <h2>Calendar</h2>
            <CalendarWrapper>
              <CalendarContainer>
                <CalendarHeader>
<<<<<<< HEAD
                  <Button onClick={() => changeMonth(-1)}>←</Button>
                  <MonthTitle>
                    {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                  </MonthTitle>
                  <Button onClick={() => changeMonth(1)}>→</Button>
=======
                  <Button onClick={() => changeMonth(-1)}>
                    ◀ Prev
                  </Button>
                  <MonthTitle>
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </MonthTitle>
                  <Button onClick={() => changeMonth(1)}>
                    Next ▶
                  </Button>
>>>>>>> 2e0f76ccae73d42eb5f182615256275260503bfd
                </CalendarHeader>
                
                {renderDayNames()}
                <CalendarGrid>
                  {renderCalendarDays()}
                </CalendarGrid>
                
                <SelectedDateInfo>
<<<<<<< HEAD
                  <DateTitle>
                    {formatDisplayDate(selectedDate)}
                    <Button 
                      style={{ marginLeft: '1rem' }} 
                      onClick={openAddEventModal}
                    >
                      + Add Event
                    </Button>
                  </DateTitle>
                  
                  {renderEvents()}
=======
                  <DateTitle>{formatDisplayDate(selectedDate)}</DateTitle>
                  {renderEvents()}
                  <Button primary onClick={openAddEventModal}>
                    Add Event
                  </Button>
>>>>>>> 2e0f76ccae73d42eb5f182615256275260503bfd
                </SelectedDateInfo>
              </CalendarContainer>
            </CalendarWrapper>
          </Card>

<<<<<<< HEAD
          {/* Habits Card */}
          <Card>
            <h2>Your Habits</h2>
            <Button primary onClick={addHabit}>+ Add New Habit</Button>
            
            {showInput && (
              <div style={{ marginTop: '1rem' }}>
                <InputField
                  ref={inputRef}
                  type="text"
                  placeholder="Enter new habit..."
                  value={newHabit}
                  onChange={(e) => setNewHabit(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
            )}
            
            <EventsList>
              {tasks.map((task, index) => (
                <EventItem key={index}>
                  {task}
                </EventItem>
              ))}
              {tasks.length === 0 && (
                <p>No habits created yet. Add your first one!</p>
              )}
            </EventsList>
          </Card>

          {/* Leaderboard Card */}
          <Card>
            <h2>Leaderboard</h2>
            <EventsList>
              {sortedLeaderboard.map((entry, index) => (
                <EventItem 
                  key={index} 
                  style={{ 
                    borderLeft: index < 3 ? `3px solid ${['gold', 'silver', '#cd7f32'][index]}` : undefined 
                  }}
                >
                  <span>{index + 1}. {entry.name}</span>
                  <span>{entry.xp} XP</span>
                </EventItem>
              ))}
            </EventsList>
=======
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Habits</h2>
              <Button primary onClick={addHabit}>
                Add Habit
              </Button>
            </div>
            
            <div>
              {tasks.map((task, index) => (
                <EventItem key={index}>
                  {task}
                  <ProgressBarContainer>
                    <div></div>
                  </ProgressBarContainer>
                </EventItem>
              ))}
              
              {showInput && (
                <InputField
                  ref={inputRef}
                  type="text"
                  placeholder="Enter a new habit..."
                  value={newHabit}
                  onChange={(e) => setNewHabit(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onBlur={() => setShowInput(false)}
                />
              )}
              
              {tasks.length === 0 && !showInput && (
                <p>No habits added yet. Click "Add Habit" to get started!</p>
              )}
            </div>
>>>>>>> 2e0f76ccae73d42eb5f182615256275260503bfd
          </Card>
        </GridContainer>
      </MainContent>

<<<<<<< HEAD
      {/* Add Event Modal */}
=======
>>>>>>> 2e0f76ccae73d42eb5f182615256275260503bfd
      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
<<<<<<< HEAD
              <h2>Add Event</h2>
              <CloseButton onClick={closeModal}>×</CloseButton>
            </ModalHeader>
            
            <p>Date: {formatDisplayDate(selectedDate)}</p>
            
            <InputField
              type="text"
              placeholder="Event description..."
=======
              <h2>Add Event for {formatDisplayDate(selectedDate)}</h2>
              <CloseButton onClick={closeModal}>×</CloseButton>
            </ModalHeader>
            
            <InputField
              type="text"
              placeholder="Enter event description..."
>>>>>>> 2e0f76ccae73d42eb5f182615256275260503bfd
              value={newEvent}
              onChange={(e) => setNewEvent(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addEvent()}
            />
            
<<<<<<< HEAD
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <Button onClick={closeModal}>Cancel</Button>
              <Button primary onClick={addEvent}>Add Event</Button>
=======
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <Button onClick={closeModal}>Cancel</Button>
              <Button primary onClick={addEvent}>Add</Button>
>>>>>>> 2e0f76ccae73d42eb5f182615256275260503bfd
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
    </DashboardContainer>
  );
};

<<<<<<< HEAD
export default Dashboard;
=======
export default Dashboard;
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
