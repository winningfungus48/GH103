import styles from "./App.module.css";
import Home from "./pages/Home";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import AllCategories from "./pages/AllCategories";
import NotFound from "./pages/NotFound";
import GameWrapper from "./components/GameWrapper";
import { ToastProvider } from "./context/ToastProvider";
import { FavoritesProvider } from "./context/FavoritesProvider";
import PrivacyPolicy from "./pages/PrivacyPolicy";

function App() {
  return (
    <ToastProvider>
      <FavoritesProvider>
        <div className={styles.app}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<AllCategories />} />
            <Route path="/game/:gameId" element={<GameWrapper />} />
            <Route path="/daily/:gameId" element={<DailyGameRedirect />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </FavoritesProvider>
    </ToastProvider>
  );
}

// Daily route alias that redirects to game route with mode=daily
const DailyGameRedirect = () => {
  const { gameId } = useParams();
  return <Navigate to={`/game/${gameId}?mode=daily`} replace />;
};

export default App;
