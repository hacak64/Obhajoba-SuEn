document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    let score = 0;
    let cardsFlipped = [];
    let isWaiting = false;

    const states = [
        { name: "Česko", flag: "obrazce\pexeso\vlajky\czech_flag.svg" },
        { name: "Slovensko", flag: "slovakia_flag.svg" },
        { name: "Maďarsko", flag: "hungary_flag.svg" },
        { name: "Rakousko", flag: "austria_flag.svg" },
        { name: "Německo", flag: "germany_flag.svg" },
        { name: "Polsko", flag: "poland_flag.svg" },
        { name: "Itálie", flag: "italy_flag.svg" },
        { name: "Chorvatsko", flag: "croatia_flag.svg" },
        { name: "Francie", flag: "france_flag.svg" },
        { name: "Belgie", flag: "belgium_flag.svg" },
        { name: "Velká Británie", flag: "uk_flag.svg" },
        { name: "Švýcarsko", flag: "switzerland_flag.svg" }
    ];
    const cardSet = [...states, ...states].sort(() => 0.5 - Math.random());

    cardSet.forEach((state, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back">
                    <img src="flags/${state.flag}" alt="${state.name} flag" style="width:100%; height:auto;">
                    <p>${state.name}</p>
                </div>
            </div>`;
        card.dataset.name = state.name;

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
        const scoreBoard = document.querySelector('.score-board');
        scoreBoard.innerText = `Skóre: ${score}`;
    }
});
