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
import { useHabit } from '../../context/HabitContext';

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

// Function to create "Missing Letters" version of words
const generateMissingLetters = (word) =>
  word.split('').map((char, i) => (i % 2 === 0 ? char : '_')).join('');

// Create "missingWords" array based on scrambledWords
const missingWords = scrambledWords.map(({ word, meaning }) => ({
  word,
  display: generateMissingLetters(word),
  meaning
}));

// Shuffles array elements randomly
const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

const WordScramblerGame = () => {
  const [tab, setTab] = useState('scrambled');
  const [round, setRound] = useState(1);// Current round number
  const [index, setIndex] = useState(0); // Current question index
  const [guess, setGuess] = useState(''); // User input
  const [message, setMessage] = useState('');
  const [showMeaning, setShowMeaning] = useState(false);
  const [scrambled, setScrambled] = useState('');// Shuffled/masked word to show
  const { updateProgress } = useHabit();
  const [xp, setXP] = useState(() => parseInt(localStorage.getItem('scrambledXP')) || 0);
  const [attempts, setAttempts] = useState(0);// Attempt count for current word
  const [currentSet, setCurrentSet] = useState([]);// Current randomized list of questions
  const [showRoundMessage, setShowRoundMessage] = useState(false);
  const [maxAttemptsReached, setMaxAttemptsReached] = useState(false);// Lock after 3 attempts
  const navigate = useNavigate();// React Router navigation

  const totalRounds = 3;
  const questionsPerRound = 5;
  const totalQuestions = totalRounds * questionsPerRound;

  // Initialize new set of questions whenever tab changes
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
    setMaxAttemptsReached(false);
    setShowRoundMessage(false);
    setRound(1);
  }, [tab]);

  // Set new scrambled/missing word based on index and tab
  useEffect(() => {
    if (currentSet.length > 0) {
      setScrambled(
        tab === 'scrambled'
          ? scrambleWord(currentSet[index].word)
          : currentSet[index].display
      );
    }
  }, [index, currentSet, tab]);

  const scrambleWord = (word) => word.split('').sort(() => Math.random() - 0.5).join('');

  // Navigate back to breakthrough game
  const navigateBack = () => {
    navigate('/breakthrough-game');
  };

  const handleCheck = () => {
    // Don't allow more checks if max attempts reached
    if (maxAttemptsReached) return;

    if (guess.trim().toLowerCase() === currentSet[index].word.toLowerCase()) {
      setMessage('✅ Correct!');
      setShowMeaning(true);
      const gainedXP = xp + 10;
      setXP(gainedXP);
      localStorage.setItem(`${tab}XP`, gainedXP);
      localStorage.setItem('totalWordGameXP',
        (parseInt(localStorage.getItem('scrambledXP')) || 0) +
        (parseInt(localStorage.getItem('missingXP')) || 0)
      );
      updateProgress('games', 10);
    } else {
      const newAttempts = attempts + 1;
      if (newAttempts >= 3) {
        setMessage(`❌ Incorrect! The correct word is: ${currentSet[index].word}`);
        setShowMeaning(true);
        setAttempts(3); // Cap attempts at 3
        setMaxAttemptsReached(true); // Mark that max attempts have been reached
      } else {
        setMessage(`❌ Try Again! (${newAttempts}/3 attempts)`);
        setAttempts(newAttempts);
      }
    }
  };

  // Moves to next question or shows round message
  const handleNext = () => {
    const nextIndex = index + 1;
    if (nextIndex % questionsPerRound === 0 && nextIndex < totalQuestions) {
      setShowRoundMessage(true);
      setTimeout(() => {
        setShowRoundMessage(false);
        moveToNextQuestion(nextIndex);
      }, 1500);
    } else if (nextIndex === totalQuestions) {
      setShowRoundMessage(true);
    } else {
      moveToNextQuestion(nextIndex);
    }
  };

  // Updates state to begin new question
  const moveToNextQuestion = (nextIndex) => {
    if (nextIndex < totalQuestions) {
      setIndex(nextIndex);
      setGuess('');
      setShowMeaning(false);
      setMessage('');
      setAttempts(0);
      setMaxAttemptsReached(false); // Reset the max attempts flag
      setRound(Math.floor(nextIndex / questionsPerRound) + 1);
    }
  };

  const resetXP = () => {
    localStorage.setItem(`${tab}XP`, '0');
    setXP(0);
  };

  // Resets all XP (scrambled, missing, total)
  const resetTotalXP = () => {
    localStorage.setItem('scrambledXP', '0');
    localStorage.setItem('missingXP', '0');
    localStorage.setItem('totalWordGameXP', '0');
    setXP(0);
  };

  return (
    <Wrapper>
      <GameHeader>
        <Title>🔤 Word Scrambler Game</Title>
        <XPDisplay>
          ⭐ {tab} XP: {xp} | 🌟 Total XP: {parseInt(localStorage.getItem('totalWordGameXP')) || 0}
        </XPDisplay>
        <TabSelector>
          <Tab active={tab === 'scrambled'} onClick={() => setTab('scrambled')}>Scrambled</Tab>
          <Tab active={tab === 'missing'} onClick={() => setTab('missing')}>Missing Letters</Tab>
        </TabSelector>
        <BackButton onClick={navigateBack}>Back to Breakthrough</BackButton>
      </GameHeader>

      <Card>
        {showRoundMessage ? (
          <RoundMessage>
            {index + 1 === totalQuestions ? (
              <>
                🎉 All Rounds Completed!
                <ButtonGroup>
                  <ActionButton onClick={() => window.location.reload()}>Retry</ActionButton>
                  <ActionButton onClick={() => navigate('/dashboard')}>Home</ActionButton>
                  <ActionButton onClick={navigateBack} style={{ background: '#3498db' }}>
                    Back to Breakthrough
                  </ActionButton>
                </ButtonGroup>
              </>
            ) : (
              <>🎉 Round {round} Complete!</>
            )}
          </RoundMessage>
        ) : (
          <>
            <ProgressText>
              🌀 Round {round} of {totalRounds} | ❓ Question {index % questionsPerRound + 1} of {questionsPerRound} | Attempt {Math.min(attempts + 1, 3)} of 3
            </ProgressText>
            <Prompt>{tab === 'scrambled' ? 'Unscramble this:' : 'Fill in the missing letters:'}</Prompt>
            <WordDisplay>{scrambled}</WordDisplay>
            <InputField
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Type your guess..."
              disabled={maxAttemptsReached || showMeaning}
            />
            {!showMeaning && (
              <ActionButton
                onClick={handleCheck}
                disabled={maxAttemptsReached}
                style={{ opacity: maxAttemptsReached ? 0.5 : 1 }}
              >
                Check
              </ActionButton>
            )}
            {message && <Feedback>{message}</Feedback>}
            {showMeaning && (
              <Definition>
                <strong>{currentSet[index].word}</strong>: {currentSet[index].meaning}
                <ActionButton onClick={handleNext}>Next</ActionButton>
              </Definition>
            )}
            <ButtonGroup>
              <ActionButton onClick={resetXP} style={{ background: '#e67e22' }}>Reset {tab} XP</ActionButton>
              <ActionButton onClick={resetTotalXP} style={{ background: '#c0392b' }}>Reset Total XP</ActionButton>
            </ButtonGroup>
          </>
        )}
      </Card>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom right, #1a2038, #293462);
  color: white;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Montserrat', sans-serif;
`;

const GameHeader = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  position: relative;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  background: linear-gradient(to right, #e6c200, #ffeb99);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const XPDisplay = styled.p`
  font-size: 1.2rem;
  margin-top: 0.5rem;
`;

const TabSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const Tab = styled.button`
  background: ${({ active }) => (active ? '#4CAF50' : '#ccc')};
  color: ${({ active }) => (active ? 'white' : 'black')};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
`;

const BackButton = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  display: block;
  margin-left: auto;
  margin-right: auto;

  &:hover {
    background: #2980b9;
  }
`;

const Card = styled.div`
  background: #2c3e50;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  width: 100%;
  max-width: 600px;
  text-align: center;
`;

const RoundMessage = styled.h3`
  font-size: 1.8rem;
  color: #27ae60;
`;

const ProgressText = styled.p`
  font-weight: bold;
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const Prompt = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
`;

const WordDisplay = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const InputField = styled.input`
  padding: 0.75rem;
  font-size: 1.1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  width: 80%;
  margin-bottom: 1rem;
  opacity: ${props => props.disabled ? 0.7 : 1};
`;

const ActionButton = styled.button`
  background: #4CAF50;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  margin-top: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    transform: ${props => props.disabled ? 'none' : 'translateY(-3px)'};
    box-shadow: ${props => props.disabled ? 'none' : '0 6px 12px rgba(0, 0, 0, 0.3)'};
  }

  &:active {
    transform: ${props => props.disabled ? 'none' : 'translateY(1px)'};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1rem;
`;

const Feedback = styled.p`
  font-size: 1.1rem;
  margin-top: 1rem;
`;

const Definition = styled.div`
  background: #34495e;
  color: #ecf0f1;
  padding: 1rem;
  border-radius: 10px;
  margin-top: 1.5rem;
`;

export default WordScramblerGame;
