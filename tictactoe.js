class TicTacToe {
    constructor(container) {
        this.container = container;
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameOver = false;
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div class="tic-tac-toe">
                <h2>Tic-Tac-Toe</h2>
                <div class="status" id="status">Player ${this.currentPlayer}'s turn</div>
                <div class="board" id="board"></div>
                <button class="reset-btn" id="reset">New Game</button>
            </div>
        `;

        const boardElement = document.getElementById('board');
        const statusElement = document.getElementById('status');
        const resetButton = document.getElementById('reset');

        this.board.forEach((cell, index) => {
            const cellElement = document.createElement('button');
            cellElement.className = 'cell';
            cellElement.textContent = cell || '';
            cellElement.disabled = cell !== null || this.gameOver;
            cellElement.addEventListener('click', () => this.makeMove(index, cellElement, statusElement));
            boardElement.appendChild(cellElement);
        });

        resetButton.addEventListener('click', () => this.reset());
    }

    makeMove(index, cellElement, statusElement) {
        if (this.board[index] || this.gameOver) return;

        this.board[index] = this.currentPlayer;
        cellElement.textContent = this.currentPlayer;
        cellElement.disabled = true;

        if (this.checkWinner()) {
            statusElement.textContent = `Player ${this.currentPlayer} wins! 🎉`;
            this.gameOver = true;
            this.disableAllCells();
            return;
        }

        if (this.board.every(cell => cell !== null)) {
            statusElement.textContent = "It's a draw!";
            this.gameOver = true;
            return;
        }

        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        statusElement.textContent = `Player ${this.currentPlayer}'s turn`;
    }

    checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6] // diagonals
        ];

        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return this.board[a] && 
                   this.board[a] === this.board[b] && 
                   this.board[a] === this.board[c];
        });
    }

    disableAllCells() {
        document.querySelectorAll('.cell').forEach(cell => {
            cell.disabled = true;
        });
    }

    reset() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameOver = false;
        this.render();
    }

    stop() {
        // Cleanup if needed
    }
}

