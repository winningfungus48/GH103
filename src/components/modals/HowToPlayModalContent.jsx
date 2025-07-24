import React from "react";
import styles from "./ModalContent.module.css";

const HowToPlayModalContent = ({ instructions }) => {
  return (
    <div className={styles.content}>
      <div className={styles.howToPlay}>
        <div className={styles.icon}>❓</div>
        <h3>How to Play</h3>
        <div className={styles.instructions}>
          {instructions ? (
            <div dangerouslySetInnerHTML={{ __html: instructions }} />
          ) : (
            <p>Instructions for this game are not available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HowToPlayModalContent; 