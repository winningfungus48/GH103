import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GamePageLayout from '../../components/game/GamePageLayout';
import GameInstructions from '../../components/game/GameInstructions';
import { pitcherData } from '../../data/sports/pitcherData';
import useWelcomeModal from '../../hooks/useWelcomeModal.jsx';
import styles from './mlb-player-comparison.module.css';

const MLBPlayerComparison = ({ mode, description, instructions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [currentPlayerA, setCurrentPlayerA] = useState(null);
  const [currentPlayerB, setCurrentPlayerB] = useState(null);
  const [currentStat, setCurrentStat] = useState(null);
  const [currentStatName, setCurrentStatName] = useState(null);
  const [currentQuestionType, setCurrentQuestionType] = useState(null);
  const [currentQuestionText, setCurrentQuestionText] = useState(null);
  const [answeredCurrentQuestion, setAnsweredCurrentQuestion] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const maxQuestions = 10;

  // Welcome modal hook
  const { WelcomeModal } = useWelcomeModal("Pitcher Data Quiz", instructions);

  const availableStats = [
    { key: 'war', name: 'WAR', question: 'Who has a higher WAR?', better: 'higher' },
    { key: 'era', name: 'ERA', question: 'Who has a lower ERA?', better: 'lower' },
    { key: 'strikeouts', name: 'Strikeouts', question: 'Who has more strikeouts?', better: 'higher' },
    { key: 'k9Ratio', name: 'K/9', question: 'Who has a higher K/9 ratio?', better: 'higher' }
  ];

  // Initialize game
  useEffect(() => {
    if (pitcherData.length > 0) {
      startGame();
    }
  }, []);

  const startGame = useCallback(() => {
    setCurrentQuestion(1);
    setScore(0);
    setGameOver(false);
    setAnsweredCurrentQuestion(false);
    setMessage('');
    generateQuestion();
  }, []);

  const generateQuestion = useCallback(() => {
    // Select two random pitchers
    const playerAIndex = Math.floor(Math.random() * pitcherData.length);
    let playerBIndex = Math.floor(Math.random() * pitcherData.length);
    while (playerBIndex === playerAIndex) {
      playerBIndex = Math.floor(Math.random() * pitcherData.length);
    }

    const playerA = pitcherData[playerAIndex];
    const playerB = pitcherData[playerBIndex];

    // Select a random stat
    const statIndex = Math.floor(Math.random() * availableStats.length);
    const stat = availableStats[statIndex];

    setCurrentPlayerA(playerA);
    setCurrentPlayerB(playerB);
    setCurrentStat(stat.key);
    setCurrentStatName(stat.name);
    setCurrentQuestionType(stat.better);
    setCurrentQuestionText(stat.question);
    setAnsweredCurrentQuestion(false);
  }, []);

  const selectPlayer = useCallback((choice) => {
    if (answeredCurrentQuestion || gameOver) return;

    // Get fresh data to avoid stale closure issues
    const playerA = currentPlayerA;
    const playerB = currentPlayerB;
    const statKey = currentStat;
    const questionType = currentQuestionType;

    // Additional safety check - ensure we have valid data
    if (!playerA || !playerB || !statKey || !questionType) {
      return;
    }

    let correctChoice;
    let valueA = playerA[statKey];
    let valueB = playerB[statKey];

    // Validate data
    if (typeof valueA !== 'number' || typeof valueB !== 'number') {
      return;
    }

    if (questionType === 'lower') {
      correctChoice = valueA < valueB ? 'A' : 'B';
    } else {
      correctChoice = valueA > valueB ? 'A' : 'B';
    }

    const isCorrect = choice === correctChoice;

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    showAnswer(choice, correctChoice, valueA, valueB);
    setAnsweredCurrentQuestion(true);

    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestion >= maxQuestions) {
        endGame();
      } else {
        setCurrentQuestion(prev => prev + 1);
        generateQuestion();
      }
    }, 2000);
  }, [answeredCurrentQuestion, gameOver, currentPlayerA, currentPlayerB, currentStat, currentQuestionType, currentQuestion, maxQuestions, generateQuestion]);

  const formatStat = (value) => {
    if (currentStat === 'war') {
      return value.toFixed(1);
    } else if (currentStat === 'era') {
      return value.toFixed(2);
    } else if (currentStat === 'k9Ratio') {
      return value.toFixed(1);
    } else {
      return value.toString();
    }
  };

  // Helper function to calculate correct answer
  const getCorrectAnswer = () => {
    if (!currentPlayerA || !currentPlayerB || !currentStat || !currentQuestionType) return null;
    
    const valueA = currentPlayerA[currentStat];
    const valueB = currentPlayerB[currentStat];
    
    if (currentQuestionType === 'lower') {
      return valueA < valueB ? 'A' : 'B';
    } else {
      return valueA > valueB ? 'A' : 'B';
    }
  };

  const showAnswer = useCallback((userChoice, correctChoice, valueA, valueB) => {
    const isCorrect = userChoice === correctChoice;
    
    // Create a cleaner message format
    const playerAInfo = `${currentPlayerA.player} (${formatStat(valueA)})`;
    const playerBInfo = `${currentPlayerB.player} (${formatStat(valueB)})`;
    const prefix = isCorrect ? 'Correct!' : 'Wrong!';
    const message = `${prefix} ${playerAInfo} vs ${playerBInfo}`;

    setMessage(message);
    setMessageType(isCorrect ? 'success' : 'error');
  }, [currentPlayerA, currentPlayerB, currentStat]);

  const endGame = useCallback(() => {
    setGameOver(true);
    const percentage = Math.round((score / maxQuestions) * 100);
    let finalMessage = `Game Over! You got ${score}/${maxQuestions} correct (${percentage}%)`;
    
    if (percentage >= 80) {
      finalMessage += ' - Excellent!';
    } else if (percentage >= 60) {
      finalMessage += ' - Good job!';
    } else {
      finalMessage += ' - Keep practicing!';
    }
    
    setMessage(finalMessage);
    setMessageType('info');
  }, [score, maxQuestions]);

  const newGame = useCallback(() => {
    startGame();
  }, [startGame]);

  return (
    <GamePageLayout>
      <GameInstructions description={description} instructions={instructions} />
      <WelcomeModal />
      
      <div className={styles.container}>
        <p className={styles.subtitle}>Compare pitchers • 10 questions • 2025 season data</p>
      
        <div className={styles.gameInfo}>
          <div className={styles.infoBox}>
            <strong>Question: {currentQuestion} / {maxQuestions}</strong>
          </div>
          <div className={styles.infoBox}>
            <strong>Score: {score} / {maxQuestions}</strong>
          </div>
        </div>

        {message && (
          <div className={styles.messageWrapper}>
            <div className={`${styles.messageInner} ${styles[messageType]}`}>
              {message}
            </div>
          </div>
        )}

        {!gameOver && currentPlayerA && currentPlayerB && (
          <div className={styles.questionContainer}>
            <div className={styles.questionText}>
              {currentQuestionText}
            </div>
            
            <div className={styles.playersContainer}>
              <div 
                className={`${styles.playerCard} ${answeredCurrentQuestion && getCorrectAnswer() === 'A' ? styles.correct : ''} ${answeredCurrentQuestion && getCorrectAnswer() !== 'A' ? styles.incorrect : ''}`}
                onClick={() => selectPlayer('A')}
              >
                <div className={styles.playerName}>{currentPlayerA.player}</div>
                <div className={styles.playerTeam}>{currentPlayerA.team}</div>
                {answeredCurrentQuestion && (
                  <div className={styles.playerStat}>
                    {formatStat(currentPlayerA[currentStat])}
                  </div>
                )}
              </div>
              
              <div className={styles.vs}>VS</div>
              
              <div 
                className={`${styles.playerCard} ${answeredCurrentQuestion && getCorrectAnswer() === 'B' ? styles.correct : ''} ${answeredCurrentQuestion && getCorrectAnswer() !== 'B' ? styles.incorrect : ''}`}
                onClick={() => selectPlayer('B')}
              >
                <div className={styles.playerName}>{currentPlayerB.player}</div>
                <div className={styles.playerTeam}>{currentPlayerB.team}</div>
                {answeredCurrentQuestion && (
                  <div className={styles.playerStat}>
                    {formatStat(currentPlayerB[currentStat])}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className={styles.controls}>
          <button onClick={newGame} className={styles.newGameButton}>
            New Game
          </button>
        </div>

        <div className={styles.instructions}>
          <p><strong>How to play:</strong> Click on player to answer question.</p>
          <p>🟢 <strong>Green:</strong> Correct Answer | 🔴 <strong>Red:</strong> Incorrect Answer</p>
          <p>Uses real 2025 MLB pitcher data!</p>
        </div>

        <div className={styles.glossary}>
          <p><strong>Glossary:</strong></p>
          <p><strong>ERA:</strong> Runs allowed per 9 innings. Lower is better.</p>
          <p><strong>K/9:</strong> Strikeouts per 9 innings. Higher is better.</p>
          <p><strong>WAR:</strong> Wins added over a replacement player. Higher is better.</p>
        </div>
      </div>
    </GamePageLayout>
  );
};

export default MLBPlayerComparison; 