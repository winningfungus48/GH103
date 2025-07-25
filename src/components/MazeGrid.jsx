import React from 'react';
import './MazeGrid.css';

const MazeGrid = ({ children }) => {
  return (
    <div className="maze-grid">
      {/* Main vertical corridor (center) - avatar moves here */}
      <div className="main-corridor"></div>
      
      {/* Horizontal corridors to games */}
      {/* Left corridors */}
      <div className="corridor-left-1"></div>
      <div className="corridor-left-2"></div>
      <div className="corridor-left-3"></div>
      <div className="corridor-left-4"></div>
      <div className="corridor-left-5"></div>
      <div className="corridor-left-6"></div>
      
      {/* Right corridors */}
      <div className="corridor-right-1"></div>
      <div className="corridor-right-2"></div>
      <div className="corridor-right-3"></div>
      <div className="corridor-right-4"></div>
      <div className="corridor-right-5"></div>
      <div className="corridor-right-6"></div>
      
      {/* Wall pieces to define corridor boundaries */}
      {/* Main corridor walls */}
      <div className="maze-wall" style={{ gridRow: '1 / 16', gridColumn: 8 }}></div>
      <div className="maze-wall" style={{ gridRow: '1 / 16', gridColumn: 12 }}></div>
      
      {/* Horizontal corridor walls */}
      <div className="wall-horizontal" style={{ gridRow: 2, gridColumn: '1 / 9' }}></div>
      <div className="wall-horizontal" style={{ gridRow: 4, gridColumn: '1 / 9' }}></div>
      <div className="wall-horizontal" style={{ gridRow: 6, gridColumn: '1 / 9' }}></div>
      <div className="wall-horizontal" style={{ gridRow: 8, gridColumn: '1 / 9' }}></div>
      <div className="wall-horizontal" style={{ gridRow: 10, gridColumn: '1 / 9' }}></div>
      <div className="wall-horizontal" style={{ gridRow: 12, gridColumn: '1 / 9' }}></div>
      
      <div className="wall-horizontal" style={{ gridRow: 2, gridColumn: '12 / 20' }}></div>
      <div className="wall-horizontal" style={{ gridRow: 4, gridColumn: '12 / 20' }}></div>
      <div className="wall-horizontal" style={{ gridRow: 6, gridColumn: '12 / 20' }}></div>
      <div className="wall-horizontal" style={{ gridRow: 8, gridColumn: '12 / 20' }}></div>
      <div className="wall-horizontal" style={{ gridRow: 10, gridColumn: '12 / 20' }}></div>
      <div className="wall-horizontal" style={{ gridRow: 12, gridColumn: '12 / 20' }}></div>
      
      {/* Game icons and avatar */}
      {children}
    </div>
  );
};

export default MazeGrid; 