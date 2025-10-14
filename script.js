const rows = 10;
const cols = 10;
const minesCount = 15;

const board = document.getElementById('board');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restartBtn');

let boardArray = [];
let gameOver = false;

// 🎵 Sound effects
const clickSound = new Audio('sounds/click.wav');
const explosionSound = new Audio('sounds/explosion.mp3');
const flagSound = new Audio('sounds/flag.mp3');

// Set volumes
clickSound.volume = 0.4;
explosionSound.volume = 0.6;
flagSound.volume = 0.5;

// 🎮 Initialize Game
function initGame() {
  board.innerHTML = '';
  message.style.display = 'none';
  restartBtn.style.display = 'none';
  boardArray = [];
  gameOver = false;

  // Create board
  for (let r = 0; r < rows; r++) {
    boardArray[r] = [];
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = r;
      cell.dataset.col = c;
      board.appendChild(cell);
      boardArray[r][c] = { mine: false, revealed: false, flagged: false, element: cell, neighborMines: 0 };

      // Left-click → reveal
      cell.addEventListener('click', () => revealCell(r, c));

      // Right-click → flag
      cell.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        toggleFlag(r, c);
      });
    }
  }

  // Random mines
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
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && boardArray[nr][nc].mine)
            count++;
        }
      }
      boardArray[r][c].neighborMines = count;
    }
  }
}

// 🧩 Reveal Cell
function revealCell(r, c) {
  if (gameOver) return;
  const cellObj = boardArray[r][c];
  if (cellObj.revealed || cellObj.flagged) return;

  cellObj.revealed = true;
  cellObj.element.classList.add('revealed');
  clickSound.currentTime = 0;
  clickSound.play();

  if (cellObj.mine) {
    cellObj.element.textContent = '💣';
    cellObj.element.classList.add('bomb');
    explosionSound.currentTime = 0;
    explosionSound.play();
    endGame(false);
  } else {
    if (cellObj.neighborMines > 0) {
      cellObj.element.textContent = cellObj.neighborMines;
      cellObj.element.dataset.num = cellObj.neighborMines;
    } else {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols)
            revealCell(nr, nc);
        }
      }
    }
  }
}

// 🚩 Flag a cell
function toggleFlag(r, c) {
  if (gameOver) return;
  const cellObj = boardArray[r][c];
  if (cellObj.revealed) return;

  cellObj.flagged = !cellObj.flagged;
  cellObj.element.textContent = cellObj.flagged ? '🚩' : '';
  flagSound.currentTime = 0;
  flagSound.play();
}

// 💥 Game Over
function endGame() {
  gameOver = true;
  message.textContent = "💥 Game Over!";
  message.style.display = "block";
  revealAllMines();
  restartBtn.style.display = "inline-block";
}

// 🔍 Reveal all mines
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

// 🔁 Restart Game
restartBtn.addEventListener('click', initGame);

// 🚀 Start the game
initGame();
