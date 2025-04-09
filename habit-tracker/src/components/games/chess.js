import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled, { keyframes, css, createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useHabit } from '../../context/HabitContext';

// Chess pieces (Unicode characters)
const pieces = {
  whitePawn: '♙',
  whiteRook: '♖',
  whiteKnight: '♘',
  whiteBishop: '♗',
  whiteQueen: '♕',
  whiteKing: '♔',
  blackPawn: '♟',
  blackRook: '♜',
  blackKnight: '♞',
  blackBishop: '♝',
  blackQueen: '♛',
  blackKing: '♚',
};

// Define board initialization function before it's used in useState
function initializeBoard() {
  const initialBoard = Array(8).fill().map(() => Array(8).fill(null));
  for (let col = 0; col < 8; col++) {
    initialBoard[1][col] = { type: 'pawn', color: 'white', hasMoved: false };
    initialBoard[6][col] = { type: 'pawn', color: 'black', hasMoved: false };
  }
  initialBoard[0][0] = { type: 'rook', color: 'white', hasMoved: false };
  initialBoard[0][7] = { type: 'rook', color: 'white', hasMoved: false };
  initialBoard[7][0] = { type: 'rook', color: 'black', hasMoved: false };
  initialBoard[7][7] = { type: 'rook', color: 'black', hasMoved: false };
  initialBoard[0][1] = { type: 'knight', color: 'white' };
  initialBoard[0][6] = { type: 'knight', color: 'white' };
  initialBoard[7][1] = { type: 'knight', color: 'black' };
  initialBoard[7][6] = { type: 'knight', color: 'black' };
  initialBoard[0][2] = { type: 'bishop', color: 'white' };
  initialBoard[0][5] = { type: 'bishop', color: 'white' };
  initialBoard[7][2] = { type: 'bishop', color: 'black' };
  initialBoard[7][5] = { type: 'bishop', color: 'black' };
  initialBoard[0][3] = { type: 'queen', color: 'white' };
  initialBoard[7][3] = { type: 'queen', color: 'black' };
  initialBoard[0][4] = { type: 'king', color: 'white', hasMoved: false };
  initialBoard[7][4] = { type: 'king', color: 'black', hasMoved: false };
  return initialBoard;
}

// Enhanced Space Theme
const spaceTheme = {
  deepSpace: '#0B1A2C',
  deepSpaceAlt: '#142943',
  deepSpaceLight: '#1D3A54',
  deepSpaceGradient: 'linear-gradient(135deg, #0B1A2C 0%, #142943 50%, #1D3A54 100%)',
  accentGlow: '#00FFC6',
  accentGold: '#FFD580',
  accentOrange: '#FF7F50',
  textPrimary: '#D0E7FF',
  actionButton: 'linear-gradient(90deg, #00FFC6 0%, #4A90E2 100%)',
  actionButtonAlt: 'linear-gradient(90deg, #D6416C 0%, #F5A623 100%)',
  highlight: '#FFFA81',
  highlightAlt: '#FBC638',
  calendarCell: '#1C2A4A',
  glassOverlay: 'rgba(30, 39, 73, 0.8)',
};

// Enhanced Animations
const floatAnimation = keyframes`
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(2deg); }
  100% { transform: translateY(0) rotate(0deg); }
`;

const starGlow = keyframes`
  0% { opacity: 0.6; filter: blur(1px); transform: scale(0.9); }
  50% { opacity: 1; filter: blur(0px); transform: scale(1.1); }
  100% { opacity: 0.6; filter: blur(1px); transform: scale(0.9); }
`;

const pulseGlow = keyframes`
  0% { transform: scale(1); opacity: 0.6; box-shadow: 0 0 10px ${spaceTheme.accentGlow}; }
  50% { transform: scale(1.05); opacity: 0.8; box-shadow: 0 0 20px ${spaceTheme.accentGlow}, 0 0 30px ${spaceTheme.accentGlow}; }
  100% { transform: scale(1); opacity: 0.6; box-shadow: 0 0 10px ${spaceTheme.accentGlow}; }
`;

const glowPulse = keyframes`
  0% { text-shadow: 0 0 5px ${spaceTheme.accentGlow}, 0 0 10px ${spaceTheme.accentGlow}; }
  50% { text-shadow: 0 0 20px ${spaceTheme.accentGlow}, 0 0 30px ${spaceTheme.accentGlow}; }
  100% { text-shadow: 0 0 5px ${spaceTheme.accentGlow}, 0 0 10px ${spaceTheme.accentGlow}; }
`;

const warping = keyframes`
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
`;

const orbitAnimation = keyframes`
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
`;

const blinkAnimation = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const captureAnimation = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.8; }
  100% { transform: scale(0); opacity: 0; }
`;

const moveAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const holographicTextAnimation = keyframes`
  0% { text-shadow: 0 0 4px rgba(255, 255, 255, 0.7), 0 0 8px ${spaceTheme.accentGlow}; color: ${spaceTheme.accentGlow}; }
  33% { text-shadow: 0 0 4px rgba(255, 255, 255, 0.7), 0 0 8px #4A90E2; color: #4A90E2; }
  66% { text-shadow: 0 0 4px rgba(255, 255, 255, 0.7), 0 0 8px ${spaceTheme.accentGold}; color: ${spaceTheme.accentGold}; }
  100% { text-shadow: 0 0 4px rgba(255, 255, 255, 0.7), 0 0 8px ${spaceTheme.accentGlow}; color: ${spaceTheme.accentGlow}; }
`;

// Global styles for loading fonts
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600&display=swap');
`;

// Particle Component for Effects
const Particle = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  background: ${props => props.color || spaceTheme.accentGlow};
  border-radius: 50%;
  pointer-events: none;
  z-index: 100;
  opacity: ${props => props.opacity || 1};
  animation: ${captureAnimation} ${props => props.duration || '0.6s'} forwards;
`;

// Enhanced Styled Components
const ChessboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: ${spaceTheme.deepSpaceGradient};
  color: ${spaceTheme.textPrimary};
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  font-family: 'Exo 2', sans-serif;
`;

const BackgroundOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: 
    url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='rgba(255,255,255,0.03)' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E"),
    radial-gradient(circle at 30% 50%, rgba(0, 255, 198, 0.1) 0%, transparent 70%),
    radial-gradient(circle at 70% 70%, rgba(74, 144, 226, 0.1) 0%, transparent 60%);
  z-index: 1;
`;

const OrbitRing = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 800px;
  height: 800px;
  border: 1px dashed rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  animation: ${orbitAnimation} 120s linear infinite;

  &:before {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    background: ${spaceTheme.accentGold};
    border-radius: 50%;
    top: 5%;
    left: 50%;
    box-shadow: 0 0 10px ${spaceTheme.accentGold}, 0 0 20px ${spaceTheme.accentGold};
  }
`;

const Star = styled.div`
  position: absolute;
  width: ${props => props.size || '20px'};
  height: ${props => props.size || '20px'};
  background: radial-gradient(circle, ${props => props.color || 'rgba(255, 223, 108, 0.9)'} 0%, rgba(255, 255, 255, 0) 70%);
  border-radius: 50%;
  z-index: 2;
  animation: ${starGlow} ${props => props.duration || '3s'} infinite ease-in-out;
  animation-delay: ${props => props.delay || '0s'};
  opacity: 0.7;
  
  &::before {
    content: '★';
    position: absolute;
    font-size: ${props => parseInt(props.size) * 0.8 || '16px'};
    color: ${props => props.color || 'rgba(255, 223, 108, 0.9)'};
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const GameHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;
  z-index: 10;
  position: relative;
`;

const GameTitle = styled.h1`
  font-size: 2.5rem;
  color: ${spaceTheme.accentGlow};
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 2px;
  text-shadow: 0 0 10px ${spaceTheme.accentGlow}, 0 0 20px ${spaceTheme.accentGlow};
  animation: ${glowPulse} 3s infinite ease-in-out;
  margin-bottom: 0.5rem;
`;

const SubTitle = styled.div`
  font-size: 1rem;
  color: ${spaceTheme.textPrimary};
  opacity: 0.8;
  font-family: 'Exo 2', sans-serif;
  font-weight: 300;
  letter-spacing: 1px;
`;

const Chessboard = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  width: 500px;
  height: 500px;
  border: 1px solid rgba(0, 255, 198, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 10px ${spaceTheme.accentGlow};
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  background: rgba(14, 26, 64, 0.8);
  backdrop-filter: blur(8px);
  z-index: 10;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"),
      linear-gradient(135deg, rgba(11, 26, 44, 0.9) 0%, rgba(20, 41, 67, 0.9) 100%);
    z-index: -1;
  }
`;

const cellBackgroundLight = `
  linear-gradient(135deg, rgba(29, 58, 84, 0.6) 0%, rgba(20, 41, 67, 0.6) 100%),
  repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(0, 255, 198, 0.02) 10px,
    rgba(0, 255, 198, 0.02) 20px
  )
`;

const cellBackgroundDark = `
  linear-gradient(135deg, rgba(11, 26, 44, 0.9) 0%, rgba(13, 30, 52, 0.9) 100%),
  repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(0, 255, 198, 0.01) 10px,
    rgba(0, 255, 198, 0.01) 20px
  )
`;

const Square = styled.div`
  width: 62.5px;
  height: 62.5px;
  background: ${props => (props.isEven ? cellBackgroundLight : cellBackgroundDark)};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 38px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  color: inherit;
  z-index: 1;

  /* Dynamic color based on piece */
  ${props => props.pieceColor === 'white' && css`
    color: #D0E7FF;
    text-shadow: 0 0 6px rgba(184, 255, 249, 0.7);
  `}

  ${props => props.pieceColor === 'black' && css`
    color: ${spaceTheme.accentGold};
    text-shadow: 0 0 6px rgba(255, 213, 128, 0.7);
  `}

  ${props => !props.isComputerTurn && !props.isGameOver && css`
    &:hover {
      transform: scale(1.02);
      box-shadow: inset 0 0 12px ${spaceTheme.accentGlow};
      z-index: 5;
    }
  `}

  /* FIX: Modified the selected style to prevent persistence issues */
  ${props => props.isSelected && !props.isGameOver && css`
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border: 3px solid ${spaceTheme.accentGlow};
      box-shadow: inset 0 0 12px ${spaceTheme.accentGlow}, 0 0 12px ${spaceTheme.accentGlow};
      pointer-events: none;
      z-index: 2;
      animation: ${pulseGlow} 2s infinite ease-in-out;
    }
  `}

  /* FIX: Added conditions to prevent valid move indicators from persisting */
  ${props => props.isValidMove && !props.isGameOver && !props.isComputerTurn && css`
    & > .valid-move-indicator {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: rgba(0, 255, 198, 0.3);
      border: 1px solid rgba(0, 255, 198, 0.6);
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 2;
      box-shadow: 0 0 12px ${spaceTheme.accentGlow};
      animation: ${pulseGlow} 2s infinite ease-in-out;
    }
  `}

  ${props => props.isLastMove && css`
    background: ${props.isEven 
      ? 'linear-gradient(135deg, rgba(29, 58, 84, 0.8) 0%, rgba(0, 249, 255, 0.15) 100%)'
      : 'linear-gradient(135deg, rgba(11, 26, 44, 0.9) 0%, rgba(0, 249, 255, 0.2) 100%)'
    };
    box-shadow: inset 0 0 10px rgba(0, 249, 255, 0.15);
  `}

  ${props => props.animateMove && css`
    animation: ${moveAnimation} 0.3s ease-out;
  `}
`;

const GameInfo = styled.div`
  display: flex;
  justify-content: space-between;
  width: 500px;
  margin-top: 1.5rem;
  z-index: 10;
`;

const TurnIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  background: rgba(11, 26, 44, 0.85);
  padding: 0.75rem 1.2rem;
  border-radius: 12px;
  border: 1px solid rgba(0, 255, 198, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  margin-bottom: 1rem;
  z-index: 5;
  
  ${props => props.isPlayerTurn && css`
    animation: ${holographicTextAnimation} 6s infinite linear;
    border: 1px solid ${spaceTheme.accentGlow};
  `}

  &:before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(0, 255, 198, 0.1) 0%, transparent 60%);
    z-index: -1;
  }

  ${props => props.isComputerTurn && css`
    &:after {
      content: '•';
      margin-left: 0.3rem;
      font-size: 2rem;
      line-height: 0;
      position: relative;
      top: 0.1rem;
      color: ${spaceTheme.accentOrange};
      animation: ${blinkAnimation} 1s infinite;
    }
  `}
`;

const PlayerScore = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  background: rgba(11, 26, 44, 0.85);
  padding: 0.75rem 1.2rem;
  border-radius: 12px;
  border: 1px solid rgba(0, 255, 198, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '✦';
    color: ${spaceTheme.accentGold};
    margin-right: 0.5rem;
    font-size: 1.4rem;
  }
`;

const ScoreValue = styled.span`
  color: ${spaceTheme.accentGold};
  font-weight: 700;
  text-shadow: 0 0 5px rgba(255, 213, 128, 0.7);
`;

const ScoreChangeIndicator = styled.span`
  position: absolute;
  color: ${props => props.positive ? spaceTheme.accentGlow : spaceTheme.accentOrange};
  font-weight: bold;
  font-size: 1.2rem;
  top: -20px;
  right: 10px;
  opacity: 0;
  animation: ${captureAnimation} 1.5s forwards;
  animation-delay: ${props => props.delay || '0s'};
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  z-index: 10;
`;

const Button = styled.button`
  background: ${props => props.primary ? spaceTheme.actionButton : spaceTheme.actionButtonAlt};
  color: ${spaceTheme.deepSpace};
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  font-family: 'Orbitron', sans-serif;
  transition: all 0.3s;
  box-shadow: 0 0 10px rgba(0, 249, 255, 0.3);
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 60%);
    transform: rotate(45deg);
    transition: all 0.3s;
    z-index: 1;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 15px rgba(50, 255, 192, 0.5);
    
    &:before {
      transform: rotate(45deg) translate(10%, 10%);
    }
  }

  &:active {
    transform: translateY(1px);
  }
  
  span {
    position: relative;
    z-index: 2;
  }
`;

const CapturedPiecesContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 500px;
  margin-top: 1rem;
  z-index: 10;
`;

const CapturedPiecesList = styled.div`
  display: flex;
  gap: 0.25rem;
  background: rgba(11, 26, 44, 0.7);
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(0, 255, 198, 0.2);
  min-height: 1.5rem;
  min-width: 240px;
  position: relative;
  
  &:before {
    content: '${props => props.label}';
    position: absolute;
    top: -8px;
    left: 10px;
    font-size: 0.7rem;
    background: rgba(11, 26, 44, 0.9);
    padding: 0 0.5rem;
    border-radius: 4px;
    color: ${props => props.listColor === 'black' ? spaceTheme.accentGlow : spaceTheme.accentOrange};
  }
`;

const CapturedPiece = styled.div`
  font-size: 20px;
  color: ${props => props.pieceColor === 'white' ? spaceTheme.textPrimary : spaceTheme.accentGold};
  text-shadow: ${props => props.pieceColor === 'white' 
    ? '0 0 6px rgba(184, 255, 249, 0.5)' 
    : '0 0 6px rgba(255, 213, 128, 0.5)'};
  
  ${props => props.isNew && css`
    animation: ${captureAnimation} 0.6s reverse;
  `}
`;

const GameOverModal = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(11, 26, 44, 0.9);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid rgba(0, 255, 198, 0.3);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 100;
  min-width: 300px;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3), 0 0 20px ${props => props.victory ? spaceTheme.accentGlow : spaceTheme.accentOrange};
  animation: ${css`${warping} 0.3s ease-out`};
`;

const GameOverText = styled.h2`
  font-size: 2.2rem;
  margin-bottom: 1rem;
  color: ${props => props.victory ? spaceTheme.accentGlow : spaceTheme.accentOrange};
  font-family: 'Orbitron', sans-serif;
  text-shadow: 0 0 10px ${props => props.victory ? spaceTheme.accentGlow : spaceTheme.accentOrange};
  animation: ${glowPulse} 3s infinite ease-in-out;
`;

const PointsEarned = styled.p`
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  color: ${spaceTheme.accentGold};
  text-shadow: 0 0 8px rgba(255, 213, 128, 0.7);
  
  &:before {
    content: '✦';
    margin-right: 0.5rem;
  }
`;

const RankBadge = styled.div`
  margin-bottom: 1.5rem;
  background: rgba(0, 255, 198, 0.1);
  border: 1px solid ${spaceTheme.accentGlow};
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  color: ${spaceTheme.accentGlow};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:before {
    content: '🏆';
    font-size: 1.2rem;
  }
`;

const CoordinateLabel = styled.div`
  position: absolute;
  font-size: 10px;
  color: ${spaceTheme.textPrimary};
  opacity: 0.6;
  font-weight: bold;
  
  ${props => props.corner === 'topleft' && `
    top: 2px;
    left: 2px;
  `}
  
  ${props => props.corner === 'bottomright' && `
    bottom: 2px;
    right: 2px;
  `}
`;

const WinStreak = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(11, 26, 44, 0.85);
  border: 1px solid ${props => props.streak >= 3 ? spaceTheme.accentGold : 'rgba(0, 255, 198, 0.2)'};
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.streak >= 3 ? spaceTheme.accentGold : spaceTheme.textPrimary};
  box-shadow: ${props => props.streak >= 3 ? '0 0 10px rgba(255, 213, 128, 0.3)' : 'none'};
  
  ${props => props.streak >= 3 && css`
    animation: ${pulseGlow} 3s infinite ease-in-out;
  `}
  
  &:before {
    content: '🔥';
  }
`;

const MovesHistory = styled.div`
  position: absolute;
  top: 60px;
  right: 10px;
  background: rgba(11, 26, 44, 0.85);
  border: 1px solid rgba(0, 255, 198, 0.2);
  border-radius: 8px;
  padding: 0.5rem;
  font-size: 0.8rem;
  width: 120px;
  max-height: 150px;
  overflow-y: auto;
  color: ${spaceTheme.textPrimary};
  
  &::-webkit-scrollbar {
    width: 5px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(11, 26, 44, 0.5);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 255, 198, 0.3);
    border-radius: 10px;
  }
`;

const MoveItem = styled.div`
  padding: 0.2rem 0;
  border-bottom: 1px solid rgba(0, 255, 198, 0.1);
  display: flex;
  justify-content: space-between;
  
  &:last-child {
    border-bottom: none;
    color: ${spaceTheme.accentGlow};
  }
`;

// Chess Game Component with Enhanced Features
const Chess = () => {
  const navigate = useNavigate();
  const { updateProgress } = useHabit();
  const [board, setBoard] = useState(initializeBoard());
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [capturedPieces, setCapturedPieces] = useState({ white: [], black: [] });
  const [newCapturedPiece, setNewCapturedPiece] = useState(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [scoreChange, setScoreChange] = useState(null);
  const [gameStatus, setGameStatus] = useState(null);
  const [isComputerTurn, setIsComputerTurn] = useState(false);
  const [lastMove, setLastMove] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [particles, setParticles] = useState([]);
  const [winStreak, setWinStreak] = useState(0);
  const [movesHistory, setMovesHistory] = useState([]);
  const [animatedSquare, setAnimatedSquare] = useState(null);
  const boardRef = useRef(null);
  const animationTimeoutRef = useRef(null); // FIX: Added ref to keep track of timeouts

  // Play sound effect when component mounts and clean up
  useEffect(() => {
    // Clean up valid moves to avoid stale state
    setValidMoves([]);
    setSelectedPiece(null);
    
    // Debug pieces rendering to console
    console.log("Pieces object:", pieces);
    const samplePieceKeys = ['whitePawn', 'blackQueen']; 
    samplePieceKeys.forEach(key => console.log(`Piece key ${key}:`, pieces[key]));
    
    return () => {
      // FIX: Clean up any remaining animation timeouts when component unmounts
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      
      // Clear all state to prevent persistence
      setSelectedPiece(null);
      setValidMoves([]);
      setAnimatedSquare(null);
    };
  }, []);

  // FIX: Added effect to clear selection when computer turns or game state changes
  useEffect(() => {
    // Clear selections and valid moves when game status changes or computer turn starts
    if (gameStatus !== null || isComputerTurn) {
      setValidMoves([]);
      setSelectedPiece(null);
    }
  }, [gameStatus, isComputerTurn]);

  // Sound Effects (simulated)
  const playSoundEffect = (effectType) => {
    // In a real implementation, you would play actual sound files here
    console.log(`Playing sound effect: ${effectType}`);
    // For example: new Audio('/sounds/${effectType}.mp3').play();
  };

  function initializeBoard() {
    const initialBoard = Array(8).fill().map(() => Array(8).fill(null));
    for (let col = 0; col < 8; col++) {
      initialBoard[1][col] = { type: 'pawn', color: 'white', hasMoved: false };
      initialBoard[6][col] = { type: 'pawn', color: 'black', hasMoved: false };
    }
    initialBoard[0][0] = { type: 'rook', color: 'white', hasMoved: false };
    initialBoard[0][7] = { type: 'rook', color: 'white', hasMoved: false };
    initialBoard[7][0] = { type: 'rook', color: 'black', hasMoved: false };
    initialBoard[7][7] = { type: 'rook', color: 'black', hasMoved: false };
    initialBoard[0][1] = { type: 'knight', color: 'white' };
    initialBoard[0][6] = { type: 'knight', color: 'white' };
    initialBoard[7][1] = { type: 'knight', color: 'black' };
    initialBoard[7][6] = { type: 'knight', color: 'black' };
    initialBoard[0][2] = { type: 'bishop', color: 'white' };
    initialBoard[0][5] = { type: 'bishop', color: 'white' };
    initialBoard[7][2] = { type: 'bishop', color: 'black' };
    initialBoard[7][5] = { type: 'bishop', color: 'black' };
    initialBoard[0][3] = { type: 'queen', color: 'white' };
    initialBoard[7][3] = { type: 'queen', color: 'black' };
    initialBoard[0][4] = { type: 'king', color: 'white', hasMoved: false };
    initialBoard[7][4] = { type: 'king', color: 'black', hasMoved: false };
    return initialBoard;
  }

  const getPieceSymbol = (piece) => {
    if (!piece) return null;
    const pieceKey = `${piece.color}${piece.type.charAt(0).toUpperCase()}${piece.type.slice(1)}`;
    return pieces[pieceKey] || '?'; // Provide fallback for missing symbols
  };

  // Convert board position to algebraic notation
  const toAlgebraic = (row, col) => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    return `${files[col]}${8 - row}`;
  };

  // Add move to history
  const addMoveToHistory = (fromRow, fromCol, toRow, toCol, piece, capture) => {
    const pieceSymbols = {
      pawn: '', 
      knight: 'N', 
      bishop: 'B', 
      rook: 'R', 
      queen: 'Q', 
      king: 'K'
    };
    
    const from = toAlgebraic(fromRow, fromCol);
    const to = toAlgebraic(toRow, toCol);
    const pieceSymbol = pieceSymbols[piece.type];
    const moveText = `${pieceSymbol}${capture ? 'x' : ''}${to}`;
    
    setMovesHistory(prev => [...prev, {
      move: moveText,
      color: piece.color,
    }]);
  };

  // Calculate valid moves for a piece
  function calculateValidMoves(row, col) {
    const piece = board[row][col];
    if (!piece) return [];
    const moves = [];
    const color = piece.color;
    const isWhite = color === 'white';

    const addMoveIfValid = (r, c) => {
      if (r < 0 || r > 7 || c < 0 || c > 7) return false;
      const targetPiece = board[r][c];
      if (!targetPiece) {
        moves.push([r, c]);
        return true;
      } else if (targetPiece.color !== color) {
        moves.push([r, c]);
        return false;
      }
      return false;
    };

    if (piece.type === 'pawn') {
      const direction = isWhite ? 1 : -1;
      if (row + direction >= 0 && row + direction <= 7 && !board[row + direction][col]) {
        moves.push([row + direction, col]);
        if (!piece.hasMoved && row + 2 * direction >= 0 && row + 2 * direction <= 7 && !board[row + 2 * direction][col]) {
          moves.push([row + 2 * direction, col]);
        }
      }
      if (col > 0 && row + direction >= 0 && row + direction <= 7) {
        const leftDiag = board[row + direction][col - 1];
        if (leftDiag && leftDiag.color !== color) {
          moves.push([row + direction, col - 1]);
        }
      }
      if (col < 7 && row + direction >= 0 && row + direction <= 7) {
        const rightDiag = board[row + direction][col + 1];
        if (rightDiag && rightDiag.color !== color) {
          moves.push([row + direction, col + 1]);
        }
      }
    }

    if (piece.type === 'rook' || piece.type === 'queen') {
      for (let r = row - 1; r >= 0; r--) if (!addMoveIfValid(r, col)) break;
      for (let r = row + 1; r <= 7; r++) if (!addMoveIfValid(r, col)) break;
      for (let c = col - 1; c >= 0; c--) if (!addMoveIfValid(row, c)) break;
      for (let c = col + 1; c <= 7; c++) if (!addMoveIfValid(row, c)) break;
    }

    if (piece.type === 'bishop' || piece.type === 'queen') {
      for (let r = row - 1, c = col - 1; r >= 0 && c >= 0; r--, c--) if (!addMoveIfValid(r, c)) break;
      for (let r = row - 1, c = col + 1; r >= 0 && c <= 7; r--, c++) if (!addMoveIfValid(r, c)) break;
      for (let r = row + 1, c = col - 1; r <= 7 && c >= 0; r++, c--) if (!addMoveIfValid(r, c)) break;
      for (let r = row + 1, c = col + 1; r <= 7 && c <= 7; r++, c++) if (!addMoveIfValid(r, c)) break;
    }

    if (piece.type === 'knight') {
      const knightMoves = [
        [row - 2, col - 1], [row - 2, col + 1], [row - 1, col - 2], [row - 1, col + 2],
        [row + 1, col - 2], [row + 1, col + 2], [row + 2, col - 1], [row + 2, col + 1]
      ];
      knightMoves.forEach(([r, c]) => {
        if (r >= 0 && r <= 7 && c >= 0 && c <= 7) {
          const targetPiece = board[r][c];
          if (!targetPiece || targetPiece.color !== color) moves.push([r, c]);
        }
      });
    }

    if (piece.type === 'king') {
      const kingMoves = [
        [row - 1, col - 1], [row - 1, col], [row - 1, col + 1],
        [row, col - 1], [row, col + 1],
        [row + 1, col - 1], [row + 1, col], [row + 1, col + 1]
      ];
      kingMoves.forEach(([r, c]) => {
        if (r >= 0 && r <= 7 && c >= 0 && c <= 7) {
          const targetPiece = board[r][c];
          if (!targetPiece || targetPiece.color !== color) moves.push([r, c]);
        }
      });
    }

    return moves;
  };

  function createCaptureParticles(row, col) {
    if (!boardRef.current) return;
    
    const rect = boardRef.current.getBoundingClientRect();
    const squareSize = rect.width / 8;
    const offsetX = rect.left + col * squareSize + squareSize / 2;
    const offsetY = rect.top + (7 - row) * squareSize + squareSize / 2;
    
    const newParticles = [];
    const colors = [spaceTheme.accentGlow, spaceTheme.accentGold, '#ffffff'];
    
    for (let i = 0; i < 8; i++) {
      const id = `particle-${Date.now()}-${i}`;
      const top = offsetY + (Math.random() * 20 - 10);
      const left = offsetX + (Math.random() * 20 - 10);
      const duration = 0.5 + Math.random() * 0.5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      newParticles.push({
        id,
        top, 
        left,
        duration,
        color
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);
    
    // Clean up particles after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1000);
  };

  // Enhanced move function with effects
  function makeMove(fromRow, fromCol, toRow, toCol) {
    // FIX: Clear any existing animation timeouts to prevent overlap
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    // FIX: Clear selected piece and valid moves immediately to stop glowing
    setSelectedPiece(null);
    setValidMoves([]);
    
    const newBoard = [...board.map(row => [...row])];
    const movingPiece = { ...newBoard[fromRow][fromCol] };
    const capturedPiece = newBoard[toRow][toCol];
    let scoreBonus = 0;
    
    // Play move sound
    playSoundEffect(capturedPiece ? 'capture' : 'move');
    
    if (capturedPiece) {
      // Score values for different pieces
      const pieceValues = {
        pawn: 1,
        knight: 3,
        bishop: 3,
        rook: 5,
        queen: 9,
        king: 20
      };
      
      scoreBonus = pieceValues[capturedPiece.type] || 0;
      
      // Create capture effect
      createCaptureParticles(toRow, toCol);
      
      setCapturedPieces(prev => ({
        ...prev,
        [capturedPiece.color === 'white' ? 'white' : 'black']: [...prev[capturedPiece.color === 'white' ? 'white' : 'black'], capturedPiece]
      }));
      
      setNewCapturedPiece({
        piece: capturedPiece,
        timestamp: Date.now()
      });
      
      if (capturedPiece.type === 'king') {
        if (capturedPiece.color === 'black') {
          setGameStatus('victory');
          scoreBonus += 10; // Bonus for winning
          setWinStreak(prev => prev + 1);
          playSoundEffect('victory');
          // Extra bonus for streak
          if (winStreak + 1 >= 3) {
            scoreBonus += 5;
          }
          updateProgress('games', 10 + scoreBonus);
        } else {
          setGameStatus('defeat');
          setWinStreak(0);
          playSoundEffect('defeat');
        }
      }
    } else {
      playSoundEffect('move');
    }

    if (scoreBonus > 0) {
      setPlayerScore(prevScore => prevScore + scoreBonus);
      setScoreChange({ value: `+${scoreBonus}`, timestamp: Date.now() });
    }

    if (movingPiece.type === 'pawn' || movingPiece.type === 'king' || movingPiece.type === 'rook') {
      movingPiece.hasMoved = true;
    }

    // Add move to history
    addMoveToHistory(fromRow, fromCol, toRow, toCol, movingPiece, !!capturedPiece);

    // Pawn promotion with improved UI
    if (movingPiece.type === 'pawn' && (toRow === 7 || toRow === 0)) {
      const promotionOptions = ['queen', 'rook', 'bishop', 'knight'];
      const promotionChoice = window.prompt(
        "⭐ Promote your pawn! Choose: queen, rook, bishop, knight", 
        "queen"
      );
      
      movingPiece.type = promotionOptions.includes(promotionChoice) ? promotionChoice : 'queen';
      playSoundEffect('promotion');
      
      // Bonus for promotion
      if (movingPiece.color === 'white') {
        setPlayerScore(prevScore => prevScore + 2);
        setScoreChange({ value: '+2', timestamp: Date.now() });
      }
    }

    newBoard[toRow][toCol] = movingPiece;
    newBoard[fromRow][fromCol] = null;
    setBoard(newBoard);
    setLastMove([fromRow, fromCol, toRow, toCol]);
    setAnimatedSquare([toRow, toCol]);
    
    // FIX: Store timeout reference for cleanup and use a ref to avoid state closure issues
    animationTimeoutRef.current = setTimeout(() => {
      setAnimatedSquare(null);
      animationTimeoutRef.current = null;
    }, 300);
    
    return newBoard;
  }

  function handleSquareClick(row, col) {
    // FIX: Added early return if game is over or computer is thinking
    if (isComputerTurn || gameStatus !== null) {
      return;
    }
    
    if (!selectedPiece) {
      const piece = board[row][col];
      if (piece && piece.color === 'white') {
        setSelectedPiece([row, col]);
        setValidMoves(calculateValidMoves(row, col));
        playSoundEffect('select');
      } else {
        // Clear valid moves if clicking an empty square or opponent's piece
        setValidMoves([]);
      }
    } else {
      const [selectedRow, selectedCol] = selectedPiece;
      const isValidMove = validMoves.some(([r, c]) => r === row && c === col);

      if (isValidMove) {
        makeMove(selectedRow, selectedCol, row, col);
        // FIX: These are now handled in makeMove to ensure they're cleared immediately
        // setSelectedPiece(null);
        // setValidMoves([]);
        setIsWhiteTurn(false);
        setIsComputerTurn(true);
      } else if (board[row][col] && board[row][col].color === 'white') {
        // If clicking another white piece, select it instead
        setSelectedPiece([row, col]);
        setValidMoves(calculateValidMoves(row, col));
        playSoundEffect('select');
      } else {
        // Clear selection if clicking an invalid move
        setSelectedPiece(null);
        setValidMoves([]);
      }
    }
  };

  function makeComputerMove() {
    setIsThinking(true);
    setTimeout(() => {
      // FIX: Clear any lingering selection state
      setSelectedPiece(null);
      setValidMoves([]);
      
      const possibleMoves = [];
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const piece = board[row][col];
          if (piece && piece.color === 'black') {
            const moves = calculateValidMoves(row, col);
            moves.forEach(([toRow, toCol]) => {
              let score = 0;
              const target = board[toRow][toCol];
              if (target) {
                switch (target.type) {
                  case 'queen': score += 9; break;
                  case 'rook': score += 5; break;
                  case 'bishop':
                  case 'knight': score += 3; break;
                  case 'pawn': score += 1; break;
                  case 'king': score += 100; break;
                }
              }
              
              // Add positional scoring for more sophisticated AI
              if (piece.type === 'pawn') {
                // Pawns are more valuable as they advance
                score += 0.1 * (7 - toRow);
              }
              
              // Center control bonus
              if ((toRow === 3 || toRow === 4) && (toCol === 3 || toCol === 4)) {
                score += 0.3;
              }
              
              // Add randomness for different difficulty levels
              score += Math.random() * 0.5;
              
              possibleMoves.push({ from: [row, col], to: [toRow, toCol], score });
            });
          }
        }
      }

      if (possibleMoves.length > 0) {
        possibleMoves.sort((a, b) => b.score - a.score);
        
        // Use a distribution that favors better moves but still has variety
        const moveIndex = Math.floor(Math.pow(Math.random(), 2) * Math.min(possibleMoves.length, 5));
        const move = possibleMoves[moveIndex];
        
        const [fromRow, fromCol] = move.from;
        const [toRow, toCol] = move.to;
        
        makeMove(fromRow, fromCol, toRow, toCol);
        setIsWhiteTurn(true);
        setIsComputerTurn(false);
        setIsThinking(false);
      } else {
        setGameStatus('victory');
        const bonusPoints = 15; // Higher bonus for checkmate
        setPlayerScore(prevScore => prevScore + bonusPoints);
        setScoreChange({ value: `+${bonusPoints}`, timestamp: Date.now() });
        setWinStreak(prev => prev + 1);
        setIsThinking(false);
        setIsComputerTurn(false);
        updateProgress('games', bonusPoints);
      }
    }, 800);
  };

  useEffect(() => {
    if (isComputerTurn && gameStatus === null) {
      makeComputerMove();
    }

    // FIX: Clear valid moves when it's not the player's turn
    if (!isWhiteTurn || isComputerTurn) {
      setValidMoves([]);
      setSelectedPiece(null);
    }
  }, [isComputerTurn, gameStatus, isWhiteTurn]);

  function resetBoard() {
    // FIX: Clear any existing animation timeouts
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
    
    setBoard(initializeBoard());
    setSelectedPiece(null);
    setValidMoves([]);
    setIsWhiteTurn(true);
    setCapturedPieces({ white: [], black: [] });
    setIsComputerTurn(false);
    setGameStatus(null);
    setLastMove(null);
    setMovesHistory([]);
    setParticles([]);
    setNewCapturedPiece(null);
    setScoreChange(null);
    setAnimatedSquare(null);
    playSoundEffect('reset');
  };

  const navigateBack = () => {
    navigate('/breakthrough-game');
  };

  const getCurrentRank = () => {
    if (playerScore >= 50) return 'Astro Grandmaster';
    if (playerScore >= 30) return 'Space Commander';
    if (playerScore >= 20) return 'Cosmic Strategist';
    if (playerScore >= 10) return 'Star Captain';
    return 'Space Cadet';
  };

  const renderBoard = () => {
    const squares = [];
    for (let row = 7; row >= 0; row--) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        const isEven = (row + col) % 2 === 0;
        const isSelected = selectedPiece && selectedPiece[0] === row && selectedPiece[1] === col;
        const isValidMove = validMoves.some(([r, c]) => r === row && c === col);
        const isLastMoveSquare = lastMove && 
          ((row === lastMove[0] && col === lastMove[1]) || (row === lastMove[2] && col === lastMove[3]));
        const isAnimated = animatedSquare && row === animatedSquare[0] && col === animatedSquare[1];

        squares.push(
          <Square
            key={`${row},${col}`}
            isEven={isEven}
            isSelected={isSelected}
            isValidMove={isValidMove}
            isLastMove={isLastMoveSquare}
            isComputerTurn={isComputerTurn}
            isGameOver={gameStatus !== null}
            animateMove={isAnimated}
            pieceColor={piece?.color}
            onClick={() => handleSquareClick(row, col)}
          >
            {getPieceSymbol(piece)}
            {isValidMove && <div className="valid-move-indicator" />}
            {col === 0 && <CoordinateLabel corner="bottomright">{8 - row}</CoordinateLabel>}
            {row === 7 && <CoordinateLabel corner="topleft">{String.fromCharCode(97 + col)}</CoordinateLabel>}
          </Square>
        );
      }
    }
    return squares;
  };

  const renderCapturedPieces = (color) => {
    return capturedPieces[color].map((piece, index) => {
      const isNew = newCapturedPiece && 
                   newCapturedPiece.piece.color === piece.color && 
                   index === capturedPieces[color].length - 1;
      
      return (
        <CapturedPiece 
          key={index} 
          pieceColor={piece.color}
          isNew={isNew}
        >
          {getPieceSymbol(piece)}
        </CapturedPiece>
      );
    });
  };

  const renderParticles = () => {
    return particles.map(particle => (
      <Particle
        key={particle.id}
        style={{
          top: particle.top,
          left: particle.left,
        }}
        color={particle.color}
        duration={`${particle.duration}s`}
      />
    ));
  };

  const renderMovesHistory = () => {
    if (movesHistory.length === 0) return null;
    
    return (
      <MovesHistory>
        {movesHistory.slice(-8).map((move, index) => (
          <MoveItem key={index}>
            <span>{Math.floor(index/2) + 1}.</span>
            <span>{move.move}</span>
          </MoveItem>
        ))}
      </MovesHistory>
    );
  };

  const renderGameOverModal = () => {
    if (!gameStatus) return null;
    
    const isVictory = gameStatus === 'victory';
    const pointsEarned = isVictory ? (winStreak >= 3 ? 15 : 10) : 0;
    
    return (
      <GameOverModal victory={isVictory}>
        <GameOverText victory={isVictory}>
          {isVictory ? 'Victory!' : 'Defeat!'}
        </GameOverText>
        {isVictory && (
          <>
            <PointsEarned>{pointsEarned} Points</PointsEarned>
            <RankBadge>{getCurrentRank()}</RankBadge>
          </>
        )}
        <Button primary onClick={resetBoard}>
          <span>Play Again</span>
        </Button>
      </GameOverModal>
    );
  };

  return (
    <ChessboardContainer>
      <GlobalStyle />
      <BackgroundOverlay />
      <OrbitRing />
      
      {/* Background stars */}
      <Star size="20px" style={{ top: '10%', left: '10%' }} duration="4s" delay="0.5s" color="rgba(255, 223, 108, 0.9)" />
      <Star size="15px" style={{ top: '25%', left: '25%' }} duration="3s" delay="1s" color="rgba(0, 255, 198, 0.9)" />
      <Star size="25px" style={{ top: '15%', right: '30%' }} duration="5s" delay="0.2s" color="rgba(74, 144, 226, 0.9)" />
      <Star size="18px" style={{ top: '75%', left: '15%' }} duration="4.5s" delay="1.5s" color="rgba(255, 223, 108, 0.9)" />
      <Star size="22px" style={{ top: '65%', right: '15%' }} duration="3.5s" delay="0.7s" color="rgba(0, 255, 198, 0.9)" />
      
      <GameHeader>
        <GameTitle>Cosmic Chess</GameTitle>
        <SubTitle>Galactic Strategy Arena</SubTitle>
      </GameHeader>
      
      {winStreak > 0 && (
        <WinStreak streak={winStreak}>
          Win Streak: {winStreak}
        </WinStreak>
      )}
      
      {renderMovesHistory()}
      
      <TurnIndicator isPlayerTurn={isWhiteTurn && !isComputerTurn} isComputerTurn={isComputerTurn}>
        {isComputerTurn ? 'Computer is thinking' : '🛰️ Your Move, Commander'}
      </TurnIndicator>
      
      <CapturedPiecesContainer>
        <CapturedPiecesList label="Captured" listColor="black">{renderCapturedPieces('black')}</CapturedPiecesList>
        <CapturedPiecesList label="Lost" listColor="white">{renderCapturedPieces('white')}</CapturedPiecesList>
      </CapturedPiecesContainer>
      
      <Chessboard ref={boardRef}>
        {renderBoard()}
        {renderParticles()}
        {renderGameOverModal()}
      </Chessboard>
      
      <GameInfo>
        <TurnIndicator>{isWhiteTurn ? 'White\'s Turn' : 'Black\'s Turn'}</TurnIndicator>
        <PlayerScore>
          Score: <ScoreValue>{playerScore}</ScoreValue>
          {scoreChange && (
            <ScoreChangeIndicator positive={true} delay="0s">
              {scoreChange.value}
            </ScoreChangeIndicator>
          )}
        </PlayerScore>
      </GameInfo>
      
      <ButtonsContainer>
        <Button primary onClick={resetBoard}>
          <span>Reset Game</span>
        </Button>
        <Button onClick={navigateBack}>
          <span>Back to Breakthrough</span>
        </Button>
      </ButtonsContainer>
    </ChessboardContainer>
  );
};

export default Chess;
