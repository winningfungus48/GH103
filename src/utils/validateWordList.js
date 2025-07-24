// Word List Validation Utility
// Compares current Wordle word list against authoritative reference lists

import { COMPREHENSIVE_WORDS } from '../data/optimizedWordleWords.js';

// Reference word list (embedded for reliability)
const REFERENCE_WORDS = [
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

// Normalize word list: lowercase, trim, filter 5-letter alphabetic words
function normalizeWordList(words) {
  return words
    .map(word => word.toString().toLowerCase().trim())
    .filter(word => /^[a-z]{5}$/.test(word))
    .filter((word, index, arr) => arr.indexOf(word) === index); // Remove duplicates
}

// Compare two word lists and return analysis
function compareWordLists(currentWords, referenceWords) {
  const currentSet = new Set(currentWords);
  const referenceSet = new Set(referenceWords);
  
  const missing = referenceWords.filter(word => !currentSet.has(word));
  const extra = currentWords.filter(word => !referenceSet.has(word));
  const common = currentWords.filter(word => referenceSet.has(word));
  
  return {
    current: currentWords.length,
    reference: referenceWords.length,
    missing: missing.length,
    extra: extra.length,
    common: common.length,
    missingWords: missing,
    extraWords: extra,
    commonWords: common
  };
}

// Main validation function
export function validateWordList() {
  console.log('🔍 Starting Word List Validation...\n');
  
  // Normalize both lists
  console.log('🔄 Normalizing word lists...');
  const normalizedCurrent = normalizeWordList(COMPREHENSIVE_WORDS);
  const normalizedReference = normalizeWordList(REFERENCE_WORDS);
  
  // Compare lists
  console.log('⚖️ Comparing word lists...');
  const analysis = compareWordLists(normalizedCurrent, normalizedReference);
  
  // Generate report
  console.log('\n📊 WORD LIST VALIDATION REPORT');
  console.log('================================');
  console.log(`Current List: ${analysis.current} words`);
  console.log(`Reference List: ${analysis.reference} words`);
  console.log(`Common Words: ${analysis.common} words`);
  console.log(`Missing Words: ${analysis.missing} words`);
  console.log(`Extra Words: ${analysis.extra} words`);
  
  // Coverage analysis
  const coverage = ((analysis.common / analysis.reference) * 100).toFixed(1);
  console.log(`Coverage: ${coverage}% of reference list`);
  
  // Sample missing words
  if (analysis.missingWords.length > 0) {
    console.log('\n❌ SAMPLE MISSING WORDS (first 20):');
    console.log(analysis.missingWords.slice(0, 20).join(', '));
    if (analysis.missingWords.length > 20) {
      console.log(`... and ${analysis.missingWords.length - 20} more`);
    }
  }
  
  // Sample extra words
  if (analysis.extraWords.length > 0) {
    console.log('\n➕ SAMPLE EXTRA WORDS (first 20):');
    console.log(analysis.extraWords.slice(0, 20).join(', '));
    if (analysis.extraWords.length > 20) {
      console.log(`... and ${analysis.extraWords.length - 20} more`);
    }
  }
  
  // Recommendations
  console.log('\n💡 RECOMMENDATIONS:');
  if (analysis.missing > 0) {
    console.log(`- Add ${analysis.missing} missing words to improve coverage`);
  }
  if (analysis.extra > 0) {
    console.log(`- Review ${analysis.extra} extra words for validity`);
  }
  if (coverage >= 95) {
    console.log('- ✅ Excellent coverage!');
  } else if (coverage >= 90) {
    console.log('- ⚠️ Good coverage, consider adding missing words');
  } else {
    console.log('- ❌ Low coverage, significant updates needed');
  }
  
  return analysis;
}

// Export for manual testing
if (typeof window !== 'undefined') {
  window.validateWordList = validateWordList;
  console.log('🔧 Word list validation available as: validateWordList()');
} 