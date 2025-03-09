import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import styled, { keyframes } from 'styled-components';
import { theme } from '../theme';
import { useHabit } from '../context/HabitContext';

// Keyframes for animations
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

// Styled Components
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
  background: linear-gradient(90deg, rgba(100, 220, 255, 0) 0%, rgba(100, 220, 255, 0.7) 100%);
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
  margin-left: 250px;
  z-index: 10;
`;

const GameHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  p {
    opacity: 0.8;
    max-width: 600px;
    margin: 0 auto;
  }
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
  border: 1px solid ${props => props.isCompleted ? 'rgba(46, 213, 115, 0.5)' : props.isCurrent ? theme.colors.accent : 'rgba(255, 255, 255, 0.1)'};
  position: relative;
  overflow: hidden;

  ${props => props.isCompleted && `
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

  h3 {
    margin: 0;
  }
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

  useEffect(() => {
    if (lastAction && (!localLastAction || lastAction.timestamp > localLastAction.timestamp)) {
      setLocalLastAction(lastAction);
    }
  }, [lastAction]);

  const handleProgressUpdate = (points, actionType) => {
    updateProgress('default', points);
    
    setLocalLastAction({
      type: actionType,
      points: points,
      timestamp: new Date().toLocaleTimeString(),
      categoryId: 'default'
    });
    
    if (points >= 25) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }

    const currentPoints = getCategoryProgress('default') + points;
    const completedStage = stages.find(
      stage => currentPoints >= stage.points && getCategoryProgress('default') < stage.points
    );
    
    if (completedStage) {
      alert(`🎉 Congratulations! You've completed ${completedStage.goal} and earned ${completedStage.reward}!`);
    }
  };

  const getMotivationalMessage = () => {
    const currentPoints = getCategoryProgress('default');
    if (currentPoints === 0) return "Ready to start your journey? Every step counts!";
    if (currentPoints < 50) return "Great start! Keep building those healthy habits!";
    if (currentPoints < 100) return "You're making excellent progress! Stay consistent!";
    if (currentPoints < 200) return "You're becoming a master of your habits!";
    return "Incredible dedication! You're an inspiration!";
  };

  const stages = [
    { level: 1, goal: 'First Week', points: 50, reward: 'Self-Care Package' },
    { level: 2, goal: 'One Month Milestone', points: 200, reward: 'Wellness Session' },
    { level: 3, goal: 'Quarterly Achievement', points: 500, reward: 'Personal Experience Gift' }
  ];

  const calculateProgress = () => {
    const currentPoints = getCategoryProgress('default');
    const maxPoints = stages[stages.length - 1].points;
    return Math.min((currentPoints / maxPoints) * 100, 100);
  };

  const getCurrentStage = () => {
    const currentPoints = getCategoryProgress('default');
    return stages.find(stage => currentPoints < stage.points) || stages[stages.length - 1];
  };

  const isStageCompleted = (stage) => {
    const currentPoints = getCategoryProgress('default');
    return currentPoints >= stage.points;
  };

  const isCurrentStage = (stage) => {
    const currentStage = getCurrentStage();
    return currentStage && currentStage.level === stage.level;
  };

  return (
    <DashboardContainer>
      <Background>
        <GradientOverlay />
        <Scenery />
        <Star size="20px" style={{ top: '10%', left: '10%' }} duration="4s" delay="0.5s" />
        <Star size="15px" style={{ top: '25%', left: '25%' }} duration="3s" delay="1s" />
        <Star size="25px" style={{ top: '15%', right: '30%' }} duration="5s" delay="0.2s" />
        <Rocket><RocketTrail /></Rocket>
        <ProgressCircle />
        <XPOrb style={{ top: '65%', left: '15%' }} duration="6s" delay="0.2s" />
        <XPOrb style={{ top: '30%', right: '25%' }} duration="5s" delay="1.2s" />
        <XPOrb style={{ top: '75%', right: '30%' }} duration="7s" delay="0.5s" />
        <XPOrb style={{ top: '45%', left: '60%' }} duration="5.5s" delay="1.5s" />
      </Background>

      <Sidebar>
        <h2>HabitQuest</h2>
        <NavList>
          <NavItem onClick={() => navigate('/dashboard')}>Dashboard</NavItem>
          <NavItem className="active">Games</NavItem>
          <NavItem onClick={() => navigate('/track')}>Events</NavItem> {/* New Track Button */}
          <NavItem onClick={() => navigate('/review')}> Dashboard Review</NavItem>
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
            <h3>Current Points: {getCategoryProgress('default')}</h3>
            <div>
              Next Goal: {getCurrentStage()?.goal}
              <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.5rem' }}>
                {getCurrentStage()?.points - getCategoryProgress('default')} points needed
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
            <ActionButton 
              onClick={() => handleProgressUpdate(5, 'Small Win')}
              color="#4CAF50"
            >
              Small Win (+5 pts)
              <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                Quick daily tasks
              </div>
            </ActionButton>
            <ActionButton 
              onClick={() => handleProgressUpdate(10, 'Daily Goal')}
              color="#2196F3"
            >
              Daily Goal (+10 pts)
              <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                Complete daily target
              </div>
            </ActionButton>
            <ActionButton 
              onClick={() => handleProgressUpdate(25, 'Major Achievement')}
              color="#9C27B0"
            >
              Major Achievement (+25 pts)
              <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                Significant milestone
              </div>
            </ActionButton>
          </ActionButtons>

          {localLastAction && (
            <LastActionBox>
              <h4>Last Action</h4>
              <p>{localLastAction.type} completed at {localLastAction.timestamp} (+{localLastAction.points} points)</p>
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
                  <p style={{ color: '#2ecc71', marginTop: '1rem' }}>
                    ✨ Stage Complete!
                  </p>
                )}
                {isCurrentStage(stage) && (
                  <div style={{ marginTop: '1rem' }}>
                    <div className="progress-bar">
                      <div 
                        className="fill" 
                        style={{ 
                          width: `${(getCategoryProgress('default') / stage.points) * 100}%`,
                          background: theme.colors.accent 
                        }} 
                      />
                    </div>
                    <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                      {stage.points - getCategoryProgress('default')} points to complete
                    </p>
                  </div>
                )}
              </StageCard>
            ))}
          </StageGrid>

          <ProgressChart>
            <h3>Progress History</h3>
            {getCategoryHistory('default').length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getCategoryHistory('default')}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="points" 
                    stroke={theme.colors.accent}
                    strokeWidth={2}
                  />
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