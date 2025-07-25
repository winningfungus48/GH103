import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GamePageLayout from "../../components/game/GamePageLayout";
import "./numberle-styles.css";
import numberleLogo from "./numberle-logo.svg";
import {
  setDailyProgress,
  getNumberleStats,
  setNumberleStats,
} from "../../utils/localStorage";
import useDailySeed from "../../hooks/useDailySeed";
import useWelcomeModal from "../../hooks/useWelcomeModal.jsx";
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
  keypadColors: {},
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

// Generate a random 5-digit number
function generateSecretNumber() {
  return Math.floor(Math.random() * 100000).toString().padStart(5, '0');
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
  return Math.floor(rand() * 100000).toString().padStart(5, '0');
}

// Validate if a string is a valid 5-digit number
function isValidNumber(number) {
  return /^\d{5}$/.test(number);
}

const Numberle = ({ mode: _mode, description: _description, instructions }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isDailyMode = searchParams.get("mode") === "daily";
  const today = new Date().toISOString().slice(0, 10);
  const dailySeed = useDailySeed({ date: today, slug: "numberle" });

  // Game state
  const [state, setState] = useState(() => {
    const secretNumber = isDailyMode && dailySeed
      ? getDailySecretNumber(dailySeed)
      : generateSecretNumber();
    
    return {
      ...NUMBERLE_INITIAL_STATE,
      secretNumber,
      board: createBoard(),
    };
  });

  // Stats and daily state
  const [stats, setStats] = useState(() => getNumberleStats());
  const [showEndgameModal, setShowEndgameModal] = useState(false);
  const [endgameData, setEndgameData] = useState({ won: false, message: "" });
  const [message, setMessage] = useState("");
  const [winPromptIndex, setWinPromptIndex] = useState(0);

  // Welcome modal
  const { WelcomeModal, gameContainerRef } = useWelcomeModal("Numberle", instructions);

  // Update secret number when daily seed changes (for daily mode)
  useEffect(() => {
    if (isDailyMode && dailySeed && state.secretNumber !== getDailySecretNumber(dailySeed)) {
      setState(prev => ({
        ...prev,
        secretNumber: getDailySecretNumber(dailySeed),
      }));
    }
  }, [isDailyMode, dailySeed, state.secretNumber]);

  // Game logic functions
  const inputCharacter = (char) => {
    if (state.gameOver || state.currentCol >= state.numberLength) {
      return;
    }

    const newBoard = [...state.board];
    newBoard[state.currentRow][state.currentCol] = {
      value: char,
      status: "filled",
    };

    setState({
      ...state,
      board: newBoard,
      currentCol: state.currentCol + 1,
    });
  };

  const deleteCharacter = () => {
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

    console.log("Submitting guess:", guess);
    console.log("Secret number:", state.secretNumber);

    if (!isValidNumber(guess)) {
      setMessage("Please enter a valid 5-digit number");
      return;
    }

    const feedback = evaluateGuess(guess, state.secretNumber);
    console.log("Feedback:", feedback);
    
    const newBoard = [...state.board];

    // Update board with feedback
    for (let i = 0; i < state.numberLength; i++) {
      newBoard[state.currentRow][i] = {
        ...newBoard[state.currentRow][i],
        status: feedback[i],
      };
    }

    // Update keypad colors
    const newKeypadColors = { ...state.keypadColors };
    for (let i = 0; i < state.numberLength; i++) {
      const char = guess[i];
      const status = feedback[i];
      if (!newKeypadColors[char] || status === "correct") {
        newKeypadColors[char] = status;
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
      keypadColors: newKeypadColors,
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
      inputCharacter(e.key);
    } else if (e.key === "Enter") {
      submitGuess();
    } else if (e.key === "Backspace") {
      deleteCharacter();
    }
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
      <WelcomeModal />

      <div 
        className="game-container" 
        ref={gameContainerRef}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="application"
        aria-label="Numberle game"
        aria-live="polite"
        aria-atomic="true"
        style={{ outline: '2px solid transparent' }}
        onFocus={(e) => e.target.style.outline = '2px solid #007bff'}
        onBlur={(e) => e.target.style.outline = '2px solid transparent'}
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

        <div className="keypad-container">
          {/* Numbers row */}
          <div 
            className="number-row" 
            role="group" 
            aria-label="Number keys"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
              <button
                key={num}
                className={`key-btn number-btn ${state.keypadColors[num] || ""}`}
                onClick={() => inputCharacter(num.toString())}
                disabled={state.gameOver}
                aria-label={`Enter digit ${num}`}
                tabIndex={0}
              >
                {num}
              </button>
            ))}
          </div>
          
          {/* Action buttons row */}
          <div 
            className="action-row" 
            role="group" 
            aria-label="Action keys"
          >
            <button
              className="key-btn action-btn"
              onClick={deleteCharacter}
              disabled={state.gameOver}
              aria-label="Delete last digit"
              tabIndex={0}
            >
              ⌫
            </button>
            <button
              className={`key-btn action-btn ${state.currentCol === state.numberLength ? "active" : ""}`}
              onClick={submitGuess}
              disabled={
                state.gameOver || state.currentCol !== state.numberLength
              }
              aria-label="Submit number"
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
          {!state.gameWon && (
            <p className="endgame-equation">The number was: {state.secretNumber}</p>
          )}
        </div>
      </Modal>
    </GamePageLayout>
  );
};

export default Numberle;
