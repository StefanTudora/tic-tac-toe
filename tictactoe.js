
// FSM state machine for deciding player action

// Define pariticipants: min/max player; and action board

const board = Array(3).fill().map(() => Array(3).fill(0));

console.log(board);

// Player factory function
const createPlayer = function (boardSign) {
    this.boardSign = boardSign;

    const getSing = function () {
        return this.boardSign;
    }
}

const playerMap = { "CPU": createPlayer('O'), "Human": createPlayer('X') };

class GameBoard {
    constructor(game, board) {
        this.game = game;
        this.board = board;

        this.getFreeSpots = function () {
            const coordinateList = new Array();
            board.forEach((row, rowIndex) => {
                row.forEach((value, colIndex) => {
                    if (value == '#') {
                        coordinateList.push([rowIndex, colIndex]);
                    }
                });
            });
        }

        this.setSpot = function (row, col, signature) {
            board[row][col] = signature;
        }

        this.getSpot = function (row, col) {
            return board[row][col];
        }
    }
}



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

        this.incrementAndGet = function () {
            ++this.counter;
            return this.counter;
        };
    }
}

class HumanState {
    constructor(game, playerInfo) {
        this.game = game;
        this.playerInfo = playerInfo;
        this.doAction = function () {
            console.log("We are doing an action on the Human state");
            if (game.incrementAndGet() > 10) {
                game.setState(new FinalState())
            } else {
                game.setState(new CheckState(game, this));
            }
        }
    }
}

class CPUState {
    constructor(game, playerInfo) {
        this.game = game;
        this.playerInfo = playerInfo;
        this.doAction = function () {
            console.log("We are doing an action on the CPU state");
            if (game.incrementAndGet() > 10) {
                game.setState(new FinalState())
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
            console.log("Checking the if there is a winner");
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
}


var game = new GameManager(new GameBoard(board));

game.setState(new HumanState(game));

game.play();

