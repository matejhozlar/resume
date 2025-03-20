let boardSize = 4; 
let selectedCards = [];
let matchedPairs = 0;
let difficulty = "Medium";
let timeLeft = 0;
let timer; 
let shuffleInterval;
let isChecking = false;

function setDifficulty(level) {
    difficulty = level;
    document.getElementById("selectedDifficulty").textContent = "Difficulty: " + level;

    let description = "";
    switch (level) {
        case "Easy":
            description = "Relaxed pace, no timer.";
            break;
        case "Medium":
            description = "Balanced challenge with a timer.";
            break;
        case "Hard":
            description = "Cards shuffle every 20s. Stay sharp!";
            break;
        case "Insane":
            description = "Cards shuffle every 10s, timer & instant flip back!";
            break;
    }

    document.getElementById("difficultyDescription").textContent = description;
}

function startGame(size) {
    boardSize = size;
    document.getElementById("boardSelectionScreen").classList.add("hidden");
    document.getElementById("gameScreen").classList.remove("hidden");
    document.getElementById("difficultyText").textContent = difficulty;

    setupGame();
    resetGameState();

    if (difficulty === "Easy") {
        document.getElementById("timerDisplay").classList.add("hidden");
        timeLeft = Infinity;  
    } else {
        document.getElementById("timerDisplay").classList.remove("hidden");
        setTimeForDifficulty(); 
        startTimer();
    }
    
    clearInterval(shuffleInterval); 

    if (difficulty === "Hard" || difficulty === "Insane") {
        shuffleInterval = setInterval(shuffleBoard, difficulty === "Hard" ? 20000 : 10000);
    }

    flipBackInstantly = difficulty === "Insane";
}

function shuffleBoard() {
    const gameContainer = document.getElementById("game");
    const cards = Array.from(gameContainer.children);

    gameContainer.classList.add("shuffling");

    setTimeout(() => {
        const shuffledCards = shuffle(cards);
        gameContainer.innerHTML = "";
        shuffledCards.forEach(card => gameContainer.appendChild(card));

        gameContainer.classList.remove("shuffling");
        gameContainer.classList.add("shuffled");

        setTimeout(() => {
            gameContainer.classList.remove("shuffled");
        }, 500);
    }, 500); 
}


function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}


function resetGameState() {
    clearInterval(timer); 
    matchedPairs = 0;
    setTimeForDifficulty();  
    document.getElementById("timeLeft").textContent = timeLeft;
}


function setTimeForDifficulty() {
    if (boardSize === 2) timeLeft = 30; 
    if (boardSize === 4) timeLeft = 60;  
    if (boardSize === 6) timeLeft = 120; 
    if (boardSize === 8) timeLeft = 240;
    document.getElementById("timeLeft").textContent = timeLeft;
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timeLeft").textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            showGameOver();
        }
    }, 1000);
}

function showGameOver() {
    document.body.classList.add("flash-red");
    var wrong = new Audio("./assets/music/wrong.mp3");
    wrong.play();
    setTimeout(() => {
        document.body.classList.remove("flash-red"); 
        document.getElementById("gameScreen").classList.add("hidden");
        document.getElementById("endScreen").classList.remove("hidden");
        document.getElementById("message").innerHTML = "Time's Up! Try Again.";
        document.getElementById("message").classList.add("show-message");
    }, 800); 
}

function setupGame() {
    const gameContainer = document.getElementById("game");
    gameContainer.innerHTML = ""; 

    let symbols = generateSymbols(boardSize);
    symbols = shuffle([...symbols, ...symbols]); 

    gameContainer.className = `game-container grid-${boardSize}`;

    symbols.forEach(symbol => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.symbol = symbol;

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back">${symbol}</div>
            </div>
        `;

        card.addEventListener("click", () => flipCard(card));
        gameContainer.appendChild(card);
    });
}

function generateSymbols(size) {
    const availableSymbols = [
            "🌀", "🔷", "🔶", "🟥", "🟦", "⭐", "🌟", "✨", "❄️", "💠",
            "🐶", "🐱", "🦊", "🦁", "🐸", "🐢", "🦉", "🦋", "🐞", "🐝",
            "🎩", "🕶️", "🎈", "🎲", "🎰", "🔮", "🎵", "🎼", "🛸", "⚓",
            "👻", "🎃", "🦄", "🏰", "🗿", "🚀", "🌍", "🌕", "⭐", "☄️",
            "🍎", "🍌", "🍉", "🍒", "🍇", "🍕", "🍔", "🍩", "🍫", "🍷"
    ];
    
    return availableSymbols.slice(0, (size * size) / 2);
}


function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function flipCard(card) {
    if (isChecking || selectedCards.length >= 2 || card.classList.contains("flipped")) {
        return; 
    }

    card.classList.add("flipped");
    selectedCards.push(card);

    if (selectedCards.length === 2) {
        isChecking = true; 

        setTimeout(() => {
            checkMatch();
            isChecking = false; 
        }, 1000);
    }
}

function checkMatch() {
    let [card1, card2] = selectedCards;

    if (card1.dataset.symbol === card2.dataset.symbol) {
        setTimeout(() => {
            card1.classList.add("matched");
            card2.classList.add("matched");
            matchedPairs++;
            if (matchedPairs === (boardSize * boardSize) / 2) {
                clearInterval(timer);
                setTimeout(showEndMessage, 500);
            }
        }, 500);
    } else {
        setTimeout(() => {
            if (difficulty === "Insane") {
                card1.classList.remove("flipped");
                card2.classList.remove("flipped");
            } else {
                setTimeout(() => {
                    card1.classList.remove("flipped");
                    card2.classList.remove("flipped");
                }, 1200);
            }
        }, 500);
    }

    selectedCards = [];
}

function goToMenu() {
    document.getElementById("endScreen").classList.add("hidden");
    document.getElementById("introScreen").classList.remove("hidden");
}


function showEndMessage() {
    document.body.classList.add("flash-green");
    var success = new Audio("./assets/music/success.mp3");
    success.play();

    setTimeout(() => {
        document.body.classList.remove("flash-green");
        document.getElementById("gameScreen").classList.add("hidden");
        document.getElementById("endScreen").classList.remove("hidden");
        document.getElementById("message").innerHTML = "Congratulations! You won!";
        document.getElementById("message").classList.add("show-message");
    }, 800);
}

function showBoardSelection() {
    clearInterval(timer);
    document.getElementById("introScreen").classList.add("hidden");
    document.getElementById("endScreen").classList.add("hidden");
    document.getElementById("gameScreen").classList.add("hidden");
    document.getElementById("boardSelectionScreen").classList.remove("hidden");
}

function exitGame() {
    window.location.href="../../../projects";
}
