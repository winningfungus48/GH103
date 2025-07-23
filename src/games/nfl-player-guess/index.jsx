import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GamePageLayout from '../../components/game/GamePageLayout';
import GameInstructions from '../../components/game/GameInstructions';
import { nflPlayers } from '../../data/sports/nflPlayers';
import useWelcomeModal from '../../hooks/useWelcomeModal.jsx';
import styles from './nfl-player-guess.module.css';

const NFLPlayerGuess = ({ mode, description, instructions }) => {
  const [targetPlayer, setTargetPlayer] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [gameWon, setGameWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [teamHintUsed, setTeamHintUsed] = useState(false);
  const [initialHintUsed, setInitialHintUsed] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const maxGuesses = 8;

  // Welcome modal hook
  const { WelcomeModal } = useWelcomeModal("NFL Player Guess", instructions);

  // Initialize game
  useEffect(() => {
    if (nflPlayers.length > 0) {
      const randomIndex = Math.floor(Math.random() * nflPlayers.length);
      setTargetPlayer(nflPlayers[randomIndex]);
    }
  }, []);

  // Handle search input
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPlayers([]);
      setShowDropdown(false);
      return;
    }

    const filtered = nflPlayers.filter(player => 
      player.player.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.position.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 10);

    setFilteredPlayers(filtered);
    setShowDropdown(filtered.length > 0);
  }, [searchTerm]);

  const selectPlayer = useCallback((player) => {
    setSelectedPlayer(player);
    setSearchTerm(player.player);
    setShowDropdown(false);
  }, []);

  const makeGuess = useCallback(() => {
    if (!selectedPlayer || gameOver) return;

    const newGuesses = [...guesses, selectedPlayer];
    setGuesses(newGuesses);
    setSelectedPlayer(null);
    setSearchTerm('');

    if (selectedPlayer.player === targetPlayer.player) {
      setGameWon(true);
      setGameOver(true);
    } else {
      setWrongGuesses(prev => prev + 1);
      if (newGuesses.length >= maxGuesses) {
        setGameOver(true);
      }
    }
  }, [selectedPlayer, guesses, gameOver, targetPlayer, maxGuesses]);

  const useTeamHint = useCallback(() => {
    if (teamHintUsed || wrongGuesses < 4) return;
    setTeamHintUsed(true);
  }, [teamHintUsed, wrongGuesses]);

  const useInitialHint = useCallback(() => {
    if (initialHintUsed || wrongGuesses < 6) return;
    setInitialHintUsed(true);
  }, [initialHintUsed, wrongGuesses]);

  const startNewGame = useCallback(() => {
    setGuesses([]);
    setGameWon(false);
    setGameOver(false);
    setWrongGuesses(0);
    setTeamHintUsed(false);
    setInitialHintUsed(false);
    setSelectedPlayer(null);
    setSearchTerm('');
    const randomIndex = Math.floor(Math.random() * nflPlayers.length);
    setTargetPlayer(nflPlayers[randomIndex]);
  }, []);

  const getMatchColor = (guessValue, targetValue) => {
    if (guessValue === targetValue) return '#6aaa64';
    if (typeof guessValue === 'number' && typeof targetValue === 'number') {
      const diff = Math.abs(guessValue - targetValue);
      const threshold = Math.max(targetValue * 0.1, 10);
      if (diff <= threshold) return '#c9b458';
    }
    return '#787c7e';
  };

  const getArrow = (guessValue, targetValue, threshold) => {
    if (guessValue === targetValue) return '';
    if (typeof guessValue === 'number' && typeof targetValue === 'number') {
      const diff = Math.abs(guessValue - targetValue);
      if (diff <= threshold) return '';
      return guessValue > targetValue ? '↓' : '↑';
    }
    return '';
  };



  return (
    <GamePageLayout>
      <GameInstructions description={description} instructions={instructions} />
      <WelcomeModal />
      
      <div className={styles.container}>
        <p className={styles.subtitle}>2024 season data • Hints on 5th & 7th guess</p>
      
      <div className={styles.inputSection}>
        <div className={styles.searchContainer}>
          <label htmlFor="playerInput" className={styles.searchLabel}>
            Search for a player:
          </label>
          <input
            id="playerInput"
            type="text"
            placeholder="Type player name, team, or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
            autoComplete="off"
          />
          {showDropdown && (
            <div className={styles.dropdown}>
              {filteredPlayers.map((player, index) => (
                <div
                  key={index}
                  className={styles.dropdownItem}
                  onClick={() => selectPlayer(player)}
                >
                  {player.player} - {player.team} ({player.position})
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className={styles.hintsSection}>
          <span className={styles.hintsLabel}>Hints:</span>
          <button
            onClick={useTeamHint}
            disabled={teamHintUsed || wrongGuesses < 4}
            className={`${styles.hintButton} ${teamHintUsed || wrongGuesses < 4 ? styles.disabled : ''}`}
          >
            Team
          </button>
          <button
            onClick={useInitialHint}
            disabled={initialHintUsed || wrongGuesses < 6}
            className={`${styles.hintButton} ${initialHintUsed || wrongGuesses < 6 ? styles.disabled : ''}`}
          >
            Initial
          </button>
        </div>
        
        <button
          onClick={makeGuess}
          disabled={!selectedPlayer || gameOver}
          className={`${styles.guessButton} ${!selectedPlayer || gameOver ? styles.disabled : ''}`}
        >
          Make Guess
        </button>
      </div>

      <div className={styles.gameInfo}>
        <span className={styles.guessCount}>Guesses: {guesses.length} / {maxGuesses}</span>
      </div>

      {teamHintUsed && targetPlayer && (
        <div className={styles.hintDisplay}>
          Team Hint: {targetPlayer.team}
        </div>
      )}

      {initialHintUsed && targetPlayer && (
        <div className={styles.hintDisplay}>
          Initial Hint: {targetPlayer.player.charAt(0)}
        </div>
      )}

      <div className={styles.guessesContainer}>
        <div className={styles.guessesHeader}>Your Guesses:</div>
        <div className={styles.desktopHeaders}>
          <div>Player</div>
          <div>Age</div>
          <div>Conference</div>
          <div>Team</div>
          <div>Position</div>
          <div>Rec Yds</div>
          <div>Rush Yds</div>
          <div>TDs</div>
        </div>
        <div className={styles.mobileHeaders}>
          <div>Player</div>
          <div>Age</div>
          <div>Conf</div>
          <div>Team</div>
          <div>Pos</div>
          <div>Rec Yds</div>
          <div>Rush Yds</div>
          <div>TDs</div>
        </div>
        
        {guesses.length === 0 ? (
          <div className={styles.placeholderRow}>
            <div>?</div>
            <div>?</div>
            <div>?</div>
            <div>?</div>
            <div>?</div>
            <div>?</div>
            <div>?</div>
            <div>?</div>
          </div>
        ) : (
          guesses.map((guess, index) => (
            <div key={index} className={styles.guessRow}>
              <div style={{ backgroundColor: getMatchColor(guess.player, targetPlayer.player) }}>
                {guess.player} {getArrow(guess.player, targetPlayer.player, 0)}
              </div>
              <div style={{ backgroundColor: getMatchColor(guess.age, targetPlayer.age) }}>
                {guess.age} {getArrow(guess.age, targetPlayer.age, 2)}
              </div>
              <div style={{ backgroundColor: getMatchColor(guess.conference, targetPlayer.conference) }}>
                {guess.conference}
              </div>
              <div style={{ backgroundColor: getMatchColor(guess.team, targetPlayer.team) }}>
                {guess.team}
              </div>
              <div style={{ backgroundColor: getMatchColor(guess.position, targetPlayer.position) }}>
                {guess.position}
              </div>
              <div style={{ backgroundColor: getMatchColor(guess.recYds, targetPlayer.recYds) }}>
                {guess.recYds} {getArrow(guess.recYds, targetPlayer.recYds, Math.max(targetPlayer.recYds * 0.1, 10))}
              </div>
              <div style={{ backgroundColor: getMatchColor(guess.rushYds, targetPlayer.rushYds) }}>
                {guess.rushYds} {getArrow(guess.rushYds, targetPlayer.rushYds, Math.max(targetPlayer.rushYds * 0.1, 10))}
              </div>
              <div style={{ backgroundColor: getMatchColor(guess.tds, targetPlayer.tds) }}>
                {guess.tds} {getArrow(guess.tds, targetPlayer.tds, 1)}
              </div>
            </div>
          ))
        )}
      </div>

      {gameOver && (
        <div className={styles.gameResult}>
          <h2>{gameWon ? 'Congratulations!' : 'Game Over'}</h2>
          <p>The player was: {targetPlayer.player}</p>
          <button onClick={startNewGame} className={styles.newGameButton}>
            New Game
          </button>
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '0.8rem', color: '#666', lineHeight: '1.2' }}>
        <p style={{ margin: '5px 0' }}><strong>How to play:</strong> Search players by name, team, or position. Use arrows to navigate.</p>
        <p style={{ margin: '5px 0' }}>🟢 <strong>Green:</strong> Correct | 🟡 <strong>Yellow:</strong> Close (±3 TDs, ±200 yards, ±3 years) | ⬜ <strong>Gray:</strong> Wrong</p>
        <p style={{ margin: '5px 0' }}>↑ <strong>Target higher</strong> | ↓ <strong>Target lower</strong></p>
      </div>
      </div>
    </GamePageLayout>
  );
};

export default NFLPlayerGuess; 