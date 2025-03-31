/**
 * SpinWheelPopup Component
 *
 * This file implements a modal-style spinning reward wheel component.
 * It allows users to spin once per day to earn XP rewards randomly.
 *
 * Key Features:
 * - Interactive SVG-based wheel with animated spin.
 * - 6 colorful segments offering different XP values.
 * - Spin can be triggered once daily and is stored via localStorage.
 * - Visual pointer to indicate the winning segment.
 * - Callback props: `onClose()` to close the popup, and `onXPReward(value)` to update earned XP.
 *
 * The wheel leverages CSS transitions for spin animation and calculates reward based on rotation.
 * Styled-components are used for modular and themeable UI styling.
 *
 * Props:
 * - onClose: Function to close the modal.
 * - roundNumber: Number indicating the quiz/game round.
 * - onXPReward: Function to pass back the rewarded XP.
 */

import React, { useState } from 'react';
import styled from 'styled-components';

// Styled container for the full spin wheel layout
const SpinWheelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: black;
  font-family: 'Arial, sans-serif';
`;

// Header at the top of the popup
const WheelHeader = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #333;
`;

// Wrapper to hold the SVG wheel and pointer
const WheelWrapper = styled.div`
  position: relative;
  width: 400px;
  height: 430px;
`;

// Button to trigger the spin animation
const SpinButton = styled.button`
  margin-top: 1.5rem;
  padding: 1rem 2rem;
  background-color: ${props => props.disabled ? '#45a049aa' : '#4CAF50'};
  color: white;
  border: none;
  border-radius: 10px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 1.2rem;
  font-weight: bold;
  width: 200px;
  text-align: center;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

// Button to close the popup
const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

// Main SpinWheel component
const SpinWheel = ({ onClose, roundNumber, onXPReward }) => {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);

// Define reward segments with color and XP
  const segments = [
    { color: '#FFDDC1', reward: 'XP 10' },
    { color: '#C1FFD7', reward: 'XP 20' },
    { color: '#C1E1FF', reward: 'XP 30' },
    { color: '#FFC1E1', reward: 'XP 40' },
    { color: '#FFC1C1', reward: 'XP 50' },
    { color: '#E1C1FF', reward: 'XP 60' }
  ];

// Daily spin check using localStorage
  const today = new Date().toISOString().split('T')[0];
  const lastSpinDate = localStorage.getItem('quizSpinDate');
  const alreadySpunToday = lastSpinDate === today;

// Function to trigger the wheel spin
  const spinWheel = () => {
    if (spinning || alreadySpunToday) return;
    setSpinning(true);
    const randomRotation = Math.floor(Math.random() * 360) + 360 * 5; // Spin at least 5 full rotations
    const newRotation = rotation + randomRotation;
    setRotation(newRotation);

    setTimeout(() => {
      const segmentAngle = 360 / segments.length;
      const normalizedRotation = newRotation % 360;
      const winningSegmentIndex = Math.floor(normalizedRotation / segmentAngle) % segments.length;
      const winningSegment = segments[segments.length - 1 - winningSegmentIndex];

      const rewardValue = parseInt(winningSegment.reward.replace('XP ', ''));
      alert(`You won: ${winningSegment.reward}!`);

      if (typeof onXPReward === 'function') {
        onXPReward(rewardValue);
      }

      localStorage.setItem('quizSpinDate', today);
      setSpinning(false);
      if (onClose) onClose();
    }, 3000);
  };

// Create SVG path for each wheel segment
  const createSegmentPath = (index, total) => {
    const angle = 360 / total;
    const startAngle = index * angle;
    const endAngle = (index + 1) * angle;

    const startRadians = (startAngle - 90) * Math.PI / 180;
    const endRadians = (endAngle - 90) * Math.PI / 180;

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
    <SpinWheelContainer>
      {onClose && <CloseButton onClick={onClose}>×</CloseButton>}
      <WheelHeader>Round {roundNumber} Spin Wheel</WheelHeader>

      <WheelWrapper>
        <div style={{
          position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)',
          width: '40px', height: '50px', zIndex: 30
        }}>
          <svg width="40" height="50" viewBox="0 0 40 50">
            <polygon points="0,25 20,0 40,25 20,50" fill="#FF5722" stroke="#333" strokeWidth="3"/>
          </svg>
        </div>

        <div style={{ position: 'absolute', top: '50px', left: '0', width: '400px', height: '400px' }}>
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

              {segments.map((segment, index) => {
                const angle = 360 / segments.length;
                const midAngle = (index * angle + angle / 2 - 90) * Math.PI / 180;
                const radius = 130;
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
                    fontSize="26"
                    style={{ textShadow: '2px 2px 3px rgba(255, 255, 255, 0.8)' }}
                  >
                    {segment.reward}
                  </text>
                );
              })}

              <circle cx="200" cy="200" r="18" fill="#333" stroke="#fff" strokeWidth="3" />
            </g>
          </svg>
        </div>
      </WheelWrapper>

      <SpinButton onClick={spinWheel} disabled={spinning || alreadySpunToday}>
        {alreadySpunToday ? 'Already Spun Today' : spinning ? 'Spinning...' : 'Spin the Wheel'}
      </SpinButton>
    </SpinWheelContainer>
  );
};

export default SpinWheel;
