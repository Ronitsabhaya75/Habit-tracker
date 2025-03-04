import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { HabitProvider } from './context/HabitContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import BreakthroughGame from './components/BreakthroughGame'; // New import

function App() {
  return (
    <AuthProvider>
      <HabitProvider>
        <Navbar /> {/* Navbar component */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/breakthrough-game" element={<BreakthroughGame />} /> {/* New Route */}
        </Routes>
      </HabitProvider>
    </AuthProvider>
  );
}

export default App;
