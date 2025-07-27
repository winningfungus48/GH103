// Pitcher Data Quiz Game
(function() {
    // Initialize the game when this script loads
    window.initializeGame = function() {
        showMLBComparisonGame();
    };

    function showMLBComparisonGame() {
        document.getElementById('game-container').innerHTML = `
            <div style="text-align: center; max-width: 1200px; margin: 0 auto; padding-top: 5px; min-height: 600px;" id="mlb-comparison-container">
                <div class="game-header">
                    <div class="game-title">Pitcher Data Quiz</div>
                </div>
                <p style="margin: 0 0 8px 0; color: #666; font-size: 0.85rem;">Compare pitchers • 10 questions • 2025 season data</p>
                
                <div style="margin-bottom: 10px; display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
                    <div style="background: #f8f9fa; padding: 10px; border-radius: 6px; border: 1px solid #ddd; font-size: 0.9rem;">
                        <strong>Question: <span id="mlb-comparison-question-number">1</span> / 10</strong>
                    </div>
                    <div style="background: #f8f9fa; padding: 10px; border-radius: 6px; border: 1px solid #ddd; font-size: 0.9rem;">
                        <strong>Score: <span id="mlb-comparison-score">0</span> / 10</strong>
                    </div>
                </div>

                <div id="mlb-comparison-message" class="game-message" style="display: none; margin-bottom: 10px;"></div>

                <div id="mlb-comparison-question-container" style="margin-bottom: 15px;">
                    <!-- Game content will be loaded here -->
                </div>

                <div style="margin-top: 8px;">
                    <button id="mlb-comparison-new-game" onclick="newMLBComparisonGame()" style="padding: 6px 12px; background: white; border: 1px solid #ccc; cursor: pointer; font-size: 13px; border-radius: 3px;">
                        New Game
                    </button>
                    <button id="mobileHomeButton" onclick="goHome()" style="display: none; padding: 6px 12px; background: white; border: 1px solid #007cba; color: #007cba; cursor: pointer; font-size: 13px; border-radius: 3px; margin-left: 8px;">
                        ← Home
                    </button>
                </div>

                <div style="margin-top: 10px; font-size: 0.8rem; color: #666; line-height: 1.2;">
                    <p style="margin: 5px 0;"><strong>How to play:</strong> Click the pitcher with the better stat.</p>
                    <p style="margin: 5px 0;">🟢 <strong>Green:</strong> Correct | 🔴 <strong>Red:</strong> Wrong</p>
                    <p style="margin: 5px 0;">Uses real 2025 MLB pitcher data!</p>
                </div>
                
                <style>
                    @media (max-width: 600px) {
                        #mlb-comparison-container {
                            max-width: none !important;
                            margin: 0 !important;
                            padding: 5px !important;
                        }
                        /* Hide header completely on mobile */
                        #mlb-comparison-container > div:first-child {
                            display: none !important;
                        }
                        /* Hide subtitle on mobile */
                        #mlb-comparison-container > p {
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
        initializeMLBComparisonGame();
    }

class MLBComparisonGame {
    constructor() {
        this.pitchersData = [];
        this.currentQuestion = 1;
        this.score = 0;
        this.maxQuestions = 10;
        this.gameOver = false;
        this.currentPlayerA = null;
        this.currentPlayerB = null;
        this.currentStat = null;
        this.currentStatName = null;
        this.currentQuestionType = null; // 'lower', 'higher', or 'more'
        this.currentQuestionText = null;
        this.answeredCurrentQuestion = false;
        
        // Available stats to compare with question phrasing (ERA weighted more heavily)
        this.availableStats = [
            { key: 'ERA', name: 'ERA', question: 'Who has a lower ERA?', better: 'lower' },
            { key: 'ERA', name: 'ERA', question: 'Who has a lower ERA?', better: 'lower' },
            { key: 'ERA', name: 'ERA', question: 'Who has a lower ERA?', better: 'lower' },
            { key: 'Walks', name: 'Walks', question: 'Who has fewer walks allowed?', better: 'lower' },
            { key: 'Strikeouts', name: 'Strikeouts', question: 'Who has more strikeouts?', better: 'higher' },
            { key: 'SOBBRatio', name: 'SO/BB Ratio', question: 'Who has a higher SO/BB ratio?', better: 'higher' }
        ];
    }

    async initialize() {
        await this.loadPitchersData();
    }

    async loadPitchersData() {
        try {
            console.log('Fetching pitcher data CSV...');
            const response = await fetch('./data/pitcher_data.csv');
            console.log('Fetch response:', response.status, response.statusText);
            
            if (!response.ok) {
                throw new Error(`Failed to load pitcher data CSV: ${response.status} ${response.statusText}`);
            }
            
            const csvText = await response.text();
            console.log('CSV text length:', csvText.length);
            
            const lines = csvText.trim().split('\n');
            console.log('CSV lines:', lines.length);
            
            // Parse CSV data
            this.pitchersData = lines.slice(1).map((line, index) => {
                try {
                    const values = this.parseCSVLine(line);
                    console.log(`Parsing line ${index + 1}:`, values);
                    
                    return {
                        Player: values[0],
                        Team: values[1],
                        ERA: parseFloat(values[2]),
                        InningsPitched: parseFloat(values[3]),
                        EarnedRuns: parseInt(values[4]),
                        Walks: parseInt(values[5]),
                        Strikeouts: parseInt(values[6]),
                        SOBBRatio: parseFloat(values[7])
                    };
                } catch (parseError) {
                    console.error(`Error parsing line ${index + 1}:`, line, parseError);
                    return null;
                }
            }).filter(pitcher => pitcher !== null);

            console.log(`Successfully loaded ${this.pitchersData.length} pitchers from CSV`);
            console.log('Sample pitcher data:', this.pitchersData[0]);
            
            if (this.pitchersData.length < 10) {
                throw new Error(`Not enough pitchers found (${this.pitchersData.length}). Need at least 10 to play.`);
            }
            
            // Start the game immediately
            this.hideMessage();
            this.startGame();
            
        } catch (error) {
            console.error('Error loading pitcher data:', error);
            this.showMessage(`Failed to load pitcher data: ${error.message}`, 'error');
            throw error; // Re-throw to be caught by initializeMLBComparisonGame
        }
    }

    parseCSVLine(line) {
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



    startGame() {
        this.currentQuestion = 1;
        this.score = 0;
        this.gameOver = false;
        this.updateDisplay();
        this.generateQuestion();
    }

    generateQuestion() {
        if (this.gameOver || this.currentQuestion > this.maxQuestions) {
            this.endGame();
            return;
        }
        
        // Reset answered flag
        this.answeredCurrentQuestion = false;
        
        // Select two random pitchers
        const playerAIndex = Math.floor(Math.random() * this.pitchersData.length);
        let playerBIndex;
        do {
            playerBIndex = Math.floor(Math.random() * this.pitchersData.length);
        } while (playerBIndex === playerAIndex);
        
        this.currentPlayerA = this.pitchersData[playerAIndex];
        this.currentPlayerB = this.pitchersData[playerBIndex];
        
        // Select a random stat to compare
        const statIndex = Math.floor(Math.random() * this.availableStats.length);
        const selectedStat = this.availableStats[statIndex];
        this.currentStat = selectedStat.key;
        this.currentStatName = selectedStat.name;
        this.currentQuestionType = selectedStat.better;
        this.currentQuestionText = selectedStat.question;
        
        this.renderQuestion();
    }

    renderQuestion() {
        const container = document.getElementById('mlb-comparison-question-container');
        
        const playerAValue = this.currentPlayerA[this.currentStat];
        const playerBValue = this.currentPlayerB[this.currentStat];
        
        // Format the stat value for display
        const formatStat = (value) => {
            if (this.currentStat === 'ERA' || this.currentStat === 'SOBBRatio') {
                return value.toFixed(2);
            } else if (this.currentStat === 'InningsPitched') {
                return value.toFixed(1);
            }
            return value.toString();
        };
        
        container.innerHTML = `
            <div style="margin-bottom: 30px;">
                <h3 style="color: #333; margin-bottom: 20px;">${this.currentQuestionText}</h3>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; max-width: 800px; margin: 0 auto;">
                    <div id="player-a-card" class="player-card" onclick="selectPlayer('A')" style="
                        background: white;
                        border: 3px solid #ddd;
                        border-radius: 12px;
                        padding: 20px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    ">
                        <h4 style="margin: 0 0 10px 0; color: #333; font-size: 1.3rem;">${this.currentPlayerA.Player}</h4>
                        <p style="margin: 5px 0; color: #666; font-size: 1rem;">${this.currentPlayerA.Team}</p>
                    </div>
                    
                    <div id="player-b-card" class="player-card" onclick="selectPlayer('B')" style="
                        background: white;
                        border: 3px solid #ddd;
                        border-radius: 12px;
                        padding: 20px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    ">
                        <h4 style="margin: 0 0 10px 0; color: #333; font-size: 1.3rem;">${this.currentPlayerB.Player}</h4>
                        <p style="margin: 5px 0; color: #666; font-size: 1rem;">${this.currentPlayerB.Team}</p>
                    </div>
                </div>
            </div>
            
            <style>
                .player-card:hover {
                    border-color: #007cba !important;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
                }
                
                @media (max-width: 600px) {
                    #mlb-comparison-question-container > div > div {
                        grid-template-columns: 1fr !important;
                        gap: 15px !important;
                    }
                }
            </style>
        `;
    }

    selectPlayer(choice) {
        if (this.answeredCurrentQuestion || this.gameOver) return;
        
        const playerAValue = this.currentPlayerA[this.currentStat];
        const playerBValue = this.currentPlayerB[this.currentStat];
        
        // Determine correct choice based on whether we want higher or lower values
        let correctChoice;
        if (this.currentQuestionType === 'higher') {
            correctChoice = playerAValue >= playerBValue ? 'A' : 'B';
        } else { // 'lower'
            correctChoice = playerAValue <= playerBValue ? 'A' : 'B';
        }
        
        const isCorrect = choice === correctChoice;
        
        this.answeredCurrentQuestion = true;
        
        if (isCorrect) {
            this.score++;
        }
        
        // Update display to show the answer
        this.showAnswer(choice, correctChoice, playerAValue, playerBValue);
        
        // Move to next question after a delay
        setTimeout(() => {
            this.currentQuestion++;
            this.updateDisplay();
            this.generateQuestion();
        }, 3000);
    }

    showAnswer(userChoice, correctChoice, valueA, valueB) {
        const cardA = document.getElementById('player-a-card');
        const cardB = document.getElementById('player-b-card');
        
        // Format the stat values for display
        const formatStat = (value) => {
            if (this.currentStat === 'ERA' || this.currentStat === 'SOBBRatio') {
                return value.toFixed(2);
            } else if (this.currentStat === 'InningsPitched') {
                return value.toFixed(1);
            }
            return value.toString();
        };
        
        // Remove hover effects
        cardA.style.cursor = 'default';
        cardB.style.cursor = 'default';
        cardA.classList.remove('player-card');
        cardB.classList.remove('player-card');
        
        // Show the actual stat values
        const statsDisplayA = `<div style="margin-top: 10px; padding: 10px; background: #e3f2fd; border-radius: 6px; border: 2px solid #1976d2;">
            <strong style="color: #1976d2; font-size: 1.2rem;">${this.currentStatName}: ${formatStat(valueA)}</strong>
        </div>`;
        
        const statsDisplayB = `<div style="margin-top: 10px; padding: 10px; background: #e3f2fd; border-radius: 6px; border: 2px solid #1976d2;">
            <strong style="color: #1976d2; font-size: 1.2rem;">${this.currentStatName}: ${formatStat(valueB)}</strong>
        </div>`;
        
        cardA.innerHTML += statsDisplayA;
        cardB.innerHTML += statsDisplayB;
        
        // Color code the results
        if (correctChoice === 'A') {
            cardA.style.borderColor = '#4caf50';
            cardA.style.background = '#f1f8e9';
            if (userChoice !== 'A') {
                cardB.style.borderColor = '#f44336';
                cardB.style.background = '#ffebee';
            }
        } else {
            cardB.style.borderColor = '#4caf50';
            cardB.style.background = '#f1f8e9';
            if (userChoice !== 'B') {
                cardA.style.borderColor = '#f44336';
                cardA.style.background = '#ffebee';
            }
        }
        
        // Show result message
        // const isCorrect = userChoice === correctChoice;
        // this.showMessage(
        //     isCorrect ? '✓ Correct!' : '✗ Incorrect!',
        //     isCorrect ? 'success' : 'error'
        // );
    }

    endGame() {
        this.gameOver = true;
        const container = document.getElementById('mlb-comparison-question-container');
        
        const percentage = Math.round((this.score / this.maxQuestions) * 100);
        
        container.innerHTML = `
            <div style="text-align: center; padding: 30px;">
                <h3 style="color: #333; margin-bottom: 30px;">Game Complete</h3>
                
                <div style="background: #f8f9fa; border-radius: 12px; padding: 40px; margin: 20px 0; max-width: 400px; margin-left: auto; margin-right: auto;">
                    <p style="font-size: 4rem; font-weight: bold; margin: 0; color: #007cba;">${percentage}%</p>
                </div>
                
                <button onclick="newMLBComparisonGame()" style="
                    padding: 12px 24px; 
                    background: #007cba; 
                    color: white; 
                    border: none; 
                    border-radius: 6px; 
                    font-size: 1.1rem; 
                    cursor: pointer;
                    margin-top: 20px;
                ">
                    Play Again
                </button>
            </div>
        `;
    }

    updateDisplay() {
        document.getElementById('mlb-comparison-question-number').textContent = this.currentQuestion;
        document.getElementById('mlb-comparison-score').textContent = this.score;
    }

    showMessage(message, type) {
        const messageEl = document.getElementById('mlb-comparison-message');
        messageEl.textContent = message;
        messageEl.className = `game-message ${type}`;
        messageEl.style.display = 'block';
        
        // Style the message based on type
        if (type === 'error') {
            messageEl.style.background = '#ffebee';
            messageEl.style.color = '#c62828';
            messageEl.style.border = '1px solid #e57373';
        } else if (type === 'success') {
            messageEl.style.background = '#e8f5e8';
            messageEl.style.color = '#2e7d32';
            messageEl.style.border = '1px solid #81c784';
        } else {
            messageEl.style.background = '#e3f2fd';
            messageEl.style.color = '#1565c0';
            messageEl.style.border = '1px solid #64b5f6';
        }
        
        messageEl.style.padding = '10px';
        messageEl.style.borderRadius = '4px';
        messageEl.style.marginBottom = '15px';
    }

    hideMessage() {
        document.getElementById('mlb-comparison-message').style.display = 'none';
    }

    newGame() {
        this.currentQuestion = 1;
        this.score = 0;
        this.gameOver = false;
        this.answeredCurrentQuestion = false;
        this.updateDisplay();
        this.generateQuestion();
    }
}

// Global game instance
let mlbComparisonGame = null;

// Global functions for onclick handlers
window.selectPlayer = function(choice) {
    if (mlbComparisonGame) {
        mlbComparisonGame.selectPlayer(choice);
    }
};

window.newMLBComparisonGame = function() {
    if (mlbComparisonGame) {
        mlbComparisonGame.newGame();
    }
};

async function initializeMLBComparisonGame() {
    try {
        console.log('Initializing MLB Comparison Game...');
        mlbComparisonGame = new MLBComparisonGame();
        console.log('Game instance created');
        await mlbComparisonGame.initialize();
        console.log('Game initialized successfully');
    } catch (error) {
        console.error('Failed to initialize MLB Comparison Game:', error);
        const container = document.getElementById('mlb-comparison-question-container');
        container.innerHTML = `
            <div style="text-align: center; padding: 30px; color: #d32f2f;">
                <h3>Unable to Load Game</h3>
                <p>Failed to load 2025 MLB pitcher data.</p>
                <p style="font-size: 0.9rem; color: #666; margin-top: 20px;">Error: ${error.message}</p>
            </div>
        `;
    }
}

})(); 