import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { HabitProvider } from './context/HabitContext';
import Dashboard from './components/Dashboard';
import BreakthroughGame from './components/BreakthroughGame';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Track from './components/Track'; // Import the new Track component
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import AddictionRecoveryGame from './components/games/AddictionRecoveryGame';
import DashboardReview from './components/DashboardReview';
import SpinWheel from './components/SpinWheel';
import HabitProgressTracker from './components/HabitProgressTracker';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <HabitProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/spinWheel" element={<SpinWheel />} />
            <Route path="/habitProgressTracker" element={<HabitProgressTracker />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/track" element={<Track />} />
            <Route path="/review" element={<DashboardReview />} /> {/* Move this outside */}
            <Route path="/breakthrough-game" element={<BreakthroughGame />}>
              <Route path=":categoryId/play" element={<AddictionRecoveryGame />} />
            </Route>
          </Routes>
        </HabitProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
