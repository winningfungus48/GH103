// MLB Division Challenge Game
(function() {
    // Initialize the game when this script loads
    window.initializeGame = function() {
        showMLBDivisionGame();
    };

    function showMLBDivisionGame() {
        document.getElementById('game-container').innerHTML = `
            <div style="text-align: center; max-width: 1400px; margin: 0 auto; padding-top: 5px;" id="mlb-division-container">
                <div class="game-header">
                    <div class="game-title">MLB Division Challenge</div>
                </div>
                <p style="margin: 0 0 8px 0; color: #666; font-size: 0.85rem;">Guess division rankings • 15 lives • Current season data</p>
                
                <div style="margin-bottom: 10px; display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
                    <div style="background: #f8f9fa; padding: 10px; border-radius: 6px; border: 1px solid #ddd; font-size: 0.9rem;">
                        <strong>Lives: <span id="mlb-division-lives">15</span></strong>
                    </div>
                    <div style="background: #f8f9fa; padding: 10px; border-radius: 6px; border: 1px solid #ddd; font-size: 0.9rem;">
                        <strong>Teams Revealed: <span id="mlb-division-progress">0/30</span></strong>
                    </div>
                </div>

                <div id="mlb-division-message" class="game-message" style="display: none; margin-bottom: 10px;"></div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;" id="mlb-division-grid">
                    <!-- AL Divisions (Left Column) -->
                    <div style="display: flex; flex-direction: column; gap: 15px;">
                        <div id="mlb-division-al-east" class="division-standings"></div>
                        <div id="mlb-division-al-central" class="division-standings"></div>
                        <div id="mlb-division-al-west" class="division-standings"></div>
                    </div>
                    
                    <!-- NL Divisions (Right Column) -->
                    <div style="display: flex; flex-direction: column; gap: 15px;">
                        <div id="mlb-division-nl-east" class="division-standings"></div>
                        <div id="mlb-division-nl-central" class="division-standings"></div>
                        <div id="mlb-division-nl-west" class="division-standings"></div>
                    </div>
                </div>

                <div style="margin-top: 8px;">
                    <button id="mlb-division-new-game" onclick="newMLBDivisionGame()" style="padding: 6px 12px; background: white; border: 1px solid #ccc; cursor: pointer; font-size: 13px; border-radius: 3px;">
                        New Game
                    </button>
                    <button id="mobileHomeButton" onclick="goHome()" style="display: none; padding: 6px 12px; background: white; border: 1px solid #007cba; color: #007cba; cursor: pointer; font-size: 13px; border-radius: 3px; margin-left: 8px;">
                        ← Home
                    </button>
                </div>

                <div style="margin-top: 10px; font-size: 0.8rem; color: #666; line-height: 1.2;">
                    <p style="margin: 5px 0;"><strong>How to play:</strong> Click team positions to guess division rankings.</p>
                    <p style="margin: 5px 0;">🟢 <strong>Green:</strong> Correct | 🔴 <strong>Red:</strong> Wrong</p>
                    <p style="margin: 5px 0;">Teams ranked 1-5 within each division!</p>
                </div>
                
                <style>
                    @media (max-width: 600px) {
                        #mlb-division-container {
                            max-width: none !important;
                            margin: 0 !important;
                            padding: 5px !important;
                        }
                        /* Hide header completely on mobile */
                        #mlb-division-container > div:first-child {
                            display: none !important;
                        }
                        /* Hide subtitle on mobile */
                        #mlb-division-container > p {
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
        initializeMLBDivisionGame();
    }

class MLBDivisionGame {
    constructor() {
        // Division standings
        this.divisions = {
            'AL East': [],
            'AL Central': [],
            'AL West': [],
            'NL East': [],
            'NL Central': [],
            'NL West': []
        };
        this.allTeams = [];
        this.lives = 15;
        this.maxLives = 15;
        this.gameOver = false;
        this.teamsRevealed = 0;
        this.totalTeams = 30;
        this.currentSeason = 2025;
        
        // Team name to league mapping
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
        this.showMessage('Loading current MLB standings by division...', 'info');
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
            
            // Parse the standings data by divisions
            this.parseStandingsDataByDivisions(data);
            
            // Check if we got meaningful data (use same logic as standings challenge)
            const hasGamesPlayed = this.allTeams.some(team => team.wins > 0 || team.losses > 0);
            const totalTeamsFound = Object.values(this.divisions).reduce((sum, div) => sum + div.length, 0);
            
            // Use identical success criteria as standings challenge
            console.log(`🔍 DIVISION: totalTeamsFound=${totalTeamsFound}, hasGamesPlayed=${hasGamesPlayed}, currentSeason=${this.currentSeason}`);
            if (totalTeamsFound >= 28 && hasGamesPlayed) {
                console.log(`✅ DIVISION: Successfully loaded ${totalTeamsFound} teams across all divisions for ${this.currentSeason} season`);
                this.showMessage(`Loaded ${this.currentSeason} MLB division standings successfully!`, 'success');
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
                this.parseStandingsDataByDivisions(data);
                
                const totalTeams2024 = Object.values(this.divisions).reduce((sum, div) => sum + div.length, 0);
                if (totalTeams2024 >= 28) {
                    console.log(`✅ DIVISION: Successfully loaded 2024 division standings as fallback (${totalTeams2024} teams)`);
                    this.showMessage(`Loaded 2024 MLB division standings (${this.currentSeason} season hasn't started yet)`, 'success');
                    setTimeout(() => this.hideMessage(), 3000);
                } else {
                    throw new Error('No valid team data found in 2024 API response');
                }
            } else {
                throw new Error('No valid team data found in API response');
            }
            
        } catch (error) {
            console.error('🚨 DIVISION: Error loading standings data:', error);
            this.showMessage(`Unable to load standings data from API. Using sample data for demo.`, 'error');
            this.loadSampleData();
            setTimeout(() => this.hideMessage(), 3000);
        }
    }

    parseStandingsDataByDivisions(data) {
        console.log('🔄 DIVISION: Parsing API data by divisions using same logic as standings game');
        
        // Reset divisions
        Object.keys(this.divisions).forEach(key => {
            this.divisions[key] = [];
        });
        this.allTeams = [];

        // Use the SAME parsing logic as the standings game
        if (data.records && data.records.length > 0) {
            let allTeamsTemp = [];
            
            data.records.forEach(division => {
                if (division.teamRecords) {
                    division.teamRecords.forEach(team => {
                        // Use our team league mapping instead of API league info
                        const leagueAbbr = this.teamLeagueMap[team.team.name] || 'Unknown';
                        
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
                            leagueAbbr: leagueAbbr,
                            revealed: false,
                            guessed: false,
                            correctGuess: null
                        };

                        // Only add teams we can properly map to a league
                        if (leagueAbbr !== 'Unknown') {
                            allTeamsTemp.push(teamData);
                            console.log('✅ DIVISION: Found team:', teamData.name, 'League:', teamData.leagueAbbr, 'Record:', teamData.wins + '-' + teamData.losses);
                        }
                    });
                }
            });

            // Now group teams by their actual divisions based on team names
            this.groupTeamsByDivisions(allTeamsTemp);
            
        }

        // If we don't have enough teams, use sample data
        const totalTeamsFound = Object.values(this.divisions).reduce((sum, div) => sum + div.length, 0);
        if (totalTeamsFound < 28) {
            console.log(`🚨 DIVISION: Not enough teams found (${totalTeamsFound}), loading sample data`);
            this.loadSampleData();
        } else {
            console.log(`✅ DIVISION: Successfully using API data: ${totalTeamsFound} teams across all divisions`);
        }
    }

    groupTeamsByDivisions(allTeamsTemp) {
        // Group teams by divisions based on their team names (since API division info is unreliable)
        const divisionMapping = {
            'AL East': ['Baltimore Orioles', 'Boston Red Sox', 'New York Yankees', 'Tampa Bay Rays', 'Toronto Blue Jays'],
            'AL Central': ['Chicago White Sox', 'Cleveland Guardians', 'Detroit Tigers', 'Kansas City Royals', 'Minnesota Twins'],
            'AL West': ['Houston Astros', 'Los Angeles Angels', 'Oakland Athletics', 'Las Vegas Athletics', 'Athletics', 'Seattle Mariners', 'Texas Rangers'],
            'NL East': ['Atlanta Braves', 'Miami Marlins', 'New York Mets', 'Philadelphia Phillies', 'Washington Nationals'],
            'NL Central': ['Chicago Cubs', 'Cincinnati Reds', 'Milwaukee Brewers', 'Pittsburgh Pirates', 'St. Louis Cardinals'],
            'NL West': ['Arizona Diamondbacks', 'Colorado Rockies', 'Los Angeles Dodgers', 'San Diego Padres', 'San Francisco Giants']
        };

        // Assign teams to divisions
        allTeamsTemp.forEach(team => {
            let assignedDivision = null;
            for (const [divisionKey, teamNames] of Object.entries(divisionMapping)) {
                if (teamNames.includes(team.name)) {
                    assignedDivision = divisionKey;
                    break;
                }
            }
            
            if (assignedDivision) {
                this.divisions[assignedDivision].push(team);
                this.allTeams.push(team);
                console.log(`✅ DIVISION: Assigned ${team.name} to ${assignedDivision}`);
            } else {
                console.warn(`⚠️ DIVISION: Could not assign ${team.name} to any division`);
            }
        });

        // Sort each division by winning percentage and assign ranks
        Object.keys(this.divisions).forEach(divisionKey => {
            this.divisions[divisionKey].sort((a, b) => parseFloat(b.winningPercentage) - parseFloat(a.winningPercentage));
            // Update division ranks after sorting
            this.divisions[divisionKey].forEach((team, index) => {
                team.divisionRank = index + 1;
                team.divisionName = divisionKey;
            });
        });
        
        // Log division summary
        Object.keys(this.divisions).forEach(divisionKey => {
            const teams = this.divisions[divisionKey];
            console.log(`🏟️ ${divisionKey}: ${teams.length} teams -`, teams.map(t => `${t.divisionRank}. ${t.name} (${t.wins}-${t.losses})`));
        });
    }

    loadSampleData() {
        console.log('Loading sample division data...');
        
        this.divisions = {
            'AL East': [
                { id: 110, name: "Baltimore Orioles", wins: 101, losses: 61, divisionRank: 1, divisionName: "AL East", revealed: false, guessed: false, correctGuess: null },
                { id: 139, name: "Tampa Bay Rays", wins: 99, losses: 63, divisionRank: 2, divisionName: "AL East", revealed: false, guessed: false, correctGuess: null },
                { id: 141, name: "Toronto Blue Jays", wins: 89, losses: 73, divisionRank: 3, divisionName: "AL East", revealed: false, guessed: false, correctGuess: null },
                { id: 147, name: "New York Yankees", wins: 82, losses: 80, divisionRank: 4, divisionName: "AL East", revealed: false, guessed: false, correctGuess: null },
                { id: 111, name: "Boston Red Sox", wins: 78, losses: 84, divisionRank: 5, divisionName: "AL East", revealed: false, guessed: false, correctGuess: null }
            ],
            'AL Central': [
                { id: 142, name: "Minnesota Twins", wins: 87, losses: 75, divisionRank: 1, divisionName: "AL Central", revealed: false, guessed: false, correctGuess: null },
                { id: 114, name: "Cleveland Guardians", wins: 76, losses: 86, divisionRank: 2, divisionName: "AL Central", revealed: false, guessed: false, correctGuess: null },
                { id: 116, name: "Detroit Tigers", wins: 78, losses: 84, divisionRank: 3, divisionName: "AL Central", revealed: false, guessed: false, correctGuess: null },
                { id: 118, name: "Kansas City Royals", wins: 56, losses: 106, divisionRank: 4, divisionName: "AL Central", revealed: false, guessed: false, correctGuess: null },
                { id: 145, name: "Chicago White Sox", wins: 61, losses: 101, divisionRank: 5, divisionName: "AL Central", revealed: false, guessed: false, correctGuess: null }
            ],
            'AL West': [
                { id: 117, name: "Houston Astros", wins: 90, losses: 72, divisionRank: 1, divisionName: "AL West", revealed: false, guessed: false, correctGuess: null },
                { id: 140, name: "Texas Rangers", wins: 90, losses: 72, divisionRank: 2, divisionName: "AL West", revealed: false, guessed: false, correctGuess: null },
                { id: 136, name: "Seattle Mariners", wins: 88, losses: 74, divisionRank: 3, divisionName: "AL West", revealed: false, guessed: false, correctGuess: null },
                { id: 108, name: "Los Angeles Angels", wins: 73, losses: 89, divisionRank: 4, divisionName: "AL West", revealed: false, guessed: false, correctGuess: null },
                { id: 133, name: "Oakland Athletics", wins: 50, losses: 112, divisionRank: 5, divisionName: "AL West", revealed: false, guessed: false, correctGuess: null }
            ],
            'NL East': [
                { id: 144, name: "Atlanta Braves", wins: 104, losses: 58, divisionRank: 1, divisionName: "NL East", revealed: false, guessed: false, correctGuess: null },
                { id: 143, name: "Philadelphia Phillies", wins: 90, losses: 72, divisionRank: 2, divisionName: "NL East", revealed: false, guessed: false, correctGuess: null },
                { id: 146, name: "Miami Marlins", wins: 84, losses: 78, divisionRank: 3, divisionName: "NL East", revealed: false, guessed: false, correctGuess: null },
                { id: 121, name: "New York Mets", wins: 75, losses: 87, divisionRank: 4, divisionName: "NL East", revealed: false, guessed: false, correctGuess: null },
                { id: 120, name: "Washington Nationals", wins: 71, losses: 91, divisionRank: 5, divisionName: "NL East", revealed: false, guessed: false, correctGuess: null }
            ],
            'NL Central': [
                { id: 158, name: "Milwaukee Brewers", wins: 88, losses: 74, divisionRank: 1, divisionName: "NL Central", revealed: false, guessed: false, correctGuess: null },
                { id: 112, name: "Chicago Cubs", wins: 83, losses: 79, divisionRank: 2, divisionName: "NL Central", revealed: false, guessed: false, correctGuess: null },
                { id: 113, name: "Cincinnati Reds", wins: 82, losses: 80, divisionRank: 3, divisionName: "NL Central", revealed: false, guessed: false, correctGuess: null },
                { id: 134, name: "Pittsburgh Pirates", wins: 76, losses: 86, divisionRank: 4, divisionName: "NL Central", revealed: false, guessed: false, correctGuess: null },
                { id: 138, name: "St. Louis Cardinals", wins: 71, losses: 91, divisionRank: 5, divisionName: "NL Central", revealed: false, guessed: false, correctGuess: null }
            ],
            'NL West': [
                { id: 119, name: "Los Angeles Dodgers", wins: 100, losses: 62, divisionRank: 1, divisionName: "NL West", revealed: false, guessed: false, correctGuess: null },
                { id: 109, name: "Arizona Diamondbacks", wins: 84, losses: 78, divisionRank: 2, divisionName: "NL West", revealed: false, guessed: false, correctGuess: null },
                { id: 135, name: "San Diego Padres", wins: 82, losses: 80, divisionRank: 3, divisionName: "NL West", revealed: false, guessed: false, correctGuess: null },
                { id: 137, name: "San Francisco Giants", wins: 79, losses: 83, divisionRank: 4, divisionName: "NL West", revealed: false, guessed: false, correctGuess: null },
                { id: 115, name: "Colorado Rockies", wins: 59, losses: 103, divisionRank: 5, divisionName: "NL West", revealed: false, guessed: false, correctGuess: null }
            ]
        };

        // Rebuild allTeams array
        this.allTeams = [];
        Object.values(this.divisions).forEach(division => {
            this.allTeams.push(...division);
        });
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

        this.renderDivisions();
        this.updateDisplay();
        this.hideMessage();
    }

    renderDivisions() {
        // Render each division
        Object.keys(this.divisions).forEach(divisionKey => {
            this.renderDivisionStandings(divisionKey, this.divisions[divisionKey]);
        });
    }

    renderDivisionStandings(divisionKey, standings) {
        const containerId = `mlb-division-${divisionKey.toLowerCase().replace(' ', '-')}`;
        const container = document.getElementById(containerId);
        if (!container) return;

        let html = `
            <div class="division-header">
                <h3>${divisionKey}</h3>
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
                `<button class="hidden-team-btn" onclick="openDivisionTeamSelector(${team.id}, '${divisionKey}', ${team.divisionRank})">
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
                    <div class="rank-col">${team.divisionRank}</div>
                    <div class="team-col">${teamDisplay}</div>
                    <div class="record-col">${team.wins}-${team.losses}</div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    openTeamSelector(teamId, divisionKey, rank) {
        if (this.gameOver) return;

        const team = this.allTeams.find(t => t.id === teamId);
        if (!team || team.revealed) return;

        // Create and show dropdown modal
        this.showTeamSelector(teamId, divisionKey, rank);
    }

    showTeamSelector(teamId, divisionKey, rank) {
        console.log('🎮 Starting division team selection for team ID:', teamId);
        
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
            <div style="display: flex; flex-direction: column; gap: 10px; padding: 10px; background: #f8f9fa; border-radius: 8px;">
                <strong>Select team for ${divisionKey} Rank #${rank}:</strong>
                <select id="inline-team-selector-${teamId}" style="padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
                    <option value="">Choose a team...</option>
                    ${sortedTeams.map(team => 
                        `<option value="${team.id}">${team.name}</option>`
                    ).join('')}
                </select>
                <div style="display: flex; gap: 10px;">
                    <button id="inline-submit-${teamId}" disabled style="padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Submit
                    </button>
                    <button id="inline-cancel-${teamId}" style="padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">
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
                gameInstance.renderDivisions();
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

        // Re-render the divisions
        this.renderDivisions();
        this.updateDisplay();
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

    endGame(won) {
        this.gameOver = true;
        
        if (won) {
            this.showMessage(`🎉 Congratulations! You identified all 30 MLB teams across all divisions with ${this.lives} lives remaining!`, 'success');
        } else {
            this.showMessage(`💀 Game Over! You ran out of lives. You identified ${this.teamsRevealed} out of ${this.totalTeams} teams.`, 'error');
        }
        
        this.updateDisplay();
    }

    newGame() {
        this.setupGame();
        this.showMessage('New game started! Click on any team position to make your guess.', 'info');
    }

    updateDisplay() {
        // Update lives counter
        const livesDisplay = document.getElementById('mlb-division-lives');
        if (livesDisplay) {
            livesDisplay.textContent = this.lives;
        }

        // Update teams revealed counter
        const progressDisplay = document.getElementById('mlb-division-progress');
        if (progressDisplay) {
            progressDisplay.textContent = `${this.teamsRevealed}/${this.totalTeams}`;
        }

        // Update new game button
        const newGameBtn = document.getElementById('mlb-division-new-game');
        if (newGameBtn) {
            newGameBtn.style.display = this.gameOver ? 'inline-block' : 'inline-block';
            newGameBtn.textContent = this.gameOver ? 'Play Again' : 'New Game';
        }
    }

    showMessage(message, type) {
        const messageElement = document.getElementById('mlb-division-message');
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.className = `game-message ${type}`;
            messageElement.style.display = 'block';
        }
    }

    hideMessage() {
        const messageElement = document.getElementById('mlb-division-message');
        if (messageElement) {
            messageElement.style.display = 'none';
        }
    }
}

// Global game instance
let mlbDivisionGame = null;

// Initialize game when section is opened
async function initializeMLBDivisionGame() {
    if (!mlbDivisionGame) {
        mlbDivisionGame = new MLBDivisionGame();
        await mlbDivisionGame.initialize();
    }
}

// Game functions
function openDivisionTeamSelector(teamId, divisionKey, rank) {
    if (mlbDivisionGame) {
        mlbDivisionGame.openTeamSelector(teamId, divisionKey, rank);
    }
}

function newMLBDivisionGame() {
    if (mlbDivisionGame) {
        mlbDivisionGame.newGame();
    }
}

// Expose global functions
window.openDivisionTeamSelector = openDivisionTeamSelector;
window.newMLBDivisionGame = newMLBDivisionGame;

// Auto-initialize if window.initializeGame exists
if (window.initializeGame) {
    window.initializeGame();
}

})(); // Close IIFE 