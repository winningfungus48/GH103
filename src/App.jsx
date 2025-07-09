import styles from "./App.module.css";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import AllCategories from "./pages/AllCategories";
import NotFound from "./pages/NotFound";
import GameWrapper from "./components/GameWrapper";
import { ToastProvider } from "./context/ToastProvider";

function App() {
  return (
    <ToastProvider>
      <div className={styles.app}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<AllCategories />} />
          <Route path="/game/:gameId" element={<GameWrapper />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </ToastProvider>
  );
}

export default App;
