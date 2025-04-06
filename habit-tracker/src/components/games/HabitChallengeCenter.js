/**
 * Habit Challenge Center Component
 *
 * This file implements the HabitChallengeDashboard component, which serves as an engaging
 * challenge hub within the habit tracking application. It provides two interactive sections:
 *
 * -  Hourly Challenges:
 *    • 10 short, productivity-boosting activities.
 *    • Users can select a difficulty level (easy/moderate/hard) to earn XP.
 *    • Feedback messages reinforce motivation and habit strength.
 *    • XP is tracked and stored in localStorage.
 *
 * -  Weekly Challenge:
 *    • Seven-day habit planner with three tasks per day.
 *    • Users toggle task status: unchecked → checked → crossed → unchecked.
 *    • XP rewards are granted for successful habit completions.
 *    • Weekly level progression and visual badges are displayed.
 *
 * The component tracks XP across three categories (hourly, weekly, and total) and features:
 * - Persistent XP storage via localStorage.
 * - Visual feedback through styled-components (XP bar, badges, colored buttons).
 * - Dynamic habit generation and streak recognition.
 * - Reset functions for all XP and challenge states.
 *
 * The code emphasizes modularity and readability, reusing helper functions like
 * `getWeeklyHabits()` and `getBadges()` to maintain clean logic separation.
 *
 *  Themed styling is applied using `styled-components`, adhering to a consistent color palette.
 */

// Import necessary React and styled-components modules
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme';
import { useHabit } from '../../context/HabitContext';

// Main layout container for the Habit Challenge Center
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom right, #1a2038, #293462);
  color: white;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Montserrat', sans-serif;
`;

// Styled title for page header
const Title = styled.h1`
  font-size: 2.5rem;
  background: linear-gradient(to right, #e6c200, #ffeb99);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1.5rem;
  text-align: center;
`;

// Stats container to display XP information
const StatsContainer = styled.div`
  background: ${theme.colors.glassWhite};
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1.5rem;
  box-shadow: ${theme.shadows.card};
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${theme.colors.accent};
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${theme.colors.text};
  opacity: 0.8;
`;

// Button container for switching between Hourly and Weekly tabs
const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 600px;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem;
  border-radius: 12px;
`;

// Tab button style — visually highlights active tab
const TabButton = styled.button`
  padding: 0.6rem 1rem;
  background: ${({ active }) => (active ? theme.colors.secondary : 'transparent')};
  color: ${({ active }) => (active ? 'white' : theme.colors.text)};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  flex: 1;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ active }) => (active ? theme.colors.secondary : 'rgba(255, 255, 255, 0.3)')};
  }
`;

const HabitGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 1000px;
`;

const HabitCard = styled.div`
  background: ${theme.colors.glassWhite};
  border-radius: 16px;
  padding: 1.2rem;
  box-shadow: ${theme.shadows.card};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${({ color }) => color || theme.colors.primary};
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

// Bold title inside each habit card, with color based on index
const HabitTitle = styled.strong`
  display: block;
  margin-bottom: 0.8rem;
  color: ${({ color }) => color};
  font-size: 1.1rem;
`;

// Button for marking difficulty levels and granting XP
const Button = styled.button`
  margin: 0.5rem 0.25rem;
  background: ${({ selected, difficulty }) =>
    selected
      ? (difficulty === 'easy'
          ? '#2ecc71'
          : difficulty === 'moderate'
          ? '#f39c12'
          : '#e74c3c')
      : '#e4d2b0'};
  color: ${({ selected }) => (selected ? '#fff' : '#333')};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    background: ${({ selected, difficulty }) =>
      selected
        ? (difficulty === 'easy'
            ? '#27ae60'
            : difficulty === 'moderate'
            ? '#d35400'
            : '#c0392b')
        : '#d9c8a9'};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(1px);
  }
`;

// Message box for showing feedback after habit completion
const MessageBox = styled.div`
  margin-top: 0.8rem;
  padding: 0.8rem;
  font-size: 0.95rem;
  color: white;
  background: ${({ type }) =>
    type === 'easy' ? '#2ecc71' :
    type === 'moderate' ? '#f39c12' : '#e74c3c'};
  border-radius: 8px;
  transform: translateY(0);
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Complete set button shown when all hourly habits are completed
const CompleteSetButton = styled.button`
  margin-top: 2rem;
  background: linear-gradient(to right, #4CAF50, #66BB6A); /* green gradient */
  color: white;
  border: none;
  padding: 0.85rem 2rem;
  border-radius: 12px;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-3px);
    background: linear-gradient(to right, #43A047, #81C784); /* brighter green */
    box-shadow: 0 10px 18px rgba(0, 0, 0, 0.25);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const NextDayButton = styled.button`
  margin-top: 1.5rem;
  background: linear-gradient(to right, #FF9800, #FFB74D);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 10px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(to right, #FB8C00, #FFA726);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(1px);
  }
`;

// Completion message that appears when all habits are done
const CompletionMessage = styled.div`
  background: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);
  color: #2d3748;
  padding: 1.5rem;
  border-radius: 16px;
  margin: 2rem 0;
  text-align: center;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;

  @keyframes popIn {
    0% {
      opacity: 0;
      transform: scale(0.8);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  h3 {
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
  }

  p {
    margin-bottom: 1rem;
  }
`;

const WeekCompletionMessage = styled(CompletionMessage)`
  background: linear-gradient(120deg, #FFC107 0%, #FF9800 100%);
`;

const ScheduleCard = styled.div`
  background: ${theme.colors.glassWhite};
  padding: 1.5rem;
  border-radius: 16px;
  margin-bottom: 1.5rem;
  max-width: 700px;
  width: 100%;
  box-shadow: ${theme.shadows.card};
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.15);
  }

  &:after {
    content: '${({ isComplete }) => isComplete ? '✓' : ''}';
    position: absolute;
    top: 1rem;
    right: 1rem;
    color: #10B981;
    font-size: 1.5rem;
    font-weight: bold;
  }
`;

const ScheduleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  padding-bottom: 0.8rem;
`;

const ScheduleTitle = styled.strong`
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SectionTitle = styled.h2`
  margin-top: 2rem;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;

  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100%;
    height: 3px;
    background: ${theme.colors.accent};
    border-radius: 3px;
  }
`;

// XP progress bar container for weekly XP tracking
const XPBar = styled.div`
  background: rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  height: 20px;
  overflow: hidden;
  margin: 0.5rem 0 1.5rem;
  box-shadow: inset 0 1px 4px rgba(0,0,0,0.2);
`;

const XPProgress = styled.div`
  background: linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.secondary});
  height: 100%;
  width: ${({ xp }) => `${(xp / 50) * 100}%`};
  transition: width 0.5s ease;
  border-radius: 20px;
  position: relative;

  &:after {
    content: '${({ xp }) => xp}/50 XP';
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.75rem;
    color: white;
    text-shadow: 0 1px 2px rgba(0,0,0,0.5);
  }
`;

const LevelInfo = styled.div`
  font-weight: bold;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  span {
    background: ${theme.colors.secondary};
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
  }
`;

const BadgeList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const Badge = styled.span`
  background: ${props => props.color || theme.colors.accent};
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &:before {
    content: '🏆';
  }
`;

// Container and button style for XP reset controls
const ResetXPButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  flex-wrap: wrap;
  justify-content: center;
`;

const ResetButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${theme.colors.secondary};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${theme.colors.accent};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(1px);
  }
`;

// Navigation buttons styled like in WordScramblerGame
const NavigationButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const NavigationButton = styled.button`
  background: linear-gradient(to right, #3498db, #2980b9);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(1px);
  }
`;

// Improved styling for weekly habits with colorful backgrounds and animations
const HabitOptionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
`;

const HabitOption = styled.div`
  background: ${({ status }) =>
    status === 'checked' ? 'linear-gradient(135deg, #a3e635, #65a30d)' :
    status === 'crossed' ? 'linear-gradient(135deg, #f87171, #dc2626)' :
    'linear-gradient(135deg, #f0f9ff, #bfdbfe)'};
  padding: 1.2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  cursor: pointer;
  flex: 1 1 calc(33% - 1rem);
  min-width: 150px;
  max-width: 180px;
  transition: all 0.3s ease;
  text-align: center;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ status }) =>
      status === 'checked' ? 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h20L0 20z\' fill=\'rgba(255,255,255,0.1)\' /%3E%3C/svg%3E")' : 
      status === 'crossed' ? 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h20L0 20z\' fill=\'rgba(0,0,0,0.1)\' /%3E%3C/svg%3E")' : 
      'none'};
    opacity: 0.2;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
    border-color: ${({ status }) =>
      status === 'checked' ? '#65a30d' :
      status === 'crossed' ? '#dc2626' :
      '#93c5fd'};
  }

  &:after {
    content: '${({ status }) => status === 'checked' ? '✓' : status === 'crossed' ? '✕' : ''}';
    position: absolute;
    top: 8px;
    right: 8px;
    font-size: 1rem;
    color: white;
    font-weight: bold;
  }
`;

const HabitEmoji = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const HabitText = styled.div`
  font-weight: bold;
  font-size: 0.95rem;
  color: ${({ status }) =>
    status === 'checked' || status === 'crossed' ? 'white' : '#374151'};
`;

const WeeklyProgress = styled.div`
  width: 100%;
  max-width: 600px;
  background: ${theme.colors.glassWhite};
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProgressCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  background: ${({ active }) =>
    active ? 'linear-gradient(135deg, #a3e635, #65a30d)' :
    'linear-gradient(135deg, #d1d5db, #9ca3af)'};
  box-shadow: ${({ active }) =>
    active ? '0 4px 6px rgba(101, 163, 13, 0.3)' : 'none'};
  transition: all 0.3s ease;

  &:hover {
    transform: ${({ active }) => active ? 'scale(1.1)' : 'none'};
  }
`;

// Animated XP notification that appears when XP is gained
const XPNotification = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: linear-gradient(120deg, #4CAF50, #8BC34A);
  color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  z-index: 100;
  animation: slideInRight 0.5s ease forwards, fadeOut 0.5s ease 2.5s forwards;

  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;

// Day card with improved styling
const DayCard = styled.div`
  background: ${theme.colors.glassWhite};
  border-radius: 16px;
  padding: 1.2rem;
  margin-bottom: 1.5rem;
  width: 100%;
  max-width: 700px;
  box-shadow: ${theme.shadows.card};
  transition: all 0.3s ease;
  border-left: 5px solid ${({ isComplete }) => isComplete ? '#10B981' : '#3B82F6'};
  position: relative;
  overflow: hidden;

  &:after {
    content: '${({ isComplete }) => isComplete ? 'COMPLETED' : ''}';
    position: absolute;
    top: 10px;
    right: 10px;
    background: #10B981;
    color: white;
    font-size: 0.7rem;
    font-weight: bold;
    padding: 0.3rem 0.6rem;
    border-radius: 12px;
    opacity: ${({ isComplete }) => isComplete ? '1' : '0'};
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.15);
  }
`;

const DayTitle = styled.h3`
  color: #3B82F6;
  margin-bottom: 1rem;
  font-size: 1.3rem;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 40px;
    height: 3px;
    background: #3B82F6;
    border-radius: 2px;
  }
`;

// All possible weekly habits
const allWeeklyHabits = [
  "Drink 8 glasses of water", "Stretch for 5 mins", "Journal for 3 mins", "Meditate 5 mins", "Walk 15 mins",
  "Plan tomorrow's tasks", "No sugar today", "Read 10 mins", "Sleep by 10 PM", "Digital detox 1hr",
  "Gratitude note", "Listen to a podcast", "Mindful eating", "Go offline 1 hr", "Declutter space",
  "Reflect for 5 mins", "Step outside", "No phone in morning", "Set priorities", "Celebrate a small win",
  "Do 10 pushups", "Write 3 things you're grateful for", "Limit screen time", "Compliment someone",
  "Eat a fruit", "Do one kind act", "Learn a new word", "Clean your desktop", "Check goals progress",
  "Organize one drawer", "Do a brain teaser", "Say positive affirmations", "Message a loved one",
  "Practice breathing", "Avoid junk food", "Do yoga for 5 mins", "Write a journal page", "Drink green tea",
  "Send a thank-you message", "Wake up early", "Go to bed on time", "Visualize your goals",
  "Draw something", "Practice a skill", "Revisit old notes", "Read an article", "Do a posture check",
  "Watch a motivational video", "Fix one small annoyance"
];

// All possible hourly habits with emojis
const allHourlyHabits = [
  {text: "Prepare a mind map summarizing a topic you studied", emoji: "🧠"},
  {text: "Complete one coding problem from a practice platform", emoji: "💻"},
  {text: "Record a 1-minute voice note reflecting on your mood", emoji: "🎙️"},
  {text: "Read a page from a technical or non-fiction book", emoji: "📚"},
  {text: "Declutter your workspace or study table", emoji: "🧹"},
  {text: "Write a short paragraph on something new you learned", emoji: "✏️"},
  {text: "Rewatch a key class concept and take fresh notes", emoji: "📝"},
  {text: "Outline the steps needed to complete your next assignment", emoji: "📋"},
  {text: "Write an email or message to ask for feedback from a mentor", emoji: "📧"},
  {text: "Practice public speaking by reading aloud for 2 minutes", emoji: "🗣️"},
  {text: "Do a 5-minute breathing exercise to improve focus", emoji: "🧘"},
  {text: "Draw a sketch of a concept you're learning", emoji: "🎨"},
  {text: "Solve a quick puzzle or riddle to stimulate your brain", emoji: "🧩"},
  {text: "Write down three goals for tomorrow", emoji: "🎯"},
  {text: "Review your notes from earlier today", emoji: "📔"},
  {text: "Take a short walk while thinking about a problem", emoji: "🚶"},
  {text: "Research a topic you're curious about for 5 minutes", emoji: "🔍"},
  {text: "Organize your digital files for 5 minutes", emoji: "📁"},
  {text: "Do 10 jumping jacks to boost your energy", emoji: "🏃"},
  {text: "Try a new study technique for 10 minutes", emoji: "⏱️"},
  {text: "Look up a word you don't know and use it in a sentence", emoji: "📖"},
  {text: "Send a message to a classmate to discuss a topic", emoji: "💬"},
  {text: "Drink a glass of water and stretch your body", emoji: "💧"},
  {text: "Write down one thing you're grateful for today", emoji: "🙏"},
  {text: "Review your progress on a current project", emoji: "📊"},
  {text: "Set a specific goal for your next study session", emoji: "🏆"},
  {text: "Draw a flowchart of a process you're learning", emoji: "📈"},
  {text: "Create flashcards for terms you need to memorize", emoji: "🗂️"},
  {text: "Send yourself a voice message with 3 key learnings today", emoji: "🎤"},
  {text: "List three ways to improve your productivity tomorrow", emoji: "⚡"}
];

// Emojis for weekly habits
const weeklyEmojis = ["💧", "🧘", "📝", "🧠", "🚶", "📋", "🍎", "📚", "😴", "📵",
                      "🙏", "🎧", "🍽️", "⏰", "🧹", "💭", "🌳", "📱", "🎯", "🎉",
                      "💪", "✍️", "📺", "😊", "🍏", "❤️", "📖", "💻", "📊", "🧽",
                      "🧩", "✨", "💌", "🌬️", "🍔", "🧘", "📔", "🍵", "📨", "🌅",
                      "🛌", "🌈", "🎨", "🔄", "📑", "📰", "⚡", "🎬", "🔧"];

// Generate positive feedback messages for each difficulty level
const feedbackMessages = {
  easy: [
    "Great start! Every small step counts.",
    "Nice job! Progress is progress.",
    "Well done! Keep building momentum.",
    "Good choice! Consistency beats intensity.",
    "That's 5 XP added! Simple habits create big changes."
  ],
  moderate: [
    "Impressive effort! You're really pushing forward.",
    "Solid work! You're building real discipline.",
    "Strong choice! Your commitment is showing.",
    "That's 7 XP earned! You're making significant progress.",
    "Excellent! You're in the growth zone."
  ],
  hard: [
    "Outstanding work! You've tackled a challenging habit.",
    "Remarkable discipline! That's the path to mastery.",
    "Powerful choice! You're building exceptional habits.",
    "That's 10 XP! Your determination is inspiring.",
    "Fantastic effort! The difficult path leads to growth."
  ]
};

// Completion messages that vary based on XP earned
const getCompletionMessage = (xp) => {
  if (xp >= 90) return "Legendary Performance!";
  if (xp >= 70) return "Outstanding Achievement!";
  if (xp >= 50) return "Excellent Work!";
  return "Good Job!";
};

// Generate a new random weekly habit set with 7 days × 3 habits/day
const getWeeklyHabits = () => {
  const shuffled = [...allWeeklyHabits].sort(() => 0.5 - Math.random());
  const weeklySet = [];

  for (let i = 0; i < 7; i++) {
    const dayHabits = [];
    for (let j = 0; j < 3; j++) {
      const habitIndex = i * 3 + j;
      dayHabits.push({
        text: shuffled[habitIndex],
        emoji: weeklyEmojis[Math.floor(Math.random() * weeklyEmojis.length)]
      });
    }
    weeklySet.push(dayHabits);
  }
  return weeklySet;
};

// Get random hourly habits
const getHourlyHabits = () => {
  const shuffled = [...allHourlyHabits].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 10);
};

const getBadges = (level) => {
  const badgeMap = {
    1: { title: "Starter", color: "#3B82F6" },
    2: { title: "Explorer", color: "#8B5CF6" },
    3: { title: "Achiever", color: "#EC4899" },
    4: { title: "Pro", color: "#F59E0B" },
    5: { title: "Champion", color: "#10B981" },
    6: { title: "Master", color: "#6366F1" },
    7: { title: "Legend", color: "#EF4444" },
    8: { title: "Mythic", color: "#8B5CF6" },
    9: { title: "Guru", color: "#F59E0B" },
    10: { title: "Elite", color: "#059669" }
  };
  return Object.entries(badgeMap)
    .filter(([lvl]) => parseInt(lvl) <= level)
    .map(([_, data]) => data);
};

const getDayName = (index) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  return days[index];
};

const uniformButtonStyle = {
  padding: '0.85rem 2rem',
  fontSize: '1rem',
  background: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 'bold',
  cursor: 'pointer',
  minWidth: '140px'
};

const HabitChallengeDashboard = () => {
  const [tab, setTab] = useState('hourly');
  const [hourlyHabits, setHourlyHabits] = useState(getHourlyHabits());
  const [weeklyHabits, setWeeklyHabits] = useState(getWeeklyHabits());
  const [completedHourly, setCompletedHourly] = useState({});
  const [hourlyMessages, setHourlyMessages] = useState({});
  const [completedWeekly, setCompletedWeekly] = useState(Array(7).fill().map(() => []));
  const [hourlyXP, setHourlyXP] = useState(0);
  const [weeklyXP, setWeeklyXP] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [showXPNotification, setShowXPNotification] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  const [showWeekCompletionMessage, setShowWeekCompletionMessage] = useState(false);
  const [activeDay, setActiveDay] = useState(0);
  const { addHabit, updateProgress } = useHabit();

  const colors = [
    theme.colors.primary,
    theme.colors.secondary,
    theme.colors.accent,
    '#2dd4bf',
    '#f97316',
    '#8b5cf6',
    '#ec4899',
    '#14b8a6',
    '#f59e0b',
    '#6366f1'
  ];

  useEffect(() => {
    // Check if all hourly habits are completed
    if (Object.keys(completedHourly).length === hourlyHabits.length &&
        Object.keys(completedHourly).length > 0) {
      setShowCompletionMessage(true);

      // Hide completion message after 6 seconds
      setTimeout(() => {
        setShowCompletionMessage(false);
      }, 6000);
    }
  }, [completedHourly]);

  // Update level based on total XP
  useEffect(() => {
    const newLevel = Math.floor(totalXP / 50) + 1;
    setLevel(newLevel);
  }, [totalXP]);

  // Check if weekly challenge is complete
  useEffect(() => {
    const isComplete = completedWeekly.every((day, index) =>
      day.length === weeklyHabits[index].length
    );

    if (isComplete && completedWeekly.some(day => day.length > 0)) {
      setShowWeekCompletionMessage(true);

      setTimeout(() => {
        setShowWeekCompletionMessage(false);
      }, 6000);
    }
  }, [completedWeekly, weeklyHabits]);

  const handleTabChange = (newTab) => {
    setTab(newTab);
  };

  const handleHabitCompletion = (index, difficulty) => {
    if (completedHourly[index]) return;

    let xp = 0;
    switch(difficulty) {
      case 'easy':
        xp = 5;
        break;
      case 'moderate':
        xp = 7;
        break;
      case 'hard':
        xp = 10;
        break;
      default:
        xp = 0;
    }

    // Update completed habits, XP, and show notification
    setCompletedHourly(prev => ({ ...prev, [index]: difficulty }));

// pick and store a random message
const message = feedbackMessages[difficulty][Math.floor(Math.random() * feedbackMessages[difficulty].length)];
setHourlyMessages(prev => ({ ...prev, [index]: message }));
    setHourlyXP(hourlyXP + xp);
    setTotalXP(totalXP + xp);
    updateProgress('games', xp);

    // Show XP notification
    setXpGained(xp);
    setShowXPNotification(true);
    setTimeout(() => setShowXPNotification(false), 3000);
  };

  const handleWeeklyHabitToggle = (dayIndex, habitIndex) => {
    const dayCompleted = [...completedWeekly];

    // Check if this habit is already completed
    const habitPos = dayCompleted[dayIndex].indexOf(habitIndex);

    if (habitPos > -1) {
      // Remove if already completed
      dayCompleted[dayIndex] = dayCompleted[dayIndex].filter(idx => idx !== habitIndex);
      setWeeklyXP(weeklyXP - 5); // Remove XP
      setTotalXP(totalXP - 5);
    } else {
      // Add to completed list
      dayCompleted[dayIndex] = [...dayCompleted[dayIndex], habitIndex];
      setWeeklyXP(weeklyXP + 5); // Add XP
      setTotalXP(totalXP + 5);
      updateProgress('games', 5); // Each weekly habit gives 5 XP

      // Show XP notification
      setXpGained(5);
      setShowXPNotification(true);
      setTimeout(() => setShowXPNotification(false), 3000);
    }

    setCompletedWeekly(dayCompleted);
  };

  const regenerateHourlyHabits = () => {
    setHourlyHabits(getHourlyHabits());
    setCompletedHourly({});
    setShowCompletionMessage(false);
  };

  const regenerateWeeklyHabits = () => {
    setWeeklyHabits(getWeeklyHabits());
    setCompletedWeekly(Array(7).fill().map(() => []));
    setShowWeekCompletionMessage(false);
  };

  const resetXP = () => {
    setHourlyXP(0);
    setWeeklyXP(0);
    setTotalXP(0);
  };

  // Calculate completion percentage for a week
  const getTotalWeekCompletion = () => {
    const totalHabits = weeklyHabits.reduce((acc, day) => acc + day.length, 0);
    const completedHabits = completedWeekly.reduce((acc, day) => acc + day.length, 0);
    return Math.round((completedHabits / totalHabits) * 100);
  };

  // Calculate completion for a specific day
  const getDayCompletion = (dayIndex) => {
    return Math.round((completedWeekly[dayIndex].length / weeklyHabits[dayIndex].length) * 100);
  };

  const handleNextDay = () => {
    const next = activeDay + 1;
    if (next <= 6) {
      setActiveDay(next);

      // Optional XP bonus for completing a day
      setXpGained(5);
      setTotalXP(prev => {
        const updatedXP = prev + 5;
        localStorage.setItem('totalXP', updatedXP);
        return updatedXP;
      });

      // Show XP popup
      setShowXPNotification(true);
      setTimeout(() => setShowXPNotification(false), 2500);

      // Update leaderboard progress
      updateProgress('games', 5);
    }
  };


  return (
    <Container>
      <Title>Habit Challenge Center</Title>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
    <button style={uniformButtonStyle} onClick={() => window.location.href = '/dashboard'}>
      Home
    </button>
    <button style={uniformButtonStyle} onClick={() => window.location.href = '/breakthrough-game'}>
  Back to Breakthrough
</button>
  </div>

      <StatsContainer>
        <StatItem>
          <StatValue>{hourlyXP}</StatValue>
          <StatLabel>Hourly XP</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{weeklyXP}</StatValue>
          <StatLabel>Weekly XP</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{totalXP}</StatValue>
          <StatLabel>Total XP</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{level}</StatValue>
          <StatLabel>Level</StatLabel>
        </StatItem>
      </StatsContainer>

      <LevelInfo>
        Level <span>{level}</span> Habit Builder
      </LevelInfo>

      <XPBar>
        <XPProgress xp={totalXP % 50} />
      </XPBar>

      <BadgeList>
        {getBadges(level).map((badge, index) => (
          <Badge key={index} color={badge.color}>{badge.title}</Badge>
        ))}
      </BadgeList>

      <Tabs>
        <TabButton
          active={tab === 'hourly'}
          onClick={() => handleTabChange('hourly')}
        >
          Hourly Habits
        </TabButton>
        <TabButton
          active={tab === 'weekly'}
          onClick={() => handleTabChange('weekly')}
        >
          Weekly Challenge
        </TabButton>
      </Tabs>

      {tab === 'hourly' ? (
        <>
          <HabitGrid>
            {hourlyHabits.map((habit, index) => (
              <HabitCard key={index} color={colors[index % colors.length]}>
                <HabitTitle color={colors[index % colors.length]}>
                  {habit.emoji} {habit.text}
                </HabitTitle>

                <div>
                  <Button
                    selected={completedHourly[index] === 'easy'}
                    difficulty="easy"
                    onClick={() => handleHabitCompletion(index, 'easy')}
                    disabled={!!completedHourly[index]}
                  >
                    Easy (5 XP)
                  </Button>
                  <Button
                    selected={completedHourly[index] === 'moderate'}
                    difficulty="moderate"
                    onClick={() => handleHabitCompletion(index, 'moderate')}
                    disabled={!!completedHourly[index]}
                  >
                    Moderate (7 XP)
                  </Button>
                  <Button
                    selected={completedHourly[index] === 'hard'}
                    difficulty="hard"
                    onClick={() => handleHabitCompletion(index, 'hard')}
                    disabled={!!completedHourly[index]}
                  >
                    Hard (10 XP)
                  </Button>
                </div>

                {completedHourly[index] && hourlyMessages[index] && (
  <MessageBox type={completedHourly[index]}>
    {hourlyMessages[index]}
  </MessageBox>
)}
              </HabitCard>
            ))}
          </HabitGrid>

          {showCompletionMessage && (
            <CompletionMessage>
              <h3>{getCompletionMessage(hourlyXP)}</h3>
              <p>You've completed all of today's habit challenges and earned {hourlyXP} XP!</p>
              <p>Come back tomorrow for new challenges or regenerate a new set now.</p>
            </CompletionMessage>
          )}

          {Object.keys(completedHourly).length > 0 && (
            <CompleteSetButton onClick={regenerateHourlyHabits}>
              Generate New Habit Set
            </CompleteSetButton>
          )}
        </>
      ) : (
        <>
          <WeeklyProgress>
            {Array(7).fill().map((_, index) => (
              <ProgressCircle
                key={index}
                active={activeDay === index || getDayCompletion(index) === 100}
                onClick={() => setActiveDay(index)}
              >
                {index + 1}
              </ProgressCircle>
            ))}
          </WeeklyProgress>

          <DayCard isComplete={getDayCompletion(activeDay) === 100}>
            <DayTitle>{getDayName(activeDay)}</DayTitle>

            <HabitOptionsContainer>
              {weeklyHabits[activeDay].map((habit, index) => {
                const isCompleted = completedWeekly[activeDay].includes(index);
                return (
                  <HabitOption
                    key={index}
                    status={isCompleted ? 'checked' : 'unchecked'}
                    onClick={() => handleWeeklyHabitToggle(activeDay, index)}
                  >
                    <HabitEmoji>{habit.emoji}</HabitEmoji>
                    <HabitText status={isCompleted ? 'checked' : 'unchecked'}>
                      {habit.text}
                    </HabitText>
                  </HabitOption>
                );
              })}
            </HabitOptionsContainer>
          </DayCard>

          {getDayCompletion(activeDay) === 100 && activeDay < 6 && (
  <NextDayButton onClick={() => handleNextDay()}>
    ✅ Next Day →
  </NextDayButton>
)}

          {showWeekCompletionMessage && (
            <WeekCompletionMessage>
              <h3>Weekly Challenge Complete!</h3>
              <p>Amazing work! You've completed the entire weekly challenge!</p>
              <p>You've completed {getTotalWeekCompletion()}% of all habits and earned {weeklyXP} XP!</p>
            </WeekCompletionMessage>
          )}

          {completedWeekly.some(day => day.length > 0) && (
            <CompleteSetButton onClick={regenerateWeeklyHabits}>
              Generate New Weekly Challenge
            </CompleteSetButton>
          )}
        </>
      )}

      <ResetXPButtons>
        <ResetButton onClick={resetXP}>Reset All XP</ResetButton>
      </ResetXPButtons>

      {showXPNotification && (
        <XPNotification>
          +{xpGained} XP Earned!
        </XPNotification>
      )}
    </Container>
  );
};

export default HabitChallengeDashboard;
