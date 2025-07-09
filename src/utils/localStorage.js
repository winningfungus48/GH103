// Utility for managing favorite game slugs in localStorage

const FAVORITES_KEY = 'favorites';

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