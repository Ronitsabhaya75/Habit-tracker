/**
 * Dashboard Component
 *
 * This file implements the Dashboard component for the HabitQuest application.
 * It displays an interactive dashboard including:
 *  - A sidebar with navigation items.
 *  - A header that welcomes the user and shows their level.
 *  - Multiple cards that render:
 *      • A progress overview using a responsive line chart.
 *      • A leaderboard showing users ranked by XP.
 *      • A placeholder for achievements.
 *      • A task list where users can add new habits.
 *
 * The component uses React hooks (useState, useEffect, useRef) for state management and side effects,
 * styled-components for CSS-in-JS styling, and recharts for data visualization.
 * It also integrates with a custom authentication context (useAuth) to obtain the current user's information.
 *
 * Simulated asynchronous functions (fakeFetchUserData and fakeFetchLeaderboardData) are used to mimic API calls.
 * This code is organized in a modular way, where each styled component and function is clearly documented.
 */

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { theme } from '../theme';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

/* ================================
   Styled Components Definitions
   ================================ */

/**
 * DashboardContainer:
 * Main container that wraps the entire dashboard.
 * Uses flex layout, full viewport height, and a gradient background.
 */
const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${theme.colors.primaryGradient};
  color: ${theme.colors.text};
`;

/**
 * Sidebar:
 * Fixed sidebar positioned to the left containing navigation links.
 * Styled with padding, a semi-transparent background, and a blur effect.
 */
const Sidebar = styled.div`
  width: 250px;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-right: 1px solid ${theme.colors.borderWhite};
  backdrop-filter: blur(8px);
`;

/**
 * NavList:
 * Unordered list used for the navigation items in the sidebar.
 * Removes default list styling and adds top margin.
 */
const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 2rem;
`;

/**
 * NavItem:
 * Individual navigation item with padding, margin, hover effect, and active state styling.
 * Displays an icon and text using flex layout.
 */
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

/**
 * MainContent:
 * Container for the main content of the dashboard.
 * Positioned to the right of the sidebar with extra padding.
 */
const MainContent = styled.div`
  flex: 1;
  padding: 3rem;
  margin-left: 250px;
`;

/**
 * Header:
 * Top header area of the main content that displays the welcome message and level badge.
 * Uses flex layout to space out its children.
 */
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

/**
 * UserGreeting:
 * Displays the welcome message including the user's name.
 * Nested styles target the h1 tag and any span to emphasize the username.
 */
const UserGreeting = styled.div`
  h1 {
    font-size: 2.5rem;
    span {
      color: ${theme.colors.accent};
    }
  }
`;

/**
 * LevelBadge:
 * Visual badge that shows the user's level and XP.
 * Uses background color, padding, rounded corners, and a shadow for a card-like appearance.
 */
const LevelBadge = styled.div`
  background: ${theme.colors.secondary};
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  box-shadow: ${theme.shadows.card};
`;

/**
 * GridContainer:
 * Layout container that arranges multiple cards in a grid.
 * Uses a two-column layout with a 2:1 ratio and a gap between grid items.
 */
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
  align-items: start;
`;

/**
 * Card:
 * Reusable card component used for various sections (progress overview, leaderboard, tasks, achievements).
 * Styled with a semi-transparent background, padding, rounded corners, and a subtle border.
 */
const Card = styled.div`
  background: ${theme.colors.glassWhite};
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid ${theme.colors.borderWhite};
  backdrop-filter: blur(8px);
`;

/**
 * ProgressBarContainer:
 * (Currently unused in the render) Container for a progress bar element.
 * Includes a background bar with a nested div representing the current progress.
 */
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

/**
 * AddHabitInput:
 * Input field for adding a new habit or task.
 * Styled to have consistent padding, width, margin, and border styling.
 */
const AddHabitInput = styled.input`
  width: calc(100% - 20px);
  padding: 8px;
  margin-top: 1rem;
  border: 1px solid ${theme.colors.borderWhite};
  border-radius: 8px;
`;

/**
 * AddHabitButton:
 * Button that triggers the input field to add a new habit.
 * Styled with background color, text color, padding, and hover effects.
 */
const AddHabitButton = styled.button`
  background: ${theme.colors.accent};
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 0.5rem;
  &:hover {
    background: ${theme.colors.secondary};
  }
`;

/**
 * LeaderboardList:
 * Unordered list that displays the leaderboard entries.
 * Resets default list styling and adds a top margin.
 */
const LeaderboardList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 1rem;
`;

/**
 * LeaderboardItem:
 * Each item in the leaderboard.
 * Uses flex layout to space out the rank, username, and score, with hover styling.
 */
const LeaderboardItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin: 0.5rem 0;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

/**
 * UserRank:
 * Styles the rank number of a user in the leaderboard.
 * Uses accent color and bold font for emphasis.
 */
const UserRank = styled.span`
  color: ${theme.colors.accent};
  font-weight: 600;
`;

/**
 * UserScore:
 * Styles the XP score of a user in the leaderboard.
 * Uses the secondary color from the theme.
 */
const UserScore = styled.span`
  color: ${theme.colors.secondary};
`;

/* ================================
   Dashboard Component Implementation
   ================================ */

const Dashboard = () => {
  // Retrieve the current user information from the authentication context.
  const { user } = useAuth();

  // State to hold progress data for the line chart. Initially empty.
  const [data, setData] = useState([]);
  // Loading flag to indicate data fetching status.
  const [loading, setLoading] = useState(true);
  // State for tasks/habits added by the user.
  const [tasks, setTasks] = useState([]);
  // State to store the current value of the "new habit" input.
  const [newHabit, setNewHabit] = useState("");
  // Flag to determine whether to show the new habit input field.
  const [showInput, setShowInput] = useState(false);
  // State to hold leaderboard data.
  const [leaderboard, setLeaderboard] = useState([]);
  // useRef hook to access the DOM node of the habit input field for auto-focusing.
  const inputRef = useRef(null);

  /**
   * useEffect: Fetch leaderboard data when the component first mounts.
   */
  useEffect(() => {
    fetchLeaderboard();
  }, []);

  /**
   * useEffect: Whenever the 'user' changes, check if the user is already on the leaderboard.
   * If not, add the user with an initial XP of 0.
   */
  useEffect(() => {
    if (user && !leaderboard.some(entry => entry.name === user.name)) {
      setLeaderboard(prev => [...prev, { name: user.name, xp: 0 }]);
    }
  }, [user, leaderboard]);

  // Create a sorted copy of the leaderboard, ordering users by XP in descending order.
  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.xp - a.xp);

  /**
   * useEffect: Fetch user progress data when the component first mounts.
   */
  useEffect(() => {
    fetchUserProgress();
  }, []);

  /**
   * useEffect: When the 'showInput' flag is true and the input element is rendered,
   * automatically set focus to the new habit input field.
   */
  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  /**
   * fetchUserProgress:
   * Asynchronously fetches simulated user progress data.
   * Sets the loading state during the fetch and updates the 'data' state with the results.
   */
  const fetchUserProgress = async () => {
    try {
      setLoading(true);
      // Call a fake asynchronous function to simulate fetching user progress.
      const userProgress = await fakeFetchUserData();
      setData(userProgress);
    } catch (error) {
      console.error("Error fetching user progress:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * fetchLeaderboard:
   * Asynchronously fetches simulated leaderboard data.
   * Updates the 'leaderboard' state with the fetched data.
   */
  const fetchLeaderboard = async () => {
    try {
      // Call a fake asynchronous function to simulate fetching leaderboard data.
      const leaderboardData = await fakeFetchLeaderboardData();
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    }
  };

  /**
   * fakeFetchUserData:
   * Simulates an API call to fetch user progress data.
   * Returns an array of objects with a 'progress' property containing random values.
   */
  const fakeFetchUserData = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generates an array of 5 progress items with random progress values (0-99).
        resolve(
          Array.from({ length: 5 }, (_, i) => ({ progress: Math.floor(Math.random() * 100) }))
        );
      }, 1000);
    });
  };

  /**
   * fakeFetchLeaderboardData:
   * Simulates an API call to fetch leaderboard data.
   * Returns an array of objects representing users and their XP scores.
   */
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

  /**
   * addHabit:
   * Handler function to reveal the new habit input field.
   */
  const addHabit = () => {
    setShowInput(true);
  };

  /**
   * handleKeyPress:
   * Handles the key press event in the new habit input field.
   * When the 'Enter' key is pressed and the input is non-empty, adds the habit to the tasks list,
   * clears the input field, and hides the input.
   *
   * @param {object} e - The key press event.
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && newHabit.trim()) {
      setTasks([...tasks, newHabit.trim()]);
      setNewHabit("");
      setShowInput(false);
    }
  };

  /**
   * getLineColor:
   * Determines the stroke color for the progress line in the chart based on the progress value.
   *
   * @param {number} progress - The current progress value.
   * @returns {string} - A color string based on the progress thresholds.
   */
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
      {/* Sidebar section with navigation items */}
      <Sidebar>
        <h2>HabitQuest</h2>
        <NavList>
          <NavItem className="active">📊 Dashboard</NavItem>
          <NavItem>🏆 Achievements</NavItem>
          <NavItem>📈 Statistics</NavItem>
          <NavItem>⚙️ Settings</NavItem>
        </NavList>
      </Sidebar>

      {/* Main content area */}
      <MainContent>
        {/* Header with welcome message and level badge */}
        <Header>
          <UserGreeting>
            <h1>Welcome{user?.name ? `, ${user.name}` : ''}! 👋</h1>
            <LevelBadge>Level 1 - 0 XP</LevelBadge>
          </UserGreeting>
        </Header>

        {/* Grid container for multiple dashboard cards */}
        <GridContainer>
          {/* Card for displaying progress overview via a responsive line chart */}
          <Card>
            <h1>Progress Overview</h1>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={data}>
                {/* XAxis uses 'day' property (assumed in data) and applies theme text color */}
                <XAxis dataKey="day" stroke={theme.colors.text} />
                {/* YAxis is hidden to keep the chart minimalistic */}
                <YAxis hide />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="progress" 
                  // Determines the line color based on the last progress value, defaults to theme accent color
                  stroke={data.length ? getLineColor(data[data.length - 1].progress) : theme.colors.accent} 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Card for displaying the leaderboard */}
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

          {/* Card for achievements (currently a placeholder) */}
          <Card>
            <h2>Achievements</h2>
            <p>Unlock new milestones by progressing through your habits!</p>
          </Card>

          {/* Card for task management */}
          <Card>
            <h2>Tasks</h2>
            <ul>
              {tasks.map((task, index) => (
                <li key={index}>{task}</li>
              ))}
            </ul>
            <AddHabitButton onClick={addHabit}>+ New Habit</AddHabitButton>
            {/* Conditionally render the input field for adding a new habit */}
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
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;
