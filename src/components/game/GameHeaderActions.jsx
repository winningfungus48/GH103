import React, { useState } from "react";
import { FiBarChart, FiSettings, FiHelpCircle } from "react-icons/fi";
import { Modal } from "../modals";
import StatsModalContent from "../modals/StatsModalContent";
import SettingsModalContent from "../modals/SettingsModalContent";
import HowToPlayModalContent from "../modals/HowToPlayModalContent";
import styles from "./GameHeaderActions.module.css";

const GameHeaderActions = ({ instructions }) => {
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);

  const handleStatsClick = () => {
    setIsStatsOpen(true);
  };

  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
  };

  const handleHowToPlayClick = () => {
    setIsHowToPlayOpen(true);
  };

  return (
    <>
      <div className={styles.actions}>
        <button
          onClick={handleStatsClick}
          className={styles.actionButton}
          aria-label="View statistics"
          title="Statistics"
        >
          <FiBarChart />
        </button>
        
        <button
          onClick={handleSettingsClick}
          className={styles.actionButton}
          aria-label="Open settings"
          title="Settings"
        >
          <FiSettings />
        </button>
        
        <button
          onClick={handleHowToPlayClick}
          className={styles.actionButton}
          aria-label="How to play"
          title="How to Play"
        >
          <FiHelpCircle />
        </button>
      </div>

      {/* Statistics Modal */}
      <Modal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        title="Statistics"
        size="medium"
      >
        <StatsModalContent />
      </Modal>

      {/* Settings Modal */}
      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="Settings"
        size="medium"
      >
        <SettingsModalContent />
      </Modal>

      {/* How to Play Modal */}
      <Modal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
        title="How to Play"
        size="large"
      >
        <HowToPlayModalContent instructions={instructions} />
      </Modal>
    </>
  );
};

export default GameHeaderActions; 