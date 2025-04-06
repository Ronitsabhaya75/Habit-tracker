import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const HabitContext = createContext();

export const HabitProvider = ({ children }) => {
  // Load initial state from localStorage
  const loadState = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return defaultValue;
    }
  };

  const [progress, setProgress] = useState(() => loadState('habitProgress', {}));
  const [progressHistory, setProgressHistory] = useState(() => loadState('habitHistory', []));
  const [lastAction, setLastAction] = useState(null);
  const [streak, setStreak] = useState(() => {
    const savedStreak = loadState('habitStreak', 0);
    return typeof savedStreak === 'number' ? savedStreak : 0;
  });
  const [events, setEvents] = useState(() => loadState('habitEvents', {}));
  const [ownedBadges, setOwnedBadges] = useState(() => loadState('habitBadges', []));

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const saveState = (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
      }
    };

    saveState('habitProgress', progress);
    saveState('habitHistory', progressHistory);
    saveState('habitStreak', streak);
    saveState('habitEvents', events);
    saveState('habitBadges', ownedBadges);
  }, [progress, progressHistory, streak, events, ownedBadges]);

  // Validate and update streak
  const updateStreak = useCallback(() => {
    const today = new Date().toLocaleDateString();
    const lastUpdate = progressHistory.length > 0 ? 
      new Date(progressHistory[progressHistory.length - 1].timestamp).toLocaleDateString() : 
      null;

    if (lastUpdate !== today) {
      // Check if last update was yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const wasYesterday = lastUpdate === yesterday.toLocaleDateString();

      setStreak(prev => wasYesterday ? prev + 1 : 1);
    }
  }, [progressHistory]);

  // Update progress with validation
  const updateProgress = useCallback((categoryId, points) => {
    if (typeof points !== 'number' || points <= 0) {
      console.error('Invalid points value:', points);
      return null;
    }

    setProgress(prev => {
      const current = prev[categoryId] || 0;
      return {
        ...prev,
        [categoryId]: current + points,
      };
    });

    const historyEntry = {
      categoryId,
      points,
      date: new Date().toLocaleDateString(),
      timestamp: Date.now(),
    };

    setProgressHistory(prev => [...prev, historyEntry]);
    updateStreak();

    setLastAction({
      type: points >= 25 ? 'Major Achievement' : 
            points >= 10 ? 'Daily Goal' : 'Small Win',
      points,
      timestamp: new Date().toLocaleTimeString(),
      categoryId,
    });

    return historyEntry;
  }, [updateStreak]);

  // Batch update progress
  const batchUpdateProgress = useCallback((updates) => {
    if (!Array.isArray(updates)) {
      console.error('Updates must be an array');
      return;
    }

    setProgress(prev => {
      const newProgress = {...prev};
      updates.forEach(({ categoryId, points }) => {
        if (typeof points === 'number' && points > 0) {
          newProgress[categoryId] = (newProgress[categoryId] || 0) + points;
        }
      });
      return newProgress;
    });

    const historyEntries = updates.map(({ categoryId, points }) => ({
      categoryId,
      points,
      date: new Date().toLocaleDateString(),
      timestamp: Date.now(),
    }));

    setProgressHistory(prev => [...prev, ...historyEntries]);
    updateStreak();
  }, [updateStreak]);

  // Deduct XP with validation
  const deductXP = useCallback((amount) => {
    if (typeof amount !== 'number' || amount <= 0) {
      console.error('Invalid deduction amount:', amount);
      return false;
    }

    const total = Object.values(progress).reduce((sum, p) => sum + p, 0);
    if (amount > total) return false;

    setProgress(prev => {
      const newProgress = {...prev};
      let remaining = amount;
      
      // Deduct from categories with highest XP first
      Object.keys(newProgress)
        .sort((a, b) => newProgress[b] - newProgress[a])
        .forEach(key => {
          if (remaining <= 0) return;
          const deduction = Math.min(remaining, newProgress[key]);
          newProgress[key] -= deduction;
          remaining -= deduction;
        });

      return newProgress;
    });

    return true;
  }, [progress]);

  // Calculate total XP (memoized)
  const calculateTotalXP = useCallback(() => {
    const progressXP = Object.values(progress).reduce((sum, p) => sum + p, 0);
    const todayKey = new Date().toISOString().split('T')[0];
    const tasksXP = (events[todayKey] || []).filter(t => t.completed).length * 10;
    return progressXP + tasksXP;
  }, [progress, events]);

  // Event management functions
  const updateEvent = useCallback((dateKey, taskId, updatedTask) => {
    setEvents(prev => ({
      ...prev,
      [dateKey]: prev[dateKey] ? 
        prev[dateKey].map(task => 
          task.id === taskId ? { ...task, ...updatedTask } : task
        ) : 
        [{ id: taskId, ...updatedTask }]
    }));
  }, []);

  const toggleEventCompletion = useCallback((dateKey, taskId, completed) => {
    setEvents(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].map(task => 
        task.id === taskId ? { ...task, completed } : task
      )
    }));
  }, []);

  return (
    <HabitContext.Provider value={{
      progress,
      progressHistory,
      lastAction,
      streak,
      events,
      ownedBadges,
      updateProgress,
      batchUpdateProgress,
      calculateTotalXP,
      deductXP,
      getCategoryProgress: (categoryId) => progress[categoryId] || 0,
      getCategoryHistory: (categoryId) => 
        progressHistory.filter(entry => entry.categoryId === categoryId),
      getStreak: () => streak,
      setStreak,
      updateEvent,
      toggleEventCompletion,
      setOwnedBadges,
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