
// FSM state machine for deciding player action

// Define pariticipants: min/max player; and action board

const board = Array(3).fill().map(() => Array(3).fill(0));

console.log(board);


class GameManager {
    constructor(board) {
        this.board = board;
        this.state = undefined;
        this.counter = 0;

        this.getState = function() {
            if (this.state !== undefined) {
                return this.state;
            }
        };

        this.setState = function(state) {
            this.state = state;
        };

        this.play = function() {
            while (!(this.state instanceof FinalState)) {
                console.log("Keep playing");
                // console.log(this.state);
                this.state.doAction();
            }
        };

        this.incrementAndGet = function() {
            ++ this.counter;
            return this.counter;
        };
    }
}

class HumanState {
    constructor(game) {
        this.game = game;

        this.doAction = function() {
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
    constructor(game) {
        this.game = game;
        this.doAction = function() {
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
    constructor (game, prevState) {
        this.game = game;
        this.prevState = prevState;

        this.doAction = function() {
            console.log("Checking the if there is a winner");
            if (prevState instanceof HumanState) {
                game.setState(new CPUState(game));
            } else {
                game.setState(new HumanState(game));
            }
        }
    }
}

class FinalState {
    // Intentionally left empty
}


var game = new GameManager(board);

game.setState(new HumanState(game));

game.play();

