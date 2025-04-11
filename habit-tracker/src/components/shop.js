import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import theme from '../theme';
import { useHabit } from '../context/HabitContext';
import { useNavigate } from 'react-router-dom';

// Badge data
const BADGES = [
  {
    id: 'rookie',
    name: 'Rookie Badge',
    description: 'Show you just started your journey',
    cost: 50,
    icon: '🆕',
    rarity: 'common',
    effect: null,
    progressMetric: 'daysActive',
    progressRequired: 1
  },
  {
    id: 'streak-master',
    name: 'Streak Master',
    description: 'For maintaining a 7+ day streak',
    cost: 150,
    icon: '🔥',
    rarity: 'rare',
    effect: 'pulse',
    progressMetric: 'currentStreak',
    progressRequired: 7
  },
  {
    id: 'xp-legend',
    name: 'XP Legend',
    description: 'Earned by reaching 1000+ XP',
    cost: 300,
    icon: '🏆',
    rarity: 'epic',
    effect: 'glow',
    progressMetric: 'totalXP',
    progressRequired: 1000
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Complete 5 morning tasks before 8am',
    cost: 200,
    icon: '🐦',
    rarity: 'rare',
    effect: 'float',
    progressMetric: 'earlyTasks',
    progressRequired: 5
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Complete 5 tasks after 10pm',
    cost: 200,
    icon: '🦉',
    rarity: 'rare',
    effect: 'float',
    progressMetric: 'nightTasks',
    progressRequired: 5
  },
  {
    id: 'habit-hero',
    name: 'Habit Hero',
    description: 'Maintain 3 habits for 30 days',
    cost: 500,
    icon: '🦸',
    rarity: 'legendary',
    effect: 'rainbow',
    progressMetric: 'longtermHabits',
    progressRequired: 3
  },
  {
    id: 'task-crusher',
    name: 'Task Crusher',
    description: 'Complete 50 tasks',
    cost: 250,
    icon: '💪',
    rarity: 'rare',
    effect: 'pulse',
    progressMetric: 'completedTasks',
    progressRequired: 50
  },
  {
    id: 'meditation-master',
    name: 'Meditation Master',
    description: 'Complete 30 meditation sessions',
    cost: 350,
    icon: '🧘',
    rarity: 'epic',
    effect: 'glow',
    progressMetric: 'meditationCount',
    progressRequired: 30
  }
];

// Animation keyframes
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

const rainbow = keyframes`
  0% { color: #ff0000; filter: drop-shadow(0 0 8px rgba(255, 0, 0, 0.7)); }
  16% { color: #ff7f00; filter: drop-shadow(0 0 8px rgba(255, 127, 0, 0.7)); }
  33% { color: #ffff00; filter: drop-shadow(0 0 8px rgba(255, 255, 0, 0.7)); }
  50% { color: #00ff00; filter: drop-shadow(0 0 8px rgba(0, 255, 0, 0.7)); }
  66% { color: #0000ff; filter: drop-shadow(0 0 8px rgba(0, 0, 255, 0.7)); }
  83% { color: #4b0082; filter: drop-shadow(0 0 8px rgba(75, 0, 130, 0.7)); }
  100% { color: #9400d3; filter: drop-shadow(0 0 8px rgba(148, 0, 211, 0.7)); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const flip = keyframes`
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(180deg); }
`;

const flipBack = keyframes`
  0% { transform: rotateY(180deg); }
  100% { transform: rotateY(0deg); }
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

// Star background component
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
const ShopContainer = styled.div`
  display: flex;
  min-height: 100vh;
  position: relative;
  color: ${theme.colors.text};
`;

const ShopContent = styled.div`
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
  position: relative;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #00FFF5;
  text-shadow: 0 0 10px rgba(0, 255, 245, 0.5);
  letter-spacing: 1px;
`;

const XpBarContainer = styled.div`
  background: rgba(11, 26, 44, 0.8);
  border: 1px solid rgba(0, 255, 198, 0.3);
  border-radius: 25px;
  padding: 0.5rem 1.5rem;
  min-width: 250px;
  box-shadow: 0 0 15px rgba(0, 255, 198, 0.2);
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const XpBarLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  font-weight: 600;
  color: #B8FFF9;
`;

const XpBarOuter = styled.div`
  width: 100%;
  height: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
`;

const XpBarInner = styled.div`
  width: ${props => props.percent}%;
  height: 100%;
  background: linear-gradient(90deg, #00FFC6 0%, #4A90E2 100%);
  border-radius: 10px;
  transition: width 0.5s ease;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(11, 26, 44, 0.7);
  border-radius: 16px;
  border: 1px solid rgba(0, 255, 198, 0.3);
  backdrop-filter: blur(8px);
`;

const SortingOptions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SortButton = styled.button`
  background: ${props => props.active ? 'rgba(0, 255, 198, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.active ? '#00FFF5' : '#B8FFF9'};
  border: 1px solid ${props => props.active ? 'rgba(0, 255, 198, 0.8)' : 'rgba(255, 255, 255, 0.2)'};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(0, 255, 198, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  }
`;

const FilterOptions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const BadgeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const getCardGlow = (rarity, isOwned) => {
  if (isOwned) {
    switch(rarity) {
      case 'common': return '0 0 15px rgba(176, 176, 176, 0.7)';
      case 'rare': return '0 0 15px rgba(64, 156, 255, 0.7)';
      case 'epic': return '0 0 15px rgba(148, 0, 211, 0.7)';
      case 'legendary': return '0 0 15px rgba(255, 140, 0, 0.7)';
      default: return '0 0 15px rgba(176, 176, 176, 0.7)';
    }
  }
  return 'none';
};

const getCardAnimation = (rarity, isOwned) => {
  if (isOwned) {
    switch(rarity) {
      case 'legendary': 
        return css`
          &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(90deg, 
              rgba(255, 215, 0, 0) 0%, 
              rgba(255, 215, 0, 0.5) 50%, 
              rgba(255, 215, 0, 0) 100%);
            background-size: 200% 100%;
            animation: ${shimmer} 3s linear infinite;
            z-index: -1;
            border-radius: 16px;
          }
        `;
      default: return 'none';
    }
  }
  return 'none';
};

const BadgeCardFront = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transform: ${props => props.flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};
  transition: transform 0.6s;
`;

const BadgeCardBack = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  transform: ${props => props.flipped ? 'rotateY(0deg)' : 'rotateY(180deg)'};
  transition: transform 0.6s;
  padding: 1.5rem;
`;

const BadgeCard = styled.div`
  height: 350px;
  background: rgba(21, 38, 66, 0.8);
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid ${props => props.locked ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 255, 198, 0.3)'};
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;
  perspective: 1000px;
  box-shadow: ${props => getCardGlow(props.rarity, props.owned)};
  opacity: ${props => props.locked ? 0.6 : 1};
  filter: ${props => props.locked ? 'grayscale(80%)' : 'none'};
  ${props => getCardAnimation(props.rarity, props.owned)}
  
  &:hover {
    transform: ${props => props.locked ? 'none' : 'translateY(-10px)'};
    box-shadow: ${props => props.locked 
      ? 'none' 
      : props.rarity === 'legendary' 
        ? '0 10px 30px rgba(255, 215, 0, 0.3)' 
        : '0 10px 20px rgba(0, 255, 198, 0.2)'};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: ${props => {
      if (props.locked) return 'rgba(100, 100, 100, 0.5)';
      switch(props.rarity) {
        case 'common': return '#b0b0b0';
        case 'rare': return '#409CFF';
        case 'epic': return '#A66DD6';
        case 'legendary': return 'linear-gradient(90deg, #FFC700, #FF8C00, #FFC700)';
        default: return '#b0b0b0';
      }
    }};
    ${props => props.rarity === 'legendary' && !props.locked ? 'background-size: 200% 100%; animation: shimmer 2s linear infinite;' : ''}
  }
`;

const LockOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(11, 26, 44, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
  border-radius: 16px;
`;

const LockIcon = styled.div`
  font-size: 3rem;
  color: rgba(255, 255, 255, 0.7);
`;

const BadgeIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  z-index: 1;
  animation: ${props => {
    switch(props.effect) {
      case 'pulse': return css`${pulse} 2s infinite`;
      case 'glow': return css`${glow} 2s infinite`;
      case 'float': return css`${float} 2s infinite`;
      case 'rainbow': return css`${rainbow} 6s infinite`;
      default: return 'none';
    }
  }};
  filter: drop-shadow(0 0 5px 
    ${props => {
      switch(props.rarity) {
        case 'common': return 'rgba(176, 176, 176, 0.7)';
        case 'rare': return 'rgba(64, 156, 255, 0.7)';
        case 'epic': return 'rgba(148, 0, 211, 0.7)';
        case 'legendary': return 'rgba(255, 215, 0, 0.7)';
        default: return 'rgba(176, 176, 176, 0.7)';
      }
    }}
  );
`;

const BadgeName = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #B8FFF9;
  text-shadow: 0 0 5px rgba(0, 255, 245, 0.5);
`;

const BadgeDescription = styled.p`
  font-size: 0.9rem;
  margin-bottom: 1rem;
  color: ${theme.colors.textSecondary};
`;

const BadgeDetailTitle = styled.h4`
  font-size: 1rem;
  color: #00FFF5;
  margin-bottom: 0.5rem;
`;

const BadgeDetailText = styled.p`
  font-size: 0.85rem;
  color: #B8FFF9;
  margin-bottom: 1rem;
`;

const BadgeCost = styled.div`
  margin-top: auto;
  font-weight: 600;
  color: #00FFC6;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
`;

const ProgressBarLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: ${theme.colors.textSecondary};
  margin-bottom: 0.2rem;
`;

const ProgressBarOuter = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressBarInner = styled.div`
  width: ${props => Math.min(props.percent, 100)}%;
  height: 100%;
  background: ${props => props.percent >= 100 
    ? 'linear-gradient(90deg, #00FFC6, #4A90E2)' 
    : 'rgba(0, 255, 198, 0.5)'};
  border-radius: 3px;
  transition: width 0.5s ease;
`;

const PurchaseButton = styled.button`
  background: ${props => props.disabled 
    ? 'rgba(100, 100, 100, 0.3)' 
    : 'linear-gradient(90deg, #00FFC6 0%, #4A90E2 100%)'};
  color: ${props => props.disabled ? '#888888' : 'white'};
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 1rem;
  width: 100%;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: ${props => props.disabled 
      ? 'rgba(100, 100, 100, 0.3)' 
      : 'linear-gradient(90deg, #00FFC6 30%, #4A90E2 100%)'};
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.disabled 
      ? 'none' 
      : '0 6px 15px rgba(0, 255, 198, 0.3)'};
  }
  
  &:before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
    transform: scale(0);
    opacity: 0;
    transition: transform 0.5s, opacity 0.5s;
  }
  
  &:hover:before {
    transform: ${props => props.disabled ? 'none' : 'scale(1)'};
    opacity: ${props => props.disabled ? 0 : 1};
  }
`;

const FlipButton = styled.button`
  background: transparent;
  border: none;
  color: #00FFF5;
  cursor: pointer;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.2s ease;
  
  &:hover {
    color: #00FFC6;
    transform: translateY(-2px);
  }
`;

const OwnedTag = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(90deg, #00FFC6 0%, #4A90E2 100%);
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  z-index: 10;
  box-shadow: 0 3px 10px rgba(0, 255, 198, 0.3);
`;

const RarityTag = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: ${props => {
    switch(props.rarity) {
      case 'common': return '#b0b0b0';
      case 'rare': return '#409CFF';
      case 'epic': return '#A66DD6';
      case 'legendary': return 'linear-gradient(90deg, #FFC700, #FF8C00)';
      default: return '#b0b0b0';
    }
  }};
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  z-index: 10;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
`;

const ShopAssistantContainer = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: rgba(11, 26, 44, 0.9);
  border-radius: 16px;
  border: 1px solid rgba(0, 255, 198, 0.3);
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  z-index: 100;
  max-width: 300px;
  animation: ${fadeIn} 0.5s ease;
`;

const AssistantAvatar = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #00FFC6, #4A90E2);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.8rem;
`;

const AssistantMessage = styled.div`
  flex: 1;
  font-size: 0.9rem;
  color: #B8FFF9;
`;

const AssistantCloseButton = styled.button`
  position: absolute;
  top: -10px;
  right: -10px;
  width: 24px;
  height: 24px;
  background: rgba(11, 26, 44, 0.9);
  border: 1px solid rgba(0, 255, 198, 0.3);
  border-radius: 50%;
  color: #00FFF5;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 0.8rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  
  &:hover {
    background: rgba(0, 255, 198, 0.2);
  }
`;

const SidebarContainer = styled.div`
  width: 280px;
  padding: 2rem;
  background: rgba(11, 26, 44, 0.9);
  border-right: 1px solid rgba(0, 255, 198, 0.3);
  backdrop-filter: blur(10px);
  z-index: 10;
  box-shadow: 5px 0 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
`;

const SidebarTitle = styled.h2`
  color: #00FFF5;
  font-size: 1.8rem;
  margin-bottom: 2rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-shadow: 0 0 10px rgba(0, 255, 245, 0.5);
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
    background: linear-gradient(90deg, rgba(0, 255, 198, 0.3) 0%, rgba(74, 144, 226, 0.3) 100%);
    border-left: 3px solid #00FFC6;
    color: #00FFF5;
  }
`;

const NotificationContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: ${props => props.type === 'success' 
    ? 'linear-gradient(90deg, #00FFC6, #4A90E2)' 
    : 'linear-gradient(90deg, #FF5252, #FF1744)'};
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  z-index: 100;
  animation: ${fadeIn} 0.3s;
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const XpBooster = styled.div`
  background: linear-gradient(135deg, rgba(0, 255, 198, 0.2), rgba(74, 144, 226, 0.2));
  border: 1px solid rgba(0, 255, 198, 0.3);
  border-radius: 16px;
  padding: 1.5rem;
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const XpBoosterInfo = styled.div`
  flex: 1;
`;

const XpBoosterTitle = styled.h3`
  font-size: 1.2rem;
  color: #00FFF5;
  margin-bottom: 0.5rem;
`;

const XpBoosterDescription = styled.p`
  font-size: 0.9rem;
  color: #B8FFF9;
`;

const XpBoosterButton = styled.button`
  background: linear-gradient(90deg, #00FFC6 0%, #4A90E2 100%);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 255, 198, 0.3);
  }
`;

const Shop = () => {
  const navigate = useNavigate();
  const { 
    calculateTotalXP, 
    deductXP, 
    ownedBadges, 
    setOwnedBadges,
    getUserStats
  } = useHabit(); // Use HabitContext

  const [purchasing, setPurchasing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [sortBy, setSortBy] = useState('rarity');
  const [filterBy, setFilterBy] = useState('all');
  const [flippedCard, setFlippedCard] = useState(null);
  const [showAssistant, setShowAssistant] = useState(true);
  const [assistantMessage, setAssistantMessage] = useState('');
  
  // User's XP and level
  const xp = calculateTotalXP(); 
  const level = Math.floor(xp / 100) + 1;
  const xpForNextLevel = level * 100;
  const xpInCurrentLevel = xp % 100;
  const percentToNextLevel = (xpInCurrentLevel / 100) * 100;
  
  // User stats for progress tracking
  const userStats = {
    daysActive: 15,
    currentStreak: 5,
    totalXP: xp,
    earlyTasks: 3,
    nightTasks: 2,
    longtermHabits: 1,
    completedTasks: 30,
    meditationCount: 10
  };
  
  // Sort and filter badges
  const getSortedAndFilteredBadges = () => {
    let filtered = [...BADGES];
    
    // Filter badges
    if (filterBy === 'owned') {
      filtered = filtered.filter(badge => ownedBadges.includes(badge.id));
    } else if (filterBy === 'notOwned') {
      filtered = filtered.filter(badge => !ownedBadges.includes(badge.id));
    } else if (filterBy === 'affordable') {
      filtered = filtered.filter(badge => badge.cost <= xp && !ownedBadges.includes(badge.id));
    }
    
    // Sort badges
    if (sortBy === 'cost') {
      filtered.sort((a, b) => a.cost - b.cost);
    } else if (sortBy === 'rarity') {
      const rarityOrder = { 'common': 0, 'rare': 1, 'epic': 2, 'legendary': 3 };
      filtered.sort((a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity]);
    } else if (sortBy === 'progress') {
      filtered.sort((a, b) => {
        const progressA = userStats[a.progressMetric] / a.progressRequired;
        const progressB = userStats[b.progressMetric] / b.progressRequired;
        return progressB - progressA;
      });
    }
    
    return filtered;
  };
  
  // Calculate progress percentage for a badge
  const calculateProgress = (badge) => {
    const current = userStats[badge.progressMetric] || 0;
    const required = badge.progressRequired;
    return Math.min((current / required) * 100, 100);
  };
  
  // Purchase a badge
  const purchaseBadge = async (badgeId) => {
    if (purchasing) return;

    const badge = BADGES.find(b => b.id === badgeId);
    if (!badge) return;

    if (xp < badge.cost) {
      setNotification({ 
        type: 'error', 
        message: 'Not enough XP! Complete more habits to earn XP.' 
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    if (ownedBadges.includes(badgeId)) {
      setNotification({ 
        type: 'error', 
        message: 'You already own this badge!' 
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    setPurchasing(true);

    try {
      // Deduct XP using HabitContext's deductXP function
      const success = deductXP(badge.cost);
      if (!success) throw new Error('XP deduction failed');

      // Add badge to ownedBadges
      const newBadges = [...ownedBadges, badgeId];
      setOwnedBadges(newBadges);

      setNotification({ 
        type: 'success', 
        message: `✨ Congratulations! You unlocked the ${badge.name}!` 
      });
      
      // Update assistant message
      setAssistantMessage(`Great purchase! Your ${badge.name} will now appear next to your name on the leaderboard.`);
      setShowAssistant(true);
      
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Purchase failed:', error);
      setNotification({ 
        type: 'error', 
        message: 'Purchase failed. Please try again.' 
      });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setPurchasing(false);
    }
  };
  
  // Handle card flip
  const handleCardFlip = (badgeId) => {
    if (flippedCard === badgeId) {
      setFlippedCard(null);
    } else {
      setFlippedCard(badgeId);
    }
  };
  
  // Set initial assistant message
  useEffect(() => {
    const closestBadge = BADGES.filter(b => !ownedBadges.includes(b.id))
      .sort((a, b) => a.cost - b.cost)[0];
      
    if (closestBadge) {
      const remaining = Math.max(0, closestBadge.cost - xp);
      setAssistantMessage(`You need ${remaining} more XP to unlock the ${closestBadge.name}! Keep completing your habits!`);
    } else {
      setAssistantMessage("You've unlocked all the badges! Amazing job maintaining your habits!");
    }
  }, [xp, ownedBadges]);
  
  // Generate random stars for background
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
        glow: Math.random() > 0.8 ? 3 : 1
      });
    }
    return stars;
  };
  
  const stars = generateStars(100);

  return (
    <ShopContainer>
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
      
      <SidebarContainer>
        <SidebarTitle>HabitQuest</SidebarTitle>
        <NavList>
          <NavItem onClick={() => navigate('/dashboard')}>👾 Dashboard</NavItem>
          <NavItem onClick={() => navigate('/breakthrough-game')}>🎮 Mini Games</NavItem>
          <NavItem onClick={() => navigate('/track')}>📅 Calendar tracker</NavItem>
          <NavItem onClick={() => navigate('/new-habit')}>✨ Habit Creation</NavItem>
          <NavItem className="active">🛒 Shop</NavItem>
          <NavItem onClick={() => navigate('/review')}>📊 Review</NavItem>
        </NavList>
        </SidebarContainer>

      <ShopContent>
        <Header>
          <Title>HabitQuest Shop</Title>
          <XpBarContainer>
            <XpBarLabel>
              <span>Level {level}</span>
              <span>{xp} XP</span>
            </XpBarLabel>
            <XpBarOuter>
              <XpBarInner percent={percentToNextLevel} />
            </XpBarOuter>
            <XpBarLabel>
              <span>Progress to Lvl {level + 1}</span>
              <span>{xpInCurrentLevel}/{100}</span>
            </XpBarLabel>
          </XpBarContainer>
        </Header>

        <p style={{ color: '#B8FFF9', marginBottom: '2rem' }}>
          Spend your hard-earned XP on badges to show off on the leaderboard! Unlock rare and legendary badges to stand out.
        </p>
        
        <FilterContainer>
          <SortingOptions>
            <span style={{ color: '#B8FFF9', marginRight: '10px' }}>Sort by:</span>
            <SortButton 
              active={sortBy === 'rarity'} 
              onClick={() => setSortBy('rarity')}
            >
              Rarity
            </SortButton>
            <SortButton 
              active={sortBy === 'cost'} 
              onClick={() => setSortBy('cost')}
            >
              XP Cost
            </SortButton>
            <SortButton 
              active={sortBy === 'progress'} 
              onClick={() => setSortBy('progress')}
            >
              Progress
            </SortButton>
          </SortingOptions>
          
          <FilterOptions>
            <span style={{ color: '#B8FFF9', marginRight: '10px' }}>Show:</span>
            <SortButton 
              active={filterBy === 'all'} 
              onClick={() => setFilterBy('all')}
            >
              All
            </SortButton>
            <SortButton 
              active={filterBy === 'owned'} 
              onClick={() => setFilterBy('owned')}
            >
              Owned
            </SortButton>
            <SortButton 
              active={filterBy === 'notOwned'} 
              onClick={() => setFilterBy('notOwned')}
            >
              Not Owned
            </SortButton>
            <SortButton 
              active={filterBy === 'affordable'} 
              onClick={() => setFilterBy('affordable')}
            >
              Affordable
            </SortButton>
          </FilterOptions>
        </FilterContainer>
        
        <XpBooster>
          <XpBoosterInfo>
            <XpBoosterTitle>🚀 XP Booster Available!</XpBoosterTitle>
            <XpBoosterDescription>
              Complete 3 habits today to earn double XP for the next 24 hours!
            </XpBoosterDescription>
          </XpBoosterInfo>
          <XpBoosterButton>Activate Challenge</XpBoosterButton>
        </XpBooster>

        <BadgeGrid>
          {getSortedAndFilteredBadges().map(badge => {
            const owned = ownedBadges.includes(badge.id);
            const locked = !owned && xp < badge.cost;
            const progressPercent = calculateProgress(badge);
            const isFlipped = flippedCard === badge.id;
            
            return (
              <BadgeCard 
                key={badge.id} 
                rarity={badge.rarity} 
                owned={owned}
                locked={locked}
              >
                {owned && <OwnedTag>OWNED</OwnedTag>}
                <RarityTag rarity={badge.rarity}>
                  {badge.rarity.toUpperCase()}
                </RarityTag>

                {locked && (
                  <LockOverlay>
                    <LockIcon>🔒</LockIcon>
                  </LockOverlay>
                )}

                <BadgeCardFront flipped={isFlipped}>
                  <BadgeIcon 
                    effect={owned ? badge.effect : null}
                    rarity={badge.rarity}
                  >
                    {badge.icon}
                  </BadgeIcon>

                  <BadgeName>{badge.name}</BadgeName>
                  <BadgeDescription>{badge.description}</BadgeDescription>

                  <ProgressBarContainer>
                    <ProgressBarLabel>
                      <span>Progress: {Math.min(userStats[badge.progressMetric] || 0, badge.progressRequired)}/{badge.progressRequired}</span>
                      <span>{Math.round(progressPercent)}%</span>
                    </ProgressBarLabel>
                    <ProgressBarOuter>
                      <ProgressBarInner percent={progressPercent} />
                    </ProgressBarOuter>
                  </ProgressBarContainer>

                  <BadgeCost>
                    <span>{badge.cost}</span>
                    <span>XP</span>
                  </BadgeCost>

                  {!owned ? (
                    <PurchaseButton
                      onClick={() => purchaseBadge(badge.id)}
                      disabled={locked || purchasing}
                    >
                      {locked ? `Need ${badge.cost - xp} more XP` : 'Purchase'}
                    </PurchaseButton>
                  ) : (
                    <PurchaseButton
                      disabled={true}
                    >
                      Owned
                    </PurchaseButton>
                  )}
                  
                  <FlipButton onClick={() => handleCardFlip(badge.id)}>
                    <span>Details</span>
                    <span>↪</span>
                  </FlipButton>
                </BadgeCardFront>
                
                <BadgeCardBack flipped={isFlipped}>
                  <BadgeDetailTitle>Badge Effects</BadgeDetailTitle>
                  <BadgeDetailText>
                    {badge.rarity === 'legendary' 
                      ? 'Adds a golden glow around your name on the leaderboard.' 
                      : badge.rarity === 'epic'
                      ? 'Adds a purple highlight to your name on the leaderboard.'
                      : 'Displays next to your name on the leaderboard.'}
                  </BadgeDetailText>
                  
                  <BadgeDetailTitle>How to Earn</BadgeDetailTitle>
                  <BadgeDetailText>
                    {badge.progressMetric === 'daysActive' 
                      ? 'Log into HabitQuest for consecutive days.' 
                      : badge.progressMetric === 'currentStreak'
                      ? 'Complete all your daily habits without missing a day.'
                      : badge.progressMetric === 'completedTasks'
                      ? 'Mark tasks as complete in your habit tracker.'
                      : 'Complete specific activities based on badge requirements.'}
                  </BadgeDetailText>
                  
                  <BadgeDetailTitle>Rarity</BadgeDetailTitle>
                  <BadgeDetailText>
                    {badge.rarity === 'legendary' 
                      ? 'Only 2% of users have this badge!' 
                      : badge.rarity === 'epic'
                      ? 'Only 10% of users have this badge!'
                      : badge.rarity === 'rare'
                      ? 'Only 25% of users have this badge!'
                      : 'A common starter badge.'}
                  </BadgeDetailText>
                  
                  <FlipButton onClick={() => handleCardFlip(badge.id)}>
                    <span>Back</span>
                    <span>↩</span>
                  </FlipButton>
                </BadgeCardBack>
              </BadgeCard>
            );
          })}
        </BadgeGrid>

        {notification && (
          <NotificationContainer type={notification.type}>
            <span>{notification.type === 'success' ? '✅' : '❌'}</span>
            <span>{notification.message}</span>
          </NotificationContainer>
        )}
        
        {showAssistant && (
          <ShopAssistantContainer>
            <AssistantAvatar>🤖</AssistantAvatar>
            <AssistantMessage>{assistantMessage}</AssistantMessage>
            <AssistantCloseButton onClick={() => setShowAssistant(false)}>
              ✕
            </AssistantCloseButton>
          </ShopAssistantContainer>
        )}
      </ShopContent>
    </ShopContainer>
  );
};

export default Shop;