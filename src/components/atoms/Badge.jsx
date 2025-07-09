import React from 'react';

const badgeColors = {
  new: '#38bdf8', // blue
  featured: '#fbbf24', // yellow
};

const Badge = ({ type, children }) => {
  const color = badgeColors[type] || '#888';
  return (
    <span
      style={{
        display: 'inline-block',
        background: color,
        color: '#fff',
        fontSize: '0.75rem',
        fontWeight: 600,
        borderRadius: '0.75rem',
        padding: '0.18em 0.7em',
        marginRight: 6,
        marginTop: 6,
        boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
        letterSpacing: '0.03em',
        position: 'relative',
        zIndex: 2,
      }}
    >
      {children}
    </span>
  );
};

export default Badge; 