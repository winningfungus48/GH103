// Word list configuration system
// Allows users to choose between strict (Wordle official) and extended (comprehensive) word lists

const WORD_LIST_CONFIG_KEY = 'wordle-word-list-mode';

export const WORD_LIST_MODES = {
  STRICT: 'strict',      // Only Wordle official words
  EXTENDED: 'extended'   // Comprehensive word list
};

export const DEFAULT_MODE = WORD_LIST_MODES.EXTENDED;

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
    strict: {
      name: 'Wordle Official',
      description: 'Only official Wordle words (2,500+)',
      count: 2500
    },
    extended: {
      name: 'Extended Dictionary',
      description: 'Comprehensive word list (15,000+)',
      count: 15000
    }
  };
  
  return {
    currentMode: mode,
    currentStats: stats[mode],
    allStats: stats
  };
} 