import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { HabitProvider } from './context/HabitContext';
import Dashboard from './components/Dashboard';
import BreakthroughGame from './components/BreakthroughGame';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import AddictionRecoveryGame from './components/games/AddictionRecoveryGame';
<<<<<<< HEAD
import HabitProgressTracker from './components/HabitProgressTracker';
=======
>>>>>>> origin/feature-Ronitkumar-Sabhaya

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <HabitProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
<<<<<<< HEAD
            <Route path="/breakthrough-game" element={<BreakthroughGame />} />
            <Route path="/habitRewards" element={<HabitProgressTracker />} />
            <Route path="/breakthrough-game/:categoryId/play" element={<AddictionRecoveryGame />} />
=======
            <Route path="/breakthrough-game" element={<BreakthroughGame />}>
        <Route path="/breakthrough-game/:categoryId/play" element={<AddictionRecoveryGame />} />
            </Route>
>>>>>>> origin/feature-Ronitkumar-Sabhaya
          </Routes>
        </HabitProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;