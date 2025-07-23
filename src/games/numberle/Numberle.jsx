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
  secretEquation: "",
  currentRow: 0,
  currentCol: 0,
  gameOver: false,
  gameWon: false,
  maxAttempts: 6,
  equationLength: 8,
  board: Array.from({ length: 6 }, () =>
    Array.from({ length: 8 }, () => ({ value: "", status: "" })),
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

// Valid math operators
const OPERATORS = ['+', '-', '*', '/', '='];

// Generate a valid math equation
function generateSecretEquation() {
  const equations = [
    "1+2*3=7",
    "4+5-2=7", 
    "3*4/2=6",
    "8-3+1=6",
    "2*3+1=7",
    "9-4*1=5",
    "6/2+3=6",
    "5+1*2=7",
    "7-2+1=6",
    "4*2-1=7"
  ];
  
  return equations[Math.floor(Math.random() * equations.length)];
}

function createBoard() {
  return Array.from({ length: 6 }, () =>
    Array.from({ length: 8 }, () => ({ value: "", status: "" })),
  );
}

function getDailySecretEquation(dailySeed) {
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
  
  const equations = [
    "1+2*3=7",
    "4+5-2=7", 
    "3*4/2=6",
    "8-3+1=6",
    "2*3+1=7",
    "9-4*1=5",
    "6/2+3=6",
    "5+1*2=7",
    "7-2+1=6",
    "4*2-1=7"
  ];
  
  const rand = seededRandom(dailySeed);
  return equations[Math.floor(rand() * equations.length)];
}

// Validate if a string is a valid math equation
function isValidEquation(equation) {
  try {
    // Check if it contains exactly one '='
    if ((equation.match(/=/g) || []).length !== 1) {
      return false;
    }
    
    // Split by '=' and check both sides
    const parts = equation.split('=');
    if (parts.length !== 2) return false;
    
    const leftSide = parts[0];
    const rightSide = parts[1];
    
    // Check if right side is a valid integer (allows leading zeros)
    if (!/^\d+$/.test(rightSide)) {
      return false;
    }
    
    // Convert to number and check if it's a valid integer
    const rightSideNum = parseInt(rightSide, 10);
    if (isNaN(rightSideNum) || !Number.isInteger(rightSideNum)) {
      return false;
    }
    
    // Check if left side contains only valid characters
    if (!/^[\d+\-*/]+$/.test(leftSide)) {
      return false;
    }
    
    // Safely evaluate the left side using Function constructor (safer than eval)
    const calculateResult = new Function('return ' + leftSide);
    const result = calculateResult();
    
    if (isNaN(result) || !Number.isInteger(result)) {
      return false;
    }
    
    // Check if the equation is true
    return result === rightSideNum;
  } catch (error) {
    return false;
  }
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
    const secretEquation = isDailyMode && dailySeed
      ? getDailySecretEquation(dailySeed)
      : generateSecretEquation();
    
    return {
      ...NUMBERLE_INITIAL_STATE,
      secretEquation,
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

  // Update secret equation when daily seed changes (for daily mode)
  useEffect(() => {
    if (isDailyMode && dailySeed && state.secretEquation !== getDailySecretEquation(dailySeed)) {
      setState(prev => ({
        ...prev,
        secretEquation: getDailySecretEquation(dailySeed),
      }));
    }
  }, [isDailyMode, dailySeed, state.secretEquation]);

  // Game logic functions
  const inputCharacter = (char) => {
    if (state.gameOver || state.currentCol >= state.equationLength) {
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
    if (state.gameOver || state.currentCol !== state.equationLength) return;

    const guess = state.board[state.currentRow]
      .map((tile) => tile.value)
      .join("");

    console.log("Submitting guess:", guess);
    console.log("Secret equation:", state.secretEquation);

    if (!isValidEquation(guess)) {
      setMessage("Please enter a valid equation (e.g., 1+2*3=7)");
      return;
    }

    const feedback = evaluateGuess(guess, state.secretEquation);
    console.log("Feedback:", feedback);
    
    const newBoard = [...state.board];

    // Update board with feedback
    for (let i = 0; i < state.equationLength; i++) {
      newBoard[state.currentRow][i] = {
        ...newBoard[state.currentRow][i],
        status: feedback[i],
      };
    }

    // Update keypad colors
    const newKeypadColors = { ...state.keypadColors };
    for (let i = 0; i < state.equationLength; i++) {
      const char = guess[i];
      const status = feedback[i];
      if (!newKeypadColors[char] || status === "correct") {
        newKeypadColors[char] = status;
      }
    }

    const isWon = guess === state.secretEquation;
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
      secretEquation: isDailyMode
        ? getDailySecretEquation(dailySeed)
        : generateSecretEquation(),
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
    } else if (["+", "-", "*", "/", "="].includes(e.key)) {
      inputCharacter(e.key);
    }
  };

  // Evaluation function
  const evaluateGuess = (guess, secretEquation) => {
    const feedback = Array(8).fill("absent");
    const secretCounts = {};

    // Count characters in secret equation
    for (let i = 0; i < 8; i++) {
      secretCounts[secretEquation[i]] = (secretCounts[secretEquation[i]] || 0) + 1;
    }

    // First pass: mark correct characters
    for (let i = 0; i < 8; i++) {
      if (guess[i] === secretEquation[i]) {
        feedback[i] = "correct";
        secretCounts[guess[i]]--;
      }
    }

    // Second pass: mark present characters
    for (let i = 0; i < 8; i++) {
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
        : `Game over. The equation was ${state.secretEquation}`;
    }
    return `Attempt ${state.currentRow + 1} of ${state.maxAttempts}, ${state.currentCol} characters entered`;
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
          
          {/* Operators and action buttons row */}
          <div 
            className="action-row" 
            role="group" 
            aria-label="Operator and action keys"
          >
            <button
              className="key-btn action-btn"
              onClick={deleteCharacter}
              disabled={state.gameOver}
              aria-label="Delete last character"
              tabIndex={0}
            >
              ⌫
            </button>
            {OPERATORS.map((op) => (
              <button
                key={op}
                className={`key-btn operator-btn ${state.keypadColors[op] || ""}`}
                onClick={() => inputCharacter(op)}
                disabled={state.gameOver}
                aria-label={`Enter operator ${op}`}
                tabIndex={0}
              >
                {op}
              </button>
            ))}
            <button
              className={`key-btn action-btn ${state.currentCol === state.equationLength ? "active" : ""}`}
              onClick={submitGuess}
              disabled={
                state.gameOver || state.currentCol !== state.equationLength
              }
              aria-label="Submit equation"
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
            <p className="endgame-equation">The equation was: {state.secretEquation}</p>
          )}
        </div>
      </Modal>
    </GamePageLayout>
  );
};

export default Numberle;
