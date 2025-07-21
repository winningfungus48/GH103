import React, { useState, useEffect } from 'react';
import styles from './Placeholder1.module.css';

const Placeholder1 = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameState, setGameState] = useState('playing');
  const [targetColor, setTargetColor] = useState('');
  const [colorOptions, setColorOptions] = useState([]);

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

  const generateNewRound = () => {
    const shuffled = [...colors].sort(() => Math.random() - 0.5);
    const target = shuffled[0];
    const options = shuffled.slice(0, 4).sort(() => Math.random() - 0.5);
    
    setTargetColor(target);
    setColorOptions(options);
  };

  const handleColorClick = (clickedColor) => {
    if (clickedColor === targetColor) {
      setScore(prev => prev + 10);
      generateNewRound();
    } else {
      setScore(prev => Math.max(0, prev - 5));
    }
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameState('playing');
    generateNewRound();
  };

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameState('finished');
    }
  }, [timeLeft, gameState]);

  if (gameState === 'finished') {
    return (
      <div className={styles.container}>
        <div className={styles.gameOver}>
          <h2>Game Over!</h2>
          <p>Final Score: {score}</p>
          <button onClick={startGame} className={styles.button}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Color Match</h1>
        <div className={styles.stats}>
          <span>Score: {score}</span>
          <span>Time: {timeLeft}s</span>
        </div>
      </div>

      <div className={styles.gameArea}>
        <div className={styles.targetColor} style={{ backgroundColor: targetColor }}>
          <p>Match this color!</p>
        </div>

        <div className={styles.colorGrid}>
          {colorOptions.map((color, index) => (
            <button
              key={index}
              className={styles.colorButton}
              style={{ backgroundColor: color }}
              onClick={() => handleColorClick(color)}
              aria-label={`Color option ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className={styles.instructions}>
        <p>Click the color that matches the target!</p>
        <p>+10 points for correct, -5 points for wrong</p>
      </div>
    </div>
  );
};

export default Placeholder1; 