import React from 'react';
import './PlayerAvatar.css';

const PlayerAvatar = ({ x, y, gridWidth, gridHeight }) => {
  // Calculate pixel position from grid coordinates for smooth sliding
  const cellWidth = gridWidth / 20; // 20 columns
  const cellHeight = gridHeight / 15; // 15 rows
  
  const pixelX = x * cellWidth;
  const pixelY = y * cellHeight;

  return (
    <div
      className="player-avatar"
      style={{ 
        left: `${pixelX}px`, 
        top: `${pixelY}px`
      }}
    >
      <div className="player-avatar-circle" />
    </div>
  );
};

export default PlayerAvatar; 