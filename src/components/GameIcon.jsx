import React from 'react';
import './GameIcon.css';

const GameIcon = ({ Icon, label, onClick, style, className = '' }) => (
  <button
    className={`game-icon ${className}`}
    style={style}
    onClick={onClick}
    aria-label={label}
    tabIndex={0}
  >
    <span className="game-icon-svg">
      <Icon size={48} />
    </span>
    <span className="game-icon-label">{label}</span>
  </button>
);

export default GameIcon; 