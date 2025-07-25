import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GamePageLayout from "../../components/game/GamePageLayout";
import GameInstructions from "../../components/game/GameInstructions";
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
import { getDailyWord, isValidGuess, getWordListStats, preloadValidGuesses, ANSWERS } from "../../data/wordleWordLists";
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
  
  for (let i = 0; i < guess.length; i++) {
    const letter = guess[i].toUpperCase();
    const status = evaluation[i];
    
    // Only update if the new status is "better" than existing
    if (!newColors[letter] || 
        (status === "correct") || 
        (status === "present" && newColors[letter] === "absent")) {
      newColors[letter] = status;
    }
  }
  
  return newColors;
}

function getRandomWord() {
  return ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
}

const Wordle = ({ mode, description, instructions }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const dailySeed = useDailySeed();
  const today = new Date().toDateString();
  
  const [gameState, setGameState] = useState(WORDLE_INITIAL_STATE);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [gameStatus, setGameStatus] = useState("");

  // Welcome modal hook
  const { WelcomeModal } = useWelcomeModal("wordle");

  // Initialize game
  useEffect(() => {
    const isDailyMode = mode === "daily";
    const secretWord = isDailyMode ? getDailyWord(dailySeed) : getRandomWord();
    
    const initialBoard = createBoard();
    
    setGameState({
      ...WORDLE_INITIAL_STATE,
      secretWord,
      board: initialBoard,
    });
    
    // Set initial game status for screen readers
    setGameStatus(`Wordle game started. ${isDailyMode ? 'Daily mode' : 'Practice mode'}. Guess the 5-letter word in 6 tries.`);
    
    // Preload valid guesses for better performance
    preloadValidGuesses();
  }, [mode, dailySeed]);

  // Update game status for screen readers
  useEffect(() => {
    if (gameState.gameOver) {
      const attempts = gameState.currentRow;
      const status = gameState.gameWon 
        ? `Congratulations! You won in ${attempts} ${attempts === 1 ? 'try' : 'tries'}!`
        : `Game over. The word was ${gameState.secretWord.toUpperCase()}.`;
      setGameStatus(status);
    } else {
      const currentAttempt = gameState.currentRow + 1;
      const status = `Attempt ${currentAttempt} of 6. ${gameState.currentCol === 0 ? 'Enter your guess.' : `Current guess: ${gameState.board[gameState.currentRow].map(cell => cell.value || 'empty').join(' ')}`}`;
      setGameStatus(status);
    }
  }, [gameState.currentRow, gameState.currentCol, gameState.gameOver, gameState.gameWon, gameState.secretWord, gameState.board]);

  // Memoized game functions to prevent stale closures
  const inputLetter = useCallback((letter) => {
    
    setGameState((prev) => {
      
      if (prev.gameOver || prev.currentCol >= 5) {
        return prev;
      }
      
      const newBoard = [...prev.board];
      newBoard[prev.currentRow][prev.currentCol] = { value: letter, status: "" };
      
      const newState = {
        ...prev,
        board: newBoard,
        currentCol: prev.currentCol + 1,
      };
      
      return newState;
    });
  }, []);

  const deleteLetter = useCallback(() => {
    setGameState((prev) => {
      if (prev.gameOver || prev.currentCol === 0) return prev;
      
      const newBoard = [...prev.board];
      newBoard[prev.currentRow][prev.currentCol - 1] = { value: "", status: "" };
      
      return {
        ...prev,
        board: newBoard,
        currentCol: prev.currentCol - 1,
      };
    });
  }, []);

  const submitGuess = useCallback(async () => {
    const currentState = gameState;
    if (currentState.gameOver || currentState.currentCol !== 5) return;
    
    const guess = currentState.board[currentState.currentRow].map(cell => cell.value).join("");
    
    // Check if word is valid (async)
    const isValid = await isValidGuess(guess);
    if (!isValid) {
      showToast("Invalid Word", { 
        type: "error", 
        position: "top",
        duration: 2000 
      });
      return;
    }
    
    // Process the valid guess
    setGameState(prev => {
      const evaluation = evaluateGuess(guess, prev.secretWord);
      
      const newBoard = [...prev.board];
      newBoard[prev.currentRow] = newBoard[prev.currentRow].map((cell, index) => ({
        ...cell,
        status: evaluation[index],
      }));
      
      const newKeyboardColors = updateKeyboardColors(prev.keyboardColors, guess, evaluation);
      
      const gameWon = evaluation.every(status => status === "correct");
      const gameOver = gameWon || prev.currentRow === 5;
      
      // Update stats if daily mode
      if (mode === "daily") {
        const stats = getWordleStats();
        const newStats = {
          gamesPlayed: stats.gamesPlayed + 1,
          gamesWon: stats.gamesWon + (gameWon ? 1 : 0),
          currentStreak: gameWon ? stats.currentStreak + 1 : 0,
          bestStreak: gameWon ? Math.max(stats.bestStreak, stats.currentStreak + 1) : stats.bestStreak,
        };
        setWordleStats(newStats);
        setDailyProgress("wordle", today, gameWon);
      }
      
      return {
        ...prev,
        board: newBoard,
        keyboardColors: newKeyboardColors,
        currentRow: prev.currentRow + 1,
        currentCol: 0,
        gameOver,
        gameWon,
      };
    });
  }, [gameState, mode, today, showToast]);

  const handleGameComplete = useCallback((finalGameState) => {
    const attempts = finalGameState.currentRow;
    const stats = getWordleStats();
    const newStats = {
      gamesPlayed: stats.gamesPlayed,
      gamesWon: stats.gamesWon,
      currentStreak: stats.currentStreak,
      bestStreak: stats.bestStreak,
    };
    
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
  }, [mode, today]);

  // Watch for game completion and trigger modal
  useEffect(() => {
    if (gameState.gameOver) {
      // Add a small delay to ensure the board animation completes
      const timer = setTimeout(() => {
        handleGameComplete(gameState);
      }, 1000); // 1 second delay to show the final guess animation
      
      return () => clearTimeout(timer);
    }
  }, [gameState.gameOver, gameState.gameWon, handleGameComplete]);

  // Handle keyboard input
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
  }, [inputLetter, deleteLetter, submitGuess]);

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
    const status = gameState.keyboardColors[key] || "";
    return status;
  };

  const getCellAriaLabel = (cell, rowIndex, colIndex) => {
    const position = `Position ${colIndex + 1} in row ${rowIndex + 1}`;
    const value = cell.value || 'empty';
    const status = cell.status ? `, ${cell.status}` : '';
    return `${position}, ${value}${status}`;
  };

  const keyboardRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  return (
    <GamePageLayout>
      <GameInstructions description={description} instructions={instructions} />
      <WelcomeModal />
      
      {/* Screen reader status announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }}
      >
        {gameStatus}
      </div>
      
      <div className={styles.gameContent}>
        {/* Game Board */}
        <div 
          className={styles.board}
          role="grid"
          aria-label="Wordle game board"
        >
          {gameState.board.map((row, rowIndex) => (
            <div 
              key={rowIndex} 
              className={styles.row}
              role="row"
              aria-label={`Row ${rowIndex + 1}`}
            >
              {row.map((cell, colIndex) => {
                return (
                  <div
                    key={colIndex}
                    className={`${styles.cell} ${getCellStatus(cell)} ${
                      rowIndex === gameState.currentRow &&
                      colIndex === gameState.currentCol
                        ? styles.current
                        : ""
                    }`}
                    role="gridcell"
                    aria-label={getCellAriaLabel(cell, rowIndex, colIndex)}
                    aria-current={rowIndex === gameState.currentRow && colIndex === gameState.currentCol ? "true" : undefined}
                  >
                    {cell.value}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Settings Button */}
        <div className={styles.settingsContainer}>
          <button
            className={styles.settingsButton}
            onClick={() => setShowSettings(true)}
            aria-label="Word list settings"
            title="Word List Settings"
          >
            ⚙️ Settings
          </button>
        </div>

        {/* Virtual Keyboard */}
        <div 
          className={styles.keyboard}
          role="group"
          aria-label="Virtual keyboard"
        >
          {keyboardRows.map((row, rowIndex) => (
            <div 
              key={rowIndex} 
              className={styles.keyboardRow}
              role="group"
              aria-label={`Keyboard row ${rowIndex + 1}`}
            >
              {rowIndex === 2 && (
                <button
                  className={`${styles.key} ${styles.specialKey}`}
                  onClick={submitGuess}
                  disabled={gameState.gameOver}
                  aria-label="Submit guess"
                >
                  Enter
                </button>
              )}
              {row.map((key) => (
                <button
                  key={key}
                  className={`${styles.key} ${getKeyStatus(key) ? styles[getKeyStatus(key)] : ''}`}
                  onClick={() => {
                    inputLetter(key.toLowerCase());
                  }}
                  disabled={gameState.gameOver}
                  aria-label={`Input letter ${key}`}
                >
                  {key}
                </button>
              ))}
              {rowIndex === 2 && (
                <button
                  className={`${styles.key} ${styles.specialKey}`}
                  onClick={deleteLetter}
                  disabled={gameState.gameOver}
                  aria-label="Delete last letter"
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
                aria-label="Play again"
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