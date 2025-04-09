import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { useHabit } from '../../context/HabitContext';

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

const floatAnimation = keyframes`
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(2deg); }
  100% { transform: translateY(0) rotate(0deg); }
`;

const starGlow = keyframes`
  0% { opacity: 0.6; filter: blur(1px); transform: scale(0.9); }
  50% { opacity: 1; filter: blur(0px); transform: scale(1.1); }
  100% { opacity: 0.6; filter: blur(1px); transform: scale(0.9); }
`;

const pulseGlow = keyframes`
  0% { transform: scale(1); opacity: 0.6; box-shadow: 0 0 10px ${spaceTheme.accentGlow}; }
  50% { transform: scale(1.05); opacity: 0.8; box-shadow: 0 0 20px ${spaceTheme.accentGlow}, 0 0 30px ${spaceTheme.accentGlow}; }
  100% { transform: scale(1); opacity: 0.6; box-shadow: 0 0 10px ${spaceTheme.accentGlow}; }
`;

const glowPulse = keyframes`
  0% { text-shadow: 0 0 5px ${spaceTheme.accentGlow}, 0 0 10px ${spaceTheme.accentGlow}; }
  50% { text-shadow: 0 0 20px ${spaceTheme.accentGlow}, 0 0 30px ${spaceTheme.accentGlow}; }
  100% { text-shadow: 0 0 5px ${spaceTheme.accentGlow}, 0 0 10px ${spaceTheme.accentGlow}; }
`;

const warping = keyframes`
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
`;

const textGlow = keyframes`
  0% { text-shadow: 0 0 5px ${spaceTheme.accentGold}, 0 0 10px ${spaceTheme.accentGold}; }
  50% { text-shadow: 0 0 15px ${spaceTheme.accentGold}, 0 0 25px ${spaceTheme.accentGold}; }
  100% { text-shadow: 0 0 5px ${spaceTheme.accentGold}, 0 0 10px ${spaceTheme.accentGold}; }
`;


const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: ${spaceTheme.deepSpaceGradient};
  color: ${spaceTheme.textPrimary};
  padding: 1rem;
  position: relative;
  overflow: hidden;
  font-family: 'Montserrat', sans-serif;
`;

const BackgroundOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 50%, rgba(50, 255, 192, 0.1) 0%, transparent 70%),
              radial-gradient(circle at 70% 70%, rgba(0, 249, 255, 0.1) 0%, transparent 60%);
  z-index: 1;
`;

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

const GameHeader = styled.div`
  text-align: center;
  margin-bottom: 1rem;
  position: relative;
  z-index: 10;
`;

const GameTitle = styled.h1`
  font-size: 1.8rem;
  color: ${spaceTheme.accentGlow};
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 2px;
  text-shadow: 0 0 10px ${spaceTheme.accentGlow}, 0 0 20px ${spaceTheme.accentGlow};
  animation: ${glowPulse} 3s infinite ease-in-out;
  margin-bottom: 0.25rem;
`;

const XPDisplay = styled.div`
  font-size: 0.9rem;
  margin: 0.5rem 0;
  color: ${spaceTheme.accentGold};
  font-weight: 600;
  background: rgba(14, 26, 64, 0.6);
  padding: 0.5rem 1rem;
  border-radius: 10px;
  display: inline-block;
  border: 1px solid rgba(50, 255, 192, 0.3);
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin: 0.75rem 0;
`;

const TabButton = styled.button`
  background: ${props => props.active ? 'rgba(50, 255, 192, 0.3)' : 'rgba(28, 42, 74, 0.6)'};
  color: ${spaceTheme.textPrimary};
  border: 1px solid ${props => props.active ? spaceTheme.accentGlow : 'rgba(50, 255, 192, 0.3)'};
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Orbitron', sans-serif;
  transition: all 0.3s;
  min-width: 140px;
  font-size: 0.8rem;
  box-shadow: ${props => props.active ? `0 0 15px rgba(50, 255, 192, 0.3)` : 'none'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 15px rgba(50, 255, 192, 0.3);
  }
`;

const GameCard = styled.div`
  background: rgba(14, 26, 64, 0.8);
  backdrop-filter: blur(8px);
  padding: 1.5rem;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  text-align: center;
  border: 1px solid rgba(50, 255, 192, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  z-index: 10;
  animation: ${css`${warping} 0.5s ease-out`};
`;

const ProgressBar = styled.div`
  background: rgba(28, 42, 74, 0.6);
  color: ${spaceTheme.textPrimary};
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  margin-bottom: 1rem;
  border: 1px solid rgba(50, 255, 192, 0.3);
  font-size: 0.85rem;
`;

const PromptText = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
  color: ${spaceTheme.accentGlow};
  font-family: 'Orbitron', sans-serif;
`;

const WordDisplay = styled.div`
  font-size: 1.8rem;
  margin: 1rem 0;
  color: ${spaceTheme.accentGold};
  font-weight: 700;
  animation: ${textGlow} 3s infinite ease-in-out;
  letter-spacing: 3px;
`;

const InputField = styled.input`
  padding: 0.7rem 1rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(50, 255, 192, 0.4);
  width: 80%;
  margin: 0.75rem auto;
  background: rgba(28, 42, 74, 0.4);
  color: ${spaceTheme.textPrimary};
  text-align: center;
  font-weight: 500;
  opacity: ${props => props.disabled ? 0.7 : 1};
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: ${spaceTheme.accentGlow};
    box-shadow: 0 0 15px rgba(50, 255, 192, 0.3);
  }

  &::placeholder {
    color: rgba(208, 231, 255, 0.5);
  }
`;

const Button = styled.button`
  background: ${props => props.primary ? spaceTheme.actionButton :
              props.danger ? spaceTheme.actionButtonAlt :
              props.warning ? spaceTheme.accentGold :
              spaceTheme.actionButton};
  color: ${spaceTheme.deepSpace};
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 0.85rem;
  font-weight: bold;
  font-family: 'Orbitron', sans-serif;
  transition: all 0.3s;
  box-shadow: 0 0 10px rgba(0, 249, 255, 0.3);
  opacity: ${props => props.disabled ? 0.5 : 1};
  margin: 0.3rem;

  &:hover {
    background: ${props => props.disabled ? '' : spaceTheme.accentGlow};
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.disabled ? 'none' : '0 0 15px rgba(50, 255, 192, 0.5)'};
  }

  &:active {
    transform: translateY(1px);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 1rem;
`;

const Feedback = styled.div`
  font-size: 1rem;
  margin: 0.75rem 0;
  padding: 0.3rem;
  color: ${props => props.correct ? spaceTheme.accentGlow : spaceTheme.actionButtonAlt};
  font-weight: 600;
`;

const Definition = styled.div`
  background: rgba(28, 42, 74, 0.6);
  color: ${spaceTheme.textPrimary};
  padding: 1rem;
  border-radius: 10px;
  margin: 1rem 0;
  border: 1px solid rgba(50, 255, 192, 0.3);
  line-height: 1.4;
  font-size: 0.9rem;

  strong {
    color: ${spaceTheme.accentGold};
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    display: block;
  }
`;

const RoundMessage = styled.div`
  font-size: 1.5rem;
  color: ${spaceTheme.accentGlow};
  font-weight: 700;
  font-family: 'Orbitron', sans-serif;
  text-shadow: 0 0 10px ${spaceTheme.accentGlow};
  animation: ${glowPulse} 2s infinite ease-in-out;
  padding: 1.5rem 0;
`;

const NavButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin: 0.5rem 0 1rem;
  flex-wrap: wrap;
  z-index: 10;
  width: 100%;
  max-width: 600px;
`;

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
  max-width: 150px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 15px rgba(50, 255, 192, 0.5);
  }

  &:active {
    transform: translateY(1px);
  }
`;


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


const generateMissingLetters = (word) =>
  word.split('').map((char, i) => (i % 2 === 0 ? char : '_')).join('');


const missingWords = scrambledWords.map(({ word, meaning }) => ({
  word,
  display: generateMissingLetters(word),
  meaning
}));


const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

const WordScramblerGame = () => {
  const [tab, setTab] = useState('scrambled');
  const [round, setRound] = useState(1);
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [showMeaning, setShowMeaning] = useState(false);
  const [scrambled, setScrambled] = useState('');
  const { updateProgress } = useHabit();
  const [xp, setXP] = useState(() => parseInt(localStorage.getItem('scrambledXP')) || 0);
  const [attempts, setAttempts] = useState(0);
  const [currentSet, setCurrentSet] = useState([]);
  const [showRoundMessage, setShowRoundMessage] = useState(false);
  const [maxAttemptsReached, setMaxAttemptsReached] = useState(false);
  const navigate = useNavigate();

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
    setMaxAttemptsReached(false);
    setShowRoundMessage(false);
    setRound(1);
  }, [tab]);

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

  const navigateBack = () => {
    navigate('/breakthrough-game');
  };

  const handleCheck = () => {
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
        setAttempts(3);
        setMaxAttemptsReached(true);
      } else {
        setMessage(`❌ Try Again! (${newAttempts}/3 attempts)`);
        setAttempts(newAttempts);
      }
    }
  };

  const handleNext = () => {
    const nextIndex = index + 1;
    if (nextIndex % questionsPerRound === 0 && nextIndex < totalQuestions) {
      setShowRoundMessage(true);
      setTimeout(() => {
        setShowRoundMessage(false);
        moveToNextQuestion(nextIndex);
      }, 2000);
    } else if (nextIndex === totalQuestions) {
      setShowRoundMessage(true);
    } else {
      moveToNextQuestion(nextIndex);
    }
  };

  const moveToNextQuestion = (nextIndex) => {
    if (nextIndex < totalQuestions) {
      setIndex(nextIndex);
      setGuess('');
      setShowMeaning(false);
      setMessage('');
      setAttempts(0);
      setMaxAttemptsReached(false);
      setRound(Math.floor(nextIndex / questionsPerRound) + 1);
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

  return (
    <GameContainer>
      <BackgroundOverlay />
      <Star size="20px" style={{ top: '10%', left: '10%' }} duration="4s" delay="0.5s" color="rgba(255, 223, 108, 0.9)" />
      <Star size="15px" style={{ top: '25%', left: '25%' }} duration="3s" delay="1s" color="rgba(50, 255, 192, 0.9)" />
      <Star size="25px" style={{ top: '15%', right: '30%' }} duration="5s" delay="0.2s" color="rgba(0, 249, 255, 0.9)" />
      <Star size="18px" style={{ bottom: '20%', right: '15%' }} duration="4.5s" delay="0.7s" color="rgba(255, 223, 108, 0.9)" />

      <GameHeader>
        <GameTitle>🔤 Word Scrambler Game</GameTitle>
        <XPDisplay>
          ⭐ {tab === 'scrambled' ? 'Scrambled' : 'Missing'} XP: {xp} | 🌟 Total XP: {parseInt(localStorage.getItem('totalWordGameXP')) || 0}
        </XPDisplay>
        <TabContainer>
          <TabButton
            active={tab === 'scrambled'}
            onClick={() => setTab('scrambled')}
          >
            Scrambled
          </TabButton>
          <TabButton
            active={tab === 'missing'}
            onClick={() => setTab('missing')}
          >
            Missing Letters
          </TabButton>
        </TabContainer>
      </GameHeader>

      <GameCard>
        {showRoundMessage ? (
          <RoundMessage>
            {index + 1 === totalQuestions ? (
              <>
                🎉 All Rounds Completed!
                <ButtonGroup>
                  <Button primary onClick={() => window.location.reload()}>Play Again</Button>
                  <Button onClick={() => navigate('/dashboard')}>Home</Button>
                  <Button onClick={navigateBack}>Back to Breakthrough</Button>
                </ButtonGroup>
              </>
            ) : (
              <>🎉 Round {round} Complete!</>
            )}
          </RoundMessage>
        ) : (
          <>
            <ProgressBar>
              🌀 Round {round} of {totalRounds} | ❓ Question {index % questionsPerRound + 1} of {questionsPerRound} | Attempt {Math.min(attempts + 1, 3)} of 3
            </ProgressBar>
            <PromptText>
              {tab === 'scrambled' ? 'Unscramble this word:' : 'Fill in the missing letters:'}
            </PromptText>
            <WordDisplay>{scrambled}</WordDisplay>
            <InputField
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Type your guess..."
              disabled={maxAttemptsReached || showMeaning}
            />
            {!showMeaning && (
              <Button
                primary
                onClick={handleCheck}
                disabled={maxAttemptsReached}
              >
                Check Answer
              </Button>
            )}
            {message && <Feedback correct={message.includes('Correct')}>{message}</Feedback>}
            {showMeaning && (
              <Definition>
                <strong>{currentSet[index].word}</strong>
                {currentSet[index].meaning}
                <Button primary onClick={handleNext} style={{ marginTop: '1rem' }}>
                  Next Word
                </Button>
              </Definition>
            )}
            <ButtonGroup>
              <Button onClick={navigateBack}>Return to Breakthrough</Button>
              <Button warning onClick={resetXP}>Reset {tab} XP</Button>
              <Button danger onClick={resetTotalXP}>Reset All XP</Button>
            </ButtonGroup>
          </>
        )}
      </GameCard>
    </GameContainer>
  );
};

export default WordScramblerGame;
