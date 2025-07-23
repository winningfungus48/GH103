import React, { useEffect, useRef } from "react";
import styles from "./SlidingPanel.module.css";

const SlidingPanel = ({ 
  isOpen, 
  onClose, 
  children, 
  width = "70%",
  title,
  className = ""
}) => {
  const panelRef = useRef(null);
  const backdropRef = useRef(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when panel is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (isOpen && panelRef.current) {
      const focusableElements = panelRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  // Handle panel click (prevent closing when clicking inside panel)
  const handlePanelClick = (e) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <div 
      className={styles.backdrop} 
      ref={backdropRef}
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={panelRef}
        className={`${styles.panel} ${className}`}
        style={{ width }}
        onClick={handlePanelClick}
        role="navigation"
        aria-modal="true"
        aria-labelledby={title ? "sliding-panel-title" : undefined}
      >
        <div className={styles.panelHeader}>
          {title && (
            <h2 id="sliding-panel-title" className={styles.panelTitle}>
              {title}
            </h2>
          )}
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close panel"
            type="button"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className={styles.panelContent}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default SlidingPanel; 