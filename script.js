"use strict";

/* ================================
   CONFIGURATION
================================ */

const GRID_SIZE = 20;
const GAME_SPEED = 150;

/* ================================
   DOM ELEMENTS
================================ */

const cells = document.querySelectorAll(".cell");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");

/* ================================
   AUDIO SYSTEM
================================ */

const eatSound = new Audio("assets/food eating.mp3");
const gameOverSound = new Audio("assets/game over.mp3");

eatSound.volume = 0.7;

/* ================================
   GAME STATE
================================ */

let snake = [];
let direction = "right";
let food = null;
let gameInterval = null;

/* ================================
   INITIALIZE GAME
================================ */

function initGame() {
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ];

  direction = "right";

  food = generateFood();

  render();
}

/* ================================
   GAME LOOP
================================ */

function gameLoop() {
  moveSnake();
  render();
}

/* ================================
   START GAME
================================ */

startBtn.addEventListener("click", () => {
  if (!gameInterval) {
    gameInterval = setInterval(gameLoop, GAME_SPEED);
    moveSound.currentTime = 0;
    moveSound.play();
  }
});

/* ================================
   PAUSE GAME
================================ */

pauseBtn.addEventListener("click", () => {
  clearInterval(gameInterval);
  gameInterval = null;
  moveSound.pause();
});

/* ================================
   RESTART GAME
================================ */

restartBtn.addEventListener("click", () => {
  clearInterval(gameInterval);
  gameInterval = null;

  initGame();
});

/* ================================
   MOVE SNAKE
================================ */

function moveSnake() {
  const head = { ...snake[0] };

  if (direction === "right") head.x++;
  if (direction === "left") head.x--;
  if (direction === "up") head.y--;
  if (direction === "down") head.y++; 

  /* WALL COLLISION */

  if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
    gameOver();
    return;
  }

  /* SELF COLLISION */

  for (const segment of snake) {
    if (segment.x === head.x && segment.y === head.y) {
      gameOver();
      return;
    }
  }

  snake.unshift(head);

  /* FOOD CHECK */

  if (head.x === food.x && head.y === food.y) {
    eatSound.currentTime = 0;
    eatSound.play();

    food = generateFood();
  } else {
    snake.pop();
  }
}

/* ================================
   GENERATE FOOD
================================ */

function generateFood() {
  let newFood;

  while (true) {
    newFood = {
      x: Math.floor(Math.random() * (GRID_SIZE - 2)) + 1,
      y: Math.floor(Math.random() * (GRID_SIZE - 2)) + 1,
    };

    const overlapsSnake = snake.some(
      (segment) => segment.x === newFood.x && segment.y === newFood.y,
    );

    if (!overlapsSnake) break;
  }

  return newFood;
}

/* ================================
   RENDER GAME
================================ */

function render() {

  cells.forEach((cell) => {
    cell.classList.remove("snake");
    cell.classList.remove("snake-head");
    cell.classList.remove("food");
  });


  snake.forEach((segment, index) => {
    const cellIndex = segment.y * GRID_SIZE + segment.x;
    const cell = cells[cellIndex];

    if (!cell) return;

    if (index === 0) {
      cell.classList.add("snake-head");
    } else {
      cell.classList.add("snake");
    }
  });


  const foodIndex = food.y * GRID_SIZE + food.x;
  const foodCell = cells[foodIndex];

  if (foodCell) {
    foodCell.classList.add("food");
  }
}

/* ================================
   KEYBOARD CONTROLS
================================ */

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      if (direction !== "down") direction = "up";
      break;

    case "ArrowDown":
      if (direction !== "up") direction = "down";
      break;

    case "ArrowLeft":
      if (direction !== "right") direction = "left";
      break;

    case "ArrowRight":
      if (direction !== "left") direction = "right";
      break;
  }
});

/* ================================
   GAME OVER
================================ */

function gameOver() {
  clearInterval(gameInterval);
  gameInterval = null;

  gameOverSound.currentTime = 0;
  gameOverSound.play();

  setTimeout(() => {
    alert("Game Over");

    initGame();
  }, 300);
  moveSound.pause();
}

/* ================================
   START STATE
================================ */

initGame();

