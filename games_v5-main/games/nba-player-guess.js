// NBA Player Guessing Game - Weddle Style Implementation
(function() {
    let playersData = [];
    let targetPlayer = null;
    let guesses = [];
    let gameWon = false;
    let gameOver = false;
    const maxGuesses = 8;
    let wrongGuesses = 0;
    let teamHintUsed = false;
    let initialHintUsed = false;
    
    // Initialize the game when this script loads
    window.initializeGame = function() {
        showNBAPlayerGame();
    };
    
    function showNBAPlayerGame() {
        document.getElementById('game-container').innerHTML = `
            <div style="text-align: center; max-width: 1200px; margin: 0 auto; padding-top: 5px;" id="gameContainer">
                <div class="game-header">
                    <div class="game-title">NBA Player Guess</div>
                </div>
                <p style="margin: 0 0 8px 0; color: #666; font-size: 0.85rem;">2024 season data • Hints on 5th & 7th guess</p>
                
                <div style="margin-bottom: 10px;">
                    <div style="margin-bottom: 6px; position: relative;">
                        <label for="playerInput" style="display: block; margin-bottom: 3px; font-weight: normal; font-size: 0.95rem;">Search for a player:</label>
                        <input 
                            id="playerInput" 
                            type="text" 
                            placeholder="Type player name, team, or position..."
                            style="width: 300px; padding: 8px; font-size: 16px; border: 2px solid #ccc; border-radius: 4px;"
                            autocomplete="off"
                        />
                        <div id="playerDropdown" style="position: absolute; top: 100%; left: 0; right: 0; background: white; border: 2px solid #ccc; border-top: none; border-radius: 0 0 4px 4px; max-height: 200px; overflow-y: auto; display: none; z-index: 1000;">
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 6px;">
                        <span style="font-weight: normal; color: #666; font-size: 0.9rem;">Hints:</span>
                        <button id="teamHintButton" onclick="useTeamHint()" disabled style="padding: 6px 12px; background: #ccc; color: white; border: none; cursor: not-allowed; font-size: 14px; border-radius: 3px;">
                            Team
                        </button>
                        <button id="initialHintButton" onclick="useInitialHint()" disabled style="padding: 6px 12px; background: #ccc; color: white; border: none; cursor: not-allowed; font-size: 14px; border-radius: 3px;">
                            Initial
                        </button>
                    </div>
                    <button id="guessButton" onclick="makeGuess()" disabled style="padding: 8px 16px; background: #007cba; color: white; border: none; cursor: not-allowed; font-size: 14px; margin-top: 6px; border-radius: 3px;">
                        Make Guess
                    </button>
                </div>
                
                <div style="margin-bottom: 8px;">
                    <span style="font-size: 1rem; font-weight: normal;">Guesses: <span id="guessCount">0</span> / ${maxGuesses}</span>
                </div>
                
                <div id="gameStatus" style="margin-bottom: 8px; font-size: 0.95rem; font-weight: normal;"></div>
                
                <div id="guessesContainer" style="margin-bottom: 12px;">
                    <div id="guessesHeader" style="display: none;">
                        <div style="font-size: 1rem; font-weight: normal; margin-bottom: 8px;">Your Guesses:</div>
                        <div id="desktopHeaders" style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr; gap: 5px; margin-bottom: 10px; font-weight: bold; background: #f0f0f0; padding: 10px; border-radius: 5px;">
                            <div>Player</div>
                            <div>Conference</div>
                            <div>Team</div>
                            <div>Position</div>
                            <div>Age</div>
                            <div>PPG</div>
                            <div>RPG</div>
                            <div>APG</div>
                        </div>
                        <div id="mobileHeaders" style="display: none; grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr; gap: 2px; margin-bottom: 10px; font-weight: bold; background: #f0f0f0; padding: 6px; border-radius: 5px;">
                            <div style="text-align: center; min-width: 70px; font-size: 11px;">Player</div>
                            <div style="text-align: center; min-width: 40px; font-size: 11px;">Con.</div>
                            <div style="text-align: center; min-width: 40px; font-size: 11px;">Tm.</div>
                            <div style="text-align: center; min-width: 40px; font-size: 11px;">Pos.</div>
                            <div style="text-align: center; min-width: 40px; font-size: 11px;">Age</div>
                            <div style="text-align: center; min-width: 40px; font-size: 11px;">Pts</div>
                            <div style="text-align: center; min-width: 40px; font-size: 11px;">Reb</div>
                            <div style="text-align: center; min-width: 40px; font-size: 11px;">Ast</div>
                        </div>
                        <style>
                            @media (max-width: 600px) {
                                #gameContainer {
                                    max-width: none !important;
                                    margin: 0 !important;
                                    padding: 5px !important;
                                }
                                /* Hide header completely on mobile */
                                #gameContainer > div:first-child {
                                    display: none !important;
                                }
                                /* Hide subtitle on mobile */
                                #gameContainer > p {
                                    display: none !important;
                                }
                                #desktopHeaders { display: none !important; }
                                #mobileHeaders { 
                                    display: grid !important; 
                                    width: 100% !important;
                                    min-width: 360px !important;
                                }
                                #mobileHeaders > div { 
                                    min-height: 35px; 
                                    display: flex; 
                                    align-items: center; 
                                    justify-content: center;
                                    font-weight: bold !important;
                                }
                                #guessesContainer {
                                    overflow-x: auto !important;
                                    width: 100% !important;
                                    -webkit-overflow-scrolling: touch !important;
                                }
                                #guessesList > div {
                                    grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr !important;
                                    gap: 2px !important;
                                    min-width: 360px !important;
                                    padding: 6px !important;
                                    margin-bottom: 3px !important;
                                }
                                #guessesList > div > div {
                                    text-align: center !important;
                                    padding: 4px 1px !important;
                                    overflow: hidden !important;
                                    text-overflow: ellipsis !important;
                                    font-size: 10px !important;
                                    line-height: 1.2 !important;
                                    border-radius: 2px !important;
                                    min-width: 28px !important;
                                }
                                #guessesList > div > div:first-child {
                                    text-align: left !important;
                                    font-size: 11px !important;
                                    font-weight: bold !important;
                                    min-width: 70px !important;
                                    max-width: 70px !important;
                                    overflow: hidden !important;
                                    text-overflow: ellipsis !important;
                                }
                                #guessesList {
                                    width: 100% !important;
                                    overflow-x: auto !important;
                                    -webkit-overflow-scrolling: touch !important;
                                }
                                /* Make the entire guesses container scrollable */
                                #guessesHeader,
                                #guessesList {
                                    min-width: 360px !important;
                                }
                                /* Show mobile home button */
                                #mobileHomeButton {
                                    display: inline-block !important;
                                }
                            }
                        </style>
                    </div>
                    <div id="guessesList"></div>
                </div>
                
                <div style="margin-top: 8px;">
                    <button id="newGameButton" onclick="startNewGame()" style="padding: 6px 12px; background: white; border: 1px solid #ccc; cursor: pointer; font-size: 13px; border-radius: 3px;">
                        New Game
                    </button>
                    <button id="mobileHomeButton" onclick="goHome()" style="display: none; padding: 6px 12px; background: white; border: 1px solid #007cba; color: #007cba; cursor: pointer; font-size: 13px; border-radius: 3px; margin-left: 8px;">
                        ← Home
                    </button>
                </div>
                
                <div style="margin-top: 10px; font-size: 0.8rem; color: #666; line-height: 1.2;">
                    <p style="margin: 5px 0;"><strong>How to play:</strong> Search players by name, team, or position. Use arrows to navigate.</p>
                    <p style="margin: 5px 0;">🟢 <strong>Green:</strong> Correct | 🟡 <strong>Yellow:</strong> Close (±3 years, ±5 PPG, ±3 RPG, ±2 APG) | ⬜ <strong>Gray:</strong> Wrong</p>
                    <p style="margin: 5px 0;">↑ <strong>Target higher</strong> | ↓ <strong>Target lower</strong></p>
                </div>
            </div>
        `;
        
        loadPlayersData();
    }
    
    async function loadPlayersData() {
        try {
            const response = await fetch('./data/nba_players.csv');
            const csvText = await response.text();
            
            // Parse CSV data
            const lines = csvText.trim().split('\n');
            const headers = lines[0].split(',');
            
            playersData = lines.slice(1).map(line => {
                const values = parseCSVLine(line);
                return {
                    Player: values[0],
                    Conference: values[1],
                    Team: values[2],
                    Age: parseInt(values[3]),
                    Position: values[4],
                    PPG: parseFloat(values[5]),
                    RPG: parseFloat(values[6]),
                    APG: parseFloat(values[7])
                };
            }).filter(player => player.Player); // Filter out empty rows
            
            setupSearchableDropdown();
            selectRandomTarget();
            
        } catch (error) {
            console.error('Error loading players data:', error);
            document.getElementById('playerInput').placeholder = 'Error loading players';
        }
    }
    
    function parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current);
        return result;
    }
    
    let selectedPlayerIndex = null;
    let filteredPlayers = [];
    let highlightedIndex = -1;
    
    function setupSearchableDropdown() {
        const input = document.getElementById('playerInput');
        const dropdown = document.getElementById('playerDropdown');
        
        // Sort players alphabetically but keep original indices
        const sortedPlayers = playersData
            .map((player, index) => ({ player, originalIndex: index }))
            .sort((a, b) => a.player.Player.localeCompare(b.player.Player));
        
        input.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            if (searchTerm === '') {
                filteredPlayers = [];
                hideDropdown();
                clearSelection();
                return;
            }
            
            filteredPlayers = sortedPlayers.filter(({ player }) => 
                player.Player.toLowerCase().includes(searchTerm) ||
                player.Team.toLowerCase().includes(searchTerm) ||
                player.Position.toLowerCase().includes(searchTerm)
            );
            
            highlightedIndex = -1;
            showFilteredResults();
        });
        
        input.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (highlightedIndex < filteredPlayers.length - 1) {
                    highlightedIndex++;
                    updateHighlight();
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (highlightedIndex > 0) {
                    highlightedIndex--;
                    updateHighlight();
                }
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < filteredPlayers.length) {
                    const selectedData = filteredPlayers[highlightedIndex];
                    selectPlayer(selectedData);
                }
            } else if (e.key === 'Escape') {
                hideDropdown();
                clearSelection();
            }
        });
        
        // Hide dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!input.contains(e.target) && !dropdown.contains(e.target)) {
                hideDropdown();
            }
        });
    }
    
    function showFilteredResults() {
        const dropdown = document.getElementById('playerDropdown');
        
        if (filteredPlayers.length === 0) {
            dropdown.innerHTML = '<div style="padding: 10px; color: #666;">No players found</div>';
        } else {
            dropdown.innerHTML = filteredPlayers.map(({ player, originalIndex }, index) => 
                `<div class="player-option" data-index="${originalIndex}" data-highlight-index="${index}" style="padding: 10px; cursor: pointer; border-bottom: 1px solid #eee;">
                    ${player.Player} <span style="color: #666;">(${player.Team} ${player.Position})</span>
                </div>`
            ).join('');
            
            // Add click listeners to options
            dropdown.querySelectorAll('.player-option').forEach(option => {
                option.addEventListener('click', function() {
                    const originalIndex = parseInt(this.dataset.index);
                    const playerData = playersData[originalIndex];
                    selectPlayer({ player: playerData, originalIndex });
                });
                
                option.addEventListener('mouseenter', function() {
                    highlightedIndex = parseInt(this.dataset.highlightIndex);
                    updateHighlight();
                });
            });
        }
        
        dropdown.style.display = 'block';
    }
    
    function updateHighlight() {
        const dropdown = document.getElementById('playerDropdown');
        const options = dropdown.querySelectorAll('.player-option');
        
        options.forEach((option, index) => {
            if (index === highlightedIndex) {
                option.style.background = '#007cba';
                option.style.color = 'white';
            } else {
                option.style.background = 'white';
                option.style.color = 'black';
            }
        });
    }
    
    function selectPlayer({ player, originalIndex }) {
        selectedPlayerIndex = originalIndex;
        document.getElementById('playerInput').value = player.Player;
        hideDropdown();
        updateGuessButton();
    }
    
    function hideDropdown() {
        document.getElementById('playerDropdown').style.display = 'none';
    }
    
    function clearSelection() {
        selectedPlayerIndex = null;
        updateGuessButton();
    }
    
    function updateGuessButton() {
        const button = document.getElementById('guessButton');
        if (selectedPlayerIndex !== null && !gameOver) {
            button.disabled = false;
            button.style.background = '#007cba';
            button.style.cursor = 'pointer';
        } else {
            button.disabled = true;
            button.style.background = '#ccc';
            button.style.cursor = 'not-allowed';
        }
    }
    
    function updateHintButtons() {
        const teamHintButton = document.getElementById('teamHintButton');
        const initialHintButton = document.getElementById('initialHintButton');
        
        // Team hint becomes available on 5th guess
        if (wrongGuesses >= 4 && !teamHintUsed) {
            teamHintButton.disabled = false;
            teamHintButton.style.background = '#007cba';
            teamHintButton.style.cursor = 'pointer';
        }
        
        // Initial hint becomes available on 7th guess
        if (wrongGuesses >= 6 && !initialHintUsed) {
            initialHintButton.disabled = false;
            initialHintButton.style.background = '#007cba';
            initialHintButton.style.cursor = 'pointer';
        }
    }
    
    function useTeamHint() {
        if (wrongGuesses >= 4 && !teamHintUsed) {
            teamHintUsed = true;
            const button = document.getElementById('teamHintButton');
            button.textContent = targetPlayer.Team;
            button.disabled = true;
            button.style.background = '#28a745';
            button.style.cursor = 'not-allowed';
        }
    }
    
    function useInitialHint() {
        if (wrongGuesses >= 6 && !initialHintUsed) {
            initialHintUsed = true;
            const button = document.getElementById('initialHintButton');
            button.textContent = targetPlayer.Player.charAt(0);
            button.disabled = true;
            button.style.background = '#28a745';
            button.style.cursor = 'not-allowed';
        }
    }
    
    function selectRandomTarget() {
        const randomIndex = Math.floor(Math.random() * playersData.length);
        targetPlayer = playersData[randomIndex];
        console.log('Target player:', targetPlayer.Player); // For debugging
    }
    
    function makeGuess() {
        if (selectedPlayerIndex === null || gameOver) return;
        
        const guessedPlayer = playersData[selectedPlayerIndex];
        
        // Check if player has already been guessed
        if (guesses.some(guess => guess.Player === guessedPlayer.Player)) {
            alert('You have already guessed this player!');
            return;
        }
        
        guesses.push(guessedPlayer);
        
        // Check if it's a correct guess
        if (guessedPlayer.Player === targetPlayer.Player) {
            gameWon = true;
            gameOver = true;
            showGameResult(true);
        } else {
            wrongGuesses++;
            updateHintButtons();
            
            // Check if max guesses reached
            if (guesses.length >= maxGuesses) {
                gameOver = true;
                showGameResult(false);
            }
        }
        
        // Clear input and update display
        document.getElementById('playerInput').value = '';
        selectedPlayerIndex = null;
        updateGuessButton();
        updateGuessesDisplay();
        updateGuessCount();
    }
    
    function updateGuessesDisplay() {
        const header = document.getElementById('guessesHeader');
        const list = document.getElementById('guessesList');
        
        if (guesses.length > 0) {
            header.style.display = 'block';
        }
        
        // Clear and rebuild the list
        list.innerHTML = '';
        
        guesses.forEach(guess => {
            const row = document.createElement('div');
            row.style.cssText = 'display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr; gap: 5px; margin-bottom: 5px; padding: 10px; border-radius: 5px; border: 1px solid #ddd;';
            
            // Player name
            row.appendChild(createCell(guess.Player, '#f8f9fa'));
            
            // Conference
            row.appendChild(createCell(guess.Conference, getMatchColor(guess.Conference, targetPlayer.Conference)));
            
            // Team
            row.appendChild(createCell(guess.Team, getMatchColor(guess.Team, targetPlayer.Team)));
            
            // Position
            row.appendChild(createCell(guess.Position, getMatchColor(guess.Position, targetPlayer.Position)));
            
            // Age
            row.appendChild(createCell(
                guess.Age + getArrow(guess.Age, targetPlayer.Age, 3),
                getNumericMatchColor(guess.Age, targetPlayer.Age, 3)
            ));
            
            // PPG
            row.appendChild(createCell(
                guess.PPG.toFixed(1) + getArrow(guess.PPG, targetPlayer.PPG, 5),
                getNumericMatchColor(guess.PPG, targetPlayer.PPG, 5)
            ));
            
            // RPG
            row.appendChild(createCell(
                guess.RPG.toFixed(1) + getArrow(guess.RPG, targetPlayer.RPG, 3),
                getNumericMatchColor(guess.RPG, targetPlayer.RPG, 3)
            ));
            
            // APG
            row.appendChild(createCell(
                guess.APG.toFixed(1) + getArrow(guess.APG, targetPlayer.APG, 2),
                getNumericMatchColor(guess.APG, targetPlayer.APG, 2)
            ));
            
            list.appendChild(row);
        });
    }
    
    function createCell(content, backgroundColor) {
        const cell = document.createElement('div');
        cell.textContent = content;
        cell.style.cssText = `background: ${backgroundColor}; padding: 8px; text-align: center; border-radius: 3px; font-weight: bold;`;
        return cell;
    }
    
    function getMatchColor(guessValue, targetValue) {
        return guessValue === targetValue ? '#90EE90' : '#D3D3D3'; // Green or Gray
    }
    
    function getNumericMatchColor(guessValue, targetValue, threshold) {
        if (guessValue === targetValue) {
            return '#90EE90'; // Green
        } else if (Math.abs(guessValue - targetValue) <= threshold) {
            return '#FFD700'; // Yellow
        } else {
            return '#D3D3D3'; // Gray
        }
    }
    
    function getArrow(guessValue, targetValue, threshold) {
        if (guessValue === targetValue) {
            return ''; // No arrow for exact match
        } else if (Math.abs(guessValue - targetValue) <= threshold) {
            return guessValue < targetValue ? ' ↑' : ' ↓';
        } else {
            return guessValue < targetValue ? ' ↑' : ' ↓';
        }
    }
    
    function updateGuessCount() {
        document.getElementById('guessCount').textContent = guesses.length;
    }
    
    function showGameResult(won) {
        const statusDiv = document.getElementById('gameStatus');
        if (won) {
            statusDiv.innerHTML = `🎉 <span style="color: green;">Congratulations! You guessed ${targetPlayer.Player}!</span>`;
        } else {
            statusDiv.innerHTML = `😔 <span style="color: red;">Game Over! The answer was ${targetPlayer.Player} (${targetPlayer.Team} ${targetPlayer.Position})</span>`;
        }
        updateNewGameButton();
    }
    
    function updateNewGameButton() {
        const newGameButton = document.getElementById('newGameButton');
        if (gameOver) {
            newGameButton.style.background = '#28a745';
            newGameButton.style.color = 'white';
            newGameButton.style.border = 'none';
        } else {
            newGameButton.style.background = 'white';
            newGameButton.style.color = 'black';
            newGameButton.style.border = '2px solid black';
        }
    }
    
    function startNewGame() {
        guesses = [];
        gameWon = false;
        gameOver = false;
        wrongGuesses = 0;
        teamHintUsed = false;
        initialHintUsed = false;
        
        document.getElementById('guessesList').innerHTML = '';
        document.getElementById('guessesHeader').style.display = 'none';
        document.getElementById('gameStatus').innerHTML = '';
        document.getElementById('guessCount').textContent = '0';
        document.getElementById('playerInput').value = '';
        
        // Reset hint buttons
        const teamHintButton = document.getElementById('teamHintButton');
        const initialHintButton = document.getElementById('initialHintButton');
        teamHintButton.textContent = 'Team';
        teamHintButton.style.background = '#ccc';
        teamHintButton.disabled = true;
        teamHintButton.style.cursor = 'not-allowed';
        initialHintButton.textContent = 'Initial';
        initialHintButton.style.background = '#ccc';
        initialHintButton.disabled = true;
        initialHintButton.style.cursor = 'not-allowed';
        
        selectedPlayerIndex = null;
        hideDropdown();
        selectRandomTarget();
        updateGuessButton();
        updateNewGameButton();
    }
    
    // Global functions
    window.makeGuess = makeGuess;
    window.startNewGame = startNewGame;
    window.useTeamHint = useTeamHint;
    window.useInitialHint = useInitialHint;
    
    // Auto-initialize when script loads
    if (window.initializeGame) {
        window.initializeGame();
    }
})(); 