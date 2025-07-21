import React, { useEffect } from "react";

const getToastStyle = (position = "top", type = "info") => {
  const baseStyle = {
    position: "fixed",
    padding: "1rem 2rem",
    borderRadius: "8px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
    zIndex: 9999,
    fontSize: "1rem",
    opacity: 0.95,
    transition: "opacity 0.3s, transform 0.3s",
    maxWidth: "400px",
    wordWrap: "break-word",
  };

  // Position styles
  const positionStyles = {
    top: {
      top: "2rem",
      left: "50%",
      transform: "translateX(-50%)",
    },
    bottom: {
      bottom: "2rem",
      left: "50%",
      transform: "translateX(-50%)",
    },
    "top-right": {
      top: "2rem",
      right: "2rem",
    },
    "top-left": {
      top: "2rem",
      left: "2rem",
    },
  };

  // Type styles
  const typeStyles = {
    info: {
      background: "#222",
      color: "#fff",
    },
    success: {
      background: "#10b981",
      color: "#fff",
    },
    error: {
      background: "#ef4444",
      color: "#fff",
    },
    warning: {
      background: "#f59e0b",
      color: "#fff",
    },
  };

  return {
    ...baseStyle,
    ...positionStyles[position] || positionStyles.top,
    ...typeStyles[type] || typeStyles.info,
  };
};

const Toast = ({ message, onClose, duration = 3000, position = "top", type = "info" }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  if (!message) return null;

  return <div style={getToastStyle(position, type)}>{message}</div>;
};

export default Toast;
