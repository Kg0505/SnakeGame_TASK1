// Game Constants & Variables
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');
let speed = 15;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [
  { x: 13, y: 15 }
];

let food = { x: 6, y: 7 };

// Time system variables
let gameDuration = 60; // Game duration in seconds
let remainingTime = gameDuration; // Remaining time in seconds
let timeInterval;

function main(ctime) {
  window.requestAnimationFrame(main);
  if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
    return;
  }
  lastPaintTime = ctime;
  gameEngine();
}

function isCollide(snake) {
  // If you bump into yourself
  for (let i = 1; i < snakeArr.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }
  // If you bump into the wall
  if (
    snake[0].x >= 20 ||
    snake[0].x <= 0 ||
    snake[0].y >= 20 ||
    snake[0].y <= 0
  ) {
    return true;
  }
  return false;
}

function gameEngine() {
  // Part 1: Updating the snake array & Food
  if (isCollide(snakeArr)) {
    gameOverSound.play();
    musicSound.pause();
    inputDir = { x: 0, y: 0 };
    alert('Game Over. Press any key to play again!');
    snakeArr = [{ x: 13, y: 15 }];
    musicSound.play();
    score = 0;
    remainingTime = gameDuration;
    startTimer();
  }

  // If you have eaten the food, increment the score and regenerate the food
  if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
    foodSound.play();
    score += 1;
    if (score > hiscoreval) {
      hiscoreval = score;
      localStorage.setItem('hiscore', JSON.stringify(hiscoreval));
      hiscoreBox.innerHTML = 'HiScore: ' + hiscoreval;
    }
    scoreBox.innerHTML = 'Score: ' + score;
    snakeArr.unshift({
      x: snakeArr[0].x + inputDir.x,
      y: snakeArr[0].y + inputDir.y
    });
    let a = 2;
    let b = 18;
    food = {
      x: Math.round(a + (b - a) * Math.random()),
      y: Math.round(a + (b - a) * Math.random())
    };
  }

  // Moving the snake
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] };
  }

  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;

  // Part 2: Display the snake and Food
  // Display the snake
  board.innerHTML = '';
  snakeArr.forEach((e, index) => {
    snakeElement = document.createElement('div');
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;

    if (index === 0) {
      snakeElement.classList.add('head');
    } else {
      snakeElement.classList.add('snake');
    }
    board.appendChild(snakeElement);
  });
  // Display the food
  foodElement = document.createElement('div');
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add('food');
  board.appendChild(foodElement);
}

function startTimer() {
  clearInterval(timeInterval);
  timeInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  remainingTime--;
  document.getElementById('timer').textContent = 'Timer: ' + remainingTime;

  if (remainingTime <= 0) {
    clearInterval(timeInterval);
    gameOver();
  }
}

function increaseTime() {
  remainingTime += 5; // Increase the time by 5 seconds
}

function startGame() {
  score = 0;
  remainingTime = gameDuration;
  startTimer();
  window.requestAnimationFrame(main);
}

function gameOver() {
  clearInterval(timeInterval);
  gameOverSound.play();
  musicSound.pause();
  inputDir = { x: 0, y: 0 };
  alert('Game Over. Press any key to play again!');
  snakeArr = [{ x: 13, y: 15 }];
  musicSound.play();
  score = 0;
  startTimer();
}

// Main logic starts here
let hiscore = localStorage.getItem('hiscore');
if (hiscore === null) {
  hiscoreval = 0;
  localStorage.setItem('hiscore', JSON.stringify(hiscoreval));
} else {
  hiscoreval = JSON.parse(hiscore);
  hiscoreBox.innerHTML = 'HiScore: ' + hiscore;
}

startGame();

const controlBtns = document.querySelectorAll('.control-btn');
controlBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const direction = btn.dataset.direction;
    switch (direction) {
      case 'up':
        inputDir.x = 0;
        inputDir.y = -1;
        break;
      case 'down':
        inputDir.x = 0;
        inputDir.y = 1;
        break;
      case 'left':
        inputDir.x = -1;
        inputDir.y = 0;
        break;
      case 'right':
        inputDir.x = 1;
        inputDir.y = 0;
        break;
      default:
        break;
    }
    moveSound.play();
  });
});

window.addEventListener('keydown', e => {
  const direction = e.key.replace('Arrow', '').toLowerCase();
  const validDirections = ['up', 'down', 'left', 'right'];
  if (validDirections.includes(direction)) {
    e.preventDefault();
    inputDir.x = 0;
    inputDir.y = 0;
    switch (direction) {
      case 'up':
        inputDir.y = -1;
        break;
      case 'down':
        inputDir.y = 1;
        break;
      case 'left':
        inputDir.x = -1;
        break;
      case 'right':
        inputDir.x = 1;
        break;
      default:
        break;
    }
    moveSound.play();
  }
});
