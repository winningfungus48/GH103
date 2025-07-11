import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import games from "../data/gamesData";
import { addToRecentlyPlayed } from "../utils/localStorage";
import styles from "./GameWrapper.module.css";
import LayoutWrapper from "./layout/LayoutWrapper";
import { trackEvent } from "../utils/analytics";
import NowPlayingBar from "./game/NowPlayingBar";

const GameWrapper = () => {
  const { gameId } = useParams();
  const game = games.find(g => g.slug === gameId);

  // Track recently played games
  useEffect(() => {
    if (gameId) {
      addToRecentlyPlayed(gameId);
      // Analytics: track game view
      trackEvent('view_game', { slug: gameId });
    }
  }, [gameId]);

  // Game pages override layout defaults to maximize immersion:
  // - Hide header and category strip
  // - Show only the game and footer
  // - NowPlayingBar is scaffolded for future use and can be activated via layout config or game metadata
  if (!game) {
    return (
      <LayoutWrapper showHeader={false} showCategoryStrip={false}>
        <div className={styles.wrapper}>
          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <h2>Game Not Found</h2>
            <Link to="/">Back to Home</Link>
          </div>
        </div>
      </LayoutWrapper>
    );
  }

  const GameComponent = game.component;

  return (
    <LayoutWrapper showHeader={false} showCategoryStrip={false}>
      {/* NowPlayingBar is scaffolded for future use; set visible to true to enable */}
      <NowPlayingBar gameTitle={game.name} visible={false} />
      <div className={styles.wrapper}>
        <header style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: "2rem", margin: 0 }}>{game.name}</h1>
          <div style={{ fontWeight: 500, color: "#555", marginBottom: 12 }}>Now Playing: {game.name}</div>
          <Link to="/" style={{ color: "#007bff", textDecoration: "none", fontSize: 16 }}>&larr; Back to Home</Link>
        </header>
        <section style={{ minHeight: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "#f9f9f9", borderRadius: 4 }}>
          <GameComponent />
        </section>
      </div>
    </LayoutWrapper>
  );
};

export default GameWrapper; 