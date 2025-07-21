import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GamePageLayout from "../../components/game/GamePageLayout";
import GameHeader from "../../components/game/GameHeader";
import WordListSettings from "../../components/game/WordListSettings";
import { useToast } from "../../context/ToastProvider";
import styles from "./wordle-styles.module.css";
import {
  setDailyProgress,
  getWordleStats,
  setWordleStats,
} from "../../utils/localStorage";
import useDailySeed from "../../hooks/useDailySeed";
import useWelcomeModal from "../../hooks/useWelcomeModal.jsx";
import { getDailyWord, isValidWord, getWordListStats, COMPREHENSIVE_WORDS } from "../../data/comprehensiveWordleWords";
import Modal from "../../components/ui/Modal";

// --- Wordle-specific logic ---
const WORDLE_INITIAL_STATE = {
  secretWord: "",
  currentRow: 0,
  currentCol: 0,
  gameOver: false,
  gameWon: false,
  maxAttempts: 6,
  wordLength: 5,
  board: Array.from({ length: 6 }, () =>
    Array.from({ length: 5 }, () => ({ value: "", status: "" })),
  ),
  keyboardColors: {},
};

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

function createBoard() {
  return Array.from({ length: 6 }, () =>
    Array.from({ length: 5 }, () => ({ value: "", status: "" })),
  );
}

function evaluateGuess(guess, secretWord) {
  const result = [];
  const secretArray = secretWord.split("");
  const guessArray = guess.split("");
  const used = new Array(5).fill(false);

  // First pass: find exact matches (green)
  for (let i = 0; i < 5; i++) {
    if (guessArray[i] === secretArray[i]) {
      result.push("correct");
      used[i] = true;
    } else {
      result.push("");
    }
  }

  // Second pass: find partial matches (yellow)
  for (let i = 0; i < 5; i++) {
    if (result[i] === "correct") continue;
    
    const letter = guessArray[i];
    const letterCount = secretArray.filter((l, idx) => l === letter && !used[idx]).length;
    const alreadyUsed = result.filter((r, idx) => 
      r === "present" && guessArray[idx] === letter
    ).length;
    
    if (letterCount > alreadyUsed) {
      result[i] = "present";
      // Mark the first unused occurrence as used
      for (let j = 0; j < 5; j++) {
        if (secretArray[j] === letter && !used[j]) {
          used[j] = true;
          break;
        }
      }
    } else {
      result[i] = "absent";
    }
  }

  return result;
}

function updateKeyboardColors(keyboardColors, guess, evaluation) {
  const newColors = { ...keyboardColors };
  
  for (let i = 0; i < 5; i++) {
    const letter = guess[i].toUpperCase();
    const status = evaluation[i];
    
    if (!newColors[letter] || status === "correct") {
      newColors[letter] = status;
    } else if (status === "present" && newColors[letter] !== "correct") {
      newColors[letter] = status;
    }
  }
  
  return newColors;
}

// Get a random word for practice mode
function getRandomWord() {
  // Use comprehensive word list for practice mode
  const randomIndex = Math.floor(Math.random() * COMPREHENSIVE_WORDS.length);
  return COMPREHENSIVE_WORDS[randomIndex];
}

const Wordle = ({ mode, description: _description, instructions }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dailySeed = useDailySeed({ slug: "wordle" });
  const today = new Date().toISOString().slice(0, 10);
  const { showToast } = useToast();
  
  const [gameState, setGameState] = useState(WORDLE_INITIAL_STATE);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [stats, setStats] = useState(getWordleStats());
  const [showSettings, setShowSettings] = useState(false);

  // Welcome modal
  const { WelcomeModal } = useWelcomeModal("Wordle", instructions);

  // Initialize game
  useEffect(() => {
    try {
      const isDailyMode = mode === "daily";
      const secretWord = isDailyMode ? getDailyWord(dailySeed) : getRandomWord();
    
    setGameState(prev => ({
      ...prev,
      secretWord,
      board: createBoard(),
      keyboardColors: {},
      currentRow: 0,
      currentCol: 0,
      gameOver: false,
      gameWon: false,
    }));
    } catch (error) {
      console.error("[Wordle] Error initializing game:", error);
    }
  }, [mode, dailySeed]);

  // Memoized input functions to prevent recreation
  const inputLetter = useCallback((letter) => {
    setGameState(prev => {
      if (prev.gameOver || prev.currentCol >= 5) return prev;
      
      return {
        ...prev,
        board: prev.board.map((row, rowIndex) =>
          rowIndex === prev.currentRow
            ? row.map((cell, colIndex) =>
                colIndex === prev.currentCol
                  ? { ...cell, value: letter.toUpperCase() }
                  : cell
              )
            : row
        ),
        currentCol: prev.currentCol + 1,
      };
    });
  }, []);

  const deleteLetter = useCallback(() => {
    setGameState(prev => {
      if (prev.gameOver || prev.currentCol <= 0) return prev;
      
      return {
        ...prev,
        board: prev.board.map((row, rowIndex) =>
          rowIndex === prev.currentRow
            ? row.map((cell, colIndex) =>
                colIndex === prev.currentCol - 1
                  ? { ...cell, value: "" }
                  : cell
            )
            : row
        ),
        currentCol: prev.currentCol - 1,
      };
    });
  }, []);

  const submitGuess = useCallback(() => {
    setGameState(prev => {
      if (prev.gameOver || prev.currentCol !== 5) return prev;
      
      const currentRow = prev.board[prev.currentRow];
      const guess = currentRow.map(cell => cell.value).join("").toLowerCase();
      
      if (!isValidWord(guess)) {
        // Show toast error message
        showToast("Invalid Word", { 
          type: "error", 
          position: "top",
          duration: 2000 
        });
        return prev;
      }
      
      const evaluation = evaluateGuess(guess, prev.secretWord);
      const isCorrect = evaluation.every(status => status === "correct");
      const isLastGuess = prev.currentRow === 5;
      
      // Update board with evaluation
      const updatedBoard = prev.board.map((row, rowIndex) =>
        rowIndex === prev.currentRow
          ? row.map((cell, colIndex) => ({
              ...cell,
              status: evaluation[colIndex],
            }))
          : row
      );
      
      // Update keyboard colors
      const updatedKeyboardColors = updateKeyboardColors(
        prev.keyboardColors,
        guess,
        evaluation
      );
      
      const newGameState = {
        ...prev,
        board: updatedBoard,
        keyboardColors: updatedKeyboardColors,
        currentRow: prev.currentRow + 1,
        currentCol: 0,
        gameOver: isCorrect || isLastGuess,
        gameWon: isCorrect,
      };
      
      // Handle game completion
      if (newGameState.gameOver) {
        handleGameComplete(newGameState);
      }
      
      return newGameState;
    });
  }, []);

  const handleGameComplete = useCallback((finalGameState) => {
    const isDailyMode = mode === "daily";
    const attempts = finalGameState.gameWon ? finalGameState.currentRow : 6;
    
    // Update stats
    const newStats = {
      ...stats,
      gamesPlayed: stats.gamesPlayed + 1,
      gamesWon: finalGameState.gameWon ? stats.gamesWon + 1 : stats.gamesWon,
    };
    
    if (finalGameState.gameWon) {
      newStats.currentStreak += 1;
      newStats.bestStreak = Math.max(newStats.currentStreak, newStats.bestStreak);
    } else {
      newStats.currentStreak = 0;
    }
    
    setStats(newStats);
    setWordleStats(newStats);
    
    // Update daily progress if in daily mode
    if (isDailyMode) {
      setDailyProgress("wordle", {
        date: today,
        completed: true,
        result: finalGameState.gameWon ? "win" : "loss",
      });
    }
    
    // Show completion modal
    const prompt = finalGameState.gameWon
      ? winPrompts[Math.floor(Math.random() * winPrompts.length)]
      : losePrompts[Math.floor(Math.random() * losePrompts.length)];
    
    setModalTitle(finalGameState.gameWon ? "Congratulations!" : "Game Over");
    setModalMessage(
      `${prompt}\n\n${
        finalGameState.gameWon
          ? `You solved it in ${attempts} ${attempts === 1 ? "try" : "tries"}!`
          : `The word was: ${finalGameState.secretWord.toUpperCase()}`
      }\n\nGames Played: ${newStats.gamesPlayed}\nGames Won: ${newStats.gamesWon}\nCurrent Streak: ${newStats.currentStreak}\nBest Streak: ${newStats.bestStreak}`
    );
    setShowModal(true);
  }, [mode, stats, today]);

  // Handle keyboard input - Fixed event handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent default for special keys
      if (e.key === "Enter" || e.key === "Backspace") {
        e.preventDefault();
      }
      
      // Handle letter input
      if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
        inputLetter(e.key.toLowerCase());
      } else if (e.key === "Enter") {
        submitGuess();
      } else if (e.key === "Backspace") {
        deleteLetter();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inputLetter, deleteLetter, submitGuess]); // Only depend on memoized functions

  const resetGame = () => {
    const isDailyMode = mode === "daily";
    const secretWord = isDailyMode ? getDailyWord(dailySeed) : getRandomWord();
    
    setGameState({
      ...WORDLE_INITIAL_STATE,
      secretWord,
      board: createBoard(),
    });
    setShowModal(false);
  };

  const getCellStatus = (cell) => {
    if (!cell.status) return "";
    switch (cell.status) {
      case "correct": return styles.correct;
      case "present": return styles.present;
      case "absent": return styles.absent;
      default: return "";
    }
  };

  const getKeyStatus = (key) => {
    return gameState.keyboardColors[key] || "";
  };

  const keyboardRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  return (
  <GamePageLayout>
    <GameHeader title="Wordle" />
    <WelcomeModal />
    <div className={styles.gameContent}>
        {/* Game Board */}
        <div className={styles.board}>
          {gameState.board.map((row, rowIndex) => (
            <div key={rowIndex} className={styles.row}>
              {row.map((cell, colIndex) => (
                <div
                  key={colIndex}
                  className={`${styles.cell} ${getCellStatus(cell)} ${
                    rowIndex === gameState.currentRow &&
                    colIndex === gameState.currentCol
                      ? styles.current
                      : ""
                  }`}
                >
                  {cell.value}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Settings Button */}
        <div className={styles.settingsContainer}>
          <button
            className={styles.settingsButton}
            onClick={() => setShowSettings(true)}
            title="Word List Settings"
          >
            ⚙️ Settings
          </button>
        </div>

        {/* Virtual Keyboard */}
        <div className={styles.keyboard}>
          {keyboardRows.map((row, rowIndex) => (
            <div key={rowIndex} className={styles.keyboardRow}>
              {rowIndex === 2 && (
                <button
                  className={`${styles.key} ${styles.specialKey}`}
                  onClick={submitGuess}
                  disabled={gameState.gameOver}
                >
                  Enter
                </button>
              )}
              {row.map((key) => (
                <button
                  key={key}
                  className={`${styles.key} ${getKeyStatus(key)}`}
                  onClick={() => inputLetter(key.toLowerCase())}
                  disabled={gameState.gameOver}
                >
                  {key}
                </button>
              ))}
              {rowIndex === 2 && (
                <button
                  className={`${styles.key} ${styles.specialKey}`}
                  onClick={deleteLetter}
                  disabled={gameState.gameOver}
                >
                  ←
                </button>
              )}
            </div>
          ))}
        </div>



        {/* Completion Modal */}
        {showModal && (
          <Modal
            open={showModal}
            onClose={() => setShowModal(false)}
            title={modalTitle}
          >
            <div style={{ whiteSpace: "pre-line", marginBottom: "20px" }}>
              {modalMessage}
            </div>
            <div slot="buttons">
              <button
                onClick={resetGame}
                style={{
                  backgroundColor: "#6aaa64",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Play Again
              </button>
            </div>
          </Modal>
        )}

        {/* Settings Modal */}
        {showSettings && (
          <Modal
            open={showSettings}
            onClose={() => setShowSettings(false)}
            title="Word List Settings"
          >
            <WordListSettings onClose={() => setShowSettings(false)} />
          </Modal>
        )}
      </div>
  </GamePageLayout>
);
};

export default Wordle;
