import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useHabit } from '../context/HabitContext';
import { useEventContext } from '../context/EventContext';

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
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [isTask, setIsTask] = useState(false);
  const [taskFrequency, setTaskFrequency] = useState('daily');
  const [taskStartDate, setTaskStartDate] = useState('');
  const { addHabit } = useHabit();
  const { addEvent } = useEventContext();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    // Add the habit
    const newHabit = {
      name,
      description,
      frequency,
      isTask,
      taskFrequency: isTask ? taskFrequency : undefined,
      taskStartDate: isTask ? taskStartDate : undefined
    };
    
    addHabit(newHabit);
    
    // If it's a task, add it to the calendar
    if (isTask) {
      const startDate = taskStartDate ? new Date(taskStartDate) : new Date();
      const taskId = Date.now();
      
      // Add the initial task
      const dateKey = startDate.toISOString().split('T')[0];
      addEvent(dateKey, {
        id: taskId,
        title: name,
        description: description,
        completed: false,
        isHabitTask: true,
        habitId: taskId, // Using taskId as habitId for now
        frequency: taskFrequency
      });
      
      // For weekly/biweekly tasks, add future occurrences
      if (taskFrequency === 'weekly' || taskFrequency === 'biweekly') {
        const daysToAdd = taskFrequency === 'weekly' ? 7 : 14;
        const futureDate = new Date(startDate);
        
        // Add 4 future occurrences (can be adjusted)
        for (let i = 0; i < 4; i++) {
          futureDate.setDate(futureDate.getDate() + daysToAdd);
          const futureDateKey = futureDate.toISOString().split('T')[0];
          addEvent(futureDateKey, {
            id: taskId + i + 1, // Unique ID for each occurrence
            title: name,
            description: description,
            completed: false,
            isHabitTask: true,
            habitId: taskId,
            frequency: taskFrequency
          });
        }
      }
    }
    
    navigate('/dashboard');
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
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Habit Name</Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Hydration"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Description</Label>
              <TextArea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Drink 8 glasses of water daily"
              />
            </FormGroup>
            <FormGroup>
              <Label>Frequency</Label>
              <Select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Biweekly</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <OptionRow>
                <RadioInput 
                  type="checkbox" 
                  id="isTask" 
                  checked={isTask} 
                  onChange={(e) => setIsTask(e.target.checked)} 
                />
                <OptionLabel htmlFor="isTask">This is a special task (appears in calendar)</OptionLabel>
              </OptionRow>
              
              {isTask && (
                <TaskOptions>
                  <FormGroup>
                    <Label>Task Frequency</Label>
                    <Select 
                      value={taskFrequency} 
                      onChange={(e) => setTaskFrequency(e.target.value)}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Biweekly</option>
                    </Select>
                  </FormGroup>
                  <FormGroup>
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={taskStartDate}
                      onChange={(e) => setTaskStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </FormGroup>
                  <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                    Note: Special tasks give 30 XP when completed but deduct 15 XP if missed.
                  </p>
                </TaskOptions>
              )}
            </FormGroup>
            
            <SubmitButton type="submit">Add Habit</SubmitButton>
          </form>
        </FormContainer>
      </MainContent>
    </Container>
  );
};

export default NewHabit;