import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import styled, { keyframes } from 'styled-components';
import { theme } from '../theme'; // Assuming you have a theme file
import { useHabit } from '../context/HabitContext';

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

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1e2749 0%, #2e3b73 100%);
  z-index: 0;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(114, 137, 218, 0.3) 0%, transparent 70%);
    top: 10%;
    left: 15%;
    animation: ${floatAnimation} 6s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    width: 150px;
    height: 150px;
    background: radial-gradient(circle, rgba(255, 107, 107, 0.2) 0%, transparent 70%);
    bottom: 20%;
    right: 10%;
    animation: ${floatAnimation} 8s ease-in-out infinite;
  }
`;

const Star = styled.div`
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  animation: ${starGlow} ${props => props.speed || '2s'} ease-in-out infinite;
  top: ${props => props.top || '50%'};
  left: ${props => props.left || '50%'};
`;

const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  position: relative;
  color: ${theme.colors.text};
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
  margin-left: 20px;
  z-index: 10;
`;

const GameHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const GameContent = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
  overflow-y: auto;
  max-height: 80vh;
  max-width: 1200px;
  margin: 0 auto;
`;

const StageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const StageCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid ${props =>
    props.isCompleted ? 'rgba(46, 213, 115, 0.5)' : props.isCurrent ? theme.colors.accent : 'rgba(255, 255, 255, 0.1)'};
  position: relative;
  overflow: hidden;

  ${props =>
    props.isCompleted &&
    `
    &::after {
      content: '✓';
      position: absolute;
      top: 1rem;
      right: 1rem;
      color: rgba(46, 213, 115, 1);
      font-size: 1.5rem;
    }
  `}
`;

const ActionButton = styled.button`
  background: ${props => props.color || theme.colors.accent};
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  width: 100%;
  margin-top: 1rem;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ProgressChart = styled.div`
  margin-top: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
`;

const PointsDisplay = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProgressIndicator = styled.div`
  margin: 1rem 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;

  .progress-bar {
    width: 100%;
    height: 10px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    margin-top: 0.5rem;
    overflow: hidden;

    .fill {
      height: 100%;
      background: ${theme.colors.accent};
      width: ${props => props.progress}%;
      transition: width 0.3s ease;
    }
  }
`;

const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1rem;
`;

const LastActionBox = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
`;

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
        <Star top="20%" left="30%" speed="2s" />
        <Star top="40%" left="60%" speed="3s" />
        <Star top="70%" left="20%" speed="2.5s" />
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
        <GameHeader>
          <h1>Breakthrough: Your Transformation Journey</h1>
          <p>Level up your life through consistent habits and meaningful achievements.</p>
          <div style={{ marginTop: '1rem', color: theme.colors.accent }}>
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
            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
              {calculateProgress().toFixed(1)}% Complete
            </div>
          </ProgressIndicator>

          <ActionButtons>
            <ActionButton onClick={() => handleProgressUpdate(5, 'Small Win')} color="#4CAF50">
              Small Win (+5 pts)
              <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Quick daily tasks</div>
            </ActionButton>
            <ActionButton onClick={() => handleProgressUpdate(10, 'Daily Goal')} color="#2196F3">
              Daily Goal (+10 pts)
              <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Complete daily target</div>
            </ActionButton>
            <ActionButton onClick={() => handleProgressUpdate(25, 'Major Achievement')} color="#9C27B0">
              Major Achievement (+25 pts)
              <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Significant milestone</div>
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
                  <p style={{ color: '#2ecc71', marginTop: '1rem' }}>✨ Stage Complete!</p>
                )}
                {isCurrentStage(stage) && (
                  <div style={{ marginTop: '1rem' }}>
                    <div className="progress-bar">
                      <div
                        className="fill"
                        style={{
                          width: `${(getCategoryProgress(categoryId) / stage.points) * 100}%`,
                          background: theme.colors.accent,
                        }}
                      />
                    </div>
                    <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
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
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="points" stroke={theme.colors.accent} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ textAlign: 'center', padding: '2rem' }}>
                No progress history yet. Start adding achievements!
              </p>
            )}
          </ProgressChart>
        </GameContent>
      </MainContent>
    </DashboardContainer>
  );
};

export default BreakthroughGame;