import React, { createContext, useContext, useState } from 'react';
import { getFavorites as getFavoritesFromStorage, toggleFavorite as toggleFavoriteInStorage } from '../utils/localStorage';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => getFavoritesFromStorage());

  const toggleFavorite = (slug) => {
    const updated = toggleFavoriteInStorage(slug);
    setFavorites(updated);
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
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}; 