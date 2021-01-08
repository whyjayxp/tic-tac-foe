const POWER_PROB = [0.2, 0.2, 0.1, 0.1, 0.2, 0.2];
    // 0 : skip next player
    // 1 : remove piece
    // 2 : good bomb
    // 3 : good curse
    // 4 : bad bomb
    // 5 : bad curse
const CHECKS = [  // only for 3x3
    [[0,0], [0,1], [0,2]], [[1,0], [1,1], [1,2]], [[2,0], [2,1], [2,2]], // rows
    [[0,0], [1,0], [2,0]], [[0,1], [1,1], [2,1]], [[0,2], [1,2], [2,2]], // cols
    [[0,0], [1,1], [2,2]], [[0,2], [1,1], [2,0]] // diagonals
];
const NUM_OF_POWERS = 4;

module.exports = class Board {
    constructor(row, col) {
        this.symbols = createBoard(row, col);
        this.powers = createBoard(row, col);
        this.row = row;
        this.col = col;
        randomizePowers();
        // this.symbols = Array.from(Array(options.row), () => new Array(options.col));
    }

    createBoard(row, col, val = -1) {
        var B = [];
        for (var i = 0; i < row; i++) {
            B[i] = [];
            for (var j = 0; j < col; j++) {
                B[i][j] = val;
            }
        }
        return B;
    }

    getRandomFromBucket(bucket) {
        var idx = Math.floor(Math.random() * bucket.length);
        return bucket.splice(idx, 1)[0];
    }

    getRandomPower() {
        var r = Math.random();
        var sum = 0;
        for (i in POWER_PROB) {
            sum += POWER_PROB[i];
            if (r <= sum) return i;
        }
    }

    randomizePowers() {
        var buckets = [];
        for (var i = 0; i < this.row * this.col; i++) {
            buckets.push(i);
        }
        for (var i = 0; i < NUM_OF_POWERS; i++) {
            var nextBox = this.getRandomFromBucket(buckets);
            var r = Math.floor(nextBox / this.col);
            var c = nextBox % this.col;
            this.powers[r][c] = getRandomPower();
        }
    }

    fillBoxWith(i, j, val, cursedBy) {
        var result = {};
        var power = this.powers[i][j];
        result.power = power;
        if (power == 0 || power == 1 || power == 2 || power == 3) {
            this.players[this.status].addPowerup(power);
            if (cursedBy == -1) {
                this.symbols[i][j] = val;
            } else {
                this.symbols[i][j] = cursedBy;
            }
        } else if (power == 4) {
            // bad bomb
            // exploded and gone
        } else if (power == 5) {
            // bad curse
            // we randomize symbol for now, but can let player choose also
            var buckets = [];
            for (var i = 0; i < this.players.length; i++) {
                if (i != this.status) buckets.push(i);
            }
            this.symbols[i][j] = this.getRandomFromBucket(buckets);
        } else { // boring box
            if (cursedBy == -1) {
                this.symbols[i][j] = val;
            } else {
                this.symbols[i][j] = cursedBy;
            }
        }
        this.powers[i][j] = -1; // remove the power
        result.winner = getWinner();
        if (result.winner != -1) {
            result.hasEnded = true;
        } else {
            result.hasEnded = hasBoardEnded();
        }
        return result;
    }

    clearBox(i, j) {
        this.symbols[i][j] = -1;
    }

    placeBomb(i, j) {
        if (this.powers[i][j] == 4) {
            // TODO: MASSIVE EXPLOSION
            this.powers[i][j] = 4;
        } else {
            this.powers[i][j] = 4;
        }
    }

    getWinner() {
        // check if there is a row, col, diagonal
        for (var i = 0; i < checks.length; i++) {
            var toCheck = CHECKS[i];
            if (this.symbols[toCheck[0][0]][toCheck[0][1]] == this.symbols[toCheck[1][0]][toCheck[1][1]] &&
                this.symbols[toCheck[1][0]][toCheck[1][1]] == this.symbols[toCheck[2][0]][toCheck[2][1]]) {
                    if (this.symbols[toCheck[0][0]][toCheck[0][1]] != -1) {
                        return this.symbols[toCheck[0][0]][toCheck[0][1]];
                    }
                }
        }
        return -1;
    }

    hasBoardEnded() {
        for (var i = 0; i < this.row; i++) {
            for (var j = 0; j < this.col; j++) {
                if (this.symbols[i][j] == -1) {
                    return false;
                }
            }
        }
        return true;
    }
    
};