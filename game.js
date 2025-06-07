
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 480;
canvas.height = 640;

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;

let birdImg = new Image();
birdImg.src = "assets/sven.png";

let jumpSound = new Audio("assets/jump.wav");
let gameOverSound = new Audio("assets/gameover.wav");

let gameStarted = false;
let gameRunning = true;

let bird = {
  x: canvas.width * 0.2,
  y: canvas.height / 2,
  width: canvas.width * 0.1,
  height: canvas.width * 0.1,
  velocity: 0
};

let gravity = 0.5;
let lift = -8;
let pipes = [];
let frame = 0;

document.addEventListener("keydown", startGame);
canvas.addEventListener("mousedown", startGame);
canvas.addEventListener("touchstart", startGame);

function startGame() {
  if (!gameStarted) {
    gameStarted = true;
  }
  flap();
}

function flap() {
  if (!gameRunning) return;
  bird.velocity = lift;
  jumpSound.play();
}

function drawBackground() {
  ctx.fillStyle = "#001d3d"; // Dark night
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  for (let i = 0; i < 50; i++) {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    ctx.fillRect(x, y, 1, 1);
  }
}

function drawBird() {
  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  ctx.fillStyle = "#2ecc71"; // Mario-style green
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, pipe.top - 10, pipe.width, 10); // top lip
    ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
    ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, 10); // bottom lip
  });
}

function drawScore() {
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
  ctx.fillText("High Score: " + highScore, 10, 60);
}

function update() {
  if (!gameRunning) return;

  if (gameStarted) {
    frame++;
    bird.velocity += gravity;
    bird.y += bird.velocity;

    if (frame % 90 === 0) {
      let top = Math.random() * canvas.height * 0.4 + 50;
      let gap = canvas.height * 0.25;
      let bottom = canvas.height - top - gap;

      pipes.push({
        x: canvas.width,
        top: top,
        bottom: bottom,
        width: canvas.width * 0.12,
        scored: false
      });
    }

    pipes.forEach(pipe => {
      pipe.x -= 2 + Math.floor(score / 10);

      if (!pipe.scored && pipe.x + pipe.width < bird.x) {
        pipe.scored = true;
        score++;
      }
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
  } else {
    // Gentle float before game starts
    bird.y += Math.sin(frame / 10) * 0.5;
    frame++;
  }
}

function endGame() {
  gameRunning = false;
  gameOverSound.play();
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }
  setTimeout(() => {
    alert("Game Over! Your score: " + score);
    location.reload();
  }, 100);
}

function draw() {
  drawBackground();
  drawPipes();
  drawBird();
  drawScore();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
