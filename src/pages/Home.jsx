import styles from './Home.module.css';
import Header from '../components/Header';
import CategoryStrip from '../components/CategoryStrip';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className={styles.layout}>
      <Header />
      <CategoryStrip />
      <main className={styles.grid}>
        {/* Main content will go here */}
      </main>
      <Footer />
    </div>
  );
};

export default Home; 