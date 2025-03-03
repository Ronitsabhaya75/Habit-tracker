// src/components/BreakthroughGame.js
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';
import { theme } from '../theme';

// Predefined Habit Categories
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

// Styled Components
const GameContainer = styled.div`
  background: ${theme.colors.background};
  color: ${theme.colors.text};
  min-height: 100vh;
  padding: 2rem;
`;

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

const BreakthroughGame = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [progress, setProgress] = useState({});
  const [progressHistory, setProgressHistory] = useState([]);

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
    <GameContainer>
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
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </CategoryItem>
          ))}
        </CategoryList>

        {/* Main Content */}
        <div>
          {selectedCategory ? (
            <div>
              <h2>{selectedCategory.name}</h2>
              <p>{selectedCategory.description}</p>

              {/* Progress Tracking Section */}
              <div>
                <h3>Your Progress</h3>
                {selectedCategory.stages.map(stage => (
                  <div key={stage.level}>
                    <h4>Level {stage.level}: {stage.goal}</h4>
                    <p>Reward: {stage.reward}</p>
                  </div>
                ))}
              </div>

              {/* Progress Actions */}
              <div>
                <button onClick={() => updateProgress(10)}>
                  Small Achievement (+10 pts)
                </button>
                <button onClick={() => updateProgress(50)}>
                  Major Milestone (+50 pts)
                </button>
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
            </div>
          ) : (
            <p>Select a habit category to begin your transformation journey</p>
          )}
        </div>
      </CategoryGrid>
    </GameContainer>
  );
};

export default BreakthroughGame;
