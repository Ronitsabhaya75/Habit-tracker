import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { useAuth } from '../context/AuthContext';

// Styled components from Dashboard
const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  position: relative;
  color: ${theme.colors.text};
`;

const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: ${theme.colors.background};
  overflow: hidden;
`;

const GradientOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 50%, rgba(114, 137, 218, 0.15) 0%, transparent 70%),
              radial-gradient(circle at 70% 70%, rgba(90, 128, 244, 0.1) 0%, transparent 60%);
  z-index: 1;
`;

const Scenery = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30%;
  background: linear-gradient(180deg, transparent 0%, rgba(11, 38, 171, 0.2) 100%);
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
  }
`;

const Sidebar = styled.div`
  width: 250px;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-right: 1px solid ${theme.colors.borderWhite};
  backdrop-filter: blur(8px);
  z-index: 10;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 2rem;
`;

const NavItem = styled.li`
  padding: 1rem;
  margin: 0.5rem 0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 1rem;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  &.active {
    background: ${theme.colors.secondary};
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 3rem;
  margin-left: 20px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SpinWheelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 2rem;
  color: white;
  font-family: 'Arial, sans-serif';
`;

const WheelHeader = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: ${theme.colors.text};
`;

const WheelWrapper = styled.div`
  position: relative;
  width: 400px;
  height: 430px;
`;

const SpinButton = styled.button`
  margin-top: 2rem;
  padding: 1rem 2rem;
  background-color: ${props => props.disabled ? '#45a049aa' : '#4CAF50'};
  color: white;
  border: none;
  border-radius: 10px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 1.5rem;
  font-weight: bold;
  width: 200px;
  text-align: center;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const SpinWheel = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);

  const segments = [
    { color: '#FFDDC1', reward: 'XP 10' },
    { color: '#C1FFD7', reward: 'XP 20' },
    { color: '#C1E1FF', reward: 'XP 30' },
    { color: '#FFC1E1', reward: 'XP 40' },
    { color: '#FFC1C1', reward: 'XP 50' },
    { color: '#E1C1FF', reward: 'XP 60' }
  ];

  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    const randomRotation = Math.floor(Math.random() * 360) + 360 * 5; // Spin at least 5 full rotations
    const newRotation = rotation + randomRotation;
    setRotation(newRotation);

    setTimeout(() => {
      const segmentAngle = 360 / segments.length;
      // Calculate winning segment based on where the wheel stops relative to the fixed pointer
      const normalizedRotation = newRotation % 360;
      const winningSegmentIndex = Math.floor(normalizedRotation / segmentAngle) % segments.length;
      const winningSegment = segments[segments.length - 1 - winningSegmentIndex];
      alert(`You won: ${winningSegment.reward}!`);
      setSpinning(false);
    }, 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Calculate the SVG path for each segment
  const createSegmentPath = (index, total) => {
    const angle = 360 / total;
    const startAngle = index * angle;
    const endAngle = (index + 1) * angle;

    const startRadians = (startAngle - 90) * Math.PI / 180;
    const endRadians = (endAngle - 90) * Math.PI / 180;

    // Larger radius for bigger wheel
    const radius = 195;
    const centerX = 200;
    const centerY = 200;

    const x1 = centerX + radius * Math.cos(startRadians);
    const y1 = centerY + radius * Math.sin(startRadians);
    const x2 = centerX + radius * Math.cos(endRadians);
    const y2 = centerY + radius * Math.sin(endRadians);

    const largeArcFlag = angle > 180 ? 1 : 0;

    return `M${centerX},${centerY} L${x1},${y1} A${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2} Z`;
  };

  return (
    <DashboardContainer>
      <Background>
        <GradientOverlay />
        <Scenery />
      </Background>

      <Sidebar>
        <h2>HabitQuest</h2>
        <NavList>
          <NavItem onClick={() => navigate('/dashboard')}>Dashboard</NavItem>
          <NavItem className="active">SpinWheel</NavItem>
          <NavItem onClick={() => navigate('/breakthrough-game')}>Games</NavItem>
          <NavItem onClick={() => navigate('/track')}>Events</NavItem>
          <NavItem onClick={() => navigate('/review')}>Review</NavItem>
        </NavList>
      </Sidebar>

      <MainContent>
        <SpinWheelContainer>
          <WheelHeader>Spin the Wheel</WheelHeader>

          <WheelWrapper>
            {/* Arrow indicator */}
            <div style={{
              position: 'absolute',
              top: '0',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '40px',
              height: '50px',
              zIndex: 30
            }}>
              <svg width="40" height="50" viewBox="0 0 40 50">
                <polygon points="0,25 20,0 40,25 20,50" fill="#FF5722" stroke="#333" strokeWidth="3"/>
              </svg>
            </div>

            {/* The wheel */}
            <div style={{
              position: 'absolute',
              top: '50px',
              left: '0',
              width: '400px',
              height: '400px'
            }}>
              <svg width="400" height="400" viewBox="0 0 400 400">
                <g transform={`rotate(${rotation} 200 200)`} style={{ transition: spinning ? 'transform 3s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none' }}>
                  {segments.map((segment, index) => (
                    <path
                      key={index}
                      d={createSegmentPath(index, segments.length)}
                      fill={segment.color}
                      stroke="#333"
                      strokeWidth="2"
                    />
                  ))}

                  {/* Text labels for each segment */}
                  {segments.map((segment, index) => {
                    const angle = 360 / segments.length;
                    const midAngle = (index * angle + angle / 2 - 90) * Math.PI / 180;
                    const radius = 130; // Distance from center for text (increased)
                    const x = 200 + radius * Math.cos(midAngle);
                    const y = 200 + radius * Math.sin(midAngle);

                    return (
                      <text
                        key={`text-${index}`}
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${index * angle + angle / 2} ${x} ${y})`}
                        fill="#000"
                        fontWeight="bold"
                        fontSize="26" // Increased font size
                        style={{
                          textShadow: '2px 2px 3px rgba(255, 255, 255, 0.8)'
                        }}
                      >
                        {segment.reward}
                      </text>
                    );
                  })}

                  {/* Center circle */}
                  <circle cx="200" cy="200" r="18" fill="#333" stroke="#fff" strokeWidth="3" />
                </g>
              </svg>
            </div>
          </WheelWrapper>

          <SpinButton
            onClick={spinWheel}
            disabled={spinning}
          >
            {spinning ? 'Spinning...' : 'Spin the Wheel'}
          </SpinButton>
        </SpinWheelContainer>
      </MainContent>
    </DashboardContainer>
  );
};

export default SpinWheel;