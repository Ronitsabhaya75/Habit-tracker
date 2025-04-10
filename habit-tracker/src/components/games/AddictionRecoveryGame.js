import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useHabit } from '../../context/HabitContext';

// Global style to ensure proper rendering
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
`;

// Animations
const floatAnimation = keyframes`
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(2deg); }
  100% { transform: translateY(0) rotate(0deg); }
`;

const starGlow = keyframes`
  0% { opacity: 0.6; filter: blur(1px); }
  50% { opacity: 1; filter: blur(0px); }
  100% { opacity: 0.6; filter: blur(1px); }
`;

const progressAnimation = keyframes`
  0% { width: 0; }
  100% { width: 100%; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled Components
const PageBackground = styled.div`
  background: linear-gradient(to bottom, #0d323d, #1a2a38);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  color: #e0f2f1;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  z-index: 1;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.03) 0%, transparent 20%),
                      radial-gradient(circle at 85% 60%, rgba(255, 255, 255, 0.03) 0%, transparent 30%);
    z-index: -1;
  }
`;

const Star = styled.div`
  position: absolute;
  width: ${props => props.size || '2px'};
  height: ${props => props.size || '2px'};
  background-color: white;
  border-radius: 50%;
  top: ${props => props.top || '10%'};
  left: ${props => props.left || '10%'};
  animation: ${starGlow} ${props => props.duration || '3s'} infinite ease-in-out;
  z-index: 1;
`;

const GameContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  z-index: 2;
`;

const GameWrapper = styled.div`
  background: rgba(26, 42, 56, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  margin-top: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: ${fadeIn} 0.5s ease-out;
`;

const Button = styled.button`
  background: ${props => props.color || '#4ecca3'};
  color: #0d323d;
  border: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  margin: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    background: ${props => props.hoverColor || '#5ddbaf'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const BackButton = styled(Button)`
  background: rgba(255, 255, 255, 0.1);
  color: #e0f2f1;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  text-align: center;
  margin-top: 0;
  color: #e0f2f1;
  text-shadow: 0 0 10px rgba(78, 204, 163, 0.5);
  font-weight: 700;
`;

const PageSubtitle = styled.p`
  text-align: center;
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.8;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  color: #e0f2f1;
`;

const MoodTracker = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin: 1.5rem 0;
`;

const MoodButton = styled.button`
  font-size: 2.2rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  padding: 1rem;
  border-radius: 50%;
  
  &:hover {
    transform: scale(1.2) translateY(-5px);
    background: rgba(255, 255, 255, 0.1);
  }
  
  &.selected {
    background: rgba(78, 204, 163, 0.2);
    box-shadow: 0 0 15px rgba(78, 204, 163, 0.5);
    transform: scale(1.2);
  }
`;

const GameSection = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  background: rgba(13, 50, 61, 0.6);
  border-radius: 16px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(13, 50, 61, 0.8);
    transform: translateY(-5px);
  }
  
  h3 {
    color: #4ecca3;
    font-size: 1.5rem;
    margin-top: 0;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const ActivityCard = styled.div`
  background: rgba(26, 42, 56, 0.7);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1rem 0;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    transform: translateY(-5px) scale(1.02);
    background: rgba(26, 42, 56, 0.9);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }
  
  &.completed {
    border: 2px solid #4ecca3;
    position: relative;
    
    &:after {
      content: '✓';
      position: absolute;
      top: 10px;
      right: 10px;
      background: #4ecca3;
      color: #0d323d;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      box-shadow: 0 0 10px rgba(78, 204, 163, 0.5);
    }
  }
  
  h4 {
    margin-top: 0;
    color: #e0f2f1;
    font-size: 1.2rem;
  }
  
  p {
    opacity: 0.8;
    color: #e0f2f1;
  }
`;

const ProgressGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 1.5rem 0;
`;

const StatCard = styled.div`
  background: rgba(26, 42, 56, 0.7);
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    background: rgba(26, 42, 56, 0.9);
    transform: translateY(-5px);
  }
  
  h4 {
    margin: 0;
    opacity: 0.8;
    font-size: 1rem;
    color: #e0f2f1;
  }
  
  .value {
    font-size: 2rem;
    font-weight: bold;
    color: #4ecca3;
    margin: 1rem 0;
    text-shadow: 0 0 10px rgba(78, 204, 163, 0.3);
  }
  
  .subtitle {
    font-size: 0.9rem;
    opacity: 0.7;
    color: #e0f2f1;
  }
`;

const JournalEntry = styled.div`
  background: rgba(26, 42, 56, 0.7);
  padding: 1.5rem;
  border-radius: 12px;
  margin: 1rem 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s;
  
  &:hover {
    background: rgba(26, 42, 56, 0.9);
  }
  
  .timestamp {
    font-size: 0.8rem;
    opacity: 0.7;
    margin-bottom: 0.5rem;
    color: #e0f2f1;
  }

  p {
    color: #e0f2f1;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  background: rgba(13, 50, 61, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1rem;
  color: #e0f2f1;
  min-height: 120px;
  margin: 1rem 0;
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #4ecca3;
    box-shadow: 0 0 10px rgba(78, 204, 163, 0.3);
  }
  
  &::placeholder {
    color: rgba(224, 242, 241, 0.5);
  }
`;

const Badge = styled.div`
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  background: ${props => props.color || '#4ecca3'};
  color: #0d323d;
  margin: 0.5rem;
  font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.5s ease-out;
`;

const MeditationTimer = styled.div`
  text-align: center;
  margin: 2rem 0;
  
  .countdown {
    font-size: 3.5rem;
    font-weight: bold;
    color: #4ecca3;
    margin: 1.5rem 0;
    text-shadow: 0 0 15px rgba(78, 204, 163, 0.5);
  }
  
  .message {
    font-size: 1.2rem;
    margin: 1.5rem 0;
    line-height: 1.6;
    color: #e0f2f1;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  margin: 1rem 0;
  overflow: hidden;
  
  .fill {
    background: linear-gradient(90deg, #4ecca3, #6be9c1);
    height: 100%;
    border-radius: 12px;
    width: ${props => props.percentage || '0%'};
    animation: ${progressAnimation} 1.5s ease-out;
    box-shadow: 0 0 10px rgba(78, 204, 163, 0.5);
  }
`;

const guidedActivities = [
  { 
    id: 'meditation', 
    title: '5-Minute Mindfulness Meditation', 
    description: 'Stay present and focused on your breath to calm your mind and reduce cravings.', 
    duration: 300, 
    points: 10, 
    guidance: ['Find a comfortable position', 'Take deep breaths', 'Focus on your breath', 'Let thoughts pass', 'Notice body sensations'] 
  },
  { 
    id: 'breathing', 
    title: 'Deep Breathing Exercise', 
    description: 'Practice 4-7-8 breathing technique to relieve stress and anxiety.', 
    duration: 180, 
    points: 5, 
    guidance: ['Inhale for 4s', 'Hold for 7s', 'Exhale for 8s', 'Repeat cycle'] 
  },
  { 
    id: 'gratitude', 
    title: 'Gratitude Journal', 
    description: "Write three things you're grateful for today to shift focus to positivity.", 
    points: 5, 
    guidance: ['Reflect on a positive event', 'Consider helpful people', 'Note a personal strength'] 
  },
];

const AddictionRecoveryGame = () => {
  const navigate = useNavigate();
  const { updateProgress, getCategoryProgress } = useHabit();
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [selectedMood, setSelectedMood] = useState(null);
  const [lastCompletionDate, setLastCompletionDate] = useState(null);
  const [journalEntries, setJournalEntries] = useState([]);
  const [currentJournalEntry, setCurrentJournalEntry] = useState('');
  const [activityInProgress, setActivityInProgress] = useState(null);
  const [activityTimer, setActivityTimer] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [showGuidance, setShowGuidance] = useState(false);
  const [currentGuidanceStep, setCurrentGuidanceStep] = useState(0);
  const [showMotivation, setShowMotivation] = useState(false);
  
  // Generate random stars
  const generateStars = (count) => {
    const stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        id: i,
        size: `${Math.random() * 3 + 1}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        duration: `${Math.random() * 3 + 2}s`,
      });
    }
    return stars;
  };
  
  const stars = generateStars(50);

  const handleBackClick = () => {
    navigate('/breakthrough-game');
  };

  const updateStreak = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    if (lastCompletionDate !== today) {
      setCurrentStreak(prev => prev + 1);
      setLastCompletionDate(today);
      setShowMotivation(true);
      setTimeout(() => setShowMotivation(false), 5000);
    }
  }, [lastCompletionDate]);

  const handleMilestone = useCallback((type, points) => {
    updateProgress('addiction', points);
    setAchievements(prev => [...prev, { type, timestamp: new Date().toISOString(), points }]);
    if (type === 'daily') updateStreak();
  }, [updateProgress, updateStreak]);

  const completeActivity = useCallback((activity) => {
    updateProgress('addiction', activity.points);
    setCompletedChallenges(prev => [...prev, activity.id]);
    setActivityInProgress(null);
    setShowGuidance(false);
    setAchievements(prev => [...prev, {
      type: 'activity',
      activity: activity.title,
      timestamp: new Date().toISOString(),
      points: activity.points,
    }]);
    updateStreak();
  }, [updateProgress, updateStreak]);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('addictionRecoveryData') || '{}');
    if (savedData) {
      setJournalEntries(savedData.journalEntries || []);
      setAchievements(savedData.achievements || []);
      setTimeElapsed(savedData.timeElapsed || 0);
      setCompletedChallenges(savedData.completedChallenges || []);
      const lastCompletion = savedData.lastCompletionDate;
      const streak = savedData.currentStreak || 0;
      if (lastCompletion) {
        const daysSinceLastCompletion = Math.floor((new Date() - new Date(lastCompletion)) / (1000 * 60 * 60 * 24));
        if (daysSinceLastCompletion <= 1) {
          setCurrentStreak(streak);
          setLastCompletionDate(lastCompletion);
        } else {
          setCurrentStreak(0);
          setLastCompletionDate(null);
        }
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('addictionRecoveryData', JSON.stringify({
      journalEntries, achievements, timeElapsed, completedChallenges, currentStreak, lastCompletionDate,
    }));
  }, [journalEntries, achievements, timeElapsed, completedChallenges, currentStreak, lastCompletionDate]);

  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => {
        setTimeElapsed(prev => {
          const newTime = prev + 1;
          if (newTime % 3600 === 0) handleMilestone('hourly', 5);
          if (newTime % (24 * 3600) === 0) handleMilestone('daily', 25);
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, handleMilestone]);

  useEffect(() => {
    let interval;
    if (activityInProgress && activityTimer > 0) {
      interval = setInterval(() => {
        setActivityTimer(prev => {
          if (prev <= 1) {
            completeActivity(activityInProgress);
            return 0;
          }
          return prev - 1;
        });
        if (activityTimer % 20 === 0) {
          setCurrentGuidanceStep(prev => (prev + 1) % (activityInProgress.guidance?.length || 1));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activityInProgress, activityTimer, completeActivity]);

  const startActivity = (activity) => {
    setActivityInProgress(activity);
    setActivityTimer(activity.duration || 0);
    setShowGuidance(true);
    setCurrentGuidanceStep(0);
  };

  const addJournalEntry = () => {
    if (currentJournalEntry.trim()) {
      setJournalEntries(prev => [{
        text: currentJournalEntry,
        timestamp: new Date().toISOString(),
        mood: selectedMood,
      }, ...prev]);
      setCurrentJournalEntry('');
      updateProgress('addiction', 5);
      updateStreak();
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get motivational quotes
  const getMotivationalQuote = () => {
    const quotes = [
      "Every day is a new opportunity to grow stronger.",
      "Progress is progress, no matter how small.",
      "You are stronger than your cravings.",
      "Focus on today. Just today.",
      "Recovery is not a race. You're right where you need to be.",
      "Your potential is endless. Keep going.",
      "Small steps lead to big changes."
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  return (
    <>
      <GlobalStyle />
      <PageBackground>
        {stars.map(star => (
          <Star 
            key={star.id} 
            size={star.size} 
            top={star.top} 
            left={star.left} 
            duration={star.duration} 
          />
        ))}
        
        <GameContainer>
          <GameWrapper>
            <BackButton onClick={handleBackClick}>
              ← Back to Breakthrough Game
            </BackButton>

            <PageTitle>Cosmic Recovery Journey</PageTitle>
            <PageSubtitle>Navigate through the universe of recovery, collect achievements, and build a constellation of healthy habits.</PageSubtitle>

            {showMotivation && (
              <div style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                background: 'rgba(78, 204, 163, 0.2)',
                backdropFilter: 'blur(10px)',
                padding: '15px',
                borderRadius: '10px',
                boxShadow: '0 0 20px rgba(78, 204, 163, 0.5)',
                zIndex: 1000,
                animation: `${fadeIn} 0.5s ease-out`,
                maxWidth: '300px',
                border: '1px solid rgba(78, 204, 163, 0.5)'
              }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#4ecca3' }}>✨ New Day Completed!</h4>
                <p style={{ margin: '0', color: '#e0f2f1' }}>{getMotivationalQuote()}</p>
              </div>
            )}

            <ProgressGrid>
              <StatCard>
                <h4>CLEAN TIME TRACKER</h4>
                <div className="value">{formatTime(timeElapsed)}</div>
                <Button color={timerActive ? "#e74c3c" : "#4ecca3"} hoverColor={timerActive ? "#c0392b" : "#5ddbaf"} onClick={() => setTimerActive(!timerActive)}>
                  {timerActive ? "Pause Timer" : "Start/Resume Timer"}
                </Button>
              </StatCard>
              <StatCard>
                <h4>CURRENT STREAK</h4>
                <div className="value">{currentStreak} days</div>
                <div className="subtitle">Each day is a new star in your constellation</div>
              </StatCard>
              <StatCard>
                <h4>COSMIC POINTS</h4>
                <div className="value">{getCategoryProgress('addiction')}</div>
                <ProgressBar percentage={`${Math.min(100, getCategoryProgress('addiction') / 3)}%`}>
                  <div className="fill"></div>
                </ProgressBar>
                <div className="subtitle">Points earned towards your next level</div>
              </StatCard>
            </ProgressGrid>

            <GameSection>
              <h3>How are you navigating today?</h3>
              <MoodTracker>
                <MoodButton className={selectedMood === 'great' ? 'selected' : ''} onClick={() => setSelectedMood('great')}>😊</MoodButton>
                <MoodButton className={selectedMood === 'good' ? 'selected' : ''} onClick={() => setSelectedMood('good')}>🙂</MoodButton>
                <MoodButton className={selectedMood === 'neutral' ? 'selected' : ''} onClick={() => setSelectedMood('neutral')}>😐</MoodButton>
                <MoodButton className={selectedMood === 'struggling' ? 'selected' : ''} onClick={() => setSelectedMood('struggling')}>😟</MoodButton>
              </MoodTracker>
            </GameSection>

            <GameSection>
              <h3>Guided Activities</h3>
              {activityInProgress ? (
                <MeditationTimer>
                  <div className="countdown">{formatTime(activityTimer)}</div>
                  <div className="message">
                    {activityTimer > 0 ? (
                      showGuidance ? (
                        <>
                          <p>{activityInProgress.guidance?.[currentGuidanceStep]}</p>
                          <Button onClick={() => setShowGuidance(false)}>Hide Guidance</Button>
                        </>
                      ) : (
                        <Button onClick={() => setShowGuidance(true)}>Show Guidance</Button>
                      )
                    ) : (
                      "Activity Complete! 🎉 You've earned cosmic points!"
                    )}
                  </div>
                </MeditationTimer>
              ) : (
                guidedActivities.map(activity => (
                  <ActivityCard
                    key={activity.id}
                    onClick={() => startActivity(activity)}
                    className={completedChallenges.includes(activity.id) ? 'completed' : ''}
                  >
                    <h4>{activity.title}</h4>
                    <p>{activity.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#4ecca3', fontWeight: 'bold' }}>+{activity.points} cosmic points</span>
                      {activity.duration && <span style={{ color: '#e0f2f1' }}>{Math.floor(activity.duration / 60)} minutes</span>}
                    </div>
                  </ActivityCard>
                ))
              )}
            </GameSection>

            <GameSection>
              <h3>Star Journal</h3>
              <TextArea
                value={currentJournalEntry}
                onChange={(e) => setCurrentJournalEntry(e.target.value)}
                placeholder="Record your journey through the cosmos of recovery. What challenges did you overcome today? What brought you strength?"
              />
              <Button onClick={addJournalEntry}>Save Entry (+5 cosmic points)</Button>
              {journalEntries.map((entry, index) => (
                <JournalEntry key={index}>
                  <div className="timestamp">
                    {new Date(entry.timestamp).toLocaleString()}
                    {entry.mood && (
                      <span style={{ marginLeft: '1rem' }}>
                        {entry.mood === 'great' ? '😊' : entry.mood === 'good' ? '🙂' : entry.mood === 'neutral' ? '😐' : '😟'}
                      </span>
                    )}
                  </div>
                  <p>{entry.text}</p>
                </JournalEntry>
              ))}
            </GameSection>

            <GameSection>
              <h3>Recent Achievements</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {achievements.map((achievement, index) => (
                  <Badge
                    key={index}
                    color={achievement.type === 'hourly' ? '#3498db' : achievement.type === 'daily' ? '#2ecc71' : achievement.type === 'activity' ? '#9b59b6' : '#4ecca3'}
                  >
                    {achievement.type === 'activity' ? achievement.activity : achievement.type === 'hourly' ? 'Hour Complete' : achievement.type === 'daily' ? 'Day Complete' : 'Achievement'} (+{achievement.points} pts)
                  </Badge>
                ))}
              </div>
            </GameSection>

            {selectedMood === 'struggling' && (
              <GameSection style={{ background: 'rgba(231, 76, 60, 0.2)', border: '1px solid rgba(231, 76, 60, 0.3)' }}>
                <h3 style={{ color: '#e74c3c' }}>Need Support?</h3>
                <p style={{ color: '#e0f2f1' }}>It's okay to navigate through difficult nebulae. Here are some resources to help you through:</p>
                <ul style={{ lineHeight: '1.8', color: '#e0f2f1' }}>
                  <li>Reach out to your support constellation (friends, family, sponsor)</li>
                  <li>Practice the deep breathing exercise to calm your mind</li>
                  <li>Use the urge surfing technique - observe the craving wave rise and fall</li>
                  <li>Contact your counselor or support group for additional guidance</li>
                </ul>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                  <Button color="#e74c3c" hoverColor="#c0392b">Emergency Contact</Button>
                  <Button onClick={() => startActivity(guidedActivities[1])}>Start Breathing Exercise</Button>
                </div>
              </GameSection>
            )}
          </GameWrapper>
        </GameContainer>
      </PageBackground>
    </>
  );
};

export default AddictionRecoveryGame;