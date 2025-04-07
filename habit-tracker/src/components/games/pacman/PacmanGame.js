/**

PacManGame Component

A classic Pac-Man arcade game implementation with React that rewards players with XP

for completing levels and achieving milestones. The game features:

Authentic Pac-Man gameplay with ghosts, pellets, and power pills

Multiple levels with increasing difficulty

Score tracking and lives system

Ghost AI with different behaviors (chase and scatter modes)

Power-up system that temporarily allows Pac-Man to eat ghosts

XP rewards system integrated with a habit tracking context

Game Mechanics:

Player controls Pac-Man using arrow keys to navigate the maze

Collect all pellets to advance to the next level

Power pills make ghosts vulnerable for a limited time

Colliding with ghosts costs a life (game ends after 3 lives)

Earn XP for eating pellets (10 XP), power pills (50 XP), and ghosts (200 XP)

Technical Implementation:

Uses React hooks (useState, useEffect, useCallback) for game state management

Implements a game loop with intervals for character movement

Features collision detection between Pac-Man, ghosts, and maze elements

Includes responsive controls with keyboard event listeners

Provides visual feedback through sprite animations and game state messages

Integrates with a habit tracking context to update player progress

The component maintains clean separation of concerns with:

Game state management

Rendering logic

Movement and collision systems

XP reward system

Game reset functionality

Assets include:

Custom sprites for Pac-Man in all directions

Unique ghost sprites with different colors

Maze walls and pellet graphics

Background elements for empty spaces
*/
/**

PacManGame Component

A classic Pac-Man arcade game implementation with React that rewards players with XP

for completing levels and achieving milestones. The game features:

Authentic Pac-Man gameplay with ghosts, pellets, and power pills

Multiple levels with increasing difficulty

Score tracking and lives system

Ghost AI with different behaviors (chase and scatter modes)

Power-up system that temporarily allows Pac-Man to eat ghosts

XP rewards system integrated with a habit tracking context

Game Mechanics:

Player controls Pac-Man using arrow keys to navigate the maze

Collect all pellets to advance to the next level

Power pills make ghosts vulnerable for a limited time

Colliding with ghosts costs a life (game ends after 3 lives)

Earn XP for eating pellets (10 XP), power pills (50 XP), and ghosts (200 XP)

Technical Implementation:

Uses React hooks (useState, useEffect, useCallback) for game state management

Implements a game loop with intervals for character movement

Features collision detection between Pac-Man, ghosts, and maze elements

Includes responsive controls with keyboard event listeners

Provides visual feedback through sprite animations and game state messages

Integrates with a habit tracking context to update player progress

The component maintains clean separation of concerns with:

Game state management

Rendering logic

Movement and collision systems

XP reward system

Game reset functionality

Assets include:

Custom sprites for Pac-Man in all directions

Unique ghost sprites with different colors

Maze walls and pellet graphics

Background elements for empty spaces
*/
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useHabit } from '../../../context/HabitContext';
import styled, { keyframes, css } from 'styled-components';
import wall from "./wall.png";
import coin from "./coin.png";
import pacmanRight from "./pacman-right.png";
import pacmanLeft from "./pacman-left.png";
import pacmanUp from "./pacman-up.png";
import pacmanDown from "./pacman-down.png";
import bg from "./bg.png";
import ghost1 from "./ghost1.png";
import ghost2 from "./ghost2.png";
import ghost3 from "./ghost3.png";
import ghost4 from "./ghost4.png";

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

const starGlow = keyframes`
  0% { opacity: 0.6; filter: blur(1px); transform: scale(0.9); }
  50% { opacity: 1; filter: blur(0px); transform: scale(1.1); }
  100% { opacity: 0.6; filter: blur(1px); transform: scale(0.9); }
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

// Styled Components
const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${spaceTheme.deepSpaceGradient};
  position: relative;
  overflow: hidden;
  font-family: 'Orbitron', sans-serif;
  color: ${spaceTheme.textPrimary};
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
  display: flex;
  justify-content: space-between;
  width: 608px;
  padding: 1rem;
  background: rgba(14, 26, 64, 0.8);
  border-radius: 8px;
  border: 1px solid rgba(50, 255, 192, 0.3);
  margin-bottom: 1rem;
  z-index: 10;
`;

const HeaderItem = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${spaceTheme.accentGlow};
  text-shadow: 0 0 5px ${spaceTheme.accentGlow};
`;

const ScoreValue = styled.span`
  color: ${spaceTheme.accentGold};
`;

const GameBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(19, 32px);
  width: 608px;
  height: 672px;
  background: rgba(14, 26, 64, 0.9);
  border: 1px solid rgba(50, 255, 192, 0.3);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  position: relative;
  z-index: 10;
`;

const Cell = styled.div`
  width: 32px;
  height: 32px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const GameMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(14, 26, 64, 0.9);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid rgba(50, 255, 192, 0.3);
  backdrop-filter: blur(8px);
  text-align: center;
  z-index: 100;
  animation: ${css`${warping} 0.3s ease-out`};
`;

const MessageTitle = styled.h2`
  font-size: 2rem;
  color: ${spaceTheme.accentGlow};
  text-shadow: 0 0 10px ${spaceTheme.accentGlow};
  animation: ${glowPulse} 3s infinite ease-in-out;
  margin-bottom: 1rem;
`;

const MessageText = styled.p`
  font-size: 1.2rem;
  color: ${spaceTheme.textPrimary};
  margin: 0.5rem 0;
`;

const MessageButton = styled.button`
  background: ${spaceTheme.actionButton};
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
  margin-top: 1rem;

  &:hover {
    background: ${spaceTheme.accentGlow};
    transform: translateY(-2px);
    box-shadow: 0 0 15px rgba(50, 255, 192, 0.5);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const PacManGame = () => {
  const { updateProgress } = useHabit();
  const navigate = useNavigate(); // Define navigate using useNavigate
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [direction, setDirection] = useState("right");
  const [pacman, setPacman] = useState({ x: 6, y: 4 });
  const [ghosts, setGhosts] = useState([
    { id: 1, x: 1, y: 1, direction: "right", sprite: ghost1, scared: false },
    { id: 2, x: 11, y: 1, direction: "left", sprite: ghost2, scared: false },
    { id: 3, x: 1, y: 7, direction: "up", sprite: ghost3, scared: false },
    { id: 4, x: 11, y: 7, direction: "down", sprite: ghost4, scared: false }
  ]);
  const [powerPillActive, setPowerPillActive] = useState(false);
  const [powerPillTimer, setPowerPillTimer] = useState(null);

  const initialMap = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 3, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 3, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 2, 1, 1, 1, 0, 1, 0, 1, 1, 1, 2, 1, 1, 1, 1],
    [0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
    [1, 1, 1, 1, 2, 1, 0, 1, 1, 0, 1, 1, 0, 1, 2, 1, 1, 1, 1],
    [0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0],
    [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
    [0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
    [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
    [1, 3, 2, 1, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 1, 2, 3, 1],
    [1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1],
    [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ];

  const [map, setMap] = useState(() => JSON.parse(JSON.stringify(initialMap)));
  const [totalCoins, setTotalCoins] = useState(() => initialMap.flat().filter(cell => cell === 2 || cell === 3).length);
  const [collectedCoins, setCollectedCoins] = useState(0);

  const getPacmanSprite = () => {
    switch (direction) {
      case "left": return pacmanLeft;
      case "up": return pacmanUp;
      case "down": return pacmanDown;
      default: return pacmanRight;
    }
  };

  const navigateBack = () => {
    navigate('/breakthrough-game');
  };

  const resetGame = () => {
    setPacman({ x: 6, y: 4 });
    setGhosts([
      { id: 1, x: 1, y: 1, direction: "right", sprite: ghost1, scared: false },
      { id: 2, x: 11, y: 1, direction: "left", sprite: ghost2, scared: false },
      { id: 3, x: 1, y: 7, direction: "up", sprite: ghost3, scared: false },
      { id: 4, x: 11, y: 7, direction: "down", sprite: ghost4, scared: false }
    ]);
    setMap(JSON.parse(JSON.stringify(initialMap)));
    setDirection("right");
    setScore(0);
    setLives(3);
    setLevel(1);
    setGameOver(false);
    setGameWon(false);
    setGamePaused(false);
    setPowerPillActive(false);
    setCollectedCoins(0);
    if (powerPillTimer) {
      clearTimeout(powerPillTimer);
      setPowerPillTimer(null);
    }
  };

  const movePacman = useCallback((newDirection) => {
    if (gameOver || gameWon || gamePaused) return;
    let newX = pacman.x;
    let newY = pacman.y;

    if (newDirection === "left" && pacman.x > 0 && map[pacman.y][pacman.x - 1] !== 1) {
      newX = pacman.x - 1;
      setDirection("left");
    } else if (newDirection === "up" && pacman.y > 0 && map[pacman.y - 1][pacman.x] !== 1) {
      newY = pacman.y - 1;
      setDirection("up");
    } else if (newDirection === "right" && pacman.x < map[0].length - 1 && map[pacman.y][pacman.x + 1] !== 1) {
      newX = pacman.x + 1;
      setDirection("right");
    } else if (newDirection === "down" && pacman.y < map.length - 1 && map[pacman.y + 1][pacman.x] !== 1) {
      newY = pacman.y + 1;
      setDirection("down");
    } else {
      if (direction === "left" && pacman.x > 0 && map[pacman.y][pacman.x - 1] !== 1) {
        newX = pacman.x - 1;
      } else if (direction === "up" && pacman.y > 0 && map[pacman.y - 1][pacman.x] !== 1) {
        newY = pacman.y - 1;
      } else if (direction === "right" && pacman.x < map[0].length - 1 && map[pacman.y][pacman.x + 1] !== 1) {
        newX = pacman.x + 1;
      } else if (direction === "down" && pacman.y < map.length - 1 && map[pacman.y + 1][pacman.x] !== 1) {
        newY = pacman.y + 1;
      }
    }

    if (newX !== pacman.x || newY !== pacman.y) {
      setMap(prevMap => {
        const newMap = [...prevMap];
        if (newMap[newY][newX] === 2) {
          setScore(prevScore => prevScore + 10);
          setCollectedCoins(prev => prev + 1);
        }
        if (newMap[newY][newX] === 3) {
          setScore(prevScore => prevScore + 50);
          setCollectedCoins(prev => prev + 1);
          activatePowerPill();
        }
        if (newMap[newY][newX] === 2 || newMap[newY][newX] === 3) {
          newMap[newY][newX] = 0;
        }
        setPacman({ x: newX, y: newY });
        return newMap;
      });
    }
  }, [pacman, map, direction, gameOver, gameWon, gamePaused]);

  const handleKeyDown = useCallback((event) => {
    if (gameOver || gameWon) {
      if (event.key === " " || event.key === "Enter") resetGame();
      return;
    }
    if (event.key === "p") {
      setGamePaused(prev => !prev);
      return;
    }
    if (gamePaused) return;
    switch (event.key) {
      case "ArrowLeft": movePacman("left"); break;
      case "ArrowUp": movePacman("up"); break;
      case "ArrowRight": movePacman("right"); break;
      case "ArrowDown": movePacman("down"); break;
      default: break;
    }
  }, [movePacman, gameOver, gameWon, gamePaused, resetGame]);

  const activatePowerPill = () => {
    setPowerPillActive(true);
    setGhosts(prevGhosts => prevGhosts.map(ghost => ({ ...ghost, scared: true })));
    if (powerPillTimer) clearTimeout(powerPillTimer);
    const timer = setTimeout(() => {
      setPowerPillActive(false);
      setGhosts(prevGhosts => prevGhosts.map(ghost => ({ ...ghost, scared: false })));
    }, 10000);
    setPowerPillTimer(timer);
  };

  const moveGhosts = useCallback(() => {
    if (gameOver || gameWon || gamePaused) return;
    setGhosts(prevGhosts => {
      return prevGhosts.map(ghost => {
        const { x, y, direction, scared } = ghost;
        const possibleDirections = [];
        if (y > 0 && map[y - 1][x] !== 1) possibleDirections.push("up");
        if (y < map.length - 1 && map[y + 1][x] !== 1) possibleDirections.push("down");
        if (x > 0 && map[y][x - 1] !== 1) possibleDirections.push("left");
        if (x < map[0].length - 1 && map[y][x + 1] !== 1) possibleDirections.push("right");

        const oppositeDirections = { up: "down", down: "up", left: "right", right: "left" };
        const filteredDirections = possibleDirections.filter(
          dir => dir !== oppositeDirections[direction] || possibleDirections.length === 1
        );

        let newDirection = direction;
        let newX = x;
        let newY = y;

        if (filteredDirections.length > 0) {
          if (!scared && Math.random() > 0.3) {
            let bestDirection = filteredDirections[0];
            let bestDistance = Infinity;
            filteredDirections.forEach(dir => {
              let testX = x;
              let testY = y;
              if (dir === "up") testY--;
              else if (dir === "down") testY++;
              else if (dir === "left") testX--;
              else if (dir === "right") testX++;
              const distance = Math.sqrt(Math.pow(pacman.x - testX, 2) + Math.pow(pacman.y - testY, 2));
              if (distance < bestDistance) {
                bestDistance = distance;
                bestDirection = dir;
              }
            });
            newDirection = bestDirection;
          } else {
            newDirection = filteredDirections[Math.floor(Math.random() * filteredDirections.length)];
          }
          if (newDirection === "up") newY--;
          else if (newDirection === "down") newY++;
          else if (newDirection === "left") newX--;
          else if (newDirection === "right") newX++;
        }
        return { ...ghost, x: newX, y: newY, direction: newDirection };
      });
    });
  }, [map, pacman, gameOver, gameWon, gamePaused]);

  const checkCollisions = useCallback(() => {
    if (gameOver || gameWon || gamePaused) return;
    ghosts.forEach(ghost => {
      if (ghost.x === pacman.x && ghost.y === pacman.y) {
        if (powerPillActive && ghost.scared) {
          setScore(prev => prev + 200);
          updateProgress('games', 5);
          setGhosts(prevGhosts => 
            prevGhosts.map(g => 
              g.id === ghost.id 
                ? { ...g, x: g.id % 2 === 1 ? 1 : 11, y: g.id <= 2 ? 1 : 7, scared: false } 
                : g
            )
          );
        } else {
          setLives(prev => prev - 1);
          if (lives <= 1) {
            setGameOver(true);
          } else {
            setPacman({ x: 9, y: 15 });
            setDirection("right");
          }
        }
      }
    });
  }, [pacman, ghosts, powerPillActive, lives, gameOver, gameWon, gamePaused, updateProgress]);

  const checkWinCondition = useCallback(() => {
    if (collectedCoins >= totalCoins) {
      updateProgress('games', 20);
      setGameWon(true);
      setTimeout(() => {
        setLevel(prev => prev + 1);
        setPacman({ x: 9, y: 15 });
        setMap(JSON.parse(JSON.stringify(initialMap)));
        setCollectedCoins(0);
        setGameWon(false);
      }, 3000);
    }
  }, [collectedCoins, totalCoins, updateProgress]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (gameOver || gameWon || gamePaused) return;
    const ghostSpeed = Math.max(300 - (level - 1) * 50, 100);
    const ghostInterval = setInterval(moveGhosts, ghostSpeed);
    return () => clearInterval(ghostInterval);
  }, [moveGhosts, level, gameOver, gameWon, gamePaused]);

  useEffect(() => {
    if (gameOver || gameWon || gamePaused) return;
    const pacmanInterval = setInterval(() => movePacman(direction), 200);
    return () => clearInterval(pacmanInterval);
  }, [movePacman, direction, gameOver, gameWon, gamePaused]);

  useEffect(() => {
    if (gameOver || gameWon || gamePaused) return;
    const collisionInterval = setInterval(() => {
      checkCollisions();
      checkWinCondition();
    }, 100);
    return () => clearInterval(collisionInterval);
  }, [checkCollisions, checkWinCondition, gameOver, gameWon, gamePaused]);

  useEffect(() => {
    return () => {
      if (powerPillTimer) clearTimeout(powerPillTimer);
    };
  }, [powerPillTimer]);

  return (
    <GameContainer>
      <BackgroundOverlay />
      <Star size="20px" style={{ top: '10%', left: '10%' }} duration="4s" delay="0.5s" color="rgba(255, 223, 108, 0.9)" />
      <Star size="15px" style={{ top: '25%', left: '25%' }} duration="3s" delay="1s" color="rgba(50, 255, 192, 0.9)" />
      <Star size="25px" style={{ top: '15%', right: '30%' }} duration="5s" delay="0.2s" color="rgba(0, 249, 255, 0.9)" />
      <GameHeader>
        <HeaderItem>Score: <ScoreValue>{score}</ScoreValue></HeaderItem>
        <HeaderItem>Lives: <ScoreValue>{lives}</ScoreValue></HeaderItem>
        <HeaderItem>Level: <ScoreValue>{level}</ScoreValue></HeaderItem>
      </GameHeader>
      <GameBoard>
        {map.map((row, rowIndex) => (
          row.map((cell, colIndex) => {
            const ghostAtPosition = ghosts.find(
              ghost => ghost.x === colIndex && ghost.y === rowIndex
            );
            const pacmanAtPosition = pacman.x === colIndex && pacman.y === rowIndex;
            return (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                style={{
                  backgroundImage: pacmanAtPosition
                    ? `url(${getPacmanSprite()})`
                    : ghostAtPosition
                    ? `url(${ghostAtPosition.scared ? 'ghostScared.png' : ghostAtPosition.sprite})`
                    : cell === 1 ? `url(${wall})`
                    : cell === 2 ? `url(${coin})`
                    : cell === 3 ? `url(powerPill.png)`
                    : `url(${bg})`
                }}
              />
            );
          })
        ))}
      </GameBoard>
      {gameOver && (
        <GameMessage>
          <MessageTitle>Game Over</MessageTitle>
          <MessageText>Final Score: {score}</MessageText>
          <MessageButton onClick={resetGame}>Play Again</MessageButton>
        </GameMessage>
      )}
      {gameWon && (
        <GameMessage>
          <MessageTitle>Level Complete!</MessageTitle>
          <MessageText>+20 XP Awarded</MessageText>
          <MessageText>Moving to Level {level + 1}</MessageText>
        </GameMessage>
      )}
      {gamePaused && (
        <GameMessage>
          <MessageTitle>Game Paused</MessageTitle>
          <MessageText>Press 'P' to continue</MessageText>
        </GameMessage>
      )}
      <ButtonsContainer>
        <Button onClick={navigateBack}>Back to Breakthrough</Button>
      </ButtonsContainer>
    </GameContainer>
  );
};

export default PacManGame;