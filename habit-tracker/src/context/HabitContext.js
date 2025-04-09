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

  // State
  const [habits, setHabits] = useState(() => loadState('habits', []));
  const [progress, setProgress] = useState(() => loadState('habitProgress', {}));
  const [progressHistory, setProgressHistory] = useState(() => loadState('habitHistory', []));
  const [lastAction, setLastAction] = useState(null);
  const [streak, setStreak] = useState(() => {
    const savedStreak = loadState('habitStreak', 0);
    return typeof savedStreak === 'number' ? savedStreak : 0;
  });
  const [events, setEvents] = useState(() => loadState('habitEvents', {}));
  const [ownedBadges, setOwnedBadges] = useState(() => loadState('habitBadges', []));
  const [missedTasks, setMissedTasks] = useState(() => loadState('missedTasks', []));

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const saveState = (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
      }
    };

    saveState('habits', habits);
    saveState('habitProgress', progress);
    saveState('habitHistory', progressHistory);
    saveState('habitStreak', streak);
    saveState('habitEvents', events);
    saveState('habitBadges', ownedBadges);
    saveState('missedTasks', missedTasks);
  }, [habits, progress, progressHistory, streak, events, ownedBadges, missedTasks]);

  // Helper to get yesterday's date string
  const getYesterdayDate = useCallback(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toLocaleDateString();
  }, []);

  // Validate and update streak
  const updateStreak = useCallback(() => {
    const today = new Date().toLocaleDateString();
    const lastUpdate = progressHistory.length > 0
      ? new Date(progressHistory[progressHistory.length - 1].timestamp).toLocaleDateString()
      : null;

    if (lastUpdate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const wasYesterday = lastUpdate === yesterday.toLocaleDateString();
      setStreak(prev => (wasYesterday ? prev + 1 : 1));
    }
  }, [progressHistory]);

  // Deduct XP - defined before checkMissedTasks
  const deductXP = useCallback((amount) => {
    if (typeof amount !== 'number' || amount <= 0) {
      console.error('Invalid deduction amount:', amount);
      return false;
    }

    const total = Object.values(progress).reduce((sum, p) => sum + p, 0);
    if (amount > total) return false;

    setProgress(prev => {
      const newProgress = { ...prev };
      let remaining = amount;
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

  // Check for and handle missed tasks - now can safely use deductXP
  const checkMissedTasks = useCallback(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().split('T')[0];
    
    const yesterdayTasks = events[yesterdayKey]?.filter(task => 
      task.isHabitTask && !task.completed
    ) || [];

    if (yesterdayTasks.length > 0) {
      const newMissedTasks = [];
      const deductions = [];

      yesterdayTasks.forEach(task => {
        const habit = habits.find(h => h.id === task.habitId);
        if (!habit) return;

        const xpDeduction = task.xpDeduction || 15;
        if (deductXP(xpDeduction)) {
          deductions.push({
            habitId: task.habitId,
            points: -xpDeduction,
            taskId: task.id
          });
          newMissedTasks.push(task);
        }
      });

      if (deductions.length > 0) {
        setMissedTasks(prev => [...prev, ...newMissedTasks]);
        
        deductions.forEach(deduction => {
          setLastAction({
            type: 'Task Missed',
            points: deduction.points,
            timestamp: new Date().toLocaleTimeString(),
            categoryId: deduction.habitId,
            message: `Missed task: -${Math.abs(deduction.points)} XP`
          });
        });
      }
    }
  }, [events, habits, deductXP]);

  // Initialize daily task checker
  useEffect(() => {
    // Run check at midnight
    const now = new Date();
    const midnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0, 0, 0
    );
    const timeUntilMidnight = midnight - now;

    const timeoutId = setTimeout(() => {
      checkMissedTasks();
      // Set up daily checks
      const intervalId = setInterval(checkMissedTasks, 24 * 60 * 60 * 1000);
      return () => clearInterval(intervalId);
    }, timeUntilMidnight);

    return () => clearTimeout(timeoutId);
  }, [checkMissedTasks]);

  // Add a new habit with enhanced options
  const addHabit = useCallback((habitData) => {
    const newHabit = {
      id: Date.now(),
      name: habitData.name,
      description: habitData.description || '',
      frequency: habitData.frequency || 'daily',
      isTask: habitData.isTask || false,
      taskFrequency: habitData.taskFrequency || null,
      taskStartDate: habitData.taskStartDate || null,
      xpReward: habitData.isTask ? 30 : 20, // More XP for tasks
      xpDeduction: habitData.isTask ? 15 : 0, // Deduction for missing tasks
      createdDate: new Date().toISOString(),
      completedDates: [],
      streak: 0,
      bestStreak: 0,
      category: habitData.category || 'general'
    };

    setHabits(prev => [...prev, newHabit]);

    // If it's a scheduled task, add to calendar
    if (habitData.isTask && habitData.taskStartDate) {
      scheduleHabitTask(newHabit);
    }

    return newHabit;
  }, []);

  // Schedule a habit task in the calendar
  const scheduleHabitTask = useCallback((habit) => {
    if (!habit.isTask || !habit.taskStartDate) return;

    const startDate = new Date(habit.taskStartDate);
    const todayKey = new Date().toISOString().split('T')[0];
    
    // Calculate next occurrence dates based on frequency
    const occurrences = [startDate];
    
    if (habit.taskFrequency === 'weekly' || habit.taskFrequency === 'biweekly') {
      const daysToAdd = habit.taskFrequency === 'weekly' ? 7 : 14;
      for (let i = 1; i <= 4; i++) { // Schedule next 4 occurrences
        const nextDate = new Date(startDate);
        nextDate.setDate(nextDate.getDate() + (daysToAdd * i));
        occurrences.push(nextDate);
      }
    }

    // Add to events
    setEvents(prev => {
      const newEvents = { ...prev };
      occurrences.forEach(date => {
        const dateKey = date.toISOString().split('T')[0];
        const taskId = `${habit.id}-${dateKey}`;
        
        if (!newEvents[dateKey]) {
          newEvents[dateKey] = [];
        }
        
        // Only add if not already exists
        if (!newEvents[dateKey].some(t => t.id === taskId)) {
          newEvents[dateKey].push({
            id: taskId,
            habitId: habit.id,
            title: habit.name,
            description: habit.description,
            completed: false,
            isHabitTask: true,
            xpReward: habit.xpReward,
            xpDeduction: habit.xpDeduction,
            dueDate: dateKey,
            frequency: habit.taskFrequency
          });
        }
      });
      return newEvents;
    });
  }, []);

  // Complete a habit/task
  const completeHabit = useCallback((habitId, isTaskCompletion = false) => {
    const today = new Date().toLocaleDateString();
    const habit = habits.find(h => h.id === habitId);
    
    if (!habit) return null;

    // Check if already completed today (for non-task habits)
    if (!isTaskCompletion && habit.completedDates.includes(today)) {
      return null;
    }

    // Update habit completion and streaks
    setHabits(prev => prev.map(h => {
      if (h.id !== habitId) return h;
      
      const newCompletedDates = [...h.completedDates, today];
      const newStreak = (h.completedDates.includes(getYesterdayDate()) ? h.streak : 0) + 1;
      
      return {
        ...h,
        completedDates: newCompletedDates,
        streak: newStreak,
        bestStreak: Math.max(h.bestStreak, newStreak)
      };
    }));

    // Award XP
    const xpToAdd = isTaskCompletion ? 
      (habit.xpReward || 30) : // Task completion
      (habit.xpReward || 20);   // Regular habit completion
    
    setProgress(prev => ({
      ...prev,
      [habitId]: (prev[habitId] || 0) + xpToAdd
    }));

    const historyEntry = {
      categoryId: habitId,
      points: xpToAdd,
      date: today,
      timestamp: Date.now(),
      type: isTaskCompletion ? 'task_completion' : 'habit_completion'
    };

    setProgressHistory(prev => [...prev, historyEntry]);
    updateStreak();

    setLastAction({
      type: isTaskCompletion ? 'Task Completed' : 'Habit Completed',
      points: xpToAdd,
      timestamp: new Date().toLocaleTimeString(),
      categoryId: habitId,
      message: `${isTaskCompletion ? 'Task' : 'Habit'} completed: +${xpToAdd} XP`
    });

    return historyEntry;
  }, [habits, getYesterdayDate, updateStreak]);

  // Update progress (kept for compatibility with existing code)
  const updateProgress = useCallback((categoryId, points) => {
    if (typeof points !== 'number' || points <= 0) {
      console.error('Invalid points value:', points);
      return null;
    }

    setProgress(prev => {
      const current = prev[categoryId] || 0;
      return { ...prev, [categoryId]: current + points };
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
      type: points >= 25 ? 'Major Achievement' : points >= 10 ? 'Daily Goal' : 'Small Win',
      points,
      timestamp: new Date().toLocaleTimeString(),
      categoryId,
    });

    return historyEntry;
  }, [updateStreak]);

  // Batch update progress (kept for compatibility)
  const batchUpdateProgress = useCallback((updates) => {
    if (!Array.isArray(updates)) {
      console.error('Updates must be an array');
      return;
    }

    setProgress(prev => {
      const newProgress = { ...prev };
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

  // Calculate total XP
  const calculateTotalXP = useCallback(() => {
    const progressXP = Object.values(progress).reduce((sum, p) => sum + p, 0);
    const todayKey = new Date().toISOString().split('T')[0];
    const tasksXP = (events[todayKey] || []).filter(t => t.completed).length * 10;
    return progressXP + tasksXP;
  }, [progress, events]);

  // Event management
  const updateEvent = useCallback((dateKey, taskId, updatedTask) => {
    setEvents(prev => ({
      ...prev,
      [dateKey]: prev[dateKey]
        ? prev[dateKey].map(task => (task.id === taskId ? { ...task, ...updatedTask } : task))
        : [{ id: taskId, ...updatedTask }],
    }));
  }, []);

  const toggleEventCompletion = useCallback((dateKey, taskId, completed) => {
    setEvents(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].map(task =>
        task.id === taskId ? { ...task, completed } : task
      ),
    }));
  }, []);

  return (
    <HabitContext.Provider
      value={{
        habits,
        progress,
        progressHistory,
        lastAction,
        streak,
        events,
        ownedBadges,
        missedTasks,
        addHabit,
        completeHabit,
        completeTask: (taskId) => {
          // Special completion for tasks
          const task = Object.values(events)
            .flat()
            .find(t => t.id === taskId);
          if (task) {
            return completeHabit(task.habitId, true);
          }
          return null;
        },
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
        getHabitById: (id) => habits.find(h => h.id === id),
        getTasksForDate: (date) => {
          const dateKey = new Date(date).toISOString().split('T')[0];
          return events[dateKey] || [];
        }
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