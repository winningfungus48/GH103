import React, { useEffect, useMemo } from "react";
import styles from "./Home.module.css";
import games from "../data/gamesData.jsx";
import GameCard from "../components/GameCard";
import LayoutWrapper from "../components/layout/LayoutWrapper";
import CategoryStrip from "../components/CategoryStrip";
import { useCategory } from "../context/CategoryContext";
// AdBanner temporarily disabled until 1.2
// import AdBanner from "../components/ads/AdBanner";

import { trackEvent } from "../utils/analytics";
import { isFavorite } from "../utils/localStorage";

console.log("[Home.jsx] Loaded games:", games);

const CATEGORY_SLUGS = [
  "a-z games",
  "favorites",
  "-le games",
  "Sports",
  "see more",
];

const Home = () => {
  console.log("[Home.jsx] Rendering Home");
  const { activeCategory, onCategoryChange } = useCategory();

  // Track homepage view
  useEffect(() => {
    // Track analytics events safely with dev-only logging
    try {
      trackEvent("page_view", { page: "home" });
    } catch (err) {
      if (import.meta.env.DEV) console.warn("Tracking error:", err);
    }
  }, []);

  // Memoize filtered games to prevent unnecessary re-computation
  const filteredGames = useMemo(() => {
    let gamesToFilter;
    if (activeCategory === "a-z games") {
      gamesToFilter = [...games].sort((a, b) => a.name.localeCompare(b.name));
    } else if (activeCategory === "favorites") {
      // Filter games based on isFavorite helper
      gamesToFilter = games.filter((game) => isFavorite(game.slug));
    } else if (activeCategory === "see more") {
      gamesToFilter = games.filter(
        (game) => game.categories && game.categories.includes("see more"),
      );
    } else {
      gamesToFilter = games.filter(
        (game) => game.categories && game.categories.includes(activeCategory),
      );
    }

    // Always sort filteredGames alphabetically by name
    return gamesToFilter.sort((a, b) => a.name.localeCompare(b.name));
  }, [activeCategory]);

  return (
    <LayoutWrapper
      pageTitle="Game Hub – Free Browser Puzzle Games"
      metaDescription="Game Hub is a collection of fun and free mini-games you can play in-browser. No downloads or sign-ups needed!"
      keywords={[
        "puzzle games",
        "free games",
        "browser games",
        "mini games",
        "word games",
        "number games",
        "brain games",
        "casual games",
      ]}
    >
      <CategoryStrip
        activeCategory={activeCategory}
        onCategoryChange={onCategoryChange}
      />
      <main id="main-content" className={styles.grid}>
        <div className={styles.cardsGrid}>
          {filteredGames.map((game) => (
            <GameCard
              key={game.slug}
              title={game.name}
              description={game.description}
              slug={game.slug}
              route={game.route}
              new={game.new}
              featured={game.featured}
            />
          ))}
        </div>
        {filteredGames.length === 0 && (
          <div className={styles.noGames}>
            <p>No games found in this category.</p>
          </div>
        )}
        {/* AdBanner temporarily disabled until 1.2 */}
        {/* <AdBanner /> */}
      </main>
    </LayoutWrapper>
  );
};

export default Home;
