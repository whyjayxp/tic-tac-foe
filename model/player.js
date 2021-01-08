module.exports = class Player {
    constructor(options) {
        // { socket, username }
        this.socket = options.socket;
        this.username = options.username;
        this.symbol = '';
        // power up info
    }
};