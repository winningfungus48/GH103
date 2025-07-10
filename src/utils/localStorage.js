// Utility for managing favorite game slugs in localStorage

const FAVORITES_KEY = 'favorites';
const RECENTLY_PLAYED_KEY = 'recentlyPlayed';
const LAST_CATEGORY_KEY = 'lastCategory';

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