// Games list
const games = [
    { id: "nfl-player-guess", name: "Guess the NFL Player", description: "Guess the NFL player based on 2024 stats" },
    { id: "mlb-player-guess", name: "Guess the MLB Player", description: "Guess the MLB player based on 2025 stats" },
    { id: "nba-player-guess", name: "Guess the NBA Player", description: "Guess the NBA player based on 2024 stats" },
    { id: "mlb-player-comparison", name: "MLB Player Comparison", description: "Head-to-head stat comparisons between MLB players" },
    { id: "mlb-standings-challenge", name: "MLB Standings Challenge", description: "Guess which team belongs in each league ranking position" },
    { id: "mlb-division-challenge", name: "MLB Division Challenge", description: "Guess teams by their division rankings (AL/NL East, Central, West)" }
];

// Navigation function for games
function navigateToGame(gameName) {
    // Change URL to #/home/gamename format (hash routing)
    window.location.hash = `/home/${gameName}`;
}

// Handle back navigation and URL routing
window.addEventListener('hashchange', function(event) {
    handleRoute();
});

function handleRoute() {
    const hash = window.location.hash;
    
    // Check if we're on a game page
    if (hash.startsWith('#/home/') && hash !== '#/home/') {
        const gameName = hash.split('#/home/')[1];
        loadGame(gameName);
    } else if (hash === '' || hash === '#' || hash === '#/') {
        // Show homepage
        showHomepage();
    }
}

// Dynamic game loading system
function loadGame(gameName) {
    // Check if game exists
    const game = games.find(g => g.id === gameName);
    if (!game) {
        // Game not found, redirect to homepage
        window.location.hash = '';
        return;
    }
    
    // Show loading placeholder
    showGamePlaceholder(game);
    
    // Try to load game dynamically
    loadGameScript(gameName);
}

function showGamePlaceholder(game) {
    document.body.innerHTML = `
        <div class="container">
            <header>
                <h1>${game.name}</h1>
                <button id="back-to-home-btn" style="padding: 10px 20px; background: white; border: 2px solid black; cursor: pointer; margin-bottom: 20px;">
                    Back to Home
                </button>
            </header>
            <main style="display: flex; justify-content: center; align-items: center; min-height: 400px;">
                <div id="game-container" style="text-align: center; border: 2px solid black; padding: 40px;">
                    <h2>Loading Game...</h2>
                    <p>The ${game.name} game is loading.</p>
                </div>
            </main>
        </div>
    `;
    
    // Add event listener for back button
    document.getElementById('back-to-home-btn').addEventListener('click', goHome);
}

function loadGameScript(gameName) {
    // Check if script already exists
    const existingScript = document.querySelector(`script[src*="${gameName}"]`);
    if (existingScript) {
        existingScript.remove();
    }
    
    // Load game script dynamically
    const script = document.createElement('script');
    script.src = `games/${gameName}.js`;
    script.onload = () => {
        console.log(`${gameName} game loaded successfully`);
        // Call the game's initialization function
        if (typeof window.initializeGame === 'function') {
            window.initializeGame();
        } else {
            console.error('window.initializeGame function not found');
            showGameError(gameName);
        }
    };
    script.onerror = () => {
        console.error(`Failed to load ${gameName} game`);
        showGameError(gameName);
    };
    document.head.appendChild(script);
}

function showGameError(gameName) {
    document.getElementById('game-container').innerHTML = `
        <h2>Game Coming Soon</h2>
        <p>The ${gameName} game is under development.</p>
        <p style="margin-top: 20px;">
            <button id="error-back-home-btn" style="padding: 10px 20px; background: white; border: 2px solid black; cursor: pointer;">
                Back to Home
            </button>
        </p>
    `;
    
    // Add event listener for error back button
    document.getElementById('error-back-home-btn').addEventListener('click', goHome);
}



function goHome() {
    window.location.hash = '';
}

function showHomepage() {
    const gameCards = games.map(game => `
        <div class="game-card" data-game-id="${game.id}">
            <h2>${game.name}</h2>
            <p>${game.description}</p>
        </div>
    `).join('');
    
    document.body.innerHTML = `
        <div class="container">
            <header>
                <h1>Games</h1>
                <p>Choose your game</p>
            </header>
            
            <main>
                <div class="games-grid">
                    ${gameCards}
                </div>
            </main>
            
            <footer>
                <p>&copy; 2024 Games</p>
            </footer>
        </div>
    `;
    
    // Add event listeners for game cards
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', () => {
            const gameId = card.getAttribute('data-game-id');
            navigateToGame(gameId);
        });
    });
}

// Initialize routing when page loads
document.addEventListener('DOMContentLoaded', function() {
    handleRoute();
}); 