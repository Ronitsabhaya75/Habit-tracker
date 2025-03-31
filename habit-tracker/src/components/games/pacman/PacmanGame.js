import React, { useState, useEffect, useCallback } from "react";
import wall from "./wall.png";
import coin from "./coin.png";
import pacmanRight from "./pacman-right.png"; // You'll need these additional directional sprites
import pacmanLeft from "./pacman-left.png";
import pacmanUp from "./pacman-up.png";
import pacmanDown from "./pacman-down.png";
import bg from "./bg.png";
import ghost1 from "./ghost1.png"; // Multiple ghost sprites for different ghosts
import ghost2 from "./ghost2.png";
import ghost3 from "./ghost3.png";
import ghost4 from "./ghost4.png";
import "./App.css";

const PacManGame = () => {
  // Game states
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [direction, setDirection] = useState("right"); // Track Pacman's direction
  
  // Pacman and ghost positions
  const [pacman, setPacman] = useState({ x: 6, y: 4 });
  const [ghosts, setGhosts] = useState([
    { id: 1, x: 1, y: 1, direction: "right", sprite: ghost1, scared: false },
    { id: 2, x: 11, y: 1, direction: "left", sprite: ghost2, scared: false },
    { id: 3, x: 1, y: 7, direction: "up", sprite: ghost3, scared: false },
    { id: 4, x: 11, y: 7, direction: "down", sprite: ghost4, scared: false }
  ]);
  
  // Power pill state
  const [powerPillActive, setPowerPillActive] = useState(false);
  const [powerPillTimer, setPowerPillTimer] = useState(null);
  
  // Initial map - 0=empty, 1=wall, 2=coin, 3=power pill, G=ghost start positions
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
  
  const [map, setMap] = useState(() => {
    // Deep copy the initialMap to avoid reference issues
    return JSON.parse(JSON.stringify(initialMap));
  });
  
  // Count total coins for winning condition
  const [totalCoins, setTotalCoins] = useState(() => {
    return initialMap.flat().filter(cell => cell === 2 || cell === 3).length;
  });
  
  const [collectedCoins, setCollectedCoins] = useState(0);

  // Get the appropriate Pacman sprite based on direction
  const getPacmanSprite = () => {
    switch (direction) {
      case "left": return pacmanLeft;
      case "up": return pacmanUp;
      case "down": return pacmanDown;
      default: return pacmanRight; // right is default
    }
  };

  // Function to reset the game
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

  // Function to handle PacMan movement
  const movePacman = useCallback((newDirection) => {
    if (gameOver || gameWon || gamePaused) return;
    
    let newX = pacman.x;
    let newY = pacman.y;
    
    // Calculate new position based on direction
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
      // If the new direction is blocked, try to continue in the current direction
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
    
    // If position changed, update the map
    if (newX !== pacman.x || newY !== pacman.y) {
      setMap(prevMap => {
        const newMap = [...prevMap];
        
        // Handle coin collection
        if (newMap[newY][newX] === 2) {
          setScore(prevScore => prevScore + 10);
          setCollectedCoins(prev => prev + 1);
        }
        
        // Handle power pill collection
        if (newMap[newY][newX] === 3) {
          setScore(prevScore => prevScore + 50);
          setCollectedCoins(prev => prev + 1);
          activatePowerPill();
        }
        
        // Clear the new position (remove coin or power pill)
        if (newMap[newY][newX] === 2 || newMap[newY][newX] === 3) {
          newMap[newY][newX] = 0;
        }
        
        setPacman({ x: newX, y: newY });
        return newMap;
      });
    }
  }, [pacman, map, direction, gameOver, gameWon, gamePaused]);

  // Function to handle keyboard input
  const handleKeyDown = useCallback((event) => {
    if (gameOver || gameWon) {
      if (event.key === " " || event.key === "Enter") {
        resetGame();
      }
      return;
    }
    
    if (event.key === "p") {
      setGamePaused(prev => !prev);
      return;
    }
    
    if (gamePaused) return;
    
    switch (event.key) {
      case "ArrowLeft":
        movePacman("left");
        break;
      case "ArrowUp":
        movePacman("up");
        break;
      case "ArrowRight":
        movePacman("right");
        break;
      case "ArrowDown":
        movePacman("down");
        break;
      default:
        break;
    }
  }, [movePacman, gameOver, gameWon, gamePaused, resetGame]);

  // Function to activate power pill
  const activatePowerPill = () => {
    setPowerPillActive(true);
    
    // Make all ghosts scared
    setGhosts(prevGhosts => 
      prevGhosts.map(ghost => ({
        ...ghost,
        scared: true
      }))
    );
    
    // Clear existing timer if there is one
    if (powerPillTimer) {
      clearTimeout(powerPillTimer);
    }
    
    // Set timer for power pill duration (10 seconds)
    const timer = setTimeout(() => {
      setPowerPillActive(false);
      setGhosts(prevGhosts => 
        prevGhosts.map(ghost => ({
          ...ghost,
          scared: false
        }))
      );
    }, 10000);
    
    setPowerPillTimer(timer);
  };

  // Function to move ghosts
  const moveGhosts = useCallback(() => {
    if (gameOver || gameWon || gamePaused) return;
    
    setGhosts(prevGhosts => {
      return prevGhosts.map(ghost => {
        const { x, y, direction, scared } = ghost;
        const possibleDirections = [];
        
        // Check all four directions
        if (y > 0 && map[y - 1][x] !== 1) possibleDirections.push("up");
        if (y < map.length - 1 && map[y + 1][x] !== 1) possibleDirections.push("down");
        if (x > 0 && map[y][x - 1] !== 1) possibleDirections.push("left");
        if (x < map[0].length - 1 && map[y][x + 1] !== 1) possibleDirections.push("right");
        
        // Remove opposite direction to avoid back-and-forth movement
        // unless it's the only option
        const oppositeDirections = {
          up: "down",
          down: "up",
          left: "right",
          right: "left"
        };
        
        const filteredDirections = possibleDirections.filter(
          dir => dir !== oppositeDirections[direction] || possibleDirections.length === 1
        );
        
        // When not scared, prefer moving towards Pacman
        let newDirection = direction;
        let newX = x;
        let newY = y;
        
        if (filteredDirections.length > 0) {
          if (!scared && Math.random() > 0.3) {
            // Try to move towards Pacman with 70% probability
            const distanceToTarget = (dx, dy) => 
              Math.sqrt(Math.pow(pacman.x - dx, 2) + Math.pow(pacman.y - dy, 2));
            
            let bestDirection = filteredDirections[0];
            let bestDistance = Infinity;
            
            filteredDirections.forEach(dir => {
              let testX = x;
              let testY = y;
              
              if (dir === "up") testY--;
              else if (dir === "down") testY++;
              else if (dir === "left") testX--;
              else if (dir === "right") testX++;
              
              const distance = distanceToTarget(testX, testY);
              if (distance < bestDistance) {
                bestDistance = distance;
                bestDirection = dir;
              }
            });
            
            newDirection = bestDirection;
          } else {
            // Random movement
            newDirection = filteredDirections[Math.floor(Math.random() * filteredDirections.length)];
          }
          
          // Calculate new position
          if (newDirection === "up") newY--;
          else if (newDirection === "down") newY++;
          else if (newDirection === "left") newX--;
          else if (newDirection === "right") newX++;
        }
        
        return {
          ...ghost,
          x: newX,
          y: newY,
          direction: newDirection
        };
      });
    });
  }, [map, pacman, gameOver, gameWon, gamePaused]);

  // Check for collisions between PacMan and ghosts
  const checkCollisions = useCallback(() => {
    if (gameOver || gameWon || gamePaused) return;
    
    // Check each ghost for collision with PacMan
    ghosts.forEach(ghost => {
      if (ghost.x === pacman.x && ghost.y === pacman.y) {
        if (powerPillActive && ghost.scared) {
          // PacMan eats the ghost, ghost returns to starting position
          setScore(prev => prev + 200);
          setGhosts(prevGhosts => 
            prevGhosts.map(g => 
              g.id === ghost.id 
                ? { ...g, x: g.id % 2 === 1 ? 1 : 11, y: g.id <= 2 ? 1 : 7, scared: false } 
                : g
            )
          );
        } else {
          // Ghost catches PacMan, lose a life
          setLives(prev => prev - 1);
          if (lives <= 1) {
            setGameOver(true);
          } else {
            // Reset positions but continue game
            setPacman({ x: 9, y: 15 });
            setDirection("right");
          }
        }
      }
    });
  }, [pacman, ghosts, powerPillActive, lives, gameOver, gameWon, gamePaused]);

  // Check win condition
  const checkWinCondition = useCallback(() => {
    if (collectedCoins >= totalCoins) {
      setGameWon(true);
      // Level up after a delay
      setTimeout(() => {
        setLevel(prev => prev + 1);
        setPacman({ x: 9, y: 15 });
        setMap(JSON.parse(JSON.stringify(initialMap)));
        setCollectedCoins(0);
        setGameWon(false);
        // Increase difficulty by making ghosts faster (handled in useEffect)
      }, 3000);
    }
  }, [collectedCoins, totalCoins]);

  // Set up keyboard event listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Ghost movement interval
  useEffect(() => {
    if (gameOver || gameWon || gamePaused) return;
    
    // Adjust ghost speed based on level
    const ghostSpeed = Math.max(300 - (level - 1) * 50, 100);
    
    const ghostInterval = setInterval(() => {
      moveGhosts();
    }, ghostSpeed);
    
    return () => clearInterval(ghostInterval);
  }, [moveGhosts, level, gameOver, gameWon, gamePaused]);

  // Pacman movement interval (for continuous movement)
  useEffect(() => {
    if (gameOver || gameWon || gamePaused) return;
    
    const pacmanInterval = setInterval(() => {
      movePacman(direction);
    }, 200); // Pacman moves every 200ms
    
    return () => clearInterval(pacmanInterval);
  }, [movePacman, direction, gameOver, gameWon, gamePaused]);

  // Collision detection interval
  useEffect(() => {
    if (gameOver || gameWon || gamePaused) return;
    
    const collisionInterval = setInterval(() => {
      checkCollisions();
      checkWinCondition();
    }, 100);
    
    return () => clearInterval(collisionInterval);
  }, [checkCollisions, checkWinCondition, gameOver, gameWon, gamePaused]);

  // Clean up power pill timer on unmount
  useEffect(() => {
    return () => {
      if (powerPillTimer) {
        clearTimeout(powerPillTimer);
      }
    };
  }, [powerPillTimer]);

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="score">Score: {score}</div>
        <div className="lives">Lives: {lives}</div>
        <div className="level">Level: {level}</div>
      </div>
      
      <div className="game-board" style={{ backgroundColor: "black" }}>
        {/* Render the game map */}
        {map.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => {
              // Check if there's a ghost at this position
              const ghostAtPosition = ghosts.find(
                ghost => ghost.x === colIndex && ghost.y === rowIndex
              );
              
              // Check if pacman is at this position
              const pacmanAtPosition = pacman.x === colIndex && pacman.y === rowIndex;
              
              return (
                <div
                  key={colIndex}
                  className={
                    cell === 1
                      ? "wall"
                      : cell === 2
                      ? "coin"
                      : cell === 3
                      ? "power-pill"
                      : "empty"
                  }
                  style={{
                    backgroundImage: pacmanAtPosition
                      ? `url(${getPacmanSprite()})`
                      : ghostAtPosition
                      ? `url(${ghostAtPosition.scared ? 'ghostScared.png' : ghostAtPosition.sprite})`
                      : cell === 1
                      ? `url(${wall})`
                      : cell === 2
                      ? `url(${coin})`
                      : cell === 3
                      ? `url(powerPill.png)` // You'll need this image
                      : `url(${bg})`
                  }}
                ></div>
              );
            })}
          </div>
        ))}
      </div>
      
      {/* Game messages */}
      {gameOver && (
        <div className="game-message">
          <h2>Game Over</h2>
          <p>Final Score: {score}</p>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
      
      {gameWon && (
        <div className="game-message">
          <h2>Level Complete!</h2>
          <p>Moving to Level {level + 1}</p>
        </div>
      )}
      
      {gamePaused && (
        <div className="game-message">
          <h2>Game Paused</h2>
          <p>Press 'P' to continue</p>
        </div>
      )}
    </div>
  );
};

export default PacManGame;