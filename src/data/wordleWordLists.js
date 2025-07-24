// Wordle Word Lists Management System
// Uses NYT Wordle lists with lazy loading and localStorage caching

// Answer words (loaded eagerly for daily puzzles)
// Note: In production, this will be loaded from the JSON file
// For now, we'll use a simplified list that matches our generated JSON
const ANSWERS_DATA = [
  "about", "above", "abuse", "actor", "acute", "admit", "adopt", "adult", "after", "again",
  "agent", "agree", "ahead", "alarm", "album", "alert", "alike", "alive", "allow", "alone",
  "along", "alter", "among", "anger", "angle", "angry", "apart", "apple", "apply", "arena",
  "argue", "arise", "array", "aside", "asset", "audio", "audit", "avoid", "award", "aware",
  "awful", "axiom", "azure", "badge", "badly", "baker", "bases", "basic", "beach", "began",
  "begin", "being", "below", "bench", "billy", "birth", "black", "blame", "blank", "blind",
  "block", "blood", "blow", "blue", "board", "boost", "booth", "bound", "brain", "brand",
  "bread", "break", "breed", "brief", "bring", "broad", "broke", "brown", "build", "built",
  "buyer", "cable", "calif", "carry", "catch", "cause", "chain", "chair", "chart", "chase",
  "cheap", "check", "chest", "chief", "child", "china", "chose", "civil", "claim", "class",
  "clean", "clear", "click", "climb", "clock", "close", "coach", "coast", "could", "count",
  "court", "cover", "craft", "crash", "cream", "crime", "cross", "crowd", "crown", "crude",
  "curly", "curry", "curse", "curve", "cycle", "daily", "dance", "dated", "dealt", "death",
  "debut", "delay", "depth", "doing", "doubt", "dozen", "draft", "drama", "drank", "draw",
  "dress", "drill", "drink", "drive", "drop", "drove", "dying", "eager", "early", "earth",
  "eight", "elite", "empty", "enemy", "enjoy", "enter", "entry", "equal", "error", "event",
  "every", "exact", "exist", "extra", "faith", "false", "fault", "fiber", "field", "fifth",
  "fifty", "fight", "final", "first", "fixed", "flash", "fleet", "floor", "fluid", "focus",
  "fold", "food", "foot", "force", "forth", "forty", "forum", "found", "frame", "frank",
  "fraud", "fresh", "front", "fruit", "fully", "funny", "giant", "given", "glass", "globe",
  "going", "grace", "grade", "grand", "grant", "grass", "grave", "great", "green", "gross",
  "group", "grown", "guard", "guess", "guest", "guide", "garden", "grape", "happy", "harry",
  "heart", "heavy", "hence", "henry", "horse", "hotel", "house", "human", "ideal", "image",
  "index", "inner", "input", "issue", "japan", "jimmy", "joint", "jones", "judge", "known",
  "label", "large", "laser", "later", "laugh", "layer", "learn", "lease", "least", "leave",
  "legal", "level", "lewis", "light", "limit", "links", "lives", "local", "loose", "lower",
  "lucky", "lunch", "lying", "magic", "major", "maker", "march", "maria", "match", "maybe",
  "mayor", "meant", "media", "metal", "might", "minor", "minus", "mixed", "model", "money",
  "month", "moral", "motor", "mount", "mouse", "mouth", "moved", "movie", "music", "naked",
  "named", "nasty", "naval", "near", "neat", "neck", "need", "nerve", "never", "newer",
  "newly", "news", "next", "nice", "night", "nine", "ninth", "noble", "noise", "noisy",
  "none", "noon", "nor", "north", "nose", "not", "note", "noted", "notes", "notice", "noun",
  "now", "number", "nurse", "ocean", "offer", "often", "oil", "old", "older", "omit", "once",
  "one", "only", "onto", "open", "opened", "opening", "opens", "operation", "opinion",
  "opportunity", "opposite", "or", "orange", "order", "ordered", "ordinary", "organization",
  "other", "others", "ought", "our", "ours", "ourselves", "out", "outside", "over", "own",
  "page", "paid", "pain", "paint", "pair", "paper", "paragraph", "parent", "part",
  "particular", "party", "pass", "passed", "past", "pay", "peace", "people", "per",
  "percent", "perfect", "perhaps", "period", "person", "personal", "picture", "piece",
  "place", "plan", "plane", "plant", "play", "played", "please", "point", "poor",
  "position", "possible", "power", "practice", "prepare", "present", "president",
  "pretty", "probably", "problem", "provide", "public", "pull", "put", "question", "quick",
  "quickly", "quiet", "quite", "race", "radio", "rain", "raise", "ran", "rather", "reach",
  "read", "ready", "real", "really", "reason", "received", "record", "red", "region",
  "remember", "reported", "research", "result", "return", "right", "river", "road", "rock",
  "room", "rule", "run", "running", "said", "same", "saw", "say", "school", "sea", "second",
  "see", "seem", "seen", "self", "sentence", "set", "several", "shall", "she", "should",
  "show", "shown", "side", "since", "small", "so", "some", "something", "sometimes", "son",
  "soon", "sound", "south", "space", "speak", "special", "stand", "start", "state", "stay",
  "still", "stop", "story", "study", "such", "sure", "system", "table", "take", "taken",
  "talk", "tell", "ten", "than", "that", "the", "their", "them", "then", "there", "these",
  "they", "thing", "think", "this", "those", "though", "thought", "three", "through",
  "time", "to", "today", "together", "told", "too", "took", "toward", "try", "turn", "two",
  "under", "until", "up", "upon", "us", "use", "used", "very", "value", "walk", "want",
  "was", "watch", "water", "way", "we", "well", "went", "were", "what", "when", "where",
  "which", "while", "white", "who", "why", "will", "with", "without", "word", "work",
  "world", "would", "write", "written", "year", "you", "young", "your", "zero", "zone"
];

// Create Set for O(1) lookup performance
const ANSWER_SET = new Set(ANSWERS_DATA);

// State for valid guesses (lazy-loaded)
let validGuessesSet = null;
let isLoadingValidGuesses = false;
let loadPromise = null;

// LocalStorage keys
const VALID_GUESSES_CACHE_KEY = 'wordle_valid_guesses_cache';
const CACHE_TIMESTAMP_KEY = 'wordle_cache_timestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Check if localStorage is available (browser environment)
const isLocalStorageAvailable = typeof window !== 'undefined' && window.localStorage;

// Load valid guesses from localStorage or fetch from server
async function loadValidGuesses() {
  // Check if already loaded
  if (validGuessesSet) {
    return validGuessesSet;
  }

  // Check if already loading
  if (loadPromise) {
    return loadPromise;
  }

  // Check localStorage first
  const cached = isLocalStorageAvailable ? localStorage.getItem(VALID_GUESSES_CACHE_KEY) : null;
  const timestamp = isLocalStorageAvailable ? localStorage.getItem(CACHE_TIMESTAMP_KEY) : null;
  
  if (cached && timestamp) {
    const age = Date.now() - parseInt(timestamp);
    if (age < CACHE_DURATION) {
      try {
        const cachedData = JSON.parse(cached);
        validGuessesSet = new Set(cachedData);
        console.log('📦 Loaded valid guesses from cache');
        return validGuessesSet;
      } catch (error) {
        console.warn('Failed to parse cached valid guesses:', error);
      }
    }
  }

  // Fetch from server
  isLoadingValidGuesses = true;
  loadPromise = fetch('/wordle/validGuesses.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load valid guesses: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      validGuessesSet = new Set(data);
      
      // Cache in localStorage
      if (isLocalStorageAvailable) {
        try {
          localStorage.setItem(VALID_GUESSES_CACHE_KEY, JSON.stringify(data));
          localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
          console.log('💾 Cached valid guesses in localStorage');
        } catch (error) {
          console.warn('Failed to cache valid guesses:', error);
        }
      }
      
      isLoadingValidGuesses = false;
      loadPromise = null;
      return validGuessesSet;
    })
    .catch(error => {
      console.error('Failed to load valid guesses:', error);
      isLoadingValidGuesses = false;
      loadPromise = null;
      // Fallback to answer set only
      validGuessesSet = ANSWER_SET;
      return validGuessesSet;
    });

  return loadPromise;
}

// Check if a word is a valid answer
export function isValidAnswer(word) {
  return ANSWER_SET.has(word.toLowerCase());
}

// Check if a word is a valid guess (async)
export async function isValidGuess(word) {
  const normalizedWord = word.toLowerCase();
  
  // Always check answer set first (synchronous)
  if (ANSWER_SET.has(normalizedWord)) {
    return true;
  }
  
  // Load valid guesses if not already loaded
  const validGuesses = await loadValidGuesses();
  return validGuesses.has(normalizedWord);
}

// Get daily word from answer list
export function getDailyWord(seed) {
  const index = seed % ANSWERS_DATA.length;
  return ANSWERS_DATA[index];
}

// Get word list statistics
export function getWordListStats() {
  return {
    answerWords: ANSWERS_DATA.length,
    validGuessesLoaded: validGuessesSet !== null,
    isLoadingValidGuesses,
    cacheAvailable: isLocalStorageAvailable ? localStorage.getItem(VALID_GUESSES_CACHE_KEY) !== null : false
  };
}

// Preload valid guesses (call this early in the app lifecycle)
export async function preloadValidGuesses() {
  if (!validGuessesSet && !isLoadingValidGuesses) {
    console.log('🚀 Preloading valid guesses...');
    await loadValidGuesses();
    console.log('✅ Valid guesses preloaded');
  }
}

// Clear cache (useful for testing or updates)
export function clearCache() {
  if (isLocalStorageAvailable) {
    localStorage.removeItem(VALID_GUESSES_CACHE_KEY);
    localStorage.removeItem(CACHE_TIMESTAMP_KEY);
  }
  validGuessesSet = null;
  loadPromise = null;
  console.log('🗑️ Word list cache cleared');
}

// Export answer list for compatibility
export const ANSWERS = ANSWERS_DATA; 