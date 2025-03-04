import React, { createContext, useState, useContext } from 'react';

const HabitContext = createContext();

export const useHabit = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabit must be used within a HabitProvider');
  }
  return context;
};

export const HabitProvider = ({ children }) => {
  const [progress, setProgress] = useState({});
  const [progressHistory, setProgressHistory] = useState([]);

  const updateProgress = (categoryId, points) => {
    const currentProgress = progress[categoryId] || 0;
    const newProgress = currentProgress + points;

    setProgress(prev => ({
      ...prev,
      [categoryId]: newProgress
    }));

    setProgressHistory(prev => [
      ...prev,
      {
        categoryId,
        points,
        date: new Date().toLocaleDateString(),
        timestamp: new Date().getTime()
      }
    ]);
  };

  const getCategoryProgress = (categoryId) => {
    return progress[categoryId] || 0;
  };

  const getCategoryHistory = (categoryId) => {
    return progressHistory.filter(entry => entry.categoryId === categoryId);
  };

  return (
    <HabitContext.Provider value={{
      progress,
      progressHistory,
      updateProgress,
      getCategoryProgress,
      getCategoryHistory
    }}>
      {children}
    </HabitContext.Provider>
  );
};

export default HabitContext; 