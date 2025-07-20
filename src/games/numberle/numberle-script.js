// Game state
let gameState = {
  secretNumber: "",
  currentRow: 0,
  currentCol: 0,
  gameOver: false,
  gameWon: false,
  maxAttempts: 6,
  numberLength: 5,
};

// DOM elements
const board = document.getElementById("board");
const message = document.getElementById("message");
const numberPad = document.getElementById("number-pad");
const deleteBtn = document.getElementById("delete-btn");
const enterBtn = document.getElementById("enter-btn");
const modal = document.getElementById("modal");
const playAgainBtn = document.getElementById("play-again-btn");
const closeModalBtn = document.getElementById("close-modal");

// Welcome modal logic
const welcomeOverlay = document.getElementById("welcome-overlay");
const welcomePlay = document.getElementById("welcome-play");
const welcomeClose = document.getElementById("welcome-close");

// Endgame modal logic
const endgameOverlay = document.getElementById("endgame-overlay");
const endgameTitle = document.getElementById("endgame-title");
const endgameMessage = document.getElementById("endgame-message");
const playagainBtn = document.getElementById("playagain-btn");
const backHomeBtn = document.getElementById("backhome-btn");

const winPrompts = [
  "Great Job!",
  "Awesome!",
  "You did it!",
  "Impressive!",
  "Fantastic!",
  "Well done!",
  "You cracked it!",
  "Brilliant!",
  "Superb!",
  "You nailed it!",
];
let winPromptIndex = 0;

function showWelcomeModal() {
  welcomeOverlay.classList.remove("hide");
  document.body.style.overflow = "hidden";
}

function hideWelcomeModal() {
  welcomeOverlay.classList.add("hide");
  setTimeout(() => {
    welcomeOverlay.style.display = "none";
    document.body.style.overflow = "";
  }, 300);
}

welcomePlay.addEventListener("click", hideWelcomeModal);
welcomeClose.addEventListener("click", hideWelcomeModal);

function showEndgameModal(won) {
  console.log("showEndgameModal called, won:", won);
  endgameOverlay.classList.add("show");
  endgameOverlay.classList.remove("hide");
  endgameTitle.textContent = "Game Over";
  if (won) {
    endgameMessage.textContent = winPrompts[winPromptIndex];
    winPromptIndex = (winPromptIndex + 1) % winPrompts.length;
  } else {
    endgameMessage.innerHTML =
      'The Numberle was:<br><span class="endgame-number">' +
      gameState.secretNumber +
      "</span>";
  }
}

function hideEndgameModal() {
  endgameOverlay.classList.add("hide");
  setTimeout(() => {
    endgameOverlay.classList.remove("show");
    endgameOverlay.classList.remove("hide");
  }, 300);
}

function startNewGame() {
  resetGameState();
  generateSecretNumber();
  createBoard();
  createNumberPad();
  setupEventListeners();
  updateEnterButton();
  clearMessage();
  closeModal();
  resetNumberPadColors();
}

function generateSecretNumber() {
  let number;
  let attempts = 0;
  const maxAttempts = 200;
  do {
    number = "";
    const digitCounts = {};
    for (let i = 0; i < 5; i++) {
      let d;
      let tries = 0;
      do {
        d = Math.floor(Math.random() * 10);
        tries++;
      } while (digitCounts[d] >= 2 && Math.random() > 0.15 && tries < 10); // 85% chance to avoid >2 repeats
      number += d;
      digitCounts[d] = (digitCounts[d] || 0) + 1;
    }
    attempts++;
  } while (!isValidSecretNumber(number) && attempts < maxAttempts);
  if (attempts >= maxAttempts) {
    console.warn(
      "Could not generate valid number after",
      maxAttempts,
      "attempts, using:",
      number,
    );
  }
  gameState.secretNumber = number;
  console.log("Secret number:", gameState.secretNumber);
}

// Check if a number is valid (no more than 2 instances of any digit)
function isValidSecretNumber(number) {
  const digitCounts = {};

  for (let digit of number) {
    digitCounts[digit] = (digitCounts[digit] || 0) + 1;
    if (digitCounts[digit] > 2) {
      return false;
    }
  }

  return true;
}

// Create the game board
function createBoard() {
  board.innerHTML = "";
  for (let row = 0; row < gameState.maxAttempts; row++) {
    const rowDiv = document.createElement("div");
    rowDiv.className = "row";
    rowDiv.dataset.row = row;
    for (let col = 0; col < gameState.numberLength; col++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.dataset.row = row;
      tile.dataset.col = col;
      rowDiv.appendChild(tile);
    }
    board.appendChild(rowDiv);
  }
}

// Create the virtual number pad
function createNumberPad() {
  numberPad.innerHTML = "";

  // Create number buttons 0-9
  for (let i = 0; i < 10; i++) {
    const btn = document.createElement("button");
    btn.className = "number-btn";
    btn.textContent = i;
    btn.dataset.number = i;
    btn.addEventListener("click", () => inputNumber(i));
    numberPad.appendChild(btn);
  }
}

// Setup event listeners
function setupEventListeners() {
  // Keyboard input
  document.addEventListener("keydown", handleKeydown);

  // Button clicks
  deleteBtn.addEventListener("click", deleteNumber);
  enterBtn.addEventListener("click", submitGuess);
  playAgainBtn.addEventListener("click", startNewGame);
  closeModalBtn.addEventListener("click", closeModal);

  // Modal backdrop click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}

// Handle keyboard input
function handleKeydown(e) {
  if (gameState.gameOver) return;

  if (e.key >= "0" && e.key <= "9") {
    inputNumber(parseInt(e.key));
  } else if (e.key === "Enter") {
    submitGuess();
  } else if (e.key === "Backspace") {
    deleteNumber();
  }
}

// Input a number
function inputNumber(num) {
  if (gameState.gameOver || gameState.currentCol >= gameState.numberLength)
    return;
  animateNumberKey(num);
  const tile = getCurrentTile();
  if (tile) {
    tile.textContent = num;
    tile.classList.add("filled");
    gameState.currentCol++;
    updateEnterButton();
  }
}

// Delete the last number
function deleteNumber() {
  if (gameState.gameOver || gameState.currentCol <= 0) return;

  gameState.currentCol--;
  const tile = getCurrentTile();
  if (tile) {
    tile.textContent = "";
    tile.classList.remove("filled");
    updateEnterButton();
  }
}

// Get the current tile
function getCurrentTile() {
  return document.querySelector(
    `[data-row="${gameState.currentRow}"][data-col="${gameState.currentCol}"]`,
  );
}

// Update enter button state
function updateEnterButton() {
  const isComplete = gameState.currentCol === gameState.numberLength;
  enterBtn.disabled = !isComplete;
}

// Submit the current guess
function submitGuess() {
  if (gameState.gameOver || gameState.currentCol !== gameState.numberLength)
    return;

  const guess = getCurrentGuess();
  if (!isValidGuess(guess)) {
    showMessage("Please enter exactly 5 digits");
    shakeRow();
    return;
  }

  const feedback = evaluateGuess(guess);
  displayFeedback(feedback);

  if (guess === gameState.secretNumber) {
    gameWon();
  } else if (gameState.currentRow === gameState.maxAttempts - 1) {
    gameLost();
  } else {
    nextRow();
  }
}

// Get the current guess as a string
function getCurrentGuess() {
  let guess = "";
  for (let col = 0; col < gameState.numberLength; col++) {
    const tile = document.querySelector(
      `[data-row="${gameState.currentRow}"][data-col="${col}"]`,
    );
    guess += tile.textContent;
  }
  return guess;
}

// Validate the guess
function isValidGuess(guess) {
  return /^\d{5}$/.test(guess);
}

// Evaluate the guess and return feedback
function evaluateGuess(guess) {
  const feedback = [];
  const secretArray = gameState.secretNumber.split("");
  const guessArray = guess.split("");
  const used = new Array(gameState.numberLength).fill(false);

  // First pass: mark correct digits
  for (let i = 0; i < gameState.numberLength; i++) {
    if (guessArray[i] === secretArray[i]) {
      feedback[i] = "correct";
      used[i] = true;
    }
  }

  // Second pass: mark present digits
  for (let i = 0; i < gameState.numberLength; i++) {
    if (feedback[i] === "correct") continue;

    for (let j = 0; j < gameState.numberLength; j++) {
      if (!used[j] && guessArray[i] === secretArray[j]) {
        feedback[i] = "present";
        used[j] = true;
        break;
      }
    }

    if (!feedback[i]) {
      feedback[i] = "absent";
    }
  }

  return feedback;
}

// Display feedback on the board
function displayFeedback(feedback) {
  animateTilePop(gameState.currentRow, feedback, () => {
    updateNumberPadColors(feedback, getCurrentGuess());
  });
}

// Move to the next row
function nextRow() {
  gameState.currentRow++;
  gameState.currentCol = 0;
  updateEnterButton();
  clearMessage();
}

// Shake the current row
function shakeRow() {
  const row = document.querySelector(`[data-row="${gameState.currentRow}"]`);
  row.classList.remove("shake");
  void row.offsetWidth;
  row.classList.add("shake");
  setTimeout(() => {
    row.classList.remove("shake");
  }, 400);
}

// Game won
function gameWon() {
  gameState.gameOver = true;
  gameState.gameWon = true;
  showEndgameModal(true);
}

// Game lost
function gameLost() {
  gameState.gameOver = true;
  gameState.gameWon = false;
  showEndgameModal(false);
}

// Reset number pad key colors
function resetNumberPadColors() {
  const btns = numberPad.querySelectorAll(".number-btn");
  btns.forEach((btn) => {
    btn.classList.remove("correct", "present", "absent");
  });
}

// Reset game state
function resetGameState() {
  gameState = {
    secretNumber: "",
    currentRow: 0,
    currentCol: 0,
    gameOver: false,
    gameWon: false,
    maxAttempts: 6,
    numberLength: 5,
  };
}

// Show message
function showMessage(text) {
  message.textContent = text;
}

// Clear message
function clearMessage() {
  message.textContent = "";
}

// Close modal
function closeModal() {
  modal.classList.remove("show");
}

// Helper: update number key feedback colors
function updateNumberPadColors(feedback, guess) {
  // Track best status for each digit
  const bestStatus = {};
  // Check all previous guesses for best status
  for (let row = 0; row <= gameState.currentRow; row++) {
    let rowGuess = "";
    let rowFeedback = [];
    if (row === gameState.currentRow) {
      rowGuess = guess;
      rowFeedback = feedback;
    } else {
      // Get guess and feedback from previous rows
      rowGuess = "";
      for (let col = 0; col < gameState.numberLength; col++) {
        const tile = document.querySelector(
          `[data-row="${row}"][data-col="${col}"]`,
        );
        rowGuess += tile.textContent;
      }
      rowFeedback = [];
      for (let col = 0; col < gameState.numberLength; col++) {
        if (tileHasClass(row, col, "correct")) rowFeedback[col] = "correct";
        else if (tileHasClass(row, col, "present"))
          rowFeedback[col] = "present";
        else if (tileHasClass(row, col, "absent")) rowFeedback[col] = "absent";
      }
    }
    for (let i = 0; i < rowGuess.length; i++) {
      const digit = rowGuess[i];
      if (!digit) continue;
      if (rowFeedback[i] === "correct") {
        bestStatus[digit] = "correct";
      } else if (
        rowFeedback[i] === "present" &&
        bestStatus[digit] !== "correct"
      ) {
        bestStatus[digit] = "present";
      } else if (rowFeedback[i] === "absent" && !bestStatus[digit]) {
        bestStatus[digit] = "absent";
      }
    }
  }
  // Apply best status to number keys
  for (let d = 0; d <= 9; d++) {
    const btn = numberPad.querySelector(`.number-btn[data-number="${d}"]`);
    if (!btn) continue;
    btn.classList.remove("correct", "present", "absent");
    if (bestStatus[d] === "correct") btn.classList.add("correct");
    else if (bestStatus[d] === "present") btn.classList.add("present");
    else if (bestStatus[d] === "absent") btn.classList.add("absent");
  }
}

function tileHasClass(row, col, className) {
  const tile = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  return tile && tile.classList.contains(className);
}

// Animate number key press
function animateNumberKey(num) {
  const btn = numberPad.querySelector(`.number-btn[data-number="${num}"]`);
  if (btn) {
    btn.classList.remove("bounce");
    // Force reflow for restart animation
    void btn.offsetWidth;
    btn.classList.add("bounce");
    setTimeout(() => btn.classList.remove("bounce"), 180);
  }
}

// Animate tile pop for a row
function animateTilePop(rowIdx, feedback, cb) {
  const row = document.querySelector(`[data-row="${rowIdx}"]`);
  const tiles = row.querySelectorAll(".tile");
  tiles.forEach((tile, i) => {
    setTimeout(() => {
      tile.classList.add("reveal-pop");
      setTimeout(() => {
        tile.classList.add(feedback[i]);
        tile.classList.remove("reveal-pop");
        if (i === tiles.length - 1 && cb) cb();
      }, 200);
    }, i * 120);
  });
}

// Show modal on load, then start game after closing
window.addEventListener("DOMContentLoaded", () => {
  showWelcomeModal();
  // Game will still initialize, but user can't interact until modal is closed
  setDifficulty();
  playagainBtn.addEventListener("click", () => {
    hideEndgameModal();
    setTimeout(() => startNewGame(), 350);
  });
  backHomeBtn.addEventListener("click", () => {
    window.location.href = "../../index.html";
  });
});

// Allow Enter key to close welcome modal
window.addEventListener("keydown", (e) => {
  if (
    welcomeOverlay &&
    welcomeOverlay.style.display !== "none" &&
    !welcomeOverlay.classList.contains("hide")
  ) {
    if (e.key === "Enter") {
      hideWelcomeModal();
    }
  }
});

// Only allow 5-digit mode
function setDifficulty() {
  resetGameState();
  generateSecretNumber();
  createBoard();
  createNumberPad();
  setupEventListeners();
  updateEnterButton();
  clearMessage();
  closeModal();
  resetNumberPadColors();
}

// On load, always start daily challenge
window.addEventListener("DOMContentLoaded", () => {
  setDifficulty();
});
