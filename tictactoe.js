

// Define pariticipants: min/max player; and action board

const board = Array(3).fill().map(() => Array(3).fill('#'));

// Player factory function
const createPlayer = function (boardSign) {
    this.boardSign = boardSign;

    const getSing = function () {
        return this.boardSign;
    }
}

const playerMap = { "CPU": createPlayer('O'), "Human": createPlayer('X') };

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

        this.getSpot = function (row, col) {
            return this.board[row][col];
        }

        this.clearBoard = function () {
            this.board = Array(3).fill().map(() => Array(3).fill("#"));
            this.freeCells = 9;
        }

        function allEqual(input) {
            return input.split('').every(char => char === input[0]);
        }

        this.isThereAWinner = function () {
            // Check rows
            for (let i = 0; i < 3; ++i) {
                const rowSum = this.board[i].reduce((accumulator, currentValue) => accumulator + currentValue, "");
                if (allEqual(rowSum)) {
                    return rowSum[0];
                }
            }
            // Check columns
            for (let i = 0; i < 3; ++i) {
                var columnSum = "";
                for (let j = 0; j < 3; ++j) {
                    columnSum += this.board[j][i];
                }
                if (allEqual(columnSum)) {
                    return columnSum[0];
                }
            }
            // Check main diagonal
            var diagSum = "";
            for (let i = 0; i < 3; ++i) {
                diagSum += this.board[i][i];
            }
            if (allEqual(diagSum)) {
                return diagSum[0];
            }
            // Check secondary diagonal
            diagSum = "";
            for (let i = 0; i < 3; ++i) {
                diagSum += this.board[i][i];
            }
            if (allEqual(diagSum)) {
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

        this.play = function () {
            while (!(this.state instanceof FinalState)) {
                console.log("Keep playing");
                this.state.doAction();
            }
        };

        // Remove in final implementation
        this.incrementAndGet = function () {
            ++this.counter;
            return this.counter;
        };
    }
}

class HumanState {
    constructor(game) {
        this.game = game;
        this.playerInfo = createPlayer('X');;
        this.doAction = function () {
            console.log("We are doing an action on the Human state");
            if (game.incrementAndGet() > 10) {
                game.setState(new FinalState(game))
            } else {
                game.setState(new CheckState(game, this));
            }
        }
    }
}

class CPUState {
    constructor(game) {
        this.game = game;
        this.playerInfo = createPlayer('O');
        this.doAction = function () {
            console.log("We are doing an action on the CPU state");
            if (game.incrementAndGet() > 10) {
                game.setState(new FinalState(game))
            } else {
                game.setState(new CheckState(game, this));
            }
        }
    }
}

class CheckState {
    constructor(game, prevState) {
        this.game = game;
        this.prevState = prevState;
        this.doAction = function () {
            const winningPlayer = game.board.isThereAWinner();
            if (winningPlayer !== null) {
                console.log("We have a winner");
            } else if (board.getFreeSpots() == 0) {
                game.setState(new FinalState(game));
            }
            // use prevState to know whos turn it is
            if (prevState instanceof HumanState) {
                game.setState(new CPUState(game));
            } else {
                game.setState(new HumanState(game));
            }
        }
    }
}

class FinalState {
    // Reset the game here
    constructor(game) {
        game.board.clearBoard();
    }
}


var game = new GameManager(new GameBoard(board));

game.setState(new HumanState(game));

game.play();

/*
    Minimax implementation
*/

class MiniMax {
    constructor() {
        this.miniPlayer = createPlayer('O');
        this.maxPlayer = createPlayer('X');
    }
}
