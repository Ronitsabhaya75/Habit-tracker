import React, { useState, useContext } from 'react';
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../components/firebase';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { theme } from '../theme';
import AuthContext from '../context/AuthContext';

// Add GlobalStyle to ensure styles are applied properly
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }
`;

// Error Message component
const ErrorMessage = styled.div`
  color: #ff4d4d;
  background: rgba(255, 77, 77, 0.1);
  border: 1px solid rgba(255, 77, 77, 0.3);
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 15px;
  text-align: center;
`;

// **ANIMATIONS**
const floatAnimation = keyframes`
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(2deg); }
  100% { transform: translateY(0) rotate(0deg); }
`;

const starGlow = keyframes`
  0% { opacity: 0.6; filter: blur(1px); }
  50% { opacity: 1; filter: blur(0px); }
  100% { opacity: 0.6; filter: blur(1px); }
`;

const slowRotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const trailAnimation = keyframes`
  0% { opacity: 0; transform: translateX(20px); }
  20% { opacity: 0.7; }
  100% { opacity: 0; transform: translateX(-100px); }
`;

const pulseGlow = keyframes`
  0% { transform: scale(1); opacity: 0.6; box-shadow: 0 0 10px rgba(100, 220, 255, 0.5); }
  50% { transform: scale(1.05); opacity: 0.8; box-shadow: 0 0 20px rgba(100, 220, 255, 0.8); }
  100% { transform: scale(1); opacity: 0.6; box-shadow: 0 0 10px rgba(100, 220, 255, 0.5); }
`;

// **BACKGROUND**
const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #2b3a67 0%, #1a2233 100%);
  overflow: hidden;
  z-index: 0;
`;

// Gradient Overlay
const GradientOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 50%, rgba(114, 137, 218, 0.15) 0%, transparent 70%),
              radial-gradient(circle at 70% 70%, rgba(90, 128, 244, 0.1) 0%, transparent 60%);
  z-index: 1;
`;

// Scenery
const Scenery = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30%;
  background: linear-gradient(180deg, transparent 0%, rgba(48, 56, 97, 0.2) 100%);
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 5%;
    width: 30%;
    height: 80%;
    background: linear-gradient(135deg, #3b4874 20%, #2b3a67 100%);
    clip-path: polygon(0% 100%, 50% 30%, 100% 100%);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 15%;
    width: 40%;
    height: 90%;
    background: linear-gradient(135deg, #2b3a67 20%, #1a2233 100%);
    clip-path: polygon(0% 100%, 40% 20%, 80% 60%, 100% 100%);
  }
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

// Achievement Badge
const AchievementBadge = styled.div`
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(114, 137, 218, 0.2) 0%, rgba(114, 137, 218, 0) 70%);
  border: 2px solid rgba(114, 137, 218, 0.3);
  box-shadow: 0 0 15px rgba(114, 137, 218, 0.2);
  top: 15%;
  right: 15%;
  z-index: 2;
  animation: ${pulseGlow} 4s infinite ease-in-out;
  
  &::before {
    content: '🏆';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 24px;
  }
`;

// Rocket
const Rocket = styled.div`
  position: absolute;
  top: 30%;
  left: 15%;
  width: 50px;
  height: 50px;
  z-index: 3;
  animation: ${floatAnimation} 8s infinite ease-in-out;
  transform-origin: center center;
  
  &::before {
    content: '🚀';
    position: absolute;
    font-size: 28px;
    transform: rotate(45deg);
  }
`;

// Rocket Trail
const RocketTrail = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  width: 80px;
  height: 8px;
  background: linear-gradient(90deg, rgba(100, 220, 255, 0) 0%, rgba(100, 220, 255, 0.7) 100%);
  border-radius: 4px;
  z-index: 2;
  opacity: 0.5;
  filter: blur(2px);
  transform: translateX(-80px);
  animation: ${trailAnimation} 2s infinite;
`;

// Progress Circle
const ProgressCircle = styled.div`
  position: absolute;
  bottom: 20%;
  right: 10%;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid rgba(100, 220, 255, 0.2);
  border-top: 3px solid rgba(100, 220, 255, 0.8);
  animation: ${slowRotate} 8s linear infinite;
  z-index: 2;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70px;
    height: 70px;
    border-radius: 50%;
    border: 2px dashed rgba(100, 220, 255, 0.2);
  }
`;

// XP Orb
const XPOrb = styled.div`
  position: absolute;
  width: 15px;
  height: 15px;
  background: radial-gradient(circle, rgba(160, 232, 255, 0.6) 30%, rgba(160, 232, 255, 0) 70%);
  border-radius: 50%;
  animation: ${floatAnimation} ${props => props.duration || '4s'} infinite ease-in-out;
  animation-delay: ${props => props.delay || '0s'};
  opacity: 0.5;
  z-index: 2;
`;

// **REGISTER FORM**
const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  position: relative;
  z-index: 10;
`;

const RegisterForm = styled.form`
  background: rgba(30, 39, 73, 0.6);
  padding: 2.5rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(114, 137, 218, 0.2);
  width: 400px;
  max-width: 90%;
  color: ${props => props.theme.colors.text || 'white'};
  box-shadow: 0 8px 32px rgba(14, 21, 47, 0.2), 
              0 0 0 1px rgba(114, 137, 218, 0.1), 
              inset 0 1px 1px rgba(255, 255, 255, 0.05);
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin: 1rem 0;
  background: rgba(20, 27, 56, 0.6);
  border: 1px solid rgba(114, 137, 218, 0.3);
  border-radius: 8px;
  color: ${props => props.theme.colors.text || 'white'};
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: rgba(114, 137, 218, 0.8);
    box-shadow: 0 0 0 2px rgba(114, 137, 218, 0.2);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.8rem;
  background: linear-gradient(135deg, #7289da 0%, #5865f2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  margin-top: 1.5rem;
  transition: transform 0.2s, box-shadow 0.3s;
  box-shadow: 0 4px 12px rgba(88, 101, 242, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(88, 101, 242, 0.6);
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const AuthTitle = styled.h2`
  font-size: 2rem;
  color: white;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const AuthSubtitle = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
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
  right: 2rem;
  background: ${props => props.theme.colors?.primary || '#7289da'};
  color: #FFFFFF;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  z-index: 1001;
  text-decoration: none;

  &:hover {
    background: ${props => props.theme.colors?.accent || '#5865f2'};
    transform: translateY(-2px);
  }
`;

const GoogleSignInButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(114, 137, 218, 0.3);
  margin-top: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(114, 137, 218, 0.5);
  }

  svg {
    margin-right: 10px;
    width: 24px;
    height: 24px;
  }
`;

// Google SVG Icon
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-1 7.28-2.69l-3.57-2.77c-.99.69-2.26 1.1-3.71 1.1-2.87 0-5.3-1.94-6.16-4.54H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.66-2.06z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.86-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const Register = () => {
  // Create a fallback theme object if theme is undefined
  const fallbackTheme = {
    colors: {
      text: 'white',
      primary: '#7289da',
      accent: '#5865f2'
    }
  };

  // Use either the imported theme or the fallback
  const appTheme = theme || fallbackTheme;

  const { login, isAuthenticated } = useContext(AuthContext) || { login: () => {}, isAuthenticated: false };
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleSignIn = async () => {
    const googleProvider = new GoogleAuthProvider();
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Sign in with Google popup
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;
      
      // If the user doesn't have a display name, set a default username
      if (!user.displayName) {
        await updateProfile(user, {
          displayName: user.email.split('@')[0]
        });
      }
      
      // Update auth context
      login(user);
      
      // Redirect to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      setIsLoading(false);
      
      // Handle specific Google Sign-In errors
      switch(error.code) {
        case 'auth/account-exists-with-different-credential':
          setError('An account already exists with a different sign-in method.');
          break;
        case 'auth/popup-blocked':
          setError('Sign-in popup was blocked. Please enable popups and try again.');
          break;
        case 'auth/popup-closed-by-user':
          setError('Sign-in popup was closed before completion.');
          break;
        default:
          setError('Google Sign-In failed. Please try again.');
          console.error('Google Sign-In error:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password should be at least 6 characters");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with username
      await updateProfile(userCredential.user, {
        displayName: username
      });
      
      // Update auth context
      login(userCredential.user);
      
      // Redirect to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      setIsLoading(false);
      
      // Handle specific Firebase errors
      switch(error.code) {
        case 'auth/email-already-in-use':
          setError('Email already in use. Try logging in instead.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/weak-password':
          setError('Password should be at least 6 characters.');
          break;
        case 'auth/operation-not-allowed':
          setError('Email/password accounts are not enabled.');
          break;
        default:
          setError('Registration failed. Please try again.');
          console.error('Registration error:', error);
      }
    }
  };

  return (
    <>
      <GlobalStyle />
      <Background>
        {/* Gradient Overlay */}
        <GradientOverlay />
        
        {/* Mountain Scenery */}
        <Scenery />
        
        {/* Stars */}
        <Star size="20px" style={{ top: '10%', left: '10%' }} duration="4s" delay="0.5s" />
        <Star size="15px" style={{ top: '25%', left: '25%' }} duration="3s" delay="1s" />
        <Star size="25px" style={{ top: '15%', right: '30%' }} duration="5s" delay="0.2s" />
        
        {/* Rocket with animation */}
        <Rocket>
          <RocketTrail />
        </Rocket>
        
        {/* Achievement Badge */}
        <AchievementBadge />
        
        {/* Progress Circle */}
        <ProgressCircle />
        
        {/* XP Orbs */}
        <XPOrb style={{ top: '65%', left: '15%' }} duration="6s" delay="0.2s" />
        <XPOrb style={{ top: '30%', right: '25%' }} duration="5s" delay="1.2s" />
        <XPOrb style={{ top: '75%', right: '30%' }} duration="7s" delay="0.5s" />
        <XPOrb style={{ top: '45%', left: '60%' }} duration="5.5s" delay="1.5s" />
      </Background>

      <RegisterContainer>
        <HomeButton to="/">Home</HomeButton>
        <RegisterForm onSubmit={handleSubmit}>
          <AuthTitle>Register</AuthTitle>
          <AuthSubtitle>Start your journey today</AuthSubtitle>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading}
          />
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
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
          
          {/* Google Sign-In Button */}
          <GoogleSignInButton 
            type="button" 
            onClick={handleGoogleSignIn} 
            disabled={isLoading}
          >
            <GoogleIcon />
            Continue with Google
          </GoogleSignInButton>
          
          <AuthLink to="/login">Already have an account? Login here</AuthLink>
        </RegisterForm>
      </RegisterContainer>
    </>
  );
};

export default Register;