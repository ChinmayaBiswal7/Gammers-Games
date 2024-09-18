// script.js
const rows = 6;
const cols = 7;
let currentPlayer = "red";
let board = [];
let gameActive = true;
let mode = "friend"; // Can be 'friend' or 'computer'
let aiPlayer = "yellow";
let humanPlayer = "red";

// Initialize and create the board
const createBoard = () => {
  const boardElement = document.getElementById("board");
  boardElement.innerHTML = "";
  board = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(null));

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener("click", handleCellClick);
      boardElement.appendChild(cell);
    }
  }
};

// Handle a cell click
const handleCellClick = (e) => {
  if (!gameActive || (mode === "computer" && currentPlayer === aiPlayer))
    return;

  const col = e.target.dataset.col;
  for (let row = rows - 1; row >= 0; row--) {
    if (board[row][col] === null) {
      board[row][col] = currentPlayer;
      const cell = document.querySelector(
        `.cell[data-row='${row}'][data-col='${col}']`
      );
      cell.classList.add(currentPlayer);
      if (checkWinner(row, col)) {
        displayWinner();
      } else {
        switchPlayer();
        if (mode === "computer" && currentPlayer === aiPlayer) {
          setTimeout(() => aiMove(), 500);
        }
      }
      return;
    }
  }
};

// Switch between players
const switchPlayer = () => {
  currentPlayer = currentPlayer === "red" ? "yellow" : "red";
  document.getElementById("game-status").textContent = `Player ${
    currentPlayer === "red" ? 1 : 2
  }'s Turn (${currentPlayer === "red" ? "Red" : "Yellow"})`;
};

// Check for a winner
const checkWinner = (row, col) => {
  return (
    checkDirection(row, col, 1, 0) || // Horizontal
    checkDirection(row, col, 0, 1) || // Vertical
    checkDirection(row, col, 1, 1) || // Diagonal /
    checkDirection(row, col, 1, -1) // Diagonal \
  );
};

// Check in a specific direction
const checkDirection = (row, col, rowDir, colDir) => {
  let count = 1;

  for (let i = 1; i < 4; i++) {
    const r = row + i * rowDir;
    const c = col + i * colDir;
    if (
      r >= 0 &&
      r < rows &&
      c >= 0 &&
      c < cols &&
      board[r][c] === currentPlayer
    ) {
      count++;
    } else {
      break;
    }
  }

  for (let i = 1; i < 4; i++) {
    const r = row - i * rowDir;
    const c = col - i * colDir;
    if (
      r >= 0 &&
      r < rows &&
      c >= 0 &&
      c < cols &&
      board[r][c] === currentPlayer
    ) {
      count++;
    } else {
      break;
    }
  }

  return count >= 4;
};

// Display the winner
const displayWinner = () => {
  const winner = currentPlayer === "red" ? 1 : 2;
  document.getElementById(
    "game-status"
  ).innerHTML = `<span style="font-size: 24px; font-weight: bold;">Player ${winner} Wins!</span>`;
  gameActive = false;
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => cell.removeEventListener("click", handleCellClick));
  document.getElementById("exit").style.display = "inline"; // Show Exit button
};

// Make AI move
const aiMove = () => {
  if (!gameActive) return;

  let bestMove = findBestMove();
  const col = bestMove;

  for (let row = rows - 1; row >= 0; row--) {
    if (board[row][col] === null) {
      board[row][col] = aiPlayer;
      const cell = document.querySelector(
        `.cell[data-row='${row}'][data-col='${col}']`
      );
      cell.classList.add(aiPlayer);
      if (checkWinner(row, col)) {
        displayWinner();
      } else {
        switchPlayer();
      }
      return;
    }
  }
};

// Find the best move for the AI (very advanced)
const findBestMove = () => {
  let validCols = [];
  for (let col = 0; col < cols; col++) {
    if (board[0][col] === null) {
      validCols.push(col);
    }
  }
  return validCols[Math.floor(Math.random() * validCols.length)];
};

// Restart the game
const restartGame = () => {
  createBoard();
  currentPlayer = "red";
  gameActive = true;
  document.getElementById("game-status").textContent = "Player 1's Turn (Red)";
  document.getElementById("exit").style.display = "none"; // Hide Exit button
};

// Toggle dark/light mode
const toggleMode = () => {
  document.body.classList.toggle("dark-mode");
  const button = document.getElementById("modeToggle");
  button.textContent = document.body.classList.contains("dark-mode")
    ? "Light Mode"
    : "Dark Mode";
};

// Exit to index.html
const exitGame = () => {
  window.location.href = "index.html";
};

// Initialize game on page load
window.onload = () => {
  document.getElementById("playWithFriend").addEventListener("click", () => {
    mode = "friend";
    document.getElementById("welcome-page").style.display = "none";
    document.getElementById("game-container").style.display = "block";
    createBoard();
  });

  document.getElementById("playWithComputer").addEventListener("click", () => {
    mode = "computer";
    document.getElementById("welcome-page").style.display = "none";
    document.getElementById("game-container").style.display = "block";
    createBoard();
  });

  document.getElementById("restart").addEventListener("click", restartGame);
  document.getElementById("modeToggle").addEventListener("click", toggleMode);
  document.getElementById("exit").addEventListener("click", exitGame);
};
