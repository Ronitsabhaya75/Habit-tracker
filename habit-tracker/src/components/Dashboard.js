import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../theme';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import HabitGame from './HabitGame'; // Add this import

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeSection, setActiveSection] = useState('Dashboard'); // Add this state
  const inputRef = useRef(null);

  // ... (keep existing methods like fetchUserProgress, fakeFetchUserData, etc.)

  // Modify the NavList to include section switching
  return (
    <DashboardContainer>
      <Background>
        {/* ... existing background code ... */}
      </Background>

      <Sidebar>
        <h2>HabitQuest</h2>
        <NavList>
          <NavItem 
            className={activeSection === 'Dashboard' ? 'active' : ''}
            onClick={() => setActiveSection('Dashboard')}
          >
            📊 Dashboard
          </NavItem>
          <NavItem 
            className={activeSection === 'HabitGame' ? 'active' : ''}
            onClick={() => setActiveSection('HabitGame')}
          >
            🎮 Habit Game
          </NavItem>
          <NavItem 
            className={activeSection === 'Achievements' ? 'active' : ''}
            onClick={() => setActiveSection('Achievements')}
          >
            🏆 Achievements
          </NavItem>
          <NavItem 
            className={activeSection === 'Statistics' ? 'active' : ''}
            onClick={() => setActiveSection('Statistics')}
          >
            📈 Statistics
          </NavItem>
          <NavItem 
            className={activeSection === 'Settings' ? 'active' : ''}
            onClick={() => setActiveSection('Settings')}
          >
            ⚙️ Settings
          </NavItem>
        </NavList>
      </Sidebar>

      <MainContent>
        {activeSection === 'Dashboard' && (
          <GridContainer>
            {/* Existing Dashboard content */}
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

            {/* ... other existing Cards ... */}
          </GridContainer>
        )}

        {activeSection === 'HabitGame' && <HabitGame />}

        {activeSection === 'Achievements' && (
          <Card>
            <h2>Achievements</h2>
            <p>Coming soon!</p>
          </Card>
        )}

        {activeSection === 'Statistics' && (
          <Card>
            <h2>Statistics</h2>
            <p>Coming soon!</p>
          </Card>
        )}

        {activeSection === 'Settings' && (
          <Card>
            <h2>Settings</h2>
            <p>Coming soon!</p>
          </Card>
        )}
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;
