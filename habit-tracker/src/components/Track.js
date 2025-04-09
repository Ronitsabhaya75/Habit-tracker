import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useEventContext } from '../context/EventContext';
import AIChat from './AIChat';

// Theme Colors from Original Dashboard
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

// Animations from Original Dashboard
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

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

// Styled Components with Dashboard Theme
const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: ${dashboardTheme.backgroundGradient};
  overflow: hidden;
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

const TrackContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  position: relative;
  z-index: 10;
  margin-left: 250px;
  padding: 2rem 0;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: ${dashboardTheme.accentGlow};
  margin-bottom: 1rem;
  text-shadow: 0 0 10px rgba(0, 255, 245, 0.5);
`;

const ExpContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
  width: 350px;
  border-radius: 20px;
  padding: 1rem;
  background: ${dashboardTheme.cardBackground};
  border: 1px solid ${dashboardTheme.borderGlow};
  box-shadow: 0 0 15px rgba(0, 255, 198, 0.2);
`;

const ExpLabel = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 0.5rem;
  color: ${dashboardTheme.textPrimary};
  font-size: 1.1rem;
  
  span {
    color: ${dashboardTheme.accentGradientStart};
    font-weight: bold;
  }
`;

const ExpBarContainer = styled.div`
  width: 100%;
  height: 14px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 7px;
  overflow: hidden;
  margin-top: 1rem;
`;

const ExpBarFill = styled.div`
  height: 100%;
  width: ${props => props.percentage}%;
  background: ${dashboardTheme.buttonGradient};
  border-radius: 7px;
  transition: width 1s ease-in-out;
`;

const CalendarContainer = styled.div`
  background: ${dashboardTheme.cardBackground};
  padding: 2.5rem;
  border-radius: 16px;
  border: 1px solid ${dashboardTheme.borderGlow};
  backdrop-filter: blur(8px);
  width: 90%;
  max-width: 800px;
  color: ${dashboardTheme.textPrimary};
  box-shadow: 0 0 15px rgba(0, 255, 198, 0.2);
  animation: ${css`${fadeIn} 0.5s ease-out`};
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h3 {
    color: ${dashboardTheme.accentGlow};
    text-shadow: 0 0 5px rgba(0, 255, 245, 0.5);
  }
`;

const MonthNavButton = styled.button`
  background: ${dashboardTheme.buttonGradient};
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 255, 198, 0.3);
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
`;

const DayLabel = styled.div`
  text-align: center;
  padding: 0.5rem 0;
  font-weight: bold;
  color: ${dashboardTheme.accentGlow};
`;

const CalendarDay = styled.div`
  height: 45px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  background: ${props => 
    props.isToday ? 'rgba(0, 255, 245, 0.2)' : 
    props.isSelected ? 'rgba(0, 255, 198, 0.3)' : 
    props.hasEvent ? 'rgba(74, 144, 226, 0.2)' : 
    'rgba(21, 38, 66, 0.8)'};
  border: 1px solid ${props => 
    props.isToday ? 'rgba(0, 255, 245, 0.6)' : 
    props.isSelected ? 'rgba(0, 255, 198, 0.6)' : 
    props.hasEvent ? 'rgba(74, 144, 226, 0.4)' : 
    dashboardTheme.borderGlow};
  color: ${props => props.isCurrentMonth ? dashboardTheme.textPrimary : 'rgba(184, 255, 249, 0.4)'};
  transition: all 0.2s;
  
  &:hover {
    background: rgba(0, 255, 198, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 0 10px rgba(0, 255, 198, 0.3);
  }
  
  &::after {
    content: ${props => props.hasEvent ? '"•"' : '""'};
    position: absolute;
    bottom: 4px;
    color: ${dashboardTheme.accentGradientStart};
  }
`;

const EventModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(11, 26, 44, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  backdrop-filter: blur(4px);
`;

const EventModalContent = styled.div`
  background: ${dashboardTheme.cardBackground};
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid ${dashboardTheme.borderGlow};
  backdrop-filter: blur(8px);
  width: 90%;
  max-width: 500px;
  box-shadow: 0 0 15px rgba(0, 255, 198, 0.2);
  animation: ${css`${fadeIn} 0.3s ease-out`};
  
  h3 {
    color: ${dashboardTheme.accentGlow};
    margin-bottom: 1.5rem;
    text-shadow: 0 0 10px rgba(0, 255, 245, 0.5);
  }
`;

const EventInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin: 0.5rem 0;
  background: ${dashboardTheme.glassOverlay};
  border: 1px solid ${dashboardTheme.borderGlow};
  border-radius: 8px;
  color: ${dashboardTheme.textPrimary};
`;

const EventTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  margin: 0.5rem 0;
  background: ${dashboardTheme.glassOverlay};
  border: 1px solid ${dashboardTheme.borderGlow};
  border-radius: 8px;
  color: ${dashboardTheme.textPrimary};
  min-height: 100px;
  resize: vertical;
`;

const EventList = styled.div`
  margin-top: 1rem;
  max-height: 200px;
  overflow-y: auto;
`;

const EventItem = styled.div`
  padding: 1rem;
  background: ${dashboardTheme.glassOverlay};
  border-radius: 12px;
  margin-bottom: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s;
  &:hover {
    background: rgba(0, 255, 198, 0.1);
    transform: translateX(3px);
  }
`;

const TaskCheckbox = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid ${props => props.completed ? dashboardTheme.accentGlow : 'rgba(184, 255, 249, 0.3)'};
  background: ${props => props.completed ? dashboardTheme.buttonGradient : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  
  &::after {
    content: ${props => props.completed ? '"✓"' : '""'};
    color: white;
    font-size: 0.8rem;
  }
  
  &:hover {
    border-color: ${dashboardTheme.accentGlow};
    transform: scale(1.1);
  }
`;

const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const CancelButton = styled.button`
  background: rgba(255, 82, 82, 0.3);
  color: white;
  border: none;
  padding: 0.7rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: rgba(255, 82, 82, 0.5);
  }
`;

const SaveButton = styled.button`
  background: ${dashboardTheme.buttonGradient};
  color: white;
  border: none;
  padding: 0.7rem 1.4rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 255, 198, 0.3);
  }
`;

const AddEventButton = styled.button`
  background: ${dashboardTheme.buttonGradient};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 255, 198, 0.3);
  }
`;

const DeleteButton = styled.button`
  background: rgba(255, 82, 82, 0.3);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: rgba(255, 82, 82, 0.5);
  }
`;

const StreakBadge = styled.div`
  padding: 0.3rem 0.8rem;
  background: rgba(0, 255, 198, 0.2);
  border-radius: 20px;
  color: ${dashboardTheme.accentGlow};
  font-size: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid ${dashboardTheme.borderGlow};
`;

const CoachTip = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${dashboardTheme.buttonGradient};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 100;
  box-shadow: 0 0 15px rgba(0, 255, 198, 0.3);
  
  &:hover {
    transform: scale(1.1);
  }
  
  &::before {
    content: '👨‍🚀';
    font-size: 24px;
  }
`;

const TipPopup = styled.div`
  position: fixed;
  bottom: 100px;
  right: 30px;
  width: 280px;
  padding: 1.2rem;
  background: ${dashboardTheme.cardBackground};
  border-radius: 12px;
  border: 1px solid ${dashboardTheme.borderGlow};
  color: ${dashboardTheme.textPrimary};
  z-index: 100;
  box-shadow: 0 5px 20px rgba(0, 255, 198, 0.2);
  backdrop-filter: blur(8px);
  animation: ${css`${fadeIn} 0.3s ease-out`};
`;

const Track = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '' });
  const [editEvent, setEditEvent] = useState(null);
  const [showTip, setShowTip] = useState(false);
  const [streakCount, setStreakCount] = useState(4);
  const { events, userExp, addEvent, updateEvent, deleteEvent, toggleEventCompletion } = useEventContext();
  const navigate = useNavigate();

  const user = { name: 'User', habits: [] };

  const calculateExpPercentage = () => {
    const currentLevel = Math.floor(userExp / 100);
    const currentLevelExp = userExp % 100;
    return currentLevelExp;
  };

  const handleTaskCompletion = (eventId, isCompleted) => {
    if (!selectedDate) return;
    const dateKey = formatDate(selectedDate);
    toggleEventCompletion(dateKey, eventId, isCompleted);
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const previousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const handleDateClick = (year, month, day) => {
    const clickedDate = new Date(year, month, day);
    setSelectedDate(clickedDate);
  };

  const formatDate = (date) => date.toISOString().split('T')[0];

  const handleOpenEventModal = (event = null) => {
    if (event) {
      setEditEvent(event);
      setNewEvent({ title: event.title, description: event.description });
    } else {
      setEditEvent(null);
      setNewEvent({ title: '', description: '' });
    }
    setShowEventModal(true);
  };

  const handleCloseEventModal = () => {
    setShowEventModal(false);
    setEditEvent(null);
    setNewEvent({ title: '', description: '' });
  };

  const handleAddEvent = () => {
    if (selectedDate && newEvent.title.trim()) {
      const dateKey = formatDate(selectedDate);
      if (editEvent) {
        updateEvent(dateKey, editEvent.id, newEvent);
      } else {
        addEvent(dateKey, {
          id: Date.now(),
          title: newEvent.title,
          description: newEvent.description,
          completed: false,
        });
      }
      handleCloseEventModal();
    }
  };

  const handleDeleteEvent = (eventId) => {
    if (!selectedDate) return;
    const dateKey = formatDate(selectedDate);
    deleteEvent(dateKey, eventId);
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    const dayLabels = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    dayLabels.forEach(day => {
      days.push(<DayLabel key={`label-${day}`}>{day}</DayLabel>);
    });
    
    for (let i = 0; i < firstDayOfMonth; i++) {
      const prevMonthDay = new Date(year, month, 0 - (firstDayOfMonth - i - 1));
      days.push(
        <CalendarDay 
          key={`prev-${i}`} 
          isCurrentMonth={false}
          onClick={() => handleDateClick(prevMonthDay.getFullYear(), prevMonthDay.getMonth(), prevMonthDay.getDate())}
        >
          {prevMonthDay.getDate()}
        </CalendarDay>
      );
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = formatDate(date);
      const hasEvents = events[dateKey] && events[dateKey].length > 0;
      
      const isSelectedDay = selectedDate && 
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();
      
      days.push(
        <CalendarDay 
          key={`current-${day}`}
          isCurrentMonth={true}
          isToday={isToday(date)}
          isSelected={isSelectedDay}
          hasEvent={hasEvents}
          onClick={() => handleDateClick(year, month, day)}
        >
          {day}
        </CalendarDay>
      );
    }
    
    const totalCells = 42;
    const remainingCells = totalCells - (firstDayOfMonth + daysInMonth);
    
    for (let i = 1; i <= remainingCells; i++) {
      const nextMonthDay = new Date(year, month + 1, i);
      days.push(
        <CalendarDay 
          key={`next-${i}`} 
          isCurrentMonth={false}
          onClick={() => handleDateClick(nextMonthDay.getFullYear(), nextMonthDay.getMonth(), nextMonthDay.getDate())}
        >
          {i}
        </CalendarDay>
      );
    }
    
    return days;
  };

  const renderSelectedDateEvents = () => {
    if (!selectedDate) return null;
    
    const dateKey = formatDate(selectedDate);
    const dateEvents = events[dateKey] || [];
    
    if (dateEvents.length === 0) {
      return <p>No quests scheduled for this date. Add one to earn EXP choses!</p>;
    }
    
    return (
      <EventList>
        {dateEvents.map(event => (
          <EventItem key={event.id} onClick={() => handleOpenEventModal(event)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <TaskCheckbox
                completed={event.completed || false}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTaskCompletion(event.id, !event.completed);
                }}
              />
              <div>
                <strong style={{ color: event.completed ? dashboardTheme.accentGlow : dashboardTheme.textPrimary }}>
                  {event.title}
                </strong>
                {event.description && <p style={{ opacity: 0.8, fontSize: '0.9rem', marginTop: '0.3rem' }}>{event.description}</p>}
              </div>
            </div>
            <DeleteButton 
              onClick={(e) => { 
                e.stopPropagation(); 
                handleDeleteEvent(event.id); 
              }}
            >
              Delete
            </DeleteButton>
          </EventItem>
        ))}
      </EventList>
    );
  };

  const handleTaskUpdate = (action, task, date = null) => {
    if (date) {
      const dateKey = formatDate(date);
      switch (action) {
        case 'add':
          addEvent(dateKey, task);
          break;
        case 'edit':
          updateEvent(dateKey, task.id, task);
          break;
        case 'remove':
          deleteEvent(dateKey, task.id);
          break;
        default:
          toggleEventCompletion(dateKey, task.id, task.completed);
      }
    }
  };

  const handleAddTaskWithDate = (date, task) => {
    const dateKey = formatDate(date);
    addEvent(dateKey, task);
  };

  const toggleTip = () => setShowTip(!showTip);

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
    <>
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
          <NavItem className="active">📅 Calendar Tracker</NavItem>
          <NavItem onClick={() => navigate('/new-habit')}>✨ Habit Creation</NavItem>
          <NavItem onClick={() => navigate('/shop')}>🛒 Shop</NavItem>
          <NavItem onClick={() => navigate('/review')}>📊 Review</NavItem>
        </NavList>
      </Sidebar> 
      <TrackContainer>
        <PageTitle>Mission Control</PageTitle>
        
        <ExpContainer>
          <ExpLabel>
            <div>SPACE RANGER LEVEL: <span>3</span></div>
            <div>EXP: <span>{userExp}</span></div>
          </ExpLabel>
          <ExpBarContainer>
            <ExpBarFill percentage={calculateExpPercentage()} />
          </ExpBarContainer>
        </ExpContainer>
        
        {streakCount > 0 && (
          <StreakBadge>You're on a {streakCount}-day streak! Keep it up!</StreakBadge>
        )}
        
        <CalendarContainer>
          <CalendarHeader>
            <MonthNavButton onClick={previousMonth}>◀ PREV</MonthNavButton>
            <h3>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
            <MonthNavButton onClick={nextMonth}>NEXT ▶</MonthNavButton>
          </CalendarHeader>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <AddEventButton onClick={() => handleOpenEventModal()}>+ Add Quest</AddEventButton>
          </div>
          
          <CalendarGrid>
            {renderCalendarDays()}
          </CalendarGrid>
          
          {selectedDate && (
            <div style={{ marginTop: '1.5rem' }}>
              <h4 style={{ 
                fontSize: '1.2rem', 
                marginBottom: '1rem',
                color: dashboardTheme.accentGlow,
                textShadow: `0 0 5px ${dashboardTheme.accentGlow}`
              }}>
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h4>
              {renderSelectedDateEvents()}
            </div>
          )}
        </CalendarContainer>

        <AIChat 
          user={user} 
          onTaskUpdate={handleTaskUpdate}
          onAddTaskWithDate={handleAddTaskWithDate}
          tasks={[]}
          events={events}
        />

        <CoachTip onClick={toggleTip} />
        {showTip && (
          <TipPopup>
            <strong style={{ color: dashboardTheme.accentGlow }}>Captain's Log:</strong>
            <p style={{ marginTop: '0.5rem' }}>You're just 2 quests away from leveling up! Complete tasks to earn cosmic EXP and unlock new powers.</p>
          </TipPopup>
        )}

        {showEventModal && (
          <EventModal>
            <EventModalContent>
              <h3>{editEvent ? 'Edit Quest' : 'Add New Quest'}</h3>
              <EventInput
                type="text"
                placeholder="Quest Title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              />
              <EventTextarea
                placeholder="Quest Description (optional)"
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
              />
              <ModalButtonContainer>
                <CancelButton onClick={handleCloseEventModal}>CANCEL</CancelButton>
                <SaveButton onClick={handleAddEvent}>{editEvent ? 'SAVE CHANGES' : 'ADD QUEST'}</SaveButton>
              </ModalButtonContainer>
            </EventModalContent>
          </EventModal>
        )}
      </TrackContainer>
    </>
  );
};

export default Track;