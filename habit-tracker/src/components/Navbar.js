/**
 * Navbar Component
 *
 * This file implements the Navbar component for the HabitQuest application.
 * It provides a visually engaging navigation bar with:
 *  - A background featuring a dynamic starry night effect.
 *  - A brand logo that links to the homepage.
 *  - Navigation links that dynamically update based on authentication status.
 *  - A logout button for authenticated users.
 *
 * The component utilizes:
 *  - React Router's `useNavigate` for navigation.
 *  - React Context (`useContext`) for authentication state management.
 *  - Styled-components for CSS-in-JS styling, including animated stars.
 *  - Keyframe animations (`starGlow`) for a glowing star effect.
 * 
 * The Navbar dynamically updates to show:
 *  - "Login" and "Home" links when the user is not authenticated.
 *  - A "Logout" button when the user is authenticated, which logs the user out and redirects them to the login page.
 *
 * The background consists of:
 *  - A gradient overlay for aesthetic enhancement.
 *  - Multiple animated stars, positioned dynamically with different sizes, durations, and delays.
 *
 * The component is structured for maintainability and a seamless user experience.
 */

import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { theme } from '../theme';
import AuthContext from '../context/AuthContext';

// **ANIMATIONS**
const starGlow = keyframes`
  0% { opacity: 0.6; filter: blur(1px); }
  50% { opacity: 1; filter: blur(0px); }
  100% { opacity: 0.6; filter: blur(1px); }
`;

// **BACKGROUND**
const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #2b3a67 0%, #1a2233 100%);
  overflow: hidden;
`;

// Gradient Overlay
const GradientOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 50%, rgba(114, 137, 218, 0.15) 0%, transparent 70%),
              radial-gradient(circle at 70% 70%, rgba(90, 128, 244, 0.1) 0%, transparent 60%);
  z-index: 1;
`;

// Stars
const Star = styled.div`
  position: absolute;
  width: ${props => props.size || '30px'};
  height: ${props => props.size || '30px'};
  background: radial-gradient(circle, rgba(255, 210, 70, 0.9) 0%, rgba(255, 210, 70, 0) 70%);
  border-radius: 50%;
  z-index: 2;
  animation: ${starGlow} ${props => props.duration || '3s'} infinite ease-in-out;
  animation-delay: ${props => props.delay || '0s'};
  opacity: 0.7;
  
  &::before {
    content: '★';
    position: absolute;
    font-size: ${props => parseInt(props.size) * 0.8 || '24px'};
    color: rgba(255, 210, 70, 0.9);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

// Navbar Container
const Nav = styled.nav`
  background: transparent;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 10;
`;

const Brand = styled(Link)`
  color: ${theme.colors.text};
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
`;

const NavLink = styled(Link)`
  color: ${theme.colors.text};
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.8;
  }
`;

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Background with Stars */}
      <Background>
        <GradientOverlay />
        <Star size="20px" style={{ top: '10%', left: '10%' }} duration="4s" delay="0.5s" />
        <Star size="15px" style={{ top: '25%', left: '25%' }} duration="3s" delay="1s" />
        <Star size="25px" style={{ top: '15%', right: '30%' }} duration="5s" delay="0.2s" />
      </Background>

      {/* Navbar */}
      <Nav>
        <Brand to="/">LevelUp</Brand>
        <NavLinks>
          {isAuthenticated ? (
            <>
              <NavLink to="/login" onClick={handleLogout}>Logout</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/">Home</NavLink>
              <NavLink to="/login">Login</NavLink>
            </>
          )}
        </NavLinks>
      </Nav>
    </>
  );
};

export default Navbar;