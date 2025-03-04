import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { ThemeProvider as CustomThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { HabitProvider } from './context/HabitContext';
import { theme } from './theme';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import BreakthroughGame from './components/BreakthroughGame';

function App() {
  return (
    <CustomThemeProvider>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <HabitProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/breakthrough-game" element={<BreakthroughGame />} />
            </Routes>
          </HabitProvider>
        </AuthProvider>
      </ThemeProvider>
    </CustomThemeProvider>
  );
}

export default App;
