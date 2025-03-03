import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../theme';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';

// Styled Components for Sports Game
const SportsGameContainer = styled.div`
  background: ${theme.colors.glassWhite};
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid ${theme.colors.borderWhite};
  backdrop-filter: blur(8px);
  margin-bottom: 2rem;
  color: ${theme.colors.text};
`;

const GameTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: ${theme.colors.accent};
`;

const GameDescription = styled.p`
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const ChallengesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const ChallengeCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid ${theme.colors.borderWhite};
  transition: transform 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.15);
  }

  &.completed {
    background: rgba(100, 255, 100, 0.1);
    border: 1px solid rgba(100, 255, 100, 0.3);
  }
`;

const ChallengeName = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.8rem;
`;

const ChallengeInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

const XPBadge = styled.span`
  background: ${theme.colors.secondary};
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
`;

const CompletedTag = styled.span`
  background: rgba(100, 255, 100, 0.2);
  color: #90ee90;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  margin-top: 0.8rem;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => props.progress}%;
  background: ${theme.colors.accent};
  transition: width 0.3s ease;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${theme.colors.primaryGradient};
  padding: 2rem;
  border-radius: 16px;
  max-width: 500px;
  width: 90%;
  color: ${theme.colors.text};
  border: 1px solid ${theme.colors.borderWhite};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  background: ${props => props.primary ? theme.colors.accent : 'rgba(255, 255, 255, 0.1)'};
  color: ${theme.colors.text};

  &:hover {
    transform: translateY(-2px);
  }
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const FilterButton = styled.button`
  background: ${props => props.active ? theme.colors.secondary : 'rgba(255, 255, 255, 0.1)'};
  color: ${theme.colors.text};
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  margin-right: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? theme.colors.secondary : 'rgba(255, 255, 255, 0.2)'};
  }
`;

// Main Component
const SportsChallenges = () => {
  const { user } = useAuth();
  const { addXp, addAchievement } = useGame();

  const [challenges, setChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
  const [successMessage, setSuccessMessage] = useState('');

  // Load challenges on component mount
  useEffect(() => {
    const storedChallenges = localStorage.getItem(`sportsChallenges-${user?.name}`);

    if (storedChallenges) {
      setChallenges(JSON.parse(storedChallenges));
    } else {
      // Initialize with default challenges
      setChallenges([
        {
          id: 'run-5k',
          name: 'Run 5K',
          description: 'Complete a 5K run in under 30 minutes',
          xpReward: 100,
          progress: 0,
          completed: false,
          icon: '🏃',
          achievementId: 'achievement-run-5k',
          habitRelated: true
        },
        {
          id: 'pushups-100',
          name: '100 Pushups Challenge',
          description: 'Do 100 pushups in a single day',
          xpReward: 80,
          progress: 0,
          completed: false,
          icon: '💪',
          achievementId: 'achievement-pushups-100',
          habitRelated: true
        },
        {
          id: 'yoga-week',
          name: 'Yoga Week',
          description: 'Complete 15 minutes of yoga every day for a week',
          xpReward: 150,
          progress: 0,
          daysCompleted: 0,
          totalDays: 7,
          completed: false,
          icon: '🧘',
          achievementId: 'achievement-yoga-week',
          habitRelated: true
        },
        {
          id: 'stairs-day',
          name: 'Stair Master',
          description: 'Only use stairs instead of elevators for an entire day',
          xpReward: 50,
          progress: 0,
          completed: false,
          icon: '🪜',
          achievementId: 'achievement-stairs-day',
          habitRelated: false
        },
        {
          id: 'cycling-20k',
          name: 'Cycling Tour',
          description: 'Go on a 20km cycling trip',
          xpReward: 120,
          progress: 0,
          completed: false,
          icon: '🚴',
          achievementId: 'achievement-cycling-20k',
          habitRelated: false
        },
        {
          id: 'swim-1k',
          name: 'Swimming Champion',
          description: 'Swim 1km without stopping',
          xpReward: 100,
          progress: 0,
          completed: false,
          icon: '🏊',
          achievementId: 'achievement-swim-1k',
          habitRelated: false
        }
      ]);
    }
  }, [user]);

  // Save challenges to localStorage when they change
  useEffect(() => {
    if (user && challenges.length > 0) {
      localStorage.setItem(`sportsChallenges-${user.name}`, JSON.stringify(challenges));
    }
  }, [challenges, user]);

  // Handle challenge click
  const handleChallengeClick = (challenge) => {
    setSelectedChallenge(challenge);
    setShowModal(true);
  };

  // Update challenge progress
  const updateProgress = (challengeId, progressAmount) => {
    setChallenges(prevChallenges =>
      prevChallenges.map(challenge => {
        if (challenge.id === challengeId) {
          const newProgress = Math.min(100, challenge.progress + progressAmount);
          const completed = newProgress >= 100;

          // If newly completed, award XP and achievement
          if (completed && !challenge.completed) {
            // Add XP reward
            addXp(challenge.xpReward);

            // Add achievement
            addAchievement({
              id: challenge.achievementId,
              title: `${challenge.name} Completed!`,
              description: `Completed the ${challenge.name} challenge.`,
              xpReward: Math.floor(challenge.xpReward * 0.2), // 20% bonus XP
              icon: challenge.icon
            });

            setSuccessMessage(`Congratulations! You've completed the ${challenge.name} challenge and earned ${challenge.xpReward} XP!`);
            setTimeout(() => setSuccessMessage(''), 3000);
          }

          return {
            ...challenge,
            progress: newProgress,
            completed: completed
          };
        }
        return challenge;
      })
    );
  };

  // Handle special case for yoga week challenge
  const updateYogaChallenge = () => {
    setChallenges(prevChallenges =>
      prevChallenges.map(challenge => {
        if (challenge.id === 'yoga-week') {
          const newDaysCompleted = challenge.daysCompleted + 1;
          const newProgress = Math.min(100, (newDaysCompleted / challenge.totalDays) * 100);
          const completed = newDaysCompleted >= challenge.totalDays;

          // If newly completed, award XP and achievement
          if (completed && !challenge.completed) {
            // Add XP reward
            addXp(challenge.xpReward);

            // Add achievement
            addAchievement({
              id: challenge.achievementId,
              title: `${challenge.name} Completed!`,
              description: `Completed the ${challenge.name} challenge.`,
              xpReward: Math.floor(challenge.xpReward * 0.2), // 20% bonus XP
              icon: challenge.icon
            });

            setSuccessMessage(`Congratulations! You've completed the ${challenge.name} challenge and earned ${challenge.xpReward} XP!`);
            setTimeout(() => setSuccessMessage(''), 3000);
          }

          return {
            ...challenge,
            daysCompleted: newDaysCompleted,
            progress: newProgress,
            completed: completed
          };
        }
        return challenge;
      })
    );
  };

  // Complete a challenge from the modal
  const completeChallenge = () => {
    if (selectedChallenge) {
      if (selectedChallenge.id === 'yoga-week') {
        updateYogaChallenge();
      } else {
        updateProgress(selectedChallenge.id, 100);
      }
      setShowModal(false);
    }
  };

  // Record progress on a challenge
  const recordProgress = () => {
    if (selectedChallenge) {
      if (selectedChallenge.id === 'yoga-week') {
        updateYogaChallenge();
      } else {
        updateProgress(selectedChallenge.id, 25); // Update by 25% increments
      }
      setShowModal(false);
    }
  };

  // Filter challenges based on current filter
  const filteredChallenges = challenges.filter(challenge => {
    if (filter === 'all') return true;
    if (filter === 'active') return !challenge.completed;
    if (filter === 'completed') return challenge.completed;
    return true;
  });

  return (
    <SportsGameContainer>
      <GameTitle>Sports Challenges 🏆</GameTitle>
      <GameDescription>
        Complete these sports-related challenges to earn XP and special achievements.
        Track your progress and level up your fitness journey!
      </GameDescription>

      {successMessage && (
        <div style={{
          background: 'rgba(100, 255, 100, 0.2)',
          color: '#90ee90',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          {successMessage}
        </div>
      )}

      <ActionRow>
        <div>
          <FilterButton
            active={filter === 'all'}
            onClick={() => setFilter('all')}
          >
            All
          </FilterButton>
          <FilterButton
            active={filter === 'active'}
            onClick={() => setFilter('active')}
          >
            Active
          </FilterButton>
          <FilterButton
            active={filter === 'completed'}
            onClick={() => setFilter('completed')}
          >
            Completed
          </FilterButton>
        </div>
      </ActionRow>

      <ChallengesGrid>
        {filteredChallenges.map(challenge => (
          <ChallengeCard
            key={challenge.id}
            className={challenge.completed ? 'completed' : ''}
            onClick={() => handleChallengeClick(challenge)}
          >
            <ChallengeName>
              {challenge.icon} {challenge.name}
            </ChallengeName>
            <p>{challenge.description}</p>

            <ProgressBar>
              <ProgressFill progress={challenge.progress} />
            </ProgressBar>

            <ChallengeInfo>
              <XPBadge>{challenge.xpReward} XP</XPBadge>
              {challenge.completed && <CompletedTag>Completed</CompletedTag>}
            </ChallengeInfo>
          </ChallengeCard>
        ))}
      </ChallengesGrid>

      {showModal && selectedChallenge && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <h2>{selectedChallenge.icon} {selectedChallenge.name}</h2>
            <p>{selectedChallenge.description}</p>

            <div style={{ margin: '1rem 0' }}>
              <p>Progress: {selectedChallenge.progress}%</p>
              <ProgressBar>
                <ProgressFill progress={selectedChallenge.progress} />
              </ProgressBar>
            </div>

            {selectedChallenge.id === 'yoga-week' && (
              <p>Days completed: {selectedChallenge.daysCompleted || 0}/{selectedChallenge.totalDays}</p>
            )}

            <p>Reward: {selectedChallenge.xpReward} XP</p>

            <ButtonGroup>
              {!selectedChallenge.completed && (
                <>
                  <Button onClick={recordProgress}>
                    {selectedChallenge.id === 'yoga-week' ? 'Record Today' : 'Record Progress'}
                  </Button>
                  <Button primary onClick={completeChallenge}>Mark as Complete</Button>
                </>
              )}
              <Button onClick={() => setShowModal(false)}>Close</Button>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}
    </SportsGameContainer>
  );
};

export default SportsChallenges;

