import React, { useState, useContext, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
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
    font-family: 'Poppins', 'Montserrat', 'Roboto', sans-serif;
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

// Animation keyframes
const starTwinkle = keyframes`
  0% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
  100% { opacity: 0.7; transform: scale(1); }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 10px rgba(0, 230, 118, 0.4); }
  50% { box-shadow: 0 0 20px rgba(0, 230, 118, 0.6); }
  100% { box-shadow: 0 0 10px rgba(0, 230, 118, 0.4); }
`;

const progressAnimation = keyframes`
  0% { width: 0%; }
  100% { width: 100%; }
`;

const shimmerAnimation = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

// Styled Components
const PageContainer = styled.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #1a2f38 0%, #203a43 50%, #2c5364 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const BackgroundGradient = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 50%, rgba(49, 165, 129, 0.15) 0%, transparent 70%);
`;

const Star = styled.div`
  position: absolute;
  width: ${props => props.size || '6px'};
  height: ${props => props.size || '6px'};
  background: white;
  border-radius: 50%;
  top: ${props => props.top};
  left: ${props => props.left};
  opacity: 0.7;
  animation: ${starTwinkle} ${props => props.duration || '3s'} infinite ease-in-out;
  animation-delay: ${props => props.delay || '0s'};
  box-shadow: 0 0 ${props => props.glow || '3px'} rgba(255, 255, 255, 0.7);
`;

const Planet = styled.div`
  position: absolute;
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border-radius: 50%;
  background: ${props => props.bg || 'linear-gradient(135deg, #5f72bd 0%, #9b59b6 100%)'};
  top: ${props => props.top};
  left: ${props => props.left};
  box-shadow: inset -5px -5px 10px rgba(0, 0, 0, 0.3), 0 0 15px rgba(0, 230, 118, 0.3);
  opacity: 0.9;
  animation: ${floatAnimation} ${props => props.duration || '10s'} infinite ease-in-out;
  animation-delay: ${props => props.delay || '0s'};
`;

const Rocket = styled.div`
  position: absolute;
  top: ${props => props.top};
  left: ${props => props.left};
  font-size: ${props => props.size || '24px'};
  transform: rotate(45deg);
  animation: ${floatAnimation} ${props => props.duration || '6s'} infinite ease-in-out;
  animation-delay: ${props => props.delay || '0s'};
  filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.5));
  z-index: 2;
  
  &::before {
    content: '🚀';
  }
`;

const LoginFormContainer = styled.div`
  width: 400px;
  max-width: 90%;
  z-index: 10;
  position: relative;
`;

const FormCard = styled.div`
  background: rgba(30, 39, 50, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(49, 165, 129, 0.2);
  padding: 2.5rem;
  color: #e6f3ef;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  text-align: center;
  animation: ${pulseGlow} 5s infinite ease-in-out;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.05) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: skewX(-25deg);
    animation: ${shimmerAnimation} 6s infinite;
  }
`;

const Title = styled.h2`
  font-size: 2.2rem;
  color: #f1f8f5;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 10px rgba(49, 165, 129, 0.5);
  font-weight: bold;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #31a581;
  margin-bottom: 2rem;
  text-shadow: 0 0 5px rgba(49, 165, 129, 0.3);
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
  text-align: left;
`;

const InputLabel = styled.label`
  position: absolute;
  left: 36px;
  top: ${props => props.focused || props.hasValue ? '-24px' : '12px'};
  color: ${props => props.focused ? 'rgba(49, 165, 129, 0.9)' : 'rgba(255, 255, 255, 0.6)'};
  font-size: ${props => props.focused || props.hasValue ? '0.75rem' : '1rem'};
  transition: all 0.3s ease;
  pointer-events: none;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.focused ? 'rgba(49, 165, 129, 0.9)' : 'rgba(255, 255, 255, 0.6)'};
  font-size: 1.2rem;
  transition: all 0.3s ease;
  z-index: 1;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.9rem 0.9rem 0.9rem 36px;
  background: rgba(20, 27, 45, 0.7);
  border: 1px solid ${props => props.focused ? 'rgba(49, 165, 129, 0.9)' : 'rgba(49, 165, 129, 0.3)'};
  border-radius: 10px;
  color: #f1f8f5;
  font-size: 1.05rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: rgba(49, 165, 129, 0.9);
    box-shadow: 0 0 10px rgba(49, 165, 129, 0.3);
  }
  
  &::placeholder {
    color: transparent;
  }
`;

const RememberMeContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  text-align: left;
  
  input {
    margin-right: 0.5rem;
    cursor: pointer;
    appearance: none;
    width: 16px;
    height: 16px;
    border: 1px solid rgba(49, 165, 129, 0.5);
    border-radius: 3px;
    background: rgba(20, 27, 45, 0.7);
    position: relative;
    
    &:checked {
      background: #31a581;
      border-color: #31a581;
      
      &::after {
        content: '✓';
        color: white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 10px;
      }
    }
  }
  
  label {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
  }
`;

const ForgotPassword = styled.div`
  text-align: right;
  margin-bottom: 1.5rem;
  
  a {
    color: #31a581;
    font-size: 0.85rem;
    text-decoration: none;
    transition: all 0.3s ease;
    
    &:hover {
      color: #3dd6a3;
      text-shadow: 0 0 5px rgba(49, 165, 129, 0.5);
    }
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 0.9rem;
  background: linear-gradient(135deg, #31a581 0%, #44c4a1 100%);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1.05rem;
  font-weight: bold;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(49, 165, 129, 0.3);
  
  &:hover {
    background: linear-gradient(135deg, #44c4a1 0%, #31a581 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(49, 165, 129, 0.4);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  ${props => props.loading && `
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
      animation: ${progressAnimation} 1.5s infinite;
    }
  `}
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(49, 165, 129, 0.2);
  }

  span {
    padding: 0 1rem;
  }
`;

const GoogleButton = styled.button`
  width: 100%;
  padding: 0.9rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  svg {
    height: 18px;
    width: 18px;
  }
`;

const RegisterLink = styled(Link)`
  display: block;
  margin-top: 1.5rem;
  color: #31a581;
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  
  &:hover {
    color: #3dd6a3;
    text-shadow: 0 0 5px rgba(49, 165, 129, 0.5);
  }
`;

const BackToHomeButton = styled(Link)`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(49, 165, 129, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(49, 165, 129, 0.3);
  padding: 0.6rem 1.2rem;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    background: rgba(49, 165, 129, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(20, 27, 45, 0.5);
  border-radius: 2px;
  margin-top: 0.5rem;
  overflow: hidden;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.3s;
  
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => props.progress}%;
    background: linear-gradient(90deg, #31a581, #44c4a1);
    border-radius: 2px;
    transition: width 0.3s ease;
  }
`;

const ProgressText = styled.p`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 0.5rem;
  text-align: center;
  height: 1rem;
`;

const ErrorMessage = styled.div`
  color: #ff5252;
  background: rgba(255, 82, 82, 0.1);
  border-left: 3px solid #ff5252;
  padding: 0.8rem;
  margin-bottom: 1.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  text-align: left;
`;

// Icon Components
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.58c2.08-1.92 3.28-4.74 3.28-8.07z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-1 7.28-2.69l-3.58-2.75c-.99.67-2.26 1.07-3.7 1.07-2.85 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
);

const PasswordIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
  </svg>
);

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </svg>
);

// Login Component
const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [error, setError] = useState(null);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const navigate = useNavigate();
  
  // Handle email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Start progress
      setProgress(10);
      setProgressMessage('Validating credentials...');

      // Perform actual login
      await signInWithEmailAndPassword(auth, email, password);
      
      // On success
      setProgress(50);
      setProgressMessage('Preparing your cosmic journey...');
      
      setTimeout(() => {
        setProgress(100);
        setProgressMessage('Login successful!');
        
        setTimeout(() => {
          login();
          navigate('/dashboard');
        }, 500);
      }, 800);
      
    } catch (error) {
      setIsLoading(false);
      setProgress(0);
      setProgressMessage('');
      
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
  
  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      setProgress(20);
      setProgressMessage('Connecting with Google...');
      
      const result = await signInWithPopup(auth, googleProvider);
      
      setProgress(60);
      setProgressMessage('Preparing your dashboard...');
      
      setTimeout(() => {
        setProgress(100);
        setProgressMessage('Login successful!');
        
        setTimeout(() => {
          login();
          navigate('/dashboard');
        }, 500);
      }, 800);
      
    } catch (error) {
      setIsLoading(false);
      setProgress(0);
      setProgressMessage('');
      setError('Google login failed. Please try again later.');
    }
  };

  // Generate random stars
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 40; i++) {
      const size = `${Math.random() * 5 + 2}px`;
      const top = `${Math.random() * 100}%`;
      const left = `${Math.random() * 100}%`;
      const duration = `${Math.random() * 3 + 2}s`;
      const delay = `${Math.random() * 3}s`;
      const glow = `${Math.random() * 4 + 1}px`;
      
      stars.push(
        <Star 
          key={i}
          size={size}
          top={top}
          left={left}
          duration={duration}
          delay={delay}
          glow={glow}
        />
      );
    }
    return stars;
  };
  
  // Generate planets
  const renderPlanets = () => {
    return [
      <Planet 
        key="planet1" 
        size="40px" 
        top="15%" 
        left="20%" 
        bg="linear-gradient(135deg, #31a581 0%, #44c4a1 100%)" 
        duration="12s"
      />,
      <Planet 
        key="planet2" 
        size="25px" 
        top="70%" 
        left="80%" 
        bg="linear-gradient(135deg, #536DFE 0%, #8C9EFF 100%)" 
        duration="15s"
        delay="2s"
      />,
      <Planet 
        key="planet3" 
        size="18px" 
        top="30%" 
        left="85%" 
        bg="linear-gradient(135deg, #F09819 0%, #EDDE5D 100%)" 
        duration="10s"
        delay="1s"
      />
    ];
  };
  
  // Generate rockets
  const renderRockets = () => {
    return [
      <Rocket key="rocket1" top="20%" left="10%" size="24px" duration="8s" />,
      <Rocket key="rocket2" top="75%" left="85%" size="16px" duration="10s" delay="3s" />,
      <Rocket key="rocket3" top="40%" left="75%" size="18px" duration="12s" delay="1s" />
    ];
  };

  return (
    <>
      <GlobalStyle />
      <PageContainer>
        <Background>
          <BackgroundGradient />
          {renderStars()}
          {renderPlanets()}
          {renderRockets()}
        </Background>
        
        <BackToHomeButton to="/">
          <HomeIcon /> Back to Home
        </BackToHomeButton>
        
        <LoginFormContainer>
          <FormCard>
            <Title>Welcome Back</Title>
            <Subtitle>Continue your cosmic journey</Subtitle>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <form onSubmit={handleSubmit}>
              <InputGroup>
                <InputIcon focused={emailFocused}><EmailIcon /></InputIcon>
                <InputLabel focused={emailFocused} hasValue={email.length > 0}>Email</InputLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  focused={emailFocused}
                  required
                />
              </InputGroup>
              
              <InputGroup>
                <InputIcon focused={passwordFocused}><PasswordIcon /></InputIcon>
                <InputLabel focused={passwordFocused} hasValue={password.length > 0}>Password</InputLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  focused={passwordFocused}
                  required
                />
              </InputGroup>
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <RememberMeContainer>
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label htmlFor="rememberMe">Remember me</label>
                </RememberMeContainer>
                
                <ForgotPassword>
                  <Link to="/forgot-password">Forgot password?</Link>
                </ForgotPassword>
              </div>
              
              <LoginButton type="submit" disabled={isLoading} loading={isLoading}>
                {isLoading ? '' : 'Login'}
              </LoginButton>
              
              {isLoading && (
                <>
                  <ProgressBar visible={isLoading} progress={progress} />
                  <ProgressText>{progressMessage}</ProgressText>
                </>
              )}
            </form>
            
            <Divider><span>OR</span></Divider>
            
            <GoogleButton onClick={handleGoogleLogin} disabled={isLoading}>
              <GoogleIcon /> Continue with Google
            </GoogleButton>
            
            <RegisterLink to="/register">
              Don't have an account yet? Register now
            </RegisterLink>
          </FormCard>
        </LoginFormContainer>
      </PageContainer>
    </>
  );
};

export default Login;
