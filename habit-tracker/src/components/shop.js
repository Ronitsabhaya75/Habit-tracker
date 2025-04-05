/*
Shop Component Documentation
Overview
The Shop component allows users to spend their accumulated XP on cosmetic items, badges, and power-ups. Purchased badges appear next to the user's name on the leaderboard.

Key Features
1. Badge Shop
- Visual display of available badges
- XP cost for each badge
- Preview functionality
- Purchase confirmation

2. User XP Display
- Shows current XP balance
- Visual indicator of XP spending

3. Purchase System
- Deducts XP from user balance
- Adds badge to user's collection
- Updates leaderboard appearance

4. Badge Display
- Visual representation of each badge
- Rarity indicators
- Animated effects for special badges

Technical Implementation
- Uses the same styling system as Dashboard
- Integrates with Auth context for user XP
- Updates user profile with purchased items
*/

import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../theme';
import { useAuth } from '../context/AuthContext';
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
    effect: null
  },
  {
    id: 'streak-master',
    name: 'Streak Master',
    description: 'For maintaining a 7+ day streak',
    cost: 150,
    icon: '🔥',
    rarity: 'rare',
    effect: 'pulse'
  },
  {
    id: 'xp-legend',
    name: 'XP Legend',
    description: 'Earned by reaching 1000+ XP',
    cost: 300,
    icon: '🏆',
    rarity: 'epic',
    effect: 'glow'
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Complete 5 morning tasks before 8am',
    cost: 200,
    icon: '🐦',
    rarity: 'rare',
    effect: 'float'
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Complete 5 tasks after 10pm',
    cost: 200,
    icon: '🦉',
    rarity: 'rare',
    effect: 'float'
  },
  {
    id: 'habit-hero',
    name: 'Habit Hero',
    description: 'Maintain 3 habits for 30 days',
    cost: 500,
    icon: '🦸',
    rarity: 'legendary',
    effect: 'rainbow'
  },
  {
    id: 'task-crusher',
    name: 'Task Crusher',
    description: 'Complete 50 tasks',
    cost: 250,
    icon: '💪',
    rarity: 'rare',
    effect: 'pulse'
  },
  {
    id: 'meditation-master',
    name: 'Meditation Master',
    description: 'Complete 30 meditation sessions',
    cost: 350,
    icon: '🧘',
    rarity: 'epic',
    effect: 'glow'
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
  0% { color: #ff0000; }
  16% { color: #ff7f00; }
  33% { color: #ffff00; }
  50% { color: #00ff00; }
  66% { color: #0000ff; }
  83% { color: #4b0082; }
  100% { color: #9400d3; }
`;

// Styled components
const ShopContainer = styled.div`
  display: flex;
  min-height: 100vh;
  position: relative;
  color: ${theme.colors.text};
  background: ${theme.colors.background};
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
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${theme.colors.accent};
`;

const XpDisplay = styled.div`
  background: ${theme.colors.secondary};
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  box-shadow: ${theme.shadows.card};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BadgeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const BadgeCard = styled.div`
  background: ${theme.colors.glassWhite};
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid ${theme.colors.borderWhite};
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: ${props => {
      switch(props.rarity) {
        case 'common': return '#b0b0b0';
        case 'rare': return '#1e90ff';
        case 'epic': return '#9400d3';
        case 'legendary': return '#ff8c00';
        default: return '#b0b0b0';
      }
    }};
  }
`;
const Sidebar = styled.div`
  width: 280px;
  padding: 2rem;
  background: rgba(30, 39, 73, 0.8);
  border-right: 1px solid ${theme.colors.borderWhite};
  backdrop-filter: blur(10px);
  z-index: 10;
  box-shadow: 5px 0 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;

  h2 {
    color: ${theme.colors.accent};
    font-size: 1.8rem;
    margin-bottom: 2rem;
    font-weight: 700;
    letter-spacing: 0.5px;
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
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  &.active {
    background: ${theme.colors.secondary};
  }
`;

const BadgeIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: ${props => {
    switch(props.effect) {
      case 'pulse': return pulse;
      case 'glow': return glow;
      case 'float': return float;
      case 'rainbow': return rainbow;
      default: return 'none';
    }
  }} 2s infinite;
`;

const BadgeName = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: ${theme.colors.accent};
`;

const BadgeDescription = styled.p`
  font-size: 0.9rem;
  margin-bottom: 1rem;
  color: ${theme.colors.textSecondary};
`;

const BadgeCost = styled.div`
  margin-top: auto;
  font-weight: 600;
  color: ${theme.colors.secondary};
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const PurchaseButton = styled.button`
  background: ${props => props.disabled ? theme.colors.disabled : theme.colors.accent};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-weight: 600;
  transition: all 0.2s ease;
  margin-top: 1rem;
  width: 100%;
  
  &:hover {
    background: ${props => props.disabled ? theme.colors.disabled : theme.colors.secondary};
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
  }
`;

const OwnedTag = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: ${theme.colors.accent};
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
`;

const RarityTag = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: ${props => {
    switch(props.rarity) {
      case 'common': return '#b0b0b0';
      case 'rare': return '#1e90ff';
      case 'epic': return '#9400d3';
      case 'legendary': return '#ff8c00';
      default: return '#b0b0b0';
    }
  }};
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
`;

const BackButton = styled.button`
  background: ${theme.colors.secondary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  margin-bottom: 2rem;
  
  &:hover {
    background: ${theme.colors.accent};
    transform: translateY(-2px);
  }
`;

const Shop = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [ownedBadges, setOwnedBadges] = useState(user?.badges || []);
  const [xp, setXp] = useState(user?.xp || 0);
  const [purchasing, setPurchasing] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (user) {
      setOwnedBadges(user.badges || []);
      setXp(user.xp || 0);
    }
  }, [user]);

  const purchaseBadge = async (badgeId) => {
    if (purchasing) return;
    
    const badge = BADGES.find(b => b.id === badgeId);
    if (!badge) return;
    
    if (xp < badge.cost) {
      setNotification({ type: 'error', message: 'Not enough XP!' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    
    if (ownedBadges.includes(badgeId)) {
      setNotification({ type: 'error', message: 'You already own this badge!' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    
    setPurchasing(true);
    
    try {
      // In a real app, you would call your backend API here
      const newXp = xp - badge.cost;
      const newBadges = [...ownedBadges, badgeId];
      
      // Update local state immediately for better UX
      setXp(newXp);
      setOwnedBadges(newBadges);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update user in context and (in a real app) persist to backend
      updateUser({
        ...user,
        xp: newXp,
        badges: newBadges
      });
      
      setNotification({ 
        type: 'success', 
        message: `Purchased ${badge.name}!` 
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Purchase failed:', error);
      // Revert local state if purchase fails
      setXp(xp);
      setOwnedBadges(ownedBadges);
      setNotification({ 
        type: 'error', 
        message: 'Purchase failed. Please try again.' 
      });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <ShopContainer>
        <Sidebar>
        <h2>HabitQuest</h2>
        <NavList>
          <NavItem className="active">Dashboard</NavItem>
          <NavItem onClick={() => navigate('/breakthrough-game')}>Mini Games</NavItem>
          <NavItem onClick={() => navigate('/track')}>Calender tracker</NavItem>
          <NavItem onClick={() => navigate('/NewHabit')}>Habit Creation</NavItem>
          <NavItem onClick={() => navigate('/shop')}>Shop</NavItem>
          <NavItem onClick={() => navigate('/review')}>Review</NavItem>

        </NavList>
      </Sidebar>
      <ShopContent>
        
        <Header>
          <Title>HabitQuest Shop</Title>
          <XpDisplay>
            <span>XP:</span>
            <span>{xp}</span>
          </XpDisplay>
        </Header>
        
        <p>Spend your hard-earned XP on badges to show off on the leaderboard!</p>
        
        <BadgeGrid>
          {BADGES.map(badge => (
            <BadgeCard 
              key={badge.id} 
              rarity={badge.rarity}
            >
              {ownedBadges.includes(badge.id) && <OwnedTag>OWNED</OwnedTag>}
              <RarityTag rarity={badge.rarity}>
                {badge.rarity.toUpperCase()}
              </RarityTag>
              
              <BadgeIcon effect={badge.effect}>
                {badge.icon}
              </BadgeIcon>
              
              <BadgeName>{badge.name}</BadgeName>
              <BadgeDescription>{badge.description}</BadgeDescription>
              
              <BadgeCost>
                <span>{badge.cost}</span>
                <span>XP</span>
              </BadgeCost>
              
              <PurchaseButton
                onClick={() => purchaseBadge(badge.id)}
                disabled={ownedBadges.includes(badge.id) || xp < badge.cost || purchasing}
              >
                {ownedBadges.includes(badge.id) ? 'Owned' : 'Purchase'}
              </PurchaseButton>
            </BadgeCard>
          ))}
        </BadgeGrid>
        
        {notification && (
          <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: notification.type === 'success' ? '#4CAF50' : '#F44336',
            color: 'white',
            padding: '1rem',
            borderRadius: '8px',
            zIndex: 100,
            animation: 'fadeIn 0.3s'
          }}>
            {notification.message}
          </div>
        )}
      </ShopContent>
    </ShopContainer>
  );
};

export default Shop;