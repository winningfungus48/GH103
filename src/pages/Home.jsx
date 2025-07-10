import styles from "./Home.module.css";
import Header from "../components/Header";
import CategoryStrip from "../components/CategoryStrip";
import Footer from "../components/Footer";
import games from "../data/gamesData";
import GameCard from "../components/GameCard";
import { useState, useEffect } from "react";
import { getLastCategory } from "../utils/localStorage";
import { useFavorites } from "../context/FavoritesProvider";

const CATEGORY_TABS = [
  "a-z games",
  "favorites",
  "-le games",
  "sports",
  "see more",
];

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
    <div className={styles.layout}>
      <Header />
      <CategoryStrip
        activeCategory={CATEGORY_TABS.find(tab => tab.toLowerCase() === activeCategory) || CATEGORY_TABS[0]}
        onCategoryChange={tab => setActiveCategory(tab.toLowerCase())}
      />
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
      <Footer />
    </div>
  );
};

export default Home;
