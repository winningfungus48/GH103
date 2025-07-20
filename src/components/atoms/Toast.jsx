// Usage Example:
// <Toast message="Saved!" type="success" onClose={...} />

import React, { useEffect, useState } from "react";

const typeStyles = {
  info: {
    background: "#222",
    color: "#fff",
    icon: "ℹ️",
  },
  success: {
    background: "#10b981",
    color: "#fff",
    icon: "✔️",
  },
  error: {
    background: "#ef4444",
    color: "#fff",
    icon: "❌",
  },
};

/**
 * Toast - Displays a single toast message with type, ARIA, and animation.
 * Props:
 *   message: string
 *   type: 'info' | 'success' | 'error'
 *   onClose: function
 *   duration: number (ms)
 *
 * Usage:
 *   <Toast message="Saved!" type="success" onClose={...} />
 */
const Toast = ({ message, type = "info", onClose, duration = 2500 }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), duration);
    const closeTimer = setTimeout(onClose, duration + 300);
    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }, [message, duration, onClose]);

  if (!message) return null;
  const style = {
    position: "fixed",
    bottom: "2rem",
    left: "50%",
    transform: "translateX(-50%)",
    background: typeStyles[type].background,
    color: typeStyles[type].color,
    padding: "1rem 2rem",
    borderRadius: "8px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
    zIndex: 9999,
    fontSize: "1rem",
    opacity: visible ? 0.95 : 0,
    transition: "opacity 0.3s",
    display: "flex",
    alignItems: "center",
    gap: "0.7em",
  };
  return (
    <div style={style} role="status" aria-live="polite" tabIndex={0}>
      <span aria-hidden="true">{typeStyles[type].icon}</span>
      <span>{message}</span>
    </div>
  );
};

export default Toast;
