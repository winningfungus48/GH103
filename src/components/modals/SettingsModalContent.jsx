import React from "react";
import styles from "./ModalContent.module.css";

const SettingsModalContent = () => {
  return (
    <div className={styles.content}>
      <div className={styles.placeholder}>
        <div className={styles.icon}>⚙️</div>
        <h3>Settings Coming Soon</h3>
        <p>
          Game settings and customization options will be available in a future update.
        </p>
        <p>
          You'll be able to customize:
        </p>
        <ul>
          <li>Sound effects and music</li>
          <li>Visual themes and colors</li>
          <li>Difficulty levels</li>
          <li>Accessibility options</li>
          <li>Game preferences</li>
        </ul>
      </div>
    </div>
  );
};

export default SettingsModalContent; 