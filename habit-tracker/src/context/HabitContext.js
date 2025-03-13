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

  const loadStreak = () => {
    const savedStreak = localStorage.getItem('habitStreak');
    return savedStreak ? parseInt(savedStreak, 10) : 0;
  };

  const [progress, setProgress] = useState(loadProgress);
  const [progressHistory, setProgressHistory] = useState(loadHistory);
  const [lastAction, setLastAction] = useState(null);
  const [streak, setStreak] = useState(loadStreak);

  useEffect(() => {
    localStorage.setItem('habitProgress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('habitHistory', JSON.stringify(progressHistory));
  }, [progressHistory]);

  useEffect(() => {
    localStorage.setItem('habitStreak', streak.toString());
  }, [streak]);

  const updateProgress = (categoryId, points, actionType = 'General') => {
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
      type: actionType,
      points,
      timestamp: new Date().toLocaleTimeString(),
      categoryId,
    });

    const today = new Date().toLocaleDateString();
    const lastUpdate = progressHistory.length > 0 ? progressHistory[progressHistory.length - 1].date : null;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const wasYesterday = lastUpdate === yesterday.toLocaleDateString();

    if (!lastUpdate || wasYesterday) {
      setStreak(prev => (today !== lastUpdate ? prev + 1 : prev));
    } else if (lastUpdate !== today) {
      setStreak(1);
    }

    return historyEntry;
  };

  const getCategoryProgress = (categoryId) => progress[categoryId] || 0;

  const getCategoryHistory = (categoryId) => {
    return progressHistory
      .filter(entry => entry.categoryId === categoryId)
      .map(entry => ({
        ...entry,
        points: getCategoryProgress(categoryId),
      }));
  };

  const getStreak = () => streak;

  const resetStreak = () => setStreak(0);

  return (
    <HabitContext.Provider
      value={{
        progress,
        progressHistory,
        updateProgress,
        getCategoryProgress,
        getCategoryHistory,
        lastAction,
        getStreak,
        setStreak,
        resetStreak,
      }}
    >
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