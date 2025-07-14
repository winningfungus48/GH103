import styles from "./Home.module.css";
import games from "../data/gamesData.jsx";
import GameCard from "../components/GameCard";
import { useState, useEffect } from "react";
import { getLastCategory } from "../utils/localStorage";
import { useFavorites } from "../context/FavoritesProvider";
import LayoutWrapper from "../components/layout/LayoutWrapper";
import CategoryStrip from "../components/CategoryStrip";
import AdBanner from "../components/ads/AdBanner";
import layoutUtils from "../styles/layout.module.css";
import { trackEvent } from "../utils/analytics";

console.log("[Home.jsx] Loaded games:", games);

const CATEGORY_SLUGS = [
  "a-z games",
  "favorites",
  "-le games",
  "sports",
  "see more",
];

const Home = () => {
  console.log("[Home.jsx] Rendering Home");
  const [activeCategory, setActiveCategory] = useState("a-z games");
  const { favorites } = useFavorites();

  // Load the last selected category from localStorage on component mount
  useEffect(() => {
    const lastCategory = getLastCategory();
    setActiveCategory(lastCategory);
  }, []);

  // Track homepage view
  useEffect(() => {
    // Track analytics events safely with dev-only logging
    try {
      trackEvent("page_view", { page: "home" });
    } catch (err) {
      if (import.meta.env.DEV) console.warn("Tracking error:", err);
    }
  }, []);

  let filteredGames;
  if (activeCategory === "a-z games") {
    filteredGames = [...games].sort((a, b) => a.name.localeCompare(b.name));
  } else if (activeCategory === "favorites") {
    // Filter games based on favorites array from context
    filteredGames = games.filter(game => favorites.includes(game.slug));
  } else if (activeCategory === "see more") {
    filteredGames = games.filter(game =>
      game.categories && game.categories.includes("see more")
    );
  } else {
    filteredGames = games.filter(game =>
      game.categories && game.categories.includes(activeCategory)
    );
  }

  // Always sort filteredGames alphabetically by name
  filteredGames = filteredGames.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <LayoutWrapper
      pageTitle="Game Hub – Free Browser Puzzle Games"
      metaDescription="Game Hub is a collection of fun and free mini-games you can play in-browser. No downloads or sign-ups needed!"
      keywords={["puzzle games", "free games", "browser games", "wordle", "numberle"]}
    >
      <CategoryStrip
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <div className={layoutUtils.container}>
        {/* <AdBanner position="top" /> */}
        <main className={styles.grid}>
          <div className={styles.cardsGrid}>
            {filteredGames.length === 0 ? (
              <div className={styles.empty}>No games found in this category.</div>
            ) : (
              filteredGames.map((game) => {
                // For 'see more', link to /category/[primaryCategorySlug] instead of /game/[slug]
                const isSeeMore = activeCategory === "see more";
                const primaryCategory = game.categories && game.categories.length > 0 ? game.categories[0] : "";
                return (
                  <GameCard
                    key={game.slug}
                    title={game.name}
                    description={game.description}
                    slug={game.slug}
                    route={isSeeMore ? `/category/${primaryCategory}` : undefined}
                    new={game.new}
                    featured={game.featured}
                  />
                );
              })
            )}
          </div>
        </main>
      </div>
    </LayoutWrapper>
  );
};

export default Home;
