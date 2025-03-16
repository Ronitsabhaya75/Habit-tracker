import React, { createContext, useState, useContext, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// Animation keyframes (needed from first file but not explicitly shown)
const starGlow = keyframes`
  0% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 0.7; }
`;

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 15px rgba(114, 137, 218, 0.2); }
  50% { box-shadow: 0 0 25px rgba(114, 137, 218, 0.4); }
  100% { box-shadow: 0 0 15px rgba(114, 137, 218, 0.2); }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0) rotate(45deg); }
  50% { transform: translateY(-10px) rotate(45deg); }
  100% { transform: translateY(0) rotate(45deg); }
`;

const trailAnimation = keyframes`
  0% { opacity: 0.5; width: 80px; }
  50% { opacity: 0.8; width: 100px; }
  100% { opacity: 0.5; width: 80px; }
`;

const slowRotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Theme (extracted from the CSS file)
const theme = {
  colors: {
    background: '#0F172A',
    text: '#F1F5F9',
    accent: '#3B82F6',
    secondary: '#8B5CF6',
    borderWhite: 'rgba(255, 255, 255, 0.1)',
    glassWhite: 'rgba(255, 255, 255, 0.05)'
  },
  shadows: {
    card: '0 4px 6px rgba(0, 0, 0, 0.1)'
  }
};

// Habit Progress Context and Provider
const HabitProgressContext = createContext();

// Predefined Reward Tiers
const REWARD_TIERS = {
  fitness: [
    { level: 1, points: 50, badge: 'Beginner', reward: 'Fitness Starter Kit' },
    { level: 2, points: 100, badge: 'Consistent', reward: 'Nutrition Consultation' },
    { level: 3, points: 250, badge: 'Champion', reward: 'Personal Training Session' },
    { level: 4, points: 500, badge: 'Transformational', reward: 'Full Wellness Package' }
  ],
  mindfulness: [
    { level: 1, points: 50, badge: 'Calm Seeker', reward: 'Meditation Guide' },
    { level: 2, points: 100, badge: 'Zen Master', reward: 'Mindfulness Workshop' },
    { level: 3, points: 250, badge: 'Inner Peace', reward: 'Retreat Voucher' }
  ]
};

// Styling components from the CSS file
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

const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  position: relative;
  color: ${theme.colors.text};
  background: ${theme.colors.background};
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
  h1 { 
    font-size: 2.5rem; 
    span { 
      color: ${theme.colors.accent}; 
    } 
  }
`;

const LevelBadge = styled.div`
  background: ${theme.colors.secondary};
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  box-shadow: ${theme.shadows.card};
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const Card = styled.div`
  background: ${theme.colors.glassWhite};
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid ${theme.colors.borderWhite};
  backdrop-filter: blur(8px);
  transition: transform 0.2s ease;
  margin-bottom: 1.5rem;
  &:hover { transform: translateY(-2px); }
`;

const CategoryButton = styled.button`
  padding: 0.8rem 1.5rem;
  margin-right: 0.8rem;
  border-radius: 8px;
  background-color: ${props => props.active ? theme.colors.accent : 'rgba(255, 255, 255, 0.1)'};
  color: ${theme.colors.text};
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: ${props => props.active ? theme.colors.accent : 'rgba(255, 255, 255, 0.2)'};
    transform: translateY(-2px);
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  margin: 1rem 0;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => props.progress}%;
  background: ${theme.colors.accent};
  border-radius: 6px;
  transition: width 0.5s ease;
`;

const Button = styled.button`
  background: ${props => props.color || theme.colors.accent};
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

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1.5rem;
`;

const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
`;

const RewardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`;

const RewardCard = styled.div`
  padding: 1.5rem;
  border-radius: 12px;
  background: ${props => props.earned ? 'rgba(46, 213, 115, 0.1)' : theme.colors.glassWhite};
  border: 1px solid ${props => props.earned ? 'rgba(46, 213, 115, 0.3)' : theme.colors.borderWhite};
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-2px);
  }
`;

const ActivityLogContainer = styled.div`
  max-height: 300px;
  overflow-y: auto;
  margin-top: 1.5rem;
  padding-right: 0.5rem;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
`;

const ActivityItem = styled.div`
  background: ${theme.colors.glassWhite};
  padding: 1rem;
  margin-bottom: 0.75rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  transition: background 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const HabitProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState({});
  const [rewards, setRewards] = useState({});
  const [activityLog, setActivityLog] = useState({});

  // Load progress from local storage on init
  useEffect(() => {
    const savedProgress = localStorage.getItem('habitProgress');
    const savedRewards = localStorage.getItem('habitRewards');
    const savedActivityLog = localStorage.getItem('habitActivityLog');

    if (savedProgress) setProgress(JSON.parse(savedProgress));
    if (savedRewards) setRewards(JSON.parse(savedRewards));
    if (savedActivityLog) setActivityLog(JSON.parse(savedActivityLog));
  }, []);

  // Save progress to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('habitProgress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('habitRewards', JSON.stringify(rewards));
  }, [rewards]);

  useEffect(() => {
    localStorage.setItem('habitActivityLog', JSON.stringify(activityLog));
  }, [activityLog]);

  // Add progress to a specific habit category
  const addProgress = (category, points) => {
    setProgress(prev => {
      const currentProgress = prev[category] || 0;
      const newProgress = currentProgress + points;

      // Check and update rewards
      const categoryRewards = REWARD_TIERS[category] || [];
      const earnedReward = categoryRewards.find(
        tier => newProgress >= tier.points &&
        (!prev[category] || prev[category] < tier.points)
      );

      // Update rewards if a new tier is reached
      if (earnedReward) {
        setRewards(prevRewards => ({
          ...prevRewards,
          [category]: [
            ...(prevRewards[category] || []),
            earnedReward
          ]
        }));
      }

      // Log activity
      setActivityLog(prev => ({
        ...prev,
        [category]: [
          ...(prev[category] || []),
          {
            date: new Date().toISOString(),
            points,
            totalPoints: newProgress
          }
        ]
      }));

      return {
        ...prev,
        [category]: newProgress
      };
    });
  };

  // Reset progress for a specific category
  const resetProgress = (category) => {
    setProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[category];
      return newProgress;
    });

    setRewards(prev => {
      const newRewards = { ...prev };
      delete newRewards[category];
      return newRewards;
    });

    setActivityLog(prev => {
      const newActivityLog = { ...prev };
      delete newActivityLog[category];
      return newActivityLog;
    });
  };

  // Get current progress for a category
  const getProgress = (category) => {
    return progress[category] || 0;
  };

  // Get rewards for a category
  const getRewards = (category) => {
    return rewards[category] || [];
  };

  // Get activity log for a category
  const getActivityLog = (category) => {
    return activityLog[category] || [];
  };

  // Calculate progress percentage for a category
  const getProgressPercentage = (category) => {
    const categoryRewards = REWARD_TIERS[category] || [];
    const currentProgress = getProgress(category);
    const maxTier = categoryRewards[categoryRewards.length - 1];

    return maxTier
      ? Math.min((currentProgress / maxTier.points) * 100, 100)
      : 0;
  };

  // Get next reward tier
  const getNextRewardTier = (category) => {
    const categoryRewards = REWARD_TIERS[category] || [];
    const currentProgress = getProgress(category);

    return categoryRewards.find(tier => currentProgress < tier.points);
  };

  return (
    <HabitProgressContext.Provider value={{
      addProgress,
      resetProgress,
      getProgress,
      getRewards,
      getActivityLog,
      getProgressPercentage,
      getNextRewardTier,
      REWARD_TIERS
    }}>
      {children}
    </HabitProgressContext.Provider>
  );
};

// Custom hook for using Habit Progress Context
const useHabitProgress = () => {
  const context = useContext(HabitProgressContext);
  if (!context) {
    throw new Error('useHabitProgress must be used within a HabitProgressProvider');
  }
  return context;
};

// Main App component
const App = () => {
  return (
    <HabitProgressProvider>
      <DashboardContainer>
        <Background />
        <GradientOverlay />
        <Scenery />
        
        {/* Add decorative elements */}
        <Star size="20px" style={{ top: '15%', left: '25%' }} delay="0.5s" />
        <Star size="15px" style={{ top: '20%', left: '40%' }} delay="1.2s" />
        <Star size="25px" style={{ top: '10%', left: '60%' }} delay="0.8s" />
        <AchievementBadge />
        
        <Sidebar>
          <UserGreeting>
            <h1>Habit<span>Quest</span></h1>
          </UserGreeting>
          <NavList>
            <NavItem className="active">
              <span>🏆 Dashboard</span>
            </NavItem>
            <NavItem>
              <span>📊 Statistics</span>
            </NavItem>
            <NavItem>
              <span>🎯 Goals</span>
            </NavItem>
            <NavItem>
              <span>⚙️ Settings</span>
            </NavItem>
          </NavList>
        </Sidebar>
        
        <MainContent>
          <Header>
            <UserGreeting>
              <h1>Welcome to <span>HabitQuest</span></h1>
            </UserGreeting>
            <LevelBadge>Level 3 Explorer</LevelBadge>
          </Header>
          
          <StyledHabitProgressTracker />
        </MainContent>
      </DashboardContainer>
    </HabitProgressProvider>
  );
};

// Styled HabitProgressTracker component
const StyledHabitProgressTracker = () => {
  const {
    addProgress,
    resetProgress,
    getProgress,
    getRewards,
    getActivityLog,
    getProgressPercentage,
    getNextRewardTier,
    REWARD_TIERS
  } = useHabitProgress();

  const [selectedCategory, setSelectedCategory] = useState('fitness');

  const categories = Object.keys(REWARD_TIERS);

  return (
    <>
      {/* Category Selector */}
      <div style={{ display: 'flex', marginBottom: '1.5rem' }}>
        {categories.map(category => (
          <CategoryButton
            key={category}
            active={selectedCategory === category}
            onClick={() => setSelectedCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </CategoryButton>
        ))}
      </div>

      {/* Progress Section */}
      <Card>
        <Header>
          <CardTitle>
            {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Progress
          </CardTitle>
          <Button 
            color="rgba(255, 0, 0, 0.3)" 
            onClick={() => resetProgress(selectedCategory)}
          >
            Reset Progress
          </Button>
        </Header>

        {/* Progress Bar */}
        <ProgressBar>
          <ProgressFill progress={getProgressPercentage(selectedCategory)} />
        </ProgressBar>

        <ProgressInfo>
          <span>Current Points: {getProgress(selectedCategory)}</span>
          <span>
            Next Goal: {getNextRewardTier(selectedCategory)?.points || 'Completed'}
          </span>
        </ProgressInfo>

        {/* Progress Actions */}
        <ButtonGrid>
          <Button color="#10B981" onClick={() => addProgress(selectedCategory, 5)}>
            Small Win (+5 pts)
          </Button>
          <Button onClick={() => addProgress(selectedCategory, 10)}>
            Daily Goal (+10 pts)
          </Button>
          <Button color={theme.colors.secondary} onClick={() => addProgress(selectedCategory, 25)}>
            Major Achievement (+25 pts)
          </Button>
        </ButtonGrid>
      </Card>

      {/* Rewards Section */}
      <Card>
        <CardTitle>Rewards</CardTitle>
        <RewardGrid>
          {REWARD_TIERS[selectedCategory].map(tier => (
            <RewardCard 
              key={tier.points}
              earned={getProgress(selectedCategory) >= tier.points}
            >
              <h4 style={{ fontWeight: 'bold', color: theme.colors.accent }}>{tier.badge}</h4>
              <p>Points: {tier.points}</p>
              <p>Reward: {tier.reward}</p>
              {getProgress(selectedCategory) >= tier.points && (
                <span style={{ color: '#10B981', fontWeight: 'bold' }}>✓ Earned</span>
              )}
            </RewardCard>
          ))}
        </RewardGrid>
      </Card>

      {/* Activity Log */}
      <Card>
        <CardTitle>Activity Log</CardTitle>
        <ActivityLogContainer>
          {getActivityLog(selectedCategory).slice().reverse().map((log, index) => (
            <ActivityItem key={index}>
              <span>{new Date(log.date).toLocaleString()}</span>
              <span style={{ color: theme.colors.accent, fontWeight: 'bold' }}>
                +{log.points} pts
              </span>
            </ActivityItem>
          ))}
        </ActivityLogContainer>
      </Card>
    </>
  );
};

export default App;
