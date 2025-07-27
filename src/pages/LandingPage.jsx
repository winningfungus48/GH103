import React, { useEffect, useMemo } from "react";
import styles from "./LandingPage.module.css";
import LayoutWrapper from "../components/layout/LayoutWrapper";
import CategoryStrip from "../components/CategoryStrip";
import GameCard from "../components/GameCard";
import { Link } from "react-router-dom";
import { trackEvent } from "../utils/analytics";
import { getRecentlyPlayed, getGamePlayCount, incrementGamePlayCount } from "../utils/localStorage";
import games from "../data/gamesData.jsx";
import { useCategory } from "../context/CategoryContext";

// Mock data for leaderboard (placeholder)
const mockLeaderboardData = [
  { rank: 1, player: "Player1", score: 2840, game: "Wordle" },
  { rank: 2, player: "Player2", score: 2720, game: "Numberle" },
  { rank: 3, player: "Player3", score: 2650, game: "Memoryle" },
  { rank: 4, player: "Player4", score: 2580, game: "Colorle" },
  { rank: 5, player: "Player5", score: 2510, game: "Mathle" },
];

// Use utility functions for play tracking
const getPlayCount = getGamePlayCount;
const trackGamePlay = incrementGamePlayCount;

const LandingPage = () => {
  const { activeCategory, onCategoryChange } = useCategory();
  
  // Reset category to show modular layout when landing page loads
  useEffect(() => {
    // Reset to show modular layout when landing page loads
    // This ensures users see the modular layout when clicking "Game Hub" title
    onCategoryChange(null);
  }, []); // Empty dependency array ensures this only runs once on mount

  // Track landing page view
  useEffect(() => {
    try {
      trackEvent("page_view", { page: "landing" });
    } catch (err) {
      if (import.meta.env.DEV) console.warn("Tracking error:", err);
    }
  }, []);

  // Get filtered games based on active category
  const filteredGames = useMemo(() => {
    if (activeCategory === "a-z games") {
      return games.sort((a, b) => a.name.localeCompare(b.name));
    } else if (activeCategory === "favorites") {
      return games.filter(game => {
        try {
          const favorites = JSON.parse(localStorage.getItem('gh_favorites') || '[]');
          return favorites.includes(game.slug);
        } catch {
          return false;
        }
      }).sort((a, b) => a.name.localeCompare(b.name));
    } else if (activeCategory === "featured") {
      const gamesWithPlayCount = games.map(game => ({
        ...game,
        playCount: getPlayCount(game.slug)
      }));
      
      return gamesWithPlayCount
        .sort((a, b) => b.playCount - a.playCount)
        .slice(0, 6); // Top 6 most played games
    } else if (activeCategory === "new") {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
      
      return games
        .filter(game => {
          if (!game.dateAdded) return false;
          const addedDate = new Date(game.dateAdded);
          return addedDate > thirtyDaysAgo;
        })
        .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    } else if (activeCategory === "recently played") {
      const recentSlugs = getRecentlyPlayed();
      return recentSlugs
        .map(slug => games.find(game => game.slug === slug))
        .filter(Boolean)
        .slice(0, 10); // Show up to 10 recently played
    } else {
      return games.filter(game => 
        game.categories && game.categories.includes(activeCategory)
      ).sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [activeCategory]);

  // Get featured games for the featured module (most played)
  const featuredGames = useMemo(() => {
    const gamesWithPlayCount = games.map(game => ({
      ...game,
      playCount: getPlayCount(game.slug)
    }));
    
    return gamesWithPlayCount
      .sort((a, b) => b.playCount - a.playCount)
      .slice(0, 3); // Top 3 most played games
  }, []);

  // Get new games for the new games module (recently added based on dateAdded property)
  const newGames = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    return games
      .filter(game => {
        if (!game.dateAdded) return false;
        const addedDate = new Date(game.dateAdded);
        return addedDate > thirtyDaysAgo;
      })
      .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
      .slice(0, 3); // Show up to 3 newest games
  }, []);

  // Get recently played games for the recently played module
  const recentlyPlayed = useMemo(() => {
    const recentSlugs = getRecentlyPlayed();
    return recentSlugs
      .map(slug => games.find(game => game.slug === slug))
      .filter(Boolean)
      .slice(0, 4); // Show up to 4 recently played
  }, []);



  return (
    <LayoutWrapper
      showCategoryStrip={false}
      pageTitle="Game Hub – Free Browser Puzzle Games"
      metaDescription="Game Hub is a collection of fun and free mini-games you can play in-browser. No downloads or sign-ups needed!"
      keywords={[
        "puzzle games",
        "free games", 
        "browser games",
        "mini games",
        "word games",
        "number games",
        "brain games",
        "casual games",
      ]}
    >
      <CategoryStrip
        activeCategory={activeCategory}
        onCategoryChange={onCategoryChange}
      />
      <div className={styles.landingContainer}>
        {/* Show modules when no specific category is selected */}
        {!activeCategory ? (
          <>
            {/* Featured Games Module - Large */}
            <section className={`${styles.module} ${styles.featuredModule}`}>
              <h2 className={styles.moduleTitle}>Featured Games</h2>
              <div className={styles.featuredGrid}>
                {featuredGames.map((game) => (
                  <GameCard
                    key={game.slug}
                    title={game.name}
                    description={game.description}
                    slug={game.slug}
                    route={game.route}
                    featured={true}
                    new={false}
                  />
                ))}
              </div>
            </section>

            {/* All Games Module - Medium */}
            <section className={`${styles.module} ${styles.allGamesModule}`}>
              <div className={styles.moduleHeader}>
                <h2 className={styles.moduleTitle}>All Games</h2>
                <button 
                  className={styles.viewAllLink}
                  onClick={() => onCategoryChange("a-z games")}
                  type="button"
                >
                  View All →
                </button>
              </div>
              <div className={styles.allGamesGrid}>
                {games.slice(0, 6).map((game) => (
                  <GameCard
                    key={game.slug}
                    title={game.name}
                    description={game.description}
                    slug={game.slug}
                    route={game.route}
                    featured={false}
                    new={false}
                  />
                ))}
              </div>
            </section>

            {/* New Games Module - Medium */}
            <section className={`${styles.module} ${styles.newGamesModule}`}>
              <h2 className={styles.moduleTitle}>New Games</h2>
              <div className={styles.newGamesGrid}>
                {newGames.map((game) => (
                  <GameCard
                    key={game.slug}
                    title={game.name}
                    description={game.description}
                    slug={game.slug}
                    route={game.route}
                    featured={false}
                    new={true}
                  />
                ))}
              </div>
            </section>

            {/* Recently Played Module - Small */}
            <section className={`${styles.module} ${styles.recentlyPlayedModule}`}>
              <h2 className={styles.moduleTitle}>Recently Played</h2>
              {recentlyPlayed.length > 0 ? (
                <div className={styles.recentlyPlayedList}>
                  {recentlyPlayed.map((game) => (
                    <Link
                      key={game.slug}
                      to={game.route || `/game/${game.slug}`}
                      className={styles.recentlyPlayedItem}
                    >
                      <span className={styles.recentlyPlayedTitle}>{game.name}</span>
                      <span className={styles.recentlyPlayedArrow}>→</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className={styles.noRecentGames}>No games played yet. Start exploring!</p>
              )}
            </section>

            {/* Leaderboard Module - Small */}
            <section className={`${styles.module} ${styles.leaderboardModule}`}>
              <h2 className={styles.moduleTitle}>Leaderboard</h2>
              <div className={styles.leaderboardList}>
                {mockLeaderboardData.map((entry) => (
                  <div key={entry.rank} className={styles.leaderboardItem}>
                    <span className={styles.rank}>#{entry.rank}</span>
                    <span className={styles.player}>{entry.player}</span>
                    <span className={styles.score}>{entry.score}</span>
                    <span className={styles.game}>{entry.game}</span>
                  </div>
                ))}
              </div>
              <div className={styles.leaderboardNote}>
                <p>Coming soon: Real leaderboards with your scores!</p>
              </div>
            </section>
          </>
        ) : (
          /* Show filtered games when a specific category is selected */
          <section className={styles.filteredGamesSection}>
            <div className={styles.filteredGamesGrid}>
              {filteredGames.map((game) => (
                <GameCard
                  key={game.slug}
                  title={game.name}
                  description={game.description}
                  slug={game.slug}
                  route={game.route}
                  featured={activeCategory === "featured"}
                  new={activeCategory === "new" && game.dateAdded}
                />
              ))}
            </div>
            {filteredGames.length === 0 && (
              <div className={styles.noGamesFound}>
                <p>No games found in this category.</p>
              </div>
            )}
          </section>
        )}
      </div>
    </LayoutWrapper>
  );
};

export default LandingPage; 