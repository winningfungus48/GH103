import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GamePageLayout from '../../components/game/GamePageLayout';
import GameHeader from '../../components/game/GameHeader';
import './numberle-styles.css';
import numberleLogo from './numberle-logo.svg';
import { getDailyProgress, setDailyProgress, getDailyStreak, getNumberleStats, setNumberleStats } from '../../utils/localStorage';
import useDailySeed from '../../hooks/useDailySeed';
import Modal from '../../components/ui/Modal';

// --- Numberle-specific logic ---
const NUMBERLE_INITIAL_STATE = {
  secretNumber: '',
  currentRow: 0,
  currentCol: 0,
  gameOver: false,
  gameWon: false,
  maxAttempts: 6,
  numberLength: 5,
  board: Array.from({ length: 6 }, () => Array.from({ length: 5 }, () => ({ value: '', status: '' }))),
  numberPadColors: {},
};

const winPrompts = [
  'Great Job!', 'Awesome!', 'You did it!', 'Impressive!', 'Fantastic!',
  'Well done!', 'You cracked it!', 'Brilliant!', 'Superb!', 'You nailed it!'
];

function generateSecretNumber() {
  let number;
  let attempts = 0;
  const maxAttempts = 200;
  do {
    number = '';
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
  return Array.from({ length: 6 }, () => Array.from({ length: 5 }, () => ({ value: '', status: '' })));
}

function getDailySecretNumber(dailySeed) {
  function seededRandom(seedStr) {
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
      hash = ((hash << 5) - hash) + seedStr.charCodeAt(i);
      hash |= 0;
    }
    let x = Math.abs(hash) / 2147483647;
    return () => {
      x = Math.sin(x * 10000) * 10000;
      return x - Math.floor(x);
    };
  }
  const rand = seededRandom(dailySeed);
  let number = '';
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

function getFeedback(state, guess) {
  const feedback = [];
  const secret = state.secretNumber;
  const secretCounts = {};
  const guessCounts = {};
  for (let digit of secret) {
    secretCounts[digit] = (secretCounts[digit] || 0) + 1;
  }
  for (let i = 0; i < 5; i++) {
    if (guess[i] === secret[i]) {
      feedback[i] = 'correct';
      secretCounts[guess[i]]--;
      guessCounts[guess[i]] = (guessCounts[guess[i]] || 0) + 1;
    }
  }
  for (let i = 0; i < 5; i++) {
    if (feedback[i] === 'correct') continue;
    if (secretCounts[guess[i]] > 0) {
      feedback[i] = 'present';
      secretCounts[guess[i]]--;
      guessCounts[guess[i]] = (guessCounts[guess[i]] || 0) + 1;
    } else {
      feedback[i] = 'absent';
    }
  }
  return feedback;
}

const Numberle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isDailyMode = searchParams.get('mode') === 'daily';
  const today = new Date().toISOString().slice(0, 10);
  const dailySeed = useDailySeed({ date: today, slug: 'numberle' });

  // Game state
  const [state, setState] = useState(() => ({
    ...NUMBERLE_INITIAL_STATE,
    secretNumber: isDailyMode ? getDailySecretNumber(dailySeed) : generateSecretNumber(),
    board: createBoard(),
  }));

  // Stats and daily state
  const [stats, setStats] = useState(() => getNumberleStats());
  const [dailyCompleted, setDailyCompleted] = useState(false);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [showEndgameModal, setShowEndgameModal] = useState(false);
  const [endgameData, setEndgameData] = useState({ won: false, message: '' });
  const [message, setMessage] = useState('');
  const [winPromptIndex, setWinPromptIndex] = useState(0);

  // Game logic functions
  const inputNumber = (num) => {
    if (state.gameOver || state.currentCol >= state.numberLength) return;
    
    const newBoard = [...state.board];
    newBoard[state.currentRow][state.currentCol] = { value: num.toString(), status: 'filled' };
    
    setState({
      ...state,
      board: newBoard,
      currentCol: state.currentCol + 1
    });
  };

  const deleteNumber = () => {
    if (state.gameOver || state.currentCol === 0) return;
    
    const newBoard = [...state.board];
    newBoard[state.currentRow][state.currentCol - 1] = { value: '', status: '' };
    
    setState({
      ...state,
      board: newBoard,
      currentCol: state.currentCol - 1
    });
  };

  const submitGuess = () => {
    if (state.gameOver || state.currentCol !== state.numberLength) return;
    
    const guess = state.board[state.currentRow].map(tile => tile.value).join('');
    if (guess.length !== 5) {
      setMessage('Please enter exactly 5 digits');
      return;
    }
    
    const feedback = getFeedback(state, guess);
    const newBoard = [...state.board];
    
    // Update board with feedback
    for (let i = 0; i < 5; i++) {
      newBoard[state.currentRow][i] = { 
        value: guess[i], 
        status: feedback[i] 
      };
    }
    
    // Update number pad colors
    const newNumberPadColors = { ...state.numberPadColors };
    for (let i = 0; i < 5; i++) {
      const digit = guess[i];
      const status = feedback[i];
      if (!newNumberPadColors[digit] || status === 'correct') {
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
      numberPadColors: newNumberPadColors
    };
    
    setState(newState);
    setMessage('');
    
    // Handle game completion
    if (isGameOver) {
      handleGameComplete(newState);
    }
  };

  const handleGameComplete = (gameState) => {
    setShowEndgameModal(true);
    setEndgameData({
      won: gameState.gameWon,
      message: winPrompts[winPromptIndex]
    });
    setWinPromptIndex((prev) => (prev + 1) % winPrompts.length);
    
    // Update stats
    const newStats = {
      ...stats,
      gamesPlayed: stats.gamesPlayed + 1,
      gamesWon: gameState.gameWon ? stats.gamesWon + 1 : stats.gamesWon,
      currentStreak: gameState.gameWon ? stats.currentStreak + 1 : 0,
      bestStreak: gameState.gameWon ? Math.max(stats.bestStreak, stats.currentStreak + 1) : stats.bestStreak
    };
    setStats(newStats);
    setNumberleStats(newStats);
    
    // Daily mode: update localStorage streak
    if (isDailyMode && gameState.gameWon) {
      setDailyProgress('numberle', { date: today, completed: true, result: {} });
      setDailyCompleted(true);
      setDailyStreak(getDailyStreak('numberle'));
    }
  };

  const resetGame = () => {
    const newSecretNumber = isDailyMode ? getDailySecretNumber(dailySeed) : generateSecretNumber();
    setState({
      ...NUMBERLE_INITIAL_STATE,
      secretNumber: newSecretNumber,
      board: createBoard(),
    });
    setShowEndgameModal(false);
    setMessage('');
  };

  // Keyboard event handler
  const handleKeyDown = useCallback((e) => {
    if (state.gameOver) return;
    
    if (e.key >= '0' && e.key <= '9') {
      inputNumber(parseInt(e.key));
    } else if (e.key === 'Enter') {
      submitGuess();
    } else if (e.key === 'Backspace') {
      deleteNumber();
    }
  }, [state.gameOver, state.currentCol, state.numberLength]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <GamePageLayout>
      <GameHeader title="Numberle" />
      
      {/* Welcome Modal */}
      <Modal
        open={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        title="Welcome to Numberle"
        className="welcome-modal"
      >
        <div className="welcome-content">
          <img src={numberleLogo} alt="Numberle logo" className="numberle-logo" style={{marginBottom: '18px'}} />
          <h2 className="welcome-title">Welcome to Numberle</h2>
          <p className="welcome-desc">Get 6 chances to guess<br />a 5-digit number</p>
          <button className="welcome-play" onClick={() => setShowWelcomeModal(false)}>
            Play
          </button>
        </div>
      </Modal>
      
      <div className="numberle-wrapper">
        <div className="game-container">
          <div className="board">
            {state.board.map((row, rowIndex) => (
              <div key={rowIndex} className="row">
                {row.map((tile, colIndex) => (
                  <div 
                    key={colIndex} 
                    className={`tile ${tile.status}`}
                  >
                    {tile.value}
                  </div>
                ))}
              </div>
            ))}
          </div>
          
          {message && <div className="message">{message}</div>}
          
          <div className="number-pad-container">
            <div className="number-pad">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(num => (
                <button
                  key={num}
                  className={`number-btn ${state.numberPadColors[num] || ''}`}
                  onClick={() => inputNumber(num)}
                  disabled={state.gameOver}
                >
                  {num}
                </button>
              ))}
            </div>
            <div className="action-buttons">
              <button 
                className="action-btn" 
                onClick={deleteNumber}
                disabled={state.gameOver}
              >
                ⌫
              </button>
              <button 
                className={`action-btn ${state.currentCol === state.numberLength ? 'active' : ''}`}
                onClick={submitGuess}
                disabled={state.gameOver || state.currentCol !== state.numberLength}
              >
                Enter
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Endgame Modal */}
      <Modal
        open={showEndgameModal}
        onClose={resetGame}
        title="Game Over"
        className="endgame-modal"
        buttons={
          <div className="endgame-buttons">
            <button className="playagain-btn" onClick={resetGame}>Play Again</button>
            <button className="backhome-btn" onClick={() => navigate('/')}>Back to Games</button>
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