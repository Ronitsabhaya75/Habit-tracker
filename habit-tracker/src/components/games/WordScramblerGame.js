/**
 * WordScramblerGame Component
 *
 * This interactive mini-game helps users boost vocabulary and habit-related word knowledge
 * through two modes:
 * - Scrambled: Players unscramble shuffled letters.
 * - Missing Letters: Players fill in missing letters in a partially masked word.
 *
 * Features:
 * - 3 rounds with 5 questions each (15 questions total).
 * - Tracks XP for both modes and stores it in localStorage.
 * - Offers instant feedback and word definitions.
 * - Visual rewards through XP and round completion messages.
 * - Reset functionality for both individual and total XP.
 *
 * Uses React hooks (useState, useEffect), styled-components for UI,
 * and React Router's `useNavigate` to redirect users upon completion.
 *
 * The code follows a modular and readable structure to ensure maintainability.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Array of word objects used across modes
const scrambledWords = [
    { word: 'focus', meaning: 'The center of interest or activity.' },
    { word: 'discipline', meaning: 'Training to act in accordance with rules.' },
    { word: 'habit', meaning: 'A regular practice, especially one that is hard to give up.' },
    { word: 'routine', meaning: 'A sequence of actions regularly followed.' },
    { word: 'goal', meaning: 'The object of a person\'s ambition or effort.' },
    { word: 'mindfulness', meaning: 'The quality of being conscious or aware of something.' },
    { word: 'exercise', meaning: 'Activity requiring physical effort.' },
    { word: 'journaling', meaning: 'The act of writing in a journal.' },
    { word: 'gratitude', meaning: 'The quality of being thankful.' },
    { word: 'consistency', meaning: 'Conformity in the application of something.' },
    { word: 'positivity', meaning: 'The practice of being positive.' },
    { word: 'planning', meaning: 'The process of making plans.' },
    { word: 'reading', meaning: 'The action or skill of reading written or printed matter.' },
    { word: 'hydration', meaning: 'The process of causing something to absorb water.' },
    { word: 'nutrition', meaning: 'The process of providing or obtaining food.' },
    { word: 'walking', meaning: 'The activity of going for walks.' },
    { word: 'learning', meaning: 'The acquisition of knowledge or skills.' },
    { word: 'sleep', meaning: 'A condition of body and mind which typically recurs for several hours every night.' },
    { word: 'reflection', meaning: 'Serious thought or consideration.' },
    { word: 'meditation', meaning: 'The action of meditating.' },
    { word: 'visualization', meaning: 'The formation of a mental image.' },
    { word: 'affirmation', meaning: 'The action or process of affirming something.' },
    { word: 'decluttering', meaning: 'Removing unnecessary items from an untidy place.' },
    { word: 'organization', meaning: 'The action of organizing something.' },
    { word: 'accountability', meaning: 'The fact of being responsible for actions.' },
    { word: 'breathing', meaning: 'The process of taking air into and expelling it from the lungs.' },
    { word: 'structure', meaning: 'The arrangement of and relations between parts.' },
    { word: 'balance', meaning: 'An even distribution of weight enabling someone to remain upright.' },
    { word: 'selfcare', meaning: 'The practice of taking action to preserve health.' },
    { word: 'practice', meaning: 'Repeated exercise in an activity.' },
    { word: 'skill', meaning: 'The ability to do something well.' },
    { word: 'motivation', meaning: 'The reason for acting in a particular way.' },
    { word: 'awareness', meaning: 'Knowledge or perception of a situation or fact.' },
    { word: 'action', meaning: 'The process of doing something.' },
    { word: 'patience', meaning: 'The capacity to accept delay without getting angry.' },
    { word: 'growth', meaning: 'The process of increasing in size or development.' },
    { word: 'challenge', meaning: 'A call to take part in a contest or competition.' },
    { word: 'energy', meaning: 'The strength required for sustained activity.' },
    { word: 'intention', meaning: 'A thing intended; an aim or plan.' },
    { word: 'commitment', meaning: 'The state of being dedicated to a cause.' },
    { word: 'support', meaning: 'Giving assistance to someone.' },
    { word: 'kindness', meaning: 'The quality of being friendly and considerate.' },
    { word: 'confidence', meaning: 'The feeling of self-assurance.' },
    { word: 'tracking', meaning: 'Observing the progress of something.' },
    { word: 'scheduling', meaning: 'Planning when something should happen.' },
    { word: 'goalsetting', meaning: 'The process of identifying objectives.' },
    { word: 'mindset', meaning: 'The established set of attitudes held by someone.' },
    { word: 'resilience', meaning: 'The capacity to recover quickly.' },
    { word: 'adaptability', meaning: 'Being able to adjust to new conditions.' },
    { word: 'simplicity', meaning: 'The quality of being easy to understand.' },
    { word: 'efficiency', meaning: 'Achieving maximum productivity.' },
    { word: 'reward', meaning: 'A thing given in recognition.' },
    { word: 'effort', meaning: 'A vigorous or determined attempt.' },
    { word: 'achievement', meaning: 'A thing done successfully.' },
    { word: 'review', meaning: 'Evaluation of performance.' },
    { word: 'habitloop', meaning: 'Cue-Routine-Reward cycle.' },
    { word: 'habitstack', meaning: 'Attaching new habits to existing ones.' },
    { word: 'trigger', meaning: 'Something that initiates behavior.' },
    { word: 'routinecheck', meaning: 'Assessing regular tasks.' },
    { word: 'reflectiontime', meaning: 'A period for introspection.' },
    { word: 'focuszone', meaning: 'A distraction-free time block.' },
    { word: 'winddown', meaning: 'Preparing to relax or sleep.' },
    { word: 'earlystart', meaning: 'Waking up early for a head start.' },
    { word: 'deepwork', meaning: 'Focused, undistracted work time.' },
    { word: 'sleeptrack', meaning: 'Monitoring sleep patterns.' },
    { word: 'watertrack', meaning: 'Tracking water intake.' },
    { word: 'positivethink', meaning: 'Optimistic and constructive thought process.' },
    { word: 'habitlog', meaning: 'A record of your habits.' },
    { word: 'selftalk', meaning: 'Talking to oneself positively or reflectively.' },
    { word: 'stretching', meaning: 'Gentle exercises to improve flexibility.' }
  ];

// To generate missing-letter patterns by hiding every second character
const generateMissingLetters = (word) => {
  return word
    .split('')
    .map((char, i) => (i % 2 === 0 ? char : '_'))
    .join('');
};

// Transform full word list into "missing letter" word format
const missingWords = scrambledWords.map(({ word, meaning }) => ({
  word,
  display: generateMissingLetters(word),
  meaning
}));

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

const WordScramblerGame = () => {
// UI/game state
  const [tab, setTab] = useState('scrambled'); // Mode toggle: scrambled or missing
  const [round, setRound] = useState(1); // Current round (1-3)
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState(''); // User's input
  const [message, setMessage] = useState('');
  const [showMeaning, setShowMeaning] = useState(false); // Toggle for definition view
  const [scrambled, setScrambled] = useState('');
  const [xp, setXP] = useState(() => parseInt(localStorage.getItem('scrambledXP')) || 0);
  const [attempts, setAttempts] = useState(0);
  const [currentSet, setCurrentSet] = useState([]);
  const [showRoundMessage, setShowRoundMessage] = useState(false);
  const navigate = useNavigate(); // To redirect after completion

  const totalRounds = 3;
  const questionsPerRound = 5;
  const totalQuestions = totalRounds * questionsPerRound;

  useEffect(() => {
    const baseWords = tab === 'scrambled' ? scrambledWords : missingWords;
    const randomized = shuffleArray([...baseWords]).slice(0, totalQuestions);
    setCurrentSet(randomized);
    setXP(parseInt(localStorage.getItem(`${tab}XP`)) || 0);
    setIndex(0);
    setGuess('');
    setShowMeaning(false);
    setMessage('');
    setAttempts(0);
    setShowRoundMessage(false);
    setRound(1);
  }, [tab]);

  useEffect(() => {
    if (currentSet.length > 0) {
      if (tab === 'scrambled') {
        setScrambled(scrambleWord(currentSet[index].word));
      } else {
        setScrambled(currentSet[index].display);
      }
    }
  }, [index, currentSet, tab]);

// Scrambles letters of a word
  const scrambleWord = (word) => word.split('').sort(() => Math.random() - 0.5).join('');

  const handleCheck = () => {
    if (guess.trim().toLowerCase() === currentSet[index].word.toLowerCase()) {
      setMessage('✅ Correct!');
      setShowMeaning(true);
      const gainedXP = xp + 10;
      setXP(gainedXP);
      localStorage.setItem(`${tab}XP`, gainedXP);
// Update total XP from both modes
      localStorage.setItem('totalWordGameXP',
        (parseInt(localStorage.getItem('scrambledXP')) || 0) +
        (parseInt(localStorage.getItem('missingXP')) || 0)
      );
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 3) {
        setMessage(`❌ Incorrect! The correct word is: ${currentSet[index].word}`);
        setShowMeaning(true);
      } else {
        setMessage(`❌ Try Again! (${newAttempts}/3 attempts)`);
      }
    }
  };

// Proceeds to next question or round
  const handleNext = () => {
    const nextIndex = index + 1;
    if (nextIndex % questionsPerRound === 0 && nextIndex < totalQuestions) {
      setShowRoundMessage(true);
      setTimeout(() => {
        setShowRoundMessage(false);
        moveToNextQuestion(nextIndex);
      }, 1500);
    } else {
      moveToNextQuestion(nextIndex);
    }
  };

// Handles all logic to clean up and go to next question
  const moveToNextQuestion = (nextIndex) => {
    if (nextIndex < totalQuestions) {
      setIndex(nextIndex);
      setGuess('');
      setShowMeaning(false);
      setMessage('');
      setAttempts(0);
      setRound(Math.floor(nextIndex / questionsPerRound) + 1);
    } else {
      alert("🎉 You've completed all rounds!");
      navigate('/dashboard');
    }
  };

  const resetXP = () => {
    localStorage.setItem(`${tab}XP`, '0');
    setXP(0);
  };

  const resetTotalXP = () => {
    localStorage.setItem('scrambledXP', '0');
    localStorage.setItem('missingXP', '0');
    localStorage.setItem('totalWordGameXP', '0');
    setXP(0);
  };

// Game UI container with mode toggle, XP, question/answer inputs and navigation buttons

  return (
    <Container>
      <Title>🔤 Word Scrambler Game</Title>
      <XPDisplay>
        ⭐ {tab} XP: {xp} | 🌟 Total XP: {parseInt(localStorage.getItem('totalWordGameXP')) || 0}
      </XPDisplay>
      <TabWrapper>
        <Tab active={tab === 'scrambled'} onClick={() => setTab('scrambled')}>Scrambled</Tab>
        <Tab active={tab === 'missing'} onClick={() => setTab('missing')}>Missing Letters</Tab>
      </TabWrapper>
      <Card>
        {showRoundMessage && <h3 style={{ color: '#27ae60' }}>🎉 Round {round - 1} Complete!</h3>}
        {!showRoundMessage && (
          <>
            <p style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.5rem' }}>
              🌀 Round {round} of {totalRounds} | ❓ Question {index % questionsPerRound + 1} of {questionsPerRound} | Attempt {attempts + 1} of 3
            </p>
            <h3>{tab === 'scrambled' ? 'Unscramble this:' : 'Fill in the missing letters:'}</h3>
            <h2>{scrambled}</h2>
            <input
              type="text"
              value={guess}
              placeholder="Type your guess..."
              onChange={(e) => setGuess(e.target.value)}
              style={inputStyle}
            />
            <button onClick={handleCheck} style={buttonStyle}>Check</button>
            {message && <p style={{ fontSize: '1.1rem', marginTop: '1rem' }}>{message}</p>}
            {showMeaning && (
              <div style={meaningStyle}>
                <p><strong>{currentSet[index].word}</strong>: {currentSet[index].meaning}</p>
                <button onClick={handleNext} style={buttonStyle}>Next</button>
              </div>
            )}
            <button onClick={resetXP} style={{ ...buttonStyle, background: '#e67e22' }}>Reset {tab} XP</button>
            <button onClick={resetTotalXP} style={{ ...buttonStyle, background: '#c0392b', marginTop: '0.5rem' }}>Reset Total XP</button>
          </>
        )}
      </Card>
    </Container>
  );
};

  const Container = styled.div`
    min-height: 100vh;
    background: linear-gradient(to bottom right, #1e3c72, #2a5298);
    color: white;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  `;

  const Title = styled.h1`
    margin-bottom: 1rem;
  `;

  const XPDisplay = styled.p`
    font-weight: bold;
  `;

  const TabWrapper = styled.div`
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
  `;

  const Tab = styled.button`
    padding: 0.7rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    background: ${({ active }) => (active ? '#4CAF50' : '#ccc')};
    color: ${({ active }) => (active ? 'white' : 'black')};
    cursor: pointer;
  `;

  const Card = styled.div`
    background: #2c3e50;
    color: white;
    padding: 2rem;
    border-radius: 20px;
    max-width: 600px;
    text-align: center;
    box-shadow: 0 0 15px rgba(0,0,0,0.15);
  `;

  const inputStyle = {
    padding: '0.75rem',
    fontSize: '1.1rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    width: '80%',
    marginBottom: '1rem'
  };

  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    fontSize: '1.1rem',
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '0.5rem'
  };

  const meaningStyle = {
    marginTop: '1.5rem',
    background: '#34495e',
    color: '#ecf0f1',
    padding: '1rem',
    borderRadius: '10px'
  };

  export default WordScramblerGame;
