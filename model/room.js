// default values
const MAX_PLAYERS_DEFAULT = 6;
const MAX_BOARDS_DEFAULT = 3;
const NO_OF_BOARDS_TO_WIN_DEFAULT = 3;
const BOARD_SIZE_DEFAULT = 3;
const SYMBOLS = ['X', 'O', '@', '*', '&', '#']

// room status, 0 and above indicate the respective user's turn
const LOBBY = -1;
const GAMEOVER = -2;

module.exports = class Room {
    constructor(options) {
        // { io, roomId }
        this.io = options.io;
        this.roomId = options.roomId;
        this.players = [];
        this.status = LOBBY;

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
        return this.players.map((x, i) => [SYMBOLS[i], x.username]);
    }

    getHost() {
        if (!this.isEmpty()) {
            return this.players[0].socket.id;
        } else {
            return undefined;
        }
    }

    isFull() {
        return this.players.length >= this.maxPlayers;
    }

    isEmpty() {
        return this.players.length == 0;
    }

    isLobby() {
        return this.status == LOBBY;
    }
};