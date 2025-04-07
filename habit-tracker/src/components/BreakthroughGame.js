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

// Space Theme from Track
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

// Animations from Track
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

const pulseGlow = keyframes`
  0% { transform: scale(1); opacity: 0.6; box-shadow: 0 0 10px ${spaceTheme.accentGlow}; }
  50% { transform: scale(1.05); opacity: 0.8; box-shadow: 0 0 20px ${spaceTheme.accentGlow}, 0 0 30px ${spaceTheme.accentGlow}; }
  100% { transform: scale(1); opacity: 0.6; box-shadow: 0 0 10px ${spaceTheme.accentGlow}; }
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

// Styled Components Adapted from Track
const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${spaceTheme.deepSpaceGradient};
  overflow: hidden;
  z-index: 0;
`;

const GradientOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 50%, rgba(50, 255, 192, 0.1) 0%, transparent 70%),
              radial-gradient(circle at 70% 70%, rgba(0, 249, 255, 0.1) 0%, transparent 60%);
  z-index: 1;
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

const Sidebar = styled.div`
  width: 250px;
  padding: 2rem;
  background: rgba(14, 26, 64, 0.8);
  color: ${spaceTheme.textPrimary};
  border-right: 1px solid rgba(50, 255, 192, 0.3);
  backdrop-filter: blur(8px);
  z-index: 1000;
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
    color: ${spaceTheme.accentGlow};
    font-family: 'Orbitron', sans-serif;
    letter-spacing: 2px;
    text-shadow: 0 0 10px ${spaceTheme.accentGlow}, 0 0 20px ${spaceTheme.accentGlow};
    animation: ${glowPulse} 3s infinite ease-in-out;
  }
  
  p {
    font-size: 1.1rem;
    color: ${spaceTheme.textPrimary};
    opacity: 0.8;
    max-width: 700px;
    margin: 1rem auto;
    line-height: 1.6;
  }
`;

const GameContent = styled.div`
  background: rgba(14, 26, 64, 0.8);
  border-radius: 16px;
  padding: 2.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(50, 255, 192, 0.3);
  max-width: 1200px;
  margin: 0 auto;
  color: ${spaceTheme.textPrimary};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  animation: ${css`${warping} 0.5s ease-out`};
  
  h2 {
    font-size: 1.8rem;
    color: ${spaceTheme.accentGlow};
    font-family: 'Orbitron', sans-serif;
    margin-bottom: 1.5rem;
    text-shadow: 0 0 5px ${spaceTheme.accentGlow};
  }
`;

const GameButton = styled.button`
  background: ${spaceTheme.actionButton};
  color: ${spaceTheme.deepSpace};
  border: none;
  border-radius: 8px;
  padding: 1.8rem 2.5rem;
  margin: 1.5rem;
  width: 85%;
  max-width: 450px;
  cursor: pointer;
  font-size: 1.3rem;
  font-weight: bold;
  font-family: 'Orbitron', sans-serif;
  transition: all 0.3s;
  box-shadow: 0 0 10px rgba(0, 249, 255, 0.3);
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: ${spaceTheme.accentGlow};
    transform: translateY(-2px);
    box-shadow: 0 0 15px rgba(50, 255, 192, 0.5);
  }
  
  div {
    font-size: 0.95rem;
    margin-top: 0.8rem;
    opacity: 0.9;
    font-weight: normal;
  }
`;

const PointsDisplay = styled.div`
  background: rgba(14, 26, 64, 0.6);
  border-radius: 20px;
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(50, 255, 192, 0.3);
  box-shadow: 0 0 15px rgba(50, 255, 192, 0.1);
  
  h3 {
    font-size: 1.5rem;
    color: ${spaceTheme.textPrimary};
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
    color: ${spaceTheme.accentGold};
  }
`;

const ProgressIndicator = styled.div`
  margin: 2rem 0;
  background: rgba(14, 26, 64, 0.6);
  border-radius: 20px;
  padding: 1.5rem 2rem;
  border: 1px solid rgba(50, 255, 192, 0.3);
  
  h3 {
    margin-bottom: 1rem;
    color: ${spaceTheme.accentGlow};
    font-size: 1.3rem;
    font-family: 'Orbitron', sans-serif;
  }
  
  .progress-bar {
    width: 100%;
    height: 14px;
    background: rgba(10, 20, 50, 0.5);
    border-radius: 7px;
    overflow: hidden;
    border: 1px solid rgba(50, 255, 192, 0.3);
  }
  
  .fill {
    height: 100%;
    background: linear-gradient(90deg, ${spaceTheme.accentGlow} 0%, ${spaceTheme.actionButton} 100%);
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
  background: ${props => props.color || spaceTheme.actionButton};
  color: ${spaceTheme.deepSpace};
  border: none;
  border-radius: 8px;
  padding: 1.5rem 2rem;
  cursor: pointer;
  font-weight: bold;
  font-family: 'Orbitron', sans-serif;
  transition: all 0.3s;
  box-shadow: 0 0 10px rgba(0, 249, 255, 0.3);
  
  &:hover {
    background: ${spaceTheme.accentGlow};
    transform: translateY(-2px);
    box-shadow: 0 0 15px rgba(50, 255, 192, 0.5);
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
  background: rgba(28, 42, 74, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(50, 255, 192, 0.3);
  animation: ${pulseGlow} 4s infinite ease-in-out;
  
  h4 {
    font-size: 1.1rem;
    margin-bottom: 0.8rem;
    color: ${spaceTheme.accentGlow};
  }
  
  p {
    margin-bottom: 0;
    font-size: 1rem;
    color: ${spaceTheme.textPrimary};
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
    props.isCompleted ? 'rgba(50, 255, 192, 0.2)' : 
    props.isCurrent ? 'rgba(0, 249, 255, 0.2)' : 
    'rgba(28, 42, 74, 0.4)'};
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid ${props => 
    props.isCompleted ? 'rgba(50, 255, 192, 0.6)' : 
    props.isCurrent ? 'rgba(0, 249, 255, 0.6)' : 
    'rgba(50, 255, 192, 0.2)'};
  transition: all 0.3s ease;
  box-shadow: ${props => 
    props.isCompleted || props.isCurrent ? '0 0 10px rgba(50, 255, 192, 0.3)' : 'none'};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  h3 {
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
    color: ${props => props.isCompleted ? spaceTheme.accentGlow : spaceTheme.textPrimary};
  }
  
  h4 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: ${spaceTheme.accentGlow};
  }
  
  p {
    margin: 0.7rem 0;
    line-height: 1.5;
    color: ${spaceTheme.textPrimary};
  }
  
  .progress-bar {
    width: 100%;
    height: 8px;
    background: rgba(10, 20, 50, 0.5);
    border-radius: 4px;
    margin-top: 0.5rem;
    overflow: hidden;
  }
  
  .fill {
    height: 100%;
    background: linear-gradient(90deg, ${spaceTheme.accentGlow} 0%, ${spaceTheme.actionButton} 100%);
    transition: width 0.8s ease;
    border-radius: 4px;
  }
`;

const ProgressChart = styled.div`
  margin-top: 3rem;
  background: rgba(14, 26, 64, 0.8);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(50, 255, 192, 0.3);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    color: ${spaceTheme.accentGlow};
    font-family: 'Orbitron', sans-serif;
    text-shadow: 0 0 5px ${spaceTheme.accentGlow};
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

  return (
    <div>
      <Background>
        <GradientOverlay />
        <Star size="20px" style={{ top: '10%', left: '10%' }} duration="4s" delay="0.5s" color="rgba(255, 223, 108, 0.9)" />
        <Star size="15px" style={{ top: '25%', left: '25%' }} duration="3s" delay="1s" color="rgba(50, 255, 192, 0.9)" />
        <Star size="25px" style={{ top: '15%', right: '30%' }} duration="5s" delay="0.2s" color="rgba(0, 249, 255, 0.9)" />
      </Background>
      <Sidebar>
        <h2>HabitQuest</h2>
        <NavList>
          <NavItem onClick={() => navigate('/dashboard')}>👾 Dashboard</NavItem>
          <NavItem className="active">🎮 Mini Games</NavItem>
          <NavItem onClick={() => navigate('/track')}>📅 Calendar Tracker</NavItem>
          <NavItem onClick={() => navigate('/NewHabit')}>✨ Habit Creation</NavItem>
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
              <div style={{ marginTop: '1.5rem', color: spaceTheme.accentGlow, fontWeight: '600', fontSize: '1.2rem' }}>
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
                      <p style={{ color: spaceTheme.accentGlow, marginTop: '1rem', fontWeight: '600' }}>✨ Stage Complete!</p>
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
                      <XAxis dataKey="date" stroke={spaceTheme.textPrimary} />
                      <YAxis stroke={spaceTheme.textPrimary} />
                      <Tooltip 
                        contentStyle={{ 
                          background: 'rgba(14, 26, 64, 0.9)', 
                          border: `1px solid ${spaceTheme.accentGlow}`,
                          borderRadius: '8px',
                          color: spaceTheme.textPrimary
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="points" 
                        stroke={spaceTheme.accentGlow} 
                        strokeWidth={3}
                        dot={{ stroke: spaceTheme.accentGlow, strokeWidth: 2, r: 4 }}
                        activeDot={{ stroke: spaceTheme.accentGlow, strokeWidth: 3, r: 6 }}
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
    </div>
  );
};

export default BreakthroughGame;