import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../theme';

// Predefined Habit Categories
const PREDEFINED_HABITS = [
  { 
    id: 'smoking', 
    name: 'Smoking Reduction', 
    icon: '🚬',
    description: 'Track and reduce smoking habit',
    levels: [
      { level: 1, goal: 'Reduce cigarettes per day', points: 50 },
      { level: 2, goal: 'Create smoke-free hours', points: 100 },
      { level: 3, goal: 'Complete a smoke-free week', points: 250 }
    ]
  },
  // ... (rest of the PREDEFINED_HABITS from previous implementation)
];

// Styled Components (keep all the styled components from previous implementation)

const HabitGame = () => {
  const [habits, setHabits] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [customHabit, setCustomHabit] = useState('');
  const [habitProgress, setHabitProgress] = useState({});

  const addPredefinedHabit = (habit) => {
    if (!habits.some(h => h.id === habit.id)) {
      setHabits([...habits, {
        ...habit,
        currentLevel: 1,
        totalPoints: 0
      }]);
    }
    setSelectedHabit(habit);
  };

  const addCustomHabit = () => {
    if (customHabit.trim()) {
      const newHabit = {
        id: Date.now().toString(),
        name: customHabit,
        icon: '✨',
        description: 'Custom habit tracking',
        levels: [
          { level: 1, goal: 'Start tracking', points: 50 },
          { level: 2, goal: 'Make progress', points: 100 },
          { level: 3, goal: 'Master the habit', points: 250 }
        ],
        currentLevel: 1,
        totalPoints: 0
      };
      setHabits([...habits, newHabit]);
      setSelectedHabit(newHabit);
      setCustomHabit('');
    }
  };

  const updateHabitProgress = (points) => {
    if (selectedHabit) {
      const currentHabitProgress = habitProgress[selectedHabit.id] || 0;
      const newTotalPoints = currentHabitProgress + points;
      
      setHabitProgress(prev => ({
        ...prev,
        [selectedHabit.id]: newTotalPoints
      }));
    }
  };

  return (
    <GameContainer>
      <SidebarContainer>
        <h2>Habit Tracking Game</h2>
        
        <HabitList>
          {PREDEFINED_HABITS.map(habit => (
            <HabitItem 
              key={habit.id} 
              onClick={() => addPredefinedHabit(habit)}
            >
              <HabitIcon>{habit.icon}</HabitIcon>
              <span>{habit.name}</span>
            </HabitItem>
          ))}
        </HabitList>

        <CustomHabitInput 
          placeholder="Create custom habit"
          value={customHabit}
          onChange={(e) => setCustomHabit(e.target.value)}
        />
        <AddHabitButton onClick={addCustomHabit}>
          Add Custom Habit
        </AddHabitButton>
      </SidebarContainer>

      <MainContent>
        {selectedHabit ? (
          <GameCard>
            <h2>
              {selectedHabit.icon} {selectedHabit.name}
            </h2>
            <p>{selectedHabit.description}</p>
            
            <h3>Current Progress</h3>
            <ProgressBar>
              <Progress 
                progress={
                  (habitProgress[selectedHabit.id] || 0) / 
                  (selectedHabit.levels[2]?.points || 250) * 100
                } 
              />
            </ProgressBar>
            
            <div>
              <h3>Level Challenges</h3>
              {selectedHabit.levels.map((level) => (
                <div key={level.level}>
                  <p>
                    Level {level.level}: {level.goal} 
                    {habitProgress[selectedHabit.id] >= level.points && ' ✅'}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <button onClick={() => updateHabitProgress(10)}>
                Log Progress (+10 pts)
              </button>
              <button onClick={() => updateHabitProgress(25)}>
                Log Major Achievement (+25 pts)
              </button>
            </div>
          </GameCard>
        ) : (
          <p>Select or create a habit to start tracking</p>
        )}
      </MainContent>
    </GameContainer>
  );
};

export default HabitGame;
