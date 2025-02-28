import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const { user } = useAuth();
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [nextLevelXp, setNextLevelXp] = useState(100);
  const [streaks, setStreaks] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [completedHabits, setCompletedHabits] = useState([]);
  const [habits, setHabits] = useState([]);

  // Load game data from localStorage on initial load
  useEffect(() => {
    if (user) {
      const storedGameData = localStorage.getItem(`gameData-${user.name}`);

      if (storedGameData) {
        const parsedData = JSON.parse(storedGameData);
        setLevel(parsedData.level || 1);
        setXp(parsedData.xp || 0);
        setNextLevelXp(parsedData.nextLevelXp || 100);
        setStreaks(parsedData.streaks || 0);
        setAchievements(parsedData.achievements || []);
        setCompletedHabits(parsedData.completedHabits || []);
        setHabits(parsedData.habits || []);
      }
    }
  }, [user]);

  // Save game data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      const gameData = {
        level,
        xp,
        nextLevelXp,
        streaks,
        achievements,
        completedHabits,
        habits
      };

      localStorage.setItem(`gameData-${user.name}`, JSON.stringify(gameData));
    }
  }, [level, xp, nextLevelXp, streaks, achievements, completedHabits, habits, user]);

  // Add XP and handle level up
  const addXp = (amount) => {
    const newXp = xp + amount;

    if (newXp >= nextLevelXp) {
      // Level up
      const newLevel = level + 1;
      const remainingXp = newXp - nextLevelXp;
      const newNextLevelXp = nextLevelXp + Math.floor(nextLevelXp * 0.3); // 30% more XP needed for next level

      setLevel(newLevel);
      setXp(remainingXp);
      setNextLevelXp(newNextLevelXp);

      // Add level up achievement
      if (!achievements.some(a => a.id === `level-${newLevel}`)) {
        addAchievement({
          id: `level-${newLevel}`,
          title: `Reached Level ${newLevel}`,
          description: `Congratulations on reaching Level ${newLevel}!`,
          xpReward: 0,
          icon: '🏆'
        });
      }
    } else {
      setXp(newXp);
    }
  };

  // Add a new achievement
  const addAchievement = (achievement) => {
    if (!achievements.some(a => a.id === achievement.id)) {
      setAchievements([...achievements, {
        ...achievement,
        earned: true,
        date: new Date().toISOString()
      }]);

      // Give XP reward for achievement
      if (achievement.xpReward) {
        addXp(achievement.xpReward);
      }
    }
  };

  // Add a new habit
  const addHabit = (habit) => {
    const newHabit = {
      id: Date.now().toString(),
      name: habit,
      createdAt: new Date().toISOString(),
      completedDates: []
    };

    setHabits([...habits, newHabit]);

    // Add achievement for creating first habit
    if (habits.length === 0) {
      addAchievement({
        id: 'first-habit',
        title: 'Habit Starter',
        description: 'Created your first habit!',
        xpReward: 50,
        icon: '🌱'
      });
    }
  };

  // Mark a habit as completed for today
  const completeHabit = (habitId) => {
    const today = new Date().toISOString().split('T')[0];

    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        // Check if already completed today
        if (!habit.completedDates.includes(today)) {
          const newCompletedDates = [...habit.completedDates, today];

          // Add XP for completing a habit
          addXp(10);

          // Check for streak
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];

          if (habit.completedDates.includes(yesterdayStr)) {
            // Continuing a streak
            setStreaks(streaks + 1);

            // Check for streak achievements
            checkStreakAchievements(streaks + 1);
          }

          return { ...habit, completedDates: newCompletedDates };
        }
      }
      return habit;
    }));

    setCompletedHabits([...completedHabits, { habitId, date: today }]);
  };

  // Check and award streak achievements
  const checkStreakAchievements = (currentStreak) => {
    const streakAchievements = [
      { days: 3, id: 'streak-3', title: '3-Day Streak', xpReward: 30 },
      { days: 7, id: 'streak-7', title: '7-Day Streak', xpReward: 70 },
      { days: 14, id: 'streak-14', title: '2-Week Streak', xpReward: 140 },
      { days: 30, id: 'streak-30', title: 'Monthly Master', xpReward: 300 },
      { days: 60, id: 'streak-60', title: '60-Day Champion', xpReward: 600 },
      { days: 90, id: 'streak-90', title: 'Habit Hero', xpReward: 900 },
    ];

    for (const { days, id, title, xpReward } of streakAchievements) {
      if (currentStreak >= days && !achievements.some(a => a.id === id)) {
        addAchievement({
          id,
          title,
          description: `Maintained a streak for ${days} days!`,
          xpReward,
          icon: '🔥'
        });
      }
    }
  };

  return (
    <GameContext.Provider value={{
      level,
      xp,
      nextLevelXp,
      streaks,
      achievements,
      habits,
      completedHabits,
      addXp,
      addAchievement,
      addHabit,
      completeHabit
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
export default GameContext;
