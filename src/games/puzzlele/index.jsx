import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GamePageLayout from "../../components/game/GamePageLayout";
import styles from "./puzzlele-styles.module.css";
import {
  getPuzzleleStats,
  setPuzzleleStats,
} from "../../utils/localStorage";
import useDailySeed from "../../hooks/useDailySeed";
import useWelcomeModal from "../../hooks/useWelcomeModal.jsx";
import Modal from "../../components/ui/Modal";

// Puzzlele-specific logic
const PUZZLELE_INITIAL_STATE = {
  puzzle: [],
  solvedPuzzle: [],
  currentPuzzle: [],
  gameOver: false,
  gameWon: false,
  maxMoves: 50,
  currentMoves: 0,
  puzzleSize: 3, // 3x3 puzzle
  emptyPosition: { row: 2, col: 2 }, // Bottom right corner
};

const PUZZLE_PATTERNS = [
  [1, 2, 3, 4, 5, 6, 7, 8, 0], // Classic pattern
  [8, 7, 6, 5, 4, 3, 2, 1, 0], // Reverse pattern
  [1, 3, 5, 7, 0, 8, 6, 4, 2], // Spiral pattern
  [2, 4, 6, 8, 0, 1, 3, 5, 7], // Alternating pattern
];

const winPrompts = [
  "Puzzle Master!",
  "Jigsaw Genius!",
  "Pattern Pro!",
  "Sliding Champion!",
  "Puzzle Wizard!",
  "Tile Tamer!",
  "Arrangement Ace!",
  "Order Expert!",
];

function generatePuzzle(seed) {
  const rng = (() => {
    let state = seed;
    return () => {
      state = (state * 9301 + 49297) % 233280;
      return state / 233280;
    };
  })();

  // Select a random pattern
  const patternIndex = Math.floor(rng() * PUZZLE_PATTERNS.length);
  const basePattern = [...PUZZLE_PATTERNS[patternIndex]];
  
  // Shuffle the puzzle by making random moves
  const shuffledPuzzle = [...basePattern];
  const shuffleMoves = 20 + Math.floor(rng() * 30); // 20-50 random moves
  
  for (let i = 0; i < shuffleMoves; i++) {
    const possibleMoves = getPossibleMoves(shuffledPuzzle);
    if (possibleMoves.length > 0) {
      const randomMove = possibleMoves[Math.floor(rng() * possibleMoves.length)];
      makeMove(shuffledPuzzle, randomMove);
    }
  }
  
  return {
    puzzle: shuffledPuzzle,
    solvedPuzzle: basePattern,
  };
}

function getPossibleMoves(puzzle) {
  const emptyIndex = puzzle.indexOf(0);
  const row = Math.floor(emptyIndex / 3);
  const col = emptyIndex % 3;
  const moves = [];
  
  // Check all 4 directions
  if (row > 0) moves.push({ direction: 'up', from: { row: row - 1, col } });
  if (row < 2) moves.push({ direction: 'down', from: { row: row + 1, col } });
  if (col > 0) moves.push({ direction: 'left', from: { row, col: col - 1 } });
  if (col < 2) moves.push({ direction: 'right', from: { row, col: col + 1 } });
  
  return moves;
}

function makeMove(puzzle, move) {
  const emptyIndex = puzzle.indexOf(0);
  const fromIndex = move.from.row * 3 + move.from.col;
  
  // Swap the tiles
  [puzzle[emptyIndex], puzzle[fromIndex]] = [puzzle[fromIndex], puzzle[emptyIndex]];
}

function isPuzzleSolved(puzzle, solvedPuzzle) {
  return puzzle.every((tile, index) => tile === solvedPuzzle[index]);
}

const Puzzlele = ({ instructions }) => {
  const navigate = useNavigate();
  const dailySeed = useDailySeed();
  const [state, setState] = useState(PUZZLELE_INITIAL_STATE);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});

  // Welcome modal
  const { WelcomeModal } = useWelcomeModal("Puzzlele", instructions);

  // Initialize game with daily seed
  useEffect(() => {
    if (dailySeed !== null) {
      const { puzzle, solvedPuzzle } = generatePuzzle(dailySeed);
      setState((prev) => ({
        ...prev,
        puzzle,
        solvedPuzzle,
        currentPuzzle: [...puzzle],
      }));
    }
  }, [dailySeed]);

  const handleTileClick = (row, col) => {
    if (state.gameOver) return;

    const index = row * 3 + col;
    const emptyIndex = state.currentPuzzle.indexOf(0);
    const emptyRow = Math.floor(emptyIndex / 3);
    const emptyCol = emptyIndex % 3;

    // Check if the clicked tile is adjacent to the empty space
    const isAdjacent = 
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow);

    if (isAdjacent) {
      const newPuzzle = [...state.currentPuzzle];
      [newPuzzle[index], newPuzzle[emptyIndex]] = [newPuzzle[emptyIndex], newPuzzle[index]];

      const newMoves = state.currentMoves + 1;
      const isWon = isPuzzleSolved(newPuzzle, state.solvedPuzzle);
      const isGameOver = isWon || newMoves >= state.maxMoves;

      setState((prev) => ({
        ...prev,
        currentPuzzle: newPuzzle,
        currentMoves: newMoves,
        gameOver: isGameOver,
        gameWon: isWon,
      }));

      if (isGameOver) {
        handleGameEnd(isWon);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (state.gameOver) return;

    const emptyIndex = state.currentPuzzle.indexOf(0);
    const emptyRow = Math.floor(emptyIndex / 3);
    const emptyCol = emptyIndex % 3;
    let newRow = emptyRow;
    let newCol = emptyCol;

    switch (e.key) {
      case "ArrowUp":
        if (emptyRow < 2) newRow = emptyRow + 1;
        break;
      case "ArrowDown":
        if (emptyRow > 0) newRow = emptyRow - 1;
        break;
      case "ArrowLeft":
        if (emptyCol < 2) newCol = emptyCol + 1;
        break;
      case "ArrowRight":
        if (emptyCol > 0) newCol = emptyCol - 1;
        break;
      default:
        return;
    }

    if (newRow !== emptyRow || newCol !== emptyCol) {
      const newIndex = newRow * 3 + newCol;
      const newPuzzle = [...state.currentPuzzle];
      [newPuzzle[emptyIndex], newPuzzle[newIndex]] = [newPuzzle[newIndex], newPuzzle[emptyIndex]];

      const newMoves = state.currentMoves + 1;
      const isWon = isPuzzleSolved(newPuzzle, state.solvedPuzzle);
      const isGameOver = isWon || newMoves >= state.maxMoves;

      setState((prev) => ({
        ...prev,
        currentPuzzle: newPuzzle,
        currentMoves: newMoves,
        gameOver: isGameOver,
        gameWon: isWon,
      }));

      if (isGameOver) {
        handleGameEnd(isWon);
      }
    }
  };

  const handleGameEnd = (won) => {
    const stats = getPuzzleleStats();
    const newStats = {
      ...stats,
      gamesPlayed: stats.gamesPlayed + 1,
      gamesWon: stats.gamesWon + (won ? 1 : 0),
      currentStreak: won ? stats.currentStreak + 1 : 0,
      maxStreak: won ? Math.max(stats.maxStreak, stats.currentStreak + 1) : stats.maxStreak,
      totalMoves: stats.totalMoves + state.currentMoves,
      bestMoves: won ? Math.min(stats.bestMoves || Infinity, state.currentMoves) : stats.bestMoves,
    };
    setPuzzleleStats(newStats);

    const winPrompt = winPrompts[Math.floor(Math.random() * winPrompts.length)];
    const message = won
      ? `You solved the puzzle in ${state.currentMoves} moves!`
      : `Puzzle unsolved. You used ${state.currentMoves} moves.`;

    setModalContent({
      title: won ? winPrompt : "Game Over",
      message,
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
    setState(PUZZLELE_INITIAL_STATE);
    setMessage("");
  };

  const resetPuzzle = () => {
    setState((prev) => ({
      ...prev,
      currentPuzzle: [...prev.puzzle],
      currentMoves: 0,
      gameOver: false,
      gameWon: false,
    }));
  };

  return (
    <GamePageLayout>
      
      <div 
        className={styles.container}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="application"
        aria-label="Puzzlele game"
        aria-live="polite"
        aria-atomic="true"
      >


        {/* Screen reader status */}
        <div className="sr-only" aria-live="polite">
          {state.gameOver 
            ? (state.gameWon 
                ? "Congratulations! You solved the puzzle!" 
                : "Game over. Puzzle unsolved.")
            : `Moves: ${state.currentMoves} of ${state.maxMoves}`
          }
        </div>

        <div className={styles.puzzleContainer}>
          <div className={styles.puzzle} role="grid" aria-label="Puzzle board">
            {Array.from({ length: 3 }, (_, row) => (
              <div key={row} className={styles.row} role="row">
                {Array.from({ length: 3 }, (_, col) => {
                  const index = row * 3 + col;
                  const tile = state.currentPuzzle[index];
                  return (
                    <div
                      key={col}
                      className={`${styles.tile} ${tile === 0 ? styles.empty : ""} ${
                        tile === state.solvedPuzzle[index] ? styles.correct : ""
                      }`}
                      onClick={() => handleTileClick(row, col)}
                      role="gridcell"
                      aria-label={tile === 0 ? "Empty space" : `Tile ${tile}`}
                      tabIndex={0}
                    >
                      {tile !== 0 && tile}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.controls}>
          <button
            className={styles.resetBtn}
            onClick={resetPuzzle}
            disabled={state.gameOver}
            aria-label="Reset puzzle"
            tabIndex={0}
          >
            Reset
          </button>
          <div className={styles.moves}>
            Moves: {state.currentMoves}/{state.maxMoves}
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
            {modalContent.stats.bestMoves && (
              <div className={styles.stat}>
                <span className={styles.statValue}>{modalContent.stats.bestMoves}</span>
                <span className={styles.statLabel}>Best Moves</span>
              </div>
            )}
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

export default Puzzlele; 