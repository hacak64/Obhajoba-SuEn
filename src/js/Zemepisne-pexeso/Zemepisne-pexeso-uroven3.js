document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    let currentScore = parseInt(localStorage.getItem('currentScoreLevel3')) || 0;
    let totalScore = parseInt(localStorage.getItem('totalScore')) || currentScore;
    let levelUnlocked = parseInt(localStorage.getItem('levelUnlocked')) || 1;
    let cardsFlipped = [];
    let isWaiting = false;

    if (levelUnlocked < 3) {
        alert('Pro hraní úrovně 3 je potřeba nejdříve odehrát úroveň 2 se ziskem minimálně 300 bodů.');
        window.location.href = 'Zemepisne-pexeso-uroven2.html';
        return;
    }

    const scoreBoard = document.createElement('div');
    scoreBoard.className = 'score-board';
    scoreBoard.textContent = 'Aktuální skóre: ' + currentScore;
    document.body.insertBefore(scoreBoard, gameBoard);

    fetch('../../json/pexeso/databaze.json')
        .then(response => response.json())
        .then(data => {
            const states = data.level3;
            const cardSet = [...states.map(state => ({ ...state, type: 'name' })), ...states.map(state => ({ ...state, type: 'flag' }))].sort(() => Math.random() - 0.5);

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
                    cardBack.innerHTML = `<img src="../../../obrazce/pexeso/vlajky/${item.flag}" alt="${item.name}">`;
                } else {
                    cardBack.textContent = item.name;
                }

                cardInner.appendChild(cardFront);
                cardInner.appendChild(cardBack);
                card.appendChild(cardInner);
                gameBoard.appendChild(card);

                card.addEventListener('click', () => {
                    if (isWaiting || cardsFlipped.length === 2 || card.classList.contains('flipped')) return;
                    card.classList.add('flipped');
                    cardsFlipped.push(card);

                    if (cardsFlipped.length === 2) {
                        checkForMatch();
                    }
                });
            });
        })
        .catch(error => console.error('Failed to load states data:', error));

    function checkForMatch() {
        if (cardsFlipped.length < 2) return;
        isWaiting = true;

        setTimeout(() => {
            const [firstCard, secondCard] = cardsFlipped;

            if (firstCard.dataset.name === secondCard.dataset.name) {
                firstCard.classList.add('matched');
                secondCard.classList.add('matched');
                currentScore += 50;
                totalScore += 50;
            } else {
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
                if (currentScore > 0) {
                    currentScore -= 10;
                    totalScore -= 10;
                }
            }

            updateScore();
            cardsFlipped = [];
            isWaiting = false;

            if (document.querySelectorAll('.card:not(.matched)').length === 0) {
                alert('Gratulace! Vyhráli jste hru! Vaše skóre: ' + currentScore);
                localStorage.setItem('currentScoreLevel3', '0');
            }
        }, 1000);
    }

    function updateScore() {
        scoreBoard.textContent = 'Aktuální skóre: ' + currentScore;
        localStorage.setItem('currentScoreLevel3', currentScore.toString());
        localStorage.setItem('totalScore', totalScore.toString());
    }
});
