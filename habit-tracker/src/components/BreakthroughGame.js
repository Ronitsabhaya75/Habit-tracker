import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import styled, { keyframes, css } from 'styled-components';
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

// Theme from Original Dashboard (aligned with updated Track)
const dashboardTheme = {
  backgroundGradient: 'linear-gradient(to bottom, #0B1A2C, #152642)',
  accentGlow: '#00FFF5',
  accentGradientStart: '#00FFC6',
  accentGradientEnd: '#4A90E2',
  textPrimary: '#B8FFF9',
  cardBackground: 'rgba(21, 38, 66, 0.8)',
  glassOverlay: 'rgba(11, 26, 44, 0.9)',
  borderGlow: 'rgba(0, 255, 198, 0.3)',
  buttonGradient: 'linear-gradient(90deg, #00FFC6 0%, #4A90E2 100%)',
};

// Animations from Original Dashboard (aligned with updated Track)
const starFloat = keyframes`
  0% { opacity: 0; transform: translateY(0px) translateX(0px); }
  50% { opacity: 1; }
  100% { opacity: 0; transform: translateY(-20px) translateX(10px); }
`;

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

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

// Styled Components Adapted from Original Dashboard
const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${dashboardTheme.backgroundGradient};
  overflow: hidden;
  z-index: 0;
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
  box-shadow: 0 0 ${props => props.glow || 1}px ${props => props.glow || 1}px ${dashboardTheme.textPrimary};
`;

const Sidebar = styled.div`
  width: 250px;
  padding: 2rem;
  background: ${dashboardTheme.glassOverlay};
  border-right: 1px solid ${dashboardTheme.borderGlow};
  backdrop-filter: blur(10px);
  z-index: 1000;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  box-shadow: 5px 0 15px rgba(0, 0, 0, 0.1);
  
  h2 {
    color: ${dashboardTheme.accentGlow};
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
  color: ${dashboardTheme.textPrimary};
  
  &:hover {
    background: rgba(0, 255, 198, 0.1);
    transform: translateX(5px);
  }
  
  &.active {
    background: linear-gradient(90deg, rgba(0, 255, 198, 0.3), rgba(74, 144, 226, 0.3));
    border-left: 3px solid ${dashboardTheme.accentGradientStart};
    color: ${dashboardTheme.accentGlow};
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 3rem;
  margin-left: 250px;
  z-index: 10;
  overflow-y: auto;
  max-height: 100vh;
`;

const GameHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    font-size: 2.5rem;
    color: ${dashboardTheme.accentGlow};
    letter-spacing: 2px;
    text-shadow: 0 0 10px rgba(0, 255, 245, 0.5);
  }
  
  p {
    font-size: 1.1rem;
    color: ${dashboardTheme.textPrimary};
    opacity: 0.8;
    max-width: 700px;
    margin: 1rem auto;
    line-height: 1.6;
  }
`;

const GameContent = styled.div`
  background: ${dashboardTheme.cardBackground};
  border-radius: 16px;
  padding: 2.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid ${dashboardTheme.borderGlow};
  max-width: 1200px;
  margin: 0 auto;
  color: ${dashboardTheme.textPrimary};
  box-shadow: 0 0 15px rgba(0, 255, 198, 0.2);
  animation: ${css`${fadeIn} 0.5s ease-out`};
  
  h2 {
    font-size: 1.8rem;
    color: ${dashboardTheme.accentGlow};
    margin-bottom: 1.5rem;
    text-shadow: 0 0 5px rgba(0, 255, 245, 0.5);
  }
`;

const GameButton = styled.button`
  background: ${dashboardTheme.buttonGradient};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1.8rem 2.5rem;
  margin: 1.5rem;
  width: 85%;
  max-width: 450px;
  cursor: pointer;
  font-size: 1.3rem;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 255, 198, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 255, 198, 0.5);
  }
  
  div {
    font-size: 0.95rem;
    margin-top: 0.8rem;
    opacity: 0.9;
    font-weight: normal;
  }
`;

const PointsDisplay = styled.div`
  background: rgba(21, 38, 66, 0.6);
  border-radius: 20px;
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${dashboardTheme.borderGlow};
  box-shadow: 0 0 15px rgba(0, 255, 198, 0.1);
  
  h3 {
    font-size: 1.5rem;
    color: ${dashboardTheme.textPrimary};
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
    font-weight: bold;
    font-size: 1.1rem;
    color: ${dashboardTheme.accentGradientStart};
  }
`;

const ProgressIndicator = styled.div`
  margin: 2rem 0;
  background: rgba(21, 38, 66, 0.6);
  border-radius: 20px;
  padding: 1.5rem 2rem;
  border: 1px solid ${dashboardTheme.borderGlow};
  
  h3 {
    margin-bottom: 1rem;
    color: ${dashboardTheme.accentGlow};
    font-size: 1.3rem;
  }
  
  .progress-bar {
    width: 100%;
    height: 14px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 7px;
    overflow: hidden;
  }
  
  .fill {
    height: 100%;
    background: ${dashboardTheme.buttonGradient};
    width: ${props => props.progress}%;
    transition: width 1s ease-in-out;
    border-radius: 7px;
  }
`;

const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin: 2.5rem 0;
`;

const ActionButton = styled.button`
  background: ${props => props.color || dashboardTheme.buttonGradient};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1.5rem 2rem;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 255, 198, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 255, 198, 0.5);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  div {
    font-size: 0.85rem;
    margin-top: 0.8rem;
    font-weight: normal;
  }
`;

const LastActionBox = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  background: rgba(21, 38, 66, 0.6);
  border-radius: 12px;
  border: 1px solid ${dashboardTheme.borderGlow};
  animation: ${pulse} 2s infinite ease-in-out;
  
  h4 {
    font-size: 1.1rem;
    margin-bottom: 0.8rem;
    color: ${dashboardTheme.accentGlow};
  }
  
  p {
    margin-bottom: 0;
    font-size: 1rem;
    color: ${dashboardTheme.textPrimary};
  }
`;

const StageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const StageCard = styled.div`
  background: ${props => 
    props.isCompleted ? 'rgba(0, 255, 245, 0.2)' : 
    props.isCurrent ? 'rgba(0, 255, 198, 0.3)' : 
    'rgba(21, 38, 66, 0.6)'};
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid ${props => 
    props.isCompleted ? 'rgba(0, 255, 245, 0.6)' : 
    props.isCurrent ? 'rgba(0, 255, 198, 0.6)' : 
    dashboardTheme.borderGlow};
  transition: all 0.3s ease;
  box-shadow: ${props => 
    props.isCompleted || props.isCurrent ? '0 0 10px rgba(0, 255, 198, 0.3)' : 'none'};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 255, 198, 0.2);
  }
  
  h3 {
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
    color: ${props => props.isCompleted ? dashboardTheme.accentGlow : dashboardTheme.textPrimary};
  }
  
  h4 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: ${dashboardTheme.accentGlow};
  }
  
  p {
    margin: 0.7rem 0;
    line-height: 1.5;
    color: ${dashboardTheme.textPrimary};
  }
  
  .progress-bar {
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    margin-top: 0.5rem;
    overflow: hidden;
  }
  
  .fill {
    height: 100%;
    background: ${dashboardTheme.buttonGradient};
    transition: width 0.8s ease;
    border-radius: 4px;
  }
`;

const ProgressChart = styled.div`
  margin-top: 3rem;
  background: ${dashboardTheme.cardBackground};
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid ${dashboardTheme.borderGlow};
  box-shadow: 0 0 15px rgba(0, 255, 198, 0.2);
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    color: ${dashboardTheme.accentGlow};
    text-shadow: 0 0 5px rgba(0, 255, 245, 0.5);
  }
`;

// GamesHub Component
const GamesHub = () => {
  const navigate = useNavigate();

  const games = [
    { title: 'Chess', description: 'Play a game of chess to improve your strategic thinking.', path: '/chess' },
    { title: 'Addiction Recovery', description: 'Track your progress and stay motivated on your recovery journey.', path: '/addiction-recovery' },
    { title: 'Word Scrambler', description: 'Unscramble the word and find the XP! Unjumble your mind with this fun game.', path: '/word-scrambler' },
    { title: 'Pacman', description: 'Navigate through a maze and collect points while avoiding ghosts.', path: '/pacman' },
    { title: 'HabitQuizGame', description: 'Test your habit knowledge through 3 exciting quiz rounds with XP rewards.', path: '/habit-quiz' },
    { title: 'HabitChallengeCenter', description: 'Take on hourly and weekly habit challenges to earn XP and build consistency.', path: '/habit-challenge' }
  ];

  return (
    <GameContent>
      <h1>Choose Your Game</h1>
      <p>Select a game to engage with on your journey to self-improvement.</p>
      {games.map((game, index) => (
        <GameButton key={index} onClick={() => navigate(game.path)}>
          {game.title}
          <div>{game.description}</div>
        </GameButton>
      ))}
    </GameContent>
  );
};

// Main BreakthroughGame Component
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
    if (currentPoints === 0) return "Ready to start your cosmic journey? Every step counts!";
    if (currentPoints < 50) return "Great launch! Keep orbiting toward your goals!";
    if (currentPoints < 100) return "You're in hyperspace now! Stay on course!";
    if (currentPoints < 200) return "You're a galactic habit master!";
    return "Stellar dedication! You're a cosmic inspiration!";
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

  const isStageCompleted = (stage) => getCategoryProgress(categoryId) >= stage.points;
  const isCurrentStage = (stage) => getCurrentStage()?.level === stage.level;

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
    <div>
      <Background>
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
      </Background>
      <Sidebar>
        <h2>HabitQuest</h2>
        <NavList>
          <NavItem onClick={() => navigate('/dashboard')}>👾 Dashboard</NavItem>
          <NavItem className="active">🎮 Mini Games</NavItem>
          <NavItem onClick={() => navigate('/track')}>📅 Calendar Tracker</NavItem>
          <NavItem onClick={() => navigate('/new-habit')}>✨ Habit Creation</NavItem>
          <NavItem onClick={() => navigate('/shop')}>🛒 Shop</NavItem>
          <NavItem onClick={() => navigate('/review')}>📊 Review</NavItem>
        </NavList>
      </Sidebar>
      <MainContent>
        {location.pathname === '/breakthrough-game' ? (
          <GamesHub />
        ) : (
          <>
            <GameHeader>
              <h1>Breakthrough: Cosmic Journey</h1>
              <p>Level up your life through interstellar habits and achievements.</p>
              <div style={{ marginTop: '1.5rem', color: dashboardTheme.accentGlow, fontWeight: '600', fontSize: '1.2rem' }}>
                {getMotivationalMessage()}
              </div>
            </GameHeader>
            <GameContent>
              <h2>Your Galactic Progress</h2>
              <p>Track your cosmic journey and conquer your goals.</p>
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
                    {localLastAction.type} completed at {localLastAction.timestamp} (+{localLastAction.points} points)
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
                    <p>Reward: {stage.reward}</p>
                    <p>Required Points: {stage.points}</p>
                    {isStageCompleted(stage) && (
                      <p style={{ color: dashboardTheme.accentGlow, marginTop: '1rem', fontWeight: '600' }}>✨ Stage Complete!</p>
                    )}
                    {isCurrentStage(stage) && (
                      <div style={{ marginTop: '1rem' }}>
                        <div className="progress-bar">
                          <div
                            className="fill"
                            style={{ width: `${(getCategoryProgress(categoryId) / stage.points) * 100}%` }}
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
                      <XAxis dataKey="date" stroke={dashboardTheme.textPrimary} />
                      <YAxis stroke={dashboardTheme.textPrimary} />
                      <Tooltip 
                        contentStyle={{ 
                          background: dashboardTheme.glassOverlay, 
                          border: `1px solid ${dashboardTheme.borderGlow}`,
                          borderRadius: '8px',
                          color: dashboardTheme.textPrimary
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="points" 
                        stroke={dashboardTheme.accentGlow} 
                        strokeWidth={3}
                        dot={{ stroke: dashboardTheme.accentGlow, strokeWidth: 2, r: 4 }}
                        activeDot={{ stroke: dashboardTheme.accentGlow, strokeWidth: 3, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px' }}>
                    No progress history yet. Start adding achievements!
                  </p>
                )}
              </ProgressChart>
            </GameContent>
          </>
        )}
      </MainContent>
    </div>
  );
};

export default BreakthroughGame;