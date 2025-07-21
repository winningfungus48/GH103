import { useState, useEffect, useCallback, useRef } from "react";
import Modal from "../components/ui/Modal";
import styles from "../styles/welcome-modal.module.css";

/**
 * useWelcomeModal - Reusable hook for game welcome modals
 * 
 * @param {string} gameTitle - The title of the game
 * @param {string} instructions - The game instructions
 * @param {boolean} showOnLoad - Whether to show modal immediately on load (default: true)
 * @returns {object} { WelcomeModal, isOpen, closeModal, openModal, gameContainerRef }
 */
export default function useWelcomeModal(gameTitle, instructions, showOnLoad = true) {
  const [isOpen, setIsOpen] = useState(showOnLoad);
  const gameContainerRef = useRef(null);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // Restore focus to game container after modal closes
    setTimeout(() => {
      if (gameContainerRef.current) {
        gameContainerRef.current.focus();
      }
    }, 100); // Small delay to ensure modal is fully closed
  }, []);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  // Handle keyboard events - only when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
      // Note: Enter key handling is done by the button's autoFocus and onClick
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeModal]);

  // WelcomeModal component
  const WelcomeModal = useCallback(() => {
    if (!isOpen) return null;

    return (
      <Modal
        open={isOpen}
        onClose={closeModal}
        title={gameTitle}
        className={styles.welcomeModal}
      >
        <div className={styles.welcomeContent}>
          <p className={styles.welcomeInstructions}>{instructions}</p>
          <div className={styles.welcomeButtons}>
            <button 
              className={styles.welcomePlayButton}
              onClick={closeModal}
              autoFocus
            >
              Play
            </button>
          </div>
        </div>
      </Modal>
    );
  }, [isOpen, gameTitle, instructions, closeModal]);

  return {
    WelcomeModal,
    isOpen,
    closeModal,
    openModal,
    gameContainerRef,
  };
} 