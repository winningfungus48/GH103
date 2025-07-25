import React, { Suspense } from "react";
import styles from "./App.module.css";
import ErrorBoundary from "./components/ErrorBoundary";
// Use React.lazy for heavy pages/components
const Home = React.lazy(() => import("./pages/Home"));
const Main = React.lazy(() => import("./pages/Main"));
const AllCategories = React.lazy(() => import("./pages/AllCategories"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const GameWrapper = React.lazy(() => import("./components/GameWrapper"));
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"));
const About = React.lazy(() => import("./pages/About"));
const Contact = React.lazy(() => import("./pages/Contact"));
const ModalTest = React.lazy(() => import("./components/ModalTest"));
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./context/ToastProvider";
import { FavoritesProvider } from "./context/FavoritesProvider";
import { CategoryProvider } from "./context/CategoryContext";

// Fallback UI for lazy loading
const Loader = () => (
  <div style={{ 
    textAlign: "center", 
    marginTop: "3rem",
    padding: "2rem",
    color: "#666"
  }}>
    <div style={{
      width: "40px",
      height: "40px",
      border: "3px solid #f3f3f3",
      borderTop: "3px solid #007bff",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      margin: "0 auto 1rem"
    }}></div>
    Loading...
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <FavoritesProvider>
          <CategoryProvider>
            <div className={styles.app}>
              <Suspense fallback={<Loader />}>
                              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/main" element={<Main />} />
                <Route path="/categories" element={<AllCategories />} />
                <Route path="/game/:slug" element={<GameWrapper />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/modal-test" element={<ModalTest />} />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
              </Suspense>
            </div>
          </CategoryProvider>
        </FavoritesProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
