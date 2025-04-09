import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { HabitProvider } from './context/HabitContext';
import { EventProvider } from './context/EventContext';
import Dashboard from './components/Dashboard';
import BreakthroughGame from './components/BreakthroughGame';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Track from './components/Track';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import AddictionRecoveryGame from './components/games/AddictionRecoveryGame';
import DashboardReview from './components/DashboardReview';
import HabitChallengeDashboard from './components/games/HabitChallengeCenter';
import Chess from './components/games/chess';
import HabitQuizGame from './components/games/HabitQuizGame';
import WordScramblerGame from './components/games/WordScramblerGame';
import PacmanGame from './components/games/pacman/PacmanGame';
import Shop from './components/shop';
import NewHabit from './components/NewHabit';
function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <HabitProvider>
          <EventProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/track" element={<Track />} />
              <Route path="/review" element={<DashboardReview />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/new-habit" element={<NewHabit />} />
              <Route path="/breakthrough-game" element={<BreakthroughGame />} />
              <Route path="/addiction-recovery" element={<AddictionRecoveryGame />} />
              <Route path="/chess" element={<Chess />} />
              <Route path="/word-scrambler" element={<WordScramblerGame />} />
              <Route path="/habit-quiz" element={<HabitQuizGame />} />
              <Route path="/habit-challenge" element={<HabitChallengeDashboard />} />
              <Route path="/pacman" element={<PacmanGame />} />
            </Routes>
          </EventProvider>
        </HabitProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;