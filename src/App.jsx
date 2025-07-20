import React, { Suspense } from "react";
import styles from "./App.module.css";
// Use React.lazy for heavy pages/components
const Home = React.lazy(() => import("./pages/Home"));
const AllCategories = React.lazy(() => import("./pages/AllCategories"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const GameWrapper = React.lazy(() => import("./components/GameWrapper"));
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"));
import { Routes, Route, Navigate } from "react-router-dom";
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
          {/* Skip link for accessibility */}
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/categories" element={<AllCategories />} />
              <Route path="/game/:slug" element={<GameWrapper />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Suspense>
        </div>
      </FavoritesProvider>
    </ToastProvider>
  );
}

export default App;
