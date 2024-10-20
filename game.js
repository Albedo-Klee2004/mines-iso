// Initial Game Data
let gameData = {
    credits: 1000, // Default value, will be updated from Local Storage
    betMultiplier: 1,
    currentBet: 0,
    gridSize: 5,
    mines: [],
    revealed: [],
    creditGain: 0,
    gameStarted: false
};

// DOM Elements
const creditDisplay = document.getElementById('credits');
const currentBetDisplay = document.getElementById('current-bet');
const creditGainDisplay = document.getElementById('credit-gain');
const gameBoard = document.getElementById('game-board');
const cashoutBtn = document.getElementById('cashout-btn');
const restartBtn = document.getElementById('restart-btn');
const resetBtn = document.getElementById('reset-btn'); // Reset button
const betButtons = document.querySelectorAll('.bet-btn');

// Initialize game
function initGame() {
    gameData.revealed = [];
    gameData.creditGain = 0;
    gameData.gameStarted = false;
  //  gameData.currentBet = 0; // Reset current bet
    updateCredits(); // Update display with initial credits
    renderGameBoard();
    disableBoard(); // Disable board initially


    enableBetButtons();
    disableCashoutButton();
   // enableCashoutButton();
}

// Fetch initial credits from Local Storage or default to 1000
function fetchInitialCredits() {
    const storedCredits = localStorage.getItem('credits');
    gameData.credits = storedCredits ? Number(storedCredits) : 1000;
}

// Reset credits to 1000 and update Local Storage
function resetCredits() {
    gameData.credits = 1000; // Reset to 1000
    localStorage.setItem('credits', gameData.credits); // Save to local storage
    updateCredits(); // Update display
}

// Generate Random Mines
function generateMines() {
    let mines = [];
    let bombCount = getBombCountBasedOnMultiplier();
    while (mines.length < bombCount) {
        let minePos = Math.floor(Math.random() * (gameData.gridSize * gameData.gridSize));
        if (!mines.includes(minePos)) {
            mines.push(minePos);
        }
    }
    return mines;
}

// Determine Bomb Count Based on Multiplier
function getBombCountBasedOnMultiplier() {
    return 4 + gameData.betMultiplier - 1; // 1x = 4 bombs, 2x = 5 bombs, etc.
}

// Update Credit Display
function updateCredits() {
    creditDisplay.textContent = gameData.credits;
    currentBetDisplay.textContent = gameData.currentBet;
    creditGainDisplay.textContent = gameData.creditGain; // Show the accumulated gains

    // Update credits in Local Storage
    localStorage.setItem('credits', gameData.credits);
}

// Render Game Board
function renderGameBoard() {
    gameBoard.innerHTML = ''; // Clear previous board
    gameBoard.classList.add('grid-5');
    for (let i = 0; i < gameData.gridSize * gameData.gridSize; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.dataset.index = i;
        tile.addEventListener('click', revealTile);
        gameBoard.appendChild(tile);
    }
}

// Reveal Tile Functionality
function revealTile(event) {
    const index = event.target.dataset.index;

    // Check if the tile has already been revealed
    if (gameData.revealed.includes(index)) {
        alert("This tile has already been revealed!");
        return; // Prevent further clicks on this tile
    }

    // Deduct bet once when game starts
    if (!gameData.gameStarted) {
        gameData.mines = generateMines();
        gameData.credits -= gameData.currentBet; // Deduct current bet
        updateCredits();
        gameData.gameStarted = true; // Mark game as started


        disableRestartButton();
        disableBetButtons();
        enableCashoutButton();
    }

    // If mine, reveal all mines and disable the board
    if (gameData.mines.includes(Number(index))) {
        revealAllMines();
        alert('You hit a mine! You lost your bet.');
        updateCredits();
        disableBoard();

        enableRestartButton();
    } else {
        event.target.classList.add('safe');
        gameData.revealed.push(index); // Mark this tile as revealed
        gameData.creditGain += gameData.currentBet * gameData.betMultiplier; // Increment gain based on bet
        updateCredits();
    }
}

// Reveal All Mines
function revealAllMines() {
    gameData.mines.forEach(mineIndex => {
        const tile = document.querySelector(`.tile[data-index='${mineIndex}']`);
        tile.classList.add('mine'); // Add the 'mine' class to all mines
        disableCashoutButton();
    });
}

// Disable the Game Board
function disableBoard() {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => tile.removeEventListener('click', revealTile));
}

// Enable the Game Board
function enableBoard() {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => tile.addEventListener('click', revealTile));
}

// Betting Functionality
betButtons.forEach(button => {
    button.addEventListener('click', function() {
        const multiplier = Number(this.dataset.multiplier);
        gameData.betMultiplier = multiplier;
        gameData.currentBet = multiplier; // 1X = 1 credit, 2X = 2 credits, etc.
        updateCredits();
        enableBoard(); // Enable board when a bet is placed
    });
});

// Cash Out Button
cashoutBtn.addEventListener('click', () => {
    if (gameData.creditGain > 0) { // Only cash out if there's credit to gain
        gameData.credits += gameData.creditGain; // Add accumulated gains to the total credits
        alert(`You cashed out with ${gameData.creditGain} additional credits!`);
        gameData.creditGain = 0;
        updateCredits();
        disableBoard(); // Disable the board after cashing out
        initGame();

        enableCashoutButton();
        enableBoard();
    } else {
        alert('No credits to cash out!');
    }
});

// Run Function for Restarting the Game
function run() {
    initGame(); // Initialize the game
    enableBoard();
}

// Restart Button
restartBtn.addEventListener('click', run);

// Reset Button
resetBtn.addEventListener('click', resetCredits);

// Initialize the Game on Page Load
fetchInitialCredits(); // Fetch credits from Local Storage
initGame(); // Start the game









// Disable the Restart Button
function disableRestartButton() {
    restartBtn.disabled = true; // Disable the button
    restartBtn.style.backgroundColor = '#ccc'; // Change background color to indicate it's disabled
    restartBtn.style.cursor = 'not-allowed'; // Change cursor to not-allowed
}

// Call this function where you want to disable the button ----disableRestartButton();

// Enable the Restart Button
function enableRestartButton() {
    restartBtn.disabled = false; // Enable the button
    restartBtn.style.backgroundColor = '#28a745'; // Reset to original background color
    restartBtn.style.cursor = 'pointer'; // Reset cursor to pointer
}
// Call this function when you want to enable the button again ---enableRestartButton();












// Function to disable all bet buttons disableBetButtons(); // Call this to disable bet buttons
function disableBetButtons() {
    const betButtons = document.querySelectorAll('.bet-btn');
    betButtons.forEach(button => {
        button.disabled = true; // Disable each bet button
        button.style.backgroundColor = '#ccc'; // Change background color to indicate it's disabled
        button.style.cursor = 'not-allowed'; // Change cursor to not-allowed
    });
}

// Function to enable all bet buttons enableBetButtons(); // Call this to enable bet buttons
function enableBetButtons() {
    const betButtons = document.querySelectorAll('.bet-btn');
    betButtons.forEach(button => {
        button.disabled = false; // Enable each bet button
        button.style.backgroundColor = ''; // Reset background color
        button.style.cursor = 'pointer'; // Change cursor back to pointer
    });
}







// Function to disable cashout button  disableCashoutButton();
function disableCashoutButton() {
    const cashoutBtn = document.getElementById('cashout-btn');
    cashoutBtn.disabled = true; // Disable the cashout button
    cashoutBtn.style.backgroundColor = '#ccc'; // Change background color
    cashoutBtn.style.cursor = 'not-allowed'; // Change cursor to not-allowed
}

// Function to enable cashout button  enableCashoutButton();
function enableCashoutButton() {
    const cashoutBtn = document.getElementById('cashout-btn');
    cashoutBtn.disabled = false; // Enable the cashout button
    cashoutBtn.style.backgroundColor = ''; // Reset background color
    cashoutBtn.style.cursor = 'pointer'; // Change cursor back to pointer
}






// Betting Functionality
betButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove 'active' class from all buttons
        betButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add 'active' class to the clicked button
        this.classList.add('active');
        
        const multiplier = Number(this.dataset.multiplier);
        gameData.betMultiplier = multiplier;
        gameData.currentBet = multiplier; // 1X = 1 credit, 2X = 2 credits, etc.
        updateCredits();
        enableBoard(); // Enable board when a bet is placed
    });
});
