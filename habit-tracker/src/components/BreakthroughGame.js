import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { useHabit } from '../context/HabitContext';
import { useAuth } from '../context/AuthContext';
import AddictionRecoveryGame from '../components/games/AddictionRecoveryGame';

// Animations
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
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  max-width: 800px;
  margin: 2rem auto;
  padding-left: 250px;
`;

const GameCard = styled.div`
  background: linear-gradient(145deg, rgba(114, 137, 218, 0.15), rgba(90, 128, 244, 0.1));
  padding: 1.5rem;
  border-radius: 16px;
  aspect-ratio: 1/1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
    
    &::before {
      opacity: 0.1;
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.4), transparent);
    opacity: 0.05;
    transition: opacity 0.3s ease;
  }
`;

const IconWrapper = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(45deg, ${theme.colors.accent}, ${theme.colors.secondary});
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0 4px 15px rgba(114, 137, 218, 0.3);
  font-size: 28px;
`;

const ProgressContainer = styled.div`
  position: relative;
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  height: 6px;
  border-radius: 3px;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.progress}%;
    background: linear-gradient(90deg, ${theme.colors.accent}, ${theme.colors.secondary});
    transition: width 0.5s ease;
    animation: shine 2s infinite;
  }

  @keyframes shine {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

const Percentage = styled.span`
  font-size: 1.2rem;
  font-weight: 700;
  background: linear-gradient(45deg, ${theme.colors.accent}, ${theme.colors.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Sidebar = styled.div`
  width: 250px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-right: 1px solid ${theme.colors.borderWhite};
  backdrop-filter: blur(8px);
  z-index: 1000;
  color: white;
`;

const LogoutButton = styled.button`
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: ${theme.colors.secondary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  z-index: 1001;
  
  &:hover {
    background: ${theme.colors.accent};
    transform: translateY(-2px);
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
  font-size: 1.2rem;
  line-height: 1.6;

  h2, h3, h4 {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
  }
  
  p {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }
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
const PlayButton = styled.button`
  background: ${theme.colors.accent};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  margin-top: 1rem;
  align-self: center;

  &:hover {
    background: ${theme.colors.secondary};
    transform: translateY(-2px);
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
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const categoryId = pathParts[pathParts.length - 1]; // Get the last part of the URL

    if (categoryId && HABIT_CATEGORIES.some(cat => cat.id === categoryId)) {
      setSelectedCategory(HABIT_CATEGORIES.find(cat => cat.id === categoryId));
    } else {
      setSelectedCategory(null); // Reset if no valid category is found
    }
  }, [location]);

  const handleCategorySelect = (category) => {
    navigate(`/breakthrough-game/${category.id}`); // Navigate to the correct URL
    setSelectedCategory(category); // Update the selected category
  };

  const calculateProgress = (categoryId) => {
    const category = HABIT_CATEGORIES.find(cat => cat.id === categoryId);
    const currentPoints = getCategoryProgress(categoryId);
    const maxPoints = category.stages[category.stages.length - 1].points;
    return Math.min((currentPoints / maxPoints) * 100, 100);
  };

  return (
    <>
      <Sidebar>
        <h2 style={{ color: 'white' }}>HabitQuest</h2>
        <NavList>
          <NavItem style={{ color: 'white' }} onClick={() => navigate('/dashboard')}>📊 Dashboard</NavItem>
          <NavItem className="active" style={{ color: 'white' }}>🎮 Breakthrough Game</NavItem>
          <NavItem style={{ color: 'white' }} onClick={() => navigate('/settings')}>⚙️ Settings</NavItem>
        </NavList>
      </Sidebar>

      <LogoutButton onClick={handleLogout}>Log Out</LogoutButton>

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
              <GameCard key={category.id}>
                <div>
                  <IconWrapper>{category.icon}</IconWrapper>
                  <h3 style={{ 
                    fontSize: '1.4rem',
                    margin: '1rem 0 0.5rem',
                    background: 'linear-gradient(45deg, #fff, #e6e6e6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    {category.name}
                  </h3>
                  <p style={{
                    fontSize: '0.9rem',
                    lineHeight: '1.4',
                    opacity: '0.9',
                    padding: '0 1rem'
                  }}>
                    {category.description}
                  </p>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <Percentage>{Math.round(calculateProgress(category.id))}%</Percentage>
                  <ProgressContainer progress={calculateProgress(category.id)} />
                </div>

                {/* Play Button */}
            <PlayButton 
            style={{ marginTop: '1rem', width: '100%' }} 
            onClick={() => navigate(`/breakthrough-game/${category.id}/play`)}
          >
            Play Now
          </PlayButton>


                {/* Sparkle effect */}
                <div style={{
                  position: 'absolute',
                  top: '10%',
                  right: '10%',
                  width: '15px',
                  height: '15px',
                  background: 'rgba(255, 255, 255, 0.4)',
                  borderRadius: '50%',
                  filter: 'blur(2px)',
                  animation: 'twinkle 3s infinite'
                }} />
              </GameCard>
            ))}
          </GamesGrid>
        ) : (
          <GameContent>
            <BackButton onClick={() => {
              navigate('/breakthrough-game'); // Navigate back
              setSelectedCategory(null); // Reset the selected category
            }}>
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