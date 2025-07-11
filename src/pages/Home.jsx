import styles from "./Home.module.css";
import games from "../data/gamesData";
import GameCard from "../components/GameCard";
import { useState, useEffect } from "react";
import { getLastCategory } from "../utils/localStorage";
import { useFavorites } from "../context/FavoritesProvider";
import LayoutWrapper from "../components/layout/LayoutWrapper";
import CategoryStrip from "../components/CategoryStrip";

const CATEGORY_SLUGS = [
  "a-z games",
  "favorites",
  "-le games",
  "sports",
  "see more",
];

const Home = () => {
  const [activeCategory, setActiveCategory] = useState("a-z games");
  const { favorites } = useFavorites();

  // Load the last selected category from localStorage on component mount
  useEffect(() => {
    const lastCategory = getLastCategory();
    setActiveCategory(lastCategory);
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

  return (
    <LayoutWrapper>
      <CategoryStrip
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <div className={styles.layout}>
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
