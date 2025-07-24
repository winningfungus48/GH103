import React, { useEffect, Suspense, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import games from "../data/gamesData.jsx";
import { addRecentlyPlayed } from "../utils/localStorage";
import performanceMonitor from "../utils/performance";
import styles from "./GameWrapper.module.css";
import LayoutWrapper from "./layout/LayoutWrapper";
import { trackEvent } from "../utils/analytics";
import NowPlayingBar from "./game/NowPlayingBar";
import GameHeader from "./game/GameHeader";
import GameHeaderActions from "./game/GameHeaderActions";

// Validation function to catch routing issues early
const validateGameRoute = (slug, games) => {
  const game = games.find((g) => g.slug === slug);
  if (!game) {
    console.warn(`[GameWrapper] Game not found for slug: "${slug}"`);
    console.warn(`[GameWrapper] Available games:`, games.map(g => g.slug));
    return null;
  }
  return game;
};

// Enhanced loading component with progress indication
const GameLoader = ({ gameName }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center",
      padding: "2rem",
      color: "#666",
      minHeight: "300px"
    }}>
      <div style={{ 
        width: "60px", 
        height: "60px", 
        border: "4px solid #f3f3f3", 
        borderTop: "4px solid #007bff", 
        borderRadius: "50%", 
        animation: "spin 1s linear infinite",
        marginBottom: "1rem"
      }}></div>
      <p style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>Loading {gameName}...</p>
      <div style={{
        width: "200px",
        height: "4px",
        backgroundColor: "#f3f3f3",
        borderRadius: "2px",
        overflow: "hidden"
      }}>
        <div style={{
          width: `${progress}%`,
          height: "100%",
          backgroundColor: "#007bff",
          transition: "width 0.3s ease",
          borderRadius: "2px"
        }}></div>
      </div>
      <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#999" }}>
        {Math.round(progress)}% loaded
      </p>
    </div>
  );
};

const GameWrapper = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  
  const game = validateGameRoute(slug, games);

  // Start performance monitoring when component mounts
  useEffect(() => {
    if (game) {
      performanceMonitor.startGameLoad(game.slug);
      // Scroll to top when game loads to ensure header is visible
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [game]);

  // Track recently played games and analytics
  useEffect(() => {
    if (game) {
      addRecentlyPlayed(slug);
      // Track analytics events safely with dev-only logging
      try {
        trackEvent("page_view", { page: `game/${game.slug}`, mode });
        trackEvent("game_view", { name: game.name, mode });
      } catch (err) {
        if (import.meta.env.DEV) console.warn("Tracking error:", err);
      }
    }
  }, [game, slug, mode]);

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
            <p style={{ color: "#666", marginBottom: "1rem" }}>
              The game "{slug}" could not be found.
            </p>
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
            <Link
              to={`/game/${game.slug}`}
              style={{ color: "#007bff", textDecoration: "none", fontSize: 16 }}
            >
              Play Regular Game
            </Link>
          </div>
        </div>
      </LayoutWrapper>
    );
  }

  const GameComponent = game.component;

  // Component to handle game load completion
  const GameComponentWithMonitoring = (props) => {
    useEffect(() => {
      // End performance monitoring when game component mounts
      performanceMonitor.endGameLoad(game.slug);
    }, []);
    
    return <GameComponent {...props} />;
  };

  return (
    <LayoutWrapper
      showHeader={false}
      showCategoryStrip={false}
      pageTitle={`${game.name}${mode === "daily" ? " – Daily Challenge" : ""} – Play Now on Game Hub`}
      metaDescription={
        game.metaDescription ||
        "Play free puzzle games in your browser. No sign-up needed."
      }
      keywords={game.keywords || ["game hub", "browser games", "puzzle games"]}
    >
      {/* NowPlayingBar is scaffolded for future use; set visible to true to enable */}
      <NowPlayingBar gameTitle={game.name} visible={false} />
      
      {/* Game Header with Actions */}
      <GameHeader 
        title={game.name}
        rightActions={<GameHeaderActions instructions={game.instructions} />}
      />
      
      <div className={styles.wrapper}>
        <section
          style={{
            minHeight: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f9f9f9",
            borderRadius: 4,
          }}
        >
          <Suspense fallback={<GameLoader gameName={game.name} />}>
          <GameComponentWithMonitoring mode={mode} description={game.description} instructions={game.instructions} />
          </Suspense>
        </section>
      </div>
    </LayoutWrapper>
  );
};

export default GameWrapper;
