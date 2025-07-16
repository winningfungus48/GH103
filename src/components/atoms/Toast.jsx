import React, { useEffect } from 'react';

const toastStyle = {
  position: 'fixed',
  bottom: '2rem',
  left: '50%',
  transform: 'translateX(-50%)',
  background: '#222',
  color: '#fff',
  padding: '1rem 2rem',
  borderRadius: '8px',
  boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
  zIndex: 9999,
  fontSize: '1rem',
  opacity: 0.95,
  transition: 'opacity 0.3s',
};

const Toast = ({ message, onClose, duration = 2500 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  if (!message) return null;

  return <div style={toastStyle}>{message}</div>;
};

export default Toast; 