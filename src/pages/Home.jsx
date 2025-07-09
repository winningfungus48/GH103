import styles from "./Home.module.css";
import Header from "../components/Header";
import CategoryStrip from "../components/CategoryStrip";
import Footer from "../components/Footer";
import games from "../data/gamesData";
import GameCard from "../components/GameCard";
import { useState } from "react";

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

  // Filter games by active category (case-sensitive, kebab-case)
  const filteredGames = games.filter(game =>
    game.categories && game.categories.includes(activeCategory)
  );

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
            filteredGames.map((game) => (
              <GameCard
                key={game.slug}
                title={game.name}
                description={game.description}
                slug={game.slug}
              />
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
