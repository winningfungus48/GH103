import React, { createContext, useContext, useState } from "react";
import {
  getFavorites as getFavoritesFromStorage,
  toggleFavorite as toggleFavoriteInStorage,
} from "../utils/localStorage";

// FavoritesContext manages a flat array of favorite game slugs.
// Future: Extend to support multiplayer, daily stats, or richer metadata as needed.
const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  // Initialize favorites from localStorage (flat array of slugs)
  const [favorites, setFavorites] = useState(() => {
    try {
      return getFavoritesFromStorage();
    } catch (_e) {
      // Fallback to empty array if localStorage is unavailable or corrupt
      return [];
    }
  });

  // Toggle a favorite slug and update state/localStorage
  const toggleFavorite = (slug) => {
    try {
      const updated = toggleFavoriteInStorage(slug);
      setFavorites(updated);
    } catch (_e) {
      // Optionally: surface error to user via toast or log
      setFavorites([]); // fallback to empty
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
