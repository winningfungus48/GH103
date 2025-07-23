import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GamePageLayout from "../../components/game/GamePageLayout";
import styles from "./colorle-styles.module.css";
import {
  setDailyProgress,
  getColorleStats,
  setColorleStats,
} from "../../utils/localStorage";
import useDailySeed from "../../hooks/useDailySeed";
import useWelcomeModal from "../../hooks/useWelcomeModal.jsx";
import Modal from "../../components/ui/Modal";

// Colorle-specific logic
const COLORLE_INITIAL_STATE = {
  secretColors: [],
  currentRow: 0,
  currentCol: 0,
  gameOver: false,
  gameWon: false,
  maxAttempts: 6,
  colorLength: 4,
  board: Array.from({ length: 6 }, () =>
    Array.from({ length: 4 }, () => ({ color: "", status: "" })),
  ),
  colorPadColors: {},
};

const COLORS = [
  { name: "Red", value: "#ff0000", label: "Red" },
  { name: "Blue", value: "#0000ff", label: "Blue" },
  { name: "Green", value: "#00ff00", label: "Green" },
  { name: "Yellow", value: "#ffff00", label: "Yellow" },
  { name: "Purple", value: "#800080", label: "Purple" },
  { name: "Orange", value: "#ffa500", label: "Orange" },
  { name: "Pink", value: "#ffc0cb", label: "Pink" },
  { name: "Cyan", value: "#00ffff", label: "Cyan" },
];

const winPrompts = [
  "Colorful Victory!",
  "Spectrum Success!",
  "Rainbow Win!",
  "Hue Got It!",
  "Chromatic Champion!",
  "Palette Perfect!",
  "Color Master!",
  "Spectrum Star!",
];

function generateSecretColors(seed) {
  const rng = (() => {
    let state = seed;
    return () => {
      state = (state * 9301 + 49297) % 233280;
      return state / 233280;
    };
  })();

  const colors = [];
  for (let i = 0; i < 4; i++) {
    const colorIndex = Math.floor(rng() * COLORS.length);
    colors.push(COLORS[colorIndex]);
  }
  return colors;
}

function checkGuess(guess, secretColors) {
  const result = [];
  const secretCopy = [...secretColors];
  const guessCopy = [...guess];

  // Check for exact matches first
  for (let i = 0; i < guessCopy.length; i++) {
    if (guessCopy[i] && secretCopy[i] && guessCopy[i].name === secretCopy[i].name) {
      result.push({ color: guessCopy[i], status: "correct" });
      secretCopy[i] = null;
      guessCopy[i] = null;
    }
  }

  // Check for present colors
  for (let i = 0; i < guessCopy.length; i++) {
    if (guessCopy[i]) {
      const secretIndex = secretCopy.findIndex(
        (color) => color && color.name === guessCopy[i].name
      );
      if (secretIndex !== -1) {
        result.push({ color: guessCopy[i], status: "present" });
        secretCopy[secretIndex] = null;
      } else {
        result.push({ color: guessCopy[i], status: "absent" });
      }
    }
  }

  return result;
}

const Colorle = ({ instructions }) => {
  const navigate = useNavigate();
  const dailySeed = useDailySeed();
  const [state, setState] = useState(COLORLE_INITIAL_STATE);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});

  // Welcome modal
  const { WelcomeModal } = useWelcomeModal("Colorle", instructions);

  // Initialize game with daily seed
  useEffect(() => {
    if (dailySeed !== null) {
      const secretColors = generateSecretColors(dailySeed);
      setState((prev) => ({
        ...prev,
        secretColors,
      }));
    }
  }, [dailySeed]);

  const inputColor = (color) => {
    if (state.gameOver || state.currentCol >= state.colorLength) return;

    setState((prev) => {
      const newBoard = [...prev.board];
      newBoard[prev.currentRow][prev.currentCol] = { color, status: "" };
      return {
        ...prev,
        board: newBoard,
        currentCol: prev.currentCol + 1,
      };
    });
  };

  const deleteColor = () => {
    if (state.currentCol === 0) return;

    setState((prev) => {
      const newBoard = [...prev.board];
      newBoard[prev.currentRow][prev.currentCol - 1] = { color: "", status: "" };
      return {
        ...prev,
        board: newBoard,
        currentCol: prev.currentCol - 1,
      };
    });
  };

  const submitGuess = () => {
    if (state.currentCol !== state.colorLength) return;

    const currentGuess = state.board[state.currentRow]
      .map((tile) => tile.color)
      .filter(Boolean);

    if (currentGuess.length !== state.colorLength) return;

    const result = checkGuess(currentGuess, state.secretColors);
    const newBoard = [...state.board];
    newBoard[state.currentRow] = result;

    const isWon = result.every((tile) => tile.status === "correct");
    const isGameOver = isWon || state.currentRow === state.maxAttempts - 1;

    // Update color pad colors
    const newColorPadColors = { ...state.colorPadColors };
    result.forEach((tile) => {
      if (tile.color) {
        newColorPadColors[tile.color.name] = tile.status;
      }
    });

    setState((prev) => ({
      ...prev,
      board: newBoard,
      currentRow: prev.currentRow + 1,
      currentCol: 0,
      gameOver: isGameOver,
      gameWon: isWon,
      colorPadColors: newColorPadColors,
    }));

    if (isGameOver) {
      handleGameEnd(isWon);
    }
  };

  const handleGameEnd = (won) => {
    const stats = getColorleStats();
    const newStats = {
      ...stats,
      gamesPlayed: stats.gamesPlayed + 1,
      gamesWon: stats.gamesWon + (won ? 1 : 0),
      currentStreak: won ? stats.currentStreak + 1 : 0,
      maxStreak: won ? Math.max(stats.maxStreak, stats.currentStreak + 1) : stats.maxStreak,
    };
    setColorleStats(newStats);

    const winPrompt = winPrompts[Math.floor(Math.random() * winPrompts.length)];
    setModalContent({
      title: won ? winPrompt : "Game Over",
      message: won
        ? `You found the color pattern in ${state.currentRow + 1} tries!`
        : `The pattern was: ${state.secretColors.map(c => c.name).join(", ")}`,
      stats: newStats,
    });
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/");
  };

  const handlePlayAgain = () => {
    setShowModal(false);
    setState(COLORLE_INITIAL_STATE);
    setMessage("");
  };

  return (
    <GamePageLayout>
      
      <div className={styles.container}>
        <div className={styles.board} role="grid" aria-label="Colorle game board">
          {state.board.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`${styles.row} ${rowIndex === state.currentRow ? styles.current : ""}`}
              role="row"
              aria-label={`Row ${rowIndex + 1}`}
            >
              {row.map((tile, colIndex) => (
                <div
                  key={colIndex}
                  className={`${styles.tile} ${tile.status} ${
                    rowIndex === state.currentRow && colIndex === state.currentCol
                      ? styles.current
                      : ""
                  }`}
                  role="gridcell"
                  aria-label={`Position ${colIndex + 1}, ${tile.color ? tile.color.name : "empty"}`}
                  style={tile.color ? { backgroundColor: tile.color.value } : {}}
                  tabIndex={0}
                >
                  {tile.color && <span className={styles.colorName}>{tile.color.name}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>

        {message && (
          <div className={styles.message} role="alert" aria-live="assertive">
            {message}
          </div>
        )}

        <div className={styles.colorPadContainer}>
          <div className={styles.colorPad} role="group" aria-label="Color pad">
            {COLORS.map((color) => (
              <button
                key={color.name}
                className={`${styles.colorBtn} ${state.colorPadColors[color.name] || ""}`}
                onClick={() => inputColor(color)}
                disabled={state.gameOver}
                aria-label={`Select ${color.name}`}
                style={{ backgroundColor: color.value }}
                tabIndex={0}
              >
                <span className={styles.colorName}>{color.name}</span>
              </button>
            ))}
          </div>
          <div className={styles.actionButtons} role="group" aria-label="Action buttons">
            <button
              className={styles.actionBtn}
              onClick={deleteColor}
              disabled={state.gameOver}
              aria-label="Delete last color"
              tabIndex={0}
            >
              ⌫
            </button>
            <button
              className={`${styles.actionBtn} ${state.currentCol === state.colorLength ? styles.active : ""}`}
              onClick={submitGuess}
              disabled={state.gameOver || state.currentCol !== state.colorLength}
              aria-label="Submit guess"
              tabIndex={0}
            >
              Enter
            </button>
          </div>
        </div>
      </div>

      <Modal open={showModal} onClose={handleModalClose} title={modalContent.title}>
        <p>{modalContent.message}</p>
        {modalContent.stats && (
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{modalContent.stats.gamesPlayed}</span>
              <span className={styles.statLabel}>Games</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>
                {modalContent.stats.gamesPlayed > 0
                  ? Math.round((modalContent.stats.gamesWon / modalContent.stats.gamesPlayed) * 100)
                  : 0}%
              </span>
              <span className={styles.statLabel}>Win Rate</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{modalContent.stats.currentStreak}</span>
              <span className={styles.statLabel}>Current Streak</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{modalContent.stats.maxStreak}</span>
              <span className={styles.statLabel}>Max Streak</span>
            </div>
          </div>
        )}
        <div slot="buttons">
          <button onClick={handlePlayAgain} className={styles.playAgainBtn}>
            Play Again
          </button>
          <button onClick={handleModalClose} className={styles.closeBtn}>
            Close
          </button>
        </div>
      </Modal>

      <WelcomeModal />
    </GamePageLayout>
  );
};

export default Colorle; 