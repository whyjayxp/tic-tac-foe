// global variables
const MAX_PLAYERS_DEFAULT = 6;
const MAX_BOARDS_DEFAULT = 3;
const NO_OF_BOARDS_TO_WIN_DEFAULT = 3;
const BOARD_SIZE_DEFAULT = 3;

module.exports = class Room {
    constructor(options) {
        // { io, roomId }
        this.io = options.io;
        this.roomId = options.roomId;
        this.players = [];
        this.status = "lobby";

        // room settings
        this.maxPlayers = MAX_PLAYERS_DEFAULT;
        this.maxConcurBoards = MAX_BOARDS_DEFAULT;
        this.numBoardsToWin = NO_OF_BOARDS_TO_WIN_DEFAULT;
        this.boardSize = BOARD_SIZE_DEFAULT;

        // turn info
        // boards info
    }

    addPlayer(player) {
        this.players.push(player);
    }

    removePlayer(player) {
        const index = this.players.indexOf(player);
        if (index > -1) this.players.splice(index, 1);
    }

    getPlayers() {
        return this.players.map(x => x.username);
    }

    isFull() {
        return this.players.length >= this.maxPlayers;
    }

    isEmpty() {
        return this.players.length == 0;
    }
};