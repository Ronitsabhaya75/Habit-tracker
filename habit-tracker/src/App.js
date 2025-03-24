import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { HabitProvider } from './context/HabitContext';
import { EventProvider } from './context/EventContext'; // Import EventProvider
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
import SpinWheel from './components/SpinWheel';
import HabitProgressTracker from './components/HabitProgressTracker';
import Chess from './components/games/chess';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <HabitProvider> {/* Add back the opening HabitProvider tag */}
          <EventProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/spinWheel" element={<SpinWheel />} />
              <Route path="/habitProgressTracker" element={<HabitProgressTracker />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/track" element={<Track />} />
              <Route path="/review" element={<DashboardReview />} />
              <Route path="/breakthrough-game" element={<BreakthroughGame />} />
              <Route path="/addiction-recovery" element={<AddictionRecoveryGame />} />
              <Route path="/chess" element={<Chess />} />
            </Routes>
          </EventProvider>
        </HabitProvider> {/* This matches the opening tag */}
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;