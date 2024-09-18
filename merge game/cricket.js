// Global Variables
let playerScore = 0;
let computerScore = 0;
let target = 0;
let isPlayerBatting = true;
let isGameOver = false;
let firstInningsOver = false;

// Toss Logic
function toss(playerChoice) {
  let tossResult = Math.random() < 0.5 ? "Heads" : "Tails";
  alert(`Toss Result: ${tossResult}`);

  // Hide toss section immediately after the toss is over
  document.getElementById("tossSection").style.display = "none";

  if (playerChoice === tossResult) {
    alert("You won the toss!");
    document.getElementById("batBallSection").style.display = "block";
  } else {
    alert("Computer won the toss!");
    let computerChoice = Math.random() < 0.5 ? "bat" : "ball";
    chooseBatOrBall(computerChoice, true);
  }
}

// Bat or Ball Choice
function chooseBatOrBall(choice, isComputer = false) {
  document.getElementById("batBallSection").style.display = "none";
  document.getElementById("gamePlaySection").style.display = "block";

  if (isComputer) {
    if (choice === "bat") {
      alert("Computer chose to bat first!");
      isPlayerBatting = false;
      document.getElementById("gameStatus").innerText =
        "1st Innings: Computer Batting";
    } else {
      alert("Computer chose to bowl first!");
      isPlayerBatting = true;
      document.getElementById("gameStatus").innerText =
        "1st Innings: Player Batting";
    }
  } else {
    if (choice === "bat") {
      alert("You chose to bat first!");
      isPlayerBatting = true;
      document.getElementById("gameStatus").innerText =
        "1st Innings: Player Batting";
    } else {
      alert("You chose to bowl first!");
      isPlayerBatting = false;
      document.getElementById("gameStatus").innerText =
        "1st Innings: Computer Batting";
    }
  }
}

// Player Play Function
function playerPlay(playerChoice) {
  if (isGameOver) return;

  let computerChoice = Math.floor(Math.random() * 6) + 1;
  document.getElementById(
    "result"
  ).innerText = `Player chose: ${playerChoice}, Computer chose: ${computerChoice}`;

  if (playerChoice === computerChoice) {
    // Player or computer is out
    document.getElementById("outMessage").style.display = "block";
    if (isPlayerBatting) {
      if (firstInningsOver) {
        alert("Player is OUT! Computer wins!");
        endGame("Computer");
      } else {
        target = playerScore + 1;
        document.getElementById(
          "targetMessage"
        ).innerText = `Target for Computer: ${target}`;
        alert("Player is OUT! Target is " + target);
        switchInnings();
      }
    } else {
      if (firstInningsOver) {
        alert("Computer is OUT! Player wins!");
        endGame("Player");
      } else {
        target = computerScore + 1;
        document.getElementById(
          "targetMessage"
        ).innerText = `Target for Player: ${target}`;
        alert("Computer is OUT! Target is " + target);
        switchInnings();
      }
    }
  } else {
    if (isPlayerBatting) {
      playerScore += playerChoice;
      document.getElementById(
        "score"
      ).innerText = `Player Score: ${playerScore}`;
      if (playerScore >= target && firstInningsOver) {
        alert("Player wins by achieving the target!");
        endGame("Player");
      }
    } else {
      computerScore += computerChoice;
      document.getElementById(
        "score"
      ).innerText = `Computer Score: ${computerScore}`;
      if (computerScore >= target && firstInningsOver) {
        alert("Computer wins by achieving the target!");
        endGame("Computer");
      }
    }
  }
}

// Switch Innings
function switchInnings() {
  firstInningsOver = true;
  isPlayerBatting = !isPlayerBatting;

  if (isPlayerBatting) {
    document.getElementById("gameStatus").innerText =
      "2nd Innings: Player Batting";
  } else {
    document.getElementById("gameStatus").innerText =
      "2nd Innings: Computer Batting";
  }

  playerScore = 0;
  computerScore = 0;
  document.getElementById("score").innerText = "Score: 0";
  document.getElementById("outMessage").style.display = "none";
}

// End Game
function endGame(winner) {
  isGameOver = true;
  document.getElementById("gamePlaySection").style.display = "none";
  document.getElementById("newGameSection").style.display = "block";
  document.getElementById("winnerMessage").innerText = `${winner} wins!`;
}

// Start New Match
function startNewMatch() {
  document.getElementById("newGameSection").style.display = "none";
  document.getElementById("tossSection").style.display = "block"; // Reset toss section visibility
  playerScore = 0;
  computerScore = 0;
  target = 0;
  isGameOver = false;
  firstInningsOver = false;
  document.getElementById("score").innerText = "Score: 0";
  document.getElementById("outMessage").style.display = "none";
  document.getElementById("targetMessage").innerText = "";
}
// Function to handle Exit button click
function exitGame() {
  window.location.href = "index.html"; // Redirect to index.html or any other page
}
