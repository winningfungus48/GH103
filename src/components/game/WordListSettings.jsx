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
        Current word list configuration:
      </p>
      
      <div className={styles.options}>
        <div className={styles.option}>
          <input
            type="radio"
            id="comprehensive"
            name="wordListMode"
            value={WORD_LIST_MODES.COMPREHENSIVE}
            checked={wordListInfo.currentMode === WORD_LIST_MODES.COMPREHENSIVE}
            onChange={() => handleModeChange(WORD_LIST_MODES.COMPREHENSIVE)}
          />
          <label htmlFor="comprehensive">
            <div className={styles.optionHeader}>
              <strong>{wordListInfo.allStats.comprehensive.name}</strong>
            </div>
            <div className={styles.optionDescription}>
              {wordListInfo.allStats.comprehensive.description}
            </div>
          </label>
        </div>
      </div>

      <div className={styles.currentMode}>
        <strong>Current Mode:</strong> {wordListInfo.currentStats.name}
      </div>

      <div className={styles.info}>
        <p>
          <strong>Note:</strong> This comprehensive word list includes all legitimate 5-letter English words, 
          carefully filtered to exclude proper nouns, abbreviations, and edge cases.
        </p>
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