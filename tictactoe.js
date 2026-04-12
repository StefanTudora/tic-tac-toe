

// Define pariticipants: min/max player; and action board

const board = Array(3).fill().map(() => Array(3).fill('#'));

// Player factory function
const createPlayer = function (boardSign) {
    return {
        boardSign,
        getSign() {
            return this.boardSign;
        }
    }
}

// Separate in layers: UI -> FMS -> MiniMax


const playerMap = { "CPU": createPlayer("O"), "Human": createPlayer("X") };

class GameBoard {
    constructor(board) {
        this.board = board;
        this.freeCells = 9;

        this.getFreeSpots = function () {
            const coordinateList = new Array();
            this.board.forEach((row, rowIndex) => {
                row.forEach((value, colIndex) => {
                    if (value == '#') {
                        coordinateList.push([rowIndex, colIndex]);
                    }
                });
            });
        }

        this.setSpot = function (row, col, mark) {
            --this.freeCells;
            this.board[row][col] = mark;
        }

        this.isFull = function () {
            return this.freeCells === 0;
        }

        this.getSpot = function (row, col) {
            return this.board[row][col];
        }

        this.clearSpot = function (row, col) {
            this.board[row][col] = "#";
            ++this.freeCells;
        }

        this.clearBoard = function () {
            this.board = Array(3).fill().map(() => Array(3).fill("#"));
            this.freeCells = 9;
        }

        this.isSpotFree = function (row, col) {
            return board[row][col] === "#";
        }

        function allEqual(input) {
            return input.split('').every(char => char === input[0]);
        }

        this.isThereAWinner = function () {
            // Check rows
            for (let i = 0; i < 3; ++i) {
                const rowSum = this.board[i].reduce((accumulator, currentValue) => accumulator + currentValue, "");
                if (allEqual(rowSum) && rowSum[0] !== '#') {
                    return rowSum[0];
                }
            }
            // Check columns
            for (let i = 0; i < 3; ++i) {
                var columnSum = "";
                for (let j = 0; j < 3; ++j) {
                    columnSum += this.board[j][i];
                }
                if (allEqual(columnSum) && columnSum[0] !== '#') {
                    return columnSum[0];
                }
            }
            // Check main diagonal
            var diagSum = "";
            for (let i = 0; i < 3; ++i) {
                diagSum += this.board[i][i];
            }
            if (allEqual(diagSum) && diagSum[0] !== '#') {
                return diagSum[0];
            }
            // Check secondary diagonal
            diagSum = "";
            for (let i = 0; i < 3; ++i) {
                diagSum += this.board[i][2 - i];
            }
            if (allEqual(diagSum) && diagSum[0] !== '#') {
                return diagSum[0];
            }
            return null;
        }

        // Clear board, just in case
        if (this.board !== undefined) {
            this.clearBoard();
        } else {
            console.log("The board was not initialized.");
        }
    }
}

// FSM state machine for deciding player action

class GameManager {
    constructor(board) {

        this.board = board;
        this.state = undefined;
        this.counter = 0;

        this.getState = function () {
            if (this.state !== undefined) {
                return this.state;
            }
        };

        this.setState = function (state) {
            this.state = state;
        };

        // Remove in final implementation
        this.incrementAndGet = function () {
            ++this.counter;
            return this.counter;
        };

        this.doAction = function () {
            this.state.doAction();
        }
    }
}

class HumanState {
    constructor(game) {

        this.game = game;
        this.playerInfo = createPlayer('X');

        this.doAction = function () {
            // Await player action
        }

        this.resumeAction = function (cell, idx) {
            let row = Math.floor(idx / 3);
            let col = idx % 3;
            if (!game.board.isSpotFree(row, col)) {
                // Wait for valid player selection
                return;
            }
            cell.appendChild(getXSvg());
            game.board.setSpot(row, col, "X");
            game.setState(new CheckState(game, this));
            game.doAction();
        }
    }
}

class CPUState {
    constructor(game) {

        this.game = game;
        this.playerInfo = createPlayer("O");
        this.miniMaxAlg = new MiniMax(game.board);

        this.doAction = function () {
            // Calculate optimal move for the CPU
            const optiamlMove = this.miniMaxAlg.getBestChoice();
            const row = optiamlMove[0];
            const col = optiamlMove[1];
            game.board.setSpot(row, col, "O");
            document.querySelectorAll(".board > div")[row * 3 + col].appendChild(getOSvg());
            console.log("We are doing an action on the CPU state");
            game.setState(new CheckState(game, this));
            game.doAction();
        }
    }
}

class CheckState {
    constructor(game, prevState) {

        this.game = game;
        this.prevState = prevState;

        this.doAction = function () {
            const winningPlayer = game.board.isThereAWinner();
            if (winningPlayer !== null || game.board.getFreeSpots() == 0) {
                game.setState(new FinalState(game, winningPlayer));
            }
            // use prevState to know whos turn it is
            if (prevState instanceof HumanState) {
                game.setState(new CPUState(game));
            } else {
                game.setState(new HumanState(game));
            }
            game.doAction();
        }
    }
}

class FinalState {
    // Reset the game here
    constructor(game, winner) {
        game.board.clearBoard();
        document.querySelectorAll(".board > div").forEach(div => div.replaceChildren());
        game.setState(new HumanState(game));
        if (winner != null) {
            console.log("We hava a winner" + winningPlayer);
        }

    }
}


var game = new GameManager(new GameBoard(board));

game.setState(new HumanState(game));

// game.play();

/*
    Minimax implementation
*/

class MiniMax {
    constructor(board) {

        this.board = board;

        this.miniMaxEval = function (player) {
            // Check for a winner in this round
            const winner = board.isThereAWinner();
            if (winner !== null) {
                return winner === "X" ? 10 : -10;
            }
            // No more moves left, draw
            if (board.isFull()) {
                return 0;
            }
            if (player.getSign() === "X") {
                var maxValue = -1e6;
                for (let row = 0; row < 3; ++row) {
                    for (let col = 0; col < 3; ++col) {
                        if (board.getSpot(row, col) === "#") {
                            board.setSpot(row, col, "X");
                            maxValue = Math.max(maxValue, this.miniMaxEval(createPlayer("O")));
                            board.clearSpot(row, col);
                        }
                    }
                }
                return maxValue;
            } else if (player.getSign() === "O") {
                var minValue = +1e6;
                for (let row = 0; row < 3; ++row) {
                    for (let col = 0; col < 3; ++col) {
                        if (board.getSpot(row, col) === "#") {
                            board.setSpot(row, col, "X");
                            minValue = Math.min(minValue, this.miniMaxEval(createPlayer("X")));
                            board.clearSpot(row, col);
                        }
                    }
                }
                return minValue;
            } else {
                console.log("Unkwown signature");
                return 0;
            }
        }

        // Method used by the CPU/Minimum Player
        this.getBestChoice = function () {
            var bestMove = [-1, -1];
            var minValue = 1e6;
            for (let row = 0; row < 3; ++row) {
                for (let col = 0; col < 3; ++col) {
                    if (board.getSpot(row, col) === "#") {
                        board.setSpot(row, col, "0");
                        let currentMinValue = Math.min(minValue, this.miniMaxEval(createPlayer("X")));
                        board.setSpot(row, col, "#");
                        if (currentMinValue < minValue) {
                            minValue = currentMinValue;
                            bestMove = [row, col];
                        }
                    }
                }
            }
            return bestMove;
        }
    }
}

function attachListener() {
    const cellsList = document.querySelectorAll(".board > div");
    cellsList.forEach((cell, idx) => {
        cell.addEventListener("click", () => {
            if (game.getState() instanceof HumanState) {
                game.state.resumeAction(cell, idx);
            } else {
                // Log error;
                console.log("Action triggered by someone not human");
            }
        });
    });
}

function getXSvg() {
    const xImg = document.createElement("img");
    xImg.setAttribute("src", "assets/x-symbol.svg");
    return xImg;
}

function getOSvg() {
    const xImg = document.createElement("img");
    xImg.setAttribute("src", "assets/o-symbol.svg");
    return xImg;
}

attachListener();