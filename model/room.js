const Board = require('../model/board.js');

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

        // board info
        this.boards = [];
    }

    addPlayer(player) {
        this.players.push(player);
    }

    removePlayer(player) {
        const index = this.players.indexOf(player);
        if (index > -1) this.players.splice(index, 1);
    }

    getPlayers() {
        return this.players.map(x => { 
            return { username: x.username, symbol: x.symbol, wins: x.wins, skips: x.skips } 
        });
    }

    getBoards() {
        return this.boards.map(x => x.symbols);
    }

    getGameState() {
        return { boards: this.getBoards(), players: this.getPlayers(), turn: this.status };
    }

    setConcurBoards(num) {
        this.maxConcurBoards = num;
    }

    setNumBoardsToWin(num) {
        this.numBoardsToWin = num;
    }

    startGame() {
        if (this.status != LOBBY) return;
        // assign symbols to all players
        for (var i = 0; i < this.players.length; i++) {
            this.players[i].setSymbol(SYMBOLS[i]);
        }
        // generate boards
        for (var i = 0; i < this.maxConcurBoards; i++) {
            this.boards.push(new Board(this.boardSize, this.boardSize));
        }
        this.status = 0; // first player's turn
        return this.players[0].socket.id;
    }

    chooseGrid(props) {
        var { board, row, col } = props;
        var thisPlayer = this.players[this.status];
        var result;
        if (thisPlayer.checkCurse()) {
            var cursedBy = thisPlayer.removeCurse();
            result = this.boards[board].fillBoxWith(row, col, this.status, cursedBy);
            // result.wasCursed = true;
        } else {
            result = this.boards[board].fillBoxWith(row, col, this.status, -1);
            // result.wasCursed = false;
        }
        // result: { power, winner, hasEnded }
        result.gameOver = false;
        if (result.hasEnded) {
            if (result.winner != -1) {
                var wins = this.players[result.winner].addWin();
                if (wins >= this.numBoardsToWin) {
                    this.status = GAMEOVER;
                    result.gameOver = true;
                    return result;
                }
            }
            this.boards[board] = new Board(this.boardSize, this.boardSize);
        }
        return result;
    }

    nextTurn() {
        this.status = (this.status + 1) % this.players.length;
        var nextPlayer = this.players[this.status];
        while (nextPlayer.checkSkip()) {
            nextPlayer.removeSkip();
            this.status = (this.status + 1) % this.players.length;
            nextPlayer = this.players[this.status];
        }
        return this.players[this.status].socket.id;
    }

    skipNextPlayer() {
        var playerIdx = (this.status + 1) % this.players.length;
        var nextPlayer = this.players[playerIdx];
        nextPlayer.addSkip();
        return playerIdx;
    }

    skipPlayer(onIdx) {
        var player = this.players[onIdx];
        player.addSkip();
        return onIdx;
    }

    removePiece(props) {
        // props: { board, row, col }
        this.boards[props.board].clearBox(props.row, props.col);
    }

    placeBomb(props) {
        this.boards[props.board].placeBomb(props.row, props.col);
    }

    placeCurse(props) {
        this.players[props.onIdx].setCurse(props.cursedBy);
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