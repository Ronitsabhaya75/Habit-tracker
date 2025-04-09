/*
  HabitQuizGame Component

  This interactive game tests the user’s knowledge about habit-building
  through a multi-round quiz format with XP rewards and cosmic-themed visuals.

  Key Features
  - 3 quiz rounds, each with randomized habit-based questions
  - XP system that tracks performance across rounds
  - SpinWheel bonus XP popup before each round
  - Summary screen after each round and final results

  Gameplay
  - Multiple choice questions with visual feedback
  - XP earned for each correct answer (stored in localStorage)
  - Incorrect answers do not penalize XP but show feedback
  - Progress bar shows current question and XP earned

  UI/UX
  - Styled with glowing space-themed animations and gradients
  - Responsive layout using styled-components
  - Modal-based transitions and confirmation prompts

  Context
  - Integrates with useHabit context to update overall XP
  - Navigation support to return to dashboard after gameplay
*/

import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import SpinWheelPopup from './SpinWheelPopup';
import { useHabit } from '../../context/HabitContext';
import { useNavigate } from 'react-router-dom';

// Space-themed color palette used throughout the component for consistent styling
const spaceTheme = {
  deepSpace: '#0E1A40',
  deepSpaceGradient: 'linear-gradient(135deg, #0E1A40 0%, #13294B 100%)',
  accentGlow: '#32FFC0',
  accentGold: '#FFDF6C',
  textPrimary: '#D0E7FF',
  actionButton: '#00F9FF',
  actionButtonAlt: '#FF5DA0',
  highlight: '#FFFA81',
  highlightAlt: '#FBC638',
  calendarCell: '#1C2A4A',
  glassOverlay: 'rgba(30, 39, 73, 0.8)'
};

//Creates a gentle floating effect with slight rotation
const floatAnimation = keyframes`
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(2deg); }
  100% { transform: translateY(0) rotate(0deg); }
`;

//Simulates a glowing star pulsing in and out
const starGlow = keyframes`
  0% { opacity: 0.6; filter: blur(1px); transform: scale(0.9); }
  50% { opacity: 1; filter: blur(0px); transform: scale(1.1); }
  100% { opacity: 0.6; filter: blur(1px); transform: scale(0.9); }
`;

//Pulses an element with glowing effect and scaling
const pulseGlow = keyframes`
  0% { transform: scale(1); opacity: 0.6; box-shadow: 0 0 10px ${spaceTheme.accentGlow}; }
  50% { transform: scale(1.05); opacity: 0.8; box-shadow: 0 0 20px ${spaceTheme.accentGlow}, 0 0 30px ${spaceTheme.accentGlow}; }
  100% { transform: scale(1); opacity: 0.6; box-shadow: 0 0 10px ${spaceTheme.accentGlow}; }
`;

//Applies a glowing pulse to text via text-shadow
const glowPulse = keyframes`
  0% { text-shadow: 0 0 5px ${spaceTheme.accentGlow}, 0 0 10px ${spaceTheme.accentGlow}; }
  50% { text-shadow: 0 0 20px ${spaceTheme.accentGlow}, 0 0 30px ${spaceTheme.accentGlow}; }
  100% { text-shadow: 0 0 5px ${spaceTheme.accentGlow}, 0 0 10px ${spaceTheme.accentGlow}; }
`;

//Smooth pop-in effect with scaling and fade-in const warping keyframes
const warping = keyframes`
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
`;

// Main game container with cosmic background and vertical layout
const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  background: ${spaceTheme.deepSpaceGradient};
  color: ${spaceTheme.textPrimary};
  padding: 1rem;
  position: relative;
  overflow: hidden;
`;

// Decorative radial gradient overlay to enhance space ambiance
const BackgroundOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 50%, rgba(50, 255, 192, 0.1) 0%, transparent 70%),
              radial-gradient(circle at 70% 70%, rgba(0, 249, 255, 0.1) 0%, transparent 60%);
  z-index: 1;
`;

// Animated star element with glow, size, color, and movement props
const Star = styled.div`
  position: absolute;
  width: ${props => props.size || '15px'};
  height: ${props => props.size || '15px'};
  background: radial-gradient(circle, ${props => props.color || 'rgba(255, 223, 108, 0.9)'} 0%, rgba(255, 255, 255, 0) 70%);
  border-radius: 50%;
  z-index: 2;
  animation: ${starGlow} ${props => props.duration || '3s'} infinite ease-in-out;
  animation-delay: ${props => props.delay || '0s'};
  opacity: 0.7;

  &::before {
    content: '★';
    position: absolute;
    font-size: ${props => parseInt(props.size) * 0.8 || '12px'};
    color: ${props => props.color || 'rgba(255, 223, 108, 0.9)'};
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

// Header wrapper containing game title and subtitle
const GameHeader = styled.div`
  margin-bottom: 1rem;
  text-align: center;
  z-index: 10;
`;

// Main glowing animated title for the quiz
const GameTitle = styled.h1`
  font-size: 1.8rem;
  color: ${spaceTheme.accentGlow};
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 2px;
  text-shadow: 0 0 10px ${spaceTheme.accentGlow}, 0 0 20px ${spaceTheme.accentGlow};
  animation: ${glowPulse} 3s infinite ease-in-out;
  margin-bottom: 0.25rem;
`;

// Subtitle with descriptive guidance for the user
const GameSubtitle = styled.p`
  font-size: 0.9rem;
  max-width: 600px;
  margin: 0.5rem auto;
  color: ${spaceTheme.textPrimary};
  opacity: 0.9;
`;

// Card container for displaying each quiz question
const QuestionCard = styled.div`
  background: rgba(14, 26, 64, 0.8);
  backdrop-filter: blur(8px);
  padding: 1.5rem;
  border-radius: 12px;
  max-width: 700px;
  width: 90%;
  margin: 0 auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(50, 255, 192, 0.3);
  z-index: 10;
  animation: ${css`${warping} 0.5s ease-out`};
`;

// Title for each question, styled with glow effect
const QuestionHeader = styled.h2`
  font-size: 1.3rem;
  color: ${spaceTheme.accentGlow};
  margin-bottom: 0.75rem;
  font-family: 'Orbitron', sans-serif;
  text-shadow: 0 0 5px ${spaceTheme.accentGlow};
`;

// Actual question text shown above the answer options
const QuestionText = styled.p`
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 1rem;
  color: ${spaceTheme.textPrimary};
`;

// Answer button with dynamic styling for correct incorrect and default states
const OptionButton = styled.button`
  display: block;
  width: 100%;
  padding: 0.7rem 1rem;
  margin-bottom: 0.6rem;
  border-radius: 6px;
  font-size: 0.95rem;
  border: 1px solid rgba(50, 255, 192, 0.3);
  font-weight: 500;
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  transition: all 0.2s ease;
  background: ${props => {
    if (props.answered) {
      if (props.isCorrect) return 'rgba(50, 255, 192, 0.7)';
      if (props.isSelected && !props.isCorrect) return 'rgba(255, 93, 160, 0.7)';
      return 'rgba(28, 42, 74, 0.6)';
    }
    return 'rgba(28, 42, 74, 0.4)';
  }};
  color: ${props => {
    if (props.answered && (props.isCorrect || (props.isSelected && !props.isCorrect))) {
      return spaceTheme.deepSpace;
    }
    return spaceTheme.textPrimary;
  }};

  &:hover {
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.disabled ? 'none' : `0 0 15px rgba(50, 255, 192, 0.3)`};
    background: ${props => {
      if (props.answered) {
        if (props.isCorrect) return 'rgba(50, 255, 192, 0.8)';
        if (props.isSelected && !props.isCorrect) return 'rgba(255, 93, 160, 0.8)';
        return 'rgba(28, 42, 74, 0.7)';
      }
      return 'rgba(28, 42, 74, 0.6)';
    }};
  }
`;

// Container showing XP and current question number
const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  width: 100%;
  padding: 0.3rem 0;
`;

// XP display with star icon and styled highlight
const XPCounter = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${spaceTheme.accentGold};
  display: flex;
  align-items: center;

  &::before {
    content: '⭐';
    margin-right: 0.5rem;
  }
`;

// Displays current question number with subtle styling
const QuestionCounter = styled.div`
  font-size: 0.85rem;
  opacity: 0.8;
`;

// Card container for round summary and feedback
const SummaryCard = styled.div`
  background: rgba(14, 26, 64, 0.8);
  backdrop-filter: blur(8px);
  padding: 1.75rem;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  text-align: center;
  border: 1px solid rgba(50, 255, 192, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  z-index: 10;
  animation: ${css`${warping} 0.5s ease-out`};
`;

// Title showing round completion with glowing effect
const SummaryTitle = styled.h2`
  font-size: 1.5rem;
  color: ${spaceTheme.accentGlow};
  margin-bottom: 1rem;
  font-family: 'Orbitron', sans-serif;
  text-shadow: 0 0 10px ${spaceTheme.accentGlow};
`;

// Text lines showing performance and XP earned
const SummaryText = styled.p`
  font-size: 1rem;
  margin: 0.5rem 0;
  color: ${spaceTheme.textPrimary};
`;

// Emoji-based feedback for performance level
const ResultEmoji = styled.h3`
  font-size: 1.4rem;
  margin: 1rem 0;
  color: ${spaceTheme.accentGold};
  text-shadow: 0 0 10px rgba(255, 223, 108, 0.5);
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 1.25rem;
`;

// Reusable button styled for primary and secondary actions
const Button = styled.button`
  background: ${props => props.primary ? spaceTheme.actionButton : spaceTheme.actionButtonAlt};
  color: ${spaceTheme.deepSpace};
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: bold;
  font-family: 'Orbitron', sans-serif;
  transition: all 0.3s;
  box-shadow: 0 0 10px rgba(0, 249, 255, 0.3);
  min-width: 120px;

  &:hover {
    background: ${spaceTheme.accentGlow};
    transform: translateY(-2px);
    box-shadow: 0 0 15px rgba(50, 255, 192, 0.5);
  }

  &:active {
    transform: translateY(1px);
  }
`;

// Container for welcome message and start button layout
const WelcomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1.5rem;
  z-index: 10;
  margin-top: 1rem;
`;

// Main animated title in the welcome screen
const WelcomeTitle = styled.h1`
  font-size: 2rem;
  color: ${spaceTheme.accentGlow};
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 2px;
  text-shadow: 0 0 10px ${spaceTheme.accentGlow}, 0 0 20px ${spaceTheme.accentGlow};
  animation: ${glowPulse} 3s infinite ease-in-out;
  margin-bottom: 1rem;
`;

// Description paragraph under welcome title
const WelcomeDescription = styled.p`
  font-size: 1rem;
  max-width: 600px;
  margin: 0 auto 1.5rem;
  color: ${spaceTheme.textPrimary};
  line-height: 1.5;
`;

// Full-screen overlay for modals like confirmation and spin wheel
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(10, 15, 30, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

// Modal content box with padding and glowing border
const ModalContent = styled.div`
  background: ${spaceTheme.deepSpaceGradient};
  border-radius: 12px;
  padding: 1.5rem;
  max-width: 90%;
  width: ${props => props.width || '450px'};
  border: 1px solid ${spaceTheme.accentGlow};
  box-shadow: 0 0 20px rgba(50, 255, 192, 0.3);
  animation: ${css`${warping} 0.3s ease-out`};
`;

const RoundBadge = styled.div`
  background: ${spaceTheme.calendarCell};
  color: ${spaceTheme.accentGold};
  border-radius: 20px;
  padding: 0.15rem 0.8rem;
  font-size: 0.8rem;
  font-weight: bold;
  display: inline-block;
  margin-bottom: 0.75rem;
  border: 1px solid rgba(255, 223, 108, 0.3);
`;

const NavButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin: 1rem 0;
  z-index: 10;
  width: 100%;
  max-width: 600px;
`;

// Navigation button with gradient glow and responsive hover animation
const NavButton = styled.button`
  background: linear-gradient(to right, ${spaceTheme.actionButton}, ${spaceTheme.accentGlow});
  color: ${spaceTheme.deepSpace};
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 249, 255, 0.3);
  font-family: 'Orbitron', sans-serif;
  font-size: 0.85rem;
  flex: 1;
  max-width: 180px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 15px rgba(50, 255, 192, 0.5);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const fullQuestionSet = [
  { question: 'What is the ideal time to build a habit?', options: ['Morning', 'Night', 'When motivated', 'Anytime'], correctAnswer: 0 },
  { question: 'Which strategy helps you stay consistent?', options: ['Reminders', 'Relying on willpower', 'Avoiding routine', 'Multitasking'], correctAnswer: 0 },
  { question: 'What does "habit stacking" mean?', options: ['Stacking tasks', 'Linking new habits to existing ones', 'Doing all habits in one hour', 'Avoiding repetition'], correctAnswer: 1 },
  { question: 'What is the benefit of tracking habits?', options: ['Boredom', 'Accountability', 'Perfection', 'Confusion'], correctAnswer: 1 },
  { question: 'Which is an example of a keystone habit?', options: ['Journaling', 'Brushing teeth', 'Exercising', 'Snacking'], correctAnswer: 2 },
  { question: 'What does XP stand for?', options: ['Extra Power', 'Experience Points', 'Excellent Progress', 'Exercise Practice'], correctAnswer: 1 },
  { question: 'How many days to build a habit?', options: ['7', '21', '30', '66'], correctAnswer: 3 },
  { question: 'What is the 2-minute rule?', options: ['Work fast', 'Start with 2 minutes', 'End in 2 minutes', 'Skip task'], correctAnswer: 1 },
  { question: 'Which app feature rewards XP?', options: ['Review Board', 'Quiz Game', 'Spin Wheel', 'All of the above'], correctAnswer: 3 },
  { question: 'Which game tests memory?', options: ['Habit Tracker', 'Habit Flip Game', 'Daily Log', 'Goal Setter'], correctAnswer: 1 },
  { question: 'What increases habit success?', options: ['Consistency', 'Perfection', 'Skipping', 'Avoiding'], correctAnswer: 0 },
  { question: 'What is a habit loop?', options: ['Goal-Cue-Result', 'Cue-Routine-Reward', 'Plan-Do-Eat', 'Wake-Sleep-Wait'], correctAnswer: 1 },
  { question: 'What helps build motivation?', options: ['Rewards', 'Guilt', 'Avoidance', 'Skipping'], correctAnswer: 0 },
  { question: 'Which color shows correct option?', options: ['Red', 'Blue', 'Green', 'Grey'], correctAnswer: 2 },
  { question: 'What is BreakthroughGame used for?', options: ['Tracking water', 'XP habit challenges', 'Sleep patterns', 'Cooking habits'], correctAnswer: 1 },
  { question: 'What happens after weekly goal completion?', options: ['Lose XP', 'Earn badge/sticker', 'Reset level', 'Erase goals'], correctAnswer: 1 },
  { question: 'What is a streak?', options: ['A break', 'Consistent habit tracking', 'Lazy days', 'Timer lapse'], correctAnswer: 1 },
  { question: 'Which strategy avoids burnout?', options: ['All habits daily', 'Tiny steps', 'Overload plan', 'Random time'], correctAnswer: 1 },
  { question: 'Which tool shows XP graph?', options: ['XP board', 'Spin Wheel', 'Review Panel', 'Quiz Graph'], correctAnswer: 0 },
  { question: 'HabitFlipGame helps with?', options: ['Focus', 'Memory + learning', 'Typing', 'Guesswork'], correctAnswer: 1 },
  { question: 'What is a cue in habits?', options: ['End goal', 'Reward', 'Trigger action', 'Schedule'], correctAnswer: 2 },
  { question: 'XP is earned by?', options: ['Wrong answer', 'Clicking anything', 'Correct answer', 'Pausing'], correctAnswer: 2 },
  { question: 'SpinWheel gives?', options: ['Charts', 'Tasks', 'XP boost', 'Comments'], correctAnswer: 2 },
  { question: 'What helps start a habit?', options: ['Big goals', 'Simple routines', 'Guilt', 'Long plans'], correctAnswer: 1 },
  { question: 'Best review time?', options: ['Morning', 'Evening', 'Midnight', 'Afternoon'], correctAnswer: 1 },
  { question: 'Quiz round shows how many questions?', options: ['3-5', '6-8', '8-10', '2-3'], correctAnswer: 1 },
  { question: 'XP stands for?', options: ['eXtra Push', 'eXperience Points', 'eXact Plans', 'eXpense Power'], correctAnswer: 1 },
  { question: 'Who is this quiz for?', options: ['Gamers', 'Habit learners', 'Athletes only', 'Coders'], correctAnswer: 1 },
  { question: 'How does the quiz end?', options: ['Auto skip', 'Manual exit', 'After last question', 'Level up'], correctAnswer: 2 },
  { question: 'Where is XP stored?', options: ['Session memory', 'Local storage', 'Temporary state', 'Database'], correctAnswer: 1 },
  { question: 'When can XP be gained?', options: ['After wrong guess', 'Any option', 'Correct answers', 'Timer reset'], correctAnswer: 2 },
  { question: 'What is habit reflection?', options: ['Thinking about habits', 'Avoiding habits', 'Forgetting habits', 'Removing habits'], correctAnswer: 0 },
  { question: 'What is the first step to habit change?', options: ['Start big', 'Self-awareness', 'Ignore it', 'Set rewards'], correctAnswer: 1 },
  { question: 'What does SMART goal stand for?', options: ['Simple, Mindful, Accurate, Reasonable, Timed', 'Specific, Measurable, Achievable, Relevant, Time-bound', 'Speedy, Measurable, Adjustable, Random, Timed', 'Strict, Methodical, Achievable, Reasoned, Tough'], correctAnswer: 1 },
  { question: 'What breaks a habit loop?', options: ['Stress', 'Awareness and planning', 'Random routine', 'Skipping rewards'], correctAnswer: 1 },
  { question: 'Best way to track water intake?', options: ['Write stories', 'Use a tracker', 'Guess amount', 'Ignore it'], correctAnswer: 1 },
  { question: 'How to keep up a new habit?', options: ['Force it', 'Be flexible', 'Punish self', 'Do once'], correctAnswer: 1 },
  { question: 'Why use habit apps?', options: ['Distraction', 'Guided support', 'Avoid goals', 'Waste time'], correctAnswer: 1 },
  { question: 'What promotes long-term success?', options: ['Quick changes', 'Consistency', 'Luck', 'Avoiding effort'], correctAnswer: 1 },
  { question: 'Which is a tiny habit?', options: ['Running 5 miles', 'Drinking water after waking up', 'Skipping meals', 'Cleaning entire house'], correctAnswer: 1 },
  { question: 'What does gamifying habits do?', options: ['Makes it boring', 'Increases engagement', 'Confuses user', 'Blocks routine'], correctAnswer: 1 },
  { question: 'Which helps build a daily routine?', options: ['Guesswork', 'Fixed wake time', 'Avoid calendar', 'Do random'], correctAnswer: 1 },
  { question: 'Why track progress?', options: ['To celebrate success', 'To shame', 'To guess', 'To ignore goals'], correctAnswer: 0 },
  { question: 'Which is a self-care habit?', options: ['Ignoring rest', 'Meditation', 'Skipping meals', 'Overworking'], correctAnswer: 1 },
  { question: 'Which mindset helps habit-building?', options: ['Fixed', 'Growth', 'Negative', 'Hopeless'], correctAnswer: 1 },
  { question: 'What resets a habit?', options: ['Break it', 'Restart small', 'Avoid trying', 'Give up'], correctAnswer: 1 },
  { question: 'Which helps you stay motivated?', options: ['Discipline + rewards', 'Complaints', 'Avoid planning', 'Stress'], correctAnswer: 0 },
  { question: 'What is the benefit of journaling habits?', options: ['Forget goals', 'Track thoughts + progress', 'Add confusion', 'Remove goals'], correctAnswer: 1 },
  { question: 'Why celebrate small wins?', options: ['Boosts confidence', 'No reason', 'Distracts', 'Reduces motivation'], correctAnswer: 0 },
  { question: 'Why is environment important?', options: ['Affects behavior', 'Does not matter', 'Only location', 'None'], correctAnswer: 0 },
  { question: 'How to create a habit loop?', options: ['Cue → Routine → Reward', 'Skip → Act → Think', 'Plan → Delay → Quit', 'None'], correctAnswer: 0 },
  { question: 'What is habit temptation bundling?', options: ['Pair fun task with a habit', 'Avoid tasks', 'Do everything at once', 'Skip chores'], correctAnswer: 0 },
  { question: 'Which breaks bad habits?', options: ['Avoid cues', 'Reward them', 'Repeat randomly', 'None'], correctAnswer: 0 },
  { question: 'Which boosts consistency?', options: ['Skipping days', 'Same time daily', 'Unplanned breaks', 'Delaying'], correctAnswer: 1 },
  { question: 'How to keep motivation alive?', options: ['Track XP', 'Give up', 'Pause daily', 'Remove goals'], correctAnswer: 0 },
  { question: 'Which helps avoid forgetfulness?', options: ['Reminders', 'Delay', 'Ignore', 'Sleep late'], correctAnswer: 0 },
  { question: 'What creates accountability?', options: ['Tell no one', 'Use habit buddy', 'Hide goals', 'Forget app'], correctAnswer: 1 },
  { question: 'Which tool inspires habit growth?', options: ['XP boost', 'Daily neglect', 'Overplanning', 'Skipping weekends'], correctAnswer: 0 },
  { question: 'Why plan habits?', options: ['Boost clarity', 'Cause stress', 'Remove fun', 'Confuse you'], correctAnswer: 0 },
  { question: 'What is a habit milestone?', options: ['Mid-goal checkpoint', 'Final result', 'Skipping', 'Restart'], correctAnswer: 0 },
  { question: 'Why does visualization help?', options: ['Enhances belief', 'Slows action', 'Causes doubt', 'Avoids routine'], correctAnswer: 0 },
  { question: 'Which helps during hard days?', options: ['Habits', 'No structure', 'Chaos', 'Stress eating'], correctAnswer: 0 },
  { question: 'What to do after missing a habit?', options: ['Restart', 'Quit', 'Punish', 'Ignore forever'], correctAnswer: 0 },
  { question: 'What does habit review involve?', options: ['Reflecting + adjusting', 'Forgetting', 'Overthinking', 'Blaming others'], correctAnswer: 0 },
  { question: 'How to stay consistent?', options: ['Daily check-ins', 'Ignore app', 'Guess time', 'Random acts'], correctAnswer: 0 }
];

const HabitQuizGame = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const { updateProgress } = useHabit();
  const [xp, setXP] = useState(() => {
    const saved = localStorage.getItem('quizXP');
    return saved ? parseInt(saved) : 0;
  });
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [started, setStarted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [roundNumber, setRoundNumber] = useState(1);
  const [finalSummary, setFinalSummary] = useState(false);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [showStartConfirm, setShowStartConfirm] = useState(false);
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [initialSpinDone, setInitialSpinDone] = useState(false);

  useEffect(() => {
    if (started && !showSpinWheel && !initialSpinDone) {
      setShowSpinWheel(true);
    } else if (started && !showSpinWheel && initialSpinDone) {
      if (roundNumber === 1) {
        setXP(0);
        localStorage.setItem('quizXP', '0');
      }
      loadQuestions();
    }
  }, [started, showSpinWheel, initialSpinDone]);

  // Loads a randomized set of questions for the current round and resets game state
  const loadQuestions = () => {
    const questionCount = Math.floor(Math.random() * 3) + 6;
    const shuffled = [...fullQuestionSet].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, questionCount));
    setCurrentIndex(0);
    setAnswered(false);
    setSelected(null);
    setGameEnded(false);
    setCorrectCount(0);
    setShowSummary(false);
  };

  const handleAnswer = (index) => {
    if (answered || gameEnded) return;

    setSelected(index);
    const currentQuestion = questions[currentIndex];

    if (index === currentQuestion.correctAnswer) {
      const newXP = xp + 10;
      setXP(newXP);
      localStorage.setItem('quizXP', newXP);
      updateProgress('games', 10);
      setCorrectCount(prev => prev + 1);
    }

    setAnswered(true);


    setTimeout(() => {
      if (currentIndex + 1 >= questions.length) {
        setGameEnded(true);
      } else {
        setCurrentIndex(prev => prev + 1);
        setAnswered(false);
        setSelected(null);
      }
    }, 1200);
  };


  const getEmoji = () => {
    const ratio = correctCount / questions.length;
    if (ratio === 1) return "🏆 Perfect!";
    if (ratio >= 0.8) return "🎉 Great job!";
    if (ratio >= 0.5) return "👍 Good effort!";
    return "💡 Keep practicing!";
  };

  // Moves to the next round or shows final summary after round 3
  const handleNextRound = () => {
    setTotalCorrect(prev => prev + correctCount);
    if (roundNumber < 3) {
      setRoundNumber(prev => prev + 1);
      loadQuestions();
    } else {
      setFinalSummary(true);
    }
  };

  // Resets all game state to restart the quiz from round 1
  const handleReplay = () => {
    setRoundNumber(1);
    setXP(0);
    setTotalCorrect(0);
    setStarted(true);
    setFinalSummary(false);
    setInitialSpinDone(false);
    setShowSpinWheel(true);
  };

  // Adds bonus XP from SpinWheel and updates storage and progress
  const handleXPReward = (reward) => {
    const newXP = xp + reward;
    setXP(newXP);
    localStorage.setItem('quizXP', newXP.toString());
    updateProgress('games', reward);
  };

  const navigateToDashboard = () => {
    navigate('/dashboard');
  };

  if (!started) {
    return (
      <GameContainer>
        <BackgroundOverlay />
        <Star size="20px" style={{ top: '10%', left: '10%' }} duration="4s" delay="0.5s" color="rgba(255, 223, 108, 0.9)" />
        <Star size="15px" style={{ top: '25%', left: '25%' }} duration="3s" delay="1s" color="rgba(50, 255, 192, 0.9)" />
        <Star size="25px" style={{ top: '15%', right: '30%' }} duration="5s" delay="0.2s" color="rgba(0, 249, 255, 0.9)" />
        <Star size="18px" style={{ bottom: '20%', right: '15%' }} duration="4.5s" delay="0.7s" color="rgba(255, 223, 108, 0.9)" />

        <WelcomeContainer>
          <WelcomeTitle>Habit Quiz Challenge</WelcomeTitle>
          <WelcomeDescription>
            Test your knowledge across 3 rounds and earn XP! Answer habit questions correctly to level up your understanding.
          </WelcomeDescription>
          <Button primary onClick={() => setShowStartConfirm(true)}>
            Start Quiz
          </Button>
        </WelcomeContainer>

        {showStartConfirm && (
          <ModalOverlay>
            <ModalContent>
              <SummaryTitle>🚀 Ready to begin?</SummaryTitle>
              <SummaryText>
                This quiz includes 3 rounds of random habit-related questions. You'll earn XP for correct answers and get SpinWheel bonuses between rounds.
              </SummaryText>
              <ButtonsContainer>
                <Button
                  primary
                  onClick={() => {
                    setStarted(true);
                    setShowStartConfirm(false);
                  }}
                >
                  Begin Challenge
                </Button>
                <Button
                  onClick={() => setShowStartConfirm(false)}
                >
                  Cancel
                </Button>
              </ButtonsContainer>
            </ModalContent>
          </ModalOverlay>
        )}
      </GameContainer>
    );
  }

  return (
    <GameContainer>
      <BackgroundOverlay />
      <Star size="20px" style={{ top: '10%', left: '10%' }} duration="4s" delay="0.5s" color="rgba(255, 223, 108, 0.9)" />
      <Star size="15px" style={{ top: '25%', left: '25%' }} duration="3s" delay="1s" color="rgba(50, 255, 192, 0.9)" />
      <Star size="25px" style={{ top: '15%', right: '30%' }} duration="5s" delay="0.2s" color="rgba(0, 249, 255, 0.9)" />
      <Star size="18px" style={{ bottom: '20%', right: '15%' }} duration="4.5s" delay="0.7s" color="rgba(255, 223, 108, 0.9)" />

      <GameHeader>
        <GameTitle>Habit Quiz Challenge</GameTitle>
        <GameSubtitle>Test your knowledge and earn XP rewards</GameSubtitle>
      </GameHeader>

      {showSpinWheel && (
        <ModalOverlay>
          <ModalContent width="600px">
            <SpinWheelPopup
              onClose={() => {
                setShowSpinWheel(false);
                setInitialSpinDone(true);
              }}
              roundNumber={roundNumber}
              onXPReward={handleXPReward}
            />
          </ModalContent>
        </ModalOverlay>
      )}

      {!gameEnded ? (
        <QuestionCard>
          <RoundBadge>Round {roundNumber}</RoundBadge>
          <QuestionHeader>Question {currentIndex + 1}</QuestionHeader>
          <QuestionText>{questions[currentIndex]?.question}</QuestionText>
          <div>
            {questions[currentIndex]?.options.map((option, i) => (
              <OptionButton
                key={i}
                onClick={() => handleAnswer(i)}
                answered={answered}
                isCorrect={i === questions[currentIndex].correctAnswer}
                isSelected={i === selected}
                disabled={answered}
              >
                {option}
              </OptionButton>
            ))}
          </div>
          <ProgressInfo>
            <XPCounter>{xp} XP</XPCounter>
            <QuestionCounter>Question {currentIndex + 1} of {questions.length}</QuestionCounter>
          </ProgressInfo>
        </QuestionCard>
      ) : !showSummary ? (
        <SummaryCard>
          <SummaryTitle>Round {roundNumber} Complete!</SummaryTitle>
          <SummaryText><strong>Correct Answers:</strong> {correctCount} / {questions.length}</SummaryText>
          <SummaryText><strong>XP Earned:</strong> {correctCount * 10}</SummaryText>
          <ResultEmoji>{getEmoji()}</ResultEmoji>

          <ButtonsContainer>
            <Button
              primary
              onClick={() => {
                setShowSummary(true);
                handleNextRound();
              }}
            >
              {roundNumber < 3 ? 'Next Round' : 'See Final Results'}
            </Button>
            <Button onClick={navigateToDashboard}>
              Exit to Home
            </Button>
          </ButtonsContainer>
        </SummaryCard>
      ) : finalSummary ? (
        <SummaryCard>
          <SummaryTitle>Quiz Complete!</SummaryTitle>
          <SummaryText><strong>Total Correct:</strong> {totalCorrect}</SummaryText>
          <SummaryText><strong>Total XP Earned:</strong> {xp}</SummaryText>
          <ResultEmoji>🌟 Cosmic Achievement!</ResultEmoji>
          <ButtonsContainer>
            <Button primary onClick={handleReplay}>Play Again</Button>
            <Button onClick={navigateToDashboard}>Return Home</Button>
          </ButtonsContainer>
        </SummaryCard>
      ) : null}
    </GameContainer>
  );
};

export default HabitQuizGame;
