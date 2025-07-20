import React from "react";
import { useFavorites } from "../../context/FavoritesProvider";
import styles from "./FavoriteToggle.module.css";
import { trackEvent } from "../../utils/analytics";

const FavoriteToggle = ({ slug }) => {
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = favorites.includes(slug);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(slug);
    // Track analytics events safely with dev-only logging
    try {
      trackEvent("favorite_toggle", { slug, status: !isFavorite });
    } catch (err) {
      if (import.meta.env.DEV) console.warn("Tracking error:", err);
    }
  };

  const ariaLabel = isFavorite ? "Remove from favorites" : "Add to favorites";

  return (
    <button
      className={`${styles.favoriteButton} ${isFavorite ? styles.favorited : ""}`}
      onClick={handleToggle}
      aria-label={ariaLabel}
      tabIndex={0}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={isFavorite ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={styles.heartIcon}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
};

export default FavoriteToggle;
