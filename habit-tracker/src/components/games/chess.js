// src/components/Chess.js
import React, { useState } from 'react';
import styled from 'styled-components';

// Chess pieces (Unicode characters)
const pieces = {
  pawn: '♟',
  rook: '♜',
  knight: '♞',
  bishop: '♝',
  queen: '♛',
  king: '♚',
};

// Styled Components
const ChessboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(135deg, #1e2749 0%, #2e3b73 100%);
  color: white;
  min-height: 100vh;
`;

const Chessboard = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  width: 400px;
  height: 400px;
  border: 2px solid #333;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

const Square = styled.div`
  width: 50px;
  height: 50px;
  background-color: ${(props) => (props.isEven ? '#f0d9b5' : '#b58863')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.isEven ? '#e8d5b5' : '#a67b5b')};
  }
`;

const TurnIndicator = styled.div`
  margin: 1rem 0;
  font-size: 1.2rem;
  font-weight: 600;
`;

const ResetButton = styled.button`
  background: #4caf50;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
  transition: all 0.2s ease;

  &:hover {
    background: #45a049;
    transform: translateY(-2px);
  }
`;

// Chess Game Component
const Chess = () => {
  const [board, setBoard] = useState(initializeBoard());
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);

  // Initialize the chessboard with pieces
  function initializeBoard() {
    const board = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const isEven = (row + col) % 2 === 0;
        let piece = null;

        // Place white pieces
        if (row === 0) {
          if (col === 0 || col === 7) piece = pieces.rook;
          if (col === 1 || col === 6) piece = pieces.knight;
          if (col === 2 || col === 5) piece = pieces.bishop;
          if (col === 3) piece = pieces.queen;
          if (col === 4) piece = pieces.king;
        }
        if (row === 1) piece = pieces.pawn;

        // Place black pieces
        if (row === 6) piece = pieces.pawn;
        if (row === 7) {
          if (col === 0 || col === 7) piece = pieces.rook;
          if (col === 1 || col === 6) piece = pieces.knight;
          if (col === 2 || col === 5) piece = pieces.bishop;
          if (col === 3) piece = pieces.queen;
          if (col === 4) piece = pieces.king;
        }

        board.push({ row, col, isEven, piece });
      }
    }
    return board;
  }

  // Handle square clicks
  const handleSquareClick = (row, col) => {
    const square = board.find((s) => s.row === row && s.col === col);

    if (selectedPiece) {
      // Check if the move is valid
      if (isValidMove(selectedPiece, square)) {
        const newBoard = board.map((s) => {
          if (s.row === selectedPiece.row && s.col === selectedPiece.col) {
            return { ...s, piece: null }; // Clear the old position
          }
          if (s.row === row && s.col === col) {
            return { ...s, piece: selectedPiece.piece }; // Move the piece
          }
          return s;
        });
        setBoard(newBoard);
        setSelectedPiece(null);
        setIsWhiteTurn(!isWhiteTurn); // Switch turns
      }
    } else if (square.piece && (isWhiteTurn ? square.piece === square.piece.toUpperCase() : square.piece === square.piece.toLowerCase())) {
      // Select the piece if it's the correct player's turn
      setSelectedPiece(square);
    }
  };

  // Basic movement validation
  const isValidMove = (from, to) => {
    const dx = Math.abs(from.col - to.col);
    const dy = Math.abs(from.row - to.row);

    if (from.piece === pieces.pawn) {
      return dx === 0 && dy === 1; // Pawns move forward one square
    }
    if (from.piece === pieces.rook) {
      return dx === 0 || dy === 0; // Rooks move in straight lines
    }
    // Add more rules for other pieces
    return false;
  };

  // Reset the board
  const resetBoard = () => {
    setBoard(initializeBoard());
    setSelectedPiece(null);
    setIsWhiteTurn(true);
  };

  return (
    <ChessboardContainer>
      <h1>Chess Game</h1>
      <TurnIndicator>{isWhiteTurn ? 'White\'s Turn' : 'Black\'s Turn'}</TurnIndicator>
      <Chessboard>
        {board.map((square, index) => (
          <Square
            key={index}
            isEven={square.isEven}
            onClick={() => handleSquareClick(square.row, square.col)}
          >
            {square.piece}
          </Square>
        ))}
      </Chessboard>
      <ResetButton onClick={resetBoard}>Reset Game</ResetButton>
    </ChessboardContainer>
  );
};

export default Chess;