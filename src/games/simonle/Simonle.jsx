import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GamePageLayout from "../../components/game/GamePageLayout";
import GameHeader from "../../components/game/GameHeader";
import styles from "./simonle-styles.module.css";
import {
  setDailyProgress,
  getSimonleStats,
  setSimonleStats,
} from "../../utils/localStorage";
import useDailySeed from "../../hooks/useDailySeed";
import useGameState from "../../hooks/useGameState";
import useGameCompletion from "../../hooks/useGameCompletion";
import useWelcomeModal from "../../hooks/useWelcomeModal.jsx";
import Modal from "../../components/ui/Modal";

// --- Simonle-specific logic ---
const SIMONLE_INITIAL_STATE = {
  pattern: [],
  userPattern: [],
  currentIndex: 0,
  isPlaying: false,
  isUserTurn: false,
  gameOver: false,
  gameWon: false,
  score: 0,
  level: 1,
  maxLevel: 20,
  activeButton: null,
  showPattern: false,
};

const COLORS = [
  { id: 0, name: "green", color: "#10b981", borderColor: "#059669" },
  { id: 1, name: "red", color: "#ef4444", borderColor: "#dc2626" },
  { id: 2, name: "orange", color: "#f97316", borderColor: "#ea580c" },
  { id: 3, name: "blue", color: "#3b82f6", borderColor: "#2563eb" },
];

const winPrompts = [
  "Great Job!",
  "Awesome!",
  "You did it!",
  "Impressive!",
  "Fantastic!",
  "Well done!",
  "You cracked it!",
  "Brilliant!",
  "Superb!",
  "You nailed it!",
];

const losePrompts = [
  "Better luck next time!",
  "Don't give up!",
  "Try again tomorrow!",
  "Keep practicing!",
  "You'll get it next time!",
];

// Generate pattern using daily seed
function generateDailyPattern(seed, level) {
  const seededRandom = (seedStr) => {
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
      hash = (hash << 5) - hash + seedStr.charCodeAt(i);
      hash |= 0;
    }
    let x = Math.abs(hash) / 2147483647;
    return () => {
      x = Math.sin(x * 10000) * 10000;
      return x - Math.floor(x);
    };
  };

  const rand = seededRandom(seed);
  const pattern = [];
  
  for (let i = 0; i < level; i++) {
    pattern.push(Math.floor(rand() * 4));
  }
  
  return pattern;
}

// Generate random pattern for practice mode
function generateRandomPattern(level) {
  const pattern = [];
  for (let i = 0; i < level; i++) {
    pattern.push(Math.floor(Math.random() * 4));
  }
  return pattern;
}

const Simonle = ({ mode: _mode, description: _description, instructions }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isDailyMode = searchParams.get("mode") === "daily";
  const today = new Date().toISOString().slice(0, 10);
  const dailySeed = useDailySeed({ date: today, slug: "simonle" });

  // Refs for cleanup and preventing race conditions
  const timeoutRefs = useRef([]);
  const isMountedRef = useRef(true);

  // Game state with persistence
  const { state, setState, resetState } = useGameState(
    {
      ...SIMONLE_INITIAL_STATE,
      pattern: isDailyMode 
        ? generateDailyPattern(dailySeed, 1)
        : generateRandomPattern(1),
    },
    {
      persist: true,
      storageKey: `simonle-${isDailyMode ? 'daily' : 'practice'}-${today}`,
    }
  );

  // Stats and UI state
  const [stats, setStats] = useState(() => getSimonleStats());
  const [showEndgameModal, setShowEndgameModal] = useState(false);
  const [endgameData, setEndgameData] = useState({ won: false, message: "" });
  const [winPromptIndex, setWinPromptIndex] = useState(0);

  // Welcome modal
  const { WelcomeModal } = useWelcomeModal("Simonle", instructions);

  // Cleanup function for timeouts
  const clearAllTimeouts = useCallback(() => {
    timeoutRefs.current.forEach(timeoutId => clearTimeout(timeoutId));
    timeoutRefs.current = [];
  }, []);

  // Add timeout with cleanup tracking
  const addTimeout = useCallback((callback, delay) => {
    const timeoutId = setTimeout(callback, delay);
    timeoutRefs.current.push(timeoutId);
    return timeoutId;
  }, []);

  // Game completion tracking
  const isComplete = useCallback((currentState) => {
    return currentState.gameOver || currentState.gameWon;
  }, []);

  const getResult = useCallback((currentState) => ({
    completed: currentState.gameWon,
    score: currentState.score,
    level: currentState.level,
    pattern: currentState.pattern,
  }), []);

  useGameCompletion(state, isComplete, {
    onComplete: handleGameComplete,
    gameSlug: "simonle",
    trackStats: true,
    getResult,
  });

  // Pattern playback logic - optimized to prevent re-renders
  const playPattern = useCallback(async (pattern, level) => {
    if (!isMountedRef.current) return;

    setState(prev => ({ ...prev, isPlaying: true, showPattern: true }));

    // Progressive timing: slower at first, faster as levels increase
    const baseSpeed = Math.max(800, 1200 - (level * 20)); // 1200ms at level 1, 800ms at level 20
    const pauseBetween = Math.max(200, 400 - (level * 10)); // 400ms at level 1, 200ms at level 20

    for (let i = 0; i < pattern.length; i++) {
      if (!isMountedRef.current) return;
      
      setState(prev => ({ ...prev, activeButton: pattern[i] }));
      
      // Progressive display time
      await new Promise(resolve => {
        addTimeout(resolve, baseSpeed);
      });
      
      if (!isMountedRef.current) return;
      setState(prev => ({ ...prev, activeButton: null }));
      
      // Progressive pause between colors
      await new Promise(resolve => {
        addTimeout(resolve, pauseBetween);
      });
    }

    if (!isMountedRef.current) return;
    setState(prev => ({ 
      ...prev, 
      isPlaying: false, 
      showPattern: false, 
      isUserTurn: true,
      currentIndex: 0,
      userPattern: []
    }));
  }, [setState, addTimeout]);

  // Handle user input - optimized
  const handleButtonClick = useCallback((colorId) => {
    if (!state.isUserTurn || state.isPlaying) return;

    const newUserPattern = [...state.userPattern, colorId];
    setState(prev => ({ 
      ...prev, 
      userPattern: newUserPattern,
      activeButton: colorId
    }));

    // Check if user's input matches pattern so far
    const expectedColor = state.pattern[newUserPattern.length - 1];
    if (colorId !== expectedColor) {
      // Game over - pattern doesn't match
      addTimeout(() => {
        if (isMountedRef.current) {
          setState(prev => ({ 
            ...prev, 
            gameOver: true, 
            isUserTurn: false,
            activeButton: null
          }));
        }
      }, 300);
      return;
    }

    // Clear active button after a short delay
    addTimeout(() => {
      if (isMountedRef.current) {
        setState(prev => ({ ...prev, activeButton: null }));
      }
    }, 300);

    // Check if user completed the pattern
    if (newUserPattern.length === state.pattern.length) {
      // Level completed successfully
      const newScore = state.score + state.level * 10;
      const newLevel = state.level + 1;
      
      if (newLevel > state.maxLevel) {
        // Game won!
        setState(prev => ({ 
          ...prev, 
          gameWon: true, 
          score: newScore,
          level: newLevel,
          isUserTurn: false
        }));
      } else {
        // Generate next level pattern
        const nextPattern = isDailyMode 
          ? generateDailyPattern(dailySeed, newLevel)
          : generateRandomPattern(newLevel);
        
        setState(prev => ({ 
          ...prev, 
          score: newScore,
          level: newLevel,
          pattern: nextPattern,
          userPattern: [],
          currentIndex: 0,
          isUserTurn: false
        }));

        // Start next level after a short delay
        addTimeout(() => {
          if (isMountedRef.current) {
            playPattern(nextPattern, newLevel);
          }
        }, 1000);
      }
    }
  }, [state.isUserTurn, state.isPlaying, state.pattern, state.score, state.level, state.maxLevel, state.userPattern, isDailyMode, dailySeed, setState, playPattern, addTimeout]);

  // Handle game completion
  function handleGameComplete(gameState) {
    setShowEndgameModal(true);
    setEndgameData({
      won: gameState.gameWon,
      message: gameState.gameWon 
        ? winPrompts[winPromptIndex] 
        : losePrompts[Math.floor(Math.random() * losePrompts.length)],
    });
    
    if (gameState.gameWon) {
      setWinPromptIndex((prev) => (prev + 1) % winPrompts.length);
    }

    // Update stats
    const newStats = {
      ...stats,
      gamesPlayed: stats.gamesPlayed + 1,
      gamesWon: gameState.gameWon ? stats.gamesWon + 1 : stats.gamesWon,
      currentStreak: gameState.gameWon ? stats.currentStreak + 1 : 0,
      bestStreak: gameState.gameWon
        ? Math.max(stats.bestStreak, stats.currentStreak + 1)
        : stats.bestStreak,
      bestScore: Math.max(stats.bestScore, gameState.score),
      bestLevel: Math.max(stats.bestLevel, gameState.level),
    };
    setStats(newStats);
    setSimonleStats(newStats);

    // Daily mode: update localStorage streak
    if (isDailyMode && gameState.gameWon) {
      setDailyProgress("simonle", {
        date: today,
        completed: true,
        result: { score: gameState.score, level: gameState.level },
      });
    }
  }

  // Reset game
  const resetGame = useCallback(() => {
    clearAllTimeouts();
    const newPattern = isDailyMode 
      ? generateDailyPattern(dailySeed, 1)
      : generateRandomPattern(1);
    
    resetState({
      ...SIMONLE_INITIAL_STATE,
      pattern: newPattern,
    });
    setShowEndgameModal(false);
  }, [clearAllTimeouts, isDailyMode, dailySeed, resetState]);

  // Start game
  const startGame = useCallback(() => {
    if (!state.isPlaying && !state.isUserTurn && !state.gameOver && !state.gameWon) {
      playPattern(state.pattern, state.level);
    }
  }, [state.isPlaying, state.isUserTurn, state.gameOver, state.gameWon, state.pattern, state.level, playPattern]);

  // Auto-start game when component mounts
  useEffect(() => {
    if (!state.gameOver && !state.gameWon && !state.isPlaying && !state.isUserTurn) {
      startGame();
    }
  }, [state.gameOver, state.gameWon, state.isPlaying, state.isUserTurn, startGame]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  // Get current game status for screen readers
  const getGameStatus = () => {
    if (state.gameOver) {
      return state.gameWon 
        ? `Congratulations! You won the game with a score of ${state.score}!` 
        : `Game over. You reached level ${state.level} with a score of ${state.score}`;
    }
    if (state.isPlaying) {
      return `Watching pattern sequence, level ${state.level}`;
    }
    if (state.isUserTurn) {
      return `Your turn! Repeat the pattern. You've entered ${state.userPattern.length} of ${state.pattern.length} colors`;
    }
    return `Level ${state.level}, score ${state.score}`;
  };

  return (
  <GamePageLayout>
      <GameHeader
        title="Simonle"
        onBack={() => navigate("/")}
      />
      
      <WelcomeModal />

      <div 
        className={styles.gameContainer}
        role="application"
        aria-label="Simonle game"
        aria-live="polite"
        aria-atomic="true"
      >
        {/* Screen reader status */}
        <div className="sr-only" aria-live="polite">
          {getGameStatus()}
        </div>

        {/* Game info */}
        <div className={styles.gameInfo}>
          <div className={styles.scoreDisplay}>
            <span>Score: {state.score}</span>
            <span>Level: {state.level}</span>
          </div>
          {isDailyMode && (
            <div className={styles.dailyMode}>
              Daily Challenge
            </div>
          )}
        </div>

        {/* Game board */}
        <div className={styles.gameBoard}>
          {state.isPlaying && (
            <div className={styles.patternIndicator}>
              <span>Watching pattern...</span>
            </div>
          )}
          <div className={styles.colorGrid}>
            {COLORS.map((color) => (
              <button
                key={color.id}
                className={`${styles.colorButton} ${
                  state.activeButton === color.id ? styles.active : ""
                } ${state.isUserTurn && !state.isPlaying ? styles.clickable : ""} ${
                  state.isPlaying ? styles.patternPlayback : ""
                }`}
                style={{
                  backgroundColor: color.color,
                  borderColor: color.borderColor,
                }}
                onClick={() => handleButtonClick(color.id)}
                disabled={!state.isUserTurn || state.isPlaying}
                aria-label={`${color.name} button`}
                aria-pressed={state.activeButton === color.id}
              />
            ))}
          </div>
        </div>

        {/* Game controls */}
        <div className={styles.gameControls}>
          {!state.isPlaying && !state.isUserTurn && !state.gameOver && !state.gameWon && (
            <button 
              className={styles.startButton}
              onClick={startGame}
              aria-label="Start game"
            >
              Start Game
            </button>
          )}
          
          {(state.gameOver || state.gameWon) && (
            <button 
              className={styles.playAgainButton}
              onClick={resetGame}
              aria-label="Play again"
            >
              Play Again
            </button>
          )}
        </div>


      </div>

      {/* Endgame modal */}
      {showEndgameModal && (
        <Modal
          open={showEndgameModal}
          onClose={() => setShowEndgameModal(false)}
          title={endgameData.won ? "Congratulations!" : "Game Over"}
        >
          <div className={styles.modalContent}>
            <p>{endgameData.message}</p>
            <div className={styles.stats}>
              <p>Final Score: {state.score}</p>
              <p>Level Reached: {state.level}</p>
            </div>
            <div className={styles.modalButtons}>
              <button onClick={resetGame}>Play Again</button>
              <button onClick={() => navigate("/")}>Back to Games</button>
            </div>
          </div>
        </Modal>
      )}
  </GamePageLayout>
);
};

export default Simonle;
