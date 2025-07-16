// Utility for managing favorite game slugs and recently played in localStorage

const FAVORITES_KEY = 'gh_favorites';
const RECENTLY_PLAYED_KEY = 'gh_recentlyPlayed';
const SCHEMA_VERSION_KEY = 'gh_schemaVersion';
const SCHEMA_VERSION = '1.0.0';

// Old keys for migration
const OLD_FAVORITES_KEY = 'favorites';
const OLD_RECENTLY_PLAYED_KEY = 'recentlyPlayed';

// --- Migration Logic ---
function migrateLocalStorageSchema() {
  try {
    const hasNewFavorites = localStorage.getItem(FAVORITES_KEY) !== null;
    const hasNewRecentlyPlayed = localStorage.getItem(RECENTLY_PLAYED_KEY) !== null;
    const hasSchemaVersion = localStorage.getItem(SCHEMA_VERSION_KEY) !== null;

    // Only run migration if any new keys are missing
    if (!hasNewFavorites || !hasNewRecentlyPlayed || !hasSchemaVersion) {
      // Try to migrate old favorites
      let migratedFavorites = [];
      let migratedRecentlyPlayed = [];
      let migrationFailed = false;
      // Migrate favorites
      try {
        const oldFav = localStorage.getItem(OLD_FAVORITES_KEY);
        migratedFavorites = oldFav ? JSON.parse(oldFav) : [];
        if (!Array.isArray(migratedFavorites)) migratedFavorites = [];
      } catch (e) {
        migrationFailed = true;
      }
      // Migrate recently played
      try {
        const oldRecent = localStorage.getItem(OLD_RECENTLY_PLAYED_KEY);
        migratedRecentlyPlayed = oldRecent ? JSON.parse(oldRecent) : [];
        if (!Array.isArray(migratedRecentlyPlayed)) migratedRecentlyPlayed = [];
      } catch (e) {
        migrationFailed = true;
      }
      // If migration failed, clear and initialize
      if (migrationFailed) {
        localStorage.removeItem(OLD_FAVORITES_KEY);
        localStorage.removeItem(OLD_RECENTLY_PLAYED_KEY);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify([]));
        localStorage.setItem(RECENTLY_PLAYED_KEY, JSON.stringify([]));
      } else {
        // Set migrated data to new keys
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(migratedFavorites));
        localStorage.setItem(RECENTLY_PLAYED_KEY, JSON.stringify(migratedRecentlyPlayed));
        // Remove old keys
        localStorage.removeItem(OLD_FAVORITES_KEY);
        localStorage.removeItem(OLD_RECENTLY_PLAYED_KEY);
      }
      // Set schema version
      localStorage.setItem(SCHEMA_VERSION_KEY, SCHEMA_VERSION);
    }
  } catch (e) {
    // If migration throws, clear and initialize new keys
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([]));
    localStorage.setItem(RECENTLY_PLAYED_KEY, JSON.stringify([]));
    localStorage.setItem(SCHEMA_VERSION_KEY, SCHEMA_VERSION);
  }
}

// Run migration on module load
migrateLocalStorageSchema();

export function getSchemaVersion() {
  try {
    return localStorage.getItem(SCHEMA_VERSION_KEY) || null;
  } catch (e) {
    return null;
  }
}

// --- Timestamp-based concurrency guard helpers ---
const FAVORITES_TIMESTAMP_KEY = 'gh_favorites_ts';
const RECENTLY_PLAYED_TIMESTAMP_KEY = 'gh_recentlyPlayed_ts';

function getTimestamp(key) {
  const ts = localStorage.getItem(key);
  return ts ? parseInt(ts, 10) : 0;
}

function setTimestamp(key) {
  localStorage.setItem(key, Date.now().toString());
}

// --- Helper: isFavorite(slug) ---
export function isFavorite(slug) {
  return getFavorites().includes(slug);
}

// --- Helper: addRecentlyPlayed(slug) ---
export function addRecentlyPlayed(slug) {
  // Use concurrency guard
  const lastWrite = getTimestamp(RECENTLY_PLAYED_TIMESTAMP_KEY);
  const now = Date.now();
  if (now - lastWrite < 100) {
    // Prevent rapid overwrites (debounce window: 100ms)
    return getRecentlyPlayed();
  }
  const recentlyPlayed = getRecentlyPlayed();
  const filtered = recentlyPlayed.filter(gameSlug => gameSlug !== slug);
  const updated = [slug, ...filtered].slice(0, 5);
  localStorage.setItem(RECENTLY_PLAYED_KEY, JSON.stringify(updated));
  setTimestamp(RECENTLY_PLAYED_TIMESTAMP_KEY);
  return updated;
}

// --- Helper: isRecentlyPlayed(slug) ---
export function isRecentlyPlayed(slug) {
  return getRecentlyPlayed().includes(slug);
}

// --- Override toggleFavorite to use concurrency guard ---
export function toggleFavorite(slug) {
  // Use concurrency guard
  const lastWrite = getTimestamp(FAVORITES_TIMESTAMP_KEY);
  const now = Date.now();
  if (now - lastWrite < 100) {
    // Prevent rapid overwrites (debounce window: 100ms)
    return getFavorites();
  }
  const favorites = getFavorites();
  const index = favorites.indexOf(slug);
  let updated;
  if (index === -1) {
    updated = [...favorites, slug];
  } else {
    updated = favorites.filter(fav => fav !== slug);
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  setTimestamp(FAVORITES_TIMESTAMP_KEY);
  return updated;
}

// --- Fallback logic for old keys in helpers ---
// (If migration hasn't run, helpers will transparently read old keys)
function getWithFallback(newKey, oldKey) {
  const data = localStorage.getItem(newKey);
  if (data !== null) return JSON.parse(data);
  const oldData = localStorage.getItem(oldKey);
  return oldData ? JSON.parse(oldData) : [];
}

export function getFavorites() {
  try {
    return getWithFallback(FAVORITES_KEY, OLD_FAVORITES_KEY);
  } catch (e) {
    return [];
  }
}

export function getRecentlyPlayed() {
  try {
    return getWithFallback(RECENTLY_PLAYED_KEY, OLD_RECENTLY_PLAYED_KEY);
  } catch (e) {
    return [];
  }
}

export function getLastCategory() {
  try {
    const data = localStorage.getItem(LAST_CATEGORY_KEY);
    return data || 'a-z games';
  } catch (e) {
    return 'a-z games';
  }
}

export function setLastCategory(category) {
  try {
    localStorage.setItem(LAST_CATEGORY_KEY, category);
  } catch (e) {
    // Silently fail if localStorage is not available
  }
} 

export function getDailyProgress(gameSlug) {
  try {
    const data = localStorage.getItem(DAILY_PROGRESS_KEY);
    const progress = data ? JSON.parse(data) : {};
    return progress[gameSlug] || {
      lastCompleted: null,
      streak: 0,
      history: {}
    };
  } catch (e) {
    return {
      lastCompleted: null,
      streak: 0,
      history: {}
    };
  }
}

export function setDailyProgress(gameSlug, { date, completed, result }) {
  try {
    const data = localStorage.getItem(DAILY_PROGRESS_KEY);
    const progress = data ? JSON.parse(data) : {};
    const gameProgress = progress[gameSlug] || { lastCompleted: null, streak: 0, history: {} };
    // Update history
    gameProgress.history[date] = { completed, result };
    // Update streak and lastCompleted if completed today
    if (completed) {
      // If lastCompleted is yesterday, increment streak; else reset to 1
      const prevDate = gameProgress.lastCompleted;
      const yesterday = new Date(date);
      yesterday.setDate(yesterday.getDate() - 1);
      const ymd = yesterday.toISOString().slice(0, 10);
      if (prevDate === ymd) {
        gameProgress.streak += 1;
      } else {
        gameProgress.streak = 1;
      }
      gameProgress.lastCompleted = date;
    }
    progress[gameSlug] = gameProgress;
    localStorage.setItem(DAILY_PROGRESS_KEY, JSON.stringify(progress));
    return gameProgress;
  } catch (e) {
    return null;
  }
}

export function getDailyStreak(gameSlug) {
  const progress = getDailyProgress(gameSlug);
  return progress.streak || 0;
}

export function resetDailyStreak(gameSlug) {
  try {
    const data = localStorage.getItem(DAILY_PROGRESS_KEY);
    const progress = data ? JSON.parse(data) : {};
    if (progress[gameSlug]) {
      progress[gameSlug].streak = 0;
      localStorage.setItem(DAILY_PROGRESS_KEY, JSON.stringify(progress));
    }
  } catch (e) {
    // Silently fail
  }
} 

// --- Numberle Stats ---
const NUMBERLE_STATS_KEY = 'numberle-stats';

export function getNumberleStats() {
  try {
    const data = localStorage.getItem(NUMBERLE_STATS_KEY);
    return data ? JSON.parse(data) : {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      bestStreak: 0
    };
  } catch (e) {
    // Silently fail and return default stats
    return {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      bestStreak: 0
    };
  }
}

export function setNumberleStats(newStats) {
  try {
    localStorage.setItem(NUMBERLE_STATS_KEY, JSON.stringify(newStats));
  } catch (e) {
    // Silently fail
  }
} 

// --- Theme Mode ---
const THEME_KEY = 'theme-mode';

export function getThemeMode() {
  try {
    return localStorage.getItem(THEME_KEY) || 'system';
  } catch (e) {
    return 'system';
  }
}

export function setThemeMode(mode) {
  try {
    localStorage.setItem(THEME_KEY, mode);
  } catch (e) {
    // Silently fail
  }
} 