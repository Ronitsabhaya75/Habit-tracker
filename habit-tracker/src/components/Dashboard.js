// NEW DASHBOARD - No white line
import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { useHabit } from '../context/HabitContext';
import { useEventContext } from '../context/EventContext';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import AIChat from '../components/AIChat';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
// import { db } from './firebase';

// Add Global Style Reset to remove default margins and padding
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html, body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    width: 100%;
    height: 100%;
  }

  #root {
    width: 100%;
    height: 100%;
  }
`;

// Updated colors to match homepage
const updatedTheme = {
  colors: {
    // Primary colors
    background: '#0F1B30',
    deepSpaceTeal: '#0B3D4E',
    emeraldGlow: '#67E5C2',
    darkNavy: '#0F1B30',
    
    // Accent colors
    softGold: '#F4D35E',
    softWhite: '#E5E5E5',
    lightGrey: '#AEB6BF',
    
    // Legacy color mapping for compatibility
    text: '#E5E5E5', 
    accent: '#67E5C2',
    secondary: '#F4D35E',
    borderWhite: 'rgba(229, 229, 229, 0.1)',
    glassWhite: 'rgba(15, 27, 48, 0.85)'
  },
  shadows: {
    card: '0px 4px 12px rgba(0, 0, 0, 0.3)'
  },
  fonts: {
    heading: "'Poppins', 'Exo 2', sans-serif",
    body: "'Roboto', 'Nunito', sans-serif"
  }
};

const POINTS_CONFIG = {
  TASK_COMPLETION: 10,
  DAILY_STREAK: 5,
  GAME_COMPLETION: 20,
  HABIT_COMPLETION: 15,
  LEVEL_UP_BONUS: 50,
};

// Mock data function for development
const fakeFetchUserData = async () => {
  const days = 7;
  return Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000).toISOString(),
    progress: 0 // Start with zero progress
  }));
};

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

// Animation keyframes
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
  0% { transform: scale(1); opacity: 0.6; box-shadow: 0 0 10px rgba(103, 229, 194, 0.5); }
  50% { transform: scale(1.05); opacity: 0.8; box-shadow: 0 0 20px rgba(103, 229, 194, 0.8); }
  100% { transform: scale(1); opacity: 0.6; box-shadow: 0 0 10px rgba(103, 229, 194, 0.5); }
`;

const slideInFromTop = keyframes`
  0% { transform: translateY(-20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const countUp = keyframes`
  from { opacity: 0.6; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

// Styled components (updated for premium feel)
const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, ${updatedTheme.colors.deepSpaceTeal} 0%, ${updatedTheme.colors.darkNavy} 70%);
  overflow: hidden;
  z-index: -1;
`;

const GradientOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 50%, rgba(103, 229, 194, 0.08) 0%, transparent 70%),
              radial-gradient(circle at 70% 70%, rgba(244, 211, 94, 0.05) 0%, transparent 60%);
  z-index: 1;
`;

const Scenery = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30%;
  background: linear-gradient(180deg, transparent 0%, rgba(11, 61, 78, 0.2) 100%);
  z-index: 1;
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 5%;
    width: 30%;
    height: 80%;
    background: linear-gradient(135deg, #0B3D4E 20%, #0F1B30 100%);
    clip-path: polygon(0% 100%, 50% 30%, 100% 100%);
  }
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 15%;
    width: 40%;
    height: 90%;
    background: linear-gradient(135deg, #0F1B30 20%, #071020 100%);
    clip-path: polygon(0% 100%, 40% 20%, 80% 60%, 100% 100%);
  }
`;

const Star = styled.div`
  position: absolute;
  width: ${props => props.size || '30px'};
  height: ${props => props.size || '30px'};
  background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 70%);
  border-radius: 50%;
  z-index: 2;
  animation: ${starGlow} ${props => props.duration || '3s'} infinite ease-in-out;
  animation-delay: ${props => props.delay || '0s'};
  opacity: 0.7;
  &::before {
    content: '★';
    position: absolute;
    font-size: ${props => parseInt(props.size) * 0.8 || '24px'};
    color: rgba(255, 255, 255, 0.9);
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
  background: radial-gradient(circle, rgba(103, 229, 194, 0.2) 0%, rgba(103, 229, 194, 0) 70%);
  border: 2px solid rgba(103, 229, 194, 0.3);
  box-shadow: 0 0 15px rgba(103, 229, 194, 0.2);
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
  background: linear-gradient(90deg, rgba(103, 229, 194, 0) 0%, rgba(103, 229, 194, 0.7) 100%);
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
  border: 3px solid rgba(103, 229, 194, 0.2);
  border-top: 3px solid rgba(103, 229, 194, 0.8);
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
    border: 2px dashed rgba(103, 229, 194, 0.2);
  }
`;

const XPOrb = styled.div`
  position: absolute;
  width: 15px;
  height: 15px;
  background: radial-gradient(circle, rgba(103, 229, 194, 0.6) 30%, rgba(103, 229, 194, 0) 70%);
  border-radius: 50%;
  animation: ${floatAnimation} ${props => props.duration || '4s'} infinite ease-in-out;
  animation-delay: ${props => props.delay || '0s'};
  opacity: 0.5;
  z-index: 2;
`;

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  position: relative;
  color: ${updatedTheme.colors.softWhite};
  font-family: ${updatedTheme.fonts.body};
`;

const TopNav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 3rem;
  background: rgba(15, 27, 48, 0.9);
  backdrop-filter: blur(10px);
  z-index: 100;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.2);
  width: 100%;
`;

const NavBrand = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${updatedTheme.colors.emeraldGlow};
  font-family: ${updatedTheme.fonts.heading};
  letter-spacing: 0.5px;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2.5rem;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.div`
  padding: 0.5rem 0;
  position: relative;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 500;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${updatedTheme.colors.emeraldGlow};
  }
  
  &.active {
    color: ${updatedTheme.colors.emeraldGlow};
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: ${updatedTheme.colors.emeraldGlow};
      transition: width 0.3s ease;
    }
  }
`;

const MobileMenuButton = styled.div`
  display: none;
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const UserControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const LogoutButton = styled.button`
  background: transparent;
  color: ${updatedTheme.colors.softWhite};
  border: 1px solid ${updatedTheme.colors.emeraldGlow};
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${updatedTheme.colors.emeraldGlow};
    color: ${updatedTheme.colors.darkNavy};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(103, 229, 194, 0.2);
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2.5rem 3rem;
  display: flex;
  flex-direction: column;
  z-index: 10;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  animation: ${slideInFromTop} 0.5s ease-out;
`;

const UserGreeting = styled.div`
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    font-family: ${updatedTheme.fonts.heading};
    
    span {
      color: ${updatedTheme.colors.emeraldGlow};
    }
  }
`;

const LevelBadge = styled.div`
  background: rgba(103, 229, 194, 0.2);
  color: ${updatedTheme.colors.emeraldGlow};
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  box-shadow: 0 2px 10px rgba(103, 229, 194, 0.3);
  animation: ${countUp} 0.5s ease-out;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 70% 30%;
  gap: 2.5rem;
  
  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const Card = styled.div`
  background: rgba(15, 27, 48, 0.85);
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid rgba(103, 229, 194, 0.1);
  backdrop-filter: blur(8px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: ${updatedTheme.shadows.card};
  animation: ${fadeIn} 0.5s ease-out;
  
  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: ${updatedTheme.colors.softWhite};
    font-family: ${updatedTheme.fonts.heading};
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  }
`;

const Button = styled.button`
  background: ${updatedTheme.colors.emeraldGlow};
  color: ${updatedTheme.colors.darkNavy};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(103, 229, 194, 0.3);
    background: rgba(103, 229, 194, 0.9);
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
  margin: 0.75rem 0;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(3px);
  }
`;

const UserRank = styled.span`
  color: ${updatedTheme.colors.emeraldGlow};
  font-weight: 600;
  margin-right: 10px;
`;

const UserScore = styled.span`
  color: ${updatedTheme.colors.softGold};
  font-weight: 500;
`;

const ProgressBarContainer = styled.div`
  position: relative;
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  height: 12px;
  border-radius: 10px;
  overflow: hidden;
  margin: 1.5rem 0;
  
  &::before {
    content: '🚀';
    position: absolute;
    left: ${props => props.progress || '0%'};
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    font-size: 14px;
    filter: drop-shadow(0 0 5px rgba(103, 229, 194, 0.7));
    transition: left 0.5s ease;
  }
  
  &::after {
    content: '🌕';
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 5;
    font-size: 14px;
  }
`;

const ProgressBar = styled.div`
  width: ${props => props.progress || '0%'};
  height: 100%;
  background: linear-gradient(90deg, rgba(103, 229, 194, 0.3) 0%, rgba(103, 229, 194, 0.8) 100%);
  border-radius: 10px;
  transition: width 0.5s ease;
`;

const ProgressText = styled.p`
  font-size: 0.9rem;
  color: ${updatedTheme.colors.lightGrey};
  text-align: center;
  margin-top: 0.5rem;
`;

const AddHabitInput = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  margin-top: 1rem;
  border: 1px solid rgba(103, 229, 194, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: ${updatedTheme.colors.softWhite};
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${updatedTheme.colors.emeraldGlow};
    box-shadow: 0 0 0 3px rgba(103, 229, 194, 0.2);
  }
`;

const AddHabitButton = styled.button`
  background: ${updatedTheme.colors.emeraldGlow};
  color: ${updatedTheme.colors.darkNavy};
  border: none;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
  width: 100%;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(103, 229, 194, 0.9);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(103, 229, 194, 0.2);
  }
`;

const EditInput = styled.input`
  padding: 0.5rem;
  margin-right: 8px;
  border: 1px solid rgba(103, 229, 194, 0.3);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  color: ${updatedTheme.colors.softWhite};
  
  &:focus {
    outline: none;
    border-color: ${updatedTheme.colors.emeraldGlow};
  }
`;

const DeleteButton = styled.button`
  background: rgba(255, 59, 59, 0.15);
  color: rgba(255, 59, 59, 0.8);
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  margin-left: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 59, 59, 0.3);
  }
`;

const ChartControls = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const ChartTypeButton = styled.button`
  background: ${props => props.active ? updatedTheme.colors.emeraldGlow : 'rgba(103, 229, 194, 0.1)'};
  color: ${props => props.active ? updatedTheme.colors.darkNavy : updatedTheme.colors.softWhite};
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  
  &:hover {
    background: ${props => props.active ? updatedTheme.colors.emeraldGlow : 'rgba(103, 229, 194, 0.2)'};
    transform: translateY(-2px);
  }
`;

const ChartContainer = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  padding: 1.5rem;
  margin-top: 1rem;
  height: 200px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
`;

const AchievementList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 1rem;
`;

const AchievementItem = styled.li`
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  margin-bottom: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
  border-left: 3px solid ${props => props.earned ? updatedTheme.colors.emeraldGlow : 'transparent'};
  
  &:hover {
    transform: translateX(3px);
    background: rgba(255, 255, 255, 0.08);
  }
`;

const AchievementTitle = styled.span`
  color: ${props => props.earned ? updatedTheme.colors.emeraldGlow : updatedTheme.colors.softWhite};
  font-weight: 600;
`;

const AchievementDetails = styled.span`
  color: ${updatedTheme.colors.lightGrey};
  font-size: 0.9rem;
`;

const TaskList = styled.ul`
  list-style: none;
  padding: 0;
`;

const Task = styled.li`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;

  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    transform: translateX(3px);
  }
`;

const TaskCheckbox = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid ${props => props.completed ? updatedTheme.colors.emeraldGlow : 'rgba(255, 255, 255, 0.3)'};
  background: ${props => props.completed ? updatedTheme.colors.emeraldGlow : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &::after {
    content: ${props => props.completed ? '"✓"' : '""'};
    color: ${updatedTheme.colors.darkNavy};
    font-size: 0.8rem;
    font-weight: bold;
  }

  &:hover {
    border-color: ${updatedTheme.colors.emeraldGlow};
    transform: scale(1.1);
    box-shadow: 0 0 8px rgba(103, 229, 194, 0.4);
  }
`;

const TaskText = styled.span`
  flex: 1;
  color: ${props => props.completed ? updatedTheme.colors.lightGrey : updatedTheme.colors.softWhite};
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  transition: color 0.2s ease;
`;

const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100;
`;

const NotificationCard = styled.div`
  background: rgba(15, 27, 48, 0.9);
  border-left: 4px solid ${updatedTheme.colors.emeraldGlow};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  animation: ${slideInFromTop} 0.3s ease-out;
  max-width: 350px;
`;

const NotificationMessage = styled.span`
  flex-grow: 1;
  margin-right: 1rem;
  color: ${updatedTheme.colors.softWhite};
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
  background: rgba(15, 27, 48, 0.95);
  border: 1px solid ${updatedTheme.colors.emeraldGlow};
  border-radius: 16px;
  padding: 2rem;
  z-index: 200;
  width: 400px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  
  h3 {
    color: ${updatedTheme.colors.emeraldGlow};
    margin-bottom: 1.5rem;
    font-family: ${updatedTheme.fonts.heading};
  }
`;

const TimeInput = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin: 1rem 0;
  border: 1px solid rgba(103, 229, 194, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: ${updatedTheme.colors.softWhite};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${updatedTheme.colors.emeraldGlow};
    box-shadow: 0 0 0 3px rgba(103, 229, 194, 0.2);
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { progress, getStreak, getCategoryProgress, setStreak, updateProgress } = useHabit();
  const { events, addEvent, updateEvent, deleteEvent, toggleEventCompletion } = useEventContext();

  const [chartData, setChartData] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [chartType, setChartType] = useState('line');
  const [streak, setLocalStreak] = useState(0);
  const inputRef = useRef(null);
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const [coachSuggestions, setCoachSuggestions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [timeAllocation, setTimeAllocation] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.xp - a.xp);

  const addNotification = useCallback((message, actions = []) => {
    const newNotification = {
      id: Date.now(),
      message,
      actions,
    };
    setNotifications((prev) => [...prev, newNotification]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== newNotification.id));
    }, 5000);
  }, []);

  const handleTaskCompletion = async (taskId, completed) => {
    const todayKey = new Date().toISOString().split('T')[0];
    await toggleEventCompletion(todayKey, taskId, completed);

    if (completed) {
      await updateProgress('tasks', 10);
      addNotification(`Great job! You completed the task "${events[todayKey].find((t) => t.id === taskId)?.title}".`, [
        { label: 'Track Progress', onClick: () => navigate('/review') },
      ]);
    }
  };

  const openTimeAllocationModal = (task) => {
    setSelectedTask(task);
  };

  const saveTimeAllocation = () => {
    if (!selectedTask || !timeAllocation) return;

    const todayKey = new Date().toISOString().split('T')[0];
    const updatedTask = {
      ...selectedTask,
      estimatedTime: parseInt(timeAllocation, 10),
    };

    updateEvent(todayKey, selectedTask.id, updatedTask);
    addNotification(`Time allocated for "${selectedTask.title}": ${timeAllocation} minutes`);
    setSelectedTask(null);
    setTimeAllocation('');
  };

  useEffect(() => {
    const todayKey = new Date().toISOString().split('T')[0];
    const todayTasks = events[todayKey] || [];
    const incompleteTasks = todayTasks.filter((task) => !task.completed);

    if (incompleteTasks.length > 0) {
      addNotification(`You have ${incompleteTasks.length} tasks pending today!`, [
        { label: 'View Tasks', onClick: () => {
          const tasksCard = document.getElementById('tasks-card');
          tasksCard?.scrollIntoView({ behavior: 'smooth' });
        }}
      ]);
    }
  }, [events, addNotification]);

  const calculateTotalXP = useCallback(() => {
    const progressXP = Object.values(progress).reduce((sum, p) => sum + p, 0);
    const todayKey = new Date().toISOString().split('T')[0];
    const todayTasks = events[todayKey] || [];
    const tasksXP = todayTasks.filter((task) => task.completed).length * 10;
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

  const generateCoachSuggestions = useCallback(() => {
    const suggestions = [];
    const todayKey = new Date().toISOString().split('T')[0];
    const todayTasks = events[todayKey] || [];
    const completedTasks = todayTasks.filter((task) => task.completed).length;
    const totalTasks = todayTasks.length;

    if (streak >= 7) {
      suggestions.push({ text: 'Amazing job maintaining a 7+ day streak! Try adding a new challenging habit to level up.', icon: '🌟' });
    } else if (streak < 3 && streak > 0) {
      suggestions.push({ text: "You're building a streak! Keep it up for 3 more days to solidify this habit.", icon: '🔥' });
    } else if (streak === 0) {
      suggestions.push({ text: 'Start small today with one easy task to kick off your streak!', icon: '🚀' });
    }

    if (totalTasks > 0 && completedTasks / totalTasks < 0.5) {
      suggestions.push({ text: 'Try breaking your tasks into smaller steps to boost completion rates.', icon: '📝' });
    } else if (completedTasks === totalTasks && totalTasks > 0) {
      suggestions.push({ text: 'Perfect day! Consider adding a bonus task to stretch your potential.', icon: '🏆' });
    }

    if (totalXP >= 100 && totalXP < 200) {
      suggestions.push({ text: "You're making great progress! Focus on consistency to hit 200 XP soon.", icon: '📈' });
    } else if (totalXP < 50) {
      suggestions.push({ text: 'Every step counts! Complete a task now to earn 10 XP and get rolling.', icon: '✨' });
    }

    suggestions.push({ text: 'Review your habits weekly to adjust goals and stay motivated!', icon: '🗓️' });
    setCoachSuggestions(suggestions);
  }, [streak, events, totalXP]);

  useEffect(() => {
    generateCoachSuggestions();
  }, [generateCoachSuggestions]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fetchUserProgress = useCallback(async () => {
    try {
      setLoading(true);
      const userProgress = await fakeFetchUserData();
      setChartData(
        userProgress.map((item) => ({
          day: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
          progress: getCategoryProgress(item.date) || item.progress,
        }))
      );
    } catch (error) {
      console.error('Error fetching user progress:', error);
    } finally {
      setLoading(false);
    }
  }, [getCategoryProgress]);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      const leaderboardQuery = query(
        collection('users'), 
        orderBy('totalXP', 'desc'), 
        limit(10)
      );
  
      const querySnapshot = await getDocs(leaderboardQuery);
      
      const leaderboardData = querySnapshot.docs
        .filter(doc => doc.data().totalXP > 0)  // Only show users with XP
        .map((doc, index) => ({
          rank: index + 1,
          name: doc.data().displayName || doc.data().email,
          xp: doc.data().totalXP || 0,
          userId: doc.id
        }));
  
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
    fetchUserProgress();
  }, [fetchLeaderboard, fetchUserProgress]);

  const addHabit = () => setShowInput(true);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && newHabit.trim()) {
      const todayKey = new Date().toISOString().split('T')[0];
      addEvent(todayKey, {
        id: Date.now(),
        title: newHabit.trim(),
        completed: false,
      });
      setNewHabit('');
      setShowInput(false);
    }
  };

  const toggleEdit = (taskId) => {
    const todayKey = new Date().toISOString().split('T')[0];
    const task = events[todayKey]?.find((t) => t.id === taskId);
    if (task) {
      updateEvent(todayKey, taskId, { isEditing: !task.isEditing });
    }
  };

  const deleteTask = (taskId) => {
    const todayKey = new Date().toISOString().split('T')[0];
    deleteEvent(todayKey, taskId);
  };

  const getLineColor = (progress) => {
    if (progress < 40) return '#ff6b6b';
    if (progress < 70) return '#feca57';
    return updatedTheme.colors.emeraldGlow;
  };

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="day" stroke={updatedTheme.colors.lightGrey} />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 27, 48, 0.9)',
                  border: `1px solid ${updatedTheme.colors.emeraldGlow}`,
                  color: updatedTheme.colors.softWhite
                }}
              />
              <Bar dataKey="progress" fill={updatedTheme.colors.emeraldGlow} />
            </BarChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <XAxis dataKey="day" stroke={updatedTheme.colors.lightGrey} />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 27, 48, 0.9)',
                  border: `1px solid ${updatedTheme.colors.emeraldGlow}`,
                  color: updatedTheme.colors.softWhite
                }}
              />
              <Line
                type="monotone"
                dataKey="progress"
                stroke={chartData.length ? getLineColor(chartData[chartData.length - 1]?.progress) : updatedTheme.colors.emeraldGlow}
                strokeWidth={2}
                dot={{ fill: updatedTheme.colors.emeraldGlow, strokeWidth: 1 }}
                activeDot={{ r: 6, fill: updatedTheme.colors.emeraldGlow, stroke: updatedTheme.colors.darkNavy }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  const todayKey = new Date().toISOString().split('T')[0];
  const todayTasks = events[todayKey] || [];

  return (
    <>
      <GlobalStyle />
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

        <TopNav>
          <NavBrand>HabitQuest</NavBrand>
          
          <NavLinks>
            <NavLink className="active">Dashboard</NavLink>
            <NavLink onClick={() => navigate('/spinWheel')}>SpinWheel</NavLink>
            <NavLink onClick={() => navigate('/habitProgressTracker')}>Habit Progress</NavLink>
            <NavLink onClick={() => navigate('/breakthrough-game')}>Games</NavLink>
            <NavLink onClick={() => navigate('/track')}>Events</NavLink>
            <NavLink onClick={() => navigate('/review')}>Review</NavLink>
          </NavLinks>
          
          <UserControls>
            <LevelBadge>Level {currentLevel}</LevelBadge>
            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
          </UserControls>
          
          <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            ☰
          </MobileMenuButton>
        </TopNav>

        <MainContent>
          <Header>
            <UserGreeting>
              <h1>Welcome <span>Captain</span> 👋</h1>
            </UserGreeting>
          </Header>

          <ContentGrid>
            <LeftColumn>
              <Card>
                <h2>Progress Overview</h2>
                <ChartControls>
                  <ChartTypeButton active={chartType === 'line'} onClick={() => setChartType('line')}>Line</ChartTypeButton>
                  <ChartTypeButton active={chartType === 'bar'} onClick={() => setChartType('bar')}>Bar</ChartTypeButton>
                </ChartControls>
                {loading ? <p>Loading chart data...</p> : <ChartContainer>{renderChart()}</ChartContainer>}
                
                <h3 style={{ marginTop: '2rem', marginBottom: '0.5rem', fontFamily: updatedTheme.fonts.heading }}>
                  Current Streak: {streak} of 14 days
                </h3>
                
                <ProgressBarContainer progress={`${streakPercentage}%`}>
                  <ProgressBar progress={`${streakPercentage}%`} />
                </ProgressBarContainer>
                
                <ProgressText>
                  {streak >= 14 ? 'Streak Maxed! 🎉' : `${14 - streak} more days to max streak`}
                </ProgressText>
              </Card>
            </LeftColumn>

            <RightColumn>
              <Card>
                <h2>Leaderboard</h2>
                {loading ? (
                  <p>Loading leaderboard...</p>
                ) : (
                  <LeaderboardList>
                    {sortedLeaderboard.slice(0, 5).map((player) => (
                      <LeaderboardItem key={player.userId}>
                        <div>
                          <UserRank>#{player.rank}</UserRank> {player.name}
                        </div>
                        <UserScore>{player.xp} XP</UserScore>
                      </LeaderboardItem>
                    ))}
                  </LeaderboardList>
                )}
              </Card>

              <Card>
                <h2>Achievements</h2>
                <AchievementList>
                  {achievements
                    .filter(achievement => showAllAchievements || achievement.earned)
                    .map(achievement => (
                      <AchievementItem key={achievement.id} earned={achievement.earned}>
                        <AchievementTitle earned={achievement.earned}>
                          {achievement.earned ? '✅ ' : '🔒 '}{achievement.title}
                        </AchievementTitle>
                        <AchievementDetails>{achievement.description}</AchievementDetails>
                      </AchievementItem>
                    ))}
                </AchievementList>
                <Button 
                  style={{ marginTop: '1.5rem', width: '100%' }} 
                  onClick={() => setShowAllAchievements(prev => !prev)}
                >
                  {showAllAchievements ? "Show Earned Only" : "View All Achievements"}
                </Button>
              </Card>

              <Card id="tasks-card">
                <h2>Today's Tasks</h2>
                {todayTasks.length === 0 ? (
                  <p style={{ textAlign: 'center', color: updatedTheme.colors.lightGrey, margin: '2rem 0' }}>
                    No tasks for today. Add one to start earning XP!
                  </p>
                ) : (
                  <TaskList>
                    {todayTasks.map((task) => (
                      <Task key={task.id}>
                        <TaskCheckbox
                          completed={task.completed}
                          onClick={() => handleTaskCompletion(task.id, !task.completed)}
                        />
                        {task.isEditing ? (
                          <EditInput
                            type="text"
                            value={task.title}
                            onChange={(e) => updateEvent(todayKey, task.id, { title: e.target.value })}
                            onBlur={() => toggleEdit(task.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") toggleEdit(task.id);
                            }}
                          />
                        ) : (
                          <TaskText
                            completed={task.completed}
                            onDoubleClick={() => toggleEdit(task.id)}
                          >
                            {task.title}
                          </TaskText>
                        )}
                        <DeleteButton onClick={() => deleteTask(task.id)}>✕</DeleteButton>
                      </Task>
                    ))}
                  </TaskList>
                )}
                {showInput ? (
                  <AddHabitInput
                    ref={inputRef}
                    type="text"
                    placeholder="Add a new task..."
                    value={newHabit}
                    onChange={(e) => setNewHabit(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onBlur={() => setShowInput(false)}
                    autoFocus
                  />
                ) : (
                  <AddHabitButton onClick={addHabit}>+ Add Task</AddHabitButton>
                )}
              </Card>
            </RightColumn>
          </ContentGrid>
        </MainContent>

        {selectedTask && (
          <TimeAllocationModal>
            <h3>Allocate Time for "{selectedTask.title}"</h3>
            <TimeInput 
              type="number" 
              placeholder="Estimated time in minutes" 
              value={timeAllocation}
              onChange={(e) => setTimeAllocation(e.target.value)}
              autoFocus
            />
            <ModalActions>
              <Button onClick={saveTimeAllocation}>Save Time</Button>
              <Button onClick={() => setSelectedTask(null)} style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                Cancel
              </Button>
            </ModalActions>
          </TimeAllocationModal>
        )}
        
        <AIChat user={user} />
      </DashboardContainer>
    </>
  );
};

export default Dashboard;
