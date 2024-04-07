
document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    let score = parseInt(localStorage.getItem('score')) || 0;
    let levelUnlocked = parseInt(localStorage.getItem('levelUnlocked')) || 1;
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
    ];

    const cardSet = [...states.map(state => ({ ...state, type: 'name' })), ...states.map(state => ({ ...state, type: 'flag' }))].sort(() => 0.5 - Math.random());

    gameBoard.innerHTML = ''; // Vyčistění herního pole

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
            cardBack.innerHTML = `<img src="/obrazce/pexeso/vlajky/${item.flag}" alt="${item.name}" style="width: 100%; height: auto;">`;
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
            let matchScore = 50; // Bodová hodnota za správnou dvojici
            let mismatchPenalty = -10; // Penalizace za nesprávnou dvojici

            if (firstCard.dataset.name === secondCard.dataset.name) {
                firstCard.classList.add('matched');
                secondCard.classList.add('matched');
                score += matchScore;
            } else {
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
                score += mismatchPenalty;
            }

            updateScore();
            cardsFlipped = [];
            isWaiting = false;

            // Zkontrolujte, zda všechny karty byly otočeny
            if (document.querySelectorAll('.card:not(.matched)').length === 0) {
                // Pokud ano, zkontrolujte, zda je dosaženo skóre pro odemknutí další úrovně
                if (score >= 300 && levelUnlocked === 1) {
                    levelUnlocked = 2;
                    localStorage.setItem('levelUnlocked', levelUnlocked.toString());
                    // Zde byste mohli přesměrovat hráče na úroveň 2 nebo zobrazit zprávu s instrukcemi, jak pokračovat
                    alert('Gratulace! Odemkli jste úroveň 2!');
                }
            }
        }, 1000);
    }

    function updateScore() {
        scoreBoard.textContent = 'Skóre: ' + score;
        localStorage.setItem('score', score.toString());
    }
});
