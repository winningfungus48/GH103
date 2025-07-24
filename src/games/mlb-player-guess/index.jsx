import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GamePageLayout from '../../components/game/GamePageLayout';
import GameInstructions from '../../components/game/GameInstructions';
import { mlbPlayers } from '../../data/sports/mlbPlayers';
import useWelcomeModal from '../../hooks/useWelcomeModal.jsx';

const MLBPlayerGuess = ({ mode, description, instructions }) => {
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
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const maxGuesses = 8;
  const navigate = useNavigate();
  const location = useLocation();
  const { WelcomeModal } = useWelcomeModal("MLB Player Guess", instructions);

  // Initialize game
  useEffect(() => {
    if (!targetPlayer) {
      selectRandomTarget();
    }
  }, [targetPlayer]);

  // Filter players based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPlayers([]);
      setShowDropdown(false);
      return;
    }

    const filtered = mlbPlayers.filter(player => 
      player.player.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.league.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 10);

    setFilteredPlayers(filtered);
    setShowDropdown(filtered.length > 0);
    setHighlightedIndex(-1);
  }, [searchTerm]);

  const selectRandomTarget = () => {
    const randomIndex = Math.floor(Math.random() * mlbPlayers.length);
    setTargetPlayer(mlbPlayers[randomIndex]);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setSelectedPlayer(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < filteredPlayers.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && filteredPlayers[highlightedIndex]) {
        selectPlayer(filteredPlayers[highlightedIndex]);
      } else if (selectedPlayer) {
        makeGuess();
      }
    } else if (e.key === 'Escape') {
      hideDropdown();
    }
  };

  const selectPlayer = (player) => {
    setSelectedPlayer(player);
    setSearchTerm(player.player);
    setShowDropdown(false);
    setHighlightedIndex(-1);
  };

  const hideDropdown = () => {
    setShowDropdown(false);
    setHighlightedIndex(-1);
  };

  const useTeamHint = () => {
    if (!teamHintUsed && wrongGuesses >= 4) {
      setTeamHintUsed(true);
      alert(`The target player plays for the ${targetPlayer.team}`);
    }
  };

  const useInitialHint = () => {
    if (!initialHintUsed && wrongGuesses >= 6) {
      setInitialHintUsed(true);
      alert(`The target player's name starts with "${targetPlayer.player.charAt(0)}"`);
    }
  };

  const makeGuess = () => {
    if (!selectedPlayer || gameOver) return;

    const newGuess = {
      player: selectedPlayer.player,
      league: selectedPlayer.league,
      team: selectedPlayer.team,
      age: selectedPlayer.age,
      runs: selectedPlayer.runs,
      sb: selectedPlayer.sb,
      hr: selectedPlayer.hr,
      ops: selectedPlayer.ops
    };

    const newGuesses = [...guesses, newGuess];
    setGuesses(newGuesses);

    const isCorrect = selectedPlayer.player === targetPlayer.player;
    
    if (isCorrect) {
      setGameWon(true);
      setGameOver(true);
    } else {
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);
      
      if (newWrongGuesses >= maxGuesses) {
        setGameOver(true);
      }
    }

    setSelectedPlayer(null);
    setSearchTerm('');
    setShowDropdown(false);
  };

  const startNewGame = () => {
    setGuesses([]);
    setGameWon(false);
    setGameOver(false);
    setWrongGuesses(0);
    setTeamHintUsed(false);
    setInitialHintUsed(false);
    setSelectedPlayer(null);
    setSearchTerm('');
    setShowDropdown(false);
    setHighlightedIndex(-1);
    selectRandomTarget();
  };

  const getMatchColor = (guessValue, targetValue) => {
    if (guessValue === targetValue) return '#6aaa64';
    if (typeof guessValue === 'number' && typeof targetValue === 'number') {
      const diff = Math.abs(guessValue - targetValue);
      const threshold = Math.max(targetValue * 0.1, 10);
      if (diff <= threshold) return '#c9b458';
    }
    return '#787c7e';
  };

  const getNumericMatchColor = (guessValue, targetValue, threshold) => {
    const diff = Math.abs(guessValue - targetValue);
    if (diff === 0) return '#6aaa64';
    if (diff <= threshold) return '#c9b458';
    return '#787c7e';
  };

  const getArrow = (guessValue, targetValue, threshold) => {
    const diff = guessValue - targetValue;
    if (Math.abs(diff) <= threshold) return '';
    return diff > 0 ? '↓' : '↑';
  };

  if (!targetPlayer) {
    return <div>Loading...</div>;
  }

  return (
    <GamePageLayout>

      <GameInstructions description={description} instructions={instructions} />
      <WelcomeModal />
      
      <div style={{ textAlign: 'center', maxWidth: '1200px', margin: '0 auto', paddingTop: '5px' }}>
        <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '0.85rem' }}>
          2025 season data • Hints on 5th & 7th guess
        </p>
        
        <div style={{ marginBottom: '10px' }}>
          <div style={{ marginBottom: '6px', position: 'relative' }}>
            <label htmlFor="playerInput" style={{ display: 'block', marginBottom: '3px', fontWeight: 'normal', fontSize: '0.95rem' }}>
              Search for a player:
            </label>
            <input
              id="playerInput"
              type="text"
              placeholder="Type player name, team, or league..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onFocus={() => searchTerm && filteredPlayers.length > 0 && setShowDropdown(true)}
              onBlur={() => setTimeout(() => hideDropdown(), 150)}
              style={{
                width: '300px',
                padding: '8px',
                fontSize: '16px',
                border: '2px solid #ccc',
                borderRadius: '4px'
              }}
              autoComplete="off"
            />
            {showDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'white',
                border: '2px solid #ccc',
                borderTop: 'none',
                borderRadius: '0 0 4px 4px',
                maxHeight: '200px',
                overflowY: 'auto',
                zIndex: 1000
              }}>
                {filteredPlayers.map((player, index) => (
                  <div
                    key={player.player}
                    onClick={() => selectPlayer(player)}
                    style={{
                      padding: '8px',
                      cursor: 'pointer',
                      backgroundColor: index === highlightedIndex ? '#f0f0f0' : 'white',
                      borderBottom: '1px solid #eee'
                    }}
                  >
                    {player.player} ({player.team})
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontWeight: 'normal', color: '#666', fontSize: '0.9rem' }}>Hints:</span>
            <button
              onClick={useTeamHint}
              disabled={teamHintUsed || wrongGuesses < 4}
              style={{
                padding: '6px 12px',
                background: teamHintUsed || wrongGuesses < 4 ? '#ccc' : '#007cba',
                color: 'white',
                border: 'none',
                cursor: teamHintUsed || wrongGuesses < 4 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                borderRadius: '3px'
              }}
            >
              Team
            </button>
            <button
              onClick={useInitialHint}
              disabled={initialHintUsed || wrongGuesses < 6}
              style={{
                padding: '6px 12px',
                background: initialHintUsed || wrongGuesses < 6 ? '#ccc' : '#007cba',
                color: 'white',
                border: 'none',
                cursor: initialHintUsed || wrongGuesses < 6 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                borderRadius: '3px'
              }}
            >
              Initial
            </button>
          </div>
          
          <button
            onClick={makeGuess}
            disabled={!selectedPlayer || gameOver}
            style={{
              padding: '8px 16px',
              background: !selectedPlayer || gameOver ? '#ccc' : '#007cba',
              color: 'white',
              border: 'none',
              cursor: !selectedPlayer || gameOver ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              marginTop: '6px',
              borderRadius: '3px'
            }}
          >
            Make Guess
          </button>
        </div>
        
        <div style={{ marginBottom: '8px' }}>
          <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>
            Guesses: {guesses.length} / {maxGuesses}
          </span>
        </div>
        
        <div style={{ marginBottom: '8px', fontSize: '0.95rem', fontWeight: 'normal' }}>
          {gameWon && 'Congratulations! You found the player!'}
          {gameOver && !gameWon && `Game Over! The player was ${targetPlayer.player}`}
        </div>
        
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '1rem', fontWeight: 'normal', marginBottom: '8px' }}>
            Your Guesses:
          </div>
          
          {/* Desktop Headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
            gap: '5px',
            marginBottom: '10px',
            fontWeight: 'bold',
            background: '#f0f0f0',
            padding: '10px',
            borderRadius: '5px'
          }}>
            <div>Player</div>
            <div>League</div>
            <div>Team</div>
            <div>Age</div>
            <div>Runs</div>
            <div>SB</div>
            <div>HR</div>
            <div>OPS</div>
          </div>
          
          {/* Placeholder Row */}
          {guesses.length === 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
              gap: '5px',
              marginBottom: '5px'
            }}>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    padding: '8px',
                    borderRadius: '3px',
                    backgroundColor: '#e8e8e8',
                    color: '#999',
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}
                >
                  ?
                </div>
              ))}
            </div>
          )}
          
          {/* Guess Rows */}
          {guesses.map((guess, index) => (
            <div
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
                gap: '5px',
                marginBottom: '5px'
              }}
            >
              <div style={{
                padding: '8px',
                borderRadius: '3px',
                backgroundColor: getMatchColor(guess.player, targetPlayer.player),
                color: 'white',
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                {guess.player}
              </div>
              <div style={{
                padding: '8px',
                borderRadius: '3px',
                backgroundColor: getMatchColor(guess.league, targetPlayer.league),
                color: 'white',
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                {guess.league}
              </div>
              <div style={{
                padding: '8px',
                borderRadius: '3px',
                backgroundColor: getMatchColor(guess.team, targetPlayer.team),
                color: 'white',
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                {guess.team}
              </div>
              <div style={{
                padding: '8px',
                borderRadius: '3px',
                backgroundColor: getNumericMatchColor(guess.age, targetPlayer.age, 2),
                color: 'white',
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                {guess.age}{getArrow(guess.age, targetPlayer.age, 2)}
              </div>
              <div style={{
                padding: '8px',
                borderRadius: '3px',
                backgroundColor: getNumericMatchColor(guess.runs, targetPlayer.runs, 5),
                color: 'white',
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                {guess.runs}{getArrow(guess.runs, targetPlayer.runs, 5)}
              </div>
              <div style={{
                padding: '8px',
                borderRadius: '3px',
                backgroundColor: getNumericMatchColor(guess.sb, targetPlayer.sb, 2),
                color: 'white',
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                {guess.sb}{getArrow(guess.sb, targetPlayer.sb, 2)}
              </div>
              <div style={{
                padding: '8px',
                borderRadius: '3px',
                backgroundColor: getNumericMatchColor(guess.hr, targetPlayer.hr, 2),
                color: 'white',
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                {guess.hr}{getArrow(guess.hr, targetPlayer.hr, 2)}
              </div>
              <div style={{
                padding: '8px',
                borderRadius: '3px',
                backgroundColor: getNumericMatchColor(guess.ops, targetPlayer.ops, 0.1),
                color: 'white',
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                {guess.ops}{getArrow(guess.ops, targetPlayer.ops, 0.1)}
              </div>
            </div>
          ))}
        </div>
        
        {gameOver && (
          <button
            onClick={startNewGame}
            style={{
              padding: '10px 20px',
              background: '#007cba',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              borderRadius: '5px'
            }}
          >
            New Game
          </button>
        )}
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '0.8rem', color: '#666', lineHeight: '1.2' }}>
        <p style={{ margin: '5px 0' }}><strong>How to play:</strong> Search players by name, team, or league. Use arrows to navigate.</p>
        <p style={{ margin: '5px 0' }}>🟢 <strong>Green:</strong> Correct | 🟡 <strong>Yellow:</strong> Close (±3 years, ±10 runs, ±5 SB/HR, ±0.050 OPS) | ⬜ <strong>Gray:</strong> Wrong</p>
        <p style={{ margin: '5px 0' }}>↑ <strong>Target higher</strong> | ↓ <strong>Target lower</strong></p>
      </div>
      
      <style>{`
        @media (max-width: 600px) {
          div[style*="max-width: 1200px"] {
            max-width: none !important;
            margin: 0 !important;
            padding: 5px !important;
          }
          
          div[style*="max-width: 1200px"] > div:first-child {
            display: none !important;
          }
          
          div[style*="max-width: 1200px"] > p {
            display: none !important;
          }
          
          div[style*="grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr"] {
            grid-template-columns: 1.8fr 0.5fr 0.7fr 0.8fr 0.6fr 0.9fr 0.9fr 0.6fr !important;
            gap: 2px !important;
          }
          
          div[style*="grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr"] > div {
            padding: 6px !important;
            font-size: 11px !important;
          }
        }
      `}</style>
    </GamePageLayout>
  );
};

export default MLBPlayerGuess; 