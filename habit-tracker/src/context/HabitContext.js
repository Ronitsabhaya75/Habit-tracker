import React, { createContext, useState, useContext, useEffect } from 'react';

const HabitContext = createContext();

export const useHabit = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabit must be used within a HabitProvider');
  }
  return context;
};

export const HabitProvider = ({ children }) => {
  // Load from localStorage if available
  const loadProgress = () => {
    const savedProgress = localStorage.getItem('habitProgress');
    return savedProgress ? JSON.parse(savedProgress) : {};
  };

  const loadHistory = () => {
    const savedHistory = localStorage.getItem('habitHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  };

  const [progress, setProgress] = useState(loadProgress);
  const [progressHistory, setProgressHistory] = useState(loadHistory);
  const [lastAction, setLastAction] = useState(null);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('habitProgress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('habitHistory', JSON.stringify(progressHistory));
  }, [progressHistory]);

  const updateProgress = (categoryId, points) => {
    const currentProgress = progress[categoryId] || 0;
    const newProgress = currentProgress + points;

    // Update progress state
    setProgress(prev => ({
      ...prev,
      [categoryId]: newProgress
    }));

    // Add to history
    const historyEntry = {
      categoryId,
      points,
      date: new Date().toLocaleDateString(),
      timestamp: new Date().getTime()
    };

    setProgressHistory(prev => [...prev, historyEntry]);
    
    // Set last action
    setLastAction({
      type: points >= 25 ? 'Major Achievement' : points >= 10 ? 'Daily Goal' : 'Small Win',
      points: points,
      timestamp: new Date().toLocaleTimeString(),
      categoryId
    });

    return historyEntry;
  };

  const getCategoryProgress = (categoryId) => {
    return progress[categoryId] || 0;
  };

  const getCategoryHistory = (categoryId) => {
    return progressHistory
      .filter(entry => entry.categoryId === categoryId)
      .map(entry => ({
        ...entry,
        points: entry.points
      }));
  };

  return (
    <HabitContext.Provider value={{
      progress,
      progressHistory,
      updateProgress,
      getCategoryProgress,
      getCategoryHistory,
      lastAction
    }}>
      {children}
    </HabitContext.Provider>
  );
};

export default HabitContext;
