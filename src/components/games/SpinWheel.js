import React, { useState } from 'react';

const SpinWheel = () => {
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

  // Calculate the SVG path for each segment
  const createSegmentPath = (index, total) => {
    const angle = 360 / total;
    const startAngle = index * angle;
    const endAngle = (index + 1) * angle;

    const startRadians = (startAngle - 90) * Math.PI / 180;
    const endRadians = (endAngle - 90) * Math.PI / 180;

    const radius = 125;
    const centerX = 125;
    const centerY = 125;

    const x1 = centerX + radius * Math.cos(startRadians);
    const y1 = centerY + radius * Math.sin(startRadians);
    const x2 = centerX + radius * Math.cos(endRadians);
    const y2 = centerY + radius * Math.sin(endRadians);

    const largeArcFlag = angle > 180 ? 1 : 0;

    return `M${centerX},${centerY} L${x1},${y1} A${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2} Z`;
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '2rem',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Spin the Wheel</h1>

      <div style={{ position: 'relative', width: '250px', height: '280px' }}>
        {/* Arrow indicator */}
        <div style={{
          position: 'absolute',
          top: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '20px',
          height: '30px',
          zIndex: 30
        }}>
          <svg width="20" height="30" viewBox="0 0 20 30">
            <polygon points="0,15 10,0 20,15 10,30" fill="#FF5722" stroke="#333" strokeWidth="2"/>
          </svg>
        </div>

        {/* The wheel */}
        <div style={{
          position: 'absolute',
          top: '30px',
          left: '0',
          width: '250px',
          height: '250px'
        }}>
          <svg width="250" height="250" viewBox="0 0 250 250">
            <g transform={`rotate(${rotation} 125 125)`} style={{ transition: spinning ? 'transform 3s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none' }}>
              {segments.map((segment, index) => (
                <path
                  key={index}
                  d={createSegmentPath(index, segments.length)}
                  fill={segment.color}
                  stroke="#333"
                  strokeWidth="1"
                />
              ))}

              {/* Text labels for each segment */}
              {segments.map((segment, index) => {
                const angle = 360 / segments.length;
                const midAngle = (index * angle + angle / 2 - 90) * Math.PI / 180;
                const radius = 80; // Distance from center for text
                const x = 125 + radius * Math.cos(midAngle);
                const y = 125 + radius * Math.sin(midAngle);

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
                    fontSize="16"
                    style={{
                      textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)'
                    }}
                  >
                    {segment.reward}
                  </text>
                );
              })}

              {/* Center circle */}
              <circle cx="125" cy="125" r="10" fill="#333" stroke="#fff" strokeWidth="2" />
            </g>
          </svg>
        </div>
      </div>

      <button
        onClick={spinWheel}
        disabled={spinning}
        style={{
          marginTop: '2rem',
          padding: '0.5rem 1rem',
          backgroundColor: spinning ? '#45a049aa' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: spinning ? 'not-allowed' : 'pointer',
          fontSize: '1rem',
          fontWeight: 'bold',
          width: '150px',
          textAlign: 'center'
        }}
      >
        {spinning ? 'Spinning...' : 'Spin the Wheel'}
      </button>
    </div>
  );
};

export default SpinWheel;
