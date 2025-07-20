import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GamePageLayout from "../../components/game/GamePageLayout";
import GameHeader from "../../components/game/GameHeader";
import "./numberle-styles.css";
import numberleLogo from "./numberle-logo.svg";
import {
  setDailyProgress,
  getNumberleStats,
  setNumberleStats,
} from "../../utils/localStorage";
import useDailySeed from "../../hooks/useDailySeed";
import Modal from "../../components/ui/Modal";

// --- Numberle-specific logic ---
const NUMBERLE_INITIAL_STATE = {
  secretNumber: "",
  currentRow: 0,
  currentCol: 0,
  gameOver: false,
  gameWon: false,
  maxAttempts: 6,
  numberLength: 5,
  board: Array.from({ length: 6 }, () =>
    Array.from({ length: 5 }, () => ({ value: "", status: "" })),
  ),
  numberPadColors: {},
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

function generateSecretNumber() {
  let number;
  let attempts = 0;
  const maxAttempts = 200;
  do {
    number = "";
    const digitCounts = {};
    for (let i = 0; i < 5; i++) {
      let d;
      let tries = 0;
      do {
        d = Math.floor(Math.random() * 10);
        tries++;
      } while (digitCounts[d] >= 2 && Math.random() > 0.15 && tries < 10);
      number += d;
      digitCounts[d] = (digitCounts[d] || 0) + 1;
    }
    attempts++;
  } while (!isValidSecretNumber(number) && attempts < maxAttempts);
  return number;
}

function isValidSecretNumber(number) {
  const digitCounts = {};
  for (let digit of number) {
    digitCounts[digit] = (digitCounts[digit] || 0) + 1;
    if (digitCounts[digit] > 2) return false;
  }
  return true;
}

function createBoard() {
  return Array.from({ length: 6 }, () =>
    Array.from({ length: 5 }, () => ({ value: "", status: "" })),
  );
}

function getDailySecretNumber(dailySeed) {
  function seededRandom(seedStr) {
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
  }
  const rand = seededRandom(dailySeed);
  let number = "";
  const digitCounts = {};
  for (let i = 0; i < 5; i++) {
    let d;
    let tries = 0;
    do {
      d = Math.floor(rand() * 10);
      tries++;
    } while (digitCounts[d] >= 2 && tries < 10);
    number += d;
    digitCounts[d] = (digitCounts[d] || 0) + 1;
  }
  return number;
}



const Numberle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isDailyMode = searchParams.get("mode") === "daily";
  const today = new Date().toISOString().slice(0, 10);
  const dailySeed = useDailySeed({ date: today, slug: "numberle" });

  // Game state
  const [state, setState] = useState(() => ({
    ...NUMBERLE_INITIAL_STATE,
    secretNumber: isDailyMode
      ? getDailySecretNumber(dailySeed)
      : generateSecretNumber(),
    board: createBoard(),
  }));

  // Stats and daily state
  const [stats, setStats] = useState(() => getNumberleStats());
  const [showEndgameModal, setShowEndgameModal] = useState(false);
  const [endgameData, setEndgameData] = useState({ won: false, message: "" });
  const [message, setMessage] = useState("");
  const [winPromptIndex, setWinPromptIndex] = useState(0);

  // Game logic functions
  const inputNumber = (num) => {
    if (state.gameOver || state.currentCol >= state.numberLength) return;

    const newBoard = [...state.board];
    newBoard[state.currentRow][state.currentCol] = {
      value: num.toString(),
      status: "filled",
    };

    setState({
      ...state,
      board: newBoard,
      currentCol: state.currentCol + 1,
    });
  };

  const deleteNumber = () => {
    if (state.gameOver || state.currentCol === 0) return;

    const newBoard = [...state.board];
    newBoard[state.currentRow][state.currentCol - 1] = {
      value: "",
      status: "",
    };

    setState({
      ...state,
      board: newBoard,
      currentCol: state.currentCol - 1,
    });
  };

  const submitGuess = () => {
    if (state.gameOver || state.currentCol !== state.numberLength) return;

    const guess = state.board[state.currentRow]
      .map((tile) => tile.value)
      .join("");

    if (!isValidGuess(guess)) {
      setMessage("Please enter exactly 5 digits");
      return;
    }

    const feedback = evaluateGuess(guess, state.secretNumber);
    const newBoard = [...state.board];

    // Update board with feedback
    for (let i = 0; i < state.numberLength; i++) {
      newBoard[state.currentRow][i] = {
        ...newBoard[state.currentRow][i],
        status: feedback[i],
      };
    }

    // Update number pad colors
    const newNumberPadColors = { ...state.numberPadColors };
    for (let i = 0; i < state.numberLength; i++) {
      const digit = guess[i];
      const status = feedback[i];
      if (!newNumberPadColors[digit] || status === "correct") {
        newNumberPadColors[digit] = status;
      }
    }

    const isWon = guess === state.secretNumber;
    const isGameOver = isWon || state.currentRow === state.maxAttempts - 1;

    const newState = {
      ...state,
      board: newBoard,
      currentRow: isGameOver ? state.currentRow : state.currentRow + 1,
      currentCol: 0,
      gameOver: isGameOver,
      gameWon: isWon,
      numberPadColors: newNumberPadColors,
    };

    setState(newState);
    setMessage("");

    // Handle game completion
    if (isGameOver) {
      handleGameComplete(newState);
    }
  };

  const handleGameComplete = (gameState) => {
    setShowEndgameModal(true);
    setEndgameData({
      won: gameState.gameWon,
      message: winPrompts[winPromptIndex],
    });
    setWinPromptIndex((prev) => (prev + 1) % winPrompts.length);

    // Update stats
    const newStats = {
      ...stats,
      gamesPlayed: stats.gamesPlayed + 1,
      gamesWon: gameState.gameWon ? stats.gamesWon + 1 : stats.gamesWon,
      currentStreak: gameState.gameWon ? stats.currentStreak + 1 : 0,
      bestStreak: gameState.gameWon
        ? Math.max(stats.bestStreak, stats.currentStreak + 1)
        : stats.bestStreak,
    };
    setStats(newStats);
    setNumberleStats(newStats);

    // Daily mode: update localStorage streak
    if (isDailyMode && gameState.gameWon) {
      setDailyProgress("numberle", {
        date: today,
        completed: true,
        result: {},
      });
    }
  };

  const resetGame = () => {
    setState({
      ...NUMBERLE_INITIAL_STATE,
      secretNumber: isDailyMode
        ? getDailySecretNumber(dailySeed)
        : generateSecretNumber(),
      board: createBoard(),
    });
    setShowEndgameModal(false);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (state.gameOver) return;

    if (e.key >= "0" && e.key <= "9") {
      inputNumber(parseInt(e.key));
    } else if (e.key === "Enter") {
      submitGuess();
    } else if (e.key === "Backspace") {
      deleteNumber();
    }
  };

  // Validation function
  const isValidGuess = (guess) => {
    return guess.length === 5 && /^\d{5}$/.test(guess);
  };

  // Evaluation function
  const evaluateGuess = (guess, secretNumber) => {
    const feedback = Array(5).fill("absent");
    const secretCounts = {};

    // Count digits in secret number
    for (let i = 0; i < 5; i++) {
      secretCounts[secretNumber[i]] = (secretCounts[secretNumber[i]] || 0) + 1;
    }

    // First pass: mark correct digits
    for (let i = 0; i < 5; i++) {
      if (guess[i] === secretNumber[i]) {
        feedback[i] = "correct";
        secretCounts[guess[i]]--;
      }
    }

    // Second pass: mark present digits
    for (let i = 0; i < 5; i++) {
      if (feedback[i] === "correct") continue;
      if (secretCounts[guess[i]] > 0) {
        feedback[i] = "present";
        secretCounts[guess[i]]--;
      }
    }

    return feedback;
  };

  // Get current game status for screen readers
  const getGameStatus = () => {
    if (state.gameOver) {
      return state.gameWon 
        ? "Congratulations! You won the game!" 
        : `Game over. The number was ${state.secretNumber}`;
    }
    return `Attempt ${state.currentRow + 1} of ${state.maxAttempts}, ${state.currentCol} digits entered`;
  };

  return (
    <GamePageLayout>
      <GameHeader
        title="Numberle"
        subtitle="Guess the 5-digit number in 6 tries"
        logo={numberleLogo}
        onBack={() => navigate("/")}
      />

      <div 
        className="game-container" 
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="application"
        aria-label="Numberle game"
        aria-live="polite"
        aria-atomic="true"
      >
        {/* Screen reader status */}
        <div className="sr-only" aria-live="polite">
          {getGameStatus()}
        </div>

        <div className="board" role="grid" aria-label="Numberle game board">
          {state.board.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`row ${rowIndex === state.currentRow ? "current" : ""}`}
              role="row"
              aria-label={`Row ${rowIndex + 1}`}
            >
              {row.map((tile, colIndex) => (
                <div
                  key={colIndex}
                  className={`tile ${tile.status} ${
                    rowIndex === state.currentRow && colIndex === state.currentCol
                      ? "current"
                      : ""
                  }`}
                  role="gridcell"
                  aria-label={`Position ${colIndex + 1}, ${tile.value || "empty"}`}
                  tabIndex={0}
                >
                  {tile.value}
                </div>
              ))}
            </div>
          ))}
        </div>

        {message && (
          <div className="message" role="alert" aria-live="assertive">
            {message}
          </div>
        )}

        <div className="number-pad-container">
          <div 
            className="number-pad" 
            role="group" 
            aria-label="Number pad"
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                className={`number-btn ${state.numberPadColors[num] || ""}`}
                onClick={() => inputNumber(num)}
                disabled={state.gameOver}
                aria-label={`Enter digit ${num}`}
                tabIndex={0}
              >
                {num}
              </button>
            ))}
          </div>
          <div 
            className="action-buttons" 
            role="group" 
            aria-label="Action buttons"
          >
            <button
              className="action-btn"
              onClick={deleteNumber}
              disabled={state.gameOver}
              aria-label="Delete last digit"
              tabIndex={0}
            >
              ⌫
            </button>
            <button
              className={`action-btn ${state.currentCol === state.numberLength ? "active" : ""}`}
              onClick={submitGuess}
              disabled={
                state.gameOver || state.currentCol !== state.numberLength
              }
              aria-label="Submit guess"
              tabIndex={0}
            >
              Enter
            </button>
          </div>
        </div>
      </div>

      {/* Endgame Modal */}
      <Modal
        open={showEndgameModal}
        onClose={resetGame}
        title={state.gameWon ? "Congratulations!" : "Game Over"}
        className="endgame-modal"
        buttons={
          <div className="endgame-buttons">
            <button 
              className="playagain-btn" 
              onClick={resetGame}
              aria-label="Play again"
            >
              Play Again
            </button>
            <button 
              className="backhome-btn" 
              onClick={() => navigate("/")}
              aria-label="Back to games"
            >
              Back to Games
            </button>
          </div>
        }
      >
        <div className="endgame-content">
          <p className="endgame-message">{endgameData.message}</p>
        </div>
      </Modal>
    </GamePageLayout>
  );
};

export default Numberle;
