
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const boxSize = 20; // Size of each square
const isMobile = /Mobi|Android/i.test(navigator.userAgent); // Detect mobile devices



// Responsive canvas size

let canvasSize = isMobile

  ? Math.min(window.innerWidth, window.innerHeight) * 0.8
  : 400; // Fixed size for laptops/desktops
canvas.width = Math.floor(canvasSize / boxSize) * boxSize;
canvas.height = Math.floor(canvasSize / boxSize) * boxSize;
const gridSize = canvas.width / boxSize;



// Game variables
let snake, direction, food, score, gameInterval;

// Initialize game state

function initializeGame() {
  snake = [{ x: 5, y: 5 }]; // Snake starts in the middle
  direction = { x: 0, y: 0 }; // No movement initially
  food = generateFood();
  score = 0;
  document.getElementById("score").innerText = "Score: " + score;
  clearInterval(gameInterval); // Stop any previous game loop
  drawGame(); // Draw the initial state of the game

}


// Listen for keyboard controls

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -1 };
  if (event.key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: 1 };
  if (event.key === "ArrowLeft" && direction.x === 0) direction = { x: -1, y: 0 };
  if (event.key === "ArrowRight" && direction.x === 0) direction = { x: 1, y: 0 };
  if (!gameInterval) startGame(); // Start the game loop when a direction is set

});

// Touch controls for mobile

if (isMobile) {
  document.getElementById("up").addEventListener("click", () => {
    if (direction.y === 0) direction = { x: 0, y: -1 };
    if (!gameInterval) startGame();
  });

  document.getElementById("down").addEventListener("click", () => {
    if (direction.y === 0) direction = { x: 0, y: 1 };
    if (!gameInterval) startGame();

  });

  document.getElementById("left").addEventListener("click", () => {
    if (direction.x === 0) direction = { x: -1, y: 0 };
    if (!gameInterval) startGame();

  });

  document.getElementById("right").addEventListener("click", () => {
    if (direction.x === 0) direction = { x: 1, y: 0 };
    if (!gameInterval) startGame();

  });

}


// Start the game loop

function startGame() {
  gameInterval = setInterval(gameLoop, 120); // Run the game loop every 100ms

}

// Main game loop

function gameLoop() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // This is for where i check for collisions

  if (
    head.x < 0 ||
    head.x >= gridSize ||
    head.y < 0 ||
    head.y >= gridSize ||
    snake.some((segment) => segment.x === head.x && segment.y === head.y)

  ) {

    alert("Game Over! Your score: " + score);
    initializeGame();
    return;

  }

  // for adding a new head

  snake.unshift(head);



  // For checking if the snake eats food

  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById("score").innerText = "Score: " + score;
    food = generateFood();
  } else {

    // This is for Removing tail

    snake.pop();

  }

  drawGame();

}



// This is for generating random food position

function generateFood() {
  let foodPosition;
  do {

    foodPosition = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),

    };

  } while (snake.some((segment) => segment.x === foodPosition.x && segment.y === foodPosition.y));

  return foodPosition;

}



// Draw the game elements

function drawGame() {

  // Clear canvas

  ctx.fillStyle = "#fff";

  ctx.fillRect(0, 0, canvas.width, canvas.height);



  // Draw snake

  ctx.fillStyle = "#4caf50";

  snake.forEach((segment) => {

    ctx.fillRect(segment.x * boxSize, segment.y * boxSize, boxSize, boxSize);

  });



  // Draw food

  ctx.fillStyle = "#f44336";

  ctx.fillRect(food.x * boxSize, food.y * boxSize, boxSize, boxSize);

}



// Initialize the game on load

initializeGame();

