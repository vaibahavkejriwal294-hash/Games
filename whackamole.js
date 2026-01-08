// Whack-a-Mole Game
class WhackAMoleGame {
    constructor(container) {
        this.container = container;
        this.score = 0;
        this.timeLeft = 30;
        this.moleInterval = null;
        this.timerInterval = null;
        this.activeMole = -1;
        this.gameActive = false;
        this.highScore = parseInt(localStorage.getItem('moleHigh')) || 0;

        this.init();
    }

    init() {
        this.container.innerHTML = `
            <div class="whackamole-game">
                <h2>🔨 Whack-a-Mole</h2>
                <div class="game-info">
                    <span>Score: <strong id="mole-score">0</strong></span>
                    <span>Time: <strong id="mole-time">30</strong>s</span>
                    <span>Best: <strong id="mole-best">${this.highScore}</strong></span>
                </div>
                <div class="mole-grid" id="mole-grid"></div>
                <button class="reset-btn" id="mole-start">Start Game</button>
            </div>
        `;

        this.createHoles();
        document.getElementById('mole-start').addEventListener('click', () => this.startGame());
    }

    createHoles() {
        const grid = document.getElementById('mole-grid');
        grid.innerHTML = '';

        for (let i = 0; i < 9; i++) {
            const hole = document.createElement('div');
            hole.className = 'mole-hole';
            hole.dataset.index = i;

            const mole = document.createElement('div');
            mole.className = 'mole';
            mole.textContent = '🐹';
            hole.appendChild(mole);

            hole.addEventListener('click', () => this.whack(i));
            grid.appendChild(hole);
        }
    }

    startGame() {
        this.score = 0;
        this.timeLeft = 30;
        this.gameActive = true;
        this.activeMole = -1;

        document.getElementById('mole-score').textContent = '0';
        document.getElementById('mole-time').textContent = '30';
        document.getElementById('mole-start').textContent = 'Playing...';
        document.getElementById('mole-start').disabled = true;

        // Clear any existing moles
        document.querySelectorAll('.mole-hole').forEach(hole => {
            hole.classList.remove('active');
        });

        // Start spawning moles
        this.spawnMole();
        this.moleInterval = setInterval(() => this.spawnMole(), 800);

        // Start timer
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            document.getElementById('mole-time').textContent = this.timeLeft;

            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    spawnMole() {
        if (!this.gameActive) return;

        // Hide current mole
        if (this.activeMole >= 0) {
            const currentHole = document.querySelector(`[data-index="${this.activeMole}"]`);
            if (currentHole) {
                currentHole.classList.remove('active');
            }
        }

        // Show random new mole
        let newMole;
        do {
            newMole = Math.floor(Math.random() * 9);
        } while (newMole === this.activeMole);

        this.activeMole = newMole;
        const hole = document.querySelector(`[data-index="${newMole}"]`);
        if (hole) {
            hole.classList.add('active');
        }

        // Auto-hide after a bit
        setTimeout(() => {
            if (this.activeMole === newMole && this.gameActive) {
                const h = document.querySelector(`[data-index="${newMole}"]`);
                if (h) h.classList.remove('active');
            }
        }, 600);
    }

    whack(index) {
        if (!this.gameActive) return;

        const hole = document.querySelector(`[data-index="${index}"]`);

        if (hole.classList.contains('active')) {
            hole.classList.remove('active');
            this.score += 10;
            document.getElementById('mole-score').textContent = this.score;

            // Visual feedback
            hole.style.transform = 'scale(0.9)';
            setTimeout(() => {
                hole.style.transform = '';
            }, 100);

            // Spawn new mole immediately
            if (this.activeMole === index) {
                this.activeMole = -1;
            }
        }
    }

    endGame() {
        this.gameActive = false;

        if (this.moleInterval) {
            clearInterval(this.moleInterval);
            this.moleInterval = null;
        }

        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        // Hide all moles
        document.querySelectorAll('.mole-hole').forEach(hole => {
            hole.classList.remove('active');
        });

        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('moleHigh', this.highScore);
            document.getElementById('mole-best').textContent = this.highScore;
        }

        document.getElementById('mole-start').textContent = `Game Over! Score: ${this.score} - Play Again`;
        document.getElementById('mole-start').disabled = false;
    }

    stop() {
        this.gameActive = false;

        if (this.moleInterval) {
            clearInterval(this.moleInterval);
        }

        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }
}
