import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
// Make sure css helper is imported and used consistently
import { theme } from '../theme'; // Make sure this path is correct
import { useNavigate } from 'react-router-dom';
import { useEventContext } from '../context/EventContext'; // Make sure this path is correct
import AIChat from './AIChat';

// UPDATED SPACE THEME COLORS
const spaceTheme = {
  deepSpace: '#0E1A40',
  deepSpaceGradient: 'linear-gradient(135deg, #0E1A40 0%, #13294B 100%)',
  accentGlow: '#32FFC0',
  accentGold: '#FFDF6C',
  textPrimary: '#D0E7FF',
  actionButton: '#00F9FF',
  actionButtonAlt: '#FF5DA0',
  highlight: '#FFFA81',
  highlightAlt: '#FBC638',
  calendarCell: '#1C2A4A',
  glassOverlay: 'rgba(30, 39, 73, 0.8)'
};

// ENHANCED ANIMATIONS
const floatAnimation = keyframes`
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(2deg); }
  100% { transform: translateY(0) rotate(0deg); }
`;

const starGlow = keyframes`
  0% { opacity: 0.6; filter: blur(1px); transform: scale(0.9); }
  50% { opacity: 1; filter: blur(0px); transform: scale(1.1); }
  100% { opacity: 0.6; filter: blur(1px); transform: scale(0.9); }
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
  0% { transform: scale(1); opacity: 0.6; box-shadow: 0 0 10px ${spaceTheme.accentGlow}; }
  50% { transform: scale(1.05); opacity: 0.8; box-shadow: 0 0 20px ${spaceTheme.accentGlow}, 0 0 30px ${spaceTheme.accentGlow}; }
  100% { transform: scale(1); opacity: 0.6; box-shadow: 0 0 10px ${spaceTheme.accentGlow}; }
`;

const expGain = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const meteorShower = keyframes`
  0% { transform: translateX(0) translateY(0); opacity: 0: }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateX(-100vw) translateY(100vh); opacity: 0; }
`;

const glowPulse = keyframes`
  0% { text-shadow: 0 0 5px ${spaceTheme.accentGlow}, 0 0 10px ${spaceTheme.accentGlow}; }
  50% { text-shadow: 0 0 20px ${spaceTheme.accentGlow}, 0 0 30px ${spaceTheme.accentGlow}; }
  100% { text-shadow: 0 0 5px ${spaceTheme.accentGlow}, 0 0 10px ${spaceTheme.accentGlow}; }
`;

const warping = keyframes`
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
`;

// STYLED COMPONENTS WITH ENHANCED THEME
const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: ${spaceTheme.deepSpaceGradient};
  overflow: hidden;
`;

const GradientOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 50%, rgba(50, 255, 192, 0.1) 0%, transparent 70%),
              radial-gradient(circle at 70% 70%, rgba(0, 249, 255, 0.1) 0%, transparent 60%);
  z-index: 1;
`;

const Scenery = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30%;
  background: linear-gradient(180deg, transparent 0%, rgba(20, 30, 60, 0.3) 100%);
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 5%;
    width: 30%;
    height: 80%;
    background: linear-gradient(135deg, #1C2A4A 20%, #0E1A40 100%);
    clip-path: polygon(0% 100%, 50% 30%, 100% 100%);
    box-shadow: 0 0 15px rgba(50, 255, 192, 0.2);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 15%;
    width: 40%;
    height: 90%;
    background: linear-gradient(135deg, #0E1A40 20%, #13294B 100%);
    clip-path: polygon(0% 100%, 40% 20%, 80% 60%, 100% 100%);
    box-shadow: 0 0 15px rgba(0, 249, 255, 0.2);
  }
`;

const Star = styled.div`
  position: absolute;
  width: ${props => props.size || '30px'};
  height: ${props => props.size || '30px'};
  background: radial-gradient(circle, ${props => props.color || 'rgba(255, 223, 108, 0.9)'} 0%, rgba(255, 255, 255, 0) 70%);
  border-radius: 50%;
  z-index: 2;
  animation: ${starGlow} ${props => props.duration || '3s'} infinite ease-in-out;
  animation-delay: ${props => props.delay || '0s'};
  opacity: 0.7;
  
  &::before {
    content: '★';
    position: absolute;
    font-size: ${props => parseInt(props.size) * 0.8 || '24px'};
    color: ${props => props.color || 'rgba(255, 223, 108, 0.9)'};
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const Meteor = styled.div`
  position: absolute;
  top: ${props => props.top || '10%'};
  right: 0;
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 10px ${spaceTheme.accentGold}, 0 0 20px ${spaceTheme.accentGold};
  opacity: 0.8;
  z-index: 2;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 80px;
    height: 2px;
    background: linear-gradient(90deg, transparent, ${spaceTheme.accentGold});
    border-radius: 2px;
    transform: translateX(2px);
  }
  
  animation: ${meteorShower} ${props => props.duration || '2s'} ${props => props.delay || '0s'} linear forwards;
`;

const AchievementBadge = styled.div`
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(50, 255, 192, 0.2) 0%, rgba(50, 255, 192, 0) 70%);
  border: 2px solid rgba(50, 255, 192, 0.3);
  box-shadow: 0 0 15px rgba(50, 255, 192, 0.4);
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
  background: linear-gradient(90deg, rgba(50, 255, 192, 0) 0%, rgba(50, 255, 192, 0.7) 100%);
  border-radius: 4px;
  z-index: 2;
  opacity: 0.5;
  filter: blur(2px);
  transform: translateX(-80px);
  animation: ${trailAnimation} 2s infinite;
`;

const Planet = styled.div`
  position: absolute;
  width: ${props => props.size || '80px'};
  height: ${props => props.size || '80px'};
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, ${props => props.color || '#5073b8'}, #1a2b4d);
  opacity: 0.8;
  box-shadow: 0 0 20px rgba(50, 255, 192, 0.2);
  z-index: 1;
  bottom: ${props => props.bottom || '50px'};
  right: ${props => props.right || '50px'};
  
  &::after {
    content: '';
    position: absolute;
    width: 110%;
    height: 20px;
    background: rgba(50, 255, 192, 0.2);
    border-radius: 50%;
    top: 50%;
    left: -5%;
    transform: translateY(-50%) rotateX(80deg);
  }
`;

const ProgressCircle = styled.div`
  position: absolute;
  bottom: 20%;
  right: 10%;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid rgba(0, 249, 255, 0.2);
  border-top: 3px solid rgba(0, 249, 255, 0.8);
  animation: ${slowRotate} 8s linear infinite;
  z-index: 2;
  box-shadow: 0 0 15px rgba(0, 249, 255, 0.1);
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70px;
    height: 70px;
    border-radius: 50%;
    border: 2px dashed rgba(0, 249, 255, 0.2);
  }
`;

const XPOrb = styled.div`
  position: absolute;
  width: 15px;
  height: 15px;
  background: radial-gradient(circle, rgba(50, 255, 192, 0.8) 30%, rgba(50, 255, 192, 0) 70%);
  border-radius: 50%;
  animation: ${floatAnimation} ${props => props.duration || '4s'} infinite ease-in-out;
  animation-delay: ${props => props.delay || '0s'};
  opacity: 0.7;
  z-index: 2;
  box-shadow: 0 0 10px rgba(50, 255, 192, 0.5);
`;

const Sidebar = styled.div`
  width: 250px;
  padding: 2rem;
  background: rgba(14, 26, 64, 0.8);
  color: ${spaceTheme.textPrimary};
  border-right: 1px solid rgba(50, 255, 192, 0.3);
  backdrop-filter: blur(8px);
  z-index: 1000; // Increased from 10 to 1000 to ensure it's on top
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  box-shadow: 5px 0 15px rgba(0, 0, 0, 0.3);
  
  h2 {
    font-family: 'Orbitron', sans-serif;
    margin-bottom: 2rem;
    color: ${spaceTheme.accentGlow};
    text-shadow: 0 0 10px ${spaceTheme.accentGlow};
    font-size: 1.8rem;
    letter-spacing: 2px;
  }
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 2rem;
`;

const NavItem = styled.li`
  padding: 1rem;
  margin: 0.7rem 0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  color: ${spaceTheme.textPrimary};
  align-items: center;
  gap: 1rem;
  position: relative;
  overflow: hidden;
  border: 1px solid transparent;
  
  &:hover {
    background: rgba(50, 255, 192, 0.1);
    border: 1px solid rgba(50, 255, 192, 0.3);
    transform: translateX(5px);
  }
  
  &.active {
    background: rgba(50, 255, 192, 0.2);
    border: 1px solid rgba(50, 255, 192, 0.5);
    box-shadow: 0 0 15px rgba(50, 255, 192, 0.2);
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 4px;
      background: ${spaceTheme.accentGlow};
      box-shadow: 0 0 10px ${spaceTheme.accentGlow};
    }
  }
`;

const TrackContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  position: relative;
  z-index: 10;
  margin-left: 250px;
  padding: 2rem 0;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: ${spaceTheme.accentGlow};
  margin-bottom: 1rem;
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 2px;
  text-shadow: 0 0 10px ${spaceTheme.accentGlow}, 0 0 20px ${spaceTheme.accentGlow};
  animation: ${glowPulse} 3s infinite ease-in-out;
`;

const ExpContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
  width: 350px;
  border-radius: 20px;
  padding: 1rem;
  background: rgba(14, 26, 64, 0.6);
  border: 1px solid rgba(50, 255, 192, 0.3);
  box-shadow: 0 0 15px rgba(50, 255, 192, 0.1);
`;

const ExpLabel = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 0.5rem;
  color: ${spaceTheme.textPrimary};
  font-size: 1.1rem;
  
  span {
    color: ${spaceTheme.accentGold};
    font-weight: bold;
  }
  
  .exp-amount {
    animation: ${props => props.animate ? css`${expGain} 1s ease-in-out` : 'none'};
  }
`;

const ExpBarContainer = styled.div`
  width: 100%;
  height: 14px;
  background: rgba(10, 20, 50, 0.5);
  border-radius: 7px;
  overflow: hidden;
  border: 1px solid rgba(50, 255, 192, 0.3);
`;

const ExpBarFill = styled.div`
  height: 100%;
  width: ${props => props.percentage}%;
  background: linear-gradient(90deg, ${spaceTheme.accentGlow} 0%, ${spaceTheme.actionButton} 100%);
  border-radius: 7px;
  transition: width 1s ease-in-out;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.4) 50%,
      transparent 100%
    );
    transform: translateX(-100%);
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
`;

const CalendarContainer = styled.div`
  background: rgba(14, 26, 64, 0.8);
  padding: 2.5rem;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(50, 255, 192, 0.3);
  width: 90%;
  max-width: 800px;
  color: ${spaceTheme.textPrimary};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 
              0 0 0 1px rgba(50, 255, 192, 0.2), 
              inset 0 1px 1px rgba(50, 255, 192, 0.05);
  animation: ${css`${warping} 0.5s ease-out`};
  
  .selected-date-container {
    animation: ${css`${warping} 0.3s ease-out`};
  }
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h3 {
    font-family: 'Orbitron', sans-serif;
    font-size: 1.4rem;
    color: ${spaceTheme.accentGlow};
    text-shadow: 0 0 5px ${spaceTheme.accentGlow};
  }
`;

const MonthNavButton = styled.button`
  background: rgba(50, 255, 192, 0.2);
  color: ${spaceTheme.textPrimary};
  border: 1px solid rgba(50, 255, 192, 0.3);
  border-radius: 8px;
  padding: 0.6rem 1rem;
  cursor: pointer;
  transition: all 0.3s;
  font-family: 'Orbitron', sans-serif;
  
  &:hover {
    background: rgba(50, 255, 192, 0.4);
    box-shadow: 0 0 15px rgba(50, 255, 192, 0.4);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
`;

const DayLabel = styled.div`
  text-align: center;
  padding: 0.5rem 0;
  font-weight: bold;
  color: ${spaceTheme.accentGlow};
  font-family: 'Orbitron', sans-serif;
  font-size: 0.8rem;
  letter-spacing: 1px;
`;

const CalendarDay = styled.div`
  height: 45px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  background: ${props => 
    props.isToday 
      ? 'rgba(0, 249, 255, 0.2)' 
      : props.isSelected 
        ? `rgba(50, 255, 192, 0.3)`
        : props.hasEvent 
          ? 'rgba(255, 250, 129, 0.15)' 
          : 'rgba(28, 42, 74, 0.4)'
  };
  
  border: 1px solid ${props => 
    props.isToday 
      ? 'rgba(0, 249, 255, 0.6)' 
      : props.isSelected 
        ? `rgba(50, 255, 192, 0.6)`
        : props.hasEvent 
          ? 'rgba(255, 250, 129, 0.3)' 
          : 'rgba(50, 255, 192, 0.2)'
  };
  
  box-shadow: ${props => 
    props.isToday || props.isSelected
      ? `0 0 10px ${props.isToday ? 'rgba(0, 249, 255, 0.3)' : 'rgba(50, 255, 192, 0.3)'}`
      : 'none'
  };
  
  color: ${props => props.isCurrentMonth ? spaceTheme.textPrimary : 'rgba(208, 231, 255, 0.4)'};
  font-weight: ${props => props.isToday || props.isSelected ? 'bold' : 'normal'};
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.isSelected ? 'rgba(50, 255, 192, 0.4)' : 'rgba(0, 249, 255, 0.2)'};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  &::after {
    content: ${props => props.hasEvent ? '"•"' : '""'};
    position: absolute;
    bottom: 4px;
    color: ${spaceTheme.accentGold};
    font-size: 14px;
    text-shadow: 0 0 4px ${spaceTheme.accentGold};
  }
  
  ${props => props.hasStreak && `
    &::before {
      content: '🔥';
      position: absolute;
      top: 2px;
      right: 2px;
      font-size: 10px;
    }
  `}
`;

const EventModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(10, 17, 40, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  backdrop-filter: blur(4px);
`;

const EventModalContent = styled.div`
  background: rgba(14, 26, 64, 0.9);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid rgba(50, 255, 192, 0.3);
  backdrop-filter: blur(8px);
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(50, 255, 192, 0.2);
  animation: ${css`${warping} 0.3s ease-out`};
  
  h3 {
    color: ${spaceTheme.accentGlow};
    margin-bottom: 1.5rem;
    font-family: 'Orbitron', sans-serif;
    text-shadow: 0 0 10px ${spaceTheme.accentGlow};
  }
`;

const EventInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin: 0.5rem 0;
  background: rgba(28, 42, 74, 0.6);
  border: 1px solid rgba(50, 255, 192, 0.3);
  border-radius: 8px;
  color: ${spaceTheme.textPrimary};
  transition: all 0.3s;
  
  &:focus {
    outline: none;
    border-color: ${spaceTheme.accentGlow};
    box-shadow: 0 0 10px rgba(50, 255, 192, 0.3);
  }
  
  &::placeholder {
    color: rgba(208, 231, 255, 0.6);
  }
`;

const EventTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  margin: 0.5rem 0;
  background: rgba(28, 42, 74, 0.6);
  border: 1px solid rgba(50, 255, 192, 0.3);
  border-radius: 8px;
  color: ${spaceTheme.textPrimary};
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s;
  
  &:focus {
    outline: none;
    border-color: ${spaceTheme.accentGlow};
    box-shadow: 0 0 10px rgba(50, 255, 192, 0.3);
  }
  
  &::placeholder {
    color: rgba(208, 231, 255, 0.6);
  }
`;

const EventList = styled.div`
  margin-top: 1rem;
  max-height: 200px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(28, 42, 74, 0.6);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(50, 255, 192, 0.3);
    border-radius: 4px;
  }
`;

const EventItem = styled.div`
  padding: 1rem;
  background: rgba(28, 42, 74, 0.6);
  border-radius: 12px;
  margin-bottom: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid rgba(50, 255, 192, 0.1);
  transition: all 0.2s;
  
  &:hover {
    background: rgba(28, 42, 74, 0.8);
    border-color: rgba(50, 255, 192, 0.3);
    transform: translateX(3px);
  }
`;

const TaskCheckbox = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid ${props => props.completed ? spaceTheme.accentGlow : 'rgba(208, 231, 255, 0.3)'};
  background: ${props => props.completed ? spaceTheme.accentGlow : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: ${props => props.completed ? `0 0 8px ${spaceTheme.accentGlow}` : 'none'};
  
  &::after {
    content: ${props => props.completed ? '"✓"' : '""'};
    color: #0E1A40;
    font-size: 0.8rem;
    font-weight: bold;
  }
  
  &:hover {
    border-color: ${spaceTheme.accentGlow};
    transform: scale(1.1);
    box-shadow: 0 0 8px rgba(50, 255, 192, 0.5);
  }
`;

const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const CancelButton = styled.button`
  background: rgba(28, 42, 74, 0.6);
  color: ${spaceTheme.textPrimary};
  border: 1px solid rgba(208, 231, 255, 0.3);
  border-radius: 8px;
  padding: 0.7rem 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Orbitron', sans-serif;
  
  &:hover {
    background: rgba(28, 42, 74, 0.8);
    border-color: rgba(208, 231, 255, 0.5);
  }
`;

const SaveButton = styled.button`
  background: ${spaceTheme.accentGlow};
  color: #0E1A40;
  border: none;
  border-radius: 8px;
  padding: 0.7rem 1.4rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: bold;
  font-family: 'Orbitron', sans-serif;
  box-shadow: 0 0 10px rgba(50, 255, 192, 0.4);
  
  &:hover {
    background: ${spaceTheme.actionButton};
    transform: translateY(-2px);
    box-shadow: 0 0 15px rgba(0, 249, 255, 0.5);
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const AddEventButton = styled.button`
  background: ${spaceTheme.actionButton};
  color: #0E1A40;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: all 0.3s;
  font-family: 'Orbitron', sans-serif;
  box-shadow: 0 0 10px rgba(0, 249, 255, 0.3);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${spaceTheme.accentGlow};
    transform: translateY(-2px);
    box-shadow: 0 0 15px rgba(50, 255, 192, 0.5);
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  &::before {
    content: '+';
    font-size: 1.2rem;
    font-weight: bold;
  }
`;

const DeleteButton = styled.button`
  background: rgba(255, 77, 77, 0.3);
  color: white;
  border: 1px solid rgba(255, 77, 77, 0.5);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 77, 77, 0.6);
    box-shadow: 0 0 10px rgba(255, 77, 77, 0.3);
  }
`;

const StreakBadge = styled.div`
  position: relative;
  padding: 0.3rem 0.8rem;
  background: rgba(255, 223, 108, 0.2);
  border-radius: 20px;
  color: ${spaceTheme.accentGold};
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 223, 108, 0.3);
  box-shadow: 0 0 10px rgba(255, 223, 108, 0.1);
  
  &::before {
    content: '🔥';
    margin-right: 0.4rem;
  }
`;

const CoachTip = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(0, 249, 255, 0.2);
  border: 2px solid rgba(0, 249, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 100;
  box-shadow: 0 0 15px rgba(0, 249, 255, 0.3);
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 20px rgba(0, 249, 255, 0.5);
  }
  
  &::before {
    content: '👨‍🚀';
    font-size: 24px;
  }
`;

const TipPopup = styled.div`
  position: fixed;
  bottom: 100px;
  right: 30px;
  width: 280px;
  padding: 1.2rem;
  background: rgba(14, 26, 64, 0.9);
  border-radius: 12px;
  border: 1px solid rgba(0, 249, 255, 0.3);
  color: ${spaceTheme.textPrimary};
  z-index: 100;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  animation: ${css`${warping} 0.3s ease-out`};
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    right: 30px;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid rgba(0, 249, 255, 0.3);
  }
`;

// ENHANCED TRACK COMPONENT
const Track = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '' });
  const [editEvent, setEditEvent] = useState(null);
  const [showTip, setShowTip] = useState(false);
  const [expAnimating, setExpAnimating] = useState(false);
  const [streakCount, setStreakCount] = useState(4); // Mock streak count
  const { events, userExp, addEvent, updateEvent, deleteEvent, toggleEventCompletion } = useEventContext();
  const navigate = useNavigate();

  // Define a default user object
  const user = { name: 'User', habits: [] };

  useEffect(() => {
    // Simulate meteor shower periodically
    const meteorInterval = setInterval(() => {
      createMeteor();
    }, 5000);
    
    return () => clearInterval(meteorInterval);
  }, []);
  
  // Meteor is now handled directly with styled components
  const [meteors, setMeteors] = useState([]);
  
  // Create meteor element for animation
  const createMeteor = () => {
    const topPosition = Math.floor(Math.random() * 50) + 5; // Random top position
    const duration = Math.floor(Math.random() * 3) + 1; // Random duration
    const meteorId = Date.now();
    
    setMeteors(prev => [...prev, { id: meteorId, top: topPosition, duration }]);
    
    // Remove meteor after animation
    setTimeout(() => {
      setMeteors(prev => prev.filter(meteor => meteor.id !== meteorId));
    }, duration * 1000);
  };

  // Calculate EXP percentage for the progress bar
  const calculateExpPercentage = () => {
    // Mock calculation - in a real app, this would be based on level thresholds
    const currentLevel = Math.floor(userExp / 100);
    const currentLevelExp = userExp % 100;
    return currentLevelExp;
  };

  const handleTaskCompletion = (eventId, isCompleted) => {
    if (!selectedDate) return;
    const dateKey = formatDate(selectedDate);
    toggleEventCompletion(dateKey, eventId, isCompleted);
    
    // Animate EXP gain when task completed
    if (isCompleted) {
      setExpAnimating(true);
      setTimeout(() => setExpAnimating(false), 1000);
    }
  };

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

  const handleOpenEventModal = (event = null) => {
    if (event) {
      setEditEvent(event);
      setNewEvent({ title: event.title, description: event.description });
    } else {
      setEditEvent(null);
      setNewEvent({ title: '', description: '' });
    }
    setShowEventModal(true);
  };

  const handleCloseEventModal = () => {
    setShowEventModal(false);
    setEditEvent(null);
    setNewEvent({ title: '', description: '' });
  };

  const handleAddEvent = () => {
    if (selectedDate && newEvent.title.trim()) {
      const dateKey = formatDate(selectedDate);
      if (editEvent) {
        updateEvent(dateKey, editEvent.id, newEvent);
      } else {
        addEvent(dateKey, {
          id: Date.now(),
          title: newEvent.title,
          description: newEvent.description,
          completed: false,
        });
      }
      handleCloseEventModal();
    }
  };

  const handleDeleteEvent = (eventId) => {
    if (!selectedDate) return;
    const dateKey = formatDate(selectedDate);
    deleteEvent(dateKey, eventId);
  };

  // Mock streak data - in a real app this would be calculated from completion history
  const hasStreak = (date) => {
    // This is just mock implementation
    const day = date.getDate();
    return day % 5 === 0 || day % 7 === 0; // Just for demonstration
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    const dayLabels = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    dayLabels.forEach(day => {
      days.push(<DayLabel key={`label-${day}`}>{day}</DayLabel>);
    });
    
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
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = formatDate(date);
      const hasEvents = events[dateKey] && events[dateKey].length > 0;
      const hasStreakBadge = hasStreak(date);
      
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
          hasStreak={hasStreakBadge}
          onClick={() => handleDateClick(year, month, day)}
        >
          {day}
        </CalendarDay>
      );
    }
    
    const totalCells = 42;
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
      return <p>No quests scheduled for this date. Add one to earn EXP!</p>;
    }
    
    return (
      <EventList>
        {dateEvents.map(event => (
          <EventItem key={event.id} onClick={() => handleOpenEventModal(event)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <TaskCheckbox
                completed={event.completed || false}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTaskCompletion(event.id, !event.completed);
                }}
              />
              <div>
                <strong style={{ color: event.completed ? spaceTheme.accentGlow : spaceTheme.textPrimary }}>
                  {event.title}
                </strong>
                {event.description && <p style={{ opacity: 0.8, fontSize: '0.9rem', marginTop: '0.3rem' }}>{event.description}</p>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <DeleteButton 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  handleDeleteEvent(event.id); 
                }}
              >
                Delete
              </DeleteButton>
            </div>
          </EventItem>
        ))}
      </EventList>
    );
  };

  const handleTaskUpdate = (action, task, date = null) => {
    if (date) {
      const dateKey = formatDate(date);
      switch (action) {
        case 'add':
          addEvent(dateKey, task);
          break;
        case 'edit':
          updateEvent(dateKey, task.id, task);
          break;
        case 'remove':
          deleteEvent(dateKey, task.id);
          break;
        default:
          toggleEventCompletion(dateKey, task.id, task.completed);
      }
    }
  };

  const handleAddTaskWithDate = (date, task) => {
    const dateKey = formatDate(date);
    addEvent(dateKey, task);
  };

  const toggleTip = () => {
    setShowTip(!showTip);
  };

  return (
    <>
      <Background>
        <GradientOverlay />
        <Scenery />
        <Star size="20px" style={{ top: '10%', left: '10%' }} duration="4s" delay="0.5s" color="rgba(255, 223, 108, 0.9)" />
        <Star size="15px" style={{ top: '25%', left: '25%' }} duration="3s" delay="1s" color="rgba(50, 255, 192, 0.9)" />
        <Star size="25px" style={{ top: '15%', right: '30%' }} duration="5s" delay="0.2s" color="rgba(0, 249, 255, 0.9)" />
        <Star size="12px" style={{ top: '45%', left: '40%' }} duration="3.5s" delay="0.7s" color="rgba(255, 255, 255, 0.9)" />
        <Star size="18px" style={{ top: '60%', right: '15%' }} duration="4.5s" delay="1.5s" color="rgba(50, 255, 192, 0.9)" />
        {meteors.map(meteor => (
          <Meteor 
            key={meteor.id} 
            top={`${meteor.top}%`} 
            duration={`${meteor.duration}s`} 
          />
        ))}
        <Rocket><RocketTrail /></Rocket>
        <AchievementBadge />
        <ProgressCircle />
        <Planet size="120px" bottom="50px" right="100px" color="#3a5c9e" />
        <XPOrb style={{ top: '65%', left: '15%' }} duration="6s" delay="0.2s" />
        <XPOrb style={{ top: '30%', right: '25%' }} duration="5s" delay="1.2s" />
        <XPOrb style={{ top: '75%', right: '30%' }} duration="7s" delay="0.5s" />
        <XPOrb style={{ top: '45%', left: '60%' }} duration="5.5s" delay="1.5s" />
      </Background>
      
      <Sidebar>
        <h2>HabitQuest</h2>
        <NavList>
          <NavItem onClick={() => navigate('/dashboard')}>👾 Dashboard</NavItem>
          <NavItem onClick={() => navigate('/breakthrough-game')}>🎮 Mini Games</NavItem>
          <NavItem className="active">📅 Calendar Tracker</NavItem>
          <NavItem onClick={() => navigate('/NewHabit')}>✨ Habit Creation</NavItem>
          <NavItem onClick={() => navigate('/shop')}>🛒 Shop</NavItem>
          <NavItem onClick={() => navigate('/review')}>📊 Review</NavItem>
        </NavList>
      </Sidebar> 
      
      <TrackContainer>
        <PageTitle>Mission Control</PageTitle>
        
        <ExpContainer>
          <ExpLabel animate={expAnimating}>
            <div>SPACE RANGER LEVEL: <span>3</span></div>
            <div>EXP: <span className="exp-amount">{userExp}</span></div>
          </ExpLabel>
          <ExpBarContainer>
            <ExpBarFill percentage={calculateExpPercentage()} />
          </ExpBarContainer>
        </ExpContainer>
        
        {streakCount > 0 && (
          <StreakBadge>You're on a {streakCount}-day streak! Keep it up!</StreakBadge>
        )}
        
        <CalendarContainer>
          <CalendarHeader>
            <MonthNavButton onClick={previousMonth}>◀ PREV</MonthNavButton>
            <h3>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
            <MonthNavButton onClick={nextMonth}>NEXT ▶</MonthNavButton>
          </CalendarHeader>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <AddEventButton onClick={() => handleOpenEventModal()}>ADD QUEST</AddEventButton>
          </div>
          
          <CalendarGrid>
            {renderCalendarDays()}
          </CalendarGrid>
          
          {selectedDate && (
            <div style={{ 
              marginTop: '1.5rem',
              // Use an explicit className instead of inline animation
              className: "selected-date-container" 
            }}>
              <h4 style={{ 
                fontSize: '1.2rem', 
                marginBottom: '1rem',
                color: spaceTheme.accentGlow,
                textShadow: `0 0 5px ${spaceTheme.accentGlow}`
              }}>
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h4>
              {renderSelectedDateEvents()}
            </div>
          )}
        </CalendarContainer>

        <AIChat 
          user={user} 
          onTaskUpdate={handleTaskUpdate}
          onAddTaskWithDate={handleAddTaskWithDate}
          tasks={[]}
          events={events}
        />

        <CoachTip onClick={toggleTip} />
        {showTip && (
          <TipPopup>
            <strong style={{ color: spaceTheme.accentGlow }}>Captain's Log:</strong>
            <p style={{ marginTop: '0.5rem' }}>You're just 2 quests away from leveling up! Complete tasks to earn cosmic EXP and unlock new powers.</p>
          </TipPopup>
        )}

        {showEventModal && (
          <EventModal>
            <EventModalContent>
              <h3>{editEvent ? 'Edit Quest' : 'Add New Quest'}</h3>
              <EventInput
                type="text"
                placeholder="Quest Title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              />
              <EventTextarea
                placeholder="Quest Description (optional)"
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
              />
              <ModalButtonContainer>
                <CancelButton onClick={handleCloseEventModal}>CANCEL</CancelButton>
                <SaveButton onClick={handleAddEvent}>{editEvent ? 'SAVE CHANGES' : 'ADD QUEST'}</SaveButton>
              </ModalButtonContainer>
            </EventModalContent>
          </EventModal>
        )}
      </TrackContainer>
      
      {/* Meteor is now handled through styled-components instead of inline styles */}
    </>
  );
};

export default Track;
