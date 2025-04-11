import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import NewHabit from './components/NewHabit';
import Track from './components/Track';
import Shop from './components/shop';
import BreakthroughGame from './components/BreakthroughGame';
import AIChat from './components/AIChat';
import { HabitProvider } from './context/HabitContext';
import { EventProvider } from './context/EventContext';
import DashboardReview from './components/DashboardReview';
import HabitChallengeDashboard from './components/games/HabitChallengeCenter';
import Chess from './components/games/chess';
import HabitQuizGame from './components/games/HabitQuizGame';
import WordScramblerGame from './components/games/WordScramblerGame';
import PacmanGame from './components/games/pacman/PacmanGame';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <HabitProvider>
          <EventProvider>
            <Router>
              <div className="App">
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/new-habit"
                    element={
                      <ProtectedRoute>
                        <NewHabit />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/track"
                    element={
                      <ProtectedRoute>
                        <Track />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/shop"
                    element={
                      <ProtectedRoute>
                        <Shop />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/breakthrough"
                    element={
                      <ProtectedRoute>
                        <BreakthroughGame />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/ai-chat"
                    element={
                      <ProtectedRoute>
                        <AIChat />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/review" element={<DashboardReview />} />
                  <Route path="/chess" element={<Chess />} />
                  <Route path="/word-scrambler" element={<WordScramblerGame />} />
                  <Route path="/habit-quiz" element={<HabitQuizGame />} />
                  <Route path="/habit-challenge" element={<HabitChallengeDashboard />} />
                  <Route path="/pacman" element={<PacmanGame />} />
                </Routes>
              </div>
            </Router>
          </EventProvider>
        </HabitProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;