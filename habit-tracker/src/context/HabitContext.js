// ✅ HabitContext.js (Updated with persistence, streak, and XP deduction)
import React, { createContext, useContext, useState, useEffect } from 'react';

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

  const loadBadges = () => {
    const saved = localStorage.getItem('habitBadges');
    return saved ? JSON.parse(saved) : [];
  };

  const [progress, setProgress] = useState(loadProgress);
  const [progressHistory, setProgressHistory] = useState(loadHistory);
  const [lastAction, setLastAction] = useState(null);
  const [streak, setStreak] = useState(0);
  const [events, setEvents] = useState({});
  const [ownedBadges, setOwnedBadges] = useState(loadBadges);

  useEffect(() => {
    localStorage.setItem('habitProgress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('habitHistory', JSON.stringify(progressHistory));
  }, [progressHistory]);

  useEffect(() => {
    localStorage.setItem('habitBadges', JSON.stringify(ownedBadges));
  }, [ownedBadges]);

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

    const today = new Date().toLocaleDateString();
    const lastUpdate = progressHistory.length > 0 ? progressHistory[progressHistory.length - 1].date : null;
    if (lastUpdate !== today) {
      setStreak(prev => prev + 1);
    }

    return historyEntry;
  };

  const updateEvent = (dateKey, taskId, updatedTask) => {
    setEvents(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].map(task => task.id === taskId ? { ...task, ...updatedTask } : task)
    }));
  };

  const toggleEventCompletion = (dateKey, taskId, completed) => {
    setEvents(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].map(task => task.id === taskId ? { ...task, completed } : task)
    }));
  };

  const calculateTotalXP = () => {
    const progressXP = Object.values(progress).reduce((sum, p) => sum + p, 0);
    const todayKey = new Date().toISOString().split('T')[0];
    const tasksXP = events[todayKey]?.filter(task => task.completed).length * 10 || 0;
    return progressXP + tasksXP;
  };

  const deductXP = (amount) => {
    const total = calculateTotalXP();
    if (amount > total) return false;

    const sortedDates = Object.keys(progress).sort();
    let remaining = amount;
    const newProgress = { ...progress };

    for (const key of sortedDates) {
      const deduction = Math.min(remaining, newProgress[key]);
      newProgress[key] -= deduction;
      remaining -= deduction;
      if (remaining <= 0) break;
    }

    setProgress(newProgress);
    return true;
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
      events,
      progressHistory,
      updateProgress,
      updateEvent,
      toggleEventCompletion,
      calculateTotalXP,
      getCategoryProgress,
      getCategoryHistory,
      lastAction,
      getStreak,
      setStreak,
      ownedBadges,
      setOwnedBadges,
      deductXP,
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