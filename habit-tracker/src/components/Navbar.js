import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../theme';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext'; // Corrected import

const Nav = styled.nav`
  background: ${theme.colors.primaryGradient};
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
    <Nav>
      <Brand to="/">LevelUp</Brand>
      <NavLinks>
        {isAuthenticated ? (
          <>
            {/* <NavLink to="/dashboard">Dashboard</NavLink> */}
            <NavLink to= "/login" onClick={handleLogout}>Logout</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/login">Login</NavLink>
            {/* <NavLink to="/register">Register</NavLink> */}
          </>
        )}
      </NavLinks>
    </Nav>
  );
};

export default Navbar;
