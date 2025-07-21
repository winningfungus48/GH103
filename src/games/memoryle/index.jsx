import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GamePageLayout from "../../components/game/GamePageLayout";
import GameHeader from "../../components/game/GameHeader";
import styles from "./memoryle-styles.module.css";
import {
  getMemoryleStats,
  setMemoryleStats,
} from "../../utils/localStorage";
import useDailySeed from "../../hooks/useDailySeed";
import useWelcomeModal from "../../hooks/useWelcomeModal.jsx";
import Modal from "../../components/ui/Modal";

// Memoryle-specific logic
const MEMORYLE_INITIAL_STATE = {
  cards: [],
  flippedCards: [],
  matchedPairs: [],
  gameOver: false,
  gameWon: false,
  maxMoves: 30,
  currentMoves: 0,
  gridSize: 4, // 4x4 grid
  totalPairs: 8,
};

const CARD_SYMBOLS = [
  "🎮", "🎲", "🎯", "🎪", "🎨", "🎭", "🎪", "🎯",
  "🎲", "🎮", "🎨", "🎭", "🎪", "🎯", "🎲", "🎮"
];

const winPrompts = [
  "Memory Master!",
  "Card Champion!",
  "Match Maker!",
  "Recall Royalty!",
  "Memory Wizard!",
  "Pair Pro!",
  "Match Master!",
  "Memory Ace!",
];

function generateCards(seed) {
  const rng = (() => {
    let state = seed;
    return () => {
      state = (state * 9301 + 49297) % 233280;
      return state / 233280;
    };
  })();

  // Create pairs of cards
  const cardPairs = [];
  for (let i = 0; i < 8; i++) {
    cardPairs.push(CARD_SYMBOLS[i], CARD_SYMBOLS[i]);
  }

  // Shuffle the cards using Fisher-Yates algorithm
  const shuffledCards = [...cardPairs];
  for (let i = shuffledCards.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
  }

  // Convert to card objects
  return shuffledCards.map((symbol, index) => ({
    id: index,
    symbol,
    isFlipped: false,
    isMatched: false,
  }));
}

const Memoryle = ({ instructions }) => {
  const navigate = useNavigate();
  const dailySeed = useDailySeed();
  const [state, setState] = useState(MEMORYLE_INITIAL_STATE);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});

  // Welcome modal
  const { WelcomeModal } = useWelcomeModal("Memoryle", instructions);

  // Initialize game with daily seed
  useEffect(() => {
    if (dailySeed !== null) {
      const cards = generateCards(dailySeed);
      setState((prev) => ({
        ...prev,
        cards,
      }));
    }
  }, [dailySeed]);

  const handleCardClick = (cardId) => {
    if (state.gameOver || state.flippedCards.length >= 2) return;

    const card = state.cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    const newCards = state.cards.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    );

    const newFlippedCards = [...state.flippedCards, cardId];

    setState(prev => ({
      ...prev,
      cards: newCards,
      flippedCards: newFlippedCards,
    }));

    // Check for match if two cards are flipped
    if (newFlippedCards.length === 2) {
      setTimeout(() => {
        checkForMatch(newFlippedCards);
      }, 1000);
    }
  };

  const checkForMatch = (flippedCardIds) => {
    const [card1, card2] = flippedCardIds.map(id => 
      state.cards.find(c => c.id === id)
    );

    const isMatch = card1.symbol === card2.symbol;
    const newMoves = state.currentMoves + 1;

    let newCards = [...state.cards];
    let newMatchedPairs = [...state.matchedPairs];

    if (isMatch) {
      // Mark cards as matched
      newCards = newCards.map(card => 
        flippedCardIds.includes(card.id) 
          ? { ...card, isMatched: true }
          : card
      );
      newMatchedPairs.push(card1.symbol);
    } else {
      // Flip cards back
      newCards = newCards.map(card => 
        flippedCardIds.includes(card.id) 
          ? { ...card, isFlipped: false }
          : card
      );
    }

    const isWon = newMatchedPairs.length === state.totalPairs;
    const isGameOver = isWon || newMoves >= state.maxMoves;

    setState(prev => ({
      ...prev,
      cards: newCards,
      flippedCards: [],
      matchedPairs: newMatchedPairs,
      currentMoves: newMoves,
      gameOver: isGameOver,
      gameWon: isWon,
    }));

    if (isGameOver) {
      handleGameEnd(isWon);
    }
  };

  const handleKeyDown = (e) => {
    if (state.gameOver || state.flippedCards.length >= 2) return;

    // Number keys 1-9 for first row, 0 and letters for other rows
    const keyMap = {
      '1': 0, '2': 1, '3': 2, '4': 3,
      '5': 4, '6': 5, '7': 6, '8': 7,
      '9': 8, '0': 9, 'q': 10, 'w': 11,
      'e': 12, 'r': 13, 't': 14, 'y': 15
    };

    const cardId = keyMap[e.key.toLowerCase()];
    if (cardId !== undefined && cardId < state.cards.length) {
      handleCardClick(cardId);
    }
  };

  const handleGameEnd = (won) => {
    const stats = getMemoryleStats();
    const newStats = {
      ...stats,
      gamesPlayed: stats.gamesPlayed + 1,
      gamesWon: stats.gamesWon + (won ? 1 : 0),
      currentStreak: won ? stats.currentStreak + 1 : 0,
      maxStreak: won ? Math.max(stats.maxStreak, stats.currentStreak + 1) : stats.maxStreak,
      totalMoves: stats.totalMoves + state.currentMoves,
      bestMoves: won ? Math.min(stats.bestMoves || Infinity, state.currentMoves) : stats.bestMoves,
    };
    setMemoryleStats(newStats);

    const winPrompt = winPrompts[Math.floor(Math.random() * winPrompts.length)];
    const message = won
      ? `You found all pairs in ${state.currentMoves} moves!`
      : `Game over. You found ${state.matchedPairs.length} pairs in ${state.currentMoves} moves.`;

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
    setState(MEMORYLE_INITIAL_STATE);
    setMessage("");
  };

  const resetGame = () => {
    if (dailySeed !== null) {
      const cards = generateCards(dailySeed);
      setState(prev => ({
        ...prev,
        cards,
        flippedCards: [],
        matchedPairs: [],
        currentMoves: 0,
        gameOver: false,
        gameWon: false,
      }));
    }
  };

  return (
    <GamePageLayout>
      <GameHeader
        title="Memoryle"
        onBack={() => navigate("/")}
      />
      
      <div 
        className={styles.container}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="application"
        aria-label="Memoryle game"
        aria-live="polite"
        aria-atomic="true"
      >


        {/* Screen reader status */}
        <div className="sr-only" aria-live="polite">
          {state.gameOver 
            ? (state.gameWon 
                ? "Congratulations! You found all pairs!" 
                : `Game over. You found ${state.matchedPairs.length} pairs.`)
            : `Moves: ${state.currentMoves} of ${state.maxMoves}, ${state.matchedPairs.length} pairs found`
          }
        </div>

        <div className={styles.gameContainer}>
          <div className={styles.grid} role="grid" aria-label="Memory card grid">
            {state.cards.map((card, index) => (
              <div
                key={card.id}
                className={`${styles.card} ${
                  card.isFlipped || card.isMatched ? styles.flipped : ""
                } ${card.isMatched ? styles.matched : ""}`}
                onClick={() => handleCardClick(card.id)}
                role="gridcell"
                aria-label={`Card ${index + 1}, ${card.isFlipped || card.isMatched ? card.symbol : 'hidden'}`}
                tabIndex={0}
              >
                <div className={styles.cardInner}>
                  <div className={styles.cardFront}>?</div>
                  <div className={styles.cardBack}>{card.symbol}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.controls}>
          <button
            className={styles.resetBtn}
            onClick={resetGame}
            disabled={state.gameOver}
            aria-label="Reset game"
            tabIndex={0}
          >
            Reset
          </button>
          <div className={styles.moves}>
            Moves: {state.currentMoves}/{state.maxMoves}
          </div>
          <div className={styles.pairs}>
            Pairs: {state.matchedPairs.length}/{state.totalPairs}
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
            {modalContent.stats.bestMoves && (
              <div className={styles.stat}>
                <span className={styles.statValue}>{modalContent.stats.bestMoves}</span>
                <span className={styles.statLabel}>Best Moves</span>
              </div>
            )}
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

export default Memoryle; 