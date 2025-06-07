
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 320;
canvas.height = 480;

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let birdImg = new Image();
birdImg.src = "assets/sven.png";

let jumpSound = new Audio("assets/jump.wav");
let gameOverSound = new Audio("assets/gameover.wav");

let bird = { x: 50, y: 150, width: 40, height: 40, velocity: 0 };
let gravity = 0.5;
let lift = -8;
let pipes = [];
let frame = 0;
let gameRunning = true;

document.addEventListener("keydown", flap);
canvas.addEventListener("touchstart", flap);

function flap() {
  if (!gameRunning) return;
  bird.velocity = lift;
  jumpSound.play();
}

function drawBird() {
  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
  });
}

function drawScore() {
  ctx.fillStyle = "#000";
  ctx.font = "16px Arial";
  ctx.fillText("Score: " + score, 10, 20);
  ctx.fillText("High Score: " + highScore, 10, 40);
}

function update() {
  if (!gameRunning) return;

  frame++;
  bird.velocity += gravity;
  bird.y += bird.velocity;

  if (frame % 100 === 0) {
    let top = Math.random() * 200 + 20;
    let bottom = canvas.height - top - 120;
    pipes.push({ x: canvas.width, top, bottom, width: 40 });
  }

  pipes.forEach(pipe => {
    pipe.x -= 2 + Math.floor(score / 10);
    if (pipe.x + pipe.width === bird.x) score++;
  });

  pipes.forEach(pipe => {
    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
    ) {
      endGame();
    }
  });

  if (bird.y > canvas.height || bird.y < 0) {
    endGame();
  }
}

function endGame() {
  gameRunning = false;
  gameOverSound.play();
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }
  alert("Game Over! Your score: " + score);
  location.reload();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  drawPipes();
  drawScore();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
