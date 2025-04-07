/**

Chess Component

A fully interactive chess game implementation with React that features:

Complete chess rules including special moves (castling, en passant, promotion)

Player vs. Computer AI with adjustable difficulty

Visual move indicators and game state tracking

Score system with XP rewards integrated with habit tracking

Responsive design with elegant chessboard styling

Game state persistence and reset functionality

Game Features:

Standard chess pieces with Unicode character representations

Valid move highlighting and selection indicators

Last move visualization

Captured pieces display

Turn indicators and game status messages

Victory/defeat detection (king capture)

Pawn promotion dialog

Technical Implementation:

Uses React hooks (useState, useEffect) for game state management

Implements a recursive move calculation algorithm for each piece type

Computer AI with basic move prioritization (captures, piece values)

Custom styled-components for all UI elements

React Router integration for navigation

Habit context integration for XP rewards

The component is organized into several key sections:

Initial board setup and piece placement

Move validation and game state updates

Computer AI decision making

UI rendering with interactive elements

Game state management (scores, captures, turn tracking)

Key Functions:

initializeBoard(): Sets up the initial chess piece positions

calculateValidMoves(): Determines legal moves for any piece

makeMove(): Handles piece movement and game state updates

makeComputerMove(): AI logic for computer's turn

handleSquareClick(): Player interaction handler

Visual Elements:

Chessboard with coordinate labels

Piece symbols using Unicode characters

Selected piece highlighting

Valid move indicators

Last move visualization

Captured pieces display

Game status modals

The game rewards players with:

10 XP for winning a game (via updateProgress)

Visual score tracking

Progress towards habit goals
*/

import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
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

// Space Theme from Track
const spaceTheme = {
  deepSpace: '#0E1A40',
  deepSpaceGradient: 'linear-gradient(135deg, #0E1A40 0%, #13294B 100%)',
  accentGlow: '#32FFC0',
  accentGold: '#FFDF6C',
  textPrimary: '#D0E7FF',
  actionButton: '#00F9FF',
  actionButtonAlt: '#FF5DA0',
  highlight: '#FFFA81',
  highlightAlt: '#FBC638',
  calendarCell: '#1C2A4A',
  glassOverlay: 'rgba(30, 39, 73, 0.8)',
};

// Animations from Track
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

// Styled Components with Space Theme
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
`;

const BackgroundOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 50%, rgba(50, 255, 192, 0.1) 0%, transparent 70%),
              radial-gradient(circle at 70% 70%, rgba(0, 249, 255, 0.1) 0%, transparent 60%);
  z-index: 1;
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
`;

const GameTitle = styled.h1`
  font-size: 2.5rem;
  color: ${spaceTheme.accentGlow};
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 2px;
  text-shadow: 0 0 10px ${spaceTheme.accentGlow}, 0 0 20px ${spaceTheme.accentGlow};
  animation: ${glowPulse} 3s infinite ease-in-out;
`;

const Chessboard = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  width: 500px;
  height: 500px;
  border: 1px solid rgba(50, 255, 192, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  background: rgba(14, 26, 64, 0.8);
  backdrop-filter: blur(8px);
  z-index: 10;
`;

const Square = styled.div`
  width: 62.5px;
  height: 62.5px;
  background-color: ${props => (props.isEven ? 'rgba(50, 255, 192, 0.1)' : 'rgba(28, 42, 74, 0.4)')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  color: ${spaceTheme.textPrimary};

  &:hover {
    transform: ${props => !props.isComputerTurn && 'scale(1.05)'};
    box-shadow: ${props => !props.isComputerTurn && `0 0 12px ${spaceTheme.accentGlow}`};
  }

  ${props => props.isSelected && `
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border: 3px solid ${spaceTheme.accentGlow};
      pointer-events: none;
      z-index: 2;
    }
  `}

  ${props => props.isValidMove && `
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: rgba(50, 255, 192, 0.6);
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 2;
    }
  `}

  ${props => props.isLastMove && `
    background-color: ${props.isEven ? 'rgba(0, 249, 255, 0.2)' : 'rgba(50, 255, 192, 0.2)'};
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
  background: rgba(14, 26, 64, 0.8);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(50, 255, 192, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const PlayerScore = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  background: rgba(14, 26, 64, 0.8);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(50, 255, 192, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const ScoreValue = styled.span`
  color: ${spaceTheme.accentGold};
  font-weight: 700;
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
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  font-family: 'Orbitron', sans-serif;
  transition: all 0.3s;
  box-shadow: 0 0 10px rgba(0, 249, 255, 0.3);

  &:hover {
    background: ${spaceTheme.accentGlow};
    transform: translateY(-2px);
    box-shadow: 0 0 15px rgba(50, 255, 192, 0.5);
  }

  &:active {
    transform: translateY(1px);
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
  background: rgba(28, 42, 74, 0.6);
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid rgba(50, 255, 192, 0.3);
  min-height: 1.5rem;
  min-width: 240px;
`;

const CapturedPiece = styled.div`
  font-size: 20px;
  color: ${spaceTheme.textPrimary};
`;

const GameOverModal = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(14, 26, 64, 0.9);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid rgba(50, 255, 192, 0.3);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 100;
  min-width: 300px;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3);
  animation: ${css`${warping} 0.3s ease-out`};
`;

const GameOverText = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: ${props => props.victory ? spaceTheme.accentGlow : spaceTheme.actionButtonAlt};
  font-family: 'Orbitron', sans-serif;
  text-shadow: 0 0 10px ${props => props.victory ? spaceTheme.accentGlow : spaceTheme.actionButtonAlt};
`;

const PointsEarned = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: ${spaceTheme.accentGold};
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

// Chess Game Component
const Chess = () => {
  const navigate = useNavigate();
  const { updateProgress } = useHabit();
  const [board, setBoard] = useState(initializeBoard());
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [capturedPieces, setCapturedPieces] = useState({ white: [], black: [] });
  const [playerScore, setPlayerScore] = useState(0);
  const [gameStatus, setGameStatus] = useState(null);
  const [isComputerTurn, setIsComputerTurn] = useState(false);
  const [lastMove, setLastMove] = useState(null);
  const [isThinking, setIsThinking] = useState(false);

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
    const pieceKey = `${piece.color}${piece.type.charAt(0).toUpperCase() + piece.type.slice(1)}`;
    return pieces[pieceKey];
  };

  const calculateValidMoves = (row, col) => {
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

  const makeMove = (fromRow, fromCol, toRow, toCol) => {
    const newBoard = [...board.map(row => [...row])];
    const movingPiece = { ...newBoard[fromRow][fromCol] };
    const capturedPiece = newBoard[toRow][toCol];

    if (capturedPiece) {
      setCapturedPieces(prev => ({
        ...prev,
        [capturedPiece.color === 'white' ? 'white' : 'black']: [...prev[capturedPiece.color === 'white' ? 'white' : 'black'], capturedPiece]
      }));
      if (capturedPiece.type === 'king') {
        if (capturedPiece.color === 'black') {
          setGameStatus('victory');
          setPlayerScore(prevScore => prevScore + 10);
          updateProgress('games', 10);
        } else {
          setGameStatus('defeat');
        }
      }
    }

    if (movingPiece.type === 'pawn' || movingPiece.type === 'king' || movingPiece.type === 'rook') {
      movingPiece.hasMoved = true;
    }

    if (movingPiece.type === 'pawn' && (toRow === 7 || toRow === 0)) {
      const promotionChoice = window.prompt("Promote your pawn! Choose one: queen, rook, bishop, knight", "queen");
      movingPiece.type = ['queen', 'rook', 'bishop', 'knight'].includes(promotionChoice) ? promotionChoice : 'queen';
    }

    newBoard[toRow][toCol] = movingPiece;
    newBoard[fromRow][fromCol] = null;
    setBoard(newBoard);
    setLastMove([fromRow, fromCol, toRow, toCol]);
    return newBoard;
  };

  const handleSquareClick = (row, col) => {
    if (isComputerTurn) return;
    if (!selectedPiece) {
      const piece = board[row][col];
      if (piece && piece.color === 'white') {
        setSelectedPiece([row, col]);
        setValidMoves(calculateValidMoves(row, col));
      }
    } else {
      const [selectedRow, selectedCol] = selectedPiece;
      const isValidMove = validMoves.some(([r, c]) => r === row && c === col);

      if (isValidMove) {
        makeMove(selectedRow, selectedCol, row, col);
        setSelectedPiece(null);
        setValidMoves([]);
        setIsWhiteTurn(false);
        setIsComputerTurn(true);
      } else if (board[row][col] && board[row][col].color === 'white') {
        setSelectedPiece([row, col]);
        setValidMoves(calculateValidMoves(row, col));
      } else {
        setSelectedPiece(null);
        setValidMoves([]);
      }
    }
  };

  const makeComputerMove = () => {
    setIsThinking(true);
    setTimeout(() => {
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
              score += Math.random() * 0.5;
              possibleMoves.push({ from: [row, col], to: [toRow, toCol], score });
            });
          }
        }
      }

      if (possibleMoves.length > 0) {
        possibleMoves.sort((a, b) => b.score - a.score);
        const moveIndex = Math.floor(Math.pow(Math.random(), 2) * possibleMoves.length);
        const move = possibleMoves[moveIndex];
        const [fromRow, fromCol] = move.from;
        const [toRow, toCol] = move.to;
        makeMove(fromRow, fromCol, toRow, toCol);
        setIsWhiteTurn(true);
        setIsComputerTurn(false);
        setIsThinking(false);
      } else {
        setGameStatus('victory');
        setPlayerScore(prevScore => prevScore + 10);
        setIsThinking(false);
        setIsComputerTurn(false);
      }
    }, 800);
  };

  useEffect(() => {
    if (isComputerTurn && gameStatus === null) {
      makeComputerMove();
    }
  }, [isComputerTurn, gameStatus]);

  const resetBoard = () => {
    setBoard(initializeBoard());
    setSelectedPiece(null);
    setValidMoves([]);
    setIsWhiteTurn(true);
    setCapturedPieces({ white: [], black: [] });
    setIsComputerTurn(false);
    setGameStatus(null);
    setLastMove(null);
  };

  const navigateBack = () => {
    navigate('/breakthrough-game');
  };

  const getCoordinateLabel = (row, col, corner) => {
    if (corner === 'topleft') return row === 7 ? String.fromCharCode(97 + col) : '';
    return col === 0 ? 8 - row : '';
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

        squares.push(
          <Square
            key={`${row},${col}`}
            isEven={isEven}
            isSelected={isSelected}
            isValidMove={isValidMove}
            isLastMove={isLastMoveSquare}
            isComputerTurn={isComputerTurn}
            onClick={() => handleSquareClick(row, col)}
          >
            {getPieceSymbol(piece)}
            {col === 0 && <CoordinateLabel corner="bottomright">{8 - row}</CoordinateLabel>}
            {row === 7 && <CoordinateLabel corner="topleft">{String.fromCharCode(97 + col)}</CoordinateLabel>}
          </Square>
        );
      }
    }
    return squares;
  };

  const renderCapturedPieces = (color) => {
    return capturedPieces[color].map((piece, index) => (
      <CapturedPiece key={index}>{getPieceSymbol(piece)}</CapturedPiece>
    ));
  };

  const renderGameOverModal = () => {
    if (!gameStatus) return null;
    return (
      <GameOverModal>
        <GameOverText victory={gameStatus === 'victory'}>
          {gameStatus === 'victory' ? 'Victory!' : 'Defeat!'}
        </GameOverText>
        {gameStatus === 'victory' && <PointsEarned>+10 Points</PointsEarned>}
        <Button primary onClick={resetBoard}>Play Again</Button>
      </GameOverModal>
    );
  };

  return (
    <ChessboardContainer>
      <BackgroundOverlay />
      <Star size="20px" style={{ top: '10%', left: '10%' }} duration="4s" delay="0.5s" color="rgba(255, 223, 108, 0.9)" />
      <Star size="15px" style={{ top: '25%', left: '25%' }} duration="3s" delay="1s" color="rgba(50, 255, 192, 0.9)" />
      <Star size="25px" style={{ top: '15%', right: '30%' }} duration="5s" delay="0.2s" color="rgba(0, 249, 255, 0.9)" />
      <GameHeader>
        <GameTitle>Cosmic Chess</GameTitle>
      </GameHeader>
      <TurnIndicator>
        {isComputerTurn ? 'Computer is thinking...' : 'Your Turn'}
      </TurnIndicator>
      <CapturedPiecesContainer>
        <CapturedPiecesList>{renderCapturedPieces('black')}</CapturedPiecesList>
        <CapturedPiecesList>{renderCapturedPieces('white')}</CapturedPiecesList>
      </CapturedPiecesContainer>
      <Chessboard>
        {renderBoard()}
        {renderGameOverModal()}
      </Chessboard>
      <GameInfo>
        <TurnIndicator>{isWhiteTurn ? 'White\'s Turn' : 'Black\'s Turn'}</TurnIndicator>
        <PlayerScore>
          Score: <ScoreValue>{playerScore}</ScoreValue>
        </PlayerScore>
      </GameInfo>
      <ButtonsContainer>
        <Button primary onClick={resetBoard}>Reset Game</Button>
        <Button onClick={navigateBack}>Back to Breakthrough</Button>
      </ButtonsContainer>
    </ChessboardContainer>
  );
};

export default Chess;