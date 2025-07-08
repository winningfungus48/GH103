import styles from './Home.module.css';
import Header from '../components/Header';
import CategoryStrip from '../components/CategoryStrip';
import Footer from '../components/Footer';
import { games } from '../data/games';
import GameCard from '../components/GameCard';
import { useState } from 'react';

const CATEGORY_TABS = ['A-Z Games', 'Favorites', '-le Games', 'Sports', 'See More'];

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('A-Z Games');

  const filteredGames =
    activeCategory === 'See More'
      ? []
      : games.filter((game) => game.categories.includes(activeCategory));

  return (
    <div className={styles.layout}>
      <Header />
      <CategoryStrip
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <main className={styles.grid}>
        <div className={styles.cardsGrid}>
          {filteredGames.length === 0 ? (
            <div className={styles.empty}>No games found in this category.</div>
          ) : (
            filteredGames.map((game) => (
              <GameCard
                key={game.id}
                title={game.title}
                description={game.description}
                route={game.route}
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