// Usage Example:
// const { showToast } = useToast();
// showToast({ message: 'Game saved!', type: 'success' });

import React, { createContext, useContext, useState, useCallback } from "react";
import Toast from "../components/atoms/Toast";

const ToastContext = createContext();

/**
 * ToastProvider - Provides a queue-based toast system with basic types.
 * Usage: useToast().showToast({ message, type })
 */
export const ToastProvider = ({ children }) => {
  const [queue, setQueue] = useState([]); // [{ message, type, key }]
  const [current, setCurrent] = useState(null);

  // Show a new toast (adds to queue)
  const showToast = useCallback(({ message, type = "info" }) => {
    setQueue((q) => [...q, { message, type, key: Date.now() + Math.random() }]);
  }, []);

  // When current toast closes, show next in queue
  const handleClose = useCallback(() => {
    setCurrent(null);
    setTimeout(() => {
      setQueue((q) => q.slice(1));
    }, 200); // allow fade-out
  }, []);

  // When queue changes and no current toast, show next
  React.useEffect(() => {
    if (!current && queue.length > 0) {
      setCurrent(queue[0]);
    }
  }, [queue, current]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {current && (
        <Toast
          key={current.key}
          message={current.message}
          type={current.type}
          onClose={handleClose}
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
