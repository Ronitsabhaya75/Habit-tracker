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
import { theme } from '../../theme';;

// Main layout container for the Habit Challenge Center
const Container = styled.div`
  min-height: 100vh;
  background: ${theme.colors.background};
  color: ${theme.colors.text};
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// Styled title for page header
const Title = styled.h1`
  margin-bottom: 1rem;
`;

// Button container for switching between Hourly and Weekly tabs
const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

// Tab button style — visually highlights active tab
const TabButton = styled.button`
  padding: 0.6rem 1rem;
  background: ${({ active }) => (active ? theme.colors.secondary : theme.colors.glassWhite)};
  color: ${({ active }) => (active ? 'white' : theme.colors.text)};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
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
  border-radius: 10px;
  padding: 1rem;
  box-shadow: ${theme.shadows.card};
`;

// Bold title inside each habit card, with color based on index
const HabitTitle = styled.strong`
  display: block;
  margin-bottom: 0.5rem;
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
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ selected, difficulty }) =>
      selected
        ? (difficulty === 'easy'
            ? '#27ae60'
            : difficulty === 'moderate'
            ? '#d35400'
            : '#c0392b')
        : '#d9c8a9'};
  }
`;

// Message box for showing feedback after habit completion
const MessageBox = styled.div`
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: white;
`;

const ScheduleCard = styled.div`
  background: ${theme.colors.glassWhite};
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  max-width: 600px;
  width: 100%;
`;

const SectionTitle = styled.h2`
  margin-top: 2rem;
`;

// XP progress bar container for weekly XP tracking
const XPBar = styled.div`
  background: ${theme.colors.glassWhite};
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  height: 20px;
  overflow: hidden;
  margin: 0.5rem 0 1rem;
  box-shadow: inset 0 1px 4px rgba(0,0,0,0.2);
`;

const XPProgress = styled.div`
  background: ${theme.colors.secondary};
  height: 100%;
  transition: width 0.3s ease;
`;

const LevelInfo = styled.p`
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const BadgeList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Badge = styled.span`
  background: ${theme.colors.accent};
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
`;

// Container and button style for XP reset controls
const ResetXPButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
`;

const ResetButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${theme.colors.secondary};
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background: ${theme.colors.accent};
  }
`;

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

// Generate a new random weekly habit set with 7 days × 3 habits/day
const getWeeklyHabits = () => {
  const shuffled = [...allWeeklyHabits].sort(() => 0.5 - Math.random());
  const weeklySet = [];
  for (let i = 0; i < 7; i++) {
    weeklySet.push(shuffled.slice(i * 3, i * 3 + 3));
  }
  return weeklySet;
};

const getBadges = (level) => {
  const badgeMap = {
    1: "Starter", 2: "Explorer", 3: "Achiever", 4: "Pro", 5: "Champion",
    6: "Master", 7: "Legend", 8: "Mythic", 9: "Guru", 10: "Elite"
  };
  return Object.entries(badgeMap)
    .filter(([lvl]) => parseInt(lvl) <= level)
    .map(([_, title]) => title);
};

const HabitChallengeDashboard = () => {
  const [tab, setTab] = useState('hourly');
  const [hourlyXP, setHourlyXP] = useState(() => parseInt(localStorage.getItem('hourlyXP')) || 0);
  const [weeklyXP, setWeeklyXP] = useState(() => parseInt(localStorage.getItem('weeklyXP')) || 0);
  const [totalXP, setTotalXP] = useState(() => parseInt(localStorage.getItem('totalXP')) || 0);
  const [hourlyFeedback, setHourlyFeedback] = useState({});
  const [dailyStatus, setDailyStatus] = useState(() => Array(7).fill(null).map(() => ({})));
  const [completedDays, setCompletedDays] = useState(0);
  const [weeklyHabits, setWeeklyHabits] = useState(getWeeklyHabits);
  const [selectedDifficulty, setSelectedDifficulty] = useState({});

  // Updated color palette with light blue/bluish green
  const habitColors = [
    '#5BC0EB', // Light Blue
    '#9EF01A', // Bright Lime Green
    '#00F5D4', // Turquoise
    '#00BFFF', // Deep Sky Blue
    '#40E0D0', // Turquoise
    '#20B2AA', // Light Sea Green
    '#87CEFA', // Light Sky Blue
    '#4ECDC4', // Turquoise
    '#5DADE2', // Soft Blue
    '#48D1CC'  // Medium Turquoise
  ];

// Sync XP to localStorage anytime XP changes
  useEffect(() => {
    localStorage.setItem('hourlyXP', hourlyXP);
    localStorage.setItem('weeklyXP', weeklyXP);
    localStorage.setItem('totalXP', totalXP);
  }, [hourlyXP, weeklyXP, totalXP]);

  const getWeeklyLevel = () => Math.floor(weeklyXP / 50);
  const getXPProgress = () => (weeklyXP % 50);

  const markHourlyHabit = (index, difficulty) => {
    let xpGained = difficulty === 'easy' ? 5 : difficulty === 'moderate' ? 7 : 10;

    // Update XP
    setHourlyXP((prev) => prev + xpGained);
    setTotalXP((prev) => prev + xpGained);

    // Update selected difficulty for the habit
    setSelectedDifficulty(prev => ({
      ...prev,
      [index]: difficulty
    }));

    // Generate feedback
    const message = feedbackMessages[difficulty][Math.floor(Math.random() * feedbackMessages[difficulty].length)];
    setHourlyFeedback((prev) => ({ ...prev, [index]: { type: difficulty, message } }));
  };

// Toggle weekly habit between checked, crossed, or none
  const toggleDaily = (dayIdx, habitIdx) => {
    const updatedStatus = [...dailyStatus];
    const day = { ...updatedStatus[dayIdx] };
    const currentStatus = day[habitIdx];

    let xpChange = 0;
    const nextStatus = currentStatus === 'checked' ? 'crossed' : currentStatus === 'crossed' ? null : 'checked';
    if (nextStatus === null) delete day[habitIdx];
    else day[habitIdx] = nextStatus;

    updatedStatus[dayIdx] = day;
    setDailyStatus(updatedStatus);

    if (nextStatus === 'checked') xpChange = 5;
    else if (currentStatus === 'checked') xpChange = -5;

    setWeeklyXP((prev) => prev + xpChange);
    setTotalXP((prev) => prev + xpChange);

    const completed = Object.values(day).filter((s) => s === 'checked').length;
    if (completed === weeklyHabits[dayIdx].length) {
      setCompletedDays((prev) => prev + 1);
    }
  };

// Reset weekly challenge data
  const resetWeekly = () => {
    setWeeklyHabits(getWeeklyHabits());
    setDailyStatus(Array(7).fill(null).map(() => ({})));
    setCompletedDays(0);
    setWeeklyXP(0);
  };

// Reset hourly XP data
  const resetHourlyXP = () => {
    setHourlyXP(0);
    setSelectedDifficulty({});
    setHourlyFeedback({});
  };

// Reset everything (XP, progress, habits)
  const resetTotalXP = () => {
    setHourlyXP(0);
    setWeeklyXP(0);
    setTotalXP(0);
    setSelectedDifficulty({});
    setHourlyFeedback({});
    setDailyStatus(Array(7).fill(null).map(() => ({})));
    setCompletedDays(0);
    setWeeklyHabits(getWeeklyHabits());
  };

  return (
    <Container>
      <Title>🔥 Habit Challenge Center</Title>
      <p>
        <strong>Total XP:</strong> {totalXP} |
        🕐 Hourly XP: {hourlyXP} |
        📆 Weekly XP: {weeklyXP}
      </p>

      <ResetXPButtons>
        <ResetButton onClick={resetTotalXP}>Reset Total XP</ResetButton>
        <ResetButton onClick={resetHourlyXP}>Reset Hourly XP</ResetButton>
        <ResetButton onClick={resetWeekly}>Reset Weekly XP</ResetButton>
      </ResetXPButtons>

      <Tabs>
        <TabButton active={tab === 'hourly'} onClick={() => setTab('hourly')}>Hourly Challenges</TabButton>
        <TabButton active={tab === 'weekly'} onClick={() => setTab('weekly')}>Weekly Challenge</TabButton>
      </Tabs>

      {tab === 'hourly' && (
        <>
          <SectionTitle>Engaging Hourly Challenges</SectionTitle>
          <HabitGrid>
            {hourlyHabits.map((habit, idx) => (
              <HabitCard key={idx}>
                <HabitTitle color={habitColors[idx % habitColors.length]}>
                  {habit}
                </HabitTitle>
                <div>
                  <Button
                    difficulty="easy"
                    selected={selectedDifficulty[idx] === 'easy'}
                    onClick={() => markHourlyHabit(idx, 'easy')}
                  >
                    Completed Easily
                  </Button>
                  <Button
                    difficulty="moderate"
                    selected={selectedDifficulty[idx] === 'moderate'}
                    onClick={() => markHourlyHabit(idx, 'moderate')}
                  >
                    Completed (Moderate)
                  </Button>
                  <Button
                    difficulty="hard"
                    selected={selectedDifficulty[idx] === 'hard'}
                    onClick={() => markHourlyHabit(idx, 'hard')}
                  >
                    Completed (Hard)
                  </Button>
                </div>
                {hourlyFeedback[idx] && (
                  <MessageBox>
                    <span>{hourlyFeedback[idx].message}</span>
                  </MessageBox>
                )}
              </HabitCard>
            ))}
          </HabitGrid>
        </>
      )}

      {tab === 'weekly' && (
        <>
          <SectionTitle>Weekly Challenges</SectionTitle>
          <LevelInfo>Level {getWeeklyLevel()}</LevelInfo>
          <XPBar>
            <XPProgress style={{ width: `${(getXPProgress() / 50) * 100}%` }} />
          </XPBar>
          <BadgeList>
            {getBadges(getWeeklyLevel()).map((badge, idx) => (
              <Badge key={idx}>{badge}</Badge>
            ))}
          </BadgeList>
          {weeklyHabits.map((dayHabits, dayIdx) => (
            <ScheduleCard key={dayIdx}>
              <strong>Day {dayIdx + 1}</strong>
              <ul>
                {dayHabits.map((habit, habitIdx) => {
                  const status = dailyStatus[dayIdx]?.[habitIdx];
                  return (
                    <li key={habitIdx}>
                      <label
                        style={{
                          textDecoration: status === 'crossed' ? 'line-through' : 'none',
                          color: status === 'checked' ? 'green' : status === 'crossed' ? 'red' : 'inherit',
                          fontWeight: status ? 'bold' : 'normal',
                          cursor: 'pointer'
                        }}
                        onClick={() => toggleDaily(dayIdx, habitIdx)}
                      >
                        {status === 'checked' ? '✅' : status === 'crossed' ? '❌' : '⬜'} {habit}
                      </label>
                    </li>
                  );
                })}
              </ul>
            </ScheduleCard>
          ))}
          <p>🏆 Days Completed: {completedDays} / 7</p>
        </>
      )}
    </Container>
  );
};

const feedbackMessages = {
  easy: [
    "Awesome! You are building momentum and focus.",
    "Great job finishing that with ease! Keep the streak going.",
    "Solid work—quick wins add up to long-term success."
  ],
  moderate: [
    "Try breaking the task into smaller chunks.",
    "Avoid distractions before starting.",
    "Use a timer to stay focused.",
    "Consider doing it at a time you feel most productive.",
    "Pair the habit with something you enjoy to make it easier."
  ],
  hard: [
    "That was impressive! Overcoming resistance is a powerful habit-building skill.",
    "You pushed through the difficulty—your discipline is growing.",
    "Hard moments build strong habits. You're on the right path!",
    "Not every habit is easy—but every effort counts. Keep at it!"
  ]
};

const hourlyHabits = [
  "Prepare a mind map summarizing a topic you studied",
  "Complete one coding problem from a practice platform",
  "Record a 1-minute voice note reflecting on your mood",
  "Read a page from a technical or non-fiction book",
  "Declutter your workspace or study table",
  "Write a short paragraph on something new you learned",
  "Rewatch a key class concept and take fresh notes",
  "Outline the steps needed to complete your next assignment",
  "Write an email or message to ask for feedback from a mentor",
  "Practice public speaking by reading aloud for 2 minutes"
];

export default HabitChallengeDashboard;
