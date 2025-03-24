import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../theme';
import { useNavigate } from 'react-router-dom';

// **ANIMATIONS**
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

// **BACKGROUND**
const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #2b3a67 0%, #1a2233 100%);
  overflow: hidden;
`;

// Gradient Overlay
const GradientOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 50%, rgba(114, 137, 218, 0.15) 0%, transparent 70%),
              radial-gradient(circle at 70% 70%, rgba(90, 128, 244, 0.1) 0%, transparent 60%);
  z-index: 1;
`;

// Mountain scenery in the background (like in the gaming controller image)
const Scenery = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30%;
  background: linear-gradient(180deg, transparent 0%, rgba(48, 56, 97, 0.2) 100%);
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

// **STARS**
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

// **ACHIEVEMENT ICON**
const AchievementBadge = styled.div`
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(114, 137, 218, 0.2) 0%, rgba(114, 137, 218, 0) 70%);
  border: 2px solid rgba(114, 137, 218, 0.3);
  box-shadow: 0 0 15px rgba(114, 137, 218, 0.2);
  top: 15%;
  right: 15%;
  z-index: 2;
  animation: ${pulseGlow} 4s infinite ease-in-out;
  
  &::before {
    content: '🏆';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 24px;
  }
`;

// **ROCKET WITH TRAIL**
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

// **PROGRESS CIRCLE**
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

// **XP ORB - SUBTLE VERSION**
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

const Sidebar = styled.div`
  width: 250px;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  color: ${theme.colors.text};
  border-right: 1px solid ${theme.colors.borderWhite};
  backdrop-filter: blur(8px);
  z-index: 10;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
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
  color: ${theme.colors.text};
  align-items: center;
  gap: 1rem;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  &.active {
    background: ${theme.colors.secondary};
  }
`;

// **TRACK COMPONENT**
const TrackContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  position: relative;
  z-index: 10;
  margin-left: 250px; // Adjust for sidebar width
`;

const CalendarContainer = styled.div`
  background: rgba(30, 39, 73, 0.6);
  padding: 2.5rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(114, 137, 218, 0.2);
  width: 90%;
  max-width: 800px;
  color: ${theme.colors.text};
  box-shadow: 0 8px 32px rgba(14, 21, 47, 0.2), 
              0 0 0 1px rgba(114, 137, 218, 0.1), 
              inset 0 1px 1px rgba(255, 255, 255, 0.05);
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const MonthNavButton = styled.button`
  background: rgba(114, 137, 218, 0.2);
  color: ${theme.colors.text};
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: rgba(114, 137, 218, 0.4);
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
`;

const CalendarDay = styled.div`
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  background: ${props => 
    props.isToday 
      ? 'rgba(114, 137, 218, 0.3)' 
      : props.isSelected 
        ? theme.colors.accent 
        : props.hasEvent 
          ? 'rgba(100, 220, 255, 0.2)' 
          : 'rgba(255, 255, 255, 0.05)'
  };
  
  color: ${props => props.isCurrentMonth ? theme.colors.text : 'rgba(255, 255, 255, 0.4)'};
  font-weight: ${props => props.isToday || props.isSelected ? 'bold' : 'normal'};
  
  &:hover {
    background: ${props => props.isSelected ? theme.colors.accent : 'rgba(114, 137, 218, 0.3)'};
  }
  
  &::after {
    content: ${props => props.hasEvent ? '"•"' : '""'};
    position: absolute;
    bottom: 2px;
    color: ${theme.colors.accent};
    font-size: 14px;
  }
`;

const DayLabel = styled.div`
  text-align: center;
  padding: 0.5rem 0;
  font-weight: bold;
  color: ${theme.colors.secondary};
`;

const EventModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const EventModalContent = styled.div`
  background: ${theme.colors.glassWhite};
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid ${theme.colors.borderWhite};
  backdrop-filter: blur(8px);
  width: 90%;
  max-width: 500px;
`;

const EventInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin: 0.5rem 0;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid ${theme.colors.borderWhite};
  border-radius: 8px;
  color: ${theme.colors.text};
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const EventTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  margin: 0.5rem 0;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid ${theme.colors.borderWhite};
  border-radius: 8px;
  color: ${theme.colors.text};
  min-height: 100px;
  resize: vertical;
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const EventList = styled.div`
  margin-top: 1rem;
  max-height: 200px;
  overflow-y: auto;
`;

const EventItem = styled.div`
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const EventCheckbox = styled.input`
  margin-right: 0.5rem;
  cursor: pointer;
`;

const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const CancelButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: ${theme.colors.text};
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const SaveButton = styled.button`
  background: ${theme.colors.accent};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  &:hover {
    background: ${theme.colors.secondary};
  }
`;

const AddEventButton = styled.button`
  background: ${theme.colors.accent};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
  &:hover {
    background: ${theme.colors.secondary};
  }
`;

const DeleteButton = styled.button`
  background: #ff4d4d;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  &:hover {
    background: #ff1a1a;
  }
`;

const Track = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [events, setEvents] = useState({});
  const [newEvent, setNewEvent] = useState({ title: '', description: '' });
  const [editEvent, setEditEvent] = useState(null);
  const [userExp, setUserExp] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const savedExp = localStorage.getItem('userExp');
    if (savedExp) {
      setUserExp(parseInt(savedExp, 10));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('userExp', userExp);
  }, [userExp]);

  const handleTaskCompletion = (eventId, isCompleted) => {
    const dateKey = formatDate(selectedDate);
    const updatedEvents = { ...events };

    updatedEvents[dateKey] = updatedEvents[dateKey].map(event =>
      event.id === eventId ? { ...event, completed: isCompleted } : event
    );

    if (isCompleted) {
      setUserExp(prevExp => prevExp + 20);
    }

    setEvents(updatedEvents);
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

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

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
      const updatedEvents = { ...events };
      
      if (!updatedEvents[dateKey]) {
        updatedEvents[dateKey] = [];
      }
      
      if (editEvent) {
        updatedEvents[dateKey] = updatedEvents[dateKey].map(event => 
          event.id === editEvent.id ? { ...event, ...newEvent } : event
        );
      } else {
        updatedEvents[dateKey].push({
          id: Date.now(),
          title: newEvent.title,
          description: newEvent.description,
          completed: false,
        });
      }
      
      setEvents(updatedEvents);
      handleCloseEventModal();
    }
  };

  const handleDeleteEvent = (eventId) => {
    const dateKey = formatDate(selectedDate);
    const updatedEvents = { ...events };
    updatedEvents[dateKey] = updatedEvents[dateKey].filter(event => event.id !== eventId);
    setEvents(updatedEvents);
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
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
      return <p>No events scheduled for this date.</p>;
    }
    
    return (
      <EventList>
        {dateEvents.map(event => (
          <EventItem key={event.id} onClick={() => handleOpenEventModal(event)}>
            <div>
              <EventCheckbox
                type="checkbox"
                checked={event.completed || false}
                onChange={(e) => handleTaskCompletion(event.id, e.target.checked)}
                onClick={(e) => e.stopPropagation()}
              />
              <strong>{event.title}</strong>
              {event.description && <p>{event.description}</p>}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <DeleteButton onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event.id); }}>Delete</DeleteButton>
            </div>
          </EventItem>
        ))}
      </EventList>
    );
  };

  return (
    <>
      <Background>
        <GradientOverlay />
        <Scenery />
        <Star size="20px" style={{ top: '10%', left: '10%' }} duration="4s" delay="0.5s" />
        <Star size="15px" style={{ top: '25%', left: '25%' }} duration="3s" delay="1s" />
        <Star size="25px" style={{ top: '15%', right: '30%' }} duration="5s" delay="0.2s" />
        <Rocket>
          <RocketTrail />
        </Rocket>
        <AchievementBadge />
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
          <NavItem onClick={() => navigate('/breakthrough-game')}>Games</NavItem>
          <NavItem className="active">Events</NavItem>
          <NavItem onClick={() => navigate('/review')}>Review</NavItem>
        </NavList>
      </Sidebar>
      <TrackContainer>
        <h1 style={{ fontSize: '2.5rem', color: theme.colors.accent, marginBottom: '1rem' }}>Track Your Habits</h1>
        <div style={{ marginBottom: '1rem', fontSize: '1.2rem', color: theme.colors.text }}>
          <strong>EXP:</strong> {userExp}
        </div>
        <CalendarContainer>
          <CalendarHeader>
            <MonthNavButton onClick={previousMonth}>← Prev</MonthNavButton>
            <h3>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
            <MonthNavButton onClick={nextMonth}>Next →</MonthNavButton>
          </CalendarHeader>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <AddEventButton onClick={() => handleOpenEventModal()}>+ Add Event</AddEventButton>
          </div>
          
          <CalendarGrid>
            {renderCalendarDays()}
          </CalendarGrid>
          
          {selectedDate && (
            <div style={{ marginTop: '1rem' }}>
              <h4>
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

        {showEventModal && (
          <EventModal>
            <EventModalContent>
              <h3>{editEvent ? 'Edit Event' : 'Add Event'}</h3>
              <EventInput
                type="text"
                placeholder="Event Title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              />
              <EventTextarea
                placeholder="Event Description (optional)"
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
              />
              <ModalButtonContainer>
                <CancelButton onClick={handleCloseEventModal}>Cancel</CancelButton>
                <SaveButton onClick={handleAddEvent}>{editEvent ? 'Save Changes' : 'Add Event'}</SaveButton>
              </ModalButtonContainer>
            </EventModalContent>
          </EventModal>
        )}
      </TrackContainer>
    </>
  );
};

export default Track;