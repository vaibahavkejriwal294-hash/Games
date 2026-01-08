class SnakeGame {
    constructor(container) {
        this.container = container;
        this.canvas = null;
        this.ctx = null;
        this.gridSize = 20;
        this.tileCount = 20;
        this.snake = [{ x: 10, y: 10 }];
        this.food = { x: 15, y: 15 };
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.gameLoop = null;
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div class="snake-game">
                <h2>Snake Game</h2>
                <div class="status">Score: <span id="score">0</span></div>
                <canvas class="snake-canvas" id="snakeCanvas" width="400" height="400"></canvas>
                <div class="snake-controls">
                    <p>Use arrow keys to move</p>
                    <button class="reset-btn" id="reset">Restart</button>
                </div>
            </div>
        `;

        this.canvas = document.getElementById('snakeCanvas');
        this.ctx = this.canvas.getContext('2d');
        const resetButton = document.getElementById('reset');

        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        resetButton.addEventListener('click', () => this.reset());

        this.gameLoop = setInterval(() => this.update(), 150);
    }

    handleKeyPress(e) {
        if (e.key === 'ArrowUp' && this.dy !== 1) {
            this.dx = 0;
            this.dy = -1;
        } else if (e.key === 'ArrowDown' && this.dy !== -1) {
            this.dx = 0;
            this.dy = 1;
        } else if (e.key === 'ArrowLeft' && this.dx !== 1) {
            this.dx = -1;
            this.dy = 0;
        } else if (e.key === 'ArrowRight' && this.dx !== -1) {
            this.dx = 1;
            this.dy = 0;
        }
    }

    update() {
        if (this.dx === 0 && this.dy === 0) return;

        const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };

        // Check wall collision
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            this.gameOver();
            return;
        }

        // Check self collision
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }

        this.snake.unshift(head);

        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score++;
            document.getElementById('score').textContent = this.score;
            this.generateFood();
        } else {
            this.snake.pop();
        }

        this.draw();
    }

    generateFood() {
        do {
            this.food = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
        } while (this.snake.some(segment => segment.x === this.food.x && segment.y === this.food.y));
    }

    draw() {
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw snake
        this.ctx.fillStyle = '#4ade80';
        this.snake.forEach((segment, index) => {
            if (index === 0) {
                this.ctx.fillStyle = '#22c55e';
            } else {
                this.ctx.fillStyle = '#4ade80';
            }
            this.ctx.fillRect(segment.x * this.gridSize, segment.y * this.gridSize, this.gridSize - 2, this.gridSize - 2);
        });

        // Draw food
        this.ctx.fillStyle = '#ef4444';
        this.ctx.fillRect(this.food.x * this.gridSize, this.food.y * this.gridSize, this.gridSize - 2, this.gridSize - 2);
    }

    gameOver() {
        clearInterval(this.gameLoop);
        alert(`Game Over! Your score: ${this.score}`);
        this.reset();
    }

    reset() {
        clearInterval(this.gameLoop);
        this.snake = [{ x: 10, y: 10 }];
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.generateFood();
        document.getElementById('score').textContent = '0';
        this.gameLoop = setInterval(() => this.update(), 150);
        this.draw();
    }

    stop() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }
    }
}

