// Usage Example:
// const { showToast } = useToast();
// showToast({ message: 'Game saved!', type: 'success' });

import React, { createContext, useContext, useState, useCallback } from "react";
import Toast from "../components/Toast";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, options = {}) => {
    const {
      duration = 3000,
      position = "top", // "top", "bottom", "top-right", etc.
      type = "info" // "info", "success", "error", "warning"
    } = options;

    const id = Date.now() + Math.random();
    const newToast = { id, message, duration, position, type };

    setToasts(prev => [...prev, newToast]);

    // Auto-remove toast after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const value = {
    showToast,
    removeToast,
    clearToasts,
    toasts
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Render toasts */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
          duration={toast.duration}
          position={toast.position}
          type={toast.type}
        />
      ))}
    </ToastContext.Provider>
  );
};
