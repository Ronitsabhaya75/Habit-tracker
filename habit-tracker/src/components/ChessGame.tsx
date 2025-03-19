
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Simple chess piece representation
type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king' | null;
type PieceColor = 'white' | 'black' | null;

interface Piece {
  type: PieceType;
  color: PieceColor;
}

// This is a simplified chess implementation for demonstration
// In a real app, you'd use a chess library like chess.js
export const ChessGame: React.FC = () => {
  const [board, setBoard] = useState<Piece[][]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<'white' | 'black'>('white');
  const [completed, setCompleted] = useState(false);

  // Initialize the chess board
  useEffect(() => {
    const initialBoard: Piece[][] = Array(8).fill(null).map(() => 
      Array(8).fill(null).map(() => ({ type: null, color: null }))
    );

    // Set up pawns
    for (let i = 0; i < 8; i++) {
      initialBoard[1][i] = { type: 'pawn', color: 'black' };
      initialBoard[6][i] = { type: 'pawn', color: 'white' };
    }

    // Set up back rows
    const backRow: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
    for (let i = 0; i < 8; i++) {
      initialBoard[0][i] = { type: backRow[i], color: 'black' };
      initialBoard[7][i] = { type: backRow[i], color: 'white' };
    }

    setBoard(initialBoard);
  }, []);

  const handleCellClick = (row: number, col: number) => {
    if (completed) return;
    
    const piece = board[row][col];
    
    // If a cell is already selected
    if (selectedCell) {
      const [selectedRow, selectedCol] = selectedCell;
      const selectedPiece = board[selectedRow][selectedCol];
      
      // If clicking on the same cell, deselect it
      if (row === selectedRow && col === selectedCol) {
        setSelectedCell(null);
        return;
      }
      
      // If the selected piece is the current player's piece
      if (selectedPiece.color === currentPlayer) {
        // If clicking on another of the player's pieces, select that instead
        if (piece.color === currentPlayer) {
          setSelectedCell([row, col]);
          return;
        }
        
        // For simplicity, we're allowing any move without checking chess rules
        // In a real app, you'd validate moves based on chess rules
        const newBoard = [...board.map(r => [...r])];
        newBoard[row][col] = selectedPiece;
        newBoard[selectedRow][selectedCol] = { type: null, color: null };
        
        setBoard(newBoard);
        setSelectedCell(null);
        setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
        
        // Auto-complete the game after a few moves (for demo purposes)
        if (Math.random() > 0.7) {
          setTimeout(() => {
            setCompleted(true);
            toast.success('Level completed! +10 points', {
              description: "Great job! You've completed this chess challenge.",
              position: 'top-center',
            });
          }, 1000);
        }
      }
    } else {
      // If no cell is selected and the clicked cell has a piece of the current player's color
      if (piece.color === currentPlayer) {
        setSelectedCell([row, col]);
      }
    }
  };

  const renderPiece = (piece: Piece) => {
    if (!piece.type) return null;
    
    const pieces = {
      white: {
        pawn: '♙',
        rook: '♖',
        knight: '♘',
        bishop: '♗',
        queen: '♕',
        king: '♔',
      },
      black: {
        pawn: '♟',
        rook: '♜',
        knight: '♞',
        bishop: '♝',
        queen: '♛',
        king: '♚',
      }
    };
    
    return piece.color && pieces[piece.color][piece.type];
  };

  const resetGame = () => {
    setCompleted(false);
    // Re-initialize the board (same code as in useEffect)
    const initialBoard: Piece[][] = Array(8).fill(null).map(() => 
      Array(8).fill(null).map(() => ({ type: null, color: null }))
    );

    // Set up pawns
    for (let i = 0; i < 8; i++) {
      initialBoard[1][i] = { type: 'pawn', color: 'black' };
      initialBoard[6][i] = { type: 'pawn', color: 'white' };
    }

    // Set up back rows
    const backRow: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
    for (let i = 0; i < 8; i++) {
      initialBoard[0][i] = { type: backRow[i], color: 'black' };
      initialBoard[7][i] = { type: backRow[i], color: 'white' };
    }

    setBoard(initialBoard);
    setCurrentPlayer('white');
    setSelectedCell(null);
  };

  return (
    <div className="glass-card rounded-xl p-5 animate-fade-in">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-medium">Chess Challenge</h3>
        <div className="flex items-center space-x-2">
          <div className={cn(
            "w-3 h-3 rounded-full",
            currentPlayer === 'white' ? "bg-teal" : "bg-muted"
          )}></div>
          <span className="text-sm font-medium">
            {completed ? "Game Completed!" : `${currentPlayer}'s turn`}
          </span>
        </div>
      </div>
      
      <div className="w-full max-w-md mx-auto">
        <div className="aspect-square grid grid-cols-8 border border-border rounded-md overflow-hidden">
          {board.map((row, rowIndex) => (
            row.map((cell, colIndex) => (
              <div 
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  "flex items-center justify-center text-3xl transition-all",
                  (rowIndex + colIndex) % 2 === 0 ? "bg-white" : "bg-gray-200",
                  selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex && "bg-primary/20",
                  "cursor-pointer hover:opacity-90"
                )}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {renderPiece(cell)}
              </div>
            ))
          ))}
        </div>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        {completed ? (
          <Button onClick={resetGame} className="w-full">
            Start New Game
          </Button>
        ) : (
          <div className="w-full text-center text-sm text-muted-foreground">
            Click on a piece to select it, then click on a destination to move
          </div>
        )}
      </div>
    </div>
  );
};
