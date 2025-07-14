import React, { useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import games from "../data/gamesData.jsx";
import { addToRecentlyPlayed } from "../utils/localStorage";
import styles from "./GameWrapper.module.css";
import LayoutWrapper from "./layout/LayoutWrapper";
import { trackEvent } from "../utils/analytics";
import NowPlayingBar from "./game/NowPlayingBar";
import AdBanner from "./ads/AdBanner";
import layoutUtils from "../styles/layout.module.css";

console.log("[GameWrapper.jsx] Loaded games:", games);

const showAds = false; // Hide ad placeholder for now

const GameWrapper = () => {
  console.log("[GameWrapper.jsx] Rendering GameWrapper");
  const { gameId } = useParams();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  const game = games.find(g => g.slug === gameId);
  console.log("[GameWrapper.jsx] game:", game);

  // Track recently played games and analytics
  useEffect(() => {
    if (game) {
      addToRecentlyPlayed(gameId);
      // Track analytics events safely with dev-only logging
      try {
        trackEvent("page_view", { page: `game/${game.slug}`, mode });
        trackEvent("game_view", { name: game.name, mode });
      } catch (err) {
        if (import.meta.env.DEV) console.warn("Tracking error:", err);
      }
    }
  }, [game, gameId, mode]);

  // Game pages override layout defaults to maximize immersion:
  // - Hide header and category strip
  // - Show only the game and footer
  // - NowPlayingBar is scaffolded for future use and can be activated via layout config or game metadata
  if (!game) {
    return (
      <LayoutWrapper 
        showHeader={false} 
        showCategoryStrip={false}
        pageTitle="Game Not Found – Game Hub"
        metaDescription="The requested game could not be found."
        keywords={["game hub", "not found"]}
      >
        <div className={styles.wrapper}>
          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <h2>Game Not Found</h2>
            <Link to="/">Back to Home</Link>
          </div>
        </div>
      </LayoutWrapper>
    );
  }

  // Handle daily mode for non-daily games
  if (mode === "daily" && !game.supportsDaily) {
    return (
      <LayoutWrapper 
        showHeader={false} 
        showCategoryStrip={false}
        pageTitle={`${game.name} – Daily Mode Not Available`}
        metaDescription="Daily mode is not available for this game."
        keywords={["game hub", "daily mode", game.name]}
      >
        <div className={styles.wrapper}>
          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <h2>Daily Mode Not Available</h2>
            <p style={{ color: "#666", marginBottom: "1rem" }}>
              This game doesn't support daily mode yet.
            </p>
            <Link to={`/game/${game.slug}`} style={{ color: "#007bff", textDecoration: "none", fontSize: 16 }}>
              Play Regular Game
            </Link>
          </div>
        </div>
      </LayoutWrapper>
    );
  }

  const GameComponent = game.component;
  console.log("[GameWrapper.jsx] GameComponent:", GameComponent);

  return (
    <LayoutWrapper 
      showHeader={false} 
      showCategoryStrip={false}
      pageTitle={`${game.name}${mode === "daily" ? " – Daily Challenge" : ""} – Play Now on Game Hub`}
      metaDescription={game.metaDescription || "Play free puzzle games in your browser. No sign-up needed."}
      keywords={game.keywords || ["game hub", "browser games", "puzzle games"]}
    >
      {/* NowPlayingBar is scaffolded for future use; set visible to true to enable */}
      <NowPlayingBar gameTitle={game.name} visible={false} />
      <div className={styles.wrapper}>
        {/* Removed header section with game title, Now Playing, and Back to Home */}
        {showAds && (
          <div className={layoutUtils.container} style={{ marginBottom: '1.5rem' }}>
            <AdBanner position="top" />
          </div>
        )}
        <section style={{ minHeight: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "#f9f9f9", borderRadius: 4 }}>
          <GameComponent mode={mode} />
        </section>
      </div>
    </LayoutWrapper>
  );
};

export default GameWrapper; 