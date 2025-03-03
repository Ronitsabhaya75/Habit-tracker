import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../theme';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Predefined Habit Categories from BreakthroughGame
const HABIT_CATEGORIES = [
  { 
    id: 'addiction', 
    name: 'Addiction Recovery', 
    icon: '🚭',
    description: 'Break free from harmful dependencies',
    stages: [
      { level: 1, goal: 'First Week Clean', points: 50, reward: 'Self-Care Package' },
      { level: 2, goal: 'One Month Milestone', points: 200, reward: 'Wellness Session' },
      { level: 3, goal: 'Quarterly Achievement', points: 500, reward: 'Personal Experience Gift' }
    ]
  },
  { 
    id: 'fitness', 
    name: 'Fitness Transformation', 
    icon: '💪',
    description: 'Build a healthier, stronger you',
    stages: [
      { level: 1, goal: 'Consistent Workouts', points: 75, reward: 'Healthy Meal Coupon' },
      { level: 2, goal: 'Nutrition Tracking', points: 250, reward: 'Fitness Gear' },
      { level: 3, goal: 'Body Composition Change', points: 600, reward: 'Personal Training' }
    ]
  }
];

// Styled Components from Dashboard and BreakthroughGame
const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: ${theme.colors.background};
`;

const Sidebar = styled.div`
  width: 250px;
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem 1rem;
  color: ${theme.colors.text};
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  
  h2 {
    margin-bottom: 2rem;
    text-align: center;
  }
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover, &.active {
    background: ${theme.colors.accent};
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

// BreakthroughGame Components
const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 2rem;
`;

const CategoryList = styled.div`
  background: rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 1rem;
`;

const CategoryItem = styled.div`
  cursor: pointer;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  background: ${props => props.active ? theme.colors.accent : 'transparent'};
  
  &:hover {
    background: rgba(255,255,255,0.2);
  }
`;

const Button = styled.button`
  background: ${theme.colors.accent};
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  color: white;
  font-weight: bold;
  cursor: pointer;
  margin-right: 1rem;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeSection, setActiveSection] = useState('Dashboard');
  const inputRef = useRef(null);
  
  // BreakthroughGame states
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [progress, setProgress] = useState({});
  const [progressHistory, setProgressHistory] = useState([]);

  // Simulated data fetch
  useEffect(() => {
    // Simulate fetching user progress data
    const fakeFetchUserData = () => {
      const generateData = () => {
        return Array.from({ length: 30 }, (_, i) => ({
          day: `Day ${i + 1}`,
          progress: Math.floor(Math.random() * 100)
        }));
      };
      
      setTimeout(() => {
        setData(generateData());
        setLoading(false);
      }, 1000);
    };
    
    fakeFetchUserData();
    
    // Simulate fetching leaderboard data
    setTimeout(() => {
      setLeaderboard([
        { name: "Alex", points: 892 },
        { name: "Jordan", points: 775 },
        { name: "Taylor", points: 731 },
        { name: "Casey", points: 654 },
        { name: "Riley", points: 621 }
      ]);
    }, 1200);
  }, []);

  // Helper function for progress line color
  const getLineColor = (progress) => {
    if (progress < 30) return "#FF5555";
    if (progress < 70) return "#FFD700";
    return "#55FF55";
  };

  // BreakthroughGame function for updating progress
  const updateProgress = (points) => {
    if (!selectedCategory) return;

    const currentProgress = progress[selectedCategory.id] || 0;
    const newProgress = currentProgress + points;

    setProgress(prev => ({
      ...prev,
      [selectedCategory.id]: newProgress
    }));

    setProgressHistory(prev => [
      ...prev, 
      { 
        category: selectedCategory.name, 
        points: points, 
        date: new Date().toLocaleDateString() 
      }
    ]);
  };

  return (
    <DashboardContainer>
      <Background />

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
            className={activeSection === 'BreakthroughGame' ? 'active' : ''}
            onClick={() => setActiveSection('BreakthroughGame')}
          >
            🎮 Breakthrough Game
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
            {/* Progress Overview Card */}
            <Card>
              <h2>Progress Overview</h2>
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

            {/* Other Dashboard Cards */}
            <Card>
              <h2>Leaderboard</h2>
              {leaderboard.map((user, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>{index + 1}. {user.name}</span>
                  <span>{user.points} pts</span>
                </div>
              ))}
            </Card>

            <Card>
              <h2>Habits</h2>
              {/* Placeholder for habits list */}
              <p>Your habits will appear here</p>
            </Card>
          </GridContainer>
        )}

        {activeSection === 'BreakthroughGame' && (
          <div>
            <h1>BreakThrough: Your Transformation Journey</h1>
            
            <CategoryGrid>
              {/* Category Selection */}
              <CategoryList>
                {HABIT_CATEGORIES.map(category => (
                  <CategoryItem 
                    key={category.id}
                    active={selectedCategory?.id === category.id}
                    onClick={() => setSelectedCategory(category)}
                  >
                    <span style={{ marginRight: '10px' }}>{category.icon}</span>
                    <span>{category.name}</span>
                  </CategoryItem>
                ))}
              </CategoryList>

              {/* Main Content */}
              <div>
                {selectedCategory ? (
                  <Card>
                    <h2>{selectedCategory.name}</h2>
                    <p>{selectedCategory.description}</p>

                    {/* Progress Tracking Section */}
                    <div style={{ marginBottom: '20px' }}>
                      <h3>Your Progress</h3>
                      {selectedCategory.stages.map(stage => (
                        <div key={stage.level} style={{ marginBottom: '15px' }}>
                          <h4>Level {stage.level}: {stage.goal}</h4>
                          <p>Reward: {stage.reward}</p>
                          <div style={{ 
                            height: '10px', 
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '5px',
                            marginTop: '5px'
                          }}>
                            <div style={{
                              height: '100%',
                              width: `${Math.min(100, ((progress[selectedCategory.id] || 0) / stage.points) * 100)}%`,
                              background: theme.colors.accent,
                              borderRadius: '5px',
                              transition: 'width 0.5s ease'
                            }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Progress Actions */}
                    <div style={{ marginBottom: '20px' }}>
                      <Button onClick={() => updateProgress(10)}>
                        Small Achievement (+10 pts)
                      </Button>
                      <Button onClick={() => updateProgress(50)}>
                        Major Milestone (+50 pts)
                      </Button>
                    </div>

                    {/* Progress Chart */}
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={progressHistory}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="points" stroke={theme.colors.accent} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>
                ) : (
                  <Card>
                    <p>Select a habit category to begin your transformation journey</p>
                  </Card>
                )}
              </div>
            </CategoryGrid>
          </div>
        )}

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
