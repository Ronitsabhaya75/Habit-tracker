import React, { useState, useContext, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { theme } from '../theme';
import AuthContext from '../context/AuthContext';

// Added ErrorMessage component
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

const shimmerEffect = keyframes`
  0% { background-position: -500px 0; }
  100% { background-position: 500px 0; }
`;

const confettiAnimation = keyframes`
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
`;

const bounceAnimation = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const glowPulse = keyframes`
  0%, 100% { filter: drop-shadow(0 0 5px rgba(114, 137, 218, 0.3)); }
  50% { filter: drop-shadow(0 0 15px rgba(114, 137, 218, 0.7)); }
`;

const appearFromLeft = keyframes`
  from { transform: translateX(-50px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const fadeInAnimation = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
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
  transition: all 0.5s ease;
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

// Stars with parallax effect
const StarLayer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
  transform: translateX(${props => props.offsetX || 0}px) translateY(${props => props.offsetY || 0}px);
  transition: transform 0.1s ease-out;
`;

// Shooting stars
const ShootingStar = styled.div`
  position: absolute;
  width: ${props => props.size || '2px'};
  height: ${props => props.size || '2px'};
  background: white;
  border-radius: 50%;
  z-index: 2;
  opacity: 0.7;
  filter: blur(1px);
  box-shadow: 0 0 10px 2px white;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 20px;
    background: linear-gradient(to bottom, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 100%);
    transform: translateY(-100%) rotate(45deg);
    transform-origin: bottom;
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

// Confetti for success animation
const Confetti = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: ${props => props.color};
  opacity: 0;
  z-index: 100;
  animation: ${confettiAnimation} 3s ease-in-out forwards;
  animation-delay: ${props => props.delay}s;
`;

// **REGISTER FORM AND JOURNEY PANEL**
const RegisterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  position: relative;
  z-index: 10;
`;

// Journey Panel
const JourneyPanel = styled.div`
  width: 240px;
  height: 400px;
  background: rgba(30, 39, 73, 0.4);
  backdrop-filter: blur(10px);
  border-radius: 12px 0 0 12px;
  border: 1px solid rgba(114, 137, 218, 0.2);
  border-right: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
`;

const JourneyPath = styled.div`
  position: absolute;
  width: 4px;
  height: 70%;
  background: linear-gradient(to bottom, 
    rgba(114, 137, 218, 0.2) 0%, 
    rgba(114, 137, 218, 0.8) ${props => props.progress || 0}%, 
    rgba(114, 137, 218, 0.2) ${props => props.progress || 0}%, 
    rgba(114, 137, 218, 0.2) 100%);
  border-radius: 2px;
  z-index: 1;
`;

const JourneyStep = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  padding: 1rem 0;
  opacity: ${props => props.active ? 1 : props.passed ? 0.8 : 0.5};
  transform: ${props => props.active ? 'scale(1.05)' : 'scale(1)'};
  filter: ${props => props.active ? 'drop-shadow(0 0 8px rgba(114, 137, 218, 0.5))' : 'none'};
  transition: all 0.3s ease;
  z-index: 2;
  animation: ${props => props.active ? fadeInAnimation : 'none'} 0.5s ease-out;
`;

const JourneyIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${props => props.active ? 'linear-gradient(135deg, #7289da 0%, #5865f2 100%)' : 'rgba(114, 137, 218, 0.2)'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: white;
  margin-right: 10px;
  border: 2px solid ${props => props.active ? 'rgba(255, 255, 255, 0.8)' : 'rgba(114, 137, 218, 0.3)'};
  box-shadow: ${props => props.active ? '0 0 15px rgba(114, 137, 218, 0.7)' : 'none'};
  animation: ${props => props.active ? glowPulse : 'none'} 2s infinite ease-in-out;
  z-index: 3;
`;

const JourneyText = styled.div`
  flex: 1;
  text-align: left;
`;

const JourneyTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
`;

const JourneySubtitle = styled.div`
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 0.2rem;
`;

const RegisterForm = styled.form`
  background: rgba(30, 39, 73, 0.6);
  padding: 2.5rem;
  border-radius: 0 12px 12px 0;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(114, 137, 218, 0.3);
  width: 400px;
  max-width: 90%;
  color: ${theme.colors.text};
  box-shadow: 0 8px 32px rgba(14, 21, 47, 0.3), 
              0 0 0 1px rgba(114, 137, 218, 0.1), 
              inset 0 1px 1px rgba(255, 255, 255, 0.05),
              0 0 15px rgba(100, 220, 255, 0.2);
  text-align: center;
  transition: box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 8px 32px rgba(14, 21, 47, 0.4), 
                0 0 0 1px rgba(114, 137, 218, 0.2), 
                inset 0 1px 1px rgba(255, 255, 255, 0.1),
                0 0 20px rgba(100, 220, 255, 0.3);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin: 1rem 0;
  background: rgba(20, 27, 56, 0.6);
  border: 1px solid rgba(114, 137, 218, 0.3);
  border-radius: 8px;
  color: ${theme.colors.text};
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;

  &:focus {
    outline: none;
    border-color: rgba(114, 137, 218, 0.8);
    box-shadow: 0 0 10px rgba(114, 137, 218, 0.3);
    transform: translateY(-2px);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.8rem;
  background: linear-gradient(to right, #7F00FF, #E100FF);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: bold;
  margin-top: 1.5rem;
  transition: transform 0.2s, box-shadow 0.3s;
  box-shadow: 0 4px 12px rgba(127, 0, 255, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(127, 0, 255, 0.6);
    background: linear-gradient(to right, #8F00FF, #F100FF);
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const AuthTitle = styled.h2`
  font-size: 2rem;
  color: white;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
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
  right: 8rem;
  background: ${theme.colors.primary};
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
    background: ${theme.colors.accent};
    transform: translateY(-2px);
  }
`;

const ThemeToggle = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  color: white;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1001;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: rotate(30deg);
  }
`;

const MicroCopy = styled.p`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  
  &::before {
    content: '🚀';
    font-size: 0.9rem;
  }
`;

const UserCount = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &::before {
    content: '👥';
  }
`;

const Register = () => {
  const { login, isAuthenticated } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [darkMode, setDarkMode] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [parallaxX, setParallaxX] = useState(0);
  const [parallaxY, setParallaxY] = useState(0);
  const [currentJourneyStep, setCurrentJourneyStep] = useState(1);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  
  // Create shooting stars at random positions
  const [shootingStars, setShootingStars] = useState([]);
  
  // Journey steps data - keeping only the first three
  const journeySteps = [
    {
      icon: '🌍',
      title: 'Earth',
      subtitle: 'Start Your Journey',
      step: 1
    },
    {
      icon: '🚀',
      title: 'Rocket Launch',
      subtitle: 'Create Your Account',
      step: 2
    },
    {
      icon: '🌠',
      title: 'Enter Orbit',
      subtitle: 'Set Goals',
      step: 3
    }
  ];

  useEffect(() => {
    // Set journey step based on form step
    if (step === 1) {
      setCurrentJourneyStep(1);
    } else if (username && email && !password) {
      setCurrentJourneyStep(2);
    }
  }, [step, username, email, password]);
  
  useEffect(() => {
    // Create random shooting stars
    const createShootingStars = () => {
      const stars = [];
      for (let i = 0; i < 5; i++) {
        stars.push({
          id: i,
          top: `${Math.random() * 70}%`,
          left: `${Math.random() * 100}%`,
          size: `${Math.random() * 3 + 1}px`,
          animationDuration: `${Math.random() * 3 + 2}s`
        });
      }
      setShootingStars(stars);
    };
    
    createShootingStars();
    const interval = setInterval(createShootingStars, 5000);
    
    // Add parallax effect
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        setParallaxX((x - 0.5) * 20); // Move up to 20px
        setParallaxY((y - 0.5) * 20); // Move up to 20px
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  if (isAuthenticated) {
    navigate('/dashboard');
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (username && email) {
        setStep(2);
        setCurrentJourneyStep(2); // Move to rocket launch step
        return;
      } else {
        alert("Please fill out all fields!");
        return;
      }
    }
    
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    
    if (username && email && password) {
      // Show confetti
      setShowConfetti(true);
      setCurrentJourneyStep(3); // Move to enter orbit step
      
      // Delay navigation to show success animation
      setTimeout(() => {
        login();
        navigate('/dashboard');
      }, 2000);
    }
  };
  
  // Calculate journey progress percentage
  const calculateProgress = () => {
    const totalSteps = journeySteps.length;
    const completedSteps = currentJourneyStep - 1;
    return (completedSteps / (totalSteps - 1)) * 100;
  };
  
  // Create confetti pieces for animation
  const renderConfetti = () => {
    if (!showConfetti) return null;
    
    const confettiPieces = [];
    const colors = ['#7F00FF', '#E100FF', '#00FFFF', '#FFFF00', '#FF00FF'];
    
    for (let i = 0; i < 100; i++) {
      const left = `${Math.random() * 100}%`;
      const delay = Math.random() * 1.5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      confettiPieces.push(
        <Confetti 
          key={i} 
          style={{ left, top: '50%' }} 
          color={color} 
          delay={delay} 
        />
      );
    }
    
    return confettiPieces;
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

  // Optional: Google SVG Icon (if you want to use an inline SVG)
  const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-1 7.28-2.69l-3.57-2.77c-.99.69-2.26 1.1-3.71 1.1-2.87 0-5.3-1.94-6.16-4.54H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.66-2.06z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.86-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );

  return (
    <>
      {/* [Previous background and decoration components remain the same] */}
      <Background>
        {/* Gradient Overlay */}
        <GradientOverlay />
        
        {/* Mountain Scenery */}
        <Scenery />
        
        {/* Stars with parallax effect */}
        <StarLayer offsetX={parallaxX * 0.5} offsetY={parallaxY * 0.5}>
          <Star size="20px" style={{ top: '10%', left: '10%' }} duration="4s" delay="0.5s" />
          <Star size="15px" style={{ top: '25%', left: '25%' }} duration="3s" delay="1s" />
          <Star size="25px" style={{ top: '15%', right: '30%' }} duration="5s" delay="0.2s" />
        </StarLayer>
        
        <StarLayer offsetX={parallaxX * 0.8} offsetY={parallaxY * 0.8}>
          <Star size="18px" style={{ top: '35%', right: '55%' }} duration="4.5s" delay="0.7s" />
          <Star size="12px" style={{ top: '60%', left: '35%' }} duration="3.5s" delay="1.2s" />
        </StarLayer>
        
        {/* Shooting Stars */}
        <StarLayer offsetX={parallaxX * 0.3} offsetY={parallaxY * 0.3}>
          {shootingStars.map(star => (
            <ShootingStar 
              key={star.id}
              size={star.size}
              style={{
                top: star.top,
                left: star.left,
                animationDuration: star.animationDuration
              }}
            />
          ))}
        </StarLayer>
        
        {/* Rocket with animation */}
        <StarLayer offsetX={parallaxX * 1.2} offsetY={parallaxY * 1.2}>
          <Rocket>
            <RocketTrail />
          </Rocket>
        </StarLayer>
        
        {/* Achievement Badge */}
        <StarLayer offsetX={parallaxX * 0.6} offsetY={parallaxY * 0.6}>
          <AchievementBadge />
        </StarLayer>
        
        {/* Progress Circle */}
        <StarLayer offsetX={parallaxX * 0.9} offsetY={parallaxY * 0.9}>
          <ProgressCircle />
        </StarLayer>
        
        {/* XP Orbs */}
        <StarLayer offsetX={parallaxX * 1.5} offsetY={parallaxY * 1.5}>
          <XPOrb style={{ top: '65%', left: '15%' }} duration="6s" delay="0.2s" />
          <XPOrb style={{ top: '30%', right: '25%' }} duration="5s" delay="1.2s" />
          <XPOrb style={{ top: '75%', right: '30%' }} duration="7s" delay="0.5s" />
          <XPOrb style={{ top: '45%', left: '60%' }} duration="5.5s" delay="1.5s" />
        </StarLayer>
      </Background>

      {/* Register Form with Journey Panel */}
      <RegisterContainer ref={containerRef}>
        {/* Confetti animation */}
        {renderConfetti()}
        
        <HomeButton to="/">Home</HomeButton>
        <ThemeToggle onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '☀️' : '🌙'}
        </ThemeToggle>
        
        {/* Journey Panel */}
        <JourneyPanel>
          <JourneyPath progress={calculateProgress()} />
          
          {journeySteps.map((journeyStep, index) => (
            <JourneyStep 
              key={index}
              active={currentJourneyStep === journeyStep.step}
              passed={currentJourneyStep > journeyStep.step}
            >
              <JourneyIcon active={currentJourneyStep >= journeyStep.step}>
                {journeyStep.icon}
              </JourneyIcon>
              <JourneyText>
                <JourneyTitle>{journeyStep.title}</JourneyTitle>
                <JourneySubtitle>{journeyStep.subtitle}</JourneySubtitle>
              </JourneyText>
            </JourneyStep>
          ))}
        </JourneyPanel>
        
        {/* Registration Form */}
        <RegisterForm onSubmit={handleSubmit}>
          <AuthTitle>
            Register
            <span>🚀</span>
          </AuthTitle>
          <AuthSubtitle>Start your galactic journey today</AuthSubtitle>
          
          {step === 1 ? (
            <>
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
              <Button type="submit">Continue to Launch <span>→</span></Button>
            </>
          ) : (
            <>
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
              <MicroCopy>Unlock achievements and explore new worlds!</MicroCopy>
              <Button type="submit">
                <span>🚀</span> Launch Your Journey
              </Button>
            </>
          )}
          
          <AuthLink to="/login">Already have an account? Login here</AuthLink>
        </RegisterForm>
        
        <UserCount>Join 10,000+ Space Explorers!</UserCount>
      </RegisterContainer>
    </>
  );
};

export default Register;