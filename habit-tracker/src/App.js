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