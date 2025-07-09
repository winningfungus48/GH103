import styles from "./App.module.css";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import AllCategories from "./pages/AllCategories";
import NotFound from "./pages/NotFound";
import GameWrapper from "./components/GameWrapper";

function App() {
  return (
    <div className={styles.app}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<AllCategories />} />
        <Route path="/game/:gameId" element={<GameWrapper />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
