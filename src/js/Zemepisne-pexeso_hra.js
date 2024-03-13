document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const scoreBoard = document.querySelector('.score-board');
    let score = 0;
    let cardsFlipped = [];
    let isWaiting = false;

    const states = ["Česko", "Slovensko", "Maďarsko", "Rakousko", "Německo", "Polsko", "Itálie", "Chorvatsko", "Francie", "Belgie", "Velká Británie", "Švýcarsko"];
    const cardSet = [...states, ...states].sort(() => 0.5 - Math.random());

    cardSet.forEach((state, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back">${index % 2 === 0 ? state : "Vlajka " + state}</div>
            </div>`;
        card.dataset.name = state;

        card.addEventListener('click', () => {
            if (isWaiting || card.classList.contains('flipped')) return;
            card.classList.add('flipped');
            cardsFlipped.push(card);
            if (cardsFlipped.length === 2) {
                updateGame();
            }
        });

        gameBoard.appendChild(card);
    });

    function updateGame() {
        const [firstCard, secondCard] = cardsFlipped;
        if (firstCard.dataset.name === secondCard.dataset.name) {
            score += 50;
            firstCard.removeEventListener('click', flipCard);
            secondCard.removeEventListener('click', flipCard);
            firstCard.classList.add('hidden');
            secondCard.classList.add('hidden');
        } else {
            score -= 10;
            isWaiting = true;
            setTimeout(() => {
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
                isWaiting = false;
            }, 1000);
        }
        cardsFlipped = [];
        updateScore();
    }

    function flipCard() {
        if (isWaiting) return;
        this.classList.add('flipped');
    }

    function updateScore() {
        scoreBoard.innerText = `Skóre: ${score}`;
    }
});
