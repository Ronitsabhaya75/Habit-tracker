/*
The Homepage component serves as the main landing page for your habit-tracking application, featuring an immersive space-themed design with interactive elements and smooth animations. This component combines visual appeal with functional UI elements to create an engaging user experience.

Key Features
1. Immersive Space Theme
Animated Background: Deep space gradient with parallax scrolling effect

Starfield Animation: Dynamic particle system with twinkling stars

Interactive Elements: Rocket, planets, and achievement badges with animations

Dark/Light Mode: Smooth theme transition toggle

2. Performance Optimizations
Memoized Particles: Reduced particle count with performance considerations

Throttled Scroll Handlers: Optimized for smooth parallax effects

Will-Change Properties: Strategic use for animation performance

Reduced Animation Complexity: Simplified animations for better performance

3. Interactive UI Components
CTA Buttons: With hover effects and animations

Feature Cards: Glassmorphism design with 3D hover effects

Progress Indicators: Animated circles and bars

Dark Mode Toggle: Custom animated switch

4. Content Sections
Hero Section: Main headline and call-to-action

Features Grid: Highlighting key application features

Stats Section: Community metrics with animations
*/

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import styled, { keyframes, css, createGlobalStyle } from 'styled-components';
import { Link } from 'react-router-dom';
import { theme } from '../theme';

// Global style to remove white margins
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html, body {
    overflow-x: hidden;
    background: #1a2233;
    margin: 0;
    padding: 0;
    min-height: 100%;
    height: 100%;
    transition: background 0.5s ease;
    will-change: background;
  }
  
  #root {
    height: 100%;
  }
`;

// **ANIMATIONS** - Simplified for better performance
const floatAnimation = keyframes`
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(2deg); }
  100% { transform: translateY(0) rotate(0deg); }
`;

const starGlow = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

const blinkStar = keyframes`
  0% { opacity: 0.1; }
  50% { opacity: 1; }
  100% { opacity: 0.1; }
`;

const orbitAnimation = keyframes`
  0% { transform: rotate(0deg) translateX(50px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(50px) rotate(-360deg); }
`;

const rocketMovement = keyframes`
  0% { transform: translateX(0) translateY(0) rotate(45deg); }
  50% { transform: translateX(0) translateY(-15px) rotate(45deg); }
  100% { transform: translateX(0) translateY(0) rotate(45deg); }
`;

const pulseGlow = keyframes`
  0% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 0.6; }
`;

const ctaPulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const iconGlow = keyframes`
  0% { filter: drop-shadow(0 0 3px rgba(0, 255, 204, 0.5)); }
  50% { filter: drop-shadow(0 0 8px rgba(0, 255, 204, 0.8)); }
  100% { filter: drop-shadow(0 0 3px rgba(0, 255, 204, 0.5)); }
`;

const neonFlicker = keyframes`
  0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% {
    opacity: 0.99;
  }
  20%, 21.999%, 63%, 63.999%, 65%, 69.999% {
    opacity: 0.4;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const glowBar = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const rotateCircle = keyframes`
  from { stroke-dashoffset: 283; }
  to { stroke-dashoffset: 0; }
`;

// 🌌 1. Deep Space Gradient Backgrounds
const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: ${props => props.darkMode 
    ? `linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)`
    : `linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)`};
  overflow: hidden;
  perspective: 1000px;
  z-index: 0;
  transition: background 0.8s ease;
  margin: 0;
  padding: 0;
  will-change: transform;
`;

// ✨ 2. Particle Starfield Animation - Reduced number of particles
const StarfieldContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: ${props => props.darkMode ? 1 : 0.5};
  transition: opacity 0.8s ease;
`;

const ParticleStar = styled.div`
  position: absolute;
  width: ${props => props.size || '2px'};
  height: ${props => props.size || '2px'};
  background: #fff;
  border-radius: 50%;
  opacity: ${props => props.opacity || 0.8};
  animation: ${props => props.twinkle ? 
    css`${blinkStar} ${props.duration || '3s'} infinite` : 
    'none'};
  animation-delay: ${props => props.delay || '0s'};
  box-shadow: 0 0 ${props => props.glow || '2px'} rgba(255, 255, 255, 0.8);
  will-change: opacity;
`;

// Gradient Overlay with improved colors
const GradientOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${props => props.darkMode
    ? `radial-gradient(circle at 20% 30%, rgba(0, 255, 204, 0.15) 0%, transparent 70%),
        radial-gradient(circle at 80% 70%, rgba(255, 215, 0, 0.1) 0%, transparent 60%)`
    : `radial-gradient(circle at 30% 50%, rgba(114, 137, 218, 0.15) 0%, transparent 70%),
        radial-gradient(circle at 70% 70%, rgba(90, 128, 244, 0.1) 0%, transparent 60%)`};
  z-index: 2;
  transition: background 0.8s ease;
`;

// Parallax Layers - Optimized for performance
const ParallaxLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: translateZ(${props => props.depth}px) scale(${props => 1 + Math.abs(props.depth)/1000});
  z-index: ${props => Math.floor(10 - Math.abs(props.depth/10))};
  will-change: transform;
`;

// Scenery
const Scenery = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40%;
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
    transition: all 0.5s ease;
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
    transition: all 0.5s ease;
  }
`;

// Enhanced Stars - Reduced number for better performance
const Star = styled.div`
  position: absolute;
  width: ${props => props.size || '30px'};
  height: ${props => props.size || '30px'};
  background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 70%);
  border-radius: 50%;
  z-index: 2;
  animation: ${props => props.blink 
    ? css`${blinkStar} ${props.blinkDuration || '7s'} infinite`
    : css`${starGlow} ${props.duration || '3s'} infinite ease-in-out`};
  animation-delay: ${props => props.delay || '0s'};
  opacity: 0.7;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.3);
  will-change: opacity;
  
  &::before {
    content: '★';
    position: absolute;
    font-size: ${props => parseInt(props.size) * 0.8 || '24px'};
    color: rgba(255, 255, 255, 0.9);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

// 🪐 4. Space Icons & Planet Motifs - Reduced for better performance
const Planet = styled.div`
  position: absolute;
  width: ${props => props.size || '80px'};
  height: ${props => props.size || '80px'};
  border-radius: 50%;
  background: ${props => props.color || 'linear-gradient(45deg, #3f5efb, #fc466b)'};
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3), inset 5px -5px 15px rgba(0, 0, 0, 0.4);
  z-index: 3;
  will-change: transform;

  &::after {
    content: '';
    position: absolute;
    width: 110%;
    height: 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    top: 50%;
    left: -5%;
    transform: translateY(-50%) rotate(30deg);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
    opacity: 0.7;
  }
`;

const Moon = styled.div`
  position: absolute;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: linear-gradient(45deg, #ddd, #fff);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  animation: ${orbitAnimation} 8s linear infinite;
  z-index: 4;
  will-change: transform;
`;

// Achievement Badge with enhanced glow
const AchievementBadge = styled.div`
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 255, 204, 0.2) 0%, rgba(0, 255, 204, 0) 70%);
  border: 2px solid rgba(0, 255, 204, 0.3);
  box-shadow: 0 0 15px rgba(0, 255, 204, 0.4), 0 0 30px rgba(0, 255, 204, 0.2);
  top: 15%;
  right: 15%;
  z-index: 2;
  animation: ${pulseGlow} 4s infinite ease-in-out;
  will-change: transform, opacity;
  
  &::before {
    content: '🏆';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 24px;
    filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.8));
  }
`;

// 🚀 Enhanced Rocket with flame - Simplified animation
const Rocket = styled.div`
  position: absolute;
  top: 30%;
  left: 15%;
  width: 50px;
  height: 50px;
  z-index: 5;
  transform-origin: center center;
  will-change: transform;
  
  &::before {
    content: '🚀';
    position: absolute;
    font-size: 28px;
    animation: ${rocketMovement} 12s infinite ease-in-out;
    filter: drop-shadow(0 0 10px rgba(255, 165, 0, 0.7));
  }
`;

// 🌠 10. Animated Progress Circle
const ProgressCircleContainer = styled.div`
  position: absolute;
  bottom: 20%;
  right: 10%;
  width: 80px;
  height: 80px;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProgressCircleSVG = styled.svg`
  width: 80px;
  height: 80px;
  transform: rotate(-90deg);
  will-change: transform;
`;

const ProgressCircleBackground = styled.circle`
  fill: none;
  stroke: rgba(0, 255, 204, 0.2);
  stroke-width: 3;
`;

const ProgressCircleForeground = styled.circle`
  fill: none;
  stroke: url(#circleGradient);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 283;
  stroke-dashoffset: 70;
  animation: ${rotateCircle} 4s ease-in-out infinite alternate;
  filter: drop-shadow(0 0 5px rgba(0, 255, 204, 0.5));
  will-change: stroke-dashoffset;
`;

const CircleText = styled.div`
  position: absolute;
  font-size: 16px;
  font-weight: bold;
  color: #00ffcc;
  text-shadow: 0 0 5px rgba(0, 255, 204, 0.8);
`;

// XP Orb with glow
const XPOrb = styled.div`
  position: absolute;
  width: 15px;
  height: 15px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.8) 30%, rgba(255, 215, 0, 0) 70%);
  border-radius: 50%;
  animation: ${floatAnimation} ${props => props.duration || '4s'} infinite ease-in-out;
  animation-delay: ${props => props.delay || '0s'};
  opacity: 0.7;
  z-index: 2;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  will-change: transform;
  
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: transparent;
    border: 1px solid rgba(255, 215, 0, 0.3);
    animation: ${pulseGlow} 2s infinite;
    filter: blur(1px);
  }
`;

// **HOME COMPONENT**
const HomeContainer = styled.div`
  min-height: 100vh;
  position: relative;
  color: ${props => props.darkMode ? '#e0e0e0' : theme.colors.text};
  padding: 2rem;
  background: transparent;
  z-index: 1;
  margin: 0;
  transition: color 0.8s ease;
`;

const HeroSection = styled.div`
  text-align: center;
  padding: 4rem 0;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
  animation: ${fadeIn} 1s ease-out;
`;

// 8. Improved Text Contrast & Highlighting
const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  text-shadow: ${props => props.darkMode 
    ? '0 0 10px rgba(0, 255, 204, 0.5), 0 0 20px rgba(0, 255, 204, 0.3)' 
    : '0 2px 10px rgba(0, 0, 0, 0.3)'};
  color: ${props => props.darkMode ? '#ffffff' : theme.colors.text};
  transition: all 0.8s ease;
  
  span {
    color: #00ffcc;
    animation: ${neonFlicker} 8s infinite;
    will-change: opacity;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
  color: ${props => props.darkMode ? '#d0d0d0' : theme.colors.text};
  transition: color 0.8s ease;
`;

// 3. Glow & Neon Effects for UI Elements
const CTAButton = styled(Link)`
  background: ${props => props.darkMode 
    ? '#00ffcc' 
    : theme.colors.secondary};
  color: ${props => props.darkMode ? '#000000' : theme.colors.text};
  padding: 1rem 2rem;
  border-radius: 30px;
  text-decoration: none;
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  margin: 1rem 0;
  animation: ${ctaPulse} 2s infinite;
  box-shadow: ${props => props.darkMode 
    ? '0 0 15px #00ffcc, 0 0 30px rgba(0, 255, 204, 0.5)' 
    : '0 4px 10px rgba(0, 0, 0, 0.2)'};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
  will-change: transform, box-shadow;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.7s ease;
    z-index: -1;
  }

  &:hover {
    transform: scale(1.05) translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25), 0 0 20px rgba(0, 255, 204, 0.6);
    
    &::before {
      left: 100%;
    }
  }
`;

const ButtonIcon = styled.span`
  margin-left: 10px;
  font-size: 1.2rem;
  animation: ${iconGlow} 2s infinite;
  will-change: filter;
`;

const CTASubtext = styled.p`
  font-size: 0.9rem;
  margin-top: 0.5rem;
  opacity: 0.8;
  font-style: italic;
  color: ${props => props.darkMode ? '#b0b0b0' : 'inherit'};
  transition: color 0.8s ease;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 4rem auto;
  position: relative;
  z-index: 10;
  animation: ${fadeIn} 1s ease-out;
  animation-delay: 0.2s;
  opacity: 0;
  animation-fill-mode: forwards;
`;

// 9. Glassmorphism for Cards
// 6. Dynamic Cards with Hover Interactions
const FeatureCard = styled.div`
  background: ${props => props.darkMode 
    ? 'rgba(17, 24, 39, 0.25)' 
    : 'rgba(255, 255, 255, 0.1)'};
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.darkMode 
    ? 'rgba(0, 255, 204, 0.2)' 
    : 'rgba(255, 255, 255, 0.2)'};
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
    box-shadow 0.4s ease, 
    background 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;
  perspective: 1000px;
  will-change: transform, box-shadow;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(120deg, 
      rgba(255, 255, 255, 0.2) 0%, 
      rgba(255, 255, 255, 0) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-10px) scale(1.02) rotateX(5deg) rotateY(-5deg);
    box-shadow: ${props => props.darkMode 
      ? '0 15px 30px rgba(0, 0, 0, 0.3), 0 0 15px rgba(0, 255, 204, 0.5)' 
      : '0 15px 30px rgba(0, 0, 0, 0.2)'};
      
    &::before {
      opacity: 1;
    }
  }
`;

// Enhanced Icons with glow
const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  filter: drop-shadow(0 0 3px rgba(0, 255, 204, 0.3));
  will-change: transform, filter;
  
  &:hover {
    transform: scale(1.3) rotate(5deg);
    animation: ${iconGlow} 2s infinite;
  }
`;

// 8. Improved Text Contrast
const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin: 1rem 0;
  color: ${props => props.darkMode ? '#00ffcc' : theme.colors.text};
  transition: color 0.8s ease;
`;

const FeatureText = styled.p`
  opacity: 0.9;
  line-height: 1.6;
  color: ${props => props.darkMode ? '#d0d0d0' : 'inherit'};
  transition: color 0.8s ease;
`;

const NavBar = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 1rem;
  z-index: 1001;
`;

// Enhanced Buttons
const LoginButton = styled(Link)`
  background: ${props => props.darkMode 
    ? 'rgba(0, 255, 204, 0.2)' 
    : theme.colors.primary};
  color: ${props => props.darkMode ? '#00ffcc' : '#FFFFFF'};
  border: ${props => props.darkMode ? '1px solid rgba(0, 255, 204, 0.5)' : 'none'};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  text-decoration: none;
  display: flex;
  align-items: center;
  box-shadow: ${props => props.darkMode 
    ? '0 0 10px rgba(0, 255, 204, 0.3)' 
    : '0 2px 5px rgba(0, 0, 0, 0.1)'};
  will-change: transform, background, box-shadow;

  &:hover {
    background: ${props => props.darkMode ? 'rgba(0, 255, 204, 0.3)' : theme.colors.accent};
    transform: translateY(-2px);
    box-shadow: ${props => props.darkMode 
      ? '0 0 15px rgba(0, 255, 204, 0.5)' 
      : '0 4px 8px rgba(0, 0, 0, 0.2)'};
  }
`;

const HomeButton = styled(Link)`
  background: ${props => props.darkMode 
    ? 'rgba(0, 255, 204, 0.2)' 
    : theme.colors.primary};
  color: ${props => props.darkMode ? '#00ffcc' : '#FFFFFF'};
  border: ${props => props.darkMode ? '1px solid rgba(0, 255, 204, 0.5)' : 'none'};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  text-decoration: none;
  display: flex;
  align-items: center;
  box-shadow: ${props => props.darkMode 
    ? '0 0 10px rgba(0, 255, 204, 0.3)' 
    : '0 2px 5px rgba(0, 0, 0, 0.1)'};
  will-change: transform, background, box-shadow;

  &:hover {
    background: ${props => props.darkMode ? 'rgba(0, 255, 204, 0.3)' : theme.colors.accent};
    transform: translateY(-2px);
    box-shadow: ${props => props.darkMode 
      ? '0 0 15px rgba(0, 255, 204, 0.5)' 
      : '0 4px 8px rgba(0, 0, 0, 0.2)'};
  }
`;

// 7. Smooth Theme Transition Toggle
const DarkModeToggle = styled.button`
  background: ${props => props.darkMode 
    ? '#000000' 
    : '#ffffff'};
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  position: relative;
  overflow: hidden;
  box-shadow: ${props => props.darkMode 
    ? '0 0 10px rgba(0, 255, 204, 0.5), inset 0 0 5px rgba(0, 255, 204, 0.5)' 
    : '0 2px 5px rgba(0, 0, 0, 0.1)'};
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 100;
  will-change: transform, box-shadow;
  
  &::before {
    content: '${props => props.darkMode ? '☀️' : '🌙'}';
    position: absolute;
    font-size: 20px;
    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    transform: ${props => props.darkMode 
      ? 'translateY(0) scale(1)' 
      : 'translateY(30px) scale(0.5)'};
    opacity: ${props => props.darkMode ? 1 : 0};
    will-change: transform, opacity;
  }
  
  &::after {
    content: '${props => props.darkMode ? '🌙' : '☀️'}';
    position: absolute;
    font-size: 20px;
    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    transform: ${props => props.darkMode 
      ? 'translateY(-30px) scale(0.5)' 
      : 'translateY(0) scale(1)'};
    opacity: ${props => props.darkMode ? 0 : 1};
    will-change: transform, opacity;
  }
  
  &:hover {
    transform: translateY(-2px) scale(1.1);
    box-shadow: ${props => props.darkMode 
      ? '0 0 20px rgba(0, 255, 204, 0.8), inset 0 0 10px rgba(0, 255, 204, 0.8)' 
      : '0 4px 8px rgba(0, 0, 0, 0.2)'};
  }
`;

// Stats Section with Glassmorphism
const StatsSection = styled.div`
  background: ${props => props.darkMode 
    ? 'rgba(17, 24, 39, 0.3)' 
    : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 15px;
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto 4rem;
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.darkMode 
    ? 'rgba(0, 255, 204, 0.2)' 
    : 'rgba(255, 255, 255, 0.2)'};
  text-align: center;
  position: relative;
  z-index: 10;
  animation: ${fadeIn} 1s ease-out;
  animation-delay: 0.6s;
  opacity: 0;
  animation-fill-mode: forwards;
  box-shadow: ${props => props.darkMode 
    ? '0 10px 30px rgba(0, 0, 0, 0.3)' 
    : '0 10px 20px rgba(0, 0, 0, 0.1)'};
  transition: all 0.3s ease;
  will-change: transform, box-shadow;
  
  &:hover {
    box-shadow: ${props => props.darkMode 
      ? '0 15px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 255, 204, 0.3)' 
      : '0 15px 30px rgba(0, 0, 0, 0.15)'};
    transform: translateY(-5px);
  }
`;

const StatsTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${props => props.darkMode ? '#ffffff' : theme.colors.text};
  text-shadow: ${props => props.darkMode 
    ? '0 0 10px rgba(0, 255, 204, 0.5)' 
    : 'none'};
  transition: all 0.8s ease;
`;

// 8. Highlight key numbers
const UserCount = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${props => props.darkMode ? '#ffd700' : theme.colors.secondary};
  margin: 1rem 0;
  position: relative;
  text-shadow: ${props => props.darkMode 
    ? '0 0 10px rgba(255, 215, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.4)' 
    : 'none'};
  transition: all 0.8s ease;
  
  &::after {
    content: "+";
    font-size: 1.5rem;
    position: absolute;
    top: 0;
  }
`;

// 10. Animated Progress Indicators
const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  background: rgba(100, 100, 100, 0.2);
  border-radius: 5px;
  overflow: hidden;
  margin: 1.5rem 0;
  position: relative;
  
  &::after {
    content: '';
    display: block;
    width: 75%;
    height: 100%;
    background: linear-gradient(90deg, #00ffcc, #ffd700, #00ffcc);
    background-size: 200% 100%;
    border-radius: 5px;
    animation: ${glowBar} 3s linear infinite;
    box-shadow: 0 0 10px rgba(0, 255, 204, 0.5);
    will-change: background-position;
  }
`;

const StatsText = styled.p`
  opacity: 0.9;
  color: ${props => props.darkMode ? '#d0d0d0' : 'inherit'};
  transition: color 0.8s ease;
  
  strong {
    color: ${props => props.darkMode ? '#00ffcc' : theme.colors.primary};
    font-weight: bold;
  }
`;

// Optimized particle generation
const generateParticles = (count) => {
  // Reduce particle count for better performance
  const optimalCount = Math.min(count, 100);
  const particles = [];
  
  for (let i = 0; i < optimalCount; i++) {
    const size = Math.random() * 3 + 1;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const opacity = Math.random() * 0.5 + 0.3;
    const delay = Math.random() * 5;
    const duration = Math.random() * 3 + 2;
    const twinkle = Math.random() > 0.7;
    const glow = Math.random() * 3 + 1;
    
    particles.push(
      <ParticleStar 
        key={i} 
        size={`${size}px`} 
        style={{ top: `${y}%`, left: `${x}%` }} 
        opacity={opacity}
        delay={`${delay}s`}
        duration={`${duration}s`}
        twinkle={twinkle}
        glow={`${glow}px`}
      />
    );
  }
  return particles;
};

const Home = () => {
  // State for dark mode toggle
  const [darkMode, setDarkMode] = useState(true);
  
  // State for parallax effect - with throttling for better performance
  const [scrollY, setScrollY] = useState(0);
  
  // State for user login simulation
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  
  // State for user count with animation
  const [userCount, setUserCount] = useState(0);
  
  // Ref for parallax container
  const parallaxRef = useRef(null);

  // Memoize particles for better performance
  const particles = useMemo(() => generateParticles(100), []);

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
  
  // Throttled scroll handler for better performance
  useEffect(() => {
    let lastScrollTime = 0;
    const scrollThreshold = 16; // ~60fps
    
    const handleScroll = () => {
      const now = performance.now();
      if (now - lastScrollTime >= scrollThreshold) {
        setScrollY(window.scrollY);
        lastScrollTime = now;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
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
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prevMode => !prevMode);
  }, []);

  return (
    <>
      {/* Add global style reset */}
      <GlobalStyle />
      
      {/* Background with Parallax */}
      <Background darkMode={darkMode} ref={parallaxRef}>
        {/* ✨ 2. Particle Starfield Animation */}
        <StarfieldContainer darkMode={darkMode}>
          {particles}
        </StarfieldContainer>
        
        <GradientOverlay darkMode={darkMode} />
        
        <ParallaxLayer depth={-50} style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
          <Star size="30px" style={{ top: '5%', left: '7%' }} duration="5s" delay="0.2s" blink blinkDuration="11s" />
          <Star size="20px" style={{ top: '12%', left: '25%' }} duration="4s" delay="0.5s" />
          <Star size="25px" style={{ top: '8%', right: '15%' }} duration="6s" delay="1s" blink blinkDuration="9s" />
        </ParallaxLayer>
        
        <ParallaxLayer depth={-30} style={{ transform: `translateY(${scrollY * 0.05}px)` }}>
          {/* 🪐 4. Space Icons & Planet Motifs */}
          <Planet 
            size="60px" 
            color="linear-gradient(45deg, #ff4757, #ff6b81)" 
            style={{ top: '20%', right: '25%' }}
          >
            <Moon style={{ top: '-8px', left: '50%' }} />
          </Planet>
          
          <Rocket />
          <AchievementBadge />
        </ParallaxLayer>
        
        <ParallaxLayer depth={-10} style={{ transform: `translateY(${scrollY * 0.02}px)` }}>
          {/* 🌠 10. Animated Progress Circle */}
          <ProgressCircleContainer>
            <ProgressCircleSVG>
              <defs>
                <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00ffcc" />
                  <stop offset="50%" stopColor="#ffd700" />
                  <stop offset="100%" stopColor="#00ffcc" />
                </linearGradient>
              </defs>
              <ProgressCircleBackground cx="40" cy="40" r="36" />
              <ProgressCircleForeground cx="40" cy="40" r="36" />
            </ProgressCircleSVG>
            <CircleText>75%</CircleText>
          </ProgressCircleContainer>
          
          <XPOrb style={{ top: '65%', left: '15%' }} duration="6s" delay="0.2s" />
          <XPOrb style={{ top: '30%', right: '35%' }} duration="5s" delay="1.2s" />
        </ParallaxLayer>
        
        <ParallaxLayer depth={0}>
          <Scenery />
        </ParallaxLayer>
      </Background>

      {/* Home Content */}
      <HomeContainer darkMode={darkMode}>
        <NavBar>
          {/* 7. Smooth Theme Transition Toggle */}
          <DarkModeToggle 
            onClick={toggleDarkMode} 
            darkMode={darkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          />
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
          <Title darkMode={darkMode}>Level Up <span>Your Life</span></Title>
          <Subtitle darkMode={darkMode}>
            Transform your daily habits into an epic journey of self-improvement.
            Track progress, earn rewards, and breakthrough your limitations!
          </Subtitle>
          <CTAButton to="/register" darkMode={darkMode}>
            Begin Your Journey
            <ButtonIcon>🚀</ButtonIcon>
          </CTAButton>
          <CTASubtext darkMode={darkMode}>Start building habits today and level up your life!</CTASubtext>
        </HeroSection>

        <StatsSection darkMode={darkMode}>
          <StatsTitle darkMode={darkMode}>Join Our Community of Achievers</StatsTitle>
          <UserCount darkMode={darkMode}>{userCount.toLocaleString()}</UserCount>
          <StatsText darkMode={darkMode}>users already leveling up daily!</StatsText>
          <ProgressBar />
          <StatsText darkMode={darkMode}>Daily active users growing <strong>15%</strong> month over month</StatsText>
        </StatsSection>

        <FeaturesGrid>
          <FeatureCard darkMode={darkMode}>
            <FeatureIcon>🎮</FeatureIcon>
            <FeatureTitle darkMode={darkMode}>Breakthrough Game</FeatureTitle>
            <FeatureText darkMode={darkMode}>
              Turn your habit-building journey into an engaging game.
              Complete challenges, earn points, and unlock achievements.
            </FeatureText>
          </FeatureCard>

          <FeatureCard darkMode={darkMode}>
            <FeatureIcon>📈</FeatureIcon>
            <FeatureTitle darkMode={darkMode}>Track Progress</FeatureTitle>
            <FeatureText darkMode={darkMode}>
              Monitor your habits with beautiful visualizations
              and detailed statistics to stay motivated.
            </FeatureText>
          </FeatureCard>

          <FeatureCard darkMode={darkMode}>
            <FeatureIcon>🏆</FeatureIcon>
            <FeatureTitle darkMode={darkMode}>Earn Rewards</FeatureTitle>
            <FeatureText darkMode={darkMode}>
              Level up and unlock real achievements as you
              build better habits and transform your life.
            </FeatureText>
          </FeatureCard>

          <FeatureCard darkMode={darkMode}>
            <FeatureIcon>👥</FeatureIcon>
            <FeatureTitle darkMode={darkMode}>Community</FeatureTitle>
            <FeatureText darkMode={darkMode}>
              Join a supportive community of people on their own
              transformation journeys. Share tips and celebrate wins!
            </FeatureText>
          </FeatureCard>
        </FeaturesGrid>
      </HomeContainer>
    </>
  );
};

export default Home;
