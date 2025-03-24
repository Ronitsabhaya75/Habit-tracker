import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../../theme';

// Animations
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const spinAnimation = keyframes`
  0% { transform: translate(50%, 50%) rotate(0deg); }
  50% { transform: translate(50%, 50%) rotate(180deg) scale(1.4); }
  100% { transform: translate(50%, 50%) rotate(360deg); }
`;

const diceRoll = keyframes`
  0% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(90deg) scale(1.1); }
  50% { transform: rotate(180deg) scale(1); }
  75% { transform: rotate(270deg) scale(1.1); }
  100% { transform: rotate(360deg) scale(1); }
`;

const borderBlink = keyframes`
  50% { border-color: rgba(255, 255, 255, 0.8); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
`;

const starGlow = keyframes`
  0% { opacity: 0.6; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.1); }
  100% { opacity: 0.6; transform: scale(0.8); }
`;

// Styled Components
const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, ${theme.colors.gradientStart} 0%, ${theme.colors.gradientEnd} 100%);
  z-index: 0;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(114, 137, 218, 0.2) 0%, transparent 70%);
    top: 10%;
    left: 15%;
    animation: ${floatAnimation} 8s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    width: 250px;
    height: 250px;
    background: radial-gradient(circle, rgba(255, 107, 107, 0.15) 0%, transparent 70%);
    bottom: 20%;
    right: 10%;
    animation: ${floatAnimation} 10s ease-in-out infinite;
  }
`;

const Star = styled.div`
  position: absolute;
  width: ${props => props.size || '2px'};
  height: ${props => props.size || '2px'};
  background: white;
  border-radius: 50%;
  animation: ${starGlow} ${props => props.speed || '2s'} ease-in-out infinite;
  top: ${props => props.top || '50%'};
  left: ${props => props.left || '50%'};
  opacity: ${props => props.opacity || '0.8'};
`;

const GameContainer = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  position: relative;
  z-index: 10;
`;

const GameBoard = styled.div`
  width: 100%;
  aspect-ratio: 1/1;
  background-image: url('/ludo-bg.jpg');
  background-size: cover;
  background-position: center;
  border-radius: 16px;
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
`;

const PlayerPieces = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const PlayerPiece = styled.div`
  width: 5%;
  height: 5%;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  position: absolute;
  transform: translate(50%, 50%);
  transition: all 0.3s ease;
  z-index: 2;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  cursor: pointer;

  &.highlight {
    border: 2px dashed white;
    animation: ${spinAnimation} 1s infinite linear;
    cursor: pointer;
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.7);
  }
`;

const PlayerBase = styled.div`
  width: 35%;
  height: 35%;
  border: 25px solid;
  position: absolute;
  border-radius: 8px;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.3);

  &.P1 {
    bottom: 5%;
    left: 5%;
    border-color: rgba(46, 175, 255, 0.7);
    background: rgba(46, 175, 255, 0.1);
  }

  &.P2 {
    top: 5%;
    right: 5%;
    border-color: rgba(0, 181, 80, 0.7);
    background: rgba(0, 181, 80, 0.1);
  }

  &.highlight {
    animation: ${borderBlink} 0.7s infinite ease-in-out;
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  }
`;

const GameControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const DiceContainer = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  perspective: 1000px;
`;

const DiceButton = styled.button`
  background: linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.secondary});
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  &.rolling {
    animation: ${diceRoll} 0.5s ease-in-out;
  }
`;

const DiceFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.8rem;
  font-weight: bold;
  color: ${theme.colors.primary};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`;

const DiceValue = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  min-width: 40px;
  text-align: center;
  color: white;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
`;

const ActivePlayer = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  span {
    color: ${props => props.player === 'P1' ? '#2eafff' : '#00b550'};
    text-shadow: 0 0 10px ${props => props.player === 'P1' ? 'rgba(46, 175, 255, 0.5)' : 'rgba(0, 181, 80, 0.5)'};
    animation: ${pulse} 2s infinite;
  }
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  width: 100%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
`;

const LudoGame = () => {
  const navigate = useNavigate();
  
  // Constants
  const COORDINATES_MAP = {
    0: [6, 13],
    1: [6, 12],
    2: [6, 11],
    3: [6, 10],
    4: [6, 9],
    5: [5, 8],
    6: [4, 8],
    7: [3, 8],
    8: [2, 8],
    9: [1, 8],
    10: [0, 8],
    11: [0, 7],
    12: [0, 6],
    13: [1, 6],
    14: [2, 6],
    15: [3, 6],
    16: [4, 6],
    17: [5, 6],
    18: [6, 5],
    19: [6, 4],
    20: [6, 3],
    21: [6, 2],
    22: [6, 1],
    23: [6, 0],
    24: [7, 0],
    25: [8, 0],
    26: [8, 1],
    27: [8, 2],
    28: [8, 3],
    29: [8, 4],
    30: [8, 5],
    31: [9, 6],
    32: [10, 6],
    33: [11, 6],
    34: [12, 6],
    35: [13, 6],
    36: [14, 6],
    37: [14, 7],
    38: [14, 8],
    39: [13, 8],
    40: [12, 8],
    41: [11, 8],
    42: [10, 8],
    43: [9, 8],
    44: [8, 9],
    45: [8, 10],
    46: [8, 11],
    47: [8, 12],
    48: [8, 13],
    49: [8, 14],
    50: [7, 14],
    51: [6, 14],

    // HOME ENTRANCE
    // P1
    100: [7, 13],
    101: [7, 12],
    102: [7, 11],
    103: [7, 10],
    104: [7, 9],
    105: [7, 8],

    // P2
    200: [7, 1],
    201: [7, 2],
    202: [7, 3],
    203: [7, 4],
    204: [7, 5],
    205: [7, 6],

    // BASE POSITIONS
    // P1
    500: [1.5, 10.58],
    501: [3.57, 10.58],
    502: [1.5, 12.43],
    503: [3.57, 12.43],

    // P2
    600: [10.5, 1.58],
    601: [12.54, 1.58],
    602: [10.5, 3.45],
    603: [12.54, 3.45],
  };

  const STEP_LENGTH = 6.66;
  const PLAYERS = ['P1', 'P2'];
  const BASE_POSITIONS = {
    P1: [500, 501, 502, 503],
    P2: [600, 601, 602, 603],
  };
  const START_POSITIONS = {
    P1: 0,
    P2: 26
  };
  const HOME_ENTRANCE = {
    P1: [100, 101, 102, 103, 104],
    P2: [200, 201, 202, 203, 204]
  };
  const HOME_POSITIONS = {
    P1: 105,
    P2: 205
  };
  const TURNING_POINTS = {
    P1: 50,
    P2: 24
  };
  const SAFE_POSITIONS = [0, 8, 13, 21, 26, 34, 39, 47];
  const STATE = {
    DICE_NOT_ROLLED: 'DICE_NOT_ROLLED',
    DICE_ROLLED: 'DICE_ROLLED',
  };

  // Game state
  const [currentPositions, setCurrentPositions] = useState({
    P1: [...BASE_POSITIONS.P1],
    P2: [...BASE_POSITIONS.P2]
  });
  const [diceValue, setDiceValue] = useState(0);
  const [turn, setTurn] = useState(0);
  const [state, setState] = useState(STATE.DICE_NOT_ROLLED);
  const [highlightedPieces, setHighlightedPieces] = useState([]);
  const [isRolling, setIsRolling] = useState(false);

  // Initialize game
  useEffect(() => {
    resetGame();
  }, []);

  // Handle dice roll
  const onDiceClick = () => {
    if (state !== STATE.DICE_NOT_ROLLED) return;
    
    setIsRolling(true);
    setTimeout(() => {
      const value = 1 + Math.floor(Math.random() * 6);
      setDiceValue(value);
      setState(STATE.DICE_ROLLED);
      setIsRolling(false);
      checkForEligiblePieces();
    }, 500);
  };

  // Check which pieces can move
  const checkForEligiblePieces = () => {
    const player = PLAYERS[turn];
    const eligiblePieces = getEligiblePieces(player);
    
    if (eligiblePieces.length) {
      setHighlightedPieces(eligiblePieces.map(piece => `${player}-${piece}`));
    } else {
      incrementTurn();
    }
  };

  // Get pieces that can move
  const getEligiblePieces = (player) => {
    return [0, 1, 2, 3].filter(piece => {
      const currentPosition = currentPositions[player][piece];

      if (currentPosition === HOME_POSITIONS[player]) {
        return false;
      }

      if (
        BASE_POSITIONS[player].includes(currentPosition)
        && diceValue !== 6
      ) {
        return false;
      }

      if (
        HOME_ENTRANCE[player].includes(currentPosition)
        && diceValue > HOME_POSITIONS[player] - currentPosition
      ) {
        return false;
      }

      return true;
    });
  };

  // Switch turns
  const incrementTurn = () => {
    setTurn(turn === 0 ? 1 : 0);
    setState(STATE.DICE_NOT_ROLLED);
    setHighlightedPieces([]);
  };

  // Reset game
  const resetGame = () => {
    setCurrentPositions({
      P1: [...BASE_POSITIONS.P1],
      P2: [...BASE_POSITIONS.P2]
    });
    setTurn(0);
    setState(STATE.DICE_NOT_ROLLED);
    setDiceValue(0);
    setHighlightedPieces([]);
  };

  // Handle piece click
  const onPieceClick = (player, piece) => {
    if (!highlightedPieces.includes(`${player}-${piece}`)) return;
    
    const currentPosition = currentPositions[player][piece];
    
    if (BASE_POSITIONS[player].includes(currentPosition)) {
      const newPositions = {...currentPositions};
      newPositions[player][piece] = START_POSITIONS[player];
      setCurrentPositions(newPositions);
      setState(STATE.DICE_NOT_ROLLED);
      setHighlightedPieces([]);
      return;
    }

    setHighlightedPieces([]);
    movePiece(player, piece, diceValue);
  };

  // Move piece animation
  const movePiece = (player, piece, moveBy) => {
    let movesLeft = moveBy;
    
    const interval = setInterval(() => {
      setCurrentPositions(prevPositions => {
        const newPositions = {...prevPositions};
        newPositions[player][piece] = getIncrementedPosition(player, piece, newPositions[player][piece]);
        return newPositions;
      });
      
      movesLeft--;
      
      if (movesLeft === 0) {
        clearInterval(interval);
        
        // Check if player won
        if (hasPlayerWon(player)) {
          alert(`Player: ${player} has won!`);
          resetGame();
          return;
        }
        
        const isKill = checkForKill(player, piece);
        
        if (isKill || diceValue === 6) {
          setState(STATE.DICE_NOT_ROLLED);
          return;
        }
        
        incrementTurn();
      }
    }, 200);
  };

  // Check if piece killed another
  const checkForKill = (player, piece) => {
    const currentPosition = currentPositions[player][piece];
    const opponent = player === 'P1' ? 'P2' : 'P1';
    let kill = false;

    [0, 1, 2, 3].forEach(p => {
      const opponentPosition = currentPositions[opponent][p];
      
      if (currentPosition === opponentPosition && !SAFE_POSITIONS.includes(currentPosition)) {
        const newPositions = {...currentPositions};
        newPositions[opponent][p] = BASE_POSITIONS[opponent][p];
        setCurrentPositions(newPositions);
        kill = true;
      }
    });

    return kill;
  };

  // Check if player won
  const hasPlayerWon = (player) => {
    return [0, 1, 2, 3].every(piece => 
      currentPositions[player][piece] === HOME_POSITIONS[player]
    );
  };

  // Get next position
  const getIncrementedPosition = (player, piece, currentPosition) => {
    if (currentPosition === TURNING_POINTS[player]) {
      return HOME_ENTRANCE[player][0];
    }
    else if (currentPosition === 51) {
      return 0;
    }
    return currentPosition + 1;
  };

  // Render piece
  const renderPiece = (player, pieceIndex) => {
    const position = currentPositions[player][pieceIndex];
    const [x, y] = COORDINATES_MAP[position];
    const isHighlighted = highlightedPieces.includes(`${player}-${pieceIndex}`);
    
    return (
      <PlayerPiece
        key={`${player}-${pieceIndex}`}
        className={isHighlighted ? 'highlight' : ''}
        player-id={player}
        piece={pieceIndex}
        style={{
          top: `${y * STEP_LENGTH}%`,
          left: `${x * STEP_LENGTH}%`,
          backgroundColor: player === 'P1' ? '#2eafff' : '#00b550'
        }}
        onClick={() => onPieceClick(player, pieceIndex)}
      />
    );
  };

  // Render dice dots
  const renderDiceDots = (value) => {
    const dotPositions = {
      1: ['center'],
      2: ['top-left', 'bottom-right'],
      3: ['top-left', 'center', 'bottom-right'],
      4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
      6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right']
    };

    return dotPositions[value]?.map((pos, index) => (
      <div 
        key={index}
        style={{
          position: 'absolute',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: theme.colors.primary,
          ...(pos === 'center' && { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }),
          ...(pos === 'top-left' && { top: '25%', left: '25%' }),
          ...(pos === 'top-right' && { top: '25%', right: '25%' }),
          ...(pos === 'middle-left' && { top: '50%', left: '25%', transform: 'translateY(-50%)' }),
          ...(pos === 'middle-right' && { top: '50%', right: '25%', transform: 'translateY(-50%)' }),
          ...(pos === 'bottom-left' && { bottom: '25%', left: '25%' }),
          ...(pos === 'bottom-right' && { bottom: '25%', right: '25%' })
        }}
      />
    ));
  };

  return (
    <>
      <Background>
        <Star top="15%" left="25%" speed="3s" size="3px" opacity="0.9" />
        <Star top="35%" left="65%" speed="4s" size="4px" opacity="0.8" />
        <Star top="65%" left="15%" speed="3.5s" size="2px" opacity="0.7" />
        <Star top="25%" left="85%" speed="5s" size="3px" opacity="0.9" />
        <Star top="75%" left="35%" speed="2.5s" size="3px" opacity="0.8" />
        <Star top="45%" left="75%" speed="4.5s" size="2px" opacity="0.7" />
        <Star top="85%" left="55%" speed="3.5s" size="4px" opacity="0.9" />
        <Star top="55%" left="45%" speed="5s" size="2px" opacity="0.8" />
      </Background>

      <GameContainer>
        <GameBoard>
          <PlayerPieces>
            {[0, 1, 2, 3].map(piece => renderPiece('P1', piece))}
            {[0, 1, 2, 3].map(piece => renderPiece('P2', piece))}
          </PlayerPieces>
          
          <PlayerBase className={`P1 ${turn === 0 ? 'highlight' : ''}`} />
          <PlayerBase className={`P2 ${turn === 1 ? 'highlight' : ''}`} />
        </GameBoard>

        <GameControls>
          <ActivePlayer player={PLAYERS[turn]}>
            Active Player: <span>{PLAYERS[turn]}</span>
          </ActivePlayer>
          
          <DiceContainer>
            <DiceButton 
              onClick={onDiceClick}
              disabled={state !== STATE.DICE_NOT_ROLLED}
              className={isRolling ? 'rolling' : ''}
            >
              {diceValue > 0 && !isRolling ? (
                <DiceFace>
                  {renderDiceDots(diceValue)}
                </DiceFace>
              ) : (
                '🎲 Roll Dice'
              )}
            </DiceButton>
          </DiceContainer>
        </GameControls>

        <ActionButton onClick={() => navigate('/breakthrough-game')}>
          ← Back to Breakthrough Game
        </ActionButton>
      </GameContainer>
    </>
  );
};

export default LudoGame;