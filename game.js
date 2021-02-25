const GAME_HEIGHT = 500;
const GAME_WIDTH = 500;
const KEYCODE_LEFT = 37;
const KEYCODE_RIGHT = 39;
const KEYCODE_UP = 38;
const KEYCODE_DOWN = 40;
const GAME_SPEED = 16;
let lastRenderTime = 0;
let SNAKE_LENGTH = 2;
let k;
let SCORE = 0;

const GAME_STATE = {
  snakePosition: [],
  appleXPosition: 23,
  appleYPosition: 23,
  leftKey: null,
  rightKey: true,
  upKey: null,
  downKey: null,
};
const gameboard = document.querySelector("#game-board");
// created as many arrays as lengths value holds
function draw(gameboard) {
  GAME_STATE.snakePosition.forEach((s) => {
    var snake = document.createElement("div");
    snake.className = "player";
    snake.style.gridColumnStart = s.y;
    snake.style.gridRowStart = s.x;
    gameboard.appendChild(snake);
  });
}
function drawApple(gameboard) {
  var apple = document.createElement("div");
  apple.className = "apple";
  apple.style.gridColumnStart = GAME_STATE.appleYPosition;
  apple.style.gridRowStart = GAME_STATE.appleXPosition;
  var blackSq = document.createElement("div");
  blackSq.className = "sqaure";
  blackSq.style.gridColumnStart = 2;
  blackSq.style.gridRowStart = 2;
  gameboard.appendChild(blackSq);

  gameboard.appendChild(apple);
}
function grow() {
  for (k = 0; k < SNAKE_LENGTH; k++)
    GAME_STATE.snakePosition.push({ x: 2, y: 2, length: k });
}
function updateDraw() {
  if (GAME_STATE.snakePosition.length < SNAKE_LENGTH) {
    grow();

    GAME_STATE.snakePosition.length = SNAKE_LENGTH;
  }
  console.log("POS", GAME_STATE.snakePosition.length, "SNAKE", SNAKE_LENGTH);

  gameboard.innerHTML = "";
  drawApple(gameboard);
  draw(gameboard);
}
// moves grid positon by 1 everytime the state is true
function moveSnake() {
  let nx = GAME_STATE.snakePosition[0].x;
  let ny = GAME_STATE.snakePosition[0].y;
  if (GAME_STATE.leftKey && GAME_STATE.snakePosition[0].y !== 0) {
    ny--;
  } else if (GAME_STATE.upKey && GAME_STATE.snakePosition[0].x !== 0) {
    nx--;
  } else if (GAME_STATE.rightKey && GAME_STATE.snakePosition[0].y !== 30) {
    ny++;
  } else if (GAME_STATE.downKey && GAME_STATE.snakePosition[0].x !== 30) {
    nx++;
  }

  // removes last index, returns value
  var tail = GAME_STATE.snakePosition.pop();
  tail.x = nx;
  tail.y = ny;
  // adds that value to the beginning of the array making it the new head constantly repeating
  GAME_STATE.snakePosition.unshift(tail);
}

function isDead() {
  if (
    GAME_STATE.snakePosition[0].y === 30 ||
    GAME_STATE.snakePosition[0].y === 0 ||
    GAME_STATE.snakePosition[0].x === 30 ||
    GAME_STATE.snakePosition[0].x === 0
  ) {
    location.reload();
  }
}

function appleEaten() {
  if (
    GAME_STATE.snakePosition[0].x == GAME_STATE.appleXPosition &&
    GAME_STATE.snakePosition[0].y == GAME_STATE.appleYPosition
  ) {
    SNAKE_LENGTH += 1;
    var random = Math.floor(Math.random() * 28) + 2;
    GAME_STATE.appleXPosition = random;
    GAME_STATE.appleYPosition = random;
    document.getElementById("score").innerText = SCORE += 1;
    console.log("Length", SNAKE_LENGTH);
  }
  for (var i = 1; i < GAME_STATE.snakePosition.length; i++) {
    if (
      GAME_STATE.snakePosition[0].x === GAME_STATE.snakePosition[i].x &&
      GAME_STATE.snakePosition[0].y === GAME_STATE.snakePosition[i].y
    ) {
      location.reload();
    }
  }
}
function setPosition(snake, x, y) {
  snake.style.gridColumnStart = x;
  snake.style.gridRowStart = y;
}
// game loop that runs 24 times a second
function update(currentDelta) {
  window.requestAnimationFrame(update);

  var delta = currentDelta - lastRenderTime;
  if (GAME_SPEED && delta < 1000 / GAME_SPEED) {
    return;
  }

  updateDraw();

  isDead();

  moveSnake();
  appleEaten();

  lastRenderTime = currentDelta;
}

// initally draws the player, apple and their positions

// changes state to false when other buttons pressed to allows you to move more than once
function onkeydown(e) {
  if (e.keyCode === KEYCODE_DOWN) {
    GAME_STATE.downKey = true;
    GAME_STATE.leftKey = false;
    GAME_STATE.rightKey = false;
  } else if (e.keyCode === KEYCODE_UP && GAME_STATE.downKey !== true) {
    GAME_STATE.upKey = true;
    GAME_STATE.downKey = false;

    GAME_STATE.leftKey = false;
    GAME_STATE.rightKey = false;
  } else if (e.keyCode === KEYCODE_LEFT && GAME_STATE.rightKey !== true) {
    GAME_STATE.leftKey = true;
    GAME_STATE.upKey = false;
    GAME_STATE.downKey = false;
  } else if (e.keyCode === KEYCODE_RIGHT) {
    GAME_STATE.rightKey = true;
    GAME_STATE.upKey = false;
    GAME_STATE.downKey = false;
  }
}

window.requestAnimationFrame(update);
window.addEventListener("keydown", onkeydown);
