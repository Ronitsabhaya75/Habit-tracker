import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';
import { theme } from '../theme';
import { useHabit } from '../context/HabitContext';

// Placeholder for AddictionRecoveryGame component
const AddictionRecoveryGame = () => {
  // Define handleMilestone function at the top to avoid hoisting issues
  const handleMilestone = () => {
    console.log('Milestone achieved!');
    // Add your milestone logic here
  };

  return (
    <div>
      <h2>Addiction Recovery Game</h2>
      <button onClick={handleMilestone}>Achieve Milestone</button>
    </div>
  );
};

// Predefined Habit Categories
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

// Styled Components
const GameContainer = styled.div`
  background: ${theme.colors.background};
  color: ${theme.colors.text};
  min-height: 100vh;
  padding: 2rem;
  position: relative;
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

const GameGrid = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const CategoryList = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  height: fit-content;
`;

const CategoryItem = styled.div`
  cursor: pointer;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 1rem;
  background: ${props => props.active ? theme.colors.accent : 'transparent'};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? theme.colors.accent : 'rgba(255, 255, 255, 0.1)'};
  }

  span {
    font-size: 1.5rem;
  }
`;

const GameContent = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
  overflow-y: auto;
  max-height: 80vh;
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
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [localLastAction, setLocalLastAction] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryId = params.get('category');
    
    if (categoryId && HABIT_CATEGORIES.find(cat => cat.id === categoryId)) {
      setSelectedCategory(HABIT_CATEGORIES.find(cat => cat.id === categoryId));
    } else if (HABIT_CATEGORIES.length > 0) {
      setSelectedCategory(HABIT_CATEGORIES[0]);
      navigate(`/breakthrough-game?category=${HABIT_CATEGORIES[0].id}`);
    }
  }, [location, navigate]);

  useEffect(() => {
    if (lastAction && (!localLastAction || lastAction.timestamp > localLastAction.timestamp)) {
      setLocalLastAction(lastAction);
    }
  }, [lastAction]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    navigate(`/breakthrough-game?category=${category.id}`);
  };

  const calculateProgress = (categoryId) => {
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

  const isStageCompleted = (stage, categoryId) => {
    const currentPoints = getCategoryProgress(categoryId);
    return currentPoints >= stage.points;
  };

  const isCurrentStage = (stage, categoryId) => {
    const currentStage = getCurrentStage(categoryId);
    return currentStage && currentStage.level === stage.level;
  };

  const handleProgressUpdate = (points, actionType) => {
    if (!selectedCategory) return;
    
    updateProgress(selectedCategory.id, points);
    
    setLocalLastAction({
      type: actionType,
      points: points,
      timestamp: new Date().toLocaleTimeString(),
      categoryId: selectedCategory.id
    });
    
    if (points >= 25) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }

    const currentPoints = getCategoryProgress(selectedCategory.id) + points;
    const completedStage = selectedCategory.stages.find(
      stage => currentPoints >= stage.points && getCategoryProgress(selectedCategory.id) < stage.points
    );
    
    if (completedStage) {
      alert(`🎉 Congratulations! You've completed ${completedStage.goal} and earned ${completedStage.reward}!`);
    }
  };

  const getMotivationalMessage = () => {
    const currentPoints = getCategoryProgress(selectedCategory?.id || '');
    if (currentPoints === 0) return "Ready to start your journey? Every step counts!";
    if (currentPoints < 50) return "Great start! Keep building those healthy habits!";
    if (currentPoints < 100) return "You're making excellent progress! Stay consistent!";
    if (currentPoints < 200) return "You're becoming a master of your habits!";
    return "Incredible dedication! You're an inspiration!";
  };

  const renderGameContent = () => {
    if (!selectedCategory) {
      return (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>Select a Category</h2>
          <p>Choose a habit category from the left to begin your transformation journey.</p>
        </div>
      );
    }

    if (selectedCategory.id === 'addiction') {
      return <AddictionRecoveryGame />;
    }

    return (
      <>
        <h2>{selectedCategory.name} Journey</h2>
        <p>{selectedCategory.description}</p>

        <PointsDisplay>
          <h3>Current Points: {getCategoryProgress(selectedCategory.id)}</h3>
          <div>
            Next Goal: {getCurrentStage(selectedCategory.id)?.goal}
            <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.5rem' }}>
              {getCurrentStage(selectedCategory.id)?.points - getCategoryProgress(selectedCategory.id)} points needed
            </div>
          </div>
        </PointsDisplay>

        <ProgressIndicator progress={calculateProgress(selectedCategory.id)}>
          <h3>Overall Progress</h3>
          <div className="progress-bar">
            <div className="fill" />
          </div>
          <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
            {calculateProgress(selectedCategory.id).toFixed(1)}% Complete
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
          {selectedCategory.stages.map(stage => (
            <StageCard 
              key={stage.level}
              isCompleted={isStageCompleted(stage, selectedCategory.id)}
              isCurrent={isCurrentStage(stage, selectedCategory.id)}
            >
              <h3>Level {stage.level}</h3>
              <h4>{stage.goal}</h4>
              <p style={{ margin: '1rem 0' }}>Reward: {stage.reward}</p>
              <p>Required Points: {stage.points}</p>
              {isStageCompleted(stage, selectedCategory.id) && (
                <p style={{ color: '#2ecc71', marginTop: '1rem' }}>
                  ✨ Stage Complete!
                </p>
              )}
              {isCurrentStage(stage, selectedCategory.id) && (
                <div style={{ marginTop: '1rem' }}>
                  <div className="progress-bar">
                    <div 
                      className="fill" 
                      style={{ 
                        width: `${(getCategoryProgress(selectedCategory.id) / stage.points) * 100}%`,
                        background: theme.colors.accent 
                      }} 
                    />
                  </div>
                  <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    {stage.points - getCategoryProgress(selectedCategory.id)} points to complete
                  </p>
                </div>
              )}
            </StageCard>
          ))}
        </StageGrid>

        <ProgressChart>
          <h3>Progress History</h3>
          {getCategoryHistory(selectedCategory.id).length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getCategoryHistory(selectedCategory.id)}>
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
      </>
    );
  };

  return (
    <GameContainer>
      {showConfetti && <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 100 }}>
        {Array.from({ length: 50 }).map((_, i) => (
          <div 
            key={i}
            style={{
              position: 'absolute',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: '10px',
              height: '10px',
              background: `hsl(${Math.random() * 360}, 100%, 50%)`,
              borderRadius: '50%',
              animation: `fall 3s linear`
            }}
          />
        ))}
      </div>}
      
      <GameHeader>
        <h1>Breakthrough: Your Transformation Journey</h1>
        <p>Choose your path and level up your life through consistent habits and meaningful achievements.</p>
        {selectedCategory && (
          <div style={{ marginTop: '1rem', color: theme.colors.accent }}>
            {getMotivationalMessage()}
          </div>
        )}
      </GameHeader>

      <GameGrid>
        <CategoryList>
          {HABIT_CATEGORIES.map(category => (
            <CategoryItem 
              key={category.id}
              active={selectedCategory?.id === category.id}
              onClick={() => handleCategorySelect(category)}
            >
              <span>{category.icon}</span>
              <div>
                <h3>{category.name}</h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>{category.description}</p>
                <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                  Current Progress: {getCategoryProgress(category.id)} points
                </div>
              </div>
            </CategoryItem>
          ))}
        </CategoryList>

        <GameContent>
          {renderGameContent()}
        </GameContent>
      </GameGrid>
    </GameContainer>
  );
};

export default BreakthroughGame;