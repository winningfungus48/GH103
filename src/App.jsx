import styles from './App.module.css';
import Home from './pages/Home';
import { Routes, Route } from 'react-router-dom';
import AllCategories from './pages/AllCategories';
import NotFound from './pages/NotFound';

const GamePage = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', fontSize: '1.5rem' }}>
    <h2>Game Page</h2>
    <p>This is a placeholder for the game route.</p>
  </div>
);

function App() {
  return (
    <div className={styles.app}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<AllCategories />} />
        <Route path="/games/:gameId" element={<GamePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
