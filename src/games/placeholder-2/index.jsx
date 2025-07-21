import React, { useState, useEffect } from 'react';
import styles from './Placeholder2.module.css';

const Placeholder2 = () => {
  const [targetNumber, setTargetNumber] = useState(0);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [maxAttempts] = useState(10);
  const [gameState, setGameState] = useState('playing');
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);

  const generateNewGame = () => {
    const newTarget = Math.floor(Math.random() * 100) + 1;
    setTargetNumber(newTarget);
    setGuess('');
    setAttempts(0);
    setGameState('playing');
    setMessage('Guess a number between 1 and 100!');
    setHistory([]);
  };

  const handleGuess = () => {
    const numGuess = parseInt(guess);
    
    if (isNaN(numGuess) || numGuess < 1 || numGuess > 100) {
      setMessage('Please enter a valid number between 1 and 100!');
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    let newMessage = '';
    let newGameState = gameState;

    if (numGuess === targetNumber) {
      newMessage = `Congratulations! You found the number in ${newAttempts} attempts!`;
      newGameState = 'won';
    } else if (newAttempts >= maxAttempts) {
      newMessage = `Game Over! The number was ${targetNumber}.`;
      newGameState = 'lost';
    } else {
      const hint = numGuess < targetNumber ? 'Too low!' : 'Too high!';
      newMessage = `${hint} You have ${maxAttempts - newAttempts} attempts left.`;
    }

    setMessage(newMessage);
    setGameState(newGameState);
    setHistory(prev => [...prev, { guess: numGuess, result: numGuess === targetNumber ? 'correct' : (numGuess < targetNumber ? 'low' : 'high') }]);
    setGuess('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && gameState === 'playing') {
      handleGuess();
    }
  };

  useEffect(() => {
    generateNewGame();
  }, []);

  if (gameState === 'won' || gameState === 'lost') {
    return (
      <div className={styles.container}>
        <div className={styles.gameOver}>
          <h2>{gameState === 'won' ? 'You Won!' : 'Game Over'}</h2>
          <p>{message}</p>
          <div className={styles.stats}>
            <p>Attempts: {attempts}</p>
            <p>Target: {targetNumber}</p>
          </div>
          <button onClick={generateNewGame} className={styles.button}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Number Guesser</h1>
        <div className={styles.stats}>
          <span>Attempts: {attempts}/{maxAttempts}</span>
        </div>
      </div>

      <div className={styles.gameArea}>
        <div className={styles.inputSection}>
          <label htmlFor="guessInput" className={styles.label}>
            Enter your guess (1-100):
          </label>
          <div className={styles.inputGroup}>
            <input
              id="guessInput"
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyPress={handleKeyPress}
              className={styles.input}
              min="1"
              max="100"
              placeholder="Enter number..."
              aria-describedby="message"
            />
            <button 
              onClick={handleGuess} 
              className={styles.button}
              disabled={!guess.trim()}
            >
              Guess
            </button>
          </div>
        </div>

        <div className={styles.message} id="message">
          {message}
        </div>

        {history.length > 0 && (
          <div className={styles.history}>
            <h3>Previous Guesses:</h3>
            <div className={styles.historyList}>
              {history.map((item, index) => (
                <span 
                  key={index} 
                  className={`${styles.historyItem} ${styles[item.result]}`}
                  aria-label={`Guess ${item.guess} was ${item.result}`}
                >
                  {item.guess}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={styles.instructions}>
        <p>I'm thinking of a number between 1 and 100.</p>
        <p>Can you guess it in {maxAttempts} attempts or fewer?</p>
      </div>
    </div>
  );
};

export default Placeholder2; 