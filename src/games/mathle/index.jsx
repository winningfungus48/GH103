import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GamePageLayout from "../../components/game/GamePageLayout";
import styles from "./mathle-styles.module.css";
import {
  getMathleStats,
  setMathleStats,
} from "../../utils/localStorage";
import useDailySeed from "../../hooks/useDailySeed";
import useWelcomeModal from "../../hooks/useWelcomeModal.jsx";
import Modal from "../../components/ui/Modal";

// Mathle-specific logic
const MATHLE_INITIAL_STATE = {
  secretEquation: "",
  secretResult: 0,
  currentRow: 0,
  currentCol: 0,
  gameOver: false,
  gameWon: false,
  maxAttempts: 6,
  equationLength: 8,
  board: Array.from({ length: 6 }, () =>
    Array.from({ length: 8 }, () => ({ value: "", status: "" })),
  ),
  numberPadColors: {},
};

const OPERATORS = ["+", "-", "*", "/", "="];
const NUMBERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const winPrompts = [
  "Mathematical Master!",
  "Equation Expert!",
  "Number Ninja!",
  "Calculation Champion!",
  "Math Wizard!",
  "Problem Solver!",
  "Arithmetic Ace!",
  "Formula Finder!",
];

function generateSecretEquation(seed) {
  const rng = (() => {
    let state = seed;
    return () => {
      state = (state * 9301 + 49297) % 233280;
      return state / 233280;
    };
  })();

  // Generate 8-character equations similar to the original Numberle logic
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
  
  const equation = equations[Math.floor(rng() * equations.length)];
  
  // Calculate the result
  const evalEquation = equation.replace(/=/g, '===').replace(/\*/g, '*').replace(/\//g, '/');
  const leftSide = equation.split('=')[0];
  const result = Function(`'use strict'; return (${leftSide})`)();
  
  return { equation, result };
}

function evaluateEquation(equation) {
  try {
    // Split by equals sign and evaluate the left side
    const leftSide = equation.split('=')[0];
    // Use Function constructor instead of eval for better security
    return Function(`'use strict'; return (${leftSide})`)();
  } catch {
    return null;
  }
}

function checkGuess(guess, secretEquation, secretResult) {
  const result = [];
  
  // Check if the equation evaluates correctly
  const guessResult = evaluateEquation(guess);
  const isCorrect = guess === secretEquation;
  const evaluatesCorrectly = guessResult === secretResult;
  
  // Check each character
  for (let i = 0; i < guess.length; i++) {
    const guessChar = guess[i];
    const secretChar = secretEquation[i];
    
    if (guessChar === secretChar) {
      result.push({ value: guessChar, status: "correct" });
    } else if (secretEquation.includes(guessChar)) {
      result.push({ value: guessChar, status: "present" });
    } else {
      result.push({ value: guessChar, status: "absent" });
    }
  }
  
  return { result, isCorrect, evaluatesCorrectly };
}

const Mathle = ({ instructions }) => {
  const navigate = useNavigate();
  const dailySeed = useDailySeed();
  const [state, setState] = useState(MATHLE_INITIAL_STATE);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});

  // Welcome modal
  const { WelcomeModal, gameContainerRef } = useWelcomeModal("Mathle", instructions);

  // Initialize game with daily seed
  useEffect(() => {
    if (dailySeed !== null) {
      const { equation, result } = generateSecretEquation(dailySeed);
      console.log('Generated secret equation:', equation, 'result:', result);
      setState((prev) => ({
        ...prev,
        secretEquation: equation,
        secretResult: result,
      }));
    }
  }, [dailySeed]);



  const inputValue = (value) => {
    if (state.gameOver || state.currentCol >= state.equationLength) {
      return;
    }

    setState((prev) => {
      const newBoard = [...prev.board];
      newBoard[prev.currentRow][prev.currentCol] = { value, status: "" };
      return {
        ...prev,
        board: newBoard,
        currentCol: prev.currentCol + 1,
      };
    });
  };

  const deleteValue = () => {
    if (state.currentCol === 0) return;

    setState((prev) => {
      const newBoard = [...prev.board];
      newBoard[prev.currentRow][prev.currentCol - 1] = { value: "", status: "" };
      return {
        ...prev,
        board: newBoard,
        currentCol: prev.currentCol - 1,
      };
    });
  };

  const submitGuess = () => {
    if (state.currentCol !== state.equationLength) return;

    const currentGuess = state.board[state.currentRow]
      .map((tile) => tile.value)
      .join("");

    if (currentGuess.length !== state.equationLength) return;

    // Validate equation format - must be exactly 8 characters with no spaces
    const equationPattern = /^[\d+\-*/]{7}=\d{1}$/;
    if (!equationPattern.test(currentGuess)) {
      setMessage("Invalid equation format! Must be exactly 8 characters (e.g., 1+2*3=7)");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    console.log('Current guess:', currentGuess);
    console.log('Secret equation:', state.secretEquation);
    console.log('Secret result:', state.secretResult);
    
    const { result, isCorrect, evaluatesCorrectly } = checkGuess(
      currentGuess,
      state.secretEquation,
      state.secretResult
    );
    
    console.log('Check result:', result);
    console.log('Is correct:', isCorrect);
    console.log('Evaluates correctly:', evaluatesCorrectly);

    const newBoard = [...state.board];
    newBoard[state.currentRow] = result;

    // Update number pad colors
    const newNumberPadColors = { ...state.numberPadColors };
    result.forEach((tile) => {
      if (tile.value) {
        newNumberPadColors[tile.value] = tile.status;
      }
    });

    const isWon = isCorrect;
    const isGameOver = isWon || state.currentRow === state.maxAttempts - 1;

    setState((prev) => ({
      ...prev,
      board: newBoard,
      currentRow: prev.currentRow + 1,
      currentCol: 0,
      gameOver: isGameOver,
      gameWon: isWon,
      numberPadColors: newNumberPadColors,
    }));

    if (isGameOver) {
      handleGameEnd(isWon, evaluatesCorrectly);
    }
  };

  const handleGameEnd = (won, evaluatesCorrectly) => {
    const stats = getMathleStats();
    const newStats = {
      ...stats,
      gamesPlayed: stats.gamesPlayed + 1,
      gamesWon: stats.gamesWon + (won ? 1 : 0),
      currentStreak: won ? stats.currentStreak + 1 : 0,
      maxStreak: won ? Math.max(stats.maxStreak, stats.currentStreak + 1) : stats.maxStreak,
    };
    setMathleStats(newStats);

    const winPrompt = winPrompts[Math.floor(Math.random() * winPrompts.length)];
    let message = won
      ? `You found the equation in ${state.currentRow + 1} tries!`
      : `The equation was: ${state.secretEquation}`;
    
    if (!won && !evaluatesCorrectly) {
      message += " (Your equation didn't evaluate correctly)";
    }

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
    setState(MATHLE_INITIAL_STATE);
    setMessage("");
  };

  // Keyboard event handler
  const handleKeyDown = (e) => {
    if (state.gameOver) return;

    // Debug logging
    console.log('Mathle keydown:', e.key, 'Focus element:', document.activeElement);

    // Number input
    if (e.key >= "0" && e.key <= "9") {
      inputValue(e.key);
    }
    // Operator input
    else if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/" || e.key === "=") {
      inputValue(e.key);
    }
    // Special keys
    else if (e.key === "Enter") {
      submitGuess();
    } else if (e.key === "Backspace") {
      deleteValue();
    }
  };

  return (
    <GamePageLayout>
      
      <div 
        className={styles.container}
        ref={gameContainerRef}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="application"
        aria-label="Mathle game"
        aria-live="polite"
        aria-atomic="true"
        style={{ outline: '2px solid transparent' }}
        onFocus={(e) => e.target.style.outline = '2px solid #007bff'}
        onBlur={(e) => e.target.style.outline = '2px solid transparent'}
      >


        {/* Screen reader status */}
        <div className="sr-only" aria-live="polite">
          {state.gameOver 
            ? (state.gameWon 
                ? "Congratulations! You won the game!" 
                : `Game over. The equation was ${state.secretEquation}`)
            : `Attempt ${state.currentRow + 1} of ${state.maxAttempts}, ${state.currentCol} characters entered`
          }
        </div>

        <div className={styles.board} role="grid" aria-label="Mathle game board">
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
          <div className={styles.message} role="alert" aria-live="assertive">
            {message}
          </div>
        )}

        <div className={styles.numberPadContainer}>
          <div className={styles.numberPad} role="group" aria-label="Number pad">
            {NUMBERS.map((num) => (
              <button
                key={num}
                className={`${styles.numberBtn} ${state.numberPadColors[num] || ""}`}
                onClick={() => inputValue(num)}
                disabled={state.gameOver}
                aria-label={`Enter digit ${num}`}
                tabIndex={0}
              >
                {num}
              </button>
            ))}
          </div>
          <div className={styles.operatorPad} role="group" aria-label="Operator pad">
            <button
              className={`${styles.operatorBtn} ${state.numberPadColors["+"] || ""}`}
              onClick={() => inputValue("+")}
              disabled={state.gameOver}
              aria-label="Enter plus operator"
              tabIndex={0}
            >
              +
            </button>
            <button
              className={`${styles.operatorBtn} ${state.numberPadColors["-"] || ""}`}
              onClick={() => inputValue("-")}
              disabled={state.gameOver}
              aria-label="Enter minus operator"
              tabIndex={0}
            >
              -
            </button>
            <button
              className={`${styles.operatorBtn} ${state.numberPadColors["*"] || ""}`}
              onClick={() => inputValue("*")}
              disabled={state.gameOver}
              aria-label="Enter multiply operator"
              tabIndex={0}
            >
              *
            </button>
            <button
              className={`${styles.operatorBtn} ${state.numberPadColors["/"] || ""}`}
              onClick={() => inputValue("/")}
              disabled={state.gameOver}
              aria-label="Enter divide operator"
              tabIndex={0}
            >
              /
            </button>
            <button
              className={`${styles.operatorBtn} ${state.numberPadColors["="] || ""}`}
              onClick={() => inputValue("=")}
              disabled={state.gameOver}
              aria-label="Enter equals sign"
              tabIndex={0}
            >
              =
            </button>
          </div>
          <div className={styles.actionButtons} role="group" aria-label="Action buttons">
            <button
              className={styles.actionBtn}
              onClick={deleteValue}
              disabled={state.gameOver}
              aria-label="Delete last character"
              tabIndex={0}
            >
              ⌫
            </button>
            <button
              className={`${styles.actionBtn} ${state.currentCol === state.equationLength ? styles.active : ""}`}
              onClick={submitGuess}
              disabled={state.gameOver || state.currentCol !== state.equationLength}
              aria-label="Submit equation"
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

export default Mathle; 