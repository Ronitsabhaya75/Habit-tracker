import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { theme } from '../theme';
import AuthContext from '../context/AuthContext';  // Correct import

const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${theme.colors.primaryGradient};
`;

const RegisterForm = styled.form`
  background: ${theme.colors.glassWhite};
  padding: 2.5rem;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid ${theme.colors.borderWhite};
  width: 400px;
  max-width: 90%;
  color: ${theme.colors.text};
`;

const AuthTitle = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin: 1rem 0;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid ${theme.colors.borderWhite};
  border-radius: 8px;
  color: ${theme.colors.text};
  font-size: 1rem;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.8rem;
  background-color: ${theme.colors.secondary};
  color: ${theme.colors.text};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  margin-top: 1.5rem;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.02);
  }
`;

const AuthLink = styled(Link)`
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  display: block;
  margin-top: 1.5rem;
  text-decoration: none;
  &:hover {
    color: ${theme.colors.text};
  }
`;

const Register = () => {
  const { login, isAuthenticated } = useContext(AuthContext);  // Using AuthContext here
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/dashboard');
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (username && email && password) {
      login();
      navigate('/dashboard');
    }
  };

  return (
    <RegisterContainer>
      <RegisterForm onSubmit={handleSubmit}>
        <AuthTitle>Register</AuthTitle>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button type="submit">Create Account</Button>
        <AuthLink to="/login">Already have an account? Login here</AuthLink>
      </RegisterForm>
    </RegisterContainer>
  );
};

export default Register;
