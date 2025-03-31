import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const GameContainer = styled.div`
  position: relative;
  width: 500px;
  height: 500px;
  margin: 0 auto;
  background-color: #000;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 255, 0.5);
  border: 3px solid #2121DE;
`;

const Maze = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(
    circle,
    rgba(10, 10, 40, 0.8) 1px,
    transparent 1px
  );
  background-size: 20px 20px;
`;

const Pacman = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  background-color: #FFFF00;
  border-radius: 50%;
  clip-path: ${props => {
    switch(props.direction) {
      case 'right':
        return 'polygon(0 0, 100% 50%, 0 100%, 0 75%, 25% 50%, 0 25%)';
      case 'left':
        return 'polygon(100% 0, 0 50%, 100% 100%, 100% 75%, 75% 50%, 100% 25%)';
      case 'up':
        return 'polygon(0 100%, 50% 0, 100% 100%, 75% 100%, 50% 75%, 25% 100%)';
      case 'down':
        return 'polygon(0 0, 50% 100%, 100% 0, 75% 0, 50% 25%, 25% 0)';
      default:
        return 'polygon(0 0, 100% 50%, 0 100%, 0 75%, 25% 50%, 0 25%)';
    }
  }};
  z-index: 2;
  transition: all 0.15s linear;
  box-shadow: 0 0 10px rgba(255, 255, 0, 0.7);
  transform: ${props => {
    const angle = props.mouthClosed ? 0 : 
      (props.direction === 'right' ? 0 :
       props.direction === 'left' ? 180 :
       props.direction === 'up' ? 270 :
       props.direction === 'down' ? 90 : 0);
    return `rotate(${angle}deg)`;
  }};
`;

const Ghost = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  background-color: ${props => props.color || '#FF0000'};
  border-radius: 15px 15px 0 0;
  z-index: 1;
  box-shadow: 0 0 10px ${props => props.color || 'rgba(255, 0, 0, 0.7)'};
  
  &:before {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 5px;
    background-color: ${props => props.color || '#FF0000'};
    clip-path: polygon(
      0% 0%, 20% 100%, 40% 0%, 60% 100%, 80% 0%, 100% 100%, 100% 0%
    );
  }

  &:after {
    content: '';
    position: absolute;
    width: 5px;
    height: 5px;
    background-color: white;
    border-radius: 50%;
    top: 8px;
    left: 6px;
    box-shadow: 12px 0 0 0 white;
  }
`;

const Dot = styled.div`
  position: absolute;
  width: 6px;
  height: 6px;
  background-color: #FFFFFF;
  border-radius: 50%;
  z-index: 0;
  box-shadow: 0 0 3px rgba(255, 255, 255, 0.8);
`;

const PowerPellet = styled.div`
  position: absolute;
  width: 15px;
  height: 15px;
  background-color: #FFFFFF;
  border-radius: 50%;
  z-index: 0;
  box-shadow: 0 0 8px rgba(255, 255, 255, 1);
  animation: pulse 0.8s infinite alternate;
  
  @keyframes pulse {
    from { transform: scale(0.8); opacity: 0.7; }
    to { transform: scale(1.1); opacity: 1; }
  }
`;

const ScoreBoard = styled.div`
  font-family: 'Press Start 2P', cursive, monospace;
  color: white;
  background-color: #000;
  padding: 10px 20px;
  border-radius: 4px;
  text-align: center;
  margin-bottom: 15px;
  border: 2px solid #2121DE;
  box-shadow: 0 0 10px rgba(33, 33, 222, 0.5);
`;

const Instructions = styled.div`
  font-family: 'Press Start 2P', cursive, monospace;
  color: yellow;
  background-color: #000;
  padding: 10px 20px;
  border-radius: 4px;
  text-align: center;
  margin-top: 15px;
  border: 2px solid #2121DE;
  font-size: 12px;
`;

const GameOver = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  flex-direction: column;
  
  h2 {
    color: red;
    font-family: 'Press Start 2P', cursive, monospace;
    text-shadow: 0 0 10px rgba(255, 0, 0, 0.8);
    font-size: 28px;
    margin-bottom: 20px;
  }
  
  button {
    background-color: yellow;
    border: none;
    padding: 10px 20px;
    font-family: 'Press Start 2P', cursive, monospace;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.2s;
    
    &:hover {
      transform: scale(1.1);
      box-shadow: 0 0 10px rgba(255, 255, 0, 0.8);
    }
  }
`;

const PacmanGame = () => {
  const [pacmanPosition, setPacmanPosition] = useState({ x: 250, y: 250 });
  const [ghosts, setGhosts] = useState([
    { id: 1, x: 100, y: 100, color: '#FF0000' }, // Red
    { id: 2, x: 400, y: 100, color: '#00FFDE' }, // Cyan
    { id: 3, x: 100, y: 400, color: '#FFB8DE' }, // Pink
    { id: 4, x: 400, y: 400, color: '#FFB852' }, // Orange
  ]);
  const [dots, setDots] = useState([]);
  const [powerPellets, setPowerPellets] = useState([
    { x: 50, y: 50 },
    { x: 450, y: 50 },
    { x: 50, y: 450 },
    { x: 450, y: 450 },
  ]);
  const [score, setScore] = useState(0);
  const [direction, setDirection] = useState('right');
  const [mouthClosed, setMouthClosed] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPowerMode, setIsPowerMode] = useState(false);

  // Initialize dots
  useEffect(() => {
    const newDots = [];
    for (let x = 30; x < 480; x += 40) {
      for (let y = 30; y < 480; y += 40) {
        // Skip areas near power pellets
        if (!(
          (x < 80 && y < 80) ||
          (x > 420 && y < 80) ||
          (x < 80 && y > 420) ||
          (x > 420 && y > 420)
        )) {
          newDots.push({ x, y, eaten: false });
        }
      }
    }
    setDots(newDots);
  }, []);

  // Mouth animation
  useEffect(() => {
    const mouthInterval = setInterval(() => {
      setMouthClosed(prev => !prev);
    }, 200);
    
    return () => clearInterval(mouthInterval);
  }, []);

  // Power mode timer
  useEffect(() => {
    if (isPowerMode) {
      const powerTimer = setTimeout(() => {
        setIsPowerMode(false);
      }, 8000);
      
      return () => clearTimeout(powerTimer);
    }
  }, [isPowerMode]);

  // Move ghosts
  useEffect(() => {
    const ghostInterval = setInterval(() => {
      setGhosts(prevGhosts => {
        return prevGhosts.map(ghost => {
          // In power mode, ghosts try to run away
          const targetX = isPowerMode 
            ? (ghost.x > pacmanPosition.x ? ghost.x + 10 : ghost.x - 10)
            : (Math.random() > 0.7 
              ? (ghost.x < pacmanPosition.x ? ghost.x + 10 : ghost.x - 10)
              : ghost.x + (Math.random() > 0.5 ? 10 : -10));
              
          const targetY = isPowerMode 
            ? (ghost.y > pacmanPosition.y ? ghost.y + 10 : ghost.y - 10)
            : (Math.random() > 0.7 
              ? (ghost.y < pacmanPosition.y ? ghost.y + 10 : ghost.y - 10)
              : ghost.y + (Math.random() > 0.5 ? 10 : -10));
          
          return {
            ...ghost,
            x: Math.max(10, Math.min(470, targetX)),
            y: Math.max(10, Math.min(470, targetY)),
            color: isPowerMode ? '#2121FF' : ghost.color // Blue when vulnerable
          };
        });
      });
    }, isPowerMode ? 600 : 400); // Slower in power mode

    return () => clearInterval(ghostInterval);
  }, [pacmanPosition, isPowerMode]);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          setDirection('up');
          break;
        case 'ArrowDown':
          setDirection('down');
          break;
        case 'ArrowLeft':
          setDirection('left');
          break;
        case 'ArrowRight':
          setDirection('right');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Move Pacman
  useEffect(() => {
    if (isGameOver) return;
    
    const moveInterval = setInterval(() => {
      setPacmanPosition(prev => {
        let newX = prev.x;
        let newY = prev.y;
        const step = 5;

        switch (direction) {
          case 'up':
            newY = Math.max(15, prev.y - step);
            break;
          case 'down':
            newY = Math.min(485, prev.y + step);
            break;
          case 'left':
            newX = Math.max(15, prev.x - step);
            break;
          case 'right':
            newX = Math.min(485, prev.x + step);
            break;
          default:
            break;
        }

        // Check for dot collisions
        setDots(prevDots => {
          return prevDots.map(dot => {
            if (
              !dot.eaten &&
              Math.abs(newX - dot.x) < 15 &&
              Math.abs(newY - dot.y) < 15
            ) {
              setScore(s => s + 10);
              return { ...dot, eaten: true };
            }
            return dot;
          });
        });
        
        // Check for power pellet collisions
        setPowerPellets(prevPellets => {
          return prevPellets.map(pellet => {
            if (
              !pellet.eaten &&
              Math.abs(newX - pellet.x) < 20 &&
              Math.abs(newY - pellet.y) < 20
            ) {
              setScore(s => s + 50);
              setIsPowerMode(true);
              return { ...pellet, eaten: true };
            }
            return pellet;
          });
        });

        return { x: newX, y: newY };
      });
    }, 30);

    return () => clearInterval(moveInterval);
  }, [direction, isGameOver]);

  // Check for collisions with ghosts
  useEffect(() => {
    if (isGameOver) return;
    
    ghosts.forEach(ghost => {
      if (
        Math.abs(pacmanPosition.x - ghost.x) < 20 &&
        Math.abs(pacmanPosition.y - ghost.y) < 20
      ) {
        if (isPowerMode) {
          // Eat the ghost
          setScore(prevScore => prevScore + 200);
          setGhosts(prevGhosts => 
            prevGhosts.map(g => 
              g.id === ghost.id 
                ? {...g, x: Math.floor(Math.random() * 450) + 25, y: Math.floor(Math.random() * 450) + 25}
                : g
            )
          );
        } else {
          // Game over
          setIsGameOver(true);
        }
      }
    });
    
    // Check if all dots are eaten
    const allDotsEaten = dots.every(dot => dot.eaten) && powerPellets.every(pellet => pellet.eaten);
    if (allDotsEaten && dots.length > 0) {
      setIsGameOver(true);
    }
  }, [pacmanPosition, ghosts, dots, isPowerMode, isGameOver, powerPellets]);

  const restartGame = () => {
    setPacmanPosition({ x: 250, y: 250 });
    setDirection('right');
    setScore(0);
    setIsGameOver(false);
    setIsPowerMode(false);
    
    // Reset ghosts
    setGhosts([
      { id: 1, x: 100, y: 100, color: '#FF0000' },
      { id: 2, x: 400, y: 100, color: '#00FFDE' },
      { id: 3, x: 100, y: 400, color: '#FFB8DE' },
      { id: 4, x: 400, y: 400, color: '#FFB852' },
    ]);
    
    // Reset dots
    setDots(prevDots => prevDots.map(dot => ({ ...dot, eaten: false })));
    
    // Reset power pellets
    setPowerPellets([
      { x: 50, y: 50, eaten: false },
      { x: 450, y: 50, eaten: false },
      { x: 50, y: 450, eaten: false },
      { x: 450, y: 450, eaten: false },
    ]);
  };

  return (
    <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#111', borderRadius: '10px' }}>
      <h1 style={{ color: 'yellow', fontFamily: "'Press Start 2P', cursive, monospace", textShadow: '0 0 10px rgba(255, 255, 0, 0.7)' }}>PAC-MAN</h1>
      
      <ScoreBoard>
        <h3>SCORE: {score}</h3>
        {isPowerMode && <p style={{ color: 'cyan' }}>POWER MODE!</p>}
      </ScoreBoard>
      
      <GameContainer>
        <Maze>
          <Pacman
            direction={direction}
            mouthClosed={mouthClosed}
            style={{
              left: `${pacmanPosition.x - 15}px`,
              top: `${pacmanPosition.y - 15}px`,
            }}
          />
          
          {ghosts.map(ghost => (
            <Ghost
              key={ghost.id}
              color={ghost.color}
              style={{
                left: `${ghost.x - 15}px`,
                top: `${ghost.y - 15}px`,
              }}
            />
          ))}
          
          {dots.map(
            (dot, index) =>
              !dot.eaten && (
                <Dot
                  key={index}
                  style={{
                    left: `${dot.x - 3}px`,
                    top: `${dot.y - 3}px`,
                  }}
                />
              )
          )}
          
          {powerPellets.map(
            (pellet, index) =>
              !pellet.eaten && (
                <PowerPellet
                  key={`power-${index}`}
                  style={{
                    left: `${pellet.x - 7.5}px`,
                    top: `${pellet.y - 7.5}px`,
                  }}
                />
              )
          )}
          
          {isGameOver && (
            <GameOver>
              <h2>{dots.every(dot => dot.eaten) ? "YOU WIN!" : "GAME OVER"}</h2>
              <p style={{ color: 'white', marginBottom: '20px' }}>Final Score: {score}</p>
              <button onClick={restartGame}>Play Again</button>
            </GameOver>
          )}
        </Maze>
      </GameContainer>
      
      <Instructions>
        <p>USE ARROW KEYS TO CONTROL PACMAN</p>
        <p>EAT DOTS: 10 PTS | POWER PELLETS: 50 PTS | GHOSTS: 200 PTS</p>
      </Instructions>
    </div>
  );
};

export default PacmanGame;