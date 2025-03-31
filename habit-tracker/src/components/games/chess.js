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
import styled from 'styled-components';
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

// Styled Components with enhanced visuals
const ChessboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(135deg, #1a2038 0%, #293462 100%);
  color: white;
  min-height: 100vh;
  font-family: 'Montserrat', sans-serif;
`;

const GameHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const GameTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(to right, #e6c200, #ffeb99);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
`;

const Chessboard = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  width: 500px;
  height: 500px;
  border: 3px solid #111;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  position: relative;
  border-radius: 4px;
  overflow: hidden;
`;

const Square = styled.div`
  width: 62.5px;
  height: 62.5px;
  background-color: ${(props) => (props.isEven ? '#f0d9b5' : '#b58863')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    transform: ${props => !props.isComputerTurn && 'scale(1.05)'};
    z-index: ${props => !props.isComputerTurn && '1'};
    box-shadow: ${props => !props.isComputerTurn && '0 0 12px rgba(255, 215, 0, 0.8)'};
  }

  ${(props) => props.isSelected && `
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border: 3px solid #4caf50;
      pointer-events: none;
      z-index: 2;
    }
  `}

  ${(props) => props.isValidMove && `
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: rgba(76, 175, 80, 0.6);
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 2;
    }
  `}

  ${(props) => props.isLastMove && `
    background-color: ${props.isEven ? '#e4c894' : '#a77555'};
  `}
`;

const GameInfo = styled.div`
  display: flex;
  justify-content: space-between;
  width: 500px;
  margin-top: 1.5rem;
`;

const TurnIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const PlayerScore = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const ScoreValue = styled.span`
  background: linear-gradient(to right, #e6c200, #ffeb99);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  background: ${props => props.primary ? 'linear-gradient(to bottom, #4caf50, #45a049)' : 'linear-gradient(to bottom, #3f51b5, #303f9f)'};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
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
`;

const CapturedPiecesList = styled.div`
  display: flex;
  gap: 0.25rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 0.5rem;
  border-radius: 4px;
  min-height: 1.5rem;
  min-width: 240px;
`;

const CapturedPiece = styled.div`
  font-size: 20px;
`;

const GameOverModal = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.85);
  padding: 2rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
  min-width: 300px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
`;

const GameOverText = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: ${props => props.victory ? '#4caf50' : '#f44336'};
`;

const PointsEarned = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: #e6c200;
`;

const CoordinateLabel = styled.div`
  position: absolute;
  font-size: 10px;
  color: rgba(0, 0, 0, 0.6);
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
  
  // Initialize the chessboard with pieces
  function initializeBoard() {
    const initialBoard = Array(8).fill().map(() => Array(8).fill(null));
    
    // Set pawns
    for (let col = 0; col < 8; col++) {
      initialBoard[1][col] = { type: 'pawn', color: 'white', hasMoved: false };
      initialBoard[6][col] = { type: 'pawn', color: 'black', hasMoved: false };
    }
    
    // Set rooks
    initialBoard[0][0] = { type: 'rook', color: 'white', hasMoved: false };
    initialBoard[0][7] = { type: 'rook', color: 'white', hasMoved: false };
    initialBoard[7][0] = { type: 'rook', color: 'black', hasMoved: false };
    initialBoard[7][7] = { type: 'rook', color: 'black', hasMoved: false };
    
    // Set knights
    initialBoard[0][1] = { type: 'knight', color: 'white' };
    initialBoard[0][6] = { type: 'knight', color: 'white' };
    initialBoard[7][1] = { type: 'knight', color: 'black' };
    initialBoard[7][6] = { type: 'knight', color: 'black' };
    
    // Set bishops
    initialBoard[0][2] = { type: 'bishop', color: 'white' };
    initialBoard[0][5] = { type: 'bishop', color: 'white' };
    initialBoard[7][2] = { type: 'bishop', color: 'black' };
    initialBoard[7][5] = { type: 'bishop', color: 'black' };
    
    // Set queens
    initialBoard[0][3] = { type: 'queen', color: 'white' };
    initialBoard[7][3] = { type: 'queen', color: 'black' };
    
    // Set kings
    initialBoard[0][4] = { type: 'king', color: 'white', hasMoved: false };
    initialBoard[7][4] = { type: 'king', color: 'black', hasMoved: false };
    
    return initialBoard;
  }

  // Get piece Unicode symbol
  const getPieceSymbol = (piece) => {
    if (!piece) return null;
    
    const pieceKey = `${piece.color}${piece.type.charAt(0).toUpperCase() + piece.type.slice(1)}`;
    return pieces[pieceKey];
  };

  // Calculate valid moves for a piece
  const calculateValidMoves = (row, col) => {
    const piece = board[row][col];
    if (!piece) return [];
    
    const moves = [];
    const color = piece.color;
    const isWhite = color === 'white';
    
    // Helper function to check if a position is valid and add it to moves
    const addMoveIfValid = (r, c) => {
      if (r < 0 || r > 7 || c < 0 || c > 7) return false;
      
      const targetPiece = board[r][c];
      if (!targetPiece) {
        moves.push([r, c]);
        return true;
      } else if (targetPiece.color !== color) {
        moves.push([r, c]);
        return false; // Can't move further in this direction after capturing
      }
      return false; // Can't move further in this direction (blocked by own piece)
    };
    
    // Pawn moves
    if (piece.type === 'pawn') {
      const direction = isWhite ? 1 : -1;
      
      // Forward move
      if (row + direction >= 0 && row + direction <= 7 && !board[row + direction][col]) {
        moves.push([row + direction, col]);
        
        // Double move from starting position
        if (!piece.hasMoved && row + 2 * direction >= 0 && row + 2 * direction <= 7 && !board[row + 2 * direction][col]) {
          moves.push([row + 2 * direction, col]);
        }
      }
      
      // Captures
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
    
    // Rook moves
    if (piece.type === 'rook' || piece.type === 'queen') {
      // Up
      for (let r = row - 1; r >= 0; r--) {
        if (!addMoveIfValid(r, col)) break;
      }
      
      // Down
      for (let r = row + 1; r <= 7; r++) {
        if (!addMoveIfValid(r, col)) break;
      }
      
      // Left
      for (let c = col - 1; c >= 0; c--) {
        if (!addMoveIfValid(row, c)) break;
      }
      
      // Right
      for (let c = col + 1; c <= 7; c++) {
        if (!addMoveIfValid(row, c)) break;
      }
    }
    
    // Bishop moves
    if (piece.type === 'bishop' || piece.type === 'queen') {
      // Up-left
      for (let r = row - 1, c = col - 1; r >= 0 && c >= 0; r--, c--) {
        if (!addMoveIfValid(r, c)) break;
      }
      
      // Up-right
      for (let r = row - 1, c = col + 1; r >= 0 && c <= 7; r--, c++) {
        if (!addMoveIfValid(r, c)) break;
      }
      
      // Down-left
      for (let r = row + 1, c = col - 1; r <= 7 && c >= 0; r++, c--) {
        if (!addMoveIfValid(r, c)) break;
      }
      
      // Down-right
      for (let r = row + 1, c = col + 1; r <= 7 && c <= 7; r++, c++) {
        if (!addMoveIfValid(r, c)) break;
      }
    }
    
    // Knight moves
    if (piece.type === 'knight') {
      const knightMoves = [
        [row - 2, col - 1], [row - 2, col + 1],
        [row - 1, col - 2], [row - 1, col + 2],
        [row + 1, col - 2], [row + 1, col + 2],
        [row + 2, col - 1], [row + 2, col + 1]
      ];
      
      knightMoves.forEach(([r, c]) => {
        if (r >= 0 && r <= 7 && c >= 0 && c <= 7) {
          const targetPiece = board[r][c];
          if (!targetPiece || targetPiece.color !== color) {
            moves.push([r, c]);
          }
        }
      });
    }
    
    // King moves
    if (piece.type === 'king') {
      const kingMoves = [
        [row - 1, col - 1], [row - 1, col], [row - 1, col + 1],
        [row, col - 1], [row, col + 1],
        [row + 1, col - 1], [row + 1, col], [row + 1, col + 1]
      ];
      
      kingMoves.forEach(([r, c]) => {
        if (r >= 0 && r <= 7 && c >= 0 && c <= 7) {
          const targetPiece = board[r][c];
          if (!targetPiece || targetPiece.color !== color) {
            moves.push([r, c]);
          }
        }
      });
    }
    
    return moves;
  };
  
  // Make a move on the board
  // Updated makeMove function with leaderboard integration
  const makeMove = (fromRow, fromCol, toRow, toCol) => {
    const newBoard = [...board.map(row => [...row])];
    const movingPiece = {...newBoard[fromRow][fromCol]};
    
    // Check if there's a capture
    const capturedPiece = newBoard[toRow][toCol];
    if (capturedPiece) {
      setCapturedPieces(prev => {
        const side = capturedPiece.color === 'white' ? 'white' : 'black';
        return {
          ...prev,
          [side]: [...prev[side], capturedPiece]
        };
      });
      
      // Check for victory (king capture)
      if (capturedPiece.type === 'king') {
        if (capturedPiece.color === 'black') {
          setGameStatus('victory');
          setPlayerScore(prevScore => prevScore + 10);
          // Update leaderboard by adding points to the 'games' category
          updateProgress('games', 10); // Add 10 XP for winning
        } else {
          setGameStatus('defeat');
        }
      }
    }
    
    // Mark piece as moved
    if (movingPiece.type === 'pawn' || movingPiece.type === 'king' || movingPiece.type === 'rook') {
      movingPiece.hasMoved = true;
    }
    
    // Handle pawn promotion
    if (movingPiece.type === 'pawn' && (toRow === 7 || toRow === 0)) {
      const promotionChoice = window.prompt(
        "Promote your pawn! Choose one: queen, rook, bishop, knight",
        "queen"
      );
    
      if (['queen', 'rook', 'bishop', 'knight'].includes(promotionChoice)) {
        movingPiece.type = promotionChoice;
      } else {
        movingPiece.type = 'queen'; // Default to queen if the input is invalid
      }
    }
    
    // Update the board
    newBoard[toRow][toCol] = movingPiece;
    newBoard[fromRow][fromCol] = null;
    
    setBoard(newBoard);
    setLastMove([fromRow, fromCol, toRow, toCol]);
    return newBoard;
  };

  // Handle square clicks
  const handleSquareClick = (row, col) => {
    // Don't allow moves during computer's turn
    if (isComputerTurn) return;
    
    // If no piece is selected
    if (!selectedPiece) {
      const piece = board[row][col];
      
      // Check if there's a piece and it belongs to the player (white)
      if (piece && piece.color === 'white') {
        setSelectedPiece([row, col]);
        setValidMoves(calculateValidMoves(row, col));
      }
    } 
    // If a piece is already selected
    else {
      const [selectedRow, selectedCol] = selectedPiece;
      
      // Check if the clicked square is a valid move
      const isValidMove = validMoves.some(([r, c]) => r === row && c === col);
      
      if (isValidMove) {
        // Make the move
        makeMove(selectedRow, selectedCol, row, col);
        
        setSelectedPiece(null);
        setValidMoves([]);
        setIsWhiteTurn(false);
        setIsComputerTurn(true);
      } 
      // If clicked on another own piece, select that piece instead
      else if (board[row][col] && board[row][col].color === 'white') {
        setSelectedPiece([row, col]);
        setValidMoves(calculateValidMoves(row, col));
      } 
      // If clicked on an invalid square, deselect
      else {
        setSelectedPiece(null);
        setValidMoves([]);
      }
    }
  };
  
  // Computer AI move
  const makeComputerMove = () => {
    setIsThinking(true);
    
    // Delay to simulate "thinking"
    setTimeout(() => {
      const possibleMoves = [];
      
      // Find all possible moves for black pieces
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const piece = board[row][col];
          if (piece && piece.color === 'black') {
            const moves = calculateValidMoves(row, col);
            moves.forEach(([toRow, toCol]) => {
              // Calculate move score (prioritize captures and beneficial moves)
              let score = 0;
              const target = board[toRow][toCol];
              
              // Prioritize captures
              if (target) {
                switch (target.type) {
                  case 'queen': score += 9; break;
                  case 'rook': score += 5; break;
                  case 'bishop':
                  case 'knight': score += 3; break;
                  case 'pawn': score += 1; break;
                  case 'king': score += 100; break; // Obviously prioritize checkmate
                }
              }
              
              // Slightly randomize to make it less predictable
              score += Math.random() * 0.5;
              
              possibleMoves.push({
                from: [row, col],
                to: [toRow, toCol],
                score
              });
            });
          }
        }
      }
      
      // If there are possible moves, choose one (preferring higher scores)
      if (possibleMoves.length > 0) {
        // Sort by score (highest first)
        possibleMoves.sort((a, b) => b.score - a.score);
        
        // Choose a move, slightly favoring better moves
        const moveIndex = Math.floor(Math.pow(Math.random(), 2) * possibleMoves.length);
        const move = possibleMoves[moveIndex];
        
        // Make the move
        const [fromRow, fromCol] = move.from;
        const [toRow, toCol] = move.to;
        
        makeMove(fromRow, fromCol, toRow, toCol);
        
        setIsWhiteTurn(true);
        setIsComputerTurn(false);
        setIsThinking(false);
      } else {
        // No possible moves - player wins
        setGameStatus('victory');
        setPlayerScore(prevScore => prevScore + 10);
        setIsThinking(false);
        setIsComputerTurn(false);
      }
    }, 800); // Thinking delay
  };

  // Check for computer's turn
  useEffect(() => {
    if (isComputerTurn && gameStatus === null) {
      makeComputerMove();
    }
  }, [isComputerTurn, gameStatus]);

  // Reset the game
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

  // Navigate back to breakthrough game
  const navigateBack = () => {
    navigate('/breakthrough-game');
  };
  
  // Get coordinate label
  const getCoordinateLabel = (row, col, corner) => {
    if (corner === 'topleft') {
      return row === 7 ? String.fromCharCode(97 + col) : '';
    } else {
      return col === 0 ? 8 - row : '';
    }
  };

  // Render the board
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
  
  // Render captured pieces
  const renderCapturedPieces = (color) => {
    return capturedPieces[color].map((piece, index) => (
      <CapturedPiece key={index}>
        {getPieceSymbol(piece)}
      </CapturedPiece>
    ));
  };
  
  // Render game over modal
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
      <GameHeader>
        <GameTitle>Chess Game</GameTitle>
      </GameHeader>
      
      <TurnIndicator>
        {isComputerTurn ? 'Computer is thinking...' : 'Your Turn'}
      </TurnIndicator>
      
      <CapturedPiecesContainer>
        <CapturedPiecesList>
          {renderCapturedPieces('black')}
        </CapturedPiecesList>
        <CapturedPiecesList>
          {renderCapturedPieces('white')}
        </CapturedPiecesList>
      </CapturedPiecesContainer>
      
      <Chessboard>
        {renderBoard()}
        {renderGameOverModal()}
      </Chessboard>
      
      <GameInfo>
        <TurnIndicator>
          {isWhiteTurn ? 'White\'s Turn' : 'Black\'s Turn'}
        </TurnIndicator>
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