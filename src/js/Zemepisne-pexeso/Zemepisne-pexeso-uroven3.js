document.addEventListener('DOMContentLoaded', () => {
    const score = parseInt(localStorage.getItem('score')) || 0;
    const levelUnlocked = parseInt(localStorage.getItem('levelUnlocked')) || 1;

    if (score < 950 || levelUnlocked < 3) {
        alert('Pro hraní úrovně 3 je potřeba dosáhnout skóre alespoň 950.');
        window.location.href = 'Zemepisne-pexeso-uroven2.html'; // Přesměrujte na úvodní stránku nebo úroveň 1
        return;
    }

    const gameBoard = document.getElementById('game-board');
    let cardsFlipped = [];
    let isWaiting = false;

    const scoreBoard = document.createElement('div');
    scoreBoard.className = 'score-board';
    scoreBoard.textContent = 'Skóre: ' + score;
    document.body.insertBefore(scoreBoard, gameBoard);

    const states = [
        { name: "Česko", flag: "czech_flag.svg" },
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

    const cardSet = [...states.map(state => ({ ...state, type: 'name' })), ...states.map(state => ({ ...state, type: 'flag' }))].sort(() => 0.5 - Math.random());

    gameBoard.innerHTML = ''; // Vyčištění herního pole

    cardSet.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.name = item.name;

        const cardInner = document.createElement('div');
        cardInner.className = 'card-inner';

        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';

        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';
        if (item.type === 'flag') {
            cardBack.innerHTML = `<img src="flags/${item.flag}" alt="${item.name}" style="width: 100%; height: auto;">`;
        } else {
            cardBack.textContent = item.name;
        }

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);
        gameBoard.appendChild(card);

        card.addEventListener('click', () => {
            if (isWaiting || card.classList.contains('flipped')) return;
            card.classList.add('flipped');
            cardsFlipped.push(card);

            if (cardsFlipped.length === 2) {
                checkForMatch();
            }
        });
    });

    function checkForMatch() {
        isWaiting = true;
        setTimeout(() => {
            const [firstCard, secondCard] = cardsFlipped;

            if (firstCard.dataset.name === secondCard.dataset.name) {
                firstCard.classList.add('matched');
                secondCard.classList.add('matched');
                score += 50;
            } else {
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
                score -= 10;
            }

            updateScore();
            cardsFlipped = [];
            isWaiting = false;

            if (document.querySelectorAll('.card:not(.matched)').length === 0) {
                alert('Gratulace! Vyhráli jste hru!');
                // Zde můžete přidat logiku pro konec hry nebo další úrovně, pokud jsou dostupné
            }
        }, 1000);
    }

    function updateScore() {
        scoreBoard.textContent = 'Skóre: ' + score;
        localStorage.setItem('score', score.toString());
    }
});
