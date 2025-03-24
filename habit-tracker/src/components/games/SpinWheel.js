import React, { useState } from 'react';

const SpinWheel = () => {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [lastReward, setLastReward] = useState(null);

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
      const normalizedRotation = newRotation % 360;
      const winningSegmentIndex = Math.floor(normalizedRotation / segmentAngle) % segments.length;
      const winningSegment = segments[segments.length - 1 - winningSegmentIndex];
      
      setLastReward(winningSegment.reward);
      setSpinning(false);
    }, 3000);
  };

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
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '2rem',
      borderRadius: '15px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ 
        fontSize: '2.5rem', 
        fontWeight: 'bold', 
        marginBottom: '1.5rem', 
        color: '#333',
        textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
      }}>
        Spin the Wheel
      </h1>

      <div style={{ position: 'relative', width: '300px', height: '320px' }}>
        {/* Realistic shadow effect */}
        <div style={{
          position: 'absolute',
          bottom: '-20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '250px',
          height: '20px',
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.2)',
          filter: 'blur(15px)'
        }}></div>

        {/* Arrow indicator with 3D effect */}
        <div style={{
          position: 'absolute',
          top: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '30px',
          height: '40px',
          zIndex: 30,
          filter: 'drop-shadow(0 4px 3px rgba(0,0,0,0.2))'
        }}>
          <svg width="30" height="40" viewBox="0 0 30 40">
            <defs>
              <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor:'#FF7043', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'#FF5722', stopOpacity:1}} />
              </linearGradient>
            </defs>
            <polygon 
              points="0,20 15,0 30,20 15,40" 
              fill="url(#arrowGradient)" 
              stroke="#333" 
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* The wheel with enhanced 3D effect */}
        <div style={{
          position: 'absolute',
          top: '40px',
          left: '25px',
          width: '250px',
          height: '250px',
          filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.2))'
        }}>
          <svg width="250" height="250" viewBox="0 0 250 250">
            {/* Wheel background with gradient */}
            <defs>
              <radialGradient id="wheelBackground" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style={{stopColor:'#ffffff', stopOpacity:0.8}} />
                <stop offset="100%" style={{stopColor:'#e0e0e0', stopOpacity:0.5}} />
              </radialGradient>
              <filter id="wheelShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feOffset result="offOut" in="SourceGraphic" dx="0" dy="5" />
                <feColorMatrix result="matrixOut" in="offOut" type="matrix"
                  values="0.2 0 0 0 0 0 0.2 0 0 0 0 0 0.2 0 0 0 0 0 1 0" />
                <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="5" />
                <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
              </filter>
            </defs>

            {/* Wheel rotation group */}
            <g transform={`rotate(${rotation} 125 125)`} style={{ transition: spinning ? 'transform 3s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none' }}>
              {/* Wheel background */}
              <circle cx="125" cy="125" r="124" fill="url(#wheelBackground)" filter="url(#wheelShadow)" />

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
                const radius = 80;
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

              {/* Center circle with gradient */}
              <defs>
                <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                  <stop offset="0%" style={{stopColor:'#666', stopOpacity:1}} />
                  <stop offset="100%" style={{stopColor:'#333', stopOpacity:1}} />
                </radialGradient>
              </defs>
              <circle cx="125" cy="125" r="10" fill="url(#centerGradient)" stroke="#fff" strokeWidth="2" />
            </g>
          </svg>
        </div>
      </div>

      {/* Spinning and Result Display */}
      <div style={{
        marginTop: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <button
          onClick={spinWheel}
          disabled={spinning}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: spinning ? '#45a049aa' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: spinning ? 'not-allowed' : 'pointer',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            width: '200px',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            boxShadow: spinning ? 'none' : '0 4px 6px rgba(0,0,0,0.1)',
            transform: spinning ? 'scale(0.95)' : 'scale(1)'
          }}
        >
          {spinning ? 'Spinning...' : 'Spin the Wheel'}
        </button>

        {lastReward && !spinning && (
          <div style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#f0f0f0',
            borderRadius: '10px',
            color: '#333',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            You won: {lastReward}!
          </div>
        )}
      </div>
    </div>
  );
};

export default SpinWheel;