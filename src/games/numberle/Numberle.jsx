import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GamePageLayout from '../../components/game/GamePageLayout';
import GameHeader from '../../components/game/GameHeader';
import './numberle-styles.css';
import numberleLogo from './numberle-logo.svg';
import { getDailyProgress, setDailyProgress, getDailyStreak, getNumberleStats, setNumberleStats } from '../../utils/localStorage';
import useDailySeed from '../../hooks/useDailySeed';

const Numberle = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Detect daily mode from URL query
  const searchParams = new URLSearchParams(location.search);
  const isDailyMode = searchParams.get('mode') === 'daily';
  const today = new Date().toISOString().slice(0, 10);

  // Daily mode state
  const [dailyCompleted, setDailyCompleted] = useState(false);
  const [dailyStreak, setDailyStreak] = useState(0);

  // Game state
  const [gameState, setGameState] = useState({
    secretNumber: '',
    currentRow: 0,
    currentCol: 0,
    gameOver: false,
    gameWon: false,
    maxAttempts: 6,
    numberLength: 5
  });

  // Statistics
  const [stats, setStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    bestStreak: 0
  });

  // UI state
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [showEndgameModal, setShowEndgameModal] = useState(false);
  const [endgameData, setEndgameData] = useState({ won: false, message: '' });
  const [message, setMessage] = useState('');
  const [board, setBoard] = useState([]);
  const [numberPadColors, setNumberPadColors] = useState({});

  const winPrompts = [
    'Great Job!', 'Awesome!', 'You did it!', 'Impressive!', 'Fantastic!',
    'Well done!', 'You cracked it!', 'Brilliant!', 'Superb!', 'You nailed it!'
  ];
  const [winPromptIndex, setWinPromptIndex] = useState(0);

  // Load stats from localStorage (now using utility)
  useEffect(() => {
    const savedStats = getNumberleStats();
    setStats(savedStats);
  }, []);

  // Save stats to localStorage (now using utility)
  const saveStats = useCallback((newStats) => {
    setNumberleStats(newStats);
  }, []);

  // Generate secret number
  const generateSecretNumber = useCallback(() => {
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
    
    if (attempts >= maxAttempts) {
      console.warn('Could not generate valid number after', maxAttempts, 'attempts, using:', number);
    }
    
    return number;
  }, []);

  // Check if a number is valid (no more than 2 instances of any digit)
  const isValidSecretNumber = (number) => {
    const digitCounts = {};
    for (let digit of number) {
      digitCounts[digit] = (digitCounts[digit] || 0) + 1;
      if (digitCounts[digit] > 2) {
        return false;
      }
    }
    return true;
  };

  // Create initial board
  const createBoard = useCallback(() => {
    const newBoard = [];
    for (let row = 0; row < 6; row++) {
      const rowData = [];
      for (let col = 0; col < 5; col++) {
        rowData.push({ value: '', status: '' });
      }
      newBoard.push(rowData);
    }
    return newBoard;
  }, []);

  // Add useDailySeed hook for daily mode
  const dailySeed = useDailySeed({ date: today, slug: 'numberle' });

  // Deterministic daily secret number (for daily mode)
  const getDailySecretNumber = useCallback(() => {
    // Use the dailySeed string to generate a deterministic number
    // Simple seeded PRNG based on hash string
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
  }, [dailySeed]);

  // Initialize game (override secret number in daily mode)
  useEffect(() => {
    const newBoard = createBoard();
    setBoard(newBoard);
    setGameState(prev => ({
      ...prev,
      secretNumber: isDailyMode ? getDailySecretNumber() : generateSecretNumber(),
      currentRow: 0,
      currentCol: 0,
      gameOver: false,
      gameWon: false
    }));
    setNumberPadColors({});
    setMessage('');
    if (isDailyMode) {
      // Check daily progress
      const progress = getDailyProgress('numberle');
      setDailyCompleted(progress.history && progress.history[today]?.completed);
      setDailyStreak(progress.streak || 0);
    }
  }, [createBoard, generateSecretNumber, getDailySecretNumber, isDailyMode, today]);

  // On win, update daily progress in daily mode
  const handleGameWon = () => {
    setGameState(prev => ({ ...prev, gameOver: true, gameWon: true }));
    setEndgameData({
      won: true,
      message: winPrompts[winPromptIndex]
    });
    setWinPromptIndex(prev => (prev + 1) % winPrompts.length);
    setShowEndgameModal(true);
    // Update stats
    const newStats = {
      ...stats,
      gamesPlayed: stats.gamesPlayed + 1,
      gamesWon: stats.gamesWon + 1,
      currentStreak: stats.currentStreak + 1,
      bestStreak: Math.max(stats.bestStreak, stats.currentStreak + 1)
    };
    setStats(newStats);
    saveStats(newStats);
    // Daily mode: update localStorage streak
    if (isDailyMode) {
      setDailyProgress('numberle', { date: today, completed: true, result: {} });
      setDailyCompleted(true);
      setDailyStreak(getDailyStreak('numberle'));
    }
  };

  // On load, also check if today's puzzle is already completed (for disabling input, etc.)
  useEffect(() => {
    if (isDailyMode) {
      const progress = getDailyProgress('numberle');
      setDailyCompleted(progress.history && progress.history[today]?.completed);
      setDailyStreak(progress.streak || 0);
    }
  }, [isDailyMode, today]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeydown = (e) => {
      if (gameState.gameOver) return;
      
      if (e.key >= '0' && e.key <= '9') {
        inputNumber(parseInt(e.key));
      } else if (e.key === 'Backspace') {
        deleteNumber();
      } else if (e.key === 'Enter') {
        submitGuess();
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [gameState.gameOver, gameState.currentRow, gameState.currentCol]);

  // Input number
  const inputNumber = (num) => {
    if (gameState.gameOver || gameState.currentCol >= 5) return;
    
    setBoard(prev => {
      const newBoard = [...prev];
      newBoard[gameState.currentRow][gameState.currentCol] = { value: num.toString(), status: 'filled' };
      return newBoard;
    });
    
    setGameState(prev => ({
      ...prev,
      currentCol: prev.currentCol + 1
    }));
  };

  // Delete number
  const deleteNumber = () => {
    if (gameState.gameOver || gameState.currentCol <= 0) return;
    
    setBoard(prev => {
      const newBoard = [...prev];
      newBoard[gameState.currentRow][gameState.currentCol - 1] = { value: '', status: '' };
      return newBoard;
    });
    
    setGameState(prev => ({
      ...prev,
      currentCol: prev.currentCol - 1
    }));
  };

  // Get current guess
  const getCurrentGuess = () => {
    return board[gameState.currentRow].map(tile => tile.value).join('');
  };

  // Validate guess
  const isValidGuess = (guess) => {
    return guess.length === 5 && /^\d{5}$/.test(guess);
  };

  // Evaluate guess
  const evaluateGuess = (guess) => {
    const feedback = [];
    const secret = gameState.secretNumber;
    const secretCounts = {};
    const guessCounts = {};
    
    // Count digits in secret number
    for (let digit of secret) {
      secretCounts[digit] = (secretCounts[digit] || 0) + 1;
    }
    
    // First pass: mark correct positions
    for (let i = 0; i < 5; i++) {
      if (guess[i] === secret[i]) {
        feedback[i] = 'correct';
        secretCounts[guess[i]]--;
        guessCounts[guess[i]] = (guessCounts[guess[i]] || 0) + 1;
      }
    }
    
    // Second pass: mark present and absent
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
  };

  // Submit guess
  const submitGuess = () => {
    if (gameState.gameOver || gameState.currentCol !== 5) return;
    
    const guess = getCurrentGuess();
    if (!isValidGuess(guess)) {
      setMessage('Please enter a 5-digit number');
      return;
    }
    
    const feedback = evaluateGuess(guess);
    
    // Update board with feedback
    setBoard(prev => {
      const newBoard = [...prev];
      for (let i = 0; i < 5; i++) {
        newBoard[gameState.currentRow][i] = {
          value: guess[i],
          status: feedback[i]
        };
      }
      return newBoard;
    });
    
    // Update number pad colors
    updateNumberPadColors(feedback, guess);
    
    // Check win condition
    if (feedback.every(status => status === 'correct')) {
      handleGameWon();
    } else if (gameState.currentRow === 5) {
      handleGameLost();
    } else {
      // Move to next row
      setGameState(prev => ({
        ...prev,
        currentRow: prev.currentRow + 1,
        currentCol: 0
      }));
      setMessage('');
    }
  };

  // Update number pad colors
  const updateNumberPadColors = (feedback, guess) => {
    setNumberPadColors(prev => {
      const newColors = { ...prev };
      for (let i = 0; i < 5; i++) {
        const digit = guess[i];
        const status = feedback[i];
        
        if (!newColors[digit] || status === 'correct') {
          newColors[digit] = status;
        } else if (status === 'present' && newColors[digit] !== 'correct') {
          newColors[digit] = status;
        }
      }
      return newColors;
    });
  };

  // Handle game lost
  const handleGameLost = () => {
    setGameState(prev => ({ ...prev, gameOver: true, gameWon: false }));
    setEndgameData({
      won: false,
      message: `The Numberle was: ${gameState.secretNumber}`
    });
    setShowEndgameModal(true);
    
    // Update stats
    const newStats = {
      ...stats,
      gamesPlayed: stats.gamesPlayed + 1,
      currentStreak: 0
    };
    setStats(newStats);
    saveStats(newStats);
  };

  // Start new game
  const startNewGame = () => {
    const newBoard = createBoard();
    setBoard(newBoard);
    setGameState(prev => ({
      ...prev,
      secretNumber: generateSecretNumber(),
      currentRow: 0,
      currentCol: 0,
      gameOver: false,
      gameWon: false
    }));
    setNumberPadColors({});
    setMessage('');
    setShowEndgameModal(false);
  };

  // Back to games
  const backToGames = () => {
    navigate('/');
  };

  return (
    <GamePageLayout>
      <GameHeader title="Numberle" />
      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="welcome-overlay">
          <div className="welcome-modal">
            <button 
              className="welcome-close" 
              onClick={() => setShowWelcomeModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="welcome-content">
              <img src={numberleLogo} alt="Numberle logo" className="numberle-logo" style={{marginBottom: '18px'}} />
              <h2 className="welcome-title">Welcome to Numberle</h2>
              <p className="welcome-desc">Get 6 chances to guess<br />a 5-digit number</p>
              <button className="welcome-play" onClick={() => setShowWelcomeModal(false)}>
                Play
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="numberle-wrapper">
        <div className="game-container">
          <div className="board">
            {board.map((row, rowIndex) => (
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
          <div className="message">{message}</div>
          <div className="number-pad-container">
            <div className="number-pad">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                  key={num}
                  className={`number-btn ${numberPadColors[num] || ''}`}
                  onClick={() => inputNumber(num)}
                >
                  {num}
                </button>
              ))}
            </div>
            <div className="action-buttons">
              <button className="action-btn" onClick={deleteNumber}>⌫</button>
              <button 
                className="action-btn" 
                onClick={submitGuess}
                disabled={gameState.currentCol !== 5}
              >
                Enter
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Endgame Modal */}
      {showEndgameModal && (
        <div className="endgame-overlay show">
          <div className="endgame-modal">
            <div className="endgame-content">
              <h2 className="endgame-title">Game Over</h2>
              <p className="endgame-message">
                {endgameData.won ? (
                  endgameData.message
                ) : (
                  <span dangerouslySetInnerHTML={{ __html: endgameData.message }} />
                )}
              </p>
              <div className="endgame-buttons">
                <button className="playagain-btn" onClick={startNewGame}>
                  Play Again
                </button>
                <button className="backhome-btn" onClick={backToGames}>
                  Back to Games
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </GamePageLayout>
  );
};

export default Numberle; 