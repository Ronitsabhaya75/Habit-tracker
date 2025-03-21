<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
=======
/**
 * Home Component
 *
 * This file implements the Home component for the LevelUp application.
 * It serves as the landing page, introducing users to the platform's features.
 *
 * Features included:
 *  - A hero section with a title, description, and a call-to-action button.
 *  - A grid layout displaying key features of the application.
 *  - Responsive design ensuring a seamless experience across devices.
 *
 * The component utilizes:
 *  - styled-components for CSS-in-JS styling.
 *  - React Router's Link component for navigation.
 *  - Theme-based colors and styles for consistency.
 *  - Grid and flexbox techniques for an adaptive layout.
 *
 * The goal of this component is to engage users, encourage sign-ups,
 * and provide an overview of how the platform gamifies habit tracking.
 */

import React from 'react';
import styled, { keyframes } from 'styled-components';
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
import { Link } from 'react-router-dom';
import { theme } from '../theme';

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

<<<<<<< HEAD
const blinkStar = keyframes`
  0% { opacity: 0.1; }
  50% { opacity: 1; }
  100% { opacity: 0.1; }
`;

=======
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
const slowRotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

<<<<<<< HEAD
const rocketMovement = keyframes`
  0% { transform: translateX(0) translateY(0) rotate(45deg); }
  25% { transform: translateX(15px) translateY(-10px) rotate(40deg); }
  50% { transform: translateX(0) translateY(-15px) rotate(45deg); }
  75% { transform: translateX(-15px) translateY(-10px) rotate(50deg); }
  100% { transform: translateX(0) translateY(0) rotate(45deg); }
`;

=======
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
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

<<<<<<< HEAD
const ctaPulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 rgba(255, 165, 0, 0.4); }
  70% { transform: scale(1.05); box-shadow: 0 0 10px rgba(255, 165, 0, 0.4); }
  100% { transform: scale(1); box-shadow: 0 0 0 rgba(255, 165, 0, 0); }
`;

const iconGlow = keyframes`
  0% { filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.5)); }
  50% { filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.8)); }
  100% { filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.5)); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const countUp = keyframes`
  from { content: "0"; }
  to { content: "10,000+"; }
`;

// **BACKGROUND with PARALLAX**
const Background = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background: ${props => props.darkMode 
    ? `linear-gradient(135deg, #111827 0%, #0f172a 100%)`
    : `linear-gradient(135deg, #2b3a67 0%, #1a2233 100%)`};
  overflow: hidden;
  perspective: 1000px;
  z-index: 0;
  transition: background 0.5s ease;
=======
// **BACKGROUND**
const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #2b3a67 0%, #1a2233 100%);
  overflow: hidden;
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
`;

// Gradient Overlay
const GradientOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
<<<<<<< HEAD
  background: ${props => props.darkMode
    ? `radial-gradient(circle at 30% 50%, rgba(79, 70, 229, 0.15) 0%, transparent 70%),
        radial-gradient(circle at 70% 70%, rgba(79, 70, 229, 0.1) 0%, transparent 60%)`
    : `radial-gradient(circle at 30% 50%, rgba(114, 137, 218, 0.15) 0%, transparent 70%),
        radial-gradient(circle at 70% 70%, rgba(90, 128, 244, 0.1) 0%, transparent 60%)`};
  z-index: 1;
  transition: background 0.5s ease;
`;

// Parallax Layers
const ParallaxLayer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  transform: translateZ(${props => props.depth}px) scale(${props => 1 + Math.abs(props.depth)/1000});
  z-index: ${props => Math.floor(10 - Math.abs(props.depth/10))};
=======
  background: radial-gradient(circle at 30% 50%, rgba(114, 137, 218, 0.15) 0%, transparent 70%),
              radial-gradient(circle at 70% 70%, rgba(90, 128, 244, 0.1) 0%, transparent 60%);
  z-index: 1;
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
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
<<<<<<< HEAD
  animation: ${props => props.blink 
    ? css`${blinkStar} ${props.blinkDuration || '7s'} infinite`
    : css`${starGlow} ${props.duration || '3s'} infinite ease-in-out`};
=======
  animation: ${starGlow} ${props => props.duration || '3s'} infinite ease-in-out;
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
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
<<<<<<< HEAD
=======
  animation: ${floatAnimation} 8s infinite ease-in-out;
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
  transform-origin: center center;
  
  &::before {
    content: '🚀';
    position: absolute;
    font-size: 28px;
<<<<<<< HEAD
    animation: ${rocketMovement} 12s infinite ease-in-out;
=======
    transform: rotate(45deg);
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
  }
`;

// Rocket Trail
const RocketTrail = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
<<<<<<< HEAD
  width: 100px;
=======
  width: 80px;
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
  height: 8px;
  background: linear-gradient(90deg, rgba(100, 220, 255, 0) 0%, rgba(100, 220, 255, 0.7) 100%);
  border-radius: 4px;
  z-index: 2;
  opacity: 0.5;
  filter: blur(2px);
  transform: translateX(-80px);
<<<<<<< HEAD
  animation: ${trailAnimation} 1.5s infinite;
=======
  animation: ${trailAnimation} 2s infinite;
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
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

// **HOME COMPONENT**
const HomeContainer = styled.div`
  min-height: 100vh;
  position: relative;
<<<<<<< HEAD
  color: ${props => props.darkMode ? theme.colors.textDark : theme.colors.text};
  padding: 2rem;
  background: transparent;
  z-index: 1;
=======
  color: ${theme.colors.text};
  padding: 2rem;
  background: transparent; /* Remove purple gradient */
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
`;

const HeroSection = styled.div`
  text-align: center;
  padding: 4rem 0;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
<<<<<<< HEAD
  animation: ${fadeIn} 1s ease-out;
=======
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  line-height: 1.2;
<<<<<<< HEAD
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
=======
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
`;

const CTAButton = styled(Link)`
  background: ${theme.colors.secondary};
  color: ${theme.colors.text};
  padding: 1rem 2rem;
  border-radius: 30px;
  text-decoration: none;
  font-weight: bold;
<<<<<<< HEAD
  display: inline-flex;
  align-items: center;
  margin: 1rem 0;
  animation: ${ctaPulse} 2s infinite;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: scale(1.05) translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
  }
`;

const ButtonIcon = styled.span`
  margin-left: 10px;
  font-size: 1.2rem;
`;

const CTASubtext = styled.p`
  font-size: 0.9rem;
  margin-top: 0.5rem;
  opacity: 0.8;
  font-style: italic;
`;

=======
  display: inline-block;
  margin: 1rem 0;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 4rem auto;
  position: relative;
  z-index: 10;
<<<<<<< HEAD
  animation: ${fadeIn} 1s ease-out;
  animation-delay: 0.2s;
  opacity: 0;
  animation-fill-mode: forwards;
`;

const FeatureCard = styled.div`
  background: ${props => props.darkMode 
    ? 'rgba(17, 24, 39, 0.7)' 
    : theme.colors.glassWhite};
=======
`;

const FeatureCard = styled.div`
  background: ${theme.colors.glassWhite};
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  backdrop-filter: blur(5px);
<<<<<<< HEAD
  border: 1px solid ${props => props.darkMode 
    ? 'rgba(55, 65, 81, 0.5)' 
    : theme.colors.borderWhite};
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  transition: transform 0.3s;
  
  &:hover {
    transform: scale(1.2);
    animation: ${iconGlow} 2s infinite;
  }
=======
  border: 1px solid ${theme.colors.borderWhite};
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin: 1rem 0;
`;

const FeatureText = styled.p`
  opacity: 0.9;
  line-height: 1.6;
`;

<<<<<<< HEAD
const NavBar = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 1rem;
  z-index: 1001;
`;

const LoginButton = styled(Link)`
  background: ${props => props.darkMode 
    ? 'rgba(79, 70, 229, 0.8)' 
    : theme.colors.primary};
  color: #FFFFFF;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  text-decoration: none;
  display: flex;
  align-items: center;

  &:hover {
    background: ${theme.colors.accent};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const HomeButton = styled(Link)`
  background: ${props => props.darkMode 
    ? 'rgba(79, 70, 229, 0.8)' 
    : theme.colors.primary};
  color: #FFFFFF;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  text-decoration: none;
  display: flex;
  align-items: center;

  &:hover {
    background: ${theme.colors.accent};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const DarkModeToggle = styled.button`
  background: ${props => props.darkMode 
    ? '#374151' 
    : '#f3f4f6'};
  color: ${props => props.darkMode 
    ? '#f3f4f6' 
    : '#374151'};
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

// Testimonials Section
const TestimonialsSection = styled.div`
  max-width: 1000px;
  margin: 4rem auto;
  position: relative;
  z-index: 10;
  animation: ${fadeIn} 1s ease-out;
  animation-delay: 0.4s;
  opacity: 0;
  animation-fill-mode: forwards;
`;

const TestimonialsTitle = styled.h2`
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const TestimonialCard = styled.div`
  background: ${props => props.darkMode 
    ? 'rgba(17, 24, 39, 0.7)' 
    : 'rgba(255, 255, 255, 0.1)'};
  padding: 1.5rem;
  border-radius: 10px;
  backdrop-filter: blur(5px);
  border: 1px solid ${props => props.darkMode 
    ? 'rgba(55, 65, 81, 0.5)' 
    : 'rgba(255, 255, 255, 0.2)'};
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const Quote = styled.p`
  font-style: italic;
  line-height: 1.6;
  margin-bottom: 1rem;
  
  &::before {
    content: '"';
    font-size: 1.5rem;
    color: ${theme.colors.secondary};
  }
  
  &::after {
    content: '"';
    font-size: 1.5rem;
    color: ${theme.colors.secondary};
  }
`;

const QuoteAuthor = styled.p`
  text-align: right;
  font-weight: bold;
  
  &::before {
    content: '— ';
  }
`;

// Stats Section
const StatsSection = styled.div`
  background: ${props => props.darkMode 
    ? 'rgba(17, 24, 39, 0.7)' 
    : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 15px;
  padding: 1.5rem;
  max-width: 600px;
  margin: 0 auto 4rem;
  backdrop-filter: blur(5px);
  border: 1px solid ${props => props.darkMode 
    ? 'rgba(55, 65, 81, 0.5)' 
    : 'rgba(255, 255, 255, 0.2)'};
  text-align: center;
  position: relative;
  z-index: 10;
  animation: ${fadeIn} 1s ease-out;
  animation-delay: 0.6s;
  opacity: 0;
  animation-fill-mode: forwards;
`;

const StatsTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const UserCount = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${theme.colors.secondary};
  margin: 1rem 0;
  position: relative;
  
  &::after {
    content: "+";
    font-size: 1.5rem;
    position: absolute;
    top: 0;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  background: rgba(100, 100, 100, 0.2);
  border-radius: 5px;
  overflow: hidden;
  margin: 1rem 0;
  
  &::after {
    content: '';
    display: block;
    width: 75%;
    height: 100%;
    background: linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.secondary});
    border-radius: 5px;
    animation: ${fadeIn} 2s ease-out;
  }
`;

const StatsText = styled.p`
  opacity: 0.9;
`;

const Home = () => {
  // State for dark mode toggle
  const [darkMode, setDarkMode] = useState(false);
  
  // State for parallax effect
  const [scrollY, setScrollY] = useState(0);
  
  // State for user login simulation
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  
  // State for user count with animation
  const [userCount, setUserCount] = useState(0);
  
  // Ref for parallax container
  const parallaxRef = useRef(null);

  // User count animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setUserCount(prevCount => {
        if (prevCount < 10000) {
          return prevCount + Math.floor(Math.random() * 500);
        } else {
          clearInterval(interval);
          return 10000;
        }
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  // Parallax effect when scrolling
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Simulate login status with 30% probability
    const randomLogin = Math.random() < 0.3;
    if (randomLogin) {
      setIsLoggedIn(true);
      const names = ['Alex', 'Jamie', 'Taylor', 'Jordan', 'Casey'];
      setUsername(names[Math.floor(Math.random() * names.length)]);
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Toggle dark mode function
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Testimonial quotes data
  const testimonials = [
    {
      quote: "LevelUp transformed my life. I've built consistent workout habits and achieved fitness goals I never thought possible!",
      author: "Sarah K."
    },
    {
      quote: "The gamification makes habit-building fun. I look forward to earning achievements and leveling up every day.",
      author: "Michael T."
    },
    {
      quote: "I've tried many habit apps, but the community and support here keeps me motivated like nothing else.",
      author: "Jamie L."
    }
  ];

  return (
    <>
      {/* Background with Parallax */}
      <Background darkMode={darkMode} ref={parallaxRef}>
        <GradientOverlay darkMode={darkMode} />
        
        <ParallaxLayer depth={-50} style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
          <Star size="30px" style={{ top: '5%', left: '7%' }} duration="5s" delay="0.2s" blink blinkerDuration="11s" />
          <Star size="20px" style={{ top: '12%', left: '25%' }} duration="4s" delay="0.5s" />
          <Star size="25px" style={{ top: '8%', right: '15%' }} duration="6s" delay="1s" blink blinkerDuration="9s" />
          <Star size="15px" style={{ top: '20%', right: '30%' }} duration="3s" delay="0.7s" />
        </ParallaxLayer>
        
        <ParallaxLayer depth={-30} style={{ transform: `translateY(${scrollY * 0.05}px)` }}>
          <Rocket>
            <RocketTrail />
          </Rocket>
          <AchievementBadge />
        </ParallaxLayer>
        
        <ParallaxLayer depth={-10} style={{ transform: `translateY(${scrollY * 0.02}px)` }}>
          <ProgressCircle />
          <XPOrb style={{ top: '65%', left: '15%' }} duration="6s" delay="0.2s" />
          <XPOrb style={{ top: '30%', right: '25%' }} duration="5s" delay="1.2s" />
          <XPOrb style={{ top: '75%', right: '30%' }} duration="7s" delay="0.5s" />
          <XPOrb style={{ top: '45%', left: '60%' }} duration="5.5s" delay="1.5s" />
        </ParallaxLayer>
        
        <ParallaxLayer depth={0}>
          <Scenery />
        </ParallaxLayer>
      </Background>

      {/* Home Content */}
      <HomeContainer darkMode={darkMode}>
        <NavBar>
          <DarkModeToggle 
            onClick={toggleDarkMode} 
            darkMode={darkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? '☀️' : '🌙'}
          </DarkModeToggle>
          <HomeButton to="/" darkMode={darkMode}>
            <span style={{ marginRight: '5px' }}>🏠</span> Home
          </HomeButton>
          {isLoggedIn ? (
            <LoginButton as="div" darkMode={darkMode}>
              <span style={{ marginRight: '5px' }}>👋</span> Welcome, {username}!
            </LoginButton>
          ) : (
            <LoginButton to="/login" darkMode={darkMode}>
              <span style={{ marginRight: '5px' }}>🔑</span> Login
            </LoginButton>
          )}
        </NavBar>
        
        <HeroSection>
          <Title>Level Up Your Life</Title>
          <Subtitle>
            Transform your daily habits into an epic journey of self-improvement.
            Track progress, earn rewards, and breakthrough your limitations!
          </Subtitle>
          <CTAButton to="/register">
            Begin Your Journey
            <ButtonIcon>➡️</ButtonIcon>
          </CTAButton>
          <CTASubtext>Start building habits today and level up your life!</CTASubtext>
        </HeroSection>

        <StatsSection darkMode={darkMode}>
          <StatsTitle>Join Our Community of Achievers</StatsTitle>
          <UserCount>{userCount.toLocaleString()}</UserCount>
          <StatsText>users already leveling up daily!</StatsText>
          <ProgressBar />
          <StatsText>Daily active users growing 15% month over month</StatsText>
        </StatsSection>

        <FeaturesGrid>
          <FeatureCard darkMode={darkMode}>
            <FeatureIcon>🎮</FeatureIcon>
            <FeatureTitle>Breakthrough Game</FeatureTitle>
            <FeatureText>
              Turn your habit-building journey into an engaging game.
              Complete challenges, earn points, and unlock achievements.
            </FeatureText>
          </FeatureCard>

          <FeatureCard darkMode={darkMode}>
            <FeatureIcon>📈</FeatureIcon>
            <FeatureTitle>Track Progress</FeatureTitle>
            <FeatureText>
              Monitor your habits with beautiful visualizations
              and detailed statistics to stay motivated.
            </FeatureText>
          </FeatureCard>

          <FeatureCard darkMode={darkMode}>
            <FeatureIcon>🏆</FeatureIcon>
            <FeatureTitle>Earn Rewards</FeatureTitle>
            <FeatureText>
              Level up and unlock real achievements as you
              build better habits and transform your life.
            </FeatureText>
          </FeatureCard>

          <FeatureCard darkMode={darkMode}>
            <FeatureIcon>👥</FeatureIcon>
            <FeatureTitle>Community</FeatureTitle>
            <FeatureText>
              Join a supportive community of people on their own
              transformation journeys. Share tips and celebrate wins!
            </FeatureText>
          </FeatureCard>
        </FeaturesGrid>
        
        {/* <TestimonialsSection>
          <TestimonialsTitle>What Our Users Say</TestimonialsTitle>
          <TestimonialsGrid>
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} darkMode={darkMode}>
                <Quote>{testimonial.quote}</Quote>
                <QuoteAuthor>{testimonial.author}</QuoteAuthor>
              </TestimonialCard>
            ))}
          </TestimonialsGrid>
        </TestimonialsSection> */}
=======
const Home = () => {
  return (
    <>
      {/* Background with Stars */}
      <Background>
        <GradientOverlay />
        <Scenery />
        <Star size="20px" style={{ top: '10%', left: '10%' }} duration="4s" delay="0.5s" />
        <Star size="15px" style={{ top: '25%', left: '25%' }} duration="3s" delay="1s" />
        <Star size="25px" style={{ top: '15%', right: '30%' }} duration="5s" delay="0.2s" />
        <Rocket>
          <RocketTrail />
        </Rocket>
        <AchievementBadge />
        <ProgressCircle />
        <XPOrb style={{ top: '65%', left: '15%' }} duration="6s" delay="0.2s" />
        <XPOrb style={{ top: '30%', right: '25%' }} duration="5s" delay="1.2s" />
        <XPOrb style={{ top: '75%', right: '30%' }} duration="7s" delay="0.5s" />
        <XPOrb style={{ top: '45%', left: '60%' }} duration="5.5s" delay="1.5s" />
      </Background>

      {/* Home Content */}
      <HomeContainer>
        <HeroSection>
          <Title>Level Up</Title>
          <Subtitle>
            Turn your daily habits into an engaging game. Track progress, earn
            <br />
            XP, unlock achievements, and build lasting habits while having fun!
          </Subtitle>
          {/* Keep the "Get Started" button */}
          <CTAButton to="/register">Get Started</CTAButton>
        </HeroSection>

        <FeaturesGrid>
          <FeatureCard>
            <FeatureTitle>Track Progress</FeatureTitle>
            <FeatureText>
              Monitor your habits with beautiful
              <br />
              visualizations and stats
            </FeatureText>
          </FeatureCard>

          <FeatureCard>
            <FeatureTitle>Earn Rewards</FeatureTitle>
            <FeatureText>
              Level up and unlock achievements as you
              <br />
              build better habits
            </FeatureText>
          </FeatureCard>

          <FeatureCard>
            <FeatureTitle>Stay Motivated</FeatureTitle>
            <FeatureText>
              Join a community of people building better
              <br />
              habits together
            </FeatureText>
          </FeatureCard>
        </FeaturesGrid>
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
      </HomeContainer>
    </>
  );
};

<<<<<<< HEAD
export default Home;
=======
export default Home;
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
