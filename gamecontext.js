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

  // At Initial load, it loads the gamedata from the game localStorage
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

  // Saves the game data whenever it changes to the localStorage
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
