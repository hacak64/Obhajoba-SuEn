document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    let score = parseInt(localStorage.getItem('score')) || 0;
    let levelUnlocked = parseInt(localStorage.getItem('levelUnlocked')) || 1;
    let cardsFlipped = [];
    let isWaiting = false;

    if (score < 300 || levelUnlocked < 2) {
        alert('Pro hraní úrovně 2 je potřeba dosáhnout skóre alespoň 300.');
        window.location.href = 'Zemepisne-pexeso-uroven1.html'; // Upravte podle vaší struktury souborů
        return;
    }

    const scoreBoard = document.createElement('div');
    scoreBoard.className = 'score-board';
    scoreBoard.textContent = 'Skóre: ' + score;
    document.body.insertBefore(scoreBoard, gameBoard);

    const states = [
        { name: "Česko", flag: "czech_flag1.svg" },
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

    gameBoard.innerHTML = '';

    cardSet.forEach((item) => {
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
            cardBack.innerHTML = `<img src="/obrazce/pexeso/vlajky/${item.flag}" alt="${item.name}">`;
        } else {
            cardBack.textContent = item.name;
        }

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);
        gameBoard.appendChild(card);

        card.addEventListener('click', () => {
            if (isWaiting || card.classList.contains('flipped') || card.classList.contains('matched')) return;
            card.classList.add('flipped');
            cardsFlipped.push(card);

            if (cardsFlipped.length === 2) {
                checkForMatch();
            }
        });
    });

    function checkForMatch() {
        if (cardsFlipped.length < 2) {
            return;
        }

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
                // Přidání logiky pro konec hry nebo přechod na další úroveň
            }
        }, 1000);
    }

    function updateScore() {
        scoreBoard.textContent = 'Skóre: ' + score;
        localStorage.setItem('score', score.toString());
    }
});
