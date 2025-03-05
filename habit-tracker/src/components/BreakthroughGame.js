import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useLocation } from 'react-router-dom';
import { theme } from '../theme';
import { useHabit } from '../context/HabitContext';
import AddictionRecoveryGame from './games/AddictionRecoveryGame';

// Animations (copied from Home.js)
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

const pulseGlow = keyframes`
  0% { transform: scale(1); opacity: 0.6; box-shadow: 0 0 10px rgba(100, 220, 255, 0.5); }
  50% { transform: scale(1.05); opacity: 0.8; box-shadow: 0 0 20px rgba(100, 220, 255, 0.8); }
  100% { transform: scale(1); opacity: 0.6; box-shadow: 0 0 10px rgba(100, 220, 255, 0.5); }
`;

// Background Components
const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #2b3a67 0%, #1a2233 100%);
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

// Main Container
const GameContainer = styled.div`
  min-height: 100vh;
  position: relative;
  color: ${theme.colors.text};
  padding: 2rem;
  background: transparent;
`;

// Header Styling
const GameHeader = styled.div`
  text-align: center;
  padding: 4rem 0;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  line-height: 1.2;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
`;

// Games Grid
const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 4rem auto;
  position: relative;
  z-index: 10;
`;

const GameCard = styled.div`
  background: ${theme.colors.glassWhite};
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  backdrop-filter: blur(5px);
  border: 1px solid ${theme.colors.borderWhite};
  transition: transform 0.2s;
  position: relative;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CategoryIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin-top: 1rem;
  overflow: hidden;
  
  div {
    height: 100%;
    background: ${theme.colors.secondary};
    width: ${props => props.progress}%;
    transition: width 0.3s ease;
  }
`;

const GameContent = styled.div`
  max-width: 1200px;
  margin: 4rem auto;
  position: relative;
  z-index: 10;
  background: ${theme.colors.glassWhite};
  padding: 2rem;
  border-radius: 15px;
  backdrop-filter: blur(5px);
  border: 1px solid ${theme.colors.borderWhite};
`;

const BackButton = styled.button`
  background: ${theme.colors.secondary};
  color: ${theme.colors.text};
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
  margin-bottom: 1.5rem;

  &:hover {
    transform: scale(1.05);
  }
`;

const HABIT_CATEGORIES = [
  { id: 'addiction', name: 'Addiction Recovery', icon: '🚭', description: 'Break free from harmful dependencies', stages: [
    { level: 1, goal: 'First Week Clean', points: 50, reward: 'Self-Care Package' },
    { level: 2, goal: 'One Month Milestone', points: 200, reward: 'Wellness Session' },
    { level: 3, goal: 'Quarterly Achievement', points: 500, reward: 'Personal Experience Gift' },
  ]},
  { id: 'fitness', name: 'Fitness Transformation', icon: '💪', description: 'Build a healthier, stronger you', stages: [
    { level: 1, goal: 'Consistent Workouts', points: 75, reward: 'Healthy Meal Coupon' },
    { level: 2, goal: 'Nutrition Tracking', points: 250, reward: 'Fitness Gear' },
    { level: 3, goal: 'Body Composition Change', points: 600, reward: 'Personal Training' },
  ]},
];

const BreakthroughGame = () => {
  const location = useLocation();
  const { getCategoryProgress } = useHabit();
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryId = params.get('category');

    if (categoryId && HABIT_CATEGORIES.some(cat => cat.id === categoryId)) {
      setSelectedCategory(HABIT_CATEGORIES.find(cat => cat.id === categoryId));
    } else {
      setSelectedCategory(null);
    }
  }, [location]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const calculateProgress = (categoryId) => {
    const category = HABIT_CATEGORIES.find(cat => cat.id === categoryId);
    const currentPoints = getCategoryProgress(categoryId);
    const maxPoints = category.stages[category.stages.length - 1].points;
    return Math.min((currentPoints / maxPoints) * 100, 100);
  };

  return (
    <>
      {/* Background with Stars */}
      <Background>
        <GradientOverlay />
        <Star size="20px" style={{ top: '10%', left: '10%' }} duration="4s" delay="0.5s" />
        <Star size="15px" style={{ top: '25%', left: '25%' }} duration="3s" delay="1s" />
        <Star size="25px" style={{ top: '15%', right: '30%' }} duration="5s" delay="0.2s" />
        <XPOrb style={{ top: '65%', left: '15%' }} duration="6s" delay="0.2s" />
        <XPOrb style={{ top: '30%', right: '25%' }} duration="5s" delay="1.2s" />
        <XPOrb style={{ top: '75%', right: '30%' }} duration="7s" delay="0.5s" />
        <XPOrb style={{ top: '45%', left: '60%' }} duration="5.5s" delay="1.5s" />
      </Background>

      <GameContainer>
        <GameHeader>
          <Title>Breakthrough Games</Title>
          <Subtitle>
            Transform your daily habits into an epic journey of self-improvement.
            Choose a path, set goals, and unlock your potential!
          </Subtitle>
        </GameHeader>

        {!selectedCategory ? (
          <GamesGrid>
            {HABIT_CATEGORIES.map(category => (
              <GameCard key={category.id} onClick={() => handleCategorySelect(category)}>
                <CategoryIcon>{category.icon}</CategoryIcon>
                <h3>{category.name}</h3>
                <p style={{ opacity: 0.9, marginBottom: '1rem' }}>{category.description}</p>
                <ProgressBar progress={calculateProgress(category.id)}>
                  <div />
                </ProgressBar>
                <small>{Math.round(calculateProgress(category.id))}% Completed</small>
              </GameCard>
            ))}
          </GamesGrid>
        ) : (
          <GameContent>
            <BackButton onClick={() => setSelectedCategory(null)}>
              ← Back to All Games
            </BackButton>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{selectedCategory.name} Journey</h2>
            <p style={{ opacity: 0.9, marginBottom: '2rem' }}>{selectedCategory.description}</p>
            
            {selectedCategory.id === 'addiction' ? (
              <AddictionRecoveryGame />
            ) : (
              <div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Coming Soon!</h3>
                <p>This transformative experience is currently in development.</p>
              </div>
            )}
          </GameContent>
        )}
      </GameContainer>
    </>
  );
};

export default BreakthroughGame;