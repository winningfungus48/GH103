import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './numberle-styles.css';
import numberleLogo from './numberle-logo.svg';

const Numberle = () => {
  const navigate = useNavigate();
  
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

  // Load stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('numberle-stats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  // Save stats to localStorage
  const saveStats = useCallback((newStats) => {
    localStorage.setItem('numberle-stats', JSON.stringify(newStats));
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

  // Initialize game
  useEffect(() => {
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
  }, [createBoard, generateSecretNumber]);

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

  // Handle game won
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
    <div className="container numberle-main-container">
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

      <header>
        <div className="logo-title-row" style={{justifyContent: 'center'}}>
          <img src={numberleLogo} alt="Numberle logo" className="numberle-logo" />
          <h1>Numberle</h1>
        </div>
        <p className="subtitle">Guess the 5-digit number in 6 tries</p>
      </header>

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
    </div>
  );
};

export default Numberle; 