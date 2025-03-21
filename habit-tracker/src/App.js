import React from 'react';
import { Routes, Route } from 'react-router-dom';
<<<<<<< HEAD
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
=======
import { AuthProvider } from './context/AuthContext';  // Correct path
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';


function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </AuthProvider>
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
  );
}

export default App;
