document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const scoreDisplay = document.getElementById('score');
    let score = 0;
    let flippedCards = [];
    let lockBoard = false;
    let matches = 0;

    // Doplnění pole zemí pro 12 unikátních dvojic
    const countries = [
        {name: "Česká Republika", flag: "path/to/czech-flag.jpg"},
        {name: "Slovensko", flag: "path/to/slovak-flag.jpg"},
        // Zde doplňte dalších 10 zemí a jejich vlajky
    ];

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function createCard(card) {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');

        const cardImg = document.createElement('img');
        cardImg.src = '../../../obrazce/pexeso/Karta.svg'; // Základní obrázek karty
        cardImg.setAttribute('data-flag', card.flag);
        cardElement.appendChild(cardImg);

        cardElement.addEventListener('click', () => flipCard(cardElement, cardImg));

        gameBoard.appendChild(cardElement);
    }

    function flipCard(cardElement, cardImg) {
        if (lockBoard || cardElement.classList.contains('flipped')) return;
        
        cardImg.src = cardImg.getAttribute('data-flag');
        cardElement.classList.add('flipped');
        flippedCards.push(cardElement);

        if (flippedCards.length === 2) {
            checkForMatch();
        }
    }

    function checkForMatch() {
        const [firstCard, secondCard] = flippedCards;
        const firstImg = firstCard.querySelector('img');
        const secondImg = secondCard.querySelector('img');
        if (firstImg.getAttribute('data-flag') === secondImg.getAttribute('data-flag')) {
            score += 50;
            matches++;
            // Karty zůstávají otočené
            disableCards(firstCard, secondCard);
            if (matches === 12) {
                // Všechny karty byly nalezeny
                console.log("Hra dokončena!");
                // Zde můžete přidat logiku pro konec hry
            }
        } else {
            score -= 10;
            unflipCards(firstCard, secondCard);
        }
        updateScore();
    }

    function disableCards(firstCard, secondCard) {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        resetBoard();
    }

    function unflipCards(firstCard, secondCard) {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard.querySelector('img').src = '../../obrazce/pexeso/Karta.svg';
            secondCard.querySelector('img').src = '../../obrazce/pexeso/Karta.svg';
            resetBoard();
        }, 1000);
    }

    function updateScore() {
        scoreDisplay.textContent = `Skóre: ${score}`;
    }

    function resetBoard() {
        [flippedCards, lockBoard] = [[], false];
    }

    // Zajištění, že se karty zamíchají při načtení stránky
    (function shuffleBoard() {
        cards = shuffle([...countries, ...countries]);
        cards.forEach(card => createCard(card));
    })();
});


document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const scoreDisplay = document.getElementById('score');
    let score = 0;
    let flippedCards = [];
    let lockBoard = false;
    let matches = 0; // Počet správných párů

    // Předpokládejme rozšířené pole 'countries' na 12 unikátních prvků
    const countries = [
        // Doplnění 12 zemí s cestami k obrázkům vlajek
    ];

    function shuffle(array) {
        // Zamíchání logiky zůstává stejná
    }

    // Vytvoření 24 karet (12 unikátních dvojic)
    let cards = shuffle([...countries, ...countries]);

    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');

        // Přední strana karty - Vlajka
        const frontFace = document.createElement('img');
        frontFace.className = 'front-face';
        frontFace.src = card.flag;

        // Zadní strana karty - Karta.svg
        const backFace = document.createElement('img');
        backFace.className = 'back-face';
        backFace.src = '../../obrazce/pexeso/Karta.svg';

        cardElement.appendChild(frontFace);
        cardElement.appendChild(backFace);

        cardElement.addEventListener('click', () => {
            // Implementace otočení a logiky hry
        });

        gameBoard.appendChild(cardElement);
    });

    // Další implementace...
});
