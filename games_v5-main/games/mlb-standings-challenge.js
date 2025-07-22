// MLB Standings Challenge Game
(function() {
    // Initialize the game when this script loads
    window.initializeGame = function() {
        showMLBStandingsGame();
    };

    function showMLBStandingsGame() {
        document.getElementById('game-container').innerHTML = `
            <div style="text-align: center; max-width: 1200px; margin: 0 auto; padding-top: 5px;" id="mlb-standings-container">
                <div class="game-header">
                    <div class="game-title">MLB Standings Challenge</div>
                </div>
                <p style="margin: 0 0 8px 0; color: #666; font-size: 0.85rem;">Guess team rankings • 15 lives • Current season data</p>
                
                <div style="margin-bottom: 10px; display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
                    <div style="background: #f8f9fa; padding: 10px; border-radius: 6px; border: 1px solid #ddd; font-size: 0.9rem;">
                        <strong>Lives: <span id="mlb-standings-lives">15</span></strong>
                    </div>
                    <div style="background: #f8f9fa; padding: 10px; border-radius: 6px; border: 1px solid #ddd; font-size: 0.9rem;">
                        <strong>Teams Revealed: <span id="mlb-standings-progress">0/30</span></strong>
                    </div>
                </div>

                <div id="mlb-standings-message" class="game-message" style="display: none; margin-bottom: 10px;"></div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 15px;" id="mlb-standings-grid">
                    <div id="mlb-standings-al" class="league-standings"></div>
                    <div id="mlb-standings-nl" class="league-standings"></div>
                </div>

                <div style="margin-top: 8px;">
                    <button id="mlb-standings-new-game" onclick="newMLBStandingsGame()" style="padding: 6px 12px; background: white; border: 1px solid #ccc; cursor: pointer; font-size: 13px; border-radius: 3px;">
                        New Game
                    </button>
                    <button id="mobileHomeButton" onclick="goHome()" style="display: none; padding: 6px 12px; background: white; border: 1px solid #007cba; color: #007cba; cursor: pointer; font-size: 13px; border-radius: 3px; margin-left: 8px;">
                        ← Home
                    </button>
                </div>

                <div style="margin-top: 10px; font-size: 0.8rem; color: #666; line-height: 1.2;">
                    <p style="margin: 5px 0;"><strong>How to play:</strong> Click team positions to guess rankings.</p>
                    <p style="margin: 5px 0;">🟢 <strong>Green:</strong> Correct | 🔴 <strong>Red:</strong> Wrong</p>
                    <p style="margin: 5px 0;">Uses real MLB standings data!</p>
                </div>
                
                <style>
                    @media (max-width: 600px) {
                        #mlb-standings-container {
                            max-width: none !important;
                            margin: 0 !important;
                            padding: 5px !important;
                        }
                        /* Hide header completely on mobile */
                        #mlb-standings-container > div:first-child {
                            display: none !important;
                        }
                        /* Hide subtitle on mobile */
                        #mlb-standings-container > p {
                            display: none !important;
                        }
                        /* Show mobile home button */
                        #mobileHomeButton {
                            display: inline-block !important;
                        }
                    }
                </style>
            </div>
        `;
        
        // Initialize the game
        initializeMLBStandingsGame();
    }

class MLBStandingsGame {
    constructor() {
        this.alStandings = [];
        this.nlStandings = [];
        this.allTeams = [];
        this.lives = 15;
        this.maxLives = 15;
        this.gameOver = false;
        this.teamsRevealed = 0;
        this.totalTeams = 30;
        // Use 2025 as requested (will fall back to sample data if no current standings)
        this.currentSeason = 2025;
        
        // Team name to league mapping since API league info might be undefined
        this.teamLeagueMap = {
            "Arizona Diamondbacks": "NL",
            "Atlanta Braves": "NL", 
            "Baltimore Orioles": "AL",
            "Boston Red Sox": "AL",
            "Chicago Cubs": "NL",
            "Chicago White Sox": "AL",
            "Cincinnati Reds": "NL",
            "Cleveland Guardians": "AL",
            "Colorado Rockies": "NL",
            "Detroit Tigers": "AL",
            "Houston Astros": "AL",
            "Kansas City Royals": "AL",
            "Los Angeles Angels": "AL",
            "Los Angeles Dodgers": "NL",
            "Miami Marlins": "NL",
            "Milwaukee Brewers": "NL",
            "Minnesota Twins": "AL",
            "New York Mets": "NL",
            "New York Yankees": "AL",
            // Multiple Athletics mappings to handle API naming variations
            "Oakland Athletics": "AL",
            "Las Vegas Athletics": "AL",
            "Athletics": "AL",
            "Philadelphia Phillies": "NL",
            "Pittsburgh Pirates": "NL",
            "San Diego Padres": "NL",
            "San Francisco Giants": "NL",
            "Seattle Mariners": "AL",
            "St. Louis Cardinals": "NL",
            "Tampa Bay Rays": "AL",
            "Texas Rangers": "AL",
            "Toronto Blue Jays": "AL",
            "Washington Nationals": "NL"
        };
    }

    async initialize() {
        this.showMessage('Loading current MLB standings...', 'info');
        await this.loadStandingsData();
        this.setupGame();
    }

    async loadStandingsData() {
        try {
            // Try to fetch current season standings
            let apiUrl = `https://statsapi.mlb.com/api/v1/standings?leagueId=103,104&season=${this.currentSeason}&standingsTypes=regularSeason`;
            console.log(`Fetching standings from: ${apiUrl}`);
            
            let response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} - ${response.statusText}`);
            }
            
            let data = await response.json();
            console.log('API Response:', data);
            
            // Parse the standings data
            this.parseStandingsData(data);
            
            // Check if we got meaningful data (not all 0-0 records indicating season hasn't started)
            const hasGamesPlayed = this.allTeams.some(team => team.wins > 0 || team.losses > 0);
            
            console.log(`🔍 STANDINGS: alTeams=${this.alStandings.length}, nlTeams=${this.nlStandings.length}, hasGamesPlayed=${hasGamesPlayed}, currentSeason=${this.currentSeason}`);
            if (this.alStandings.length > 0 && this.nlStandings.length > 0 && hasGamesPlayed) {
                console.log(`✅ STANDINGS: Successfully loaded ${this.alStandings.length} AL teams and ${this.nlStandings.length} NL teams for ${this.currentSeason} season`);
                this.showMessage(`Loaded ${this.currentSeason} MLB standings successfully!`, 'success');
                setTimeout(() => this.hideMessage(), 2000);
            } else if (!hasGamesPlayed && this.currentSeason >= 2025) {
                // Try previous season if current season hasn't started
                console.log(`${this.currentSeason} season hasn't started, trying 2024...`);
                apiUrl = `https://statsapi.mlb.com/api/v1/standings?leagueId=103,104&season=2024&standingsTypes=regularSeason`;
                console.log(`Fetching 2024 standings from: ${apiUrl}`);
                
                response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`2024 API request failed: ${response.status} - ${response.statusText}`);
                }
                
                data = await response.json();
                this.parseStandingsData(data);
                
                if (this.alStandings.length > 0 && this.nlStandings.length > 0) {
                    console.log(`✅ STANDINGS: Successfully loaded 2024 standings as fallback (AL: ${this.alStandings.length}, NL: ${this.nlStandings.length})`);
                    this.showMessage(`Loaded 2024 MLB standings (${this.currentSeason} season hasn't started yet)`, 'success');
                    setTimeout(() => this.hideMessage(), 3000);
                } else {
                    throw new Error('No valid team data found in 2024 API response');
                }
            } else {
                throw new Error('No valid team data found in API response');
            }
            
        } catch (error) {
            console.error('🚨 STANDINGS: Error loading standings data:', error);
            this.showMessage(`Unable to load standings data from API. Using sample data for demo.`, 'error');
            this.loadSampleData();
            setTimeout(() => this.hideMessage(), 3000);
        }
    }

    parseStandingsData(data) {
        console.log('Parsing API data:', data);
        this.alStandings = [];
        this.nlStandings = [];
        this.allTeams = [];

        if (data.records && data.records.length > 0) {
            let allTeamsTemp = [];
            
                            data.records.forEach(division => {
                if (division.teamRecords) {
                    division.teamRecords.forEach(team => {
                        // Use our team league mapping instead of API league info
                        const leagueAbbr = this.teamLeagueMap[team.team.name] || 'Unknown';
                        const leagueFull = leagueAbbr === 'AL' ? 'American League' : leagueAbbr === 'NL' ? 'National League' : 'Unknown';
                        
                        // Log warning for unmapped teams
                        if (leagueAbbr === 'Unknown') {
                            console.warn(`⚠️ Unknown team name from API: "${team.team.name}" (ID: ${team.team.id})`);
                        }
                        
                        const teamData = {
                            id: team.team.id,
                            name: team.team.name,
                            wins: team.wins || 0,
                            losses: team.losses || 0,
                            winningPercentage: team.winningPercentage || '0.000',
                            leagueId: leagueAbbr === 'AL' ? 103 : leagueAbbr === 'NL' ? 104 : null,
                            league: leagueFull,
                            leagueAbbr: leagueAbbr,
                            revealed: false,
                            guessed: false,
                            correctGuess: null
                        };

                        // Only add teams we can properly map to a league
                        if (leagueAbbr !== 'Unknown') {
                            allTeamsTemp.push(teamData);
                            console.log('✅ Found team:', teamData.name, 'League:', teamData.leagueAbbr, 'Record:', teamData.wins + '-' + teamData.losses);
                        }
                    });
                }
            });

            // Separate by league abbreviation and sort by winning percentage
            const alTeams = allTeamsTemp.filter(team => team.leagueAbbr === 'AL');
            const nlTeams = allTeamsTemp.filter(team => team.leagueAbbr === 'NL');
            
            // Sort by winning percentage (descending)
            alTeams.sort((a, b) => parseFloat(b.winningPercentage) - parseFloat(a.winningPercentage));
            nlTeams.sort((a, b) => parseFloat(b.winningPercentage) - parseFloat(a.winningPercentage));
            
            // Assign league ranks
            alTeams.forEach((team, index) => {
                team.leagueRank = index + 1;
            });
            nlTeams.forEach((team, index) => {
                team.leagueRank = index + 1;
            });

            this.alStandings = alTeams;
            this.nlStandings = nlTeams;
            this.allTeams = [...this.alStandings, ...this.nlStandings];
            
            console.log(`Successfully parsed ${this.alStandings.length} AL teams and ${this.nlStandings.length} NL teams`);
            console.log('AL Teams:', this.alStandings.map(t => `${t.leagueRank}. ${t.name} (${t.wins}-${t.losses})`));
            console.log('NL Teams:', this.nlStandings.map(t => `${t.leagueRank}. ${t.name} (${t.wins}-${t.losses})`));
            
            // Check for missing teams
            if (this.alStandings.length !== 15) {
                console.warn(`⚠️ Missing AL teams! Expected 15, got ${this.alStandings.length}`);
                const foundALTeams = this.alStandings.map(t => t.name);
                const expectedALTeams = Object.keys(this.teamLeagueMap).filter(name => this.teamLeagueMap[name] === 'AL');
                const missingAL = expectedALTeams.filter(name => !foundALTeams.includes(name));
                console.warn('Missing AL teams:', missingAL);
            }
            if (this.nlStandings.length !== 15) {
                console.warn(`⚠️ Missing NL teams! Expected 15, got ${this.nlStandings.length}`);
                const foundNLTeams = this.nlStandings.map(t => t.name);
                const expectedNLTeams = Object.keys(this.teamLeagueMap).filter(name => this.teamLeagueMap[name] === 'NL');
                const missingNL = expectedNLTeams.filter(name => !foundNLTeams.includes(name));
                console.warn('Missing NL teams:', missingNL);
            }
        }

        // If we don't have the expected number of teams, use sample data (MLB has exactly 15 teams per league)
        if (this.alStandings.length < 14 || this.nlStandings.length < 14) {
            console.log(`Not enough teams found (AL: ${this.alStandings.length}, NL: ${this.nlStandings.length}), loading sample data`);
            this.loadSampleData();
        } else {
            console.log(`✅ Successfully using API data: ${this.alStandings.length} AL teams, ${this.nlStandings.length} NL teams`);
        }
    }

    loadSampleData() {
        console.log('Loading sample data...');
        // Sample data using realistic MLB team IDs
        this.alStandings = [
            { id: 110, name: "Baltimore Orioles", wins: 101, losses: 61, leagueRank: 1, league: "American League", revealed: false, guessed: false, correctGuess: null },
            { id: 117, name: "Houston Astros", wins: 90, losses: 72, leagueRank: 2, league: "American League", revealed: false, guessed: false },
            { id: 139, name: "Tampa Bay Rays", wins: 99, losses: 63, leagueRank: 3, league: "American League", revealed: false, guessed: false },
            { id: 141, name: "Toronto Blue Jays", wins: 89, losses: 73, leagueRank: 4, league: "American League", revealed: false, guessed: false },
            { id: 147, name: "New York Yankees", wins: 82, losses: 80, leagueRank: 5, league: "American League", revealed: false, guessed: false },
            { id: 136, name: "Seattle Mariners", wins: 88, losses: 74, leagueRank: 6, league: "American League", revealed: false, guessed: false },
            { id: 111, name: "Boston Red Sox", wins: 78, losses: 84, leagueRank: 7, league: "American League", revealed: false, guessed: false },
            { id: 142, name: "Minnesota Twins", wins: 87, losses: 75, leagueRank: 8, league: "American League", revealed: false, guessed: false },
            { id: 108, name: "Los Angeles Angels", wins: 73, losses: 89, leagueRank: 9, league: "American League", revealed: false, guessed: false },
            { id: 140, name: "Texas Rangers", wins: 90, losses: 72, leagueRank: 10, league: "American League", revealed: false, guessed: false },
            { id: 114, name: "Cleveland Guardians", wins: 76, losses: 86, leagueRank: 11, league: "American League", revealed: false, guessed: false },
            { id: 145, name: "Chicago White Sox", wins: 61, losses: 101, leagueRank: 12, league: "American League", revealed: false, guessed: false },
            { id: 116, name: "Detroit Tigers", wins: 78, losses: 84, leagueRank: 13, league: "American League", revealed: false, guessed: false },
            { id: 118, name: "Kansas City Royals", wins: 56, losses: 106, leagueRank: 14, league: "American League", revealed: false, guessed: false },
            { id: 133, name: "Oakland Athletics", wins: 50, losses: 112, leagueRank: 15, league: "American League", revealed: false, guessed: false }
        ];

        this.nlStandings = [
            { id: 144, name: "Atlanta Braves", wins: 104, losses: 58, leagueRank: 1, league: "National League", revealed: false, guessed: false },
            { id: 119, name: "Los Angeles Dodgers", wins: 100, losses: 62, leagueRank: 2, league: "National League", revealed: false, guessed: false },
            { id: 143, name: "Philadelphia Phillies", wins: 90, losses: 72, leagueRank: 3, league: "National League", revealed: false, guessed: false },
            { id: 158, name: "Milwaukee Brewers", wins: 88, losses: 74, leagueRank: 4, league: "National League", revealed: false, guessed: false },
            { id: 109, name: "Arizona Diamondbacks", wins: 84, losses: 78, leagueRank: 5, league: "National League", revealed: false, guessed: false },
            { id: 146, name: "Miami Marlins", wins: 84, losses: 78, leagueRank: 6, league: "National League", revealed: false, guessed: false },
            { id: 137, name: "San Francisco Giants", wins: 79, losses: 83, leagueRank: 7, league: "National League", revealed: false, guessed: false },
            { id: 113, name: "Cincinnati Reds", wins: 82, losses: 80, leagueRank: 8, league: "National League", revealed: false, guessed: false },
            { id: 112, name: "Chicago Cubs", wins: 83, losses: 79, leagueRank: 9, league: "National League", revealed: false, guessed: false },
            { id: 121, name: "New York Mets", wins: 75, losses: 87, leagueRank: 10, league: "National League", revealed: false, guessed: false },
            { id: 135, name: "San Diego Padres", wins: 82, losses: 80, leagueRank: 11, league: "National League", revealed: false, guessed: false },
            { id: 138, name: "St. Louis Cardinals", wins: 71, losses: 91, leagueRank: 12, league: "National League", revealed: false, guessed: false },
            { id: 134, name: "Pittsburgh Pirates", wins: 76, losses: 86, leagueRank: 13, league: "National League", revealed: false, guessed: false },
            { id: 120, name: "Washington Nationals", wins: 71, losses: 91, leagueRank: 14, league: "National League", revealed: false, guessed: false },
            { id: 115, name: "Colorado Rockies", wins: 59, losses: 103, leagueRank: 15, league: "National League", revealed: false, guessed: false }
        ];

        this.allTeams = [...this.alStandings, ...this.nlStandings];
    }

    setupGame() {
        this.lives = this.maxLives;
        this.gameOver = false;
        this.teamsRevealed = 0;
        
        // Reset all teams to unrevealed
        this.allTeams.forEach(team => {
            team.revealed = false;
            team.guessed = false;
            team.correctGuess = null;
        });

        this.renderStandings();
        this.updateDisplay();
        this.hideMessage();
    }

    renderStandings() {
        this.renderLeagueStandings('al', this.alStandings, 'American League');
        this.renderLeagueStandings('nl', this.nlStandings, 'National League');
    }

    renderLeagueStandings(leagueId, standings, leagueName) {
        const container = document.getElementById(`mlb-standings-${leagueId}`);
        if (!container) return;

        let html = `
            <div class="league-header">
                <h3>${leagueName}</h3>
            </div>
            <div class="standings-table">
                <div class="standings-header">
                    <div class="rank-col">Rank</div>
                    <div class="team-col">Team</div>
                    <div class="record-col">W-L</div>
                </div>
        `;

        standings.forEach(team => {
            const teamDisplay = team.revealed ? 
                `<span class="revealed-team ${team.correctGuess ? 'correct-guess' : 'incorrect-guess'}">${team.name}</span>` : 
                `<button class="hidden-team-btn" onclick="openTeamSelector(${team.id}, '${leagueId}', ${team.leagueRank})">
                    ${team.guessed ? '<span class="incorrect-guess">❌</span>' : ''}
                    Click to guess
                </button>`;

            // Determine row class based on reveal status and correctness
            let rowClass = 'standings-row';
            if (team.revealed) {
                rowClass += team.correctGuess ? ' revealed-correct' : ' revealed-incorrect';
            } else if (team.guessed && !team.revealed) {
                rowClass += ' guessed-wrong';
            }

            html += `
                <div class="${rowClass}">
                    <div class="rank-col">${team.leagueRank}</div>
                    <div class="team-col">${teamDisplay}</div>
                    <div class="record-col">${team.wins}-${team.losses}</div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    openTeamSelector(teamId, leagueId, rank) {
        if (this.gameOver) return;

        const team = this.allTeams.find(t => t.id === teamId);
        if (!team || team.revealed) return;

        // Create and show dropdown modal
        this.showTeamSelector(teamId, leagueId, rank);
    }

    showTeamSelector(teamId, leagueId, rank) {
        console.log('🎮 Starting simple team selection for team ID:', teamId);
        
        // Find the button that was clicked and replace it with inline selection
        const clickedButton = document.querySelector(`button[onclick*="${teamId}"]`);
        if (!clickedButton) {
            console.error('Could not find clicked button');
            return;
        }

        // Sort teams alphabetically for the dropdown
        const sortedTeams = [...this.allTeams].sort((a, b) => a.name.localeCompare(b.name));

        // Replace the button with an inline form
        clickedButton.parentElement.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 5px; background: #f8f9fa; border-radius: 4px; font-size: 0.85rem;">
                <strong style="font-size: 0.9rem;">Select team for ${leagueId.toUpperCase()} #${rank}:</strong>
                <select id="inline-team-selector-${teamId}" style="padding: 4px; border-radius: 3px; border: 1px solid #ccc; font-size: 0.8em; max-width: 180px;">
                    <option value="">Choose team...</option>
                    ${sortedTeams.map(team => 
                        `<option value="${team.id}">${team.name}</option>`
                    ).join('')}
                </select>
                <div style="display: flex; gap: 5px;">
                    <button id="inline-submit-${teamId}" disabled style="padding: 4px 8px; background: #28a745; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 0.75rem;">
                        Submit
                    </button>
                    <button id="inline-cancel-${teamId}" style="padding: 4px 8px; background: #6c757d; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 0.75rem;">
                        Cancel
                    </button>
                </div>
            </div>
        `;

        // Setup the inline form immediately
        const selector = document.getElementById(`inline-team-selector-${teamId}`);
        const submitBtn = document.getElementById(`inline-submit-${teamId}`);
        const cancelBtn = document.getElementById(`inline-cancel-${teamId}`);
        
        if (selector && submitBtn && cancelBtn) {
            console.log('✅ Inline elements found, setting up handlers');
            
            // Simple function to enable/disable submit button
            const updateButton = () => {
                if (selector.value) {
                    submitBtn.disabled = false;
                    submitBtn.style.backgroundColor = '#28a745';
                    submitBtn.style.opacity = '1';
                    console.log('🟢 Button ENABLED - Selection:', selector.value);
                } else {
                    submitBtn.disabled = true;
                    submitBtn.style.backgroundColor = '#ccc';
                    submitBtn.style.opacity = '0.6';
                    console.log('🔴 Button DISABLED');
                }
            };
            
            // Listen for selection changes
            selector.addEventListener('change', updateButton);
            
            // Handle submit with simple approach - store reference to game instance
            const gameInstance = this;
            submitBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('🚀 INLINE SUBMIT CLICKED!');
                console.log('Selected team ID:', selector.value);
                
                if (selector.value) {
                    // Call the submission method directly on the game instance
                    gameInstance.handleTeamGuess(teamId, parseInt(selector.value));
                } else {
                    alert('Please select a team first!');
                }
            });
            
            // Handle cancel button - just re-render to restore original state
            cancelBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🚫 Cancel button clicked, restoring original state');
                gameInstance.renderStandings();
            });
            
            // Initial state
            updateButton();
            selector.focus();
        } else {
            console.error('❌ Could not find inline elements');
        }
    }

    handleTeamGuess(actualTeamId, guessedTeamId) {
        console.log('🎯 handleTeamGuess called - Actual:', actualTeamId, 'Guessed:', guessedTeamId);

        const actualTeam = this.allTeams.find(t => t.id === actualTeamId);
        const guessedTeam = this.allTeams.find(t => t.id === guessedTeamId);
        
        console.log('Actual team:', actualTeam);
        console.log('Guessed team:', guessedTeam);

        if (!actualTeam || !guessedTeam) {
            console.error('Team not found!');
            alert('Error: Team not found. Please try again.');
            location.reload();
            return;
        }

        actualTeam.guessed = true;

        if (actualTeamId === guessedTeamId) {
            // Correct guess
            actualTeam.revealed = true;
            actualTeam.correctGuess = true;
            this.teamsRevealed++;
            
            // Check for win condition
            if (this.teamsRevealed >= this.totalTeams) {
                this.endGame(true);
                return;
            }
        } else {
            // Incorrect guess
            actualTeam.revealed = true;
            actualTeam.correctGuess = false;
            this.teamsRevealed++;
            this.lives--;
            
            // Check for lose condition
            if (this.lives <= 0) {
                this.endGame(false);
                return;
            }
        }

        // Re-render the standings
        this.renderStandings();
        this.updateDisplay();
    }

    // Keep the old method for compatibility with global functions
    submitTeamGuess(actualTeamId) {
        console.log('⚠️ Old submitTeamGuess called - this should not happen with new system');
        return;
    }

    getOrdinalSuffix(number) {
        const lastDigit = number % 10;
        const lastTwoDigits = number % 100;
        
        if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
            return 'th';
        }
        
        switch (lastDigit) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    }

    closeTeamSelector() {
        // No longer needed with inline selection system
        console.log('🗑️ closeTeamSelector called - not needed with new inline system');
    }

    endGame(won) {
        this.gameOver = true;
        this.closeTeamSelector();
        
        if (won) {
            this.showMessage(`🎉 Congratulations! You identified all 30 MLB teams with ${this.lives} lives remaining!`, 'success');
        } else {
            this.showMessage(`💀 Game Over! You ran out of lives. You identified ${this.teamsRevealed} out of ${this.totalTeams} teams.`, 'error');
        }
        
        this.updateDisplay();
    }

    newGame() {
        this.setupGame();
        this.showMessage('New game started! Click on any team position to make your guess.', 'info');
        setTimeout(() => this.hideMessage(), 3000);
    }

    updateDisplay() {
        // Update lives counter
        const livesDisplay = document.getElementById('mlb-standings-lives');
        if (livesDisplay) {
            livesDisplay.textContent = this.lives;
        }

        // Update teams revealed counter
        const progressDisplay = document.getElementById('mlb-standings-progress');
        if (progressDisplay) {
            progressDisplay.textContent = `${this.teamsRevealed}/${this.totalTeams}`;
        }

        // Update new game button
        const newGameBtn = document.getElementById('mlb-standings-new-game');
        if (newGameBtn) {
            newGameBtn.style.display = this.gameOver ? 'inline-block' : 'inline-block';
            newGameBtn.textContent = this.gameOver ? 'Play Again' : 'New Game';
        }
    }

    showMessage(message, type) {
        const messageElement = document.getElementById('mlb-standings-message');
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.className = `game-message ${type}`;
            messageElement.style.display = 'block';
        }
    }

    hideMessage() {
        const messageElement = document.getElementById('mlb-standings-message');
        if (messageElement) {
            messageElement.style.display = 'none';
        }
    }
}

// Global game instance
let mlbStandingsGame = null;

// Initialize game when section is opened
async function initializeMLBStandingsGame() {
    if (!mlbStandingsGame) {
        mlbStandingsGame = new MLBStandingsGame();
        await mlbStandingsGame.initialize();
    }
}

// Game functions
function openTeamSelector(teamId, leagueId, rank) {
    if (mlbStandingsGame) {
        mlbStandingsGame.openTeamSelector(teamId, leagueId, rank);
    }
}

function submitTeamGuess(teamId) {
    console.log('🎯 Global submitTeamGuess called with teamId:', teamId);
    
    // Check if button is actually disabled
    const submitBtn = document.getElementById('submit-guess-btn');
    if (submitBtn) {
        console.log('Submit button disabled state:', submitBtn.disabled);
        if (submitBtn.disabled) {
            console.log('❌ Button is disabled, not submitting');
            return;
        }
    }
    
    if (mlbStandingsGame) {
        console.log('✅ Calling game instance submitTeamGuess method');
        mlbStandingsGame.submitTeamGuess(teamId);
    } else {
        console.error('❌ mlbStandingsGame instance not found!');
    }
}

function closeTeamSelector() {
    if (mlbStandingsGame) {
        mlbStandingsGame.closeTeamSelector();
    }
}

function newMLBStandingsGame() {
    if (mlbStandingsGame) {
        mlbStandingsGame.newGame();
    }
}

// Expose global functions
window.openTeamSelector = openTeamSelector;
window.submitTeamGuess = submitTeamGuess;
window.closeTeamSelector = closeTeamSelector;
window.newMLBStandingsGame = newMLBStandingsGame;

// Auto-initialize if window.initializeGame exists
if (window.initializeGame) {
    window.initializeGame();
}

})(); // Close IIFE 