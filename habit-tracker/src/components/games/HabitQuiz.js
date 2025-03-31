import React, { useState, useEffect } from 'react';

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
  { question: 'Why is environment important?', options: ['Affects behavior', 'Doesn’t matter', 'Only location', 'None'], correctAnswer: 0 },
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
    const [xp, setXP] = useState(0);
    const [answered, setAnswered] = useState(false);
    const [selected, setSelected] = useState(null);
    const [gameEnded, setGameEnded] = useState(false);
    const [started, setStarted] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [showSummary, setShowSummary] = useState(false);
    const [roundNumber, setRoundNumber] = useState(1);
    const [finalSummary, setFinalSummary] = useState(false);
    const [totalCorrect, setTotalCorrect] = useState(0);

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

    useEffect(() => {
      if (started) {
        if (roundNumber === 1) {
          setXP(0);
          localStorage.setItem('quizXP', '0');
        }
        loadQuestions();
      }
    }, [started, roundNumber]);

    const handleAnswer = (index) => {
      if (answered || gameEnded) return;
      setSelected(index);
      const currentQuestion = questions[currentIndex];
      if (index === currentQuestion.correctAnswer) {
        const newXP = xp + 10;
        setXP(newXP);
        localStorage.setItem('quizXP', newXP);
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
      }, 1000);
    };

    const getEmoji = () => {
      const ratio = correctCount / questions.length;
      if (ratio === 1) return "🏆 Perfect!";
      if (ratio >= 0.8) return "🎉 Great job!";
      if (ratio >= 0.5) return "👍 Good effort!";
      return "💡 Keep practicing!";
    };

    const handleNextRound = () => {
      setTotalCorrect(prev => prev + correctCount);
      if (roundNumber < 3) {
        setRoundNumber(prev => prev + 1);
      } else {
        setFinalSummary(true);
      }
    };

    const handleReplay = () => {
      setRoundNumber(1);
      setXP(0);
      setTotalCorrect(0);
      setStarted(true);
      setFinalSummary(false);
    };

    if (!started) {
      return (
        <div style={welcomeStyle}>
          <h1>🎯 Welcome to the Habit Quiz Game!</h1>
          <p style={{ maxWidth: '500px', marginTop: '1rem', fontSize: '1.2rem' }}>
            Test your knowledge across 3 rounds and earn XP! Click below to begin.
          </p>
          <button onClick={() => setStarted(true)} style={startButtonStyle}>
            Start Quiz
          </button>
        </div>
      );
    }

    return (
      <div style={mainContainerStyle}>
        {!gameEnded ? (
          <div style={questionCardStyle}>
            <h2 style={{ fontSize: '1.75rem' }}>Round {roundNumber} - Question {currentIndex + 1}</h2>
            <p style={{ fontWeight: 'bold', marginBottom: '1rem', fontSize: '1.3rem' }}>{questions[currentIndex]?.question}</p>
            <div>
              {questions[currentIndex]?.options.map((option, i) => {
                let bg = '#e0e0e0';
                if (answered) {
                  if (i === questions[currentIndex].correctAnswer) bg = '#4CAF50';
                  else if (i === selected) bg = '#f44336';
                  else bg = '#ccc';
                }
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '1rem',
                      marginBottom: '0.75rem',
                      fontSize: '1.1rem',
                      background: bg,
                      border: 'none',
                      borderRadius: '5px',
                      fontWeight: 'bold',
                      cursor: answered ? 'default' : 'pointer'
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            <div style={{ marginTop: '1rem', fontSize: '1.1rem' }}>⭐ XP: {xp}</div>
            <div style={{ fontSize: '1rem' }}>Question {currentIndex + 1} of {questions.length}</div>
          </div>
        ) : !showSummary ? (
          <div style={summaryCardStyle}>
            <h2>🎉 Round {roundNumber} Complete!</h2>
            <p style={{ fontSize: '1.2rem' }}><strong>Correct Answers:</strong> {correctCount} / {questions.length}</p>
            <p style={{ fontSize: '1.2rem' }}><strong>XP This Round:</strong> {correctCount * 10}</p>
            <h3 style={{ fontSize: '1.4rem' }}>{getEmoji()}</h3>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={() => {
                setShowSummary(true);
                handleNextRound();
              }} style={actionButtonStyle}>
                {roundNumber < 3 ? 'Start Next Round' : 'Finish'}
              </button>
              <button onClick={() => window.location.href = '/dashboard'} style={secondaryButtonStyle}>
                Home
              </button>
            </div>
          </div>
        ) : finalSummary ? (
          <div style={summaryCardStyle}>
            <h2>📊 Final Game Summary</h2>
            <p style={{ fontSize: '1.2rem' }}><strong>Total Correct:</strong> {totalCorrect + correctCount}</p>
            <p style={{ fontSize: '1.2rem' }}><strong>Total XP Earned:</strong> {(totalCorrect + correctCount) * 10}</p>
            <h3 style={{ marginTop: '1rem', fontSize: '1.5rem' }}>🌟 Thanks for playing!</h3>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={handleReplay} style={uniformButtonStyle}>Replay</button>
              <button onClick={() => window.location.href = '/dashboard'} style={uniformButtonStyle}>Home</button>
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  // Styles
  const welcomeStyle = {
    background: '#1e3c72',
    minHeight: '100vh',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    textAlign: 'center',
    padding: '2rem'
  };

  const mainContainerStyle = {
  background: 'linear-gradient(to bottom right, #1e3c72, #2a5298)', // themed structure
  minHeight: '100vh',
  padding: '2rem',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
};

  const questionCardStyle = {
    maxWidth: '720px',
    background: 'linear-gradient(to bottom right, #2a5298, #1e3c72)', // themed background
    borderRadius: '12px',
    padding: '2.5rem',
    color: '#fff',
    fontSize: '1.2rem'
  };

  const summaryCardStyle = {
    textAlign: 'center',
    background: '#fff',
    padding: '2.5rem',
    borderRadius: '12px',
    color: '#000',
    maxWidth: '600px'
  };

  const startButtonStyle = {
    marginTop: '2rem',
    padding: '1rem 2rem',
    background: '#4CAF50',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1.2rem',
    cursor: 'pointer'
  };

  const actionButtonStyle = {
    padding: '0.85rem 2rem',
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer'
  };

  const secondaryButtonStyle = {
    ...actionButtonStyle,
    background: '#9E9E9E'
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
    minWidth: '120px'
  };

  export default HabitQuizGame;

