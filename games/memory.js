class MemoryGame {
    constructor(container) {
        this.container = container;
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.initializeCards();
        this.render();
    }

    initializeCards() {
        const symbols = ['🍎', '🍌', '🍇', '🍊', '🍓', '🍉', '🥝', '🍑'];
        const pairs = [...symbols, ...symbols];
        
        // Shuffle
        for (let i = pairs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
        }

        this.cards = pairs.map((symbol, index) => ({
            id: index,
            symbol: symbol,
            flipped: false,
            matched: false
        }));
    }

    render() {
        this.container.innerHTML = `
            <div class="memory-game">
                <h2>Memory Game</h2>
                <div class="status">
                    Moves: <span id="moves">0</span> | 
                    Matched: <span id="matched">0</span>/8
                </div>
                <div class="memory-grid" id="memoryGrid"></div>
                <button class="reset-btn" id="reset">New Game</button>
            </div>
        `;

        const grid = document.getElementById('memoryGrid');
        this.cards.forEach(card => {
            const cardElement = document.createElement('button');
            cardElement.className = 'memory-card';
            cardElement.dataset.id = card.id;
            cardElement.textContent = card.flipped ? card.symbol : '?';
            cardElement.addEventListener('click', () => this.flipCard(card.id, cardElement));
            grid.appendChild(cardElement);
        });

        document.getElementById('reset').addEventListener('click', () => this.reset());
    }

    flipCard(cardId, cardElement) {
        const card = this.cards.find(c => c.id === cardId);
        
        if (card.flipped || card.matched || this.flippedCards.length === 2) {
            return;
        }

        card.flipped = true;
        cardElement.textContent = card.symbol;
        cardElement.classList.add('flipped');
        this.flippedCards.push({ card, element: cardElement });

        if (this.flippedCards.length === 2) {
            this.moves++;
            document.getElementById('moves').textContent = this.moves;
            setTimeout(() => this.checkMatch(), 1000);
        }
    }

    checkMatch() {
        const [first, second] = this.flippedCards;
        
        if (first.card.symbol === second.card.symbol) {
            first.card.matched = true;
            second.card.matched = true;
            first.element.classList.add('matched');
            second.element.classList.add('matched');
            this.matchedPairs++;
            document.getElementById('matched').textContent = this.matchedPairs;

            if (this.matchedPairs === 8) {
                setTimeout(() => {
                    alert(`Congratulations! You won in ${this.moves} moves!`);
                }, 500);
            }
        } else {
            first.card.flipped = false;
            second.card.flipped = false;
            first.element.textContent = '?';
            second.element.textContent = '?';
            first.element.classList.remove('flipped');
            second.element.classList.remove('flipped');
        }

        this.flippedCards = [];
    }

    reset() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.initializeCards();
        this.render();
    }

    stop() {
        // Cleanup if needed
    }
}

