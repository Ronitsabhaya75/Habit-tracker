import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme';
import { useHabit } from '../../context/HabitContext';

const GameWrapper = styled.div`
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  margin-top: 2rem;
`;

const ChallengeCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.15);
  }

  &.completed {
    border: 1px solid #4CAF50;
    background: rgba(76, 175, 80, 0.1);
  }
`;

const Timer = styled.div`
  font-size: 2rem;
  text-align: center;
  margin: 1rem 0;
  font-weight: bold;
  color: ${theme.colors.accent};
`;

const Button = styled.button`
  background: ${props => props.color || theme.colors.accent};
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  margin: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const StreakCounter = styled.div`
  text-align: center;
  margin: 1rem 0;
  font-size: 1.2rem;

  span {
    color: ${theme.colors.accent};
    font-weight: bold;
  }
`;

const MoodTracker = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0;
`;

const MoodButton = styled.button`
  font-size: 2rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: transform 0.2s;
  padding: 0.5rem;
  border-radius: 50%;

  &:hover {
    transform: scale(1.2);
  }

  &.selected {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const GameSection = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
`;

const ActivityCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1rem 0;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const ProgressGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 8px;
  text-align: center;

  h4 {
    margin: 0;
    opacity: 0.8;
  }

  .value {
    font-size: 1.5rem;
    font-weight: bold;
    color: ${theme.colors.accent};
    margin: 0.5rem 0;
  }
`;

const JournalEntry = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;

  .timestamp {
    font-size: 0.8rem;
    opacity: 0.7;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 1rem;
  color: ${theme.colors.text};
  min-height: 100px;
  margin: 1rem 0;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
  }
`;

const Badge = styled.div`
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: ${props => props.color || theme.colors.accent};
  color: white;
  margin: 0.5rem;
  font-size: 0.9rem;
`;

const MeditationTimer = styled.div`
  text-align: center;
  margin: 2rem 0;

  .countdown {
    font-size: 3rem;
    font-weight: bold;
    color: ${theme.colors.accent};
    margin: 1rem 0;
  }

  .message {
    font-size: 1.2rem;
    margin: 1rem 0;
    opacity: 0.8;
  }
`;

const dailyChallenges = [
  {
    id: 1,
    title: "Morning Meditation",
    description: "Start your day with a 5-minute meditation to build mental strength",
    points: 5,
    type: "daily"
  },
  {
    id: 2,
    title: "Urge Surfing",
    description: "Practice the urge surfing technique when cravings hit",
    points: 10,
    type: "onDemand"
  },
  {
    id: 3,
    title: "Trigger Journal",
    description: "Log your triggers and how you handled them",
    points: 5,
    type: "daily"
  },
  {
    id: 4,
    title: "Support Check-in",
    description: "Connect with a support buddy or group",
    points: 15,
    type: "daily"
  }
];

const guidedActivities = [
  {
    id: 'meditation',
    title: '5-Minute Mindfulness Meditation',
    description: 'A guided meditation to help you stay present and focused.',
    duration: 300, // 5 minutes in seconds
    points: 10,
    guidance: [
      'Find a comfortable position and close your eyes',
      'Take deep breaths in through your nose and out through your mouth',
      'Focus on your breath and let thoughts pass by like clouds',
      'If your mind wanders, gently bring it back to your breath',
      'Notice the sensations in your body without judgment'
    ]
  },
  {
    id: 'breathing',
    title: 'Deep Breathing Exercise',
    description: 'Practice 4-7-8 breathing technique to reduce cravings.',
    duration: 180, // 3 minutes in seconds
    points: 5,
    guidance: [
      'Inhale quietly through your nose for 4 seconds',
      'Hold your breath for 7 seconds',
      'Exhale completely through your mouth for 8 seconds',
      'Repeat this cycle for the duration of the exercise'
    ]
  },
  {
    id: 'gratitude',
    title: 'Gratitude Journal',
    description: 'Write down three things you\'re grateful for today.',
    points: 5,
    guidance: [
      'Think about something positive that happened today',
      'Consider someone who has helped you in your journey',
      'Reflect on a personal strength you\'re grateful for'
    ]
  }
];

const AddictionRecoveryGame = () => {
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

  // Load saved data on mount
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('addictionRecoveryData') || '{}');
    if (savedData) {
      setJournalEntries(savedData.journalEntries || []);
      setAchievements(savedData.achievements || []);
      setTimeElapsed(savedData.timeElapsed || 0);
      setCompletedChallenges(savedData.completedChallenges || []);
      
      // Load streak data
      const lastCompletion = savedData.lastCompletionDate;
      const streak = savedData.currentStreak || 0;
      
      if (lastCompletion) {
        const daysSinceLastCompletion = Math.floor(
          (new Date() - new Date(lastCompletion)) / (1000 * 60 * 60 * 24)
        );
        
        if (daysSinceLastCompletion <= 1) {
          setCurrentStreak(streak);
          setLastCompletionDate(lastCompletion);
        } else {
          // Reset streak if more than a day has passed
          setCurrentStreak(0);
          setLastCompletionDate(null);
        }
      }
    }
  }, []);

  // Save data when it changes
  useEffect(() => {
    localStorage.setItem('addictionRecoveryData', JSON.stringify({
      journalEntries,
      achievements,
      timeElapsed,
      completedChallenges,
      currentStreak,
      lastCompletionDate
    }));
  }, [journalEntries, achievements, timeElapsed, completedChallenges, currentStreak, lastCompletionDate]);

  // Clean time timer
  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => {
        setTimeElapsed(prev => {
          const newTime = prev + 1;
          // Check for milestones
          if (newTime % 3600 === 0) { // Every hour
            handleMilestone('hourly', 5);
          }
          if (newTime % (24 * 3600) === 0) { // Every day
            handleMilestone('daily', 25);
            updateStreak();
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  // Activity timer
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

        // Update guidance step every 20 seconds
        if (activityTimer % 20 === 0) {
          setCurrentGuidanceStep(prev => 
            (prev + 1) % (activityInProgress.guidance?.length || 1)
          );
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activityInProgress, activityTimer]);

  const updateStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    if (lastCompletionDate !== today) {
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      setLastCompletionDate(today);
    }
  };

  const handleMilestone = (type, points) => {
    updateProgress('addiction', points);
    const milestone = {
      type,
      timestamp: new Date().toISOString(),
      points
    };
    setAchievements(prev => [...prev, milestone]);
    
    if (type === 'daily') {
      updateStreak();
    }
  };

  const startActivity = (activity) => {
    setActivityInProgress(activity);
    setActivityTimer(activity.duration || 0);
    setShowGuidance(true);
    setCurrentGuidanceStep(0);
  };

  const completeActivity = (activity) => {
    updateProgress('addiction', activity.points);
    setCompletedChallenges(prev => [...prev, activity.id]);
    setActivityInProgress(null);
    setShowGuidance(false);
    
    // Add to achievements
    setAchievements(prev => [...prev, {
      type: 'activity',
      activity: activity.title,
      timestamp: new Date().toISOString(),
      points: activity.points
    }]);

    // Update streak for completed activity
    updateStreak();
  };

  const addJournalEntry = () => {
    if (currentJournalEntry.trim()) {
      const newEntry = {
        text: currentJournalEntry,
        timestamp: new Date().toISOString(),
        mood: selectedMood
      };
      setJournalEntries(prev => [newEntry, ...prev]);
      setCurrentJournalEntry('');
      updateProgress('addiction', 5); // Reward for journaling
      updateStreak(); // Update streak for journaling
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <GameWrapper>
      <h2>Addiction Recovery Journey</h2>
      
      <ProgressGrid>
        <StatCard>
          <h4>Clean Time</h4>
          <div className="value">{formatTime(timeElapsed)}</div>
          <Button 
            color={timerActive ? "#f44336" : "#4CAF50"}
            onClick={() => setTimerActive(!timerActive)}
          >
            {timerActive ? "Pause Timer" : "Start/Resume Timer"}
          </Button>
        </StatCard>

        <StatCard>
          <h4>Current Streak</h4>
          <div className="value">{currentStreak} days</div>
          <div>Keep going strong!</div>
        </StatCard>

        <StatCard>
          <h4>Total Points</h4>
          <div className="value">{getCategoryProgress('addiction')}</div>
          <div>Points earned</div>
        </StatCard>
      </ProgressGrid>

      <GameSection>
        <h3>How are you feeling today?</h3>
        <MoodTracker>
          <MoodButton 
            className={selectedMood === 'great' ? 'selected' : ''}
            onClick={() => setSelectedMood('great')}
          >
            😊
          </MoodButton>
          <MoodButton 
            className={selectedMood === 'good' ? 'selected' : ''}
            onClick={() => setSelectedMood('good')}
          >
            🙂
          </MoodButton>
          <MoodButton 
            className={selectedMood === 'neutral' ? 'selected' : ''}
            onClick={() => setSelectedMood('neutral')}
          >
            😐
          </MoodButton>
          <MoodButton 
            className={selectedMood === 'struggling' ? 'selected' : ''}
            onClick={() => setSelectedMood('struggling')}
          >
            😟
          </MoodButton>
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
                "Activity Complete! 🎉"
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
                <span>+{activity.points} points</span>
                {activity.duration && <span>{Math.floor(activity.duration / 60)} minutes</span>}
              </div>
            </ActivityCard>
          ))
        )}
      </GameSection>

      <GameSection>
        <h3>Recovery Journal</h3>
        <TextArea
          value={currentJournalEntry}
          onChange={(e) => setCurrentJournalEntry(e.target.value)}
          placeholder="Write about your journey, feelings, or challenges..."
        />
        <Button onClick={addJournalEntry}>Save Entry (+5 points)</Button>
        
        {journalEntries.map((entry, index) => (
          <JournalEntry key={index}>
            <div className="timestamp">
              {new Date(entry.timestamp).toLocaleString()}
              {entry.mood && (
                <span style={{ marginLeft: '1rem' }}>
                  {entry.mood === 'great' ? '😊' : 
                   entry.mood === 'good' ? '🙂' : 
                   entry.mood === 'neutral' ? '😐' : '😟'}
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
              color={
                achievement.type === 'hourly' ? '#4CAF50' :
                achievement.type === 'daily' ? '#2196F3' :
                achievement.type === 'activity' ? '#9C27B0' : 
                theme.colors.accent
              }
            >
              {achievement.type === 'activity' ? achievement.activity : 
               achievement.type === 'hourly' ? 'Hour Complete' :
               achievement.type === 'daily' ? 'Day Complete' : 
               'Achievement'} (+{achievement.points} pts)
            </Badge>
          ))}
        </div>
      </GameSection>

      {selectedMood === 'struggling' && (
        <GameSection style={{ background: 'rgba(244, 67, 54, 0.1)' }}>
          <h3>Need Support?</h3>
          <p>Remember, it's okay to ask for help. Here are some resources:</p>
          <ul>
            <li>Call your support buddy</li>
            <li>Practice deep breathing exercises</li>
            <li>Use the urge surfing technique</li>
            <li>Contact your counselor or support group</li>
          </ul>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <Button color="#f44336">
              Emergency Contact
            </Button>
            <Button onClick={() => startActivity(guidedActivities[1])}>
              Start Breathing Exercise
            </Button>
          </div>
        </GameSection>
      )}
    </GameWrapper>
  );
};

export default AddictionRecoveryGame; 
