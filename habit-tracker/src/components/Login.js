/**
 * O Login Component
 *
 * Performance improvements:
 * - Reduced number of animated elements
 * - GPU-accelerated animations (transform, opacity)
 * - Throttled state updates
 * - Memoized render functions
 * - Simplified visual effects
 * - Reduced number of DOM elements
 * - Optimized CSS properties
 */

import React, { useState, useContext, useEffect, useMemo, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { theme } from '../theme';
import AuthContext from '../context/AuthContext';

// **OPTIMIZED ANIMATIONS**
// Using transform and opacity for GPU acceleration
const floatAnimation = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0); }
`;

const starTwinkle = keyframes`
  0% { opacity: 0.7; }
  50% { opacity: 1; }
  100% { opacity: 0.7; }
`;

const pulseGlow = keyframes`
  0% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 0.6; }
`;

const buttonGradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const progressAnimation = keyframes`
  0% { width: 0%; }
  100% { width: 100%; }
`;

const takeoffAnimation = keyframes`
  0% { transform: translateY(0); }
  60% { transform: translateY(-20px); opacity: 0.7; }
  100% { transform: translateY(-100px); opacity: 0; }
`;

// **OPTIMIZED BACKGROUND**
const Background = styled.div`
  position: fixed; /* Fixed instead of absolute to reduce repaints */
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #2b3a67 0%, #1a2233 100%);
  overflow: hidden;
  will-change: transform; /* Hint to browser for optimization */
`;

// Simplified gradient overlay
const GradientOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 50%, rgba(114, 137, 218, 0.1) 0%, transparent 70%);
  z-index: 1;
`;

// Simplified mountain scenery
const Scenery = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30%;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 5%;
    width: 30%;
    height: 80%;
    background: #3b4874;
    clip-path: polygon(0% 100%, 50% 30%, 100% 100%);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 15%;
    width: 40%;
    height: 90%;
    background: #2b3a67;
    clip-path: polygon(0% 100%, 40% 20%, 80% 60%, 100% 100%);
  }
`;

// Reduced number of stars with simpler styling
const Star = styled.div`
  position: absolute;
  width: ${props => props.size || '10px'};
  height: ${props => props.size || '10px'};
  background: #FFF;
  border-radius: 50%;
  z-index: 2;
  animation: ${starTwinkle} ${props => props.duration || '3s'} infinite ease-in-out;
  animation-delay: ${props => props.delay || '0s'};
  opacity: 0.7;
  will-change: opacity; /* Hint to browser for animation optimization */
`;

// Simplified rocket
const Rocket = styled.div`
  position: absolute;
  top: 30%;
  left: 15%;
  width: 50px;
  height: 50px;
  z-index: 3;
  animation: ${floatAnimation} 8s infinite ease-in-out;
  will-change: transform; /* Optimization hint */
  
  &::before {
    content: '🚀';
    position: absolute;
    font-size: 28px;
    transform: rotate(45deg);
  }

  ${props => props.takeoff && css`
    animation: ${takeoffAnimation} 1.5s forwards ease-out;
  `}
`;

// **LOGIN FORM (OPTIMIZED)**
const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  position: relative;
  z-index: 10;
`;

// Simplified login form with cleaner styling
const LoginForm = styled.form`
  background: rgba(30, 39, 73, 0.8);
  padding: 2.5rem;
  border-radius: 16px;
  backdrop-filter: blur(5px); /* Reduced blur amount */
  border: 1px solid rgba(114, 137, 218, 0.2);
  width: 400px;
  max-width: 90%;
  color: ${theme.colors.text};
  box-shadow: 0 10px 25px rgba(14, 21, 47, 0.3);
  text-align: center;
  transition: transform 0.3s ease;
  will-change: transform; /* Optimization hint */

  &:hover {
    transform: translateY(-5px);
  }
`;

// Optimized input fields
const Input = styled.input`
  width: 100%;
  padding: 0.9rem;
  margin: 1rem 0;
  background: rgba(20, 27, 56, 0.7);
  border: 1px solid rgba(114, 137, 218, 0.3);
  border-radius: 10px;
  color: ${theme.colors.text};
  font-size: 1.05rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgba(114, 137, 218, 0.8);
    background: rgba(25, 32, 65, 0.8);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

// Optimized button
const Button = styled.button`
  width: 100%;
  padding: 0.9rem;
  background: linear-gradient(135deg, #7289da 0%, #4752c4 100%);
  background-size: 200% 200%;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1.05rem;
  font-weight: bold;
  margin-top: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 12px rgba(88, 101, 242, 0.4);
  will-change: transform; /* Optimization hint */

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(88, 101, 242, 0.6);
    animation: ${buttonGradient} 3s ease infinite;
  }
  
  &:active {
    transform: translateY(1px);
  }

  // Add loading state
  ${props => props.loading && css`
    color: transparent;
    pointer-events: none;
    
    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 0;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      animation: ${progressAnimation} 2s forwards;
    }
  `}
`;

// Simplified title styling
const AuthTitle = styled.h2`
  font-size: 2.2rem;
  color: white;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const AuthSubtitle = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1.5rem;
`;

const AuthLink = styled(Link)`
  color: rgba(114, 137, 218, 0.9);
  text-align: center;
  display: block;
  margin-top: 1.5rem;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;

  &:hover {
    color: rgba(114, 137, 218, 1);
    text-decoration: underline;
  }
`;

const HomeButton = styled(Link)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: ${theme.colors.primary};
  color: #FFFFFF;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  z-index: 1001;
  text-decoration: none;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);

  &:hover {
    background: ${theme.colors.accent};
    transform: translateY(-2px);
  }
`;

// Simplified social login components
const SocialLoginContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 1.5rem 0 0.5rem;
  gap: 1rem;
`;

const SocialLoginButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: ${props => props.bg || 'white'};
  color: ${props => props.color || 'black'};
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-3px);
  }
`;

// Simplified divider
const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.2);
  }

  span {
    padding: 0 1rem;
  }
`;

// Simplified forgot password
const ForgotPassword = styled.p`
  margin-top: 1rem;
  font-size: 0.85rem;
  text-align: right;
  
  a {
    color: rgba(114, 137, 218, 0.8);
    text-decoration: none;
    
    &:hover {
      color: rgba(114, 137, 218, 1);
      text-decoration: underline;
    }
  }
`;

// Simplified avatar preview
const AvatarPreview = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4a5080 0%, #2d325e 100%);
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(114, 137, 218, 0.5);
  overflow: hidden;
  transition: opacity 0.3s ease, transform 0.3s ease;
  opacity: ${props => props.visible ? 1 : 0};
  transform: scale(${props => props.visible ? 1 : 0.7});
  will-change: opacity, transform; /* Optimization hint */
  
  span {
    font-size: 1.8rem;
    color: white;
  }
`;

// Simplified motivational quote
const MotivationQuote = styled.div`
  margin: 1rem 0;
  font-style: italic;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  min-height: 20px;
`;

const RememberMeContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
  text-align: left;
  
  input {
    margin-right: 0.5rem;
  }
  
  label {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.8);
  }
`;

// Simplified progress bar
const ProgressBar = styled.div`
  position: relative;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin-top: 1rem;
  overflow: hidden;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.3s;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.progress}%;
    background: linear-gradient(90deg, #7289da, #5865f2);
    border-radius: 4px;
    transition: width 0.3s ease;
  }
`;

const ProgressText = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 0.5rem;
  height: 1rem;
  text-align: center;
`;

// Optimized Login Component
const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [avatarVisible, setAvatarVisible] = useState(false);
  const [motivationQuote, setMotivationQuote] = useState('');
  const [rocketTakeoff, setRocketTakeoff] = useState(false);
  const navigate = useNavigate();

  // Array of motivational quotes
  const quotes = [
    "Ready to continue your journey?",
    "Your adventure awaits, explorer!",
    "Time to level up your experience!",
    "Your quest continues here!"
  ];

  // Show avatar when email is entered - debounced
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (email.trim().length > 0) {
        setAvatarVisible(true);
        
        // Set a random motivational quote
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setMotivationQuote(randomQuote);
      } else {
        setAvatarVisible(false);
        setMotivationQuote('');
      }
    }, 300); // 300ms debounce
    
    return () => clearTimeout(debounceTimer);
  }, [email]);

  // Memoized progress update function for better performance
  const updateProgressWithMessage = useCallback((currentProgress) => {
    setProgress(currentProgress);
    
    // Update progress message less frequently
    if (currentProgress < 30) {
      setProgressMessage('Validating credentials...');
    } else if (currentProgress < 70) {
      setProgressMessage('Preparing navigation...');
    } else {
      setProgressMessage('Almost there...');
    }
  }, []);

  // Handle login with optimized progress updates
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (email && password) {
      setIsLoading(true);
      setRocketTakeoff(true);
      
      // Optimize login progress - fewer updates (250ms instead of 100ms)
      let currentProgress = 0;
      const progressStep = 10; // Larger steps
      const progressInterval = setInterval(() => {
        currentProgress += progressStep;
        updateProgressWithMessage(currentProgress);
        
        if (currentProgress >= 100) {
          clearInterval(progressInterval);
          
          // Complete login after progress reaches 100%
          setTimeout(() => {
            login();
            navigate('/dashboard');
          }, 300); // Reduced timeout
        }
      }, 250); // Slower updates for better performance
    }
  };

  // Generate a reduced number of stars for better performance - memoized
  const renderStars = useMemo(() => {
    const stars = [];
    
    // Reduced from 15 to 8 stars
    for (let i = 0; i < 8; i++) {
      const size = `${Math.random() * 10 + 5}px`;
      const top = `${Math.random() * 100}%`;
      const left = `${Math.random() * 100}%`;
      const duration = `${Math.random() * 3 + 2}s`;
      const delay = `${Math.random() * 2}s`;
      
      stars.push(
        <Star 
          key={i}
          size={size}
          style={{ top, left }}
          duration={duration}
          delay={delay}
        />
      );
    }
    
    return stars;
  }, []); // Empty dependency array means this is calculated once

  return (
    <>
      {/* Optimized Background */}
      <Background>
        {/* Gradient Overlay */}
        <GradientOverlay />
        
        {/* Mountain Scenery */}
        <Scenery />
        
        {/* Reduced number of stars with memoization */}
        {renderStars}
        
        {/* Rocket with optimized animation */}
        <Rocket takeoff={rocketTakeoff} />
      </Background>

      {/* Optimized Login Form */}
      <LoginContainer>
        <HomeButton to="/">Home</HomeButton>
        <LoginForm onSubmit={handleSubmit}>
          <AuthTitle>Enter The Portal</AuthTitle>
          <AuthSubtitle>Continue your cosmic journey</AuthSubtitle>
          
          {/* Avatar Preview */}
          <AvatarPreview visible={avatarVisible}>
            {avatarVisible && <span>{email.charAt(0).toUpperCase()}</span>}
          </AvatarPreview>
          
          {/* Motivational Quote */}
          <MotivationQuote>{motivationQuote}</MotivationQuote>
          
          {/* Social Login Buttons */}
          <SocialLoginContainer>
            <SocialLoginButton bg="#4285F4" color="white" title="Login with Google">G</SocialLoginButton>
            <SocialLoginButton bg="#3b5998" color="white" title="Login with Facebook">f</SocialLoginButton>
            <SocialLoginButton bg="#000000" color="white" title="Login with Apple">a</SocialLoginButton>
          </SocialLoginContainer>
          
          <Divider><span>or with email</span></Divider>
          
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
          
          <ForgotPassword>
            <Link to="/forgot-password">Forgot your password?</Link>
          </ForgotPassword>
          
          <RememberMeContainer>
            <input 
              type="checkbox" 
              id="rememberMe" 
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label htmlFor="rememberMe">Remember this device</label>
          </RememberMeContainer>
          
          <Button type="submit" loading={isLoading}>
            {isLoading ? ' ' : 'Launch Adventure'}
          </Button>
          
          {/* Progress Bar for Login */}
          <ProgressBar visible={isLoading} progress={progress} />
          <ProgressText>{progressMessage}</ProgressText>
          
          <AuthLink to="/register">New explorer? Register now</AuthLink>
        </LoginForm>
      </LoginContainer>
    </>
  );
};

export default Login;