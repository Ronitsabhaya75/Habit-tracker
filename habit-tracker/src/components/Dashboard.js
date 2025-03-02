import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../theme';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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

// Scenery
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

// Stars
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

// Achievement Badge
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

// Rocket
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

// Rocket Trail
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

// Progress Circle
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

// XP Orb
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

// Dashboard Container
const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  position: relative;
  color: ${theme.colors.text};
`;

// Sidebar
const Sidebar = styled.div`
  width: 250px;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-right: 1px solid ${theme.colors.borderWhite};
  backdrop-filter: blur(8px);
  z-index: 10;
`;

// Nav List
const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 2rem;
`;

// Nav Item
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

// Main Content
const MainContent = styled.div`
  flex: 1;
  padding: 3rem;
  margin-left: 250px;
  z-index: 10;
`;

// Header
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

// User Greeting
const UserGreeting = styled.div`
  h1 {
    font-size: 2.5rem;
    span {
      color: ${theme.colors.accent};
    }
  }
`;

// Level Badge
const LevelBadge = styled.div`
  background: ${theme.colors.secondary};
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  box-shadow: ${theme.shadows.card};
`;

// Grid Container
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
  align-items: start;
`;

// Card
const Card = styled.div`
  background: ${theme.colors.glassWhite};
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid ${theme.colors.borderWhite};
  backdrop-filter: blur(8px);
`;

// Progress Bar Container
const ProgressBarContainer = styled.div`
  width: 100%;
  background: rgba(255, 255, 255, 0.2);
  height: 10px;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 1rem;
  & div {
    width: 30%;
    height: 100%;
    background: ${theme.colors.accent};
    transition: width 0.3s ease;
  }
`;

// Input Styles
const InputField = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(114, 137, 218, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: ${theme.colors.text};
  font-size: 1rem;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
    box-shadow: 0 0 0 2px rgba(114, 137, 218, 0.2);
  }
`;

// Button Styles
const Button = styled.button`
  background: ${props => props.primary ? theme.colors.accent : 'rgba(114, 137, 218, 0.2)'};
  color: ${theme.colors.text};
  border: 1px solid ${props => props.primary ? 'transparent' : 'rgba(114, 137, 218, 0.3)'};
  border-radius: 8px;
  padding: 0.8rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${props => props.primary ? 'rgba(114, 137, 218, 0.9)' : 'rgba(114, 137, 218, 0.3)'};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// Calendar Styles
const CalendarWrapper = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0 0.5rem;
`;

const MonthTitle = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${theme.colors.accent};
`;

const DayNames = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 0.5rem;
`;

const DayName = styled.div`
  padding: 0.5rem;
  font-weight: 600;
  color: ${theme.colors.secondary};
  font-size: 0.9rem;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
`;

const CalendarDay = styled.div`
  text-align: center;
  padding: 0.6rem 0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.isSelected ? 'rgba(114, 137, 218, 0.3)' : props.isToday ? 'rgba(114, 137, 218, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
  border: ${props => props.isToday ? '1px solid rgba(114, 137, 218, 0.5)' : props.hasEvent ? '1px solid rgba(160, 232, 255, 0.3)' : '1px solid transparent'};
  color: ${props => props.isOtherMonth ? 'rgba(255, 255, 255, 0.3)' : theme.colors.text};
  font-size: 0.9rem;
  position: relative;
  
  &:hover {
    background: rgba(114, 137, 218, 0.2);
  }
`;

const EventDot = styled.div`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: ${theme.colors.accent};
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
`;

const EventsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0;
`;

const EventItem = styled.li`
  padding: 0.8rem;
  margin: 0.5rem 0;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border-left: 3px solid ${theme.colors.accent};
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    color: rgba(255, 255, 255, 0.9);
  }
`;

const SelectedDateInfo = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const DateTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: ${theme.colors.accent};
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: linear-gradient(135deg, #2b3a67 0%, #1a2233 100%);
  border-radius: 16px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  border: 1px solid ${theme.colors.borderWhite};
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    margin: 0;
    color: ${theme.colors.accent};
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.5rem;
  cursor: pointer;
  
  &:hover {
    color: rgba(255, 255, 255, 0.9);
  }
`;

// Dashboard Component
const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const inputRef = useRef(null);
  
  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState("");

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    if (user && !leaderboard.some(entry => entry.name === user.name)) {
      setLeaderboard(prev => [...prev, { name: user.name, xp: 0 }]);
    }
  }, [user, leaderboard]);

  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.xp - a.xp);

  useEffect(() => {
    fetchUserProgress();
  }, []);

  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);
  
  useEffect(() => {
    // Initialize some sample events
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    const initialEvents = {
      [formatDate(today)]: ['Complete daily meditation'],
      [formatDate(tomorrow)]: ['Workout session', 'Read for 30 minutes'],
      [formatDate(nextWeek)]: ['Weekly progress review']
    };
    
    setEvents(initialEvents);
  }, []);

  const fetchUserProgress = async () => {
    try {
      setLoading(true);
      const userProgress = await fakeFetchUserData();
      setData(userProgress);
    } catch (error) {
      console.error("Error fetching user progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const leaderboardData = await fakeFetchLeaderboardData();
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    }
  };

  const fakeFetchUserData = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          Array.from({ length: 5 }, (_, i) => ({ progress: Math.floor(Math.random() * 100) }))
        );
      }, 1000);
    });
  };

  const fakeFetchLeaderboardData = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { name: 'Sameer', xp: 450 },
          { name: 'Aarav', xp: 380 },
          { name: 'Priya', xp: 320 },
          { name: 'Vikram', xp: 290 },
          { name: 'Anika', xp: 250 },
        ]);
      }, 1000);
    });
  };

  const addHabit = () => {
    setShowInput(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && newHabit.trim()) {
      setTasks([...tasks, newHabit.trim()]);
      setNewHabit("");
      setShowInput(false);
    }
  };

  const getLineColor = (progress) => {
    if (progress < 30) return 'red';
    if (progress < 60) return 'lightcoral';
    return 'lightgreen';
  };
  
  // Calendar functions
  const formatDate = (date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };
  
  const formatDisplayDate = (date) => {
    return date.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };
  
  const changeMonth = (amount) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + amount);
    setCurrentDate(newDate);
  };
  
  const handleDayClick = (date) => {
    setSelectedDate(date);
  };
  
  const openAddEventModal = () => {
    setShowModal(true);
    setNewEvent("");
  };
  
  const closeModal = () => {
    setShowModal(false);
  };
  
  const addEvent = () => {
    if (newEvent.trim()) {
      const dateStr = formatDate(selectedDate);
      setEvents(prev => ({
        ...prev,
        [dateStr]: [...(prev[dateStr] || []), newEvent.trim()]
      }));
      setNewEvent("");
      closeModal();
    }
  };
  
  const deleteEvent = (dateStr, index) => {
    setEvents(prev => {
      const updatedEvents = { ...prev };
      const eventList = [...updatedEvents[dateStr]];
      eventList.splice(index, 1);
      
      if (eventList.length === 0) {
        delete updatedEvents[dateStr];
      } else {
        updatedEvents[dateStr] = eventList;
      }
      
      return updatedEvents;
    });
  };
  
  // Calendar rendering functions
  const renderDayNames = () => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <DayNames>
        {dayNames.map(name => (
          <DayName key={name}>{name}</DayName>
        ))}
      </DayNames>
    );
  };
  
  const renderCalendarDays = () => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    const endDate = new Date(monthEnd);
    
    // Adjust to start from Sunday
    startDate.setDate(1 - monthStart.getDay());
    
    // Ensure we display 6 weeks
    endDate.setDate(monthEnd.getDate() + (6 - monthEnd.getDay()));
    
    const days = [];
    let day = new Date(startDate);
    
    while (day <= endDate) {
      const dateStr = formatDate(day);
      const isCurrentMonth = day.getMonth() === currentDate.getMonth();
      const hasEvents = events[dateStr] && events[dateStr].length > 0;
      const currentDay = new Date(day);
      
      days.push(
        <CalendarDay 
          key={dateStr}
          isOtherMonth={!isCurrentMonth}
          isToday={isToday(day)}
          isSelected={selectedDate && formatDate(selectedDate) === dateStr}
          hasEvent={hasEvents}
          onClick={() => handleDayClick(currentDay)}
        >
          {day.getDate()}
          {hasEvents && <EventDot />}
        </CalendarDay>
      );
      
      day.setDate(day.getDate() + 1);
    }
    
    return days;
  };
  
  const renderEvents = () => {
    const dateStr = formatDate(selectedDate);
    const dateEvents = events[dateStr] || [];
    
    if (dateEvents.length === 0) {
      return <p>No events scheduled.</p>;
    }
    
    return (
      <EventsList>
        {dateEvents.map((event, index) => (
          <EventItem key={index}>
            {event}
            <DeleteButton onClick={() => deleteEvent(dateStr, index)}>×</DeleteButton>
          </EventItem>
        ))}
      </EventsList>
    );
  };

  return (
    <DashboardContainer>
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
          <NavItem className="active">📊 Dashboard</NavItem>
          <NavItem>📅 Calendar</NavItem>
          <NavItem>🏆 Achievements</NavItem>
          <NavItem>📈 Statistics</NavItem>
          <NavItem>⚙️ Settings</NavItem>
        </NavList>
      </Sidebar>

      <MainContent>
        <Header>
          <UserGreeting>
            <h1>Welcome{user?.name ? `, ${user.name}` : ''}! 👋</h1>
            <LevelBadge>Level 1 - 0 XP</LevelBadge>
          </UserGreeting>
        </Header>

        <GridContainer>
          <Card>
            <h1>Progress Overview</h1>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={data}>
                <XAxis dataKey="day" stroke={theme.colors.text} />
                <YAxis hide />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="progress" 
                  stroke={data.length ? getLineColor(data[data.length - 1].progress) : theme.colors.accent} 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h2>Leaderboard</h2>
            <EventsList>
              {sortedLeaderboard.map((leaderboardUser, index) => (
                <EventItem key={leaderboardUser.name}>
                  <div>
                    #{index + 1} {leaderboardUser.name}
                  </div>
                  <span>{leaderboardUser.xp} XP</span>
                </EventItem>
              ))}
            </EventsList>
          </Card>

          <Card>
            <h2>Calendar</h2>
            <CalendarWrapper>
              <CalendarContainer>
                <CalendarHeader>
                  <Button onClick={() => changeMonth(-1)}>
                    ◀ Prev
                  </Button>
                  <MonthTitle>
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </MonthTitle>
                  <Button onClick={() => changeMonth(1)}>
                    Next ▶
                  </Button>
                </CalendarHeader>
                
                {renderDayNames()}
                <CalendarGrid>
                  {renderCalendarDays()}
                </CalendarGrid>
                
                <SelectedDateInfo>
                  <DateTitle>{formatDisplayDate(selectedDate)}</DateTitle>
                  {renderEvents()}
                  <Button primary onClick={openAddEventModal}>
                    Add Event
                  </Button>
                </SelectedDateInfo>
              </CalendarContainer>
            </CalendarWrapper>
          </Card>

          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Habits</h2>
              <Button primary onClick={addHabit}>
                Add Habit
              </Button>
            </div>
            
            <div>
              {tasks.map((task, index) => (
                <EventItem key={index}>
                  {task}
                  <ProgressBarContainer>
                    <div></div>
                  </ProgressBarContainer>
                </EventItem>
              ))}
              
              {showInput && (
                <InputField
                  ref={inputRef}
                  type="text"
                  placeholder="Enter a new habit..."
                  value={newHabit}
                  onChange={(e) => setNewHabit(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onBlur={() => setShowInput(false)}
                />
              )}
              
              {tasks.length === 0 && !showInput && (
                <p>No habits added yet. Click "Add Habit" to get started!</p>
              )}
            </div>
          </Card>
        </GridContainer>
      </MainContent>

      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <h2>Add Event for {formatDisplayDate(selectedDate)}</h2>
              <CloseButton onClick={closeModal}>×</CloseButton>
            </ModalHeader>
            
            <InputField
              type="text"
              placeholder="Enter event description..."
              value={newEvent}
              onChange={(e) => setNewEvent(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addEvent()}
            />
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <Button onClick={closeModal}>Cancel</Button>
              <Button primary onClick={addEvent}>Add</Button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;