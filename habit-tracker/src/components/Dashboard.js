/**
 * Dashboard Component
 *
 * This file implements the Dashboard component for the application.
 * It provides an interactive dashboard that includes:
 * - A sidebar with navigation options.
 * - A header displaying user information.
 * - Various cards that display key metrics:
 *    • A progress overview using a responsive chart.
 *    • A leaderboard ranking users based on performance.
 *    • A section for achievements and milestones.
 *    • A task list for managing activities.
 *
 * The component utilizes React hooks (useState, useEffect, useRef) for state management
 * and side effects. It employs styled-components for CSS-in-JS styling and 
 * integrates with Recharts for data visualization.
 *
 * It also interacts with authentication context (useAuth) to fetch the current user's details.
 *
 * 🔍 Simulated asynchronous functions (e.g., fetchUserData, fetchLeaderboardData) 
 * are used to mimic API requests.
 *
 * The code follows a modular structure, ensuring readability and maintainability.
 */


import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../theme';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { useHabit } from '../context/HabitContext';

// Import the predefined habit categories from BreakthroughGame
const HABIT_CATEGORIES = [
  { 
    id: 'addiction', 
    name: 'Addiction Recovery', 
    icon: '🚭',
    description: 'Break free from harmful dependencies',
    stages: [
      { level: 1, goal: 'First Week Clean', points: 50, reward: 'Self-Care Package' },
      { level: 2, goal: 'One Month Milestone', points: 200, reward: 'Wellness Session' },
      { level: 3, goal: 'Quarterly Achievement', points: 500, reward: 'Personal Experience Gift' }
    ]
  },
  { 
    id: 'fitness', 
    name: 'Fitness Transformation', 
    icon: '💪',
    description: 'Build a healthier, stronger you',
    stages: [
      { level: 1, goal: 'Consistent Workouts', points: 75, reward: 'Healthy Meal Coupon' },
      { level: 2, goal: 'Nutrition Tracking', points: 250, reward: 'Fitness Gear' },
      { level: 3, goal: 'Body Composition Change', points: 600, reward: 'Personal Training' }
    ]
  }
];

// **ANIMATIONS**
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

// **BACKGROUND**
const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #2b3a67 0%, #1a2233 100%);
  overflow: hidden;
`;

// Gradient Overlay
const GradientOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 50%, rgba(114, 137, 218, 0.15) 0%, transparent 70%),
              radial-gradient(circle at 70% 70%, rgba(90, 128, 244, 0.1) 0%, transparent 60%);
  z-index: 1;
`;

// Scenery
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

// Stars
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

// Achievement Badge
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

// Rocket
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

// Rocket Trail
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

// Progress Circle
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

// XP Orb
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

// Dashboard Container
const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  position: relative;
  color: ${theme.colors.text};
`;

// Sidebar
const Sidebar = styled.div`
  width: 250px;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-right: 1px solid ${theme.colors.borderWhite};
  backdrop-filter: blur(8px);
  z-index: 10;
`;

// Nav List
const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 2rem;
`;

// Nav Item
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

// Main Content
const MainContent = styled.div`
  flex: 1;
  padding: 3rem;
  margin-left: 250px;
  z-index: 10;
`;

// Header
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

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
const LevelBadge = styled.div`
  background: ${theme.colors.secondary};
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  box-shadow: ${theme.shadows.card};
`;

// Grid Container
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
  align-items: start;
`;

// Updated Card styles
const Card = styled.div`
  background: ${theme.colors.glassWhite};
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid ${theme.colors.borderWhite};
  backdrop-filter: blur(8px);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

// Category Card
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
    
    &::after {
      transform: translateX(0);
    }
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

// Leaderboard List
const LeaderboardList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 1rem;
`;

// Leaderboard Item
const LeaderboardItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin: 0.5rem 0;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

// User Rank
const UserRank = styled.span`
  color: ${theme.colors.accent};
  font-weight: 600;
`;

// User Score
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

  &.completed {
    background: rgba(46, 213, 115, 0.1);
  }

  &.current {
    border: 1px solid ${theme.colors.accent};
  }
`;

const RewardBadge = styled.span`
  background: ${theme.colors.accent};
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.9rem;
`;

// Dashboard Component
const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { progress, getCategoryProgress } = useHabit();
  const [activeCategory, setActiveCategory] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const leaderboardData = await fakeFetchLeaderboardData();
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fakeFetchLeaderboardData = async () => {
    return new Promise((resolve) => {
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

  return (
    <DashboardContainer>
      <Background>
        <GradientOverlay />
        <Scenery />
        <Star size="20px" style={{ top: '10%', left: '10%' }} duration="4s" delay="0.5s" />
        <Star size="15px" style={{ top: '25%', left: '25%' }} duration="3s" delay="1s" />
        <Star size="25px" style={{ top: '15%', right: '30%' }} duration="5s" delay="0.2s" />
        <Rocket>
          <RocketTrail />
        </Rocket>
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
          <NavItem>
            <Link to="/breakthrough-game" style={{ color: theme.colors.text, textDecoration: 'none' }}>
              🎮 Breakthrough Game
            </Link>
          </NavItem>
          <NavItem>🏆 Achievements</NavItem>
          <NavItem>📈 Statistics</NavItem>
          <NavItem>⚙️ Settings</NavItem>
        </NavList>
      </Sidebar>

      <MainContent>
        <Header>
          <UserGreeting>
            <h1>Welcome{user?.name ? `, ${user.name}` : ''}! 👋</h1>
            <LevelBadge>Level {calculateTotalLevel()}</LevelBadge>
          </UserGreeting>
        </Header>

        <GridContainer>
          {/* Progress Overview */}
          <Card>
            <h2>Active Habits</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {HABIT_CATEGORIES.map(category => (
                <CategoryCard 
                  key={category.id} 
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <CategoryIcon>{category.icon}</CategoryIcon>
                  <CategoryInfo>
                    <h3>{category.name}</h3>
                    <p>{category.description}</p>
                    <ProgressBar progress={calculateCategoryProgress(category.id)}>
                      <div />
                    </ProgressBar>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                      {getCategoryProgress(category.id)} points earned
                    </div>
                  </CategoryInfo>
                </CategoryCard>
              ))}
            </div>
          </Card>

          {/* Active Category Details */}
          <Card>
            <h2>Current Progress</h2>
            {activeCategory ? (
              <>
                <h3>{HABIT_CATEGORIES.find(cat => cat.id === activeCategory)?.name}</h3>
                <StagesList>
                  {HABIT_CATEGORIES.find(cat => cat.id === activeCategory)?.stages.map(stage => (
                    <StageItem 
                      key={stage.level}
                      className={getStageStatus(stage, activeCategory)}
                    >
                      <div>
                        <strong>Level {stage.level}</strong>
                        <p>{stage.goal}</p>
                      </div>
                      <RewardBadge>{stage.reward}</RewardBadge>
                    </StageItem>
                  ))}
                </StagesList>
                <Link to={`/breakthrough-game?category=${activeCategory}`}>
                  <Button style={{ marginTop: '1rem', width: '100%' }}>
                    Continue Journey
                  </Button>
                </Link>
              </>
            ) : (
              <p>Select a habit category to view progress</p>
            )}
          </Card>

          {/* Leaderboard */}
          <Card>
            <h2>Leaderboard</h2>
            <LeaderboardList>
              {leaderboard.map((player, index) => (
                <LeaderboardItem key={player.name}>
                  <div>
                    <UserRank>#{index + 1}</UserRank> {player.name}
                  </div>
                  <UserScore>{player.xp} XP</UserScore>
                </LeaderboardItem>
              ))}
            </LeaderboardList>
          </Card>

          {/* Recent Achievements */}
          <Card>
            <h2>Recent Achievements</h2>
            <p>Keep going! Your next milestone awaits.</p>
            <Link to="/breakthrough-game">
              <Button style={{ width: '100%' }}>View All Achievements</Button>
            </Link>
          </Card>
        </GridContainer>
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;
