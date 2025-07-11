import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import games from "../data/gamesData";
import { addToRecentlyPlayed } from "../utils/localStorage";
import styles from "./GameWrapper.module.css";

const GameWrapper = () => {
  const { gameId } = useParams();
  const game = games.find(g => g.slug === gameId);

  // Track recently played games
  useEffect(() => {
    if (gameId) {
      addToRecentlyPlayed(gameId);
    }
  }, [gameId]);

  if (!game) {
    return (
      <div className={styles.wrapper}>
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <h2>Game Not Found</h2>
          <Link to="/">Back to Home</Link>
        </div>
      </div>
    );
  }

  const GameComponent = game.component;

  return (
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
  );
};

export default GameWrapper; 