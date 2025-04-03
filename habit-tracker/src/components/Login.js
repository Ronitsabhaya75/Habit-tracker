/*
The Login component provides a visually engaging authentication interface for your habit-tracking application. It features a space-themed design with interactive elements and supports both email/password and Google authentication methods.

Key Features
1. Authentication Methods
Email/Password Login: Traditional form-based authentication

Google Sign-In: OAuth integration with Firebase

Remember Me: Option to persist login session

Password Recovery: Link to forgot password flow

2. User Experience Enhancements
Dynamic Avatar: Shows user initial when email is entered

Motivational Quotes: Randomly displayed messages

Progress Indicators: Visual feedback during authentication

Rocket Animation: Visual feedback on login actions

3. Error Handling
Form validation

Specific error messages for common auth failures

Visual error display

4. Performance Optimizations
Memoized star rendering

Optimized animations

Loading states for async operations
*/
import React, { useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import styled, { keyframes, css, createGlobalStyle } from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { theme } from '../theme';
import AuthContext from '../context/AuthContext';

// Add Global Style to remove default margins and padding
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html, body, #root {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }
`;

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7JasyKV8fqTNKBiY8Jv4oyEPaBkVrIP0",
  authDomain: "habit-tracker-6ee53.firebaseapp.com",
  projectId: "habit-tracker-6ee53",
  storageBucket: "habit-tracker-6ee53.firebasestorage.app",
  messagingSenderId: "104092658271",
  appId: "1:104092658271:web:5b11f78599492587a109ea",
  measurementId: "G-2CTB5HKS9J"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// **OPTIMIZED ANIMATIONS**
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

// **STYLED COMPONENTS** (updated to fix white border)
const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #2b3a67 0%, #1a2233 100%);
  overflow: hidden;
  will-change: transform;
  margin: 0;
  padding: 0;
`;

const GradientOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 50%, rgba(114, 137, 218, 0.1) 0%, transparent 70%);
  z-index: 1;
`;

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
  will-change: opacity;
`;

const Rocket = styled.div`
  position: absolute;
  top: 30%;
  left: 15%;
  width: 50px;
  height: 50px;
  z-index: 3;
  animation: ${floatAnimation} 8s infinite ease-in-out;
  will-change: transform;
  
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

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  position: relative;
  z-index: 10;
`;

const LoginForm = styled.form`
  background: rgba(30, 39, 73, 0.8);
  padding: 2.5rem;
  border-radius: 16px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(114, 137, 218, 0.2);
  width: 400px;
  max-width: 90%;
  color: ${theme.colors.text};
  box-shadow: 0 10px 25px rgba(14, 21, 47, 0.3);
  text-align: center;
  transition: transform 0.3s ease;
  will-change: transform;

  &:hover {
    transform: translateY(-5px);
  }
`;

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
  will-change: transform;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(88, 101, 242, 0.6);
    animation: ${buttonGradient} 3s ease infinite;
  }
  
  &:active {
    transform: translateY(1px);
  }

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
  will-change: opacity, transform;
  
  span {
    font-size: 1.8rem;
    color: white;
  }
`;

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

const ErrorMessage = styled.div`
  color: #ff4757;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  background: rgba(255, 71, 87, 0.1);
  padding: 0.5rem;
  border-radius: 8px;
`;

// Google Icon Component
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.58c2.08-1.92 3.28-4.74 3.28-8.07z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-1 7.28-2.69l-3.58-2.75c-.99.67-2.26 1.07-3.7 1.07-2.85 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

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
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Array of motivational quotes
  const quotes = [
    "Ready to continue your journey?",
    "Your adventure awaits, explorer!",
    "Time to level up your experience!",
    "Your quest continues here!"
  ];

  // Show avatar when email is entered
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (email.trim().length > 0) {
        setAvatarVisible(true);
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setMotivationQuote(randomQuote);
      } else {
        setAvatarVisible(false);
        setMotivationQuote('');
      }
    }, 300);
    
    return () => clearTimeout(debounceTimer);
  }, [email]);

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setRocketTakeoff(true);
      setError(null);
      
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Simulate progress
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += 10;
        setProgress(currentProgress);
        
        if (currentProgress >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            login();
            navigate('/dashboard');
          }, 300);
        }
      }, 250);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
      setRocketTakeoff(false);
      setProgress(0);
    }
  };

  // Handle email/password login - UPDATED TO PREVENT ENTER KEY ISSUE
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setIsLoading(true);
      setRocketTakeoff(true);
      setError(null);
      
      // Start progress
      setProgress(10);
      setProgressMessage('Validating credentials...');

      // Perform actual login
      await signInWithEmailAndPassword(auth, email, password);
      
      // On success
      setProgress(100);
      setProgressMessage('Login successful!');
      
      setTimeout(() => {
        login();
        navigate('/dashboard');
      }, 500);
      
    } catch (error) {
      setIsLoading(false);
      setRocketTakeoff(false);
      setProgress(0);
      
      // Handle specific errors
      switch(error.code) {
        case 'auth/user-not-found':
          setError('No account found with this email. Please register first.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        default:
          setError('Login failed. Please try again later.');
      }
    }
  };

  // Generate stars with memoization
  const renderStars = useMemo(() => {
    const stars = [];
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
  }, []);

  return (
    <>
      <GlobalStyle />
      <Background>
        <GradientOverlay />
        <Scenery />
        {renderStars}
        <Rocket takeoff={rocketTakeoff} />
      </Background>

      <LoginContainer>
        <HomeButton to="/">Home</HomeButton>
        <LoginForm onSubmit={handleSubmit}>
          <AuthTitle>Enter The Portal</AuthTitle>
          <AuthSubtitle>Continue your cosmic journey</AuthSubtitle>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <AvatarPreview visible={avatarVisible}>
            {avatarVisible && <span>{email.charAt(0).toUpperCase()}</span>}
          </AvatarPreview>
          
          <MotivationQuote>{motivationQuote}</MotivationQuote>
          
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
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
              disabled={isLoading}
            />
            <label htmlFor="rememberMe">Remember this device</label>
          </RememberMeContainer>
          
          {/* Main submit button comes FIRST */}
          <Button type="submit" loading={isLoading} disabled={isLoading}>
            {isLoading ? ' ' : 'Launch Adventure'}
          </Button>
          
          <ProgressBar visible={isLoading} progress={progress} />
          <ProgressText>{progressMessage}</ProgressText>
          
          <Divider><span>or login with</span></Divider>
          
          {/* Social login buttons with explicit type="button" */}
          <SocialLoginContainer>
            <SocialLoginButton 
              type="button"
              bg="#4285F4" 
              color="white" 
              title="Login with Google"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <GoogleIcon />
            </SocialLoginButton>
          </SocialLoginContainer>
          
          <AuthLink to="/register">New explorer? Register now</AuthLink>
        </LoginForm>
      </LoginContainer>
    </>
  );
};

export default Login;