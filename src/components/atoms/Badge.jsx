import React from 'react';
import Tooltip from './Tooltip';
import styles from './Badge.module.css';

const Badge = ({ type, children }) => {
  const color = badgeColors[type] || '#888';
  
  // Tooltip content based on badge type
  const getTooltipContent = () => {
    switch (type) {
      case 'new':
        return 'New!';
      case 'featured':
        return 'Featured';
      default:
        return children;
    }
  };

  return (
    <Tooltip content={getTooltipContent()} position="top">
      <span
        className={styles.badge}
        style={{
          background: color,
          color: '#fff',
        }}
        tabIndex={0}
      >
        {children}
      </span>
    </Tooltip>
  );
};

const badgeColors = {
  new: '#38bdf8', // blue
  featured: '#fbbf24', // yellow
};

export default Badge; 