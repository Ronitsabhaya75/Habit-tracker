import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useHabit } from '../context/HabitContext';
import { useEventContext } from '../context/EventContext';
import { createHabit } from '../api/api';
import { useAuth } from '../context/AuthContext';

// Theme
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

// Animations
const starFloat = keyframes`
  0% { opacity: 0; transform: translateY(0px) translateX(0px); }
  50% { opacity: 1; }
  100% { opacity: 0; transform: translateY(-20px) translateX(10px); }
`;

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

// Styled Components
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

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  position: relative;
  color: ${dashboardTheme.textPrimary};
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
`;

const FormContainer = styled.div`
  background: ${dashboardTheme.cardBackground};
  padding: 2.5rem;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid ${dashboardTheme.borderGlow};
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 0 15px rgba(0, 255, 198, 0.2);
  animation: ${css`${fadeIn} 0.5s ease-out`};
`;

const FormTitle = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: ${dashboardTheme.accentGlow};
  text-shadow: 0 0 10px rgba(0, 255, 245, 0.5);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid ${dashboardTheme.borderGlow};
  border-radius: 8px;
  color: ${dashboardTheme.textPrimary};
  font-size: 1rem;
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid ${dashboardTheme.borderGlow};
  border-radius: 8px;
  color: ${dashboardTheme.textPrimary};
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid ${dashboardTheme.borderGlow};
  border-radius: 8px;
  color: ${dashboardTheme.textPrimary};
  font-size: 1rem;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: ${dashboardTheme.buttonGradient};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 255, 198, 0.3);
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 255, 198, 0.5);
  }
`;

const TaskOptions = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(11, 26, 44, 0.6);
  border-radius: 8px;
  border: 1px solid ${dashboardTheme.borderGlow};
`;

const OptionRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const OptionLabel = styled.label`
  margin-left: 0.5rem;
  cursor: pointer;
`;

const RadioInput = styled.input`
  cursor: pointer;
`;

const NewHabit = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [timeOfDay, setTimeOfDay] = useState('anytime');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { refreshUserData } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createHabit({
        title,
        description,
        frequency,
        daysOfWeek,
        timeOfDay
      });
      await refreshUserData();
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDayToggle = (day) => {
    setDaysOfWeek(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

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
    <Container>
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
          <NavItem onClick={() => navigate('/breakthrough-game')}>🎮 Mini Games</NavItem>
          <NavItem onClick={() => navigate('/track')}>📅 Calendar Tracker</NavItem>
          <NavItem className="active">✨ Habit Creation</NavItem>
          <NavItem onClick={() => navigate('/shop')}>🛒 Shop</NavItem>
          <NavItem onClick={() => navigate('/review')}>📊 Review</NavItem>
        </NavList>
      </Sidebar>
      <MainContent>
        <FormContainer>
          <FormTitle>Create New Habit</FormTitle>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Title</Label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Description</Label>
              <TextArea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>Frequency</Label>
              <Select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </Select>
            </FormGroup>
            
            {frequency === 'weekly' && (
              <FormGroup>
                <Label>Days of Week</Label>
                <div className="days-grid">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                    <button
                      key={day}
                      type="button"
                      className={`day-button ${daysOfWeek.includes(day) ? 'selected' : ''}`}
                      onClick={() => handleDayToggle(day)}
                    >
                      {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                    </button>
                  ))}
                </div>
              </FormGroup>
            )}
            
            <FormGroup>
              <Label>Time of Day</Label>
              <Select value={timeOfDay} onChange={(e) => setTimeOfDay(e.target.value)}>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
                <option value="anytime">Anytime</option>
              </Select>
            </FormGroup>
            
            <SubmitButton type="submit">Create Habit</SubmitButton>
          </form>
        </FormContainer>
      </MainContent>
    </Container>
  );
};

export default NewHabit;