class PongGame {
    constructor(container) {
        this.container = container;
        this.canvas = null;
        this.ctx = null;
        this.paddle = { x: 200, y: 450, width: 100, height: 15 };
        this.ball = { x: 225, y: 225, dx: 3, dy: 3, radius: 10 };
        this.score = 0;
        this.gameLoop = null;
        this.keys = {};
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div class="pong-game">
                <h2>Pong</h2>
                <div class="status">Score: <span id="score">0</span></div>
                <canvas class="pong-canvas" id="pongCanvas" width="450" height="500"></canvas>
                <div class="car-instructions">
                    <p>Use A/D or Left/Right arrows to move paddle</p>
                    <button class="reset-btn" id="reset">Restart</button>
                </div>
            </div>
        `;

        this.canvas = document.getElementById('pongCanvas');
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
            this.ball.dy = -this.ball.dy;
            this.score++;
            document.getElementById('score').textContent = this.score;
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

        // Draw center line
        this.ctx.strokeStyle = '#fff';
        this.ctx.setLineDash([10, 10]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

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

    reset() {
        clearInterval(this.gameLoop);
        this.paddle = { x: 200, y: 450, width: 100, height: 15 };
        this.ball = { x: 225, y: 225, dx: 3, dy: 3, radius: 10 };
        this.score = 0;
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

