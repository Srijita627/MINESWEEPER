// 🎮 Game Setup
const rows = 10;
const cols = 10;
const minesCount = 15;
const board = document.getElementById('board');
let boardArray = [];

// 🎵 Sounds
const clickSound = new Audio("sounds/click.wav");
const flagSound = new Audio("sounds/flag.mp3");
const explosionSound = new Audio("sounds/explosion.mp3");

// 🧠 Main Initialization Function
function initGame() {
    board.innerHTML = ''; // clear previous cells
    boardArray = [];
    document.getElementById("gameOver").classList.remove("show");

    // Initialize board
    for (let r = 0; r < rows; r++) {
        boardArray[r] = [];
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            board.appendChild(cell);
            boardArray[r][c] = { mine: false, revealed: false, element: cell, neighborMines: 0 };
            cell.addEventListener('click', () => {
                clickSound.play();
                revealCell(r, c);
            });
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                toggleFlag(r, c);
            });
        }
    }

    // Place mines
    let minesPlaced = 0;
    while (minesPlaced < minesCount) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);
        if (!boardArray[r][c].mine) {
            boardArray[r][c].mine = true;
            minesPlaced++;
        }
    }

    // Count neighbor mines
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (boardArray[r][c].mine) continue;
            let count = 0;
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const nr = r + dr;
                    const nc = c + dc;
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && boardArray[nr][nc].mine) count++;
                }
            }
            boardArray[r][c].neighborMines = count;
        }
    }
}

// 🔎 Reveal cell
function revealCell(r, c) {
    const cellObj = boardArray[r][c];
    if (cellObj.revealed) return;
    cellObj.revealed = true;
    cellObj.element.classList.add('revealed');

    if (cellObj.mine) {
        explosionSound.play();
        cellObj.element.textContent = '💣';
        cellObj.element.classList.add('bomb');
        document.getElementById("gameOver").classList.add("show");
        revealAllMines();
    } else {
        if (cellObj.neighborMines > 0) {
            cellObj.element.textContent = cellObj.neighborMines;
            cellObj.element.dataset.num = cellObj.neighborMines;
        } else {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const nr = r + dr;
                    const nc = c + dc;
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) revealCell(nr, nc);
                }
            }
        }
    }
}

// 💣 Reveal all mines
function revealAllMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (boardArray[r][c].mine) {
                boardArray[r][c].element.textContent = '💣';
                boardArray[r][c].element.classList.add('bomb');
            }
        }
    }
}

// 🚩 Flagging
function toggleFlag(r, c) {
    const cellObj = boardArray[r][c];
    if (cellObj.revealed) return;
    if (cellObj.element.textContent === '🚩') {
        cellObj.element.textContent = '';
    } else {
        flagSound.play();
        cellObj.element.textContent = '🚩';
    }
}

// 🔄 Restart button
const restartBtn = document.getElementById("restartBtn");
restartBtn.addEventListener("click", () => {
    initGame();
});

// 🚀 Initialize once at page load
initGame();

// 🌌 MATRIX BACKGROUND EFFECT
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = "01";
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00ff00";
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 35);

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
