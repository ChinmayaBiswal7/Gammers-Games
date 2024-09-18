const cells = document.querySelectorAll("[data-cell]");
const message = document.getElementById("message");
const restartButton = document.getElementById("restartButton");
const resetButton = document.getElementById("resetButton");
const playerNamesDiv = document.getElementById("playerNames");
const welcomePopup = document.getElementById("welcomePopup");
const gameContent = document.getElementById("gameContent");
const startGameButton = document.getElementById("startGameButton");
const playWithComputerButton = document.getElementById(
  "playWithComputerButton"
);
const modeToggleButton = document.getElementById("modeToggleButton");
const scoreboardContainer = document.getElementById("scoreboard-container");
const musicToggleButton = document.getElementById("musicToggleButton");
const backgroundMusic = document.getElementById("backgroundMusic");

let currentPlayer = "X";
let playerName = "";
let playerScore = 0;
let computerScore = 0;
let matchCount = 0;
let isGameActive = true;
let isDarkMode = false; // Default to light mode
let isMusicOn = true; // Default music state is On
let isPlayingWithComputer = false;
let playerXName = "Player X";
let playerOName = "Player O";

function getPlayerName() {
  playerName = prompt("Enter your name:");
  if (!playerName) playerName = "Player";
}

function handleClick(event) {
  const cell = event.target;

  if (!isGameActive || cell.textContent !== "") return;

  cell.textContent = currentPlayer;
  cell.style.color = "red";

  if (checkWinner()) {
    setTimeout(() => {
      message.textContent = `${
        currentPlayer === "X" ? playerName : "Computer"
      } wins!`;
      if (currentPlayer === "X") {
        playerScore++;
      } else {
        computerScore++;
      }
      matchCount++;
      updateScoreboard();
      isGameActive = false;
    }, 100);
    return;
  }

  if (isDraw()) {
    setTimeout(() => {
      message.textContent = "It's a draw!";
      matchCount++;
      updateScoreboard();
      isGameActive = false;
    }, 100);
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";

  // Play the computer's move if it's the computer's turn
  if (isPlayingWithComputer && currentPlayer === "O") {
    setTimeout(() => {
      computerMove();
    }, 500);
  }
}

function computerMove() {
  // Get available cells
  const availableCells = [...cells].filter((cell) => cell.textContent === "");

  if (availableCells.length === 0) return; // No moves available

  // Smart AI to block player or win
  const winningMove = findWinningMove("O");
  if (winningMove) {
    winningMove.textContent = "O";
    winningMove.style.color = "red";
  } else {
    const blockingMove = findWinningMove("X");
    if (blockingMove) {
      blockingMove.textContent = "O";
      blockingMove.style.color = "red";
    } else {
      // Random move if no winning or blocking move found
      const randomCell =
        availableCells[Math.floor(Math.random() * availableCells.length)];
      randomCell.textContent = "O";
      randomCell.style.color = "red";
    }
  }

  if (checkWinner()) {
    message.textContent = "Computer wins!";
    computerScore++;
    matchCount++;
    updateScoreboard();
    isGameActive = false;
  } else if (isDraw()) {
    message.textContent = "It's a draw!";
    matchCount++;
    updateScoreboard();
    isGameActive = false;
  }

  currentPlayer = "X"; // Switch back to player
}

function findWinningMove(player) {
  const availableCells = [...cells].filter((cell) => cell.textContent === "");
  for (const cell of availableCells) {
    cell.textContent = player;
    if (checkWinner()) {
      cell.textContent = ""; // Reset cell
      return cell;
    }
    cell.textContent = ""; // Reset cell
  }
  return null;
}

function checkWinner() {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  return winningCombinations.some((combination) => {
    const [a, b, c] = combination;
    return (
      cells[a].textContent &&
      cells[a].textContent === cells[b].textContent &&
      cells[a].textContent === cells[c].textContent
    );
  });
}

function isDraw() {
  return [...cells].every((cell) => cell.textContent);
}

function restartGame() {
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.style.pointerEvents = "auto";
  });
  message.textContent = "";
  isGameActive = true;
}

function resetScores() {
  playerScore = 0;
  computerScore = 0;
  matchCount = 0;
  updateScoreboard();
}

function updateScoreboard() {
  const tbody = document.querySelector("#scoreboard tbody");
  tbody.innerHTML = `
    <tr>
        <td>Match ${matchCount}</td>
        <td>${playerScore}</td>
        <td>${computerScore}</td>
    </tr>
  `;
}

function getPlayerNames() {
  if (isPlayingWithComputer) {
    playerName = prompt("Enter your name:");
    if (!playerName) playerName = "Player";
    playerNamesDiv.textContent = `${playerName} vs Computer`;

    // Update scoreboard headers with player name and Computer
    document.getElementById("player1-header").textContent = playerName;
    document.getElementById("player2-header").textContent = "Computer";
  } else {
    playerXName = prompt("Enter the name of player X:");
    playerOName = prompt("Enter the name of player O:");
    if (!playerXName) playerXName = "Player X";
    if (!playerOName) playerOName = "Player O";
    playerNamesDiv.textContent = `${playerOName} vs ${playerXName}`;

    // Update scoreboard headers with player names
    document.getElementById("player1-header").textContent = playerOName;
    document.getElementById("player2-header").textContent = playerXName;
  }

  updateScoreboard();
}

function toggleMode() {
  if (isDarkMode) {
    document.body.classList.remove("dark-mode");
    document.body.classList.add("light-mode");
    modeToggleButton.textContent = "Dark Mode";
  } else {
    document.body.classList.remove("light-mode");
    document.body.classList.add("dark-mode");
    modeToggleButton.textContent = "Light Mode";
  }
  isDarkMode = !isDarkMode;
}

function toggleMusic() {
  if (isMusicOn) {
    backgroundMusic.pause();
    musicToggleButton.textContent = "Music On";
  } else {
    backgroundMusic.play().catch((error) => {
      console.log("Autoplay prevented by the browser:", error);
    });
    musicToggleButton.textContent = "Music Off";
  }
  isMusicOn = !isMusicOn;
}

function startGame() {
  welcomePopup.style.display = "none";
  gameContent.style.display = "block";
  scoreboardContainer.style.display = "flex"; // Show scoreboard after starting game

  if (isPlayingWithComputer) {
    // For playing with computer, just ask for player name
    getPlayerName();
    playerNamesDiv.textContent = `${playerName} vs Computer`;

    // Update scoreboard headers with player name and Computer
    document.getElementById("player1-header").textContent = playerName;
    document.getElementById("player2-header").textContent = "Computer";
  } else {
    // For playing with another player, ask for both names
    playerXName = prompt("Enter the name of player X:");
    playerOName = prompt("Enter the name of player O:");
    if (!playerXName) playerXName = "Player X";
    if (!playerOName) playerOName = "Player O";
    playerNamesDiv.textContent = `${playerOName} vs ${playerXName}`;

    // Update scoreboard headers with player names
    document.getElementById("player1-header").textContent = playerOName;
    document.getElementById("player2-header").textContent = playerXName;
  }

  updateScoreboard();

  // Start the music automatically when the game begins
  backgroundMusic
    .play()
    .then(() => {
      musicToggleButton.textContent = "Music Off"; // Correct initial button text
    })
    .catch((error) => {
      console.log("Autoplay prevented by the browser:", error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  startGameButton.addEventListener("click", () => {
    isPlayingWithComputer = false;
    startGame();
  });
  playWithComputerButton.addEventListener("click", () => {
    isPlayingWithComputer = true;
    startGame();
  });

  cells.forEach((cell) => cell.addEventListener("click", handleClick));
  restartButton.addEventListener("click", restartGame);
  resetButton.addEventListener("click", resetScores);
  modeToggleButton.addEventListener("click", toggleMode);
  musicToggleButton.addEventListener("click", toggleMusic);
  const exitButton = document.getElementById("exitButton");

  function showWelcomePopup() {
    welcomePopup.style.display = "flex";
    gameContent.style.display = "none";
    scoreboardContainer.style.display = "none"; // Hide scoreboard on return to welcome
  }

  exitButton.addEventListener("click", () => {
    showWelcomePopup();
  });

  // Ensure the 'Exit' button is initially hidden
  exitButton.style.display = "none";

  // new Code

  function restartGame() {
    cells.forEach((cell) => {
      cell.textContent = "";
      cell.style.pointerEvents = "auto";
    });
    message.textContent = "";
    isGameActive = true;
    exitButton.style.display = "none"; // Hide Exit button on game restart
  }

  function endGame(winner) {
    isGameActive = false;
    exitButton.style.display = "block"; // Show Exit button when the game ends

    if (winner === "X") {
      message.textContent = `${playerName} wins!`;
      playerScore++;
    } else if (winner === "O") {
      message.textContent = "Computer wins!";
      computerScore++;
    } else {
      message.textContent = "It's a draw!";
    }

    matchCount++;
    updateScoreboard();
  }

  function handleClick(event) {
    const cell = event.target;

    if (!isGameActive || cell.textContent !== "") return;

    cell.textContent = currentPlayer;
    cell.style.color = "red";

    if (checkWinner()) {
      setTimeout(() => endGame(currentPlayer), 100);
      return;
    }

    if (isDraw()) {
      setTimeout(() => endGame(null), 100);
      return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";

    // Play the computer's move if it's the computer's turn
    if (isPlayingWithComputer && currentPlayer === "O") {
      setTimeout(() => {
        computerMove();
      }, 500);
    }
  }

  // Existing JavaScript code ...

  document.addEventListener("DOMContentLoaded", () => {
    startGameButton.addEventListener("click", () => {
      isPlayingWithComputer = false;
      startGame();
    });
    playWithComputerButton.addEventListener("click", () => {
      isPlayingWithComputer = true;
      startGame();
    });

    cells.forEach((cell) => cell.addEventListener("click", handleClick));
    restartButton.addEventListener("click", restartGame);
    resetButton.addEventListener("click", resetScores);
    modeToggleButton.addEventListener("click", toggleMode);
    musicToggleButton.addEventListener("click", toggleMusic);
    const exitButton = document.getElementById("exitButton");

    function showWelcomePopup() {
      welcomePopup.style.display = "flex";
      gameContent.style.display = "none";
      scoreboardContainer.style.display = "none"; // Hide scoreboard on return to welcome
      exitButton.style.display = "none"; // Hide Exit button on return to welcome
    }

    exitButton.addEventListener("click", () => {
      showWelcomePopup();
    });

    // Ensure the 'Exit' button is initially hidden
    exitButton.style.display = "none";
  });
  // script.js

  // Function to show the exit button
  function showExitButton() {
    document.getElementById("exitButton").style.display = "block";
  }

  // Function to hide the exit button
  function hideExitButton() {
    document.getElementById("exitButton").style.display = "none";
  }

  // Function to navigate to home page and hide exit button
  function goToHomePage() {
    hideExitButton();
    document.getElementById("welcomePopup").style.display = "flex";
    document.getElementById("gameContent").style.display = "none";
    // Add any additional navigation logic here
  }

  // Event listener for the exit button
  document.getElementById("exitButton").addEventListener("click", function () {
    goToHomePage();
  });

  // Add logic to show the exit button when the match ends
  function onMatchEnd() {
    showExitButton();
    // Other match end logic here
  }

  // Example usage: Call onMatchEnd() when the match ends
  // e.g., onMatchEnd() might be called within game logic
  // Function to show the Exit button
  function showExitButton() {
    document.getElementById("exitButton").classList.add("visible");
  }

  // Function to hide the Exit button
  function hideExitButton() {
    document.getElementById("exitButton").classList.remove("visible");
  }

  // Function to navigate to home page
  function goToHomePage() {
    window.location.href = "index.html"; // Adjust to your home page URL
  }

  // Event listener for the Exit button
  document.getElementById("exitButton").addEventListener("click", () => {
    goToHomePage();
  });
});
