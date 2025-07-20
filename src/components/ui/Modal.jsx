import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

/**
 * Modal - Generic, accessible, controlled-only modal dialog.
 *
 * Props:
 *   open: boolean - Whether the modal is open
 *   onClose: function - Called when modal requests to close (esc, backdrop)
 *   title: string|ReactNode - Modal title (optional)
 *   children: ReactNode - Modal content
 *   buttons: ReactNode - Footer buttons (optional)
 *   className: string - Custom class for modal container
 *   style: object - Custom style for modal container
 *
 * Usage Example:
 *   <Modal open={isOpen} onClose={handleClose} title="Info">
 *     <p>Modal content here</p>
 *     <div slot="buttons">
 *       <button onClick={handleClose}>Close</button>
 *     </div>
 *   </Modal>
 */
export default function Modal({
  open,
  onClose,
  title,
  children,
  buttons,
  className = "",
  style = {},
}) {
  const modalRef = useRef(null);
  const previouslyFocused = useRef(null);

  // Focus trap: focus modal on open, restore on close
  useEffect(() => {
    if (open) {
      previouslyFocused.current = document.activeElement;
      setTimeout(() => {
        if (modalRef.current) {
          const focusable = modalRef.current.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          );
          if (focusable) focusable.focus();
          else modalRef.current.focus();
        }
      }, 0);
      const handleKeyDown = (e) => {
        if (e.key === "Escape") onClose();
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
        if (previouslyFocused.current) previouslyFocused.current.focus();
      };
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={`modal-backdrop ${open ? "show" : ""}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`modal-content ${className}`}
        ref={modalRef}
        style={{
          background: "#fff",
          borderRadius: 12,
          minWidth: 320,
          maxWidth: 420,
          width: "90vw",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          outline: "none",
          ...style,
        }}
        tabIndex={0}
      >
        {title && (
          <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.5rem" }}>{title}</h2>
        )}
        <div>{children}</div>
        {buttons && <div style={{ marginTop: 24 }}>{buttons}</div>}
      </div>
    </div>
  );
}

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.node,
  buttons: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};
