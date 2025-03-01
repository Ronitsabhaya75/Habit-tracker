import React, { useState, useEffect } from 'react';

// Main Component
const SportsChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Fetch or initialize challenges
  }, []);

  const handleChallengeClick = (challenge) => {
    setSelectedChallenge(challenge);
    setShowModal(true);
  };

  const updateProgress = (challengeId, progressAmount) => {
    setChallenges((prevChallenges) =>
      prevChallenges.map((challenge) =>
        challenge.id === challengeId
          ? { ...challenge, progress: challenge.progress + progressAmount }
          : challenge
      )
    );
  };

  const completeChallenge = () => {
    if (selectedChallenge) {
      updateProgress(selectedChallenge.id, 100);
      setShowModal(false);
    }
  };

  const recordProgress = () => {
    if (selectedChallenge) {
      updateProgress(selectedChallenge.id, 25);
      setShowModal(false);
    }
  };

  const filteredChallenges = challenges.filter((challenge) => {
    if (filter === 'all') return true;
    if (filter === 'active') return !challenge.completed;
    if (filter === 'completed') return challenge.completed;
  });

  return (
    <div>
      <h2>Sports Challenges</h2>
      <div>
        {filteredChallenges.map((challenge) => (
          <div key={challenge.id} onClick={() => handleChallengeClick(challenge)}>
            {challenge.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SportsChallenges;
