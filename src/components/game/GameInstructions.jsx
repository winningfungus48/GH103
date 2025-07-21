import React from "react";
import styles from "./GameInstructions.module.css";

const GameInstructions = ({ description, mode, customInstructions }) => {
  // Use custom instructions if provided, otherwise use description from game data
  const instructionText = customInstructions || description;
  
  return (
    <div className={styles.gameInstructions}>
      <p className={styles.instructionText}>{instructionText}</p>
      {mode === "daily" && (
        <p className={styles.dailyMode}>Daily Challenge Mode</p>
      )}
    </div>
  );
};

export default GameInstructions; 