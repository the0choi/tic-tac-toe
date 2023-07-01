/*----- constants -----*/
const COLORS = {
    '0': 'white',
    '1': '#5585b5',
    '-1': '#bbe4e9',
};

const SYMBOLS = {
    '0': '',
    '1': '◯',
    '-1': '✖',
};

const PLAYERS = {
    '1': 'Player 1',
    '-1': 'Player 2'
};

/*----- state variables -----*/
let board; // 3x3 cell board
let turn; // Each turn is taken between the 2 players 
let winner;  // null = no winner; 1 or -1 = winner; 'T' = Tie

/*----- cached elements  -----*/
const messageEl = document.querySelector('h1');
const playAgainBtn = document.querySelector('button');
const boardEls = [...document.querySelectorAll('#board > div')];

/*----- event listeners -----*/
document.getElementById('board').addEventListener('click', handleMove);
playAgainBtn.addEventListener('click', init);

/*----- functions -----*/
init();

// Initialize 
function init() {
    board = [
        [0, 0, 0], 
        [0, 0, 0],  
        [0, 0, 0],  
    ];
    turn = 1;
    winner = null;
    render();
}

// When cell is clicked, update state then render
function handleMove(evt) {
    // Selects the column from the id of the cell selected, e.g. '0' in 'c0r2'
    const colIdx = parseInt(evt.target.id[1]);
    const rowIdx = parseInt(evt.target.id[3]);
    // Guard when clicking on empty space
    if (![0, 1, 2].includes(colIdx)) return;
    // Update state values only if cell clicked is empty or game is unfinished
    if (!board[colIdx][rowIdx] && !winner) {
        board[colIdx][rowIdx] = turn;
        turn *= -1;
        winner = getWinner(colIdx, rowIdx); 
        render();
    }    
}

// Check for winner 
function getWinner(colIdx, rowIdx) {
    if (
        checkVerticalWin(colIdx, rowIdx) ||
        checkHorizontalWin(colIdx, rowIdx) ||
        checkDiagonalWinNESW(colIdx, rowIdx) ||
        checkDiagonalWinNWSE(colIdx, rowIdx)
    ) {
        return checkVerticalWin(colIdx, rowIdx) ||
        checkHorizontalWin(colIdx, rowIdx) ||
        checkDiagonalWinNESW(colIdx, rowIdx) ||
        checkDiagonalWinNWSE(colIdx, rowIdx);
    }
    
    // Check for a tie only if no winner
    let remainingTiles = 0;
    board.forEach( function(colArr) {
        colArr.forEach( function (val) {
            if (!val) remainingTiles += 1;
        })
    })
    if (!remainingTiles) return 'T';
}

function checkDiagonalWinNWSE(colIdx, rowIdx) {
    const adjCountNW = countAdjacent(colIdx, rowIdx, -1, 1);
    const adjCountSE = countAdjacent(colIdx, rowIdx, 1, -1);
    return (adjCountNW + adjCountSE) === 2 ? board[colIdx][rowIdx] : null;
}

function checkDiagonalWinNESW(colIdx, rowIdx) {
    const adjCountNE = countAdjacent(colIdx, rowIdx, 1, 1);
    const adjCountSW = countAdjacent(colIdx, rowIdx, -1, -1);
    return (adjCountNE + adjCountSW) === 2 ? board[colIdx][rowIdx] : null;
}

function checkHorizontalWin(colIdx, rowIdx) {
    const adjCountLeft = countAdjacent(colIdx, rowIdx, -1, 0);
    const adjCountRight = countAdjacent(colIdx, rowIdx, 1, 0);
    return (adjCountLeft + adjCountRight) === 2 ? board[colIdx][rowIdx] : null;
}

function checkVerticalWin(colIdx, rowIdx) {
    const adjCountUp = countAdjacent(colIdx, rowIdx, 0, 1);
    const adjCountDown = countAdjacent(colIdx, rowIdx, 0, -1);
    return (adjCountUp + adjCountDown) === 2 ? board[colIdx][rowIdx] : null;
}

function countAdjacent(colIdx, rowIdx, colOffset, rowOffset) {
    const player = board[colIdx][rowIdx];
    let count = 0;
    colIdx += colOffset;
    rowIdx += rowOffset;
    while (
        board[colIdx] !== undefined &&
        board[colIdx][rowIdx] !== undefined &&
        board[colIdx][rowIdx] === player
    ) {
        count++;
        colIdx += colOffset;
        rowIdx += rowOffset;
    }
    return count;
}

function render() {
    renderBoard();
    renderMessage();
    renderControls();
}

function renderBoard() {
    board.forEach(function(colArr, colIdx) {
        // Iterate over the cells in the cur column (colArr)
        colArr.forEach(function(cellVal, rowIdx) {
            const cellId = `c${colIdx}r${rowIdx}`;
            const cellEl = document.getElementById(cellId);
            cellEl.style.backgroundColor = COLORS[cellVal];
            cellEl.innerText = SYMBOLS[cellVal]
            cellEl.style.display = "flex"
            cellEl.style.justifyContent = "center"
            cellEl.style.alignItems = "center"
            
        });
    });
}

function renderMessage() {
    if (winner === 'T') {
        messageEl.innerText = "It's a Tie!";
    } else if (winner) {
        messageEl.innerHTML = `<span>${PLAYERS[winner].toUpperCase()}</span> Wins!`;
    } else {
        messageEl.innerHTML = `<span>${PLAYERS[turn].toUpperCase()}</span>'s Turn`;
    }
}

function renderControls() {
    playAgainBtn.style.visibility = winner ? 'visible' : 'hidden';
}