import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { theme } from '../theme';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Calendar from './Calendar'; // Import the new Calendar component

/* 
 * Note: All the existing styled components and other code remains the same
 * Only adding the Calendar component integration and a new tab system
 */

// Add new styled components for the tabs
const TabContainer = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;

const Tab = styled.div`
  padding: 0.75rem 1.5rem;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  font-weight: ${props => props.active ? '600' : '400'};
  background: ${props => props.active ? theme.colors.glassWhite : 'rgba(255, 255, 255, 0.05)'};
  color: ${theme.colors.text};
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.active ? theme.colors.glassWhite : 'rgba(255, 255, 255, 0.1)'};
  }
`;

// Expand the Dashboard component
const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard'); // New state for tab control
  const inputRef = useRef(null);

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
      // Call a fake asynchronous function to simulate fetching leaderboard data.
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
          Array.from({ length: 5 }, (_, i) => ({ 
            day: `Day ${i + 1}`,
            progress: Math.floor(Math.random() * 100) 
          }))
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
          // Additional users can be added here as needed.
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

  /* ================================
     Component Rendering
     ================================ */
  return (
    <DashboardContainer>
      <Sidebar>
        <h2>HabitQuest</h2>
        <NavList>
          <NavItem className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
            📊 Dashboard
          </NavItem>
          <NavItem className={activeTab === 'calendar' ? 'active' : ''} onClick={() => setActiveTab('calendar')}>
            📅 Calendar
          </NavItem>
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

        {activeTab === 'dashboard' && (
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
              <LeaderboardList>
                {sortedLeaderboard.map((leaderboardUser, index) => (
                  <LeaderboardItem key={leaderboardUser.name}>
                    <div>
                      <UserRank>#{index + 1}</UserRank> {leaderboardUser.name}
                    </div>
                    <UserScore>{leaderboardUser.xp} XP</UserScore>
                  </LeaderboardItem>
                ))}
              </LeaderboardList>
            </Card>

            <Card>
              <h2>Achievements</h2>
              <p>Unlock new milestones by progressing through your habits!</p>
            </Card>

            <Card>
              <h2>Tasks</h2>
              <ul>
                {tasks.map((task, index) => (
                  <li key={index}>{task}</li>
                ))}
              </ul>
              <AddHabitButton onClick={addHabit}>+ New Habit</AddHabitButton>
              {showInput && (
                <AddHabitInput 
                  ref={inputRef}
                  value={newHabit} 
                  onChange={(e) => setNewHabit(e.target.value)} 
                  onKeyPress={handleKeyPress} 
                  placeholder="Enter new habit" 
                />
              )}
            </Card>
          </GridContainer>
        )}

        {activeTab === 'calendar' && (
          <div>
            <h1>Habit Calendar</h1>
            <p>Track your daily habits and build streaks!</p>
            <Calendar userHabits={tasks} />
          </div>
        )}
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;
