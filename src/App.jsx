import React, { Suspense } from "react";
import styles from "./App.module.css";
// Use React.lazy for heavy pages/components
const Home = React.lazy(() => import("./pages/Home"));
const AllCategories = React.lazy(() => import("./pages/AllCategories"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const GameWrapper = React.lazy(() => import("./components/GameWrapper"));
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"));
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { ToastProvider } from "./context/ToastProvider";
import { FavoritesProvider } from "./context/FavoritesProvider";

// Fallback UI for lazy loading
const Loader = () => (
  <div style={{ textAlign: "center", marginTop: "3rem" }}>Loading...</div>
);

function App() {
  return (
    <ToastProvider>
      <FavoritesProvider>
        <div className={styles.app}>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/categories" element={<AllCategories />} />
              <Route path="/game/:gameId" element={<GameWrapper />} />
              <Route path="/daily/:gameId" element={<DailyGameRedirect />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
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
