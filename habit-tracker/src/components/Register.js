// NEW REGISTER

import React, { useState, useContext, useEffect, useRef, useMemo, useCallback } from 'react';
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../components/firebase';
import styled, { keyframes, css, createGlobalStyle } from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { theme } from '../theme';
import AuthContext from '../context/AuthContext';

// Global style with consistent fonts - Always dark modes
const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&family=Poppins:wght@300;400;500;600&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  transition: background 0.3s ease, color 0.3s ease;
}

html, body {
  overflow-x: hidden;
  background: #0e0e1a;
  margin: 0;
  padding: 0;
  min-height: 100%;
  height: 100%;
  font-family: 'Poppins', sans-serif;
  color: #ffffff;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Orbitron', sans-serif;
}

button {
  font-family: 'Orbitron', sans-serif;
}

#root {
  height: 100%;
}
`;

// **ENHANCED ANIMATIONS**
const floatAnimation = keyframes`
0% { transform: translate3d(0, 0, 0); }
50% { transform: translate3d(0, -15px, 0); }
100% { transform: translate3d(0, 0, 0); }
`;

const starGlow = keyframes`
0% { opacity: 0.6; transform: scale(1); }
50% { opacity: 1; transform: scale(1.2); }
100% { opacity: 0.6; transform: scale(1); }
`;

const slowRotate = keyframes`
from { transform: rotate3d(0, 0, 1, 0deg); }
to { transform: rotate3d(0, 0, 1, 360deg); }
`;

const pulseGlow = keyframes`
0% { transform: scale3d(1, 1, 1); opacity: 0.6; box-shadow: 0 0 5px rgba(0, 255, 204, 0.5); }
50% { transform: scale3d(1.05, 1.05, 1); opacity: 0.8; box-shadow: 0 0 15px rgba(0, 255, 204, 0.8); }
100% { transform: scale3d(1, 1, 1); opacity: 0.6; box-shadow: 0 0 5px rgba(0, 255, 204, 0.5); }
`;

const fadeInAnimation = keyframes`
from { opacity: 0; transform: translate3d(0, 10px, 0); }
to { opacity: 1; transform: translate3d(0, 0, 0); }
`;

// Green glow for buttons
const buttonGlowPulse = keyframes`
0%, 100% { box-shadow: 0 0 15px #00ffc8; }
50% { box-shadow: 0 0 25px #00ffc8, 0 0 40px rgba(0, 255, 200, 0.4); }
`;

const shootingStarAnimation = keyframes`
0% { 
  transform: translateX(-100%) translateY(-100%); 
  opacity: 0;
}
10% { 
  opacity: 1; 
}
70% { 
  opacity: 1; 
}
100% { 
  transform: translateX(200%) translateY(200%); 
  opacity: 0;
}
`;

const galaxyRotate = keyframes`
0% { transform: rotate(0deg); }
100% { transform: rotate(360deg); }
`;

const twinkleAnimation = keyframes`
0%, 100% { opacity: 0.1; }
50% { opacity: 1; }
`;

const rocketLaunchAnimation = keyframes`
0% { transform: translate3d(0, 0, 0) rotate(45deg); }
10% { transform: translate3d(0, -5px, 0) rotate(45deg); opacity: 1; }
15% { transform: translate3d(0, 0, 0) rotate(45deg); opacity: 1; }
30% { transform: translate3d(0, -10px, 0) rotate(45deg); opacity: 1; }
35% { transform: translate3d(0, -5px, 0) rotate(45deg); opacity: 1; }
50% { transform: translate3d(0, -15px, 0) rotate(45deg); opacity: 1; }
100% { transform: translate3d(0, -1000px, 0) rotate(45deg); opacity: 0; }
`;

const hyperspaceAnimation = keyframes`
0% { transform: scale(1); filter: brightness(1); }
50% { transform: scale(1.5); filter: brightness(1.5); }
100% { transform: scale(2); filter: brightness(2); opacity: 0; }
`;

const focusGlowAnimation = keyframes`
0% { box-shadow: 0 0 0 rgba(0, 255, 200, 0.5); }
50% { box-shadow: 0 0 10px rgba(0, 255, 200, 0.8); }
100% { box-shadow: 0 0 0 rgba(0, 255, 200, 0.5); }
`;

const invalidShakeAnimation = keyframes`
0%, 100% { transform: translateX(0); }
20%, 60% { transform: translateX(-5px); }
40%, 80% { transform: translateX(5px); }
`;

const confettiAnimation = keyframes`
0% { transform: translateY(0) rotate(0deg); opacity: 1; }
100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
`;

// New animation for input scanning effect
const scanningAnimation = keyframes`
0% { background-position: 0% 0%; }
50% { background-position: 100% 0%; }
100% { background-position: 0% 0%; }
`;

// New animation for the rocket trail on button hover
const rocketTrailAnimation = keyframes`
0% { width: 0; opacity: 0; }
50% { width: 20px; opacity: 0.8; }
100% { width: 0; opacity: 0; }
`;

// ErrorMessage component
const ErrorMessage = styled.div`
color: #ff4d4d;
background: rgba(255, 77, 77, 0.1);
border: 1px solid rgba(255, 77, 77, 0.3);
padding: 10px;
border-radius: 8px;
margin-bottom: 15px;
text-align: center;
backdrop-filter: blur(4px);
animation: ${fadeInAnimation} 0.5s ease-out;
`;

// **ENHANCED BACKGROUND WITH GALAXY EFFECT AND NEBULA FOG**
const Background = styled.div`
position: fixed;
top: 0;
left: 0;
width: 100vw;
height: 100vh;
background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #1a2233 100%);
overflow: hidden;
will-change: transform;
margin: 0;
padding: 0;
transition: background 0.5s ease;

&::before {
  content: '';
  position: absolute;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
  background-image: radial-gradient(2px 2px at 40px 60px, #ffffff 100%, transparent),
    radial-gradient(2px 2px at 20px 50px, #ffffff 100%, transparent),
    radial-gradient(2px 2px at 30px 100px, #ffffff 100%, transparent),
    radial-gradient(2px 2px at 40px 60px, #ffffff 100%, transparent),
    radial-gradient(2px 2px at 110px 90px, #ffffff 100%, transparent),
    radial-gradient(2px 2px at 190px 150px, #ffffff 100%, transparent);
  background-repeat: repeat;
  background-size: 200px 200px;
  opacity: 0.3;
  animation: ${galaxyRotate} 240s linear infinite;
  z-index: 1;
}
`;

// Galaxy Cloud Overlay with added nebula fog
const GalaxyCloud = styled.div`
position: absolute;
width: 100%;
height: 100%;
background: radial-gradient(ellipse at 20% 30%, rgba(0, 255, 200, 0.15) 0%, transparent 70%),
  radial-gradient(ellipse at 60% 70%, rgba(0, 255, 200, 0.2) 0%, transparent 70%),
  radial-gradient(ellipse at 80% 20%, rgba(0, 255, 200, 0.2) 0%, transparent 70%);
z-index: 2;
pointer-events: none;
transition: background 0.5s ease;
`;

// Twinkling Stars
const TwinklingStar = styled.div`
position: absolute;
background-color: white;
border-radius: 50%;
z-index: 2;
animation: ${twinkleAnimation} ${props => props.duration || '3s'} infinite ease-in-out;
animation-delay: ${props => props.delay || '0s'};
width: ${props => props.size || '2px'};
height: ${props => props.size || '2px'};
opacity: ${props => props.opacity || 0.7};
top: ${props => props.top};
left: ${props => props.left};
box-shadow: 0 0 ${props => parseInt(props.size) * 2 || '4px'} ${props => parseInt(props.size) / 2 || '1px'} rgba(255, 255, 255, 0.8);
`;

// Shooting Stars
const ShootingStar = styled.div`
position: absolute;
top: ${props => props.top || '10%'};
left: 0;
width: 100px;
height: 2px;
background: linear-gradient(to right, transparent, white, transparent);
transform-origin: left center;
transform: rotate(${props => props.rotation || '45deg'});
animation: ${shootingStarAnimation} ${props => props.duration || '3s'} linear;
animation-delay: ${props => props.delay || '0s'};
z-index: 3;
opacity: 0;

&::after {
  content: '';
  position: absolute;
  top: -1px;
  right: 0;
  width: 15px;
  height: 4px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.7);
}
`;

// Enhanced Scenery with more depth
const Scenery = styled.div`
position: absolute;
bottom: 0;
left: 0;
width: 100%;
height: 40%;
background: linear-gradient(180deg, transparent 0%, rgba(48, 56, 97, 0.2) 100%);
z-index: 3;
transition: background 0.5s ease;

&::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 5%;
  width: 30%;
  height: 80%;
  background: linear-gradient(135deg, #3b4874 20%, #2b3a67 100%);
  clip-path: polygon(0% 100%, 50% 30%, 100% 100%);
  opacity: 0.7;
  transition: background 0.5s ease, opacity 0.5s ease;
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
  opacity: 0.7;
  transition: background 0.5s ease, opacity 0.5s ease;
}
`;

// Enhanced Star
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
will-change: opacity, transform;
filter: blur(1px);

&::before {
  content: '★';
  position: absolute;
  font-size: ${props => parseInt(props.size) * 0.8 || '24px'};
  color: rgba(255, 210, 70, 0.9);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  filter: blur(0.5px);
}
`;

// Interactive Rocket with animations
const Rocket = styled.div`
position: absolute;
top: ${props => props.launching ? '80%' : '30%'};
left: 15%;
width: 50px;
height: 50px;
z-index: 3;
animation: ${props => props.bouncing 
  ? floatAnimation 
  : props.launching 
    ? rocketLaunchAnimation 
    : 'none'} 
  ${props => props.launching ? '2s' : '5s'} 
  ${props => props.launching ? 'ease-out forwards' : 'infinite ease-in-out'};
will-change: transform;
transform: ${props => props.launching ? 'rotate(45deg)' : 'none'};

&::before {
  content: '🚀';
  position: absolute;
  font-size: 28px;
  transform: ${props => props.launching ? 'none' : 'rotate(45deg)'};
  transition: transform 0.3s ease;
}

${props => props.shaking && css`
  animation: ${invalidShakeAnimation} 0.5s ease-in-out;
`}
`;

// Comet Tail effect for the rocket
const CometTail = styled.div`
position: absolute;
top: ${props => props.top};
left: ${props => props.left};
width: 40px;
height: 60px;
background: linear-gradient(to top, 
  rgba(0, 255, 200, 0.8) 0%, 
  rgba(215, 255, 240, 0.4) 60%, 
  transparent 100%);
border-radius: 50% 50% 0 0;
transform: rotate(225deg) scale(0.6);
filter: blur(5px);
opacity: ${props => props.visible ? 0.8 : 0};
transition: opacity 0.5s ease;
z-index: 2;
`;

// Progress Circle with glowing effect
const ProgressCircle = styled.div`
position: absolute;
bottom: 15%;
right: 10%;
width: 80px;
height: 80px;
border-radius: 50%;
border: 3px solid rgba(0, 255, 200, 0.2);
border-top: 3px solid rgba(0, 255, 200, 0.8);
animation: ${slowRotate} 8s linear infinite;
z-index: 2;
will-change: transform;
box-shadow: 0 0 15px rgba(0, 255, 200, 0.3);

&::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  height: 70%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 255, 200, 0.2) 0%, transparent 70%);
}
`;

// Enhanced Confetti with more colors and shapes
const Confetti = styled.div`
position: absolute;
width: ${props => props.size || '10px'};
height: ${props => props.size || '10px'};
background-color: ${props => props.color};
opacity: 0;
z-index: 100;
clip-path: ${props => {
  const shapes = [
    'polygon(50% 0%, 0% 100%, 100% 100%)', // triangle
    'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', // diamond
    'circle(50% at 50% 50%)', // circle
    'none' // square
  ];
  return props.shape ? shapes[props.shape % shapes.length] : 'none';
}};
animation: ${confettiAnimation} 3s ease-in-out forwards;
animation-delay: ${props => props.delay}s;
will-change: transform, opacity;
transform-origin: center center;
`;

// **REGISTER FORM AND JOURNEY PANEL**
const RegisterContainer = styled.div`
display: flex;
align-items: center;
justify-content: center;
min-height: 100vh;
padding: 2rem 0;
position: relative;
z-index: 10;

${props => props.hyperspace && css`
  animation: ${hyperspaceAnimation} 1.5s ease-in-out forwards;
`}
`;

// Enhanced Journey Panel with improved glassmorphism
const JourneyPanel = styled.div`
width: 240px;
height: 400px;
background: rgba(15, 32, 39, 0.3);
backdrop-filter: blur(12px);
border-radius: 12px 0 0 12px;
border: 1px solid rgba(0, 255, 200, 0.1);
border-right: none;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
padding: 2rem 1rem;
box-shadow: -5px 0 20px rgba(0, 0, 0, 0.2), 0 0 15px rgba(0, 255, 200, 0.1);
position: relative;
overflow: hidden;
transition: all 0.3s ease;

&:hover {
  box-shadow: -5px 0 25px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 255, 200, 0.2);
}

&::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, 
    rgba(0, 255, 200, 0.05) 0%, 
    rgba(0, 180, 200, 0.05) 50%, 
    rgba(0, 255, 200, 0.05) 100%);
  opacity: 0.5;
  z-index: -1;
}
`;

// Enhanced Journey Path with improved glowing effect
const JourneyPath = styled.div`
position: absolute;
width: 4px;
height: 70%;
background: linear-gradient(to bottom, 
  rgba(0, 255, 200, 0.2) 0%, 
  rgba(0, 255, 200, 0.8) ${props => props.progress || 0}%, 
  rgba(0, 255, 200, 0.2) ${props => props.progress || 0}%, 
  rgba(0, 255, 200, 0.2) 100%);
border-radius: 2px;
z-index: 1;
will-change: background;
box-shadow: 0 0 10px rgba(0, 255, 200, 0.3);

&::after {
  content: '';
  position: absolute;
  top: ${props => props.progress || 0}%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  background: rgba(0, 255, 200, 1);
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(0, 255, 200, 0.8);
  opacity: 0.8;
}
`;

// Enhanced Journey Step with orbital animation
const JourneyStep = styled.div`
width: 100%;
position: relative;
display: flex;
align-items: center;
padding: 1rem 0;
opacity: ${props => props.active ? 1 : props.passed ? 0.8 : 0.5};
transform: ${props => props.active ? 'scale(1.05) translateX(10px)' : 'scale(1)'};
filter: ${props => props.active ? 'drop-shadow(0 0 8px rgba(0, 255, 200, 0.5))' : 'none'};
transition: all 0.5s ease;
z-index: 2;
${props => props.active && css`animation: ${fadeInAnimation} 0.8s ease-out;`}
cursor: ${props => props.clickable ? 'pointer' : 'default'};

&:hover {
  transform: ${props => props.clickable ? 'scale(1.08) translateX(5px)' : props.active ? 'scale(1.05) translateX(10px)' : 'scale(1)'};
}
`;

// Updated Journey Icon with different colors for each step based on page journey concept
const JourneyIcon = styled.div`
width: 40px;
height: 40px;
background: ${props => {
  if (!props.active && !props.passed) {
    return 'rgba(20, 27, 56, 0.6)';
  }
  
  // Step-specific colors based on journey concept
  switch(props.stepNumber) {
    case 1: // Earth/Home - Green
      return 'linear-gradient(135deg, #00ffc8 0%, #00a3ff 100%)';
    case 2: // Register - Pink
      return 'linear-gradient(135deg, #ff4da6 0%, #a100ff 100%)';
    case 3: // Dashboard - Blue
      return 'linear-gradient(135deg, #00a3ff 0%, #0051ff 100%)';
    default:
      return props.iconColor || 'linear-gradient(135deg, #00ffc8 0%, #00a3ff 100%)';
  }
}};
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
font-size: 1.2rem;
color: white;
margin-right: 10px;
border: 2px solid ${props => props.active ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 255, 200, 0.3)'};
box-shadow: ${props => props.active ? `0 0 15px ${props.shadowColor || 'rgba(0, 255, 200, 0.7)'}` : 'none'};
z-index: 3;
${props => props.active && css`animation: ${pulseGlow} 2s infinite ease-in-out;`}
will-change: transform, opacity;
position: relative;

&::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${props => props.active ? '150%' : '0'};
  height: ${props => props.active ? '150%' : '0'};
  background: radial-gradient(circle, ${props => props.glowColor || 'rgba(0, 255, 200, 0.2)'} 0%, transparent 70%);
  border-radius: 50%;
  z-index: -1;
  transition: all 0.5s ease;
}
`;

const JourneyText = styled.div`
flex: 1;
text-align: left;
`;

const JourneyTitle = styled.div`
font-size: 0.9rem;
font-weight: 600;
color: white;
font-family: 'Orbitron', sans-serif;
text-shadow: 0 0 5px rgba(0, 255, 200, 0.5);
`;

const JourneySubtitle = styled.div`
font-size: 0.7rem;
color: rgba(255, 255, 255, 0.7);
margin-top: 0.2rem;
`;

// Enhanced Register Form with improved glassmorphism
const RegisterForm = styled.form`
background: rgba(20, 27, 56, 0.3);
padding: 2.5rem;
border-radius: 0 12px 12px 0;
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.1);
width: 400px;
max-width: 90%;
color: ${theme.colors.text};
box-shadow: 0 8px 32px rgba(14, 21, 47, 0.3), 
  0 0 0 1px rgba(0, 255, 200, 0.1), 
  inset 0 1px 1px rgba(255, 255, 255, 0.05),
  0 0 15px rgba(0, 255, 200, 0.2);
text-align: center;
transition: all 0.3s ease;

&:hover {
  box-shadow: 0 8px 32px rgba(14, 21, 47, 0.4), 
    0 0 0 1px rgba(0, 255, 200, 0.2), 
    inset 0 1px 1px rgba(255, 255, 255, 0.1),
    0 0 20px rgba(0, 255, 200, 0.3);
}

&::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(45deg, 
    rgba(0, 255, 200, 0.05) 0%, 
    rgba(0, 255, 200, 0.05) 50%, 
    rgba(0, 180, 160, 0.05) 100%);
  border-radius: 0 12px 12px 0;
  opacity: 0.5;
  z-index: -1;
  pointer-events: none;
}
`;

// Enhanced Input with improved glow effect on focus and validation states
const Input = styled.input`
width: 100%;
padding: 0.8rem;
margin: 1rem 0;
background: rgba(15, 32, 39, 0.6);
border: 1px solid rgba(0, 255, 200, 0.3);
border-radius: 8px;
color: ${theme.colors.text};
font-size: 1rem;
transition: all 0.3s ease;
font-family: 'Poppins', sans-serif;
position: relative;

&:focus {
  outline: none;
  border-color: rgba(0, 255, 200, 0.8);
  box-shadow: 0 0 15px rgba(0, 255, 200, 0.4);
  transform: translateY(-2px);
  animation: ${focusGlowAnimation} 2s infinite;
}

&::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

&:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

${props => props.scanning && css`
  background: linear-gradient(
    90deg, 
    rgba(15, 32, 39, 0.6) 0%, 
    rgba(0, 255, 200, 0.1) 50%, 
    rgba(15, 32, 39, 0.6) 100%
  );
  background-size: 200% 100%;
  animation: ${scanningAnimation} 2s ease-in-out infinite;
`}

${props => props.valid && css`
  border-color: rgba(0, 255, 200, 0.8);
  box-shadow: 0 0 10px rgba(0, 255, 200, 0.5);
  
  &::after {
    content: '✓';
    position: absolute;
    right: 10px;
    color: #00ffc8;
  }
`}

${props => props.invalid && css`
  border-color: rgba(255, 77, 77, 0.8);
  animation: ${invalidShakeAnimation} 0.5s ease-in-out;
  box-shadow: 0 0 10px rgba(255, 77, 77, 0.3);
`}
`;

// Enhanced InputWrapper to support validation icons
const InputWrapper = styled.div`
position: relative;
width: 100%;

&::after {
  content: ${props => props.valid ? '"✓"' : props.invalid ? '"✗"' : '""'};
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.valid ? '#00ffc8' : '#ff4d4d'};
  font-size: 1.2rem;
  opacity: ${props => props.valid || props.invalid ? '1' : '0'};
  transition: opacity 0.3s ease;
}

${props => props.scanning && css`
  &::before {
    content: '🛸';
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.2rem;
    z-index: 2;
  }
`}
`;

// Enhanced Button with rocket trail animation on hover
const Button = styled.button`
width: 100%;
padding: 0.8rem;
background: linear-gradient(90deg, #00ffc8, #00a3ff);
color: white;
border: none;
border-radius: 8px;
cursor: pointer;
font-size: 1.1rem;
font-weight: bold;
margin-top: 1.5rem;
transition: all 0.3s ease;
box-shadow: 0 0 15px #00ffc8;
display: flex;
justify-content: center;
align-items: center;
gap: 8px;
position: relative;
overflow: hidden;
animation: ${buttonGlowPulse} 2s infinite;
font-family: 'Orbitron', sans-serif;

&:hover {
  transform: scale(1.05);
  background: linear-gradient(90deg, #00ffc8, #00d4ff);
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 10px;
    width: 20px;
    height: 4px;
    background: linear-gradient(to left, rgba(255, 255, 255, 0.8), transparent);
    transform: translateY(-50%);
    border-radius: 2px;
    filter: blur(2px);
    animation: ${rocketTrailAnimation} 1s infinite;
  }
}

&:active {
  transform: translateY(1px);
}

&:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

&::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transform: rotate(45deg);
  transition: all 0.5s ease;
  opacity: 0;
}

&:hover::before {
  opacity: 1;
  animation: ${slowRotate} 2s linear infinite;
}
`;

// Enhanced Google Sign In Button
const GoogleSignInButton = styled(Button)`
display: flex;
align-items: center;
justify-content: center;
background: rgba(255, 255, 255, 0.1);
color: white;
border: 1px solid rgba(0, 255, 200, 0.3);
margin-top: 1rem;
transition: all 0.3s ease;
animation: none;
box-shadow: 0 0 10px rgba(0, 255, 200, 0.3);

&:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(0, 255, 200, 0.5);
  box-shadow: 0 0 15px rgba(0, 255, 200, 0.5);
}

svg {
  margin-right: 10px;
  width: 24px;
  height: 24px;
}
`;

// Enhanced Auth Title with matching glow effect
const AuthTitle = styled.h2`
font-size: 2rem;
color: white;
margin-bottom: 0.5rem;
text-shadow: 0 0 10px rgba(0, 255, 200, 0.5);
display: flex;
align-items: center;
justify-content: center;
gap: 10px;
font-family: 'Orbitron', sans-serif;
letter-spacing: 1px;

&::after {
  content: '';
  position: absolute;
  width: 50px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00ffc8, transparent);
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
}
`;

// Enhanced Auth Subtitle
const AuthSubtitle = styled.p`
font-size: 1rem;
color: rgba(255, 255, 255, 0.7);
margin-bottom: 1.5rem;
text-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
font-family: 'Poppins', sans-serif;
`;

// Enhanced Auth Link with matching glow
const AuthLink = styled(Link)`
color: rgba(0, 255, 200, 0.9);
text-align: center;
display: flex;
align-items: center;
justify-content: center;
margin-top: 1.5rem;
text-decoration: none;
font-size: 0.9rem;
transition: all 0.3s ease;
gap: 8px;
font-family: 'Poppins', sans-serif;

&:hover {
  color: rgba(0, 255, 200, 1);
  transform: translateY(-2px);
  text-shadow: 0 0 8px rgba(0, 255, 200, 0.5);
}

&::before {
  content: '🚀';
  font-size: 1.1rem;
}
`;

// Enhanced Home Button with matching style
const HomeButton = styled(Link)`
position: absolute;
top: 1rem;
right: 1rem;
background: rgba(0, 255, 200, 0.2);
color: #FFFFFF;
border: 1px solid rgba(0, 255, 200, 0.4);
padding: 0.5rem 1rem;
border-radius: 8px;
cursor: pointer;
font-weight: 600;
transition: all 0.3s ease;
z-index: 1001;
text-decoration: none;
backdrop-filter: blur(5px);
font-family: 'Orbitron', sans-serif;

&:hover {
  background: rgba(0, 255, 200, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 0 15px rgba(0, 255, 200, 0.5);
}
`;

// Enhanced Micro Copy with AI Assistant
const MicroCopy = styled.p`
font-size: 0.85rem;
color: rgba(255, 255, 255, 0.7);
margin-top: 0.25rem;
display: flex;
align-items: center;
gap: 5px;
position: relative;
padding-left: 25px;
font-family: 'Poppins', sans-serif;

&::before {
  content: ${props => props.icon || "'🧑‍🚀'"};
  font-size: 0.9rem;
  position: absolute;
  left: 0;
}
`;

// Enhanced AI Assistant Avatar with better floating animation
const AstroAssistant = styled.div`
position: absolute;
bottom: ${props => props.active ? '20px' : '-60px'};
right: 20px;
display: flex;
align-items: center;
gap: 10px;
background: rgba(0, 255, 200, 0.1);
padding: 10px 15px;
border-radius: 20px;
border: 1px solid rgba(0, 255, 200, 0.3);
backdrop-filter: blur(5px);
transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
z-index: 1000;
max-width: 280px;
box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2), 0 0 10px rgba(0, 255, 200, 0.3);

${props => props.active && css`
  animation: ${floatAnimation} 5s infinite ease-in-out, ${fadeInAnimation} 0.5s ease-out;
`}
`;

const AstroAvatar = styled.div`
width: 40px;
height: 40px;
border-radius: 50%;
background: linear-gradient(135deg, #00ffc8, #00a3ff);
display: flex;
align-items: center;
justify-content: center;
font-size: 1.2rem;
flex-shrink: 0;
box-shadow: 0 0 10px rgba(0, 255, 200, 0.5);
`;

const AstroMessage = styled.div`
color: white;
font-size: 0.85rem;
line-height: 1.3;
font-family: 'Poppins', sans-serif;
`;

// Enhanced User Count with matching style
const UserCount = styled.div`
position: absolute;
bottom: 1rem;
left: 50%;
transform: translateX(-50%);
color: rgba(255, 255, 255, 0.9);
font-size: 0.9rem;
display: flex;
align-items: center;
gap: 5px;
z-index: 1000;
background: rgba(20, 27, 56, 0.6);
padding: 0.5rem 1rem;
border-radius: 20px;
backdrop-filter: blur(5px);
box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
border: 1px solid rgba(0, 255, 200, 0.2);
font-family: 'Poppins', sans-serif;
transition: all 0.3s ease;

&::before {
  content: '👥';
}
`;

// Validity checker animation for username
const ValidityIcon = styled.div`
position: absolute;
right: 15px;
top: 50%;
transform: translateY(-50%);
opacity: ${props => props.visible ? '1' : '0'};
transition: opacity 0.3s ease;
z-index: 10;
`;

const Register = () => {
  // Get context and navigation
  const { login, isAuthenticated } = useContext(AuthContext) || { login: () => {}, isAuthenticated: false };
  const navigate = useNavigate();

  // State initialization with default values
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentJourneyStep, setCurrentJourneyStep] = useState(1);
  const [rocketBouncing, setRocketBouncing] = useState(false);
  const [rocketLaunching, setRocketLaunching] = useState(false);
  const [rocketShaking, setRocketShaking] = useState(false);
  const [showCometTail, setShowCometTail] = useState(false);
  const [shootingStars, setShootingStars] = useState([]);
  const [hyperspaceActive, setHyperspaceActive] = useState(false);
  const [assistantMessage, setAssistantMessage] = useState('');
  const [showAssistant, setShowAssistant] = useState(false);
  
  // Added states for enhanced micro-interactions
  const [scanningFields, setScanningFields] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false
  });
  
  const [validFields, setValidFields] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false
  });
  
  const [invalidFields, setInvalidFields] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false
  });

  const containerRef = useRef(null);

  // Journey steps data with enhanced colors for each step
  const journeySteps = useMemo(() => [
    {
      icon: '🌍',
      title: 'Earth',
      subtitle: 'Start Your Journey',
      step: 1,
      iconColor: 'linear-gradient(135deg, #00ffc8 0%, #00a3ff 100%)',
      shadowColor: 'rgba(0, 255, 200, 0.7)',
      glowColor: 'rgba(0, 255, 200, 0.2)'
    },
    {
      icon: '🚀',
      title: 'Rocket Launch',
      subtitle: 'Create Your Account',
      step: 2,
      iconColor: 'linear-gradient(135deg, #ff4da6 0%, #a100ff 100%)',
      shadowColor: 'rgba(255, 77, 166, 0.7)',
      glowColor: 'rgba(255, 77, 166, 0.2)'
    },
    {
      icon: '🌠',
      title: 'Enter Orbit',
      subtitle: 'Set Goals',
      step: 3,
      iconColor: 'linear-gradient(135deg, #00a3ff 0%, #0051ff 100%)',
      shadowColor: 'rgba(0, 163, 255, 0.7)',
      glowColor: 'rgba(0, 163, 255, 0.2)'
    }
  ], []);

  // Memoized stars with enhanced variety
  const stars = useMemo(() => {
    const starsArray = [];
    for (let i = 0; i < 25; i++) { // Increased number of stars
      starsArray.push({
        id: i,
        top: `${Math.random() * 90}%`,
        left: `${Math.random() * 90}%`,
        size: `${Math.random() * 40 + 10}px`,
        duration: `${Math.random() * 5 + 2}s`,
        delay: `${Math.random() * 5}s`
      });
    }
    return starsArray;
  }, []);

  // Memoized twinkling stars - increased for more density
  const twinklingStars = useMemo(() => {
    const starsArray = [];
    for (let i = 0; i < 80; i++) { // Increased number for better effect
      starsArray.push({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: `${Math.random() * 2 + 1}px`,
        duration: `${Math.random() * 3 + 1}s`,
        delay: `${Math.random() * 3}s`,
        opacity: Math.random() * 0.5 + 0.3
      });
    }
    return starsArray;
  }, []);

  // Memoized confetti with enhanced colors to match theme
  const confetti = useMemo(() => {
    if (!showConfetti) return [];
    
    const confettiPieces = [];
    const colors = ['#00ffc8', '#00a3ff', '#0077ff', '#80ffe6', '#ffffff', '#c0ffee']; // Updated colors
    
    for (let i = 0; i < 50; i++) {
      const left = Math.random() * 100;
      const top = Math.random() * 20;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const delay = Math.random() * 1.5;
      const size = `${Math.random() * 8 + 5}px`;
      const shape = Math.floor(Math.random() * 4); // 0-3 for different shapes
      
      confettiPieces.push({
        id: i,
        color,
        left: `${left}%`,
        top: `${top}%`,
        delay,
        size,
        shape
      });
    }
    
    return confettiPieces;
  }, [showConfetti]);

  // Prevent using uninitialized values in journey progress calculation
  const journeyProgress = useMemo(() => {
    if (!journeySteps || journeySteps.length === 0) return 0;
    const totalSteps = journeySteps.length;
    const completedSteps = Math.max(0, currentJourneyStep - 1);
    return Math.min(100, (completedSteps / Math.max(1, totalSteps - 1)) * 100);
  }, [currentJourneyStep, journeySteps]);

  // Guard against null/undefined values when rendering stars
  const renderStars = useMemo(() => {
    if (!stars || stars.length === 0) return null;
    
    return stars.map(star => star && (
      <Star 
        key={star.id || Math.random()}
        size={star.size || '20px'}
        style={{ 
          top: star.top || '10%', 
          left: star.left || '10%'
        }}
        duration={star.duration || '3s'}
        delay={star.delay || '0s'}
      />
    ));
  }, [stars]);

  // Guard against null/undefined values when rendering twinkling stars
  const renderTwinklingStars = useMemo(() => {
    if (!twinklingStars || twinklingStars.length === 0) return null;
    
    return twinklingStars.map(star => star && (
      <TwinklingStar
        key={star.id || Math.random()}
        size={star.size || '2px'}
        top={star.top || '10%'}
        left={star.left || '10%'}
        duration={star.duration || '3s'}
        delay={star.delay || '0s'}
        opacity={star.opacity || 0.5}
      />
    ));
  }, [twinklingStars]);

  // Guard against null/undefined values when rendering shooting stars
  const renderShootingStars = useMemo(() => {
    if (!shootingStars || shootingStars.length === 0) return null;
    
    return shootingStars.map(star => star && (
      <ShootingStar
        key={star.id || Math.random()}
        top={star.top || '10%'}
        rotation={star.rotation || '45deg'}
        duration={star.duration || '3s'}
        delay={star.delay || '0s'}
      />
    ));
  }, [shootingStars]);

  // Guard against null/undefined values when rendering confetti
  const renderConfetti = useMemo(() => {
    if (!showConfetti || !confetti || confetti.length === 0) return null;
    
    return confetti.map(piece => piece && (
      <Confetti
        key={piece.id || Math.random()}
        color={piece.color || '#00ffc8'}
        style={{ 
          left: piece.left || '50%', 
          top: piece.top || '0%' 
        }}
        delay={piece.delay || 0}
        size={piece.size || '10px'}
        shape={piece.shape || 0}
      />
    ));
  }, [showConfetti, confetti]);

  // Set assistant messages based on step and actions
  useEffect(() => {
    if (step === 1 && currentJourneyStep === 1) {
      const timer = setTimeout(() => {
        setAssistantMessage('Welcome, explorer! Pick a cool name — the galaxy will remember you!');
        setShowAssistant(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (step === 2 && currentJourneyStep === 2) {
      setAssistantMessage('Almost there! Create a strong password to secure your cosmic journey.');
      setShowAssistant(true);
    }
  }, [step, currentJourneyStep]);

  // Update journey step based on form step
  useEffect(() => {
    if (step === 1) {
      setCurrentJourneyStep(1);
    } else if (step === 2) {
      setCurrentJourneyStep(2);
    }
  }, [step]);

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Create shooting star effect randomly
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const starId = Date.now();
        const newShootingStar = {
          id: starId,
          top: `${Math.random() * 50}%`,
          rotation: `${Math.random() * 60 + 30}deg`,
          duration: `${Math.random() * 2 + 1}s`,
          delay: '0s'
        };
        
        setShootingStars(prev => [...prev, newShootingStar]);
        
        // Remove shooting star after animation
        const timeoutId = setTimeout(() => {
          setShootingStars(prev => prev.filter(star => star.id !== starId));
        }, 3000);
        
        return () => clearTimeout(timeoutId);
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  // Input focus handlers for rocket animation - memoized to prevent recreation
  const handleInputFocus = useCallback((field) => {
    setRocketBouncing(true);
    setShowCometTail(true);
    
    // Start scanning animation for the focused field
    setScanningFields(prev => ({ ...prev, [field]: true }));
    
    // Generate a quirky assistant message based on field
    const messages = {
      username: [
        "Scanning for cool explorer names...",
        "What should the cosmos call you?",
        "Searching the star registry for your identity..."
      ],
      email: [
        "Establishing cosmic communication lines...",
        "Where should we send your space memos?",
        "Setting up your interstellar mailbox..."
      ],
      password: [
        "Creating your security force field...",
        "Make it strong enough to withstand asteroid impacts!",
        "Setting up your cosmic vault codes..."
      ],
      confirmPassword: [
        "Double-checking your security protocols...",
        "Confirming your force field patterns...",
        "Making sure your airlock codes match..."
      ]
    };
    
    // Select random message for the field
    const fieldMessages = messages[field] || ["Scanning cosmic data..."];
    const randomMessage = fieldMessages[Math.floor(Math.random() * fieldMessages.length)];
    
    setAssistantMessage(randomMessage);
    setShowAssistant(true);
    
  }, []);

  const handleInputBlur = useCallback((field, value) => {
    setRocketBouncing(false);
    setShowCometTail(false);
    
    // Stop scanning animation
    setScanningFields(prev => ({ ...prev, [field]: false }));
    
    // Validate input when field loses focus
    validateInput(field, value);
  }, []);

  // Handle input change with validation - enhanced for micro-interactions
  const handleInputChange = useCallback((field, value) => {
    // Update the field value through existing state setters
    switch(field) {
      case 'username':
        setUsername(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
      default:
        break;
    }
    
    // Quick validation during typing for immediate feedback
    let isValid = true;
    
    if (field === 'username' && (!value || value.length < 3)) {
      isValid = false;
    } else if (field === 'email' && (!value || !/\S+@\S+\.\S+/.test(value))) {
      isValid = false;
    } else if (field === 'password' && (!value || value.length < 6)) {
      isValid = false;
    } else if (field === 'confirmPassword' && value !== password) {
      isValid = false;
    }
    
    // Update validity states for dynamic feedback
    if (value && value.length > 0) {
      if (isValid) {
        setValidFields(prev => ({ ...prev, [field]: true }));
        setInvalidFields(prev => ({ ...prev, [field]: false }));
        
        // Show validating scanning state briefly
        setScanningFields(prev => ({ ...prev, [field]: true }));
        setTimeout(() => {
          setScanningFields(prev => ({ ...prev, [field]: false }));
        }, 800);
      } else {
        setValidFields(prev => ({ ...prev, [field]: false }));
        setInvalidFields(prev => ({ ...prev, [field]: true }));
      }
    } else {
      // Empty field
      setValidFields(prev => ({ ...prev, [field]: false }));
      setInvalidFields(prev => ({ ...prev, [field]: false }));
    }
  }, [password]);

  // Handle invalid input - memoized to prevent recreation
  const validateInput = useCallback((field, value) => {
    let isValid = true;
    
    if (field === 'username' && (!value || value.length < 3)) {
      isValid = false;
    } else if (field === 'email' && (!value || !/\S+@\S+\.\S+/.test(value))) {
      isValid = false;
    } else if (field === 'password' && (!value || value.length < 6)) {
      isValid = false;
    } else if (field === 'confirmPassword' && value !== password) {
      isValid = false;
    }
    
    setInvalidFields(prev => ({ ...prev, [field]: !isValid }));
    setValidFields(prev => ({ ...prev, [field]: isValid && value && value.length > 0 }));
    
    if (!isValid && value && value.length > 0) {
      setRocketShaking(true);
      setTimeout(() => setRocketShaking(false), 500);
      
      // Update assistant message for validation errors
      if (field === 'username') {
        setAssistantMessage('Your explorer name should be at least 3 characters long!');
      } else if (field === 'email') {
        setAssistantMessage('Please enter a valid email address for mission communications!');
      } else if (field === 'password') {
        setAssistantMessage('Your password should be at least 6 characters for better security!');
      } else if (field === 'confirmPassword') {
        setAssistantMessage('Your passwords don\'t match! Double-check for cosmic typos.');
      }
      
      setShowAssistant(true);
    } else if (isValid && value && value.length > 0) {
      // Positive feedback for valid input
      const successMessages = {
        username: [
          "Perfect name for an explorer!",
          "Great choice, it suits you!",
          "That's a name the stars will remember!"
        ],
        email: [
          "Excellent! Your space mail is all set.",
          "Perfect communication coordinates!",
          "Cosmic transmissions will reach you there!"
        ],
        password: [
          "Strong force field activated!",
          "Security protocols looking good!",
          "That's a secure airlock code!"
        ],
        confirmPassword: [
          "Passwords match perfectly!",
          "Security confirmation complete!",
          "Your cosmic vault is secured!"
        ]
      };
      
      const fieldMessages = successMessages[field] || ["That looks great!"];
      const randomMessage = fieldMessages[Math.floor(Math.random() * fieldMessages.length)];
      
      setAssistantMessage(randomMessage);
      setShowAssistant(true);
    }
    
    return isValid;
  }, [password]);

  // Handle Earth icon click
  const handleEarthClick = useCallback(() => {
    if (step !== 1) {
      setStep(1);
      setCurrentJourneyStep(1);
      setError(null);
      setAssistantMessage('Welcome back to Earth! Let\'s restart your cosmic journey.');
      setShowAssistant(true);
    }
  }, [step]);

  // Google Sign-In Handler with error handling
  const handleGoogleSignIn = useCallback(async () => {
    if (!auth) {
      console.error("Firebase auth not initialized");
      setError("Authentication service unavailable");
      return;
    }
    
    try {
      const googleProvider = new GoogleAuthProvider();
      setIsLoading(true);
      setError(null);
      setAssistantMessage('Connecting to the Google nebula... Please wait!');
      setShowAssistant(true);
      
      // Launch rocket animation
      setRocketLaunching(true);
      setTimeout(() => {
        // Create hyperspace effect
        setHyperspaceActive(true);
      }, 1000);
      
      // Sign in with Google popup
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential?.user;
      
      if (user) {
        // If the user doesn't have a display name, set a default username
        if (!user.displayName) {
          await updateProfile(user, {
            displayName: user.email ? user.email.split('@')[0] : 'Explorer'
          });
        }
        
        // Show success animation after hyperspace effect
        setTimeout(() => {
          setShowConfetti(true);
          setCurrentJourneyStep(3);
          setAssistantMessage('Welcome aboard, explorer! Preparing your dashboard...');
        }, 1500);
        
        // Delay navigation to show success animation
        setTimeout(() => {
          // Update auth context if login function exists
          if (login && typeof login === 'function') {
            login(user);
          }
          // Redirect to dashboard if navigate function exists
          if (navigate && typeof navigate === 'function') {
            navigate('/dashboard');
          }
        }, 3000);
      } else {
        throw new Error("Failed to get user information");
      }
    } catch (error) {
      setIsLoading(false);
      setRocketLaunching(false);
      setHyperspaceActive(false);
      
      // Handle specific Google Sign-In errors
      const errorCode = error?.code || 'unknown-error';
      switch(errorCode) {
        case 'auth/account-exists-with-different-credential':
          setError('An account already exists with a different sign-in method.');
          setAssistantMessage('It seems you\'ve traveled this path before, but using a different spaceship!');
          break;
        case 'auth/popup-blocked':
          setError('Sign-in popup was blocked. Please enable popups and try again.');
          setAssistantMessage('Your ship\'s docking bay (popup) was blocked. Please enable it and try again!');
          break;
        case 'auth/popup-closed-by-user':
          setError('Sign-in popup was closed before completion.');
          setAssistantMessage('You closed the airlock too early! Try again when you\'re ready.');
          break;
        default:
          setError('Google Sign-In failed. Please try again.');
          setAssistantMessage('Houston, we have a problem! Try again or use a different launch method.');
          console.error('Google Sign-In error:', error);
      }
      
      setShowAssistant(true);
    }
  }, [auth, login, navigate]);

  // Safely initialize handlers for form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Make sure required state is initialized
    if (step === undefined || isLoading === undefined) {
      console.error("Required state not initialized");
      return;
    }
    
    if (step === 1) {
      const isUsernameValid = validateInput('username', username);
      const isEmailValid = validateInput('email', email);
      
      if (isUsernameValid && isEmailValid) {
        // Trigger shooting stars for navigation
        const newShootingStar = {
          id: Date.now(),
          top: '50%',
          rotation: '45deg',
          duration: '1.5s',
          delay: '0s'
        };
        
        setShootingStars(prev => prev ? [...prev, newShootingStar] : [newShootingStar]);
        
        // Show animation before changing step
        setRocketBouncing(true);
        
        setTimeout(() => {
          setStep(2);
          setCurrentJourneyStep(2);
          setError(null);
          setRocketBouncing(false);
        }, 1000);
        
        return;
      } else {
        return;
      }
    }
    
    // Step 2 validation
    const isPasswordValid = validateInput('password', password);
    const isConfirmPasswordValid = validateInput('confirmPassword', confirmPassword);
    
    if (!isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setAssistantMessage('Initiating launch sequence... Stand by!');
      setShowAssistant(true);
      
      // Launch rocket animation
      setRocketLaunching(true);
      setTimeout(() => {
        // Create hyperspace effect
        setHyperspaceActive(true);
      }, 1000);
      
      // Create user with Firebase if auth is available
      if (auth) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update user profile with username
        if (userCredential?.user) {
          await updateProfile(userCredential.user, {
            displayName: username
          });
          
          // Show success animation after hyperspace effect
          setTimeout(() => {
            setShowConfetti(true);
            setCurrentJourneyStep(3);
            setAssistantMessage('Congratulations, explorer! Your journey begins now!');
          }, 1500);
          
          // Delay navigation to show success animation
          setTimeout(() => {
            // Update auth context
            if (login && typeof login === 'function') {
              login(userCredential.user);
            }
            // Redirect to dashboard
            if (navigate && typeof navigate === 'function') {
              navigate('/dashboard');
            }
          }, 3500);
        }
      }
    } catch (error) {
      setIsLoading(false);
      setRocketLaunching(false);
      setHyperspaceActive(false);
      
      // Handle specific Firebase errors
      const errorCode = error?.code || 'unknown-error';
      switch(errorCode) {
        case 'auth/email-already-in-use':
          setError('Email already in use. Try logging in instead.');
          setAssistantMessage('This star map (email) is already registered! Try docking back in instead.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          setAssistantMessage('Your communication coordinates (email) seem invalid! Check your star map.');
          break;
        case 'auth/weak-password':
          setError('Password should be at least 6 characters.');
          setAssistantMessage('Your security code is too weak! Use at least 6 characters for better protection.');
          break;
        case 'auth/operation-not-allowed':
          setError('Email/password accounts are not enabled.');
          setAssistantMessage('This launch method is currently unavailable. Try a different approach!');
          break;
        default:
          setError('Registration failed. Please try again.');
          setAssistantMessage('Launch sequence aborted! Check your systems and try again.');
          console.error('Registration error:', error);
      }
      
      setShowAssistant(true);
    }
  }, [step, username, email, password, confirmPassword, validateInput, isLoading, navigate, login]);

  return (
    <>
      {/* Add global style with space fonts */}
      <GlobalStyle />
      
      <Background ref={containerRef}>
        {/* Enhanced galaxy background */}
        <GalaxyCloud />
        
        {/* Twinkling stars in the background */}
        {renderTwinklingStars}
        
        {/* Scenery with mountains */}
        <Scenery />
        
        {/* Larger stars */}
        {renderStars}
        
        {/* Shooting stars */}
        {renderShootingStars}
        
        {/* Interactive rocket */}
        <Rocket 
          bouncing={rocketBouncing} 
          launching={rocketLaunching}
          shaking={rocketShaking}
        />
        
        {/* Comet tail for rocket */}
        <CometTail 
          top="33%"
          left="13%"
          visible={showCometTail || rocketLaunching}
        />
        
        {/* Animated progress circle */}
        <ProgressCircle />
        
        {/* Success animation confetti */}
        {renderConfetti}
        
        {/* AI Assistant Avatar */}
        <AstroAssistant active={showAssistant}>
          <AstroAvatar>🧑‍🚀</AstroAvatar>
          <AstroMessage>{assistantMessage}</AstroMessage>
        </AstroAssistant>
        
        {/* Navigation buttons */}
        <HomeButton to="/">Home Base</HomeButton>
        
        {/* Main content */}
        <RegisterContainer hyperspace={hyperspaceActive}>
          {/* Journey Panel with glowing effects */}
          <JourneyPanel>
            <JourneyPath progress={journeyProgress} />
            
            {journeySteps && journeySteps.map((journeyStep) => journeyStep && (
              <JourneyStep 
                key={journeyStep.step || Math.random()}
                active={currentJourneyStep === journeyStep.step}
                passed={currentJourneyStep > journeyStep.step}
                clickable={journeyStep.step === 1}
                onClick={journeyStep.step === 1 ? handleEarthClick : undefined}
              >
                <JourneyIcon 
                  active={currentJourneyStep === journeyStep.step || currentJourneyStep > journeyStep.step}
                  iconColor={journeyStep.iconColor || 'linear-gradient(135deg, #00ffc8 0%, #00a3ff 100%)'}
                  shadowColor={journeyStep.shadowColor || 'rgba(0, 255, 200, 0.7)'}
                  glowColor={journeyStep.glowColor || 'rgba(0, 255, 200, 0.2)'}
                  stepNumber={journeyStep.step}
                >
                  {journeyStep.icon || '✨'}
                </JourneyIcon>
                <JourneyText>
                  <JourneyTitle>{journeyStep.title || 'Step'}</JourneyTitle>
                  <JourneySubtitle>{journeyStep.subtitle || 'Description'}</JourneySubtitle>
                </JourneyText>
              </JourneyStep>
            ))}
          </JourneyPanel>
          
          {/* Register Form with glassmorphism */}
          <RegisterForm onSubmit={handleSubmit}>
            <AuthTitle>
              {step === 1 ? 'Start Your Journey' : 'Complete Launch Sequence'}
            </AuthTitle>
            
            <AuthSubtitle>
              {step === 1 ? 'Create your account to begin' : 'Just a few more details to lift off'}
            </AuthSubtitle>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            {step === 1 ? (
              <>
                <InputWrapper
                  scanning={scanningFields.username}
                  valid={validFields.username}
                  invalid={invalidFields.username}
                >
                  <Input 
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    onFocus={() => handleInputFocus('username')}
                    onBlur={() => handleInputBlur('username', username)}
                    disabled={isLoading}
                    invalid={invalidFields.username}
                    scanning={scanningFields.username}
                    valid={validFields.username}
                    required
                  />
                </InputWrapper>
                <MicroCopy icon="🧑‍🚀">Choose a unique explorer name</MicroCopy>
                
                <InputWrapper
                  scanning={scanningFields.email}
                  valid={validFields.email}
                  invalid={invalidFields.email}
                >
                  <Input 
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onFocus={() => handleInputFocus('email')}
                    onBlur={() => handleInputBlur('email', email)}
                    disabled={isLoading}
                    invalid={invalidFields.email}
                    scanning={scanningFields.email}
                    valid={validFields.email}
                    required
                  />
                </InputWrapper>
                <MicroCopy icon="📡">We'll send mission updates here</MicroCopy>
                
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Processing...' : 'Continue to Launch 🚀'}
                </Button>
                
                <GoogleSignInButton
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <svg viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign in with Google
                </GoogleSignInButton>
                
                <AuthLink to="/login">
                  Already onboard? Dock back in
                </AuthLink>
              </>
            ) : (
              <>
                <InputWrapper
                  scanning={scanningFields.password}
                  valid={validFields.password}
                  invalid={invalidFields.password}
                >
                  <Input 
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onFocus={() => handleInputFocus('password')}
                    onBlur={() => handleInputBlur('password', password)}
                    disabled={isLoading}
                    invalid={invalidFields.password}
                    scanning={scanningFields.password}
                    valid={validFields.password}
                    required
                  />
                </InputWrapper>
                <MicroCopy icon="🔒">At least 6 characters recommended</MicroCopy>
                
                <InputWrapper
                  scanning={scanningFields.confirmPassword}
                  valid={validFields.confirmPassword}
                  invalid={invalidFields.confirmPassword}
                >
                  <Input 
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    onFocus={() => handleInputFocus('confirmPassword')}
                    onBlur={() => handleInputBlur('confirmPassword', confirmPassword)}
                    disabled={isLoading}
                    invalid={invalidFields.confirmPassword}
                    scanning={scanningFields.confirmPassword}
                    valid={validFields.confirmPassword}
                    required
                  />
                </InputWrapper>
                <MicroCopy icon="✅">Make sure passwords match</MicroCopy>
                
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Preparing for Launch...' : 'Complete Registration 🚀'}
                </Button>
                
                <Button 
                  type="button" 
                  onClick={() => {
                    setStep(1);
                    setCurrentJourneyStep(1);
                    setAssistantMessage('Returning to Earth base! You can edit your details here.');
                    setShowAssistant(true);
                  }} 
                  disabled={isLoading}
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    marginTop: '1rem',
                    border: '1px solid rgba(0, 255, 200, 0.3)',
                    boxShadow: '0 0 10px rgba(0, 255, 200, 0.2)',
                    animation: 'none'
                  }}
                >
                  Return to Earth Base
                </Button>
              </>
            )}
          </RegisterForm>
        </RegisterContainer>
        
        {/* User count with enhanced visuals */}
        <UserCount>Over 12,500 explorers have joined</UserCount>
      </Background>
    </>
  );
};

export default Register;
