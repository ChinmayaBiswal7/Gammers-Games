const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scale = 20;
const initialSpeed = 100;
const speedIncrement = 10;
const obstacleInterval = 20; // Obstacles appear after every 20 points

let rows, cols;
let snake;
let fruit;
let obstacles = [];
let score = 0;
let speed = initialSpeed;
let direction = "RIGHT";
let nextDirection = "RIGHT";
let gameInterval;

document.addEventListener("keydown", (e) => {
  switch (e.code) {
    case "ArrowUp":
      if (direction !== "DOWN") nextDirection = "UP";
      break;
    case "ArrowDown":
      if (direction !== "UP") nextDirection = "DOWN";
      break;
    case "ArrowLeft":
      if (direction !== "RIGHT") nextDirection = "LEFT";
      break;
    case "ArrowRight":
      if (direction !== "LEFT") nextDirection = "RIGHT";
      break;
  }
});

// Touch controls for mobile
document.getElementById("gameCanvas").addEventListener("touchstart", (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  const canvasRect = canvas.getBoundingClientRect();
  const x = touch.clientX - canvasRect.left;
  const y = touch.clientY - canvasRect.top;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  if (x < centerX - 100) {
    nextDirection = "LEFT";
  } else if (x > centerX + 100) {
    nextDirection = "RIGHT";
  } else if (y < centerY - 100) {
    nextDirection = "UP";
  } else if (y > centerY + 100) {
    nextDirection = "DOWN";
  }
});

function setup() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  rows = Math.floor(canvas.height / scale);
  cols = Math.floor(canvas.width / scale);
  snake = [
    { x: Math.floor(cols / 2) * scale, y: Math.floor(rows / 2) * scale },
  ];
  fruit = {
    x: Math.floor(Math.random() * cols) * scale,
    y: Math.floor(Math.random() * rows) * scale,
  };
  obstacles = [];
  score = 0;
  speed = initialSpeed;
  direction = nextDirection = "RIGHT";
  document.getElementById("score").textContent = `Score: ${score}`;
  document.getElementById("restart").addEventListener("click", setup);
  document.getElementById("exit").addEventListener("click", () => {
    window.location.href = "index.html";
  });
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, speed);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  moveSnake();
  checkCollision();
  drawSnake();
  drawFruit();
  drawObstacles();
}

function moveSnake() {
  direction = nextDirection;
  const head = { ...snake[0] };
  switch (direction) {
    case "UP":
      head.y -= scale;
      break;
    case "DOWN":
      head.y += scale;
      break;
    case "LEFT":
      head.x -= scale;
      break;
    case "RIGHT":
      head.x += scale;
      break;
  }
  snake.unshift(head);
  if (head.x === fruit.x && head.y === fruit.y) {
    score++;
    document.getElementById("score").textContent = `Score: ${score}`;
    fruit = {
      x: Math.floor(Math.random() * cols) * scale,
      y: Math.floor(Math.random() * rows) * scale,
    };
    if (score % obstacleInterval === 0) {
      addObstacles(); // Add obstacles only if score is a multiple of 20
    }
    if (score % 5 === 0) {
      speed = Math.max(30, speed - speedIncrement); // Limit minimum speed
      clearInterval(gameInterval);
      gameInterval = setInterval(gameLoop, speed);
    }
  } else {
    snake.pop();
  }
}

function checkCollision() {
  const head = snake[0];
  if (
    head.x < 0 ||
    head.x >= canvas.width ||
    head.y < 0 ||
    head.y >= canvas.height
  ) {
    setup(); // Restart game on collision
  }
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      setup(); // Restart game on collision with itself
    }
  }
  for (const obstacle of obstacles) {
    if (head.x === obstacle.x && head.y === obstacle.y) {
      setup(); // Restart game on collision with obstacle
    }
  }
}

function drawSnake() {
  ctx.fillStyle = "green";
  for (const segment of snake) {
    ctx.fillRect(segment.x, segment.y, scale, scale);
  }
}

function drawFruit() {
  ctx.fillStyle = "red";
  ctx.fillRect(fruit.x, fruit.y, scale, scale);
}

function addObstacles() {
  obstacles = [];
  for (let i = 0; i < 5; i++) {
    let x, y;
    do {
      x = Math.floor(Math.random() * cols) * scale;
      y = Math.floor(Math.random() * rows) * scale;
    } while (
      snake.some((segment) => segment.x === x && segment.y === y) ||
      (x === fruit.x && y === fruit.y)
    );
    obstacles.push({ x, y });
  }
}

function drawObstacles() {
  ctx.fillStyle = "brown";
  for (const obstacle of obstacles) {
    ctx.fillRect(obstacle.x, obstacle.y, scale, scale);
  }
}

setup();
