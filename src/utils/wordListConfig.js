// Word list configuration system
// Single comprehensive mode with all legitimate 5-letter English words

const WORD_LIST_CONFIG_KEY = 'wordle-word-list-mode';

export const WORD_LIST_MODES = {
  COMPREHENSIVE: 'comprehensive'   // All legitimate 5-letter English words
};

export const DEFAULT_MODE = WORD_LIST_MODES.COMPREHENSIVE;

// Get current word list mode from localStorage
export function getWordListMode() {
  try {
    const saved = localStorage.getItem(WORD_LIST_CONFIG_KEY);
    return saved && Object.values(WORD_LIST_MODES).includes(saved) 
      ? saved 
      : DEFAULT_MODE;
  } catch (error) {
    console.warn('Could not read word list mode from localStorage:', error);
    return DEFAULT_MODE;
  }
}

// Set word list mode in localStorage
export function setWordListMode(mode) {
  try {
    if (Object.values(WORD_LIST_MODES).includes(mode)) {
      localStorage.setItem(WORD_LIST_CONFIG_KEY, mode);
      return true;
    }
    return false;
  } catch (error) {
    console.warn('Could not save word list mode to localStorage:', error);
    return false;
  }
}

// Get word list statistics for display
export function getWordListInfo() {
  const mode = getWordListMode();
  
  const stats = {
    comprehensive: {
      name: 'Comprehensive Dictionary',
      description: 'All legitimate 5-letter English words (~12,000 words)',
      count: 12000
    }
  };
  
  return {
    currentMode: mode,
    currentStats: stats[mode],
    allStats: stats
  };
} 