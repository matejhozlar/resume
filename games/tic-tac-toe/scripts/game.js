let currentPlayer = 'X';
let board = [];
let gameActive = true;
let vsAI = false;
let aiDifficulty = 'easy'; 
let gridSize = 3; 
let winCondition = 3; 

function showDifficultySelection() {
    document.getElementById("introScreen").classList.add("hidden");
    document.getElementById("difficultySelection").classList.remove("hidden");
}

function startGameWithDifficulty(difficulty) {
    aiDifficulty = difficulty;
    vsAI = true;
    document.getElementById("difficultySelection").classList.add("hidden");
    document.getElementById("winScreen").classList.add("hidden");
    document.getElementById("gameScreen").classList.remove("hidden");
    resetGame();
}

function hideDifficultySelection(){
    document.getElementById("difficultySelection").classList.add("hidden");
    document.getElementById("introScreen").classList.remove("hidden");
}

function showCustomRules() {
    document.getElementById("introScreen").classList.add("hidden");
    document.getElementById("customRules").classList.remove("hidden");
}

function hideCustomRules() {
    document.getElementById("customRules").classList.add("hidden");
    document.getElementById("introScreen").classList.remove("hidden");
}

function applyCustomRules() {
    gridSize = parseInt(document.getElementById("gridSize").value);
    winCondition = parseInt(document.getElementById("winPattern").value);
    hideCustomRules();
    document.getElementById("introScreen").classList.remove("hidden"); 
}

function disableGameScreen() {
    document.querySelectorAll(".cell").forEach(cell => {
        cell.style.pointerEvents = "none"; 
    });
}

function enableGameScreen() {
    document.querySelectorAll(".cell").forEach(cell => {
        cell.style.pointerEvents = "auto"; 
    });
}

function startGame(aiMode) {
    vsAI = aiMode;
    if (aiMode) {
        showDifficultySelection(); 
    } else {
        document.getElementById("introScreen").classList.add("hidden");
        document.getElementById("winScreen").classList.add("hidden");
        document.getElementById("gameScreen").classList.remove("hidden");
        resetGame();
    }
}

function handleCellClick(event) {
    if (!gameActive || board[event.target.dataset.index] !== '') return; 

    const index = event.target.dataset.index;
    board[index] = currentPlayer;
    event.target.textContent = currentPlayer;
    event.target.classList.add("taken", "placed");

    event.target.addEventListener("animationend", () => {
        event.target.classList.remove("placed");
    }, { once: true });

    checkWinner();

    if (gameActive) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        document.getElementById("turnIndicator").textContent = `Player ${currentPlayer}'s Turn`;

        if (vsAI && currentPlayer === 'O') {
            disableGameScreen();
            setTimeout(aiMove, 500);
        }
    }
}

function disableBoard() {
    document.querySelectorAll(".cell").forEach(cell => {
        cell.removeEventListener("click", handleCellClick);
    });
}

function enableBoard() {
    document.querySelectorAll(".cell").forEach(cell => {
        cell.addEventListener("click", handleCellClick);
    });
}

function evaluateBoard() {
    const winPatterns = generateWinPatterns(gridSize, winCondition);
    let score = 0;

    for (let pattern of winPatterns) {
        const oCount = pattern.filter(index => board[index] === 'O').length;
        const xCount = pattern.filter(index => board[index] === 'X').length;


        if (oCount === winCondition) {
            return 1000;
        }

        if (xCount === winCondition) {
            return -1000; 
        }

        if (oCount > 0 && xCount === 0) {
            score += Math.pow(10, oCount);
        }
        if (xCount > 0 && oCount === 0) {
            score -= Math.pow(10, xCount);
        }
    }

    if (gridSize >= 4) {
        const centerIndex = Math.floor((gridSize * gridSize) / 2);
        if (board[centerIndex] === 'O') {
            score += 50;
        } else if (board[centerIndex] === 'X') {
            score -= 50;
        }
    }

    return score;
}

function checkWinnerForMinimax() {
    const winPatterns = generateWinPatterns(gridSize, winCondition);

    for (let pattern of winPatterns) {
        const oWin = pattern.every(index => board[index] === 'O');
        const xWin = pattern.every(index => board[index] === 'X');

        if (oWin) return 'O';
        if (xWin) return 'X';
    }

    if (!board.includes('')) {
        return 'tie';
    }

    return null;
}

function aiMove() {
    disableGameScreen(); 

    let move;
    switch (aiDifficulty) {
        case 'easy':
            move = getRandomMove();
            break;
        case 'medium':
            move = getMediumMove();
            break;
        case 'hard':
            move = getBestMove();
            break;
        default:
            move = getRandomMove();
    }

    board[move] = 'O';
    document.querySelector(`[data-index='${move}']`).textContent = 'O';
    document.querySelector(`[data-index='${move}']`).classList.add("taken");

    checkWinner();
    if (gameActive) {
        currentPlayer = 'X';
        document.getElementById("turnIndicator").textContent = `Player X's Turn`;
    }

    enableGameScreen(); 
}

function getRandomMove() {
    let availableMoves = board.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

function getMediumMove() {
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            if (checkImmediateWin('O')) {
                board[i] = '';
                return i;
            }
            board[i] = '';
        }
    }

    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'X';
            if (checkImmediateWin('X')) {
                board[i] = '';
                return i;
            }
            board[i] = '';
        }
    }

    return getRandomMove();
}

function getBestMove() {
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            if (checkWinnerForMinimax() === 'O') {
                board[i] = '';
                return i;
            }
            board[i] = '';
        }
    }

    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'X';
            if (checkWinnerForMinimax() === 'X') {
                board[i] = '';
                return i;
            }
            board[i] = '';
        }
    }

    if (gridSize >= 4) {
        const centerIndex = Math.floor((gridSize * gridSize) / 2);
        if (board[centerIndex] === '') {
            return centerIndex;
        }

        const corners = [0, gridSize - 1, (gridSize * gridSize) - gridSize, (gridSize * gridSize) - 1];
        for (let corner of corners) {
            if (board[corner] === '') {
                return corner;
            }
        }
    }

    let bestScore = -Infinity;
    let move;
    const depthLimit = gridSize >= 4 ? 3 : 5;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            let score = minimax(board, 0, false, -Infinity, Infinity, depthLimit);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    return move;
}

function minimax(board, depth, isMaximizing, alpha, beta, depthLimit) {
    const scores = {
        'O': 1,
        'X': -1,
        'tie': 0
    };

    let result = checkWinnerForMinimax();
    if (result !== null || depth === depthLimit) {
        return scores[result] || 0; 
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false, alpha, beta, depthLimit);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
                alpha = Math.max(alpha, bestScore);
                if (beta <= alpha) break; 
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true, alpha, beta, depthLimit);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
                beta = Math.min(beta, bestScore);
                if (beta <= alpha) break; 
            }
        }
        return bestScore;
    }
}

function checkWinnerForMinimax() {
    const winPatterns = generateWinPatterns(gridSize, winCondition);

    for (let pattern of winPatterns) {
        if (pattern.every(index => board[index] === 'O')) {
            return 'O';
        }
        if (pattern.every(index => board[index] === 'X')) {
            return 'X';
        }
    }

    if (!board.includes('')) {
        return 'tie';
    }

    return null;
}

function checkImmediateWin(player) {
    const winPatterns = generateWinPatterns(gridSize, winCondition);
    return winPatterns.some(pattern =>
        pattern.every(index => board[index] === player)
    );
}

function generateWinPatterns(size, condition) {
    const patterns = [];

    for (let i = 0; i < size; i++) {
        for (let j = 0; j <= size - condition; j++) {
            const pattern = [];
            for (let k = 0; k < condition; k++) {
                pattern.push(i * size + j + k);
            }
            patterns.push(pattern);
        }
    }

    for (let i = 0; i <= size - condition; i++) {
        for (let j = 0; j < size; j++) {
            const pattern = [];
            for (let k = 0; k < condition; k++) {
                pattern.push((i + k) * size + j);
            }
            patterns.push(pattern);
        }
    }

    for (let i = 0; i <= size - condition; i++) {
        for (let j = 0; j <= size - condition; j++) {
            const pattern = [];
            for (let k = 0; k < condition; k++) {
                pattern.push((i + k) * size + j + k);
            }
            patterns.push(pattern);
        }
    }

    for (let i = condition - 1; i < size; i++) {
        for (let j = 0; j <= size - condition; j++) {
            const pattern = [];
            for (let k = 0; k < condition; k++) {
                pattern.push((i - k) * size + j + k);
            }
            patterns.push(pattern);
        }
    }
    return patterns;
}

function disableButtons() {
    document.querySelectorAll("button").forEach(button => {
        button.disabled = true;
    });
}

function enableButtons() {
    document.querySelectorAll("button").forEach(button => {
        button.disabled = false;
    });
}

function checkWinner() {
    const winPatterns = generateWinPatterns(gridSize, winCondition);

    for (let pattern of winPatterns) {
        if (pattern.every(index => board[index] === currentPlayer)) {
            gameActive = false;
            disableButtons(); 

            pattern.forEach(index => {
                document.querySelector(`[data-index='${index}']`).classList.add("winner");
            });

            setTimeout(() => {
                pattern.forEach(index => {
                    document.querySelector(`[data-index='${index}']`).classList.remove("winner");
                });

                document.getElementById("gameScreen").classList.add("hidden");
                document.getElementById("winScreen").classList.remove("hidden");
                document.getElementById("winMessage").textContent = `Player ${currentPlayer} Wins!`;
                document.getElementById("winMessage").classList.add("show-message");

                enableButtons(); 
            }, 2000);

            return;
        }
    }

    if (!board.includes('')) {
        gameActive = false;
        disableButtons(); 

        setTimeout(() => {
            document.getElementById("gameScreen").classList.add("hidden");
            document.getElementById("winScreen").classList.remove("hidden");
            document.getElementById("winMessage").textContent = "It's a Draw!";
            
            enableButtons(); 
        }, 2000);
    }
}

function resetGame() {
    board = new Array(gridSize * gridSize).fill('');
    gameActive = true;
    currentPlayer = 'X';
    document.getElementById("turnIndicator").textContent = "Player X's Turn";

    const boardElement = document.querySelector(".board");
    boardElement.innerHTML = ''; 
    boardElement.style.gridTemplateColumns = `repeat(${gridSize}, 80px)`;
    boardElement.style.gridTemplateRows = `repeat(${gridSize}, 80px)`;

    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;
        cell.addEventListener("click", handleCellClick); 
        boardElement.appendChild(cell);
    }
}

function restartGame() {
    document.getElementById("winScreen").classList.add("hidden");
    document.getElementById("difficultySelection").classList.add("hidden");
    document.getElementById("gameScreen").classList.remove("hidden");
    resetGame();
}

function showIntroScreen() {
    document.getElementById("gameScreen").classList.add("hidden");
    document.getElementById("winScreen").classList.add("hidden");
    document.getElementById("introScreen").classList.remove("hidden");
}

function exitGame() {
    window.location.href = "../../../projects";
}

document.querySelectorAll(".cell").forEach(cell => {
    cell.addEventListener("click", handleCellClick);
});