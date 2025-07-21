import React from "react";
import { getWordListInfo, setWordListMode, WORD_LIST_MODES } from "../../utils/wordListConfig";
import styles from "./WordListSettings.module.css";

const WordListSettings = ({ onClose }) => {
  const wordListInfo = getWordListInfo();

  const handleModeChange = (mode) => {
    if (setWordListMode(mode)) {
      // Show success message
      if (onClose) onClose();
    }
  };

  return (
    <div className={styles.settingsContainer}>
      <h3>Word List Settings</h3>
      <p className={styles.description}>
        Choose which words are accepted in the game:
      </p>
      
      <div className={styles.options}>
        <div className={styles.option}>
          <input
            type="radio"
            id="strict"
            name="wordListMode"
            value={WORD_LIST_MODES.STRICT}
            checked={wordListInfo.currentMode === WORD_LIST_MODES.STRICT}
            onChange={() => handleModeChange(WORD_LIST_MODES.STRICT)}
          />
          <label htmlFor="strict">
            <div className={styles.optionHeader}>
              <strong>{wordListInfo.allStats.strict.name}</strong>
            </div>
            <div className={styles.optionDescription}>
              {wordListInfo.allStats.strict.description}
            </div>
          </label>
        </div>

        <div className={styles.option}>
          <input
            type="radio"
            id="extended"
            name="wordListMode"
            value={WORD_LIST_MODES.EXTENDED}
            checked={wordListInfo.currentMode === WORD_LIST_MODES.EXTENDED}
            onChange={() => handleModeChange(WORD_LIST_MODES.EXTENDED)}
          />
          <label htmlFor="extended">
            <div className={styles.optionHeader}>
              <strong>{wordListInfo.allStats.extended.name}</strong>
            </div>
            <div className={styles.optionDescription}>
              {wordListInfo.allStats.extended.description}
            </div>
          </label>
        </div>
      </div>

      <div className={styles.currentMode}>
        <strong>Current Mode:</strong> {wordListInfo.currentStats.name}
      </div>

      {onClose && (
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      )}
    </div>
  );
};

export default WordListSettings; 