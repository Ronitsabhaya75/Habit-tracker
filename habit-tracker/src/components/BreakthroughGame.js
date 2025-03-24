import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import styled, { keyframes } from 'styled-components';
import { useHabit } from '../context/HabitContext';

// Chess pieces (Unicode characters)
const pieces = {
  pawn: '♟',
  rook: '♜',
  knight: '♞',
  bishop: '♝',
  queen: '♛',
  king: '♚',
};

// Animations
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const starGlow = keyframes`
  0% { opacity: 0.6; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.1); }
  100% { opacity: 0.6; transform: scale(0.8); }
`;

const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
`;

// Theme object for consistent styling
const theme = {
  colors: {
    primary: '#1e2749',
    secondary: '#4a69bd',
    accent: '#6c5ce7',
    success: '#2ecc71',
    warning: '#f1c40f',
    danger: '#e74c3c',
    text: '#ffffff',
    textSecondary: '#b2bec3',
    borderWhite: 'rgba(255, 255, 255, 0.1)',
    darkOverlay: 'rgba(0, 0, 0, 0.2)',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    gradientStart: '#1e2749',
    gradientEnd: '#2e3b73'
  }
};

// Styled Components
const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, ${theme.colors.gradientStart} 0%, ${theme.colors.gradientEnd} 100%);
  z-index: 0;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(114, 137, 218, 0.2) 0%, transparent 70%);
    top: 10%;
    left: 15%;
    animation: ${floatAnimation} 8s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    width: 250px;
    height: 250px;
    background: radial-gradient(circle, rgba(255, 107, 107, 0.15) 0%, transparent 70%);
    bottom: 20%;
    right: 10%;
    animation: ${floatAnimation} 10s ease-in-out infinite;
  }
`;

const Star = styled.div`
  position: absolute;
  width: ${props => props.size || '2px'};
  height: ${props => props.size || '2px'};
  background: white;
  border-radius: 50%;
  animation: ${starGlow} ${props => props.speed || '2s'} ease-in-out infinite;
  top: ${props => props.top || '50%'};
  left: ${props => props.left || '50%'};
  opacity: ${props => props.opacity || '0.8'};
`;

const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  position: relative;
  color: ${theme.colors.text};
  font-family: 'Inter', 'Segoe UI', Roboto, sans-serif;
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
  margin-top: 1rem;
  flex-grow: 1;
`;

const NavItem = styled.li`
  padding: 1rem 1.5rem;
  margin: 0.8rem 0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-weight: 500;
  letter-spacing: 0.3px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(5px);
  }
  
  &.active {
    background: ${theme.colors.secondary};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transform: translateX(5px);
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 3rem;
  margin-left: 20px;
  z-index: 10;
  overflow-y: auto;
  max-height: 100vh;
`;

const GameHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid ${theme.colors.borderWhite};
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    background: linear-gradient(to right, #74ebd5, #ACB6E5);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 800;
    letter-spacing: 0.5px;
  }
  
  p {
    font-size: 1.1rem;
    color: ${theme.colors.textSecondary};
    max-width: 700px;
    margin: 0 auto;
    line-height: 1.6;
  }
`;

const GameContent = styled.div`
  background: ${theme.colors.cardBg};
  border-radius: 16px;
  padding: 2.5rem;
  overflow-y: auto;
  max-height: calc(100vh - 200px);
  max-width: 1200px;
  margin: 0 auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(4px);
  
  h1, h2 {
    color: ${theme.colors.accent};
    margin-bottom: 1.5rem;
  }
  
  h2 {
    font-size: 1.8rem;
    position: relative;
    display: inline-block;
    
    &:after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 0;
      width: 50px;
      height: 3px;
      background: ${theme.colors.accent};
      border-radius: 3px;
    }
  }
  
  p {
    color: ${theme.colors.textSecondary};
    margin-bottom: 2rem;
    line-height: 1.6;
  }
`;

const GameButton = styled.button`
  background: linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.secondary});
  color: white;
  border: none;
  padding: 1.8rem 2.5rem;
  border-radius: 16px;
  margin: 1.5rem;
  width: 85%;
  max-width: 450px;
  cursor: pointer;
  font-size: 1.3rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  text-align: left;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: all 0.4s ease;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.2);
    
    &:before {
      left: 100%;
    }
  }
  
  div {
    font-size: 0.95rem;
    margin-top: 0.8rem;
    opacity: 0.9;
    font-weight: 400;
    line-height: 1.5;
  }
`;

const PointsDisplay = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  h3 {
    font-size: 1.5rem;
    color: white;
    display: flex;
    align-items: center;
    
    &:before {
      content: '✨';
      margin-right: 10px;
      font-size: 1.4rem;
    }
  }
  
  div {
    text-align: right;
    font-weight: 600;
    font-size: 1.1rem;
  }
`;

const ProgressIndicator = styled.div`
  margin: 2rem 0;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.5rem 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.05);

  h3 {
    margin-bottom: 1rem;
    color: white;
    font-size: 1.3rem;
  }

  .progress-bar {
    width: 100%;
    height: 12px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    margin-top: 1rem;
    overflow: hidden;
    box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.2);

    .fill {
      height: 100%;
      background: linear-gradient(to right, ${theme.colors.accent}, #9b59b6);
      width: ${props => props.progress}%;
      transition: width 0.8s ease;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(108, 92, 231, 0.5);
    }
  }
`;

const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin: 2.5rem 0;
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, ${props => props.color || theme.colors.accent}, ${props => {
    if (props.color === '#4CAF50') return '#2ecc71';
    if (props.color === '#2196F3') return '#3498db';
    if (props.color === '#9C27B0') return '#8e44ad';
    return theme.colors.secondary;
  }});
  color: white;
  border: none;
  padding: 1.5rem 2rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  width: 100%;
  transition: all 0.3s ease;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: all 0.4s ease;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    
    &:before {
      left: 100%;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  div {
    font-size: 0.85rem;
    margin-top: 0.8rem;
    font-weight: 400;
    line-height: 1.4;
  }
`;

const LastActionBox = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  border-left: 4px solid ${theme.colors.accent};
  animation: ${pulseAnimation} 2s infinite;
  
  h4 {
    font-size: 1.1rem;
    margin-bottom: 0.8rem;
    color: ${theme.colors.accent};
  }
  
  p {
    margin-bottom: 0;
    font-size: 1rem;
  }
`;

const StageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const StageCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid ${props =>
    props.isCompleted ? 'rgba(46, 213, 115, 0.5)' : props.isCurrent ? theme.colors.accent : 'rgba(255, 255, 255, 0.1)'};
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }

  ${props =>
    props.isCompleted &&
    `
    background: linear-gradient(135deg, rgba(46, 213, 115, 0.1), rgba(39, 174, 96, 0.1));
    &::after {
      content: '✓';
      position: absolute;
      top: 1rem;
      right: 1rem;
      color: rgba(46, 213, 115, 1);
      font-size: 1.8rem;
      font-weight: bold;
    }
  `}
  
  ${props =>
    props.isCurrent &&
    `
    background: linear-gradient(135deg, rgba(108, 92, 231, 0.1), rgba(90, 64, 154, 0.1));
    box-shadow: 0 8px 25px rgba(108, 92, 231, 0.2);
  `}
  
  h3 {
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
    color: ${props => props.isCompleted ? theme.colors.success : props.isCurrent ? theme.colors.accent : 'white'};
  }
  
  h4 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: white;
  }
  
  p {
    margin: 0.7rem 0;
    line-height: 1.5;
  }
  
  .progress-bar {
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    margin-top: 0.5rem;
    overflow: hidden;

    .fill {
      height: 100%;
      transition: width 0.8s ease;
      border-radius: 4px;
    }
  }
`;

const ProgressChart = styled.div`
  margin-top: 3rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    color: ${theme.colors.accent};
    position: relative;
    display: inline-block;
    
    &:after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 0;
      width: 40px;
      height: 3px;
      background: ${theme.colors.accent};
      border-radius: 3px;
    }
  }
`;

const GamesHub = () => {
  const navigate = useNavigate();

  const games = [
    {
      title: 'Chess',
      description: 'Play a game of chess to improve your strategic thinking.',
      path: '/chess',
    },
    {
      title: 'Addiction Recovery',
      description: 'Track your progress and stay motivated on your recovery journey.',
      path: '/addiction-recovery',
    },
    {
      title: "ludo",
      description: "Play a game of ludo with your friends and family.",
      path: "/ludo"
    }
  ];

  return (
    <GameContent>
      <h1>Choose Your Game</h1>
      <p>Select a game to engage with on your journey to self-improvement.</p>
      {games.map((game, index) => (
        <GameButton key={index} onClick={() => navigate(game.path)}>
          {game.title}
          <div>
            {game.description}
          </div>
        </GameButton>
      ))}
    </GameContent>
  );
};

const BreakthroughGame = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { progress, updateProgress, getCategoryProgress, getCategoryHistory, lastAction } = useHabit();
  const [showConfetti, setShowConfetti] = useState(false);
  const [localLastAction, setLocalLastAction] = useState(null);

  const categoryId = new URLSearchParams(location.search).get('category') || 'default';

  useEffect(() => {
    if (lastAction && (!localLastAction || lastAction.timestamp > localLastAction.timestamp)) {
      setLocalLastAction(lastAction);
    }
  }, [lastAction]);

  const handleProgressUpdate = (points, actionType) => {
    updateProgress(categoryId, points, actionType);

    setLocalLastAction({
      type: actionType,
      points,
      timestamp: new Date().toLocaleTimeString(),
      categoryId,
    });

    if (points >= 25) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }

    const currentPoints = getCategoryProgress(categoryId) + points;
    const completedStage = stages.find(
      stage => currentPoints >= stage.points && getCategoryProgress(categoryId) < stage.points
    );

    if (completedStage) {
      alert(`🎉 Congratulations! You've completed ${completedStage.goal} and earned ${completedStage.reward}!`);
    }
  };

  const getMotivationalMessage = () => {
    const currentPoints = getCategoryProgress(categoryId);
    if (currentPoints === 0) return "Ready to start your journey? Every step counts!";
    if (currentPoints < 50) return "Great start! Keep building those healthy habits!";
    if (currentPoints < 100) return "You're making excellent progress! Stay consistent!";
    if (currentPoints < 200) return "You're becoming a master of your habits!";
    return "Incredible dedication! You're an inspiration!";
  };

  const stages = [
    { level: 1, goal: 'First Week', points: 50, reward: 'Self-Care Package' },
    { level: 2, goal: 'One Month Milestone', points: 200, reward: 'Wellness Session' },
    { level: 3, goal: 'Quarterly Achievement', points: 500, reward: 'Personal Experience Gift' },
  ];

  const calculateProgress = () => {
    const currentPoints = getCategoryProgress(categoryId);
    const maxPoints = stages[stages.length - 1].points;
    return Math.min((currentPoints / maxPoints) * 100, 100);
  };

  const getCurrentStage = () => {
    const currentPoints = getCategoryProgress(categoryId);
    return stages.find(stage => currentPoints < stage.points) || stages[stages.length - 1];
  };

  const isStageCompleted = (stage) => {
    const currentPoints = getCategoryProgress(categoryId);
    return currentPoints >= stage.points;
  };

  const isCurrentStage = (stage) => {
    const currentStage = getCurrentStage();
    return currentStage && currentStage.level === stage.level;
  };

  return (
    <DashboardContainer>
      <Background>
        <Star top="15%" left="25%" speed="3s" size="3px" opacity="0.9" />
        <Star top="35%" left="65%" speed="4s" size="4px" opacity="0.8" />
        <Star top="65%" left="15%" speed="3.5s" size="2px" opacity="0.7" />
        <Star top="25%" left="85%" speed="5s" size="3px" opacity="0.9" />
        <Star top="75%" left="35%" speed="2.5s" size="3px" opacity="0.8" />
        <Star top="45%" left="75%" speed="4.5s" size="2px" opacity="0.7" />
        <Star top="85%" left="55%" speed="3.5s" size="4px" opacity="0.9" />
        <Star top="55%" left="45%" speed="5s" size="2px" opacity="0.8" />
      </Background>

      <Sidebar>
        <h2>HabitQuest</h2>
        <NavList>
          <NavItem onClick={() => navigate('/dashboard')}>Dashboard</NavItem>
          <NavItem className="active">Games</NavItem>
          <NavItem onClick={() => navigate('/track')}>Events</NavItem>
          <NavItem onClick={() => navigate('/review')}>Review</NavItem>
        </NavList>
      </Sidebar>

      <MainContent>
        {location.pathname === '/breakthrough-game' ? (
          <GamesHub /> // Render Games Hub
        ) : (
          <>
            <GameHeader>
              <h1>Breakthrough: Your Transformation Journey</h1>
              <p>Level up your life through consistent habits and meaningful achievements.</p>
              <div style={{ marginTop: '1.5rem', color: theme.colors.accent, fontWeight: '600', fontSize: '1.2rem' }}>
                {getMotivationalMessage()}
              </div>
            </GameHeader>

            <GameContent>
              <h2>Your Journey</h2>
              <p>Track your progress and achieve your goals through consistent effort.</p>

              <PointsDisplay>
                <h3>Current Points: {getCategoryProgress(categoryId)}</h3>
                <div>
                  Next Goal: {getCurrentStage()?.goal}
                  <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.5rem' }}>
                    {getCurrentStage()?.points - getCategoryProgress(categoryId)} points needed
                  </div>
                </div>
              </PointsDisplay>

              <ProgressIndicator progress={calculateProgress()}>
                <h3>Overall Progress</h3>
                <div className="progress-bar">
                  <div className="fill" />
                </div>
                <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '1.1rem', fontWeight: '500' }}>
                  {calculateProgress().toFixed(1)}% Complete
                </div>
              </ProgressIndicator>

              <ActionButtons>
                <ActionButton onClick={() => handleProgressUpdate(5, 'Small Win')} color="#4CAF50">
                  Small Win (+5 pts)
                  <div>Quick daily tasks</div>
                </ActionButton>
                <ActionButton onClick={() => handleProgressUpdate(10, 'Daily Goal')} color="#2196F3">
                  Daily Goal (+10 pts)
                  <div>Complete daily target</div>
                </ActionButton>
                <ActionButton onClick={() => handleProgressUpdate(25, 'Major Achievement')} color="#9C27B0">
                  Major Achievement (+25 pts)
                  <div>Significant milestone</div>
                </ActionButton>
              </ActionButtons>

              {localLastAction && (
                <LastActionBox>
                  <h4>Last Action</h4>
                  <p>
                    {localLastAction.type} completed at {localLastAction.timestamp} (+{localLastAction.points}{' '}
                    points)
                  </p>
                </LastActionBox>
              )}

              <StageGrid>
                {stages.map(stage => (
                  <StageCard
                    key={stage.level}
                    isCompleted={isStageCompleted(stage)}
                    isCurrent={isCurrentStage(stage)}
                  >
                    <h3>Level {stage.level}</h3>
                    <h4>{stage.goal}</h4>
                    <p style={{ margin: '1rem 0' }}>Reward: {stage.reward}</p>
                    <p>Required Points: {stage.points}</p>
                    {isStageCompleted(stage) && (
                      <p style={{ color: '#2ecc71', marginTop: '1rem', fontWeight: '600' }}>✨ Stage Complete!</p>
                    )}
                    {isCurrentStage(stage) && (
                      <div style={{ marginTop: '1rem' }}>
                        <div className="progress-bar">
                          <div
                            className="fill"
                            style={{
                              width: `${(getCategoryProgress(categoryId) / stage.points) * 100}%`,
                              background: 'linear-gradient(to right, #6c5ce7, #a29bfe)',
                            }}
                          />
                        </div>
                        <p style={{ fontSize: '0.9rem', marginTop: '0.8rem', textAlign: 'center' }}>
                          {stage.points - getCategoryProgress(categoryId)} points to complete
                        </p>
                      </div>
                    )}
                  </StageCard>
                ))}
              </StageGrid>

              <ProgressChart>
                <h3>Progress History</h3>
                {getCategoryHistory(categoryId).length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={getCategoryHistory(categoryId)}>
                      <XAxis dataKey="date" stroke="#b2bec3" />
                      <YAxis stroke="#b2bec3" />
                      <Tooltip 
                        contentStyle={{ 
                          background: 'rgba(30, 39, 73, 0.9)', 
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px'
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="points" 
                        stroke={theme.colors.accent} 
                        strokeWidth={3}
                        dot={{ stroke: theme.colors.accent, strokeWidth: 2, r: 4 }}
                        activeDot={{ stroke: theme.colors.accent, strokeWidth: 3, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p style={{ textAlign: 'center', padding: '3rem', background: 'rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
                    No progress history yet. Start adding achievements!
                  </p>
                )}
              </ProgressChart>
            </GameContent>
          </>
        )}
      </MainContent>
    </DashboardContainer>
  );
};

export default BreakthroughGame;