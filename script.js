const canvas = document.getElementById('pongCanvas');
const context = canvas.getContext('2d');

// Paddle properties
const paddleWidth = 10;
const paddleHeight = 100;
const playerPaddleSpeed = 8; // Player paddle speed
const computerPaddleSpeed = 2; // Reduced computer paddle speed

// Ball properties
const ballRadius = 10;
const initialBallSpeed = 4; // Slightly slower ball speed
let ballSpeedX = initialBallSpeed;
let ballSpeedY = initialBallSpeed;

// Player scores
let playerScore = 0;
let computerScore = 0;

// Player paddle
const player = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0
};

// Computer paddle
const computer = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: computerPaddleSpeed
};

// Ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: ballRadius,
    speedX: ballSpeedX,
    speedY: ballSpeedY
};

function drawRect(x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.closePath();
    context.fill();
}

function drawText(text, x, y, color) {
    context.fillStyle = color;
    context.font = "32px Arial";
    context.fillText(text, x, y);
}

function drawNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(canvas.width / 2 - 1, i, 2, 10, '#fff');
    }
}

function update() {
    // Move paddles
    player.y += player.dy;

    // Prevent paddles from going out of bounds
    if (player.y < 0) player.y = 0;
    if (player.y + paddleHeight > canvas.height) player.y = canvas.height - paddleHeight;

    // Move computer paddle with some randomness and delay
    if (ball.y < computer.y + paddleHeight / 2) {
        computer.y -= computer.dy + Math.random() * 2; // Add randomness
    } else {
        computer.y += computer.dy + Math.random() * 2; // Add randomness
    }

    // Introduce a small delay in the computer paddle's reaction
    if (Math.random() < 0.1) {
        computer.y += computer.dy;
    }

    // Prevent computer paddle from going out of bounds
    if (computer.y < 0) computer.y = 0;
    if (computer.y + paddleHeight > canvas.height) computer.y = canvas.height - paddleHeight;

    // Move ball
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Ball collision with top and bottom walls
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.speedY = -ball.speedY;
    }

    // Ball collision with paddles
    if (
        (ball.x - ball.radius < player.x + player.width && ball.y > player.y && ball.y < player.y + player.height) ||
        (ball.x + ball.radius > computer.x && ball.y > computer.y && ball.y < computer.y + computer.height)
    ) {
        ball.speedX = -ball.speedX;
    }

    // Ball goes out of bounds
    if (ball.x - ball.radius < 0) {
        computerScore++;
        resetBall('player');
    }

    if (ball.x + ball.radius > canvas.width) {
        playerScore++;
        resetBall('computer');
    }
}

function resetBall(toSide) {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = initialBallSpeed * (toSide === 'player' ? 1 : -1); // Always direct to opponent's side
    ball.speedY = initialBallSpeed * (Math.random() > 0.5 ? 1 : -1);
}

function draw() {
    drawRect(0, 0, canvas.width, canvas.height, '#000');
    drawNet();
    drawRect(player.x, player.y, player.width, player.height, '#fff');
    drawRect(computer.x, computer.y, computer.width, computer.height, '#fff');
    drawCircle(ball.x, ball.y, ball.radius, '#fff');
    drawText(playerScore, canvas.width / 4, 50, '#fff');
    drawText(computerScore, 3 * canvas.width / 4, 50, '#fff');
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    player.y = event.clientY - rect.top - paddleHeight / 2;
});

gameLoop();