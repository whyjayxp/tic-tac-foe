module.exports = class Board {
    constructor(options) {
        // { row, col }
        this.board = Array.from(Array(options.row), () => new Array(options.col));
    }
};