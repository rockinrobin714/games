const canvas = document.getElementById("gameCanvas");
const canvasContext = canvas.getContext("2d");
let ballX = 50;
let ballY = 50;
let ballSpeedX = 10;
let ballSpeedY = 4;

let paddle1Y = 250;
let paddle2Y = 250;
const paddleHeight = 100;
const paddleThickness = 10;

let player1Score = 0;
let player2Score = 0;
const winningScore = 3;

let showingWinScreen = false;

colorRect = (leftX, topY, width, height, drawColor) => {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
};

colorCircle = (centerX, centerY, radius, color) => {
  canvasContext.fillStyle = color;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2);
  canvasContext.fill();
};

drawNet = () => {
  for (let i = 0; i < canvas.height; i += 40) {
    colorRect(canvas.width / 2 - 1, i, 2, 20, "white");
  }
};

drawEverything = () => {
  colorRect(0, 0, canvas.width, canvas.height, "black");
  canvasContext.fillStyle = "white";
  canvasContext.fillText(player1Score, 100, 100);
  canvasContext.fillText(player2Score, canvas.width - 100, 100);
  if (showingWinScreen) {
    canvasContext.fillStyle = "white";

    if (player1Score >= winningScore) {
      canvasContext.fillText("Player 1 wins", 350, 200);
    } else {
      canvasContext.fillText("Player 2 wins", 350, 200);
    }
    canvasContext.fillText("Click to play again", 350, 500);
    return;
  }
  drawNet();

  colorRect(0, paddle1Y, paddleThickness, paddleHeight, "white");
  colorRect(
    canvas.width - paddleThickness,
    paddle2Y,
    paddleThickness,
    paddleHeight,
    "white"
  );
  colorCircle(ballX, ballY, 10, "white");
};

calculateMousePos = e => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left - document.documentElement.scrollLeft;
  const y = e.clientY - rect.top - document.documentElement.scrollTop;
  return { x, y };
};

ballReset = () => {
  if (player1Score >= winningScore || player2Score >= winningScore) {
    showingWinScreen = true;
  }
  ballSpeedX = -ballSpeedX;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
};

computerMovement = () => {
  const paddle2YCenter = paddle2Y + paddleHeight / 2;
  if (paddle2YCenter < ballY - 25) {
    paddle2Y += 6;
  } else if (paddle2YCenter > ballY + 25) {
    paddle2Y -= 6;
  }
};

moveEverything = () => {
  if (showingWinScreen) {
    return;
  }
  computerMovement();
  ballX += ballSpeedX;
  if (ballX > canvas.width) {
    if (ballY > paddle2Y && ballY < paddle2Y + paddleHeight) {
      ballSpeedX = -ballSpeedX;
      const deltaY = ballY - (paddle2Y + paddleHeight / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      player1Score++;
      ballReset();
    }
  }
  if (ballX < 0) {
    if (ballY > paddle1Y && ballY < paddle1Y + paddleHeight) {
      ballSpeedX = -ballSpeedX;
      const deltaY = ballY - (paddle1Y + paddleHeight / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      player2Score++;
      ballReset();
    }
  }
  ballY += ballSpeedY;
  if (ballY > canvas.height || ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
};

handleMouseClick = () => {
  if (showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
};

window.onload = () => {
  const framesPerSecond = 30;
  setInterval(() => {
    drawEverything();
    moveEverything();
  }, 1000 / framesPerSecond);

  canvas.addEventListener("mousemove", e => {
    const { x, y } = calculateMousePos(e);
    paddle1Y = y - paddleHeight / 2;
  });

  canvas.addEventListener("mousedown", handleMouseClick);
};
