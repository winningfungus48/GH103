import styles from './Home.module.css';
import Header from '../components/Header';
import CategoryStrip from '../components/CategoryStrip';
import Footer from '../components/Footer';
import { games } from '../data/games';
import GameCard from '../components/GameCard';

const Home = () => {
  return (
    <div className={styles.layout}>
      <Header />
      <CategoryStrip />
      <main className={styles.grid}>
        <div className={styles.cardsGrid}>
          {games.length === 0 ? (
            <div className={styles.empty}>No games available.</div>
          ) : (
            games.map((game) => (
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