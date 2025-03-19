import React, { createContext, useState, useContext, useEffect } from 'react';

const HabitContext = createContext();

export const HabitProvider = ({ children }) => {
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
  const [streak, setStreak] = useState(0); // Added for Dashboard compatibility

  useEffect(() => {
    localStorage.setItem('habitProgress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('habitHistory', JSON.stringify(progressHistory));
  }, [progressHistory]);

  const updateProgress = (categoryId, points) => {
    const currentProgress = progress[categoryId] || 0;
    const newProgress = currentProgress + points;

    setProgress(prev => ({
      ...prev,
      [categoryId]: newProgress,
    }));

    const historyEntry = {
      categoryId,
      points,
      date: new Date().toLocaleDateString(),
      timestamp: new Date().getTime(),
    };

    setProgressHistory(prev => [...prev, historyEntry]);
    setLastAction({
      type: points >= 25 ? 'Major Achievement' : points >= 10 ? 'Daily Goal' : 'Small Win',
      points,
      timestamp: new Date().toLocaleTimeString(),
      categoryId,
    });

    // Update streak (simple implementation)
    const today = new Date().toLocaleDateString();
    const lastUpdate = progressHistory.length > 0 ? progressHistory[progressHistory.length - 1].date : null;
    if (lastUpdate !== today) {
      setStreak(prev => prev + 1);
    }

    return historyEntry;
  };

  const getCategoryProgress = (categoryId) => progress[categoryId] || 0;

  const getCategoryHistory = (categoryId) => {
    return progressHistory
      .filter(entry => entry.categoryId === categoryId)
      .map(entry => ({
        ...entry,
        points: entry.points,
      }));
  };

  const getStreak = () => streak;

  return (
    <HabitContext.Provider value={{
      progress,
      progressHistory,
      updateProgress,
      getCategoryProgress,
      getCategoryHistory,
      lastAction,
      getStreak,
      setStreak,
    }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabit = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabit must be used within a HabitProvider');
  }
  return context;
};

export default HabitContext;