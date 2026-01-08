class BreakoutGame {
    constructor(container) {
        this.container = container;
        this.canvas = null;
        this.ctx = null;
        this.paddle = { x: 200, y: 450, width: 100, height: 15 };
        this.ball = { x: 225, y: 300, dx: 4, dy: -4, radius: 8 };
        this.bricks = [];
        this.score = 0;
        this.gameLoop = null;
        this.keys = {};
        this.initializeBricks();
        this.render();
    }

    initializeBricks() {
        const rows = 5;
        const cols = 8;
        const brickWidth = 50;
        const brickHeight = 20;
        const padding = 5;
        const offsetTop = 50;
        const offsetLeft = 25;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                this.bricks.push({
                    x: c * (brickWidth + padding) + offsetLeft,
                    y: r * (brickHeight + padding) + offsetTop,
                    width: brickWidth,
                    height: brickHeight,
                    visible: true
                });
            }
        }
    }

    render() {
        this.container.innerHTML = `
            <div class="breakout-game">
                <h2>Breakout</h2>
                <div class="status">Score: <span id="score">0</span></div>
                <canvas class="breakout-canvas" id="breakoutCanvas" width="450" height="500"></canvas>
                <div class="car-instructions">
                    <p>Use A/D or Left/Right arrows to move paddle</p>
                    <button class="reset-btn" id="reset">Restart</button>
                </div>
            </div>
        `;

        this.canvas = document.getElementById('breakoutCanvas');
        this.ctx = this.canvas.getContext('2d');
        const resetButton = document.getElementById('reset');

        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });

        resetButton.addEventListener('click', () => this.reset());

        this.gameLoop = setInterval(() => this.update(), 16);
    }

    update() {
        // Move paddle
        if ((this.keys['a'] || this.keys['A'] || this.keys['ArrowLeft']) && this.paddle.x > 0) {
            this.paddle.x -= 7;
        }
        if ((this.keys['d'] || this.keys['D'] || this.keys['ArrowRight']) && this.paddle.x < this.canvas.width - this.paddle.width) {
            this.paddle.x += 7;
        }

        // Move ball
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;

        // Ball collision with walls
        if (this.ball.x - this.ball.radius <= 0 || this.ball.x + this.ball.radius >= this.canvas.width) {
            this.ball.dx = -this.ball.dx;
        }
        if (this.ball.y - this.ball.radius <= 0) {
            this.ball.dy = -this.ball.dy;
        }

        // Ball collision with paddle
        if (this.ball.y + this.ball.radius >= this.paddle.y &&
            this.ball.x >= this.paddle.x &&
            this.ball.x <= this.paddle.x + this.paddle.width) {
            this.ball.dy = -Math.abs(this.ball.dy);
        }

        // Ball collision with bricks
        this.bricks.forEach(brick => {
            if (brick.visible && 
                this.ball.x + this.ball.radius >= brick.x &&
                this.ball.x - this.ball.radius <= brick.x + brick.width &&
                this.ball.y + this.ball.radius >= brick.y &&
                this.ball.y - this.ball.radius <= brick.y + brick.height) {
                brick.visible = false;
                this.ball.dy = -this.ball.dy;
                this.score += 10;
                document.getElementById('score').textContent = this.score;
            }
        });

        // Check win condition
        if (this.bricks.every(brick => !brick.visible)) {
            this.gameWon();
            return;
        }

        // Ball out of bounds
        if (this.ball.y > this.canvas.height) {
            this.gameOver();
            return;
        }

        this.draw();
    }

    draw() {
        // Draw background
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw bricks
        this.bricks.forEach(brick => {
            if (brick.visible) {
                this.ctx.fillStyle = '#ef4444';
                this.ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
                this.ctx.strokeStyle = '#fff';
                this.ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
            }
        });

        // Draw paddle
        this.ctx.fillStyle = '#3b82f6';
        this.ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);

        // Draw ball
        this.ctx.fillStyle = '#fff';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    gameOver() {
        clearInterval(this.gameLoop);
        alert(`Game Over! Your score: ${this.score}`);
        this.reset();
    }

    gameWon() {
        clearInterval(this.gameLoop);
        alert(`Congratulations! You won! Final score: ${this.score}`);
        this.reset();
    }

    reset() {
        clearInterval(this.gameLoop);
        this.paddle = { x: 200, y: 450, width: 100, height: 15 };
        this.ball = { x: 225, y: 300, dx: 4, dy: -4, radius: 8 };
        this.bricks = [];
        this.score = 0;
        this.initializeBricks();
        document.getElementById('score').textContent = '0';
        this.gameLoop = setInterval(() => this.update(), 16);
        this.draw();
    }

    stop() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }
    }
}

