// Utility for managing favorite game slugs in localStorage

const FAVORITES_KEY = 'favorites';
const RECENTLY_PLAYED_KEY = 'recentlyPlayed';
const LAST_CATEGORY_KEY = 'lastCategory';
const DAILY_PROGRESS_KEY = 'dailyProgress';

export function getFavorites() {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function toggleFavorite(slug) {
  const favorites = getFavorites();
  const index = favorites.indexOf(slug);
  let updated;
  if (index === -1) {
    updated = [...favorites, slug];
  } else {
    updated = favorites.filter(fav => fav !== slug);
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
}

export function getRecentlyPlayed() {
  try {
    const data = localStorage.getItem(RECENTLY_PLAYED_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function addToRecentlyPlayed(slug) {
  const recentlyPlayed = getRecentlyPlayed();
  
  // Remove the slug if it already exists
  const filtered = recentlyPlayed.filter(gameSlug => gameSlug !== slug);
  
  // Add the slug to the beginning of the array
  const updated = [slug, ...filtered];
  
  // Keep only the last 5 items
  const limited = updated.slice(0, 5);
  
  localStorage.setItem(RECENTLY_PLAYED_KEY, JSON.stringify(limited));
  return limited;
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