import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styles from "./Modal.module.css";

/**
 * Modal - Enhanced, accessible, reusable modal dialog component.
 *
 * Props:
 *   isOpen: boolean - Whether the modal is open
 *   onClose: function - Called when modal requests to close
 *   title: string|ReactNode - Modal title (optional)
 *   children: ReactNode - Modal content
 *   size: string - Modal size: "small", "medium", "large" (default: "medium")
 *   showCloseButton: boolean - Whether to show the close button (default: true)
 *   closeOnOverlayClick: boolean - Whether to close on backdrop click (default: true)
 *   closeOnEscape: boolean - Whether to close on Escape key (default: true)
 *   className: string - Custom class for modal content
 *   overlayClassName: string - Custom class for modal overlay
 *
 * Usage Example:
 *   <Modal isOpen={isOpen} onClose={handleClose} title="Statistics" size="large">
 *     <div>Modal content here</div>
 *   </Modal>
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "medium",
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = "",
  overlayClassName = "",
}) {
  const modalRef = useRef(null);
  const previouslyFocused = useRef(null);

  // Handle body scroll lock when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Focus management and keyboard handling
  useEffect(() => {
    if (isOpen) {
      // Store previously focused element
      previouslyFocused.current = document.activeElement;

      // Focus modal content
      setTimeout(() => {
        if (modalRef.current) {
          const focusable = modalRef.current.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          );
          if (focusable) focusable.focus();
          else modalRef.current.focus();
        }
      }, 0);

      // Keyboard event handler
      const handleKeyDown = (e) => {
        if (closeOnEscape && e.key === "Escape") {
          onClose();
          return;
        }

        // Focus trap
        if (e.key === "Tab" && modalRef.current) {
          const focusableEls = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          );
          const first = focusableEls[0];
          const last = focusableEls[focusableEls.length - 1];

          if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          } else if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        // Restore focus to previously focused element
        if (previouslyFocused.current) {
          previouslyFocused.current.focus();
        }
      };
    }
  }, [isOpen, onClose, closeOnEscape]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCloseButtonClick = () => {
    onClose();
  };

  return (
    <div
      className={`${styles.overlay} ${overlayClassName}`}
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? "modal-title" : undefined}
      tabIndex={-1}
    >
      <div
        ref={modalRef}
        className={`${styles.modal} ${styles[size]} ${className}`}
        tabIndex={0}
      >
        {title && (
          <div className={styles.header}>
            <h2 id="modal-title" className={styles.title}>
              {title}
            </h2>
            {showCloseButton && (
              <button
                onClick={handleCloseButtonClick}
                className={styles.closeButton}
                aria-label="Close modal"
                type="button"
              >
                <span aria-hidden="true">×</span>
              </button>
            )}
          </div>
        )}
        
        {!title && showCloseButton && (
          <button
            onClick={handleCloseButtonClick}
            className={styles.closeButtonNoTitle}
            aria-label="Close modal"
            type="button"
          >
            <span aria-hidden="true">×</span>
          </button>
        )}

        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  showCloseButton: PropTypes.bool,
  closeOnOverlayClick: PropTypes.bool,
  closeOnEscape: PropTypes.bool,
  className: PropTypes.string,
  overlayClassName: PropTypes.string,
}; 