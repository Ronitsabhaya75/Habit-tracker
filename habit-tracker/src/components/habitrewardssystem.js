/**
 * Habit Progress and Rewards Tracking System
 *
 * Features:
 * - Track progress across multiple habit categories (fitness, mindfulness)
 * - Implement reward tiers with points and badges
 * - Persistent storage using localStorage
 * - Activity logging and progress tracking
 *
 * Usage: Wrap app with HabitProgressProvider and use useHabitProgress hook
 * to access progress management methods
 *
 * Key Methods:
 * - addProgress: Add points to a habit category
 * - getProgress: Retrieve current progress
 * - getRewards: Get earned rewards
 * - resetProgress: Clear progress for a category
 */

// 1. habitContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

// Predefined Reward Tiers
const REWARD_TIERS = {
  fitness: [
    { level: 1, points: 50, badge: 'Beginner', reward: 'Fitness Starter Kit' },
    { level: 2, points: 100, badge: 'Consistent', reward: 'Nutrition Consultation' },
    { level: 3, points: 250, badge: 'Champion', reward: 'Personal Training Session' },
    { level: 4, points: 500, badge: 'Transformational', reward: 'Full Wellness Package' }
  ],
  mindfulness: [
    { level: 1, points: 50, badge: 'Calm Seeker', reward: 'Meditation Guide' },
    { level: 2, points: 100, badge: 'Zen Master', reward: 'Mindfulness Workshop' },
    { level: 3, points: 250, badge: 'Inner Peace', reward: 'Retreat Voucher' }
  ]
};

// Habit Progress Context
export const HabitProgressContext = createContext();

export const HabitProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState({});
  const [rewards, setRewards] = useState({});
  const [activityLog, setActivityLog] = useState({});

  // Load progress from local storage on init
  useEffect(() => {
    const savedProgress = localStorage.getItem('habitProgress');
    const savedRewards = localStorage.getItem('habitRewards');
    const savedActivityLog = localStorage.getItem('habitActivityLog');

    if (savedProgress) setProgress(JSON.parse(savedProgress));
    if (savedRewards) setRewards(JSON.parse(savedRewards));
    if (savedActivityLog) setActivityLog(JSON.parse(savedActivityLog));
  }, []);

  // Save progress to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('habitProgress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('habitRewards', JSON.stringify(rewards));
  }, [rewards]);

  useEffect(() => {
    localStorage.setItem('habitActivityLog', JSON.stringify(activityLog));
  }, [activityLog]);

  // Add progress to a specific habit category
  const addProgress = (category, points) => {
    setProgress(prev => {
      const currentProgress = prev[category] || 0;
      const newProgress = currentProgress + points;

      // Check and update rewards
      const categoryRewards = REWARD_TIERS[category] || [];
      const earnedReward = categoryRewards.find(
        tier => newProgress >= tier.points &&
        (!prev[category] || prev[category] < tier.points)
      );

      // Update rewards if a new tier is reached
      if (earnedReward) {
        setRewards(prevRewards => ({
          ...prevRewards,
          [category]: [
            ...(prevRewards[category] || []),
            earnedReward
          ]
        }));
      }

      // Log activity
      setActivityLog(prev => ({
        ...prev,
        [category]: [
          ...(prev[category] || []),
          {
            date: new Date().toISOString(),
            points,
            totalPoints: newProgress
          }
        ]
      }));

      return {
        ...prev,
        [category]: newProgress
      };
    });
  };

  // Reset progress for a specific category
  const resetProgress = (category) => {
    setProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[category];
      return newProgress;
    });

    setRewards(prev => {
      const newRewards = { ...prev };
      delete newRewards[category];
      return newRewards;
    });

    setActivityLog(prev => {
      const newActivityLog = { ...prev };
      delete newActivityLog[category];
      return newActivityLog;
    });
  };

  // Get current progress for a category
  const getProgress = (category) => {
    return progress[category] || 0;
  };

  // Get rewards for a category
  const getRewards = (category) => {
    return rewards[category] || [];
  };

  // Get activity log for a category
  const getActivityLog = (category) => {
    return activityLog[category] || [];
  };

  // Calculate progress percentage for a category
  const getProgressPercentage = (category) => {
    const categoryRewards = REWARD_TIERS[category] || [];
    const currentProgress = getProgress(category);
    const maxTier = categoryRewards[categoryRewards.length - 1];

    return maxTier
      ? Math.min((currentProgress / maxTier.points) * 100, 100)
      : 0;
  };

  // Get next reward tier
  const getNextRewardTier = (category) => {
    const categoryRewards = REWARD_TIERS[category] || [];
    const currentProgress = getProgress(category);

    return categoryRewards.find(tier => currentProgress < tier.points);
  };

  return (
    <HabitProgressContext.Provider value={{
      addProgress,
      resetProgress,
      getProgress,
      getRewards,
      getActivityLog,
      getProgressPercentage,
      getNextRewardTier,
      REWARD_TIERS
    }}>
      {children}
    </HabitProgressContext.Provider>
  );
};

// Custom hook for using Habit Progress Context
export const useHabitProgress = () => {
  const context = useContext(HabitProgressContext);
  if (!context) {
    throw new Error('useHabitProgress must be used within a HabitProgressProvider');
  }
  return context;
};

// 2. HabitProgressTracker.js
import React, { useState } from 'react';
import { useHabitProgress } from './habitContext';

const HabitProgressTracker = () => {
  const {
    addProgress,
    resetProgress,
    getProgress,
    getRewards,
    getActivityLog,
    getProgressPercentage,
    getNextRewardTier,
    REWARD_TIERS
  } = useHabitProgress();

  const [selectedCategory, setSelectedCategory] = useState('fitness');

  const categories = Object.keys(REWARD_TIERS);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Habit Progress Tracker</h1>

      {/* Category Selector */}
      <div className="flex mb-6">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`
              px-4 py-2 mr-2 rounded
              ${selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800'}
            `}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Progress Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">
            {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Progress
          </h2>
          <button
            onClick={() => resetProgress(selectedCategory)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Reset Progress
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div
            className="bg-blue-500 h-4 rounded-full"
            style={{ width: `${getProgressPercentage(selectedCategory)}%` }}
          />
        </div>

        <div className="flex justify-between mb-6">
          <span>Current Points: {getProgress(selectedCategory)}</span>
          <span>
            Next Goal: {getNextRewardTier(selectedCategory)?.points || 'Completed'}
          </span>
        </div>

        {/* Progress Actions */}
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => addProgress(selectedCategory, 5)}
            className="bg-green-500 text-white py-2 rounded"
          >
            Small Win (+5 pts)
          </button>
          <button
            onClick={() => addProgress(selectedCategory, 10)}
            className="bg-blue-500 text-white py-2 rounded"
          >
            Daily Goal (+10 pts)
          </button>
          <button
            onClick={() => addProgress(selectedCategory, 25)}
            className="bg-purple-500 text-white py-2 rounded"
          >
            Major Achievement (+25 pts)
          </button>
        </div>

        {/* Rewards Section */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Rewards</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {REWARD_TIERS[selectedCategory].map(tier => (
              <div
                key={tier.points}
                className={`
                  p-4 rounded-lg border
                  ${getProgress(selectedCategory) >= tier.points
                    ? 'bg-green-100 border-green-500'
                    : 'bg-gray-100 border-gray-300'}
                `}
              >
                <h4 className="font-bold">{tier.badge}</h4>
                <p>Points: {tier.points}</p>
                <p>Reward: {tier.reward}</p>
                {getProgress(selectedCategory) >= tier.points && (
                  <span className="text-green-600 font-bold">✓ Earned</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Activity Log */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Activity Log</h3>
          <div className="max-h-64 overflow-y-auto">
            {getActivityLog(selectedCategory).slice().reverse().map((log, index) => (
              <div
                key={index}
                className="bg-gray-100 p-3 mb-2 rounded flex justify-between"
              >
                <span>{new Date(log.date).toLocaleString()}</span>
                <span className="font-bold">+{log.points} pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitProgressTracker;

// 3. App.js Integration Example
import React from 'react';
import { HabitProgressProvider } from './habitContext';
import HabitProgressTracker from './HabitProgressTracker';

function App() {
  return (
    <HabitProgressProvider>
      <HabitProgressTracker />
    </HabitProgressProvider>
  );
}

export default App;
