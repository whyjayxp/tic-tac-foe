const Board = require('../model/board.js');

// default values
const MAX_PLAYERS_DEFAULT = 9;
const MAX_BOARDS_DEFAULT = 3;
const NO_OF_BOARDS_TO_WIN_DEFAULT = 3;
const BOARD_SIZE_DEFAULT = 3;
const SYMBOLS = ['X', 'O', '@', '*', '&', '#', '$', '%', 'Z']
const EMOJIS = ['🐶', '🐱', '🐷', '🐹', '🐰', '🦊', '🐻', '🐼', '🐯']

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
        this.powersToUse = new Array(11).fill(true);

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

    setDisconnectedPlayer(player) {
        player.setOffline();
        const index = this.players.indexOf(player);
        if (this.status === index) { // move to next turn
            return this.nextTurn();
        }
        return null;
    }

    getPlayers() {
        return this.players.map(x => { 
            return { username: x.username, symbol: x.symbol, wins: x.wins, skips: x.skips, isOnline: x.online } 
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

    setPowersToUse(arr) {
        this.powersToUse = arr;
    }

    startGame(emojiMode = false) {
        if (this.status != LOBBY) return;
        // assign symbols to all players
        for (var i = 0; i < this.players.length; i++) {
            if (emojiMode) {
                this.players[i].setSymbol(EMOJIS[i]);
            } else {
                this.players[i].setSymbol(SYMBOLS[i]);
            }
        }
        // generate boards
        for (var i = 0; i < this.maxConcurBoards; i++) {
            this.boards.push(new Board(this.boardSize, this.boardSize, this.powersToUse));
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
            result.cursedBy = cursedBy;
        } else {
            result = this.boards[board].fillBoxWith(row, col, this.status, -1);
            result.cursedBy = -1;
        }
        // result: { power, winner, hasEnded, cursedBy }
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
            result.prevBoard = this.boards[board].symbols;
            this.boards[board] = new Board(this.boardSize, this.boardSize, this.powersToUse);
        }
        return result;
    }

    nextTurn() {
        this.status = (this.status + 1) % this.players.length;
        var nextPlayer = this.players[this.status];
        while (nextPlayer.checkSkip() || nextPlayer.isOffline()) {
            nextPlayer.removeSkip();
            this.status = (this.status + 1) % this.players.length;
            nextPlayer = this.players[this.status];
        }
        return this.players[this.status].socket.id;
    }

    skipNextPlayer() {
        var playerIdx = (this.status + 1) % this.players.length;
        var nextPlayer = this.players[playerIdx];
        if (nextPlayer.checkDeflect()) {
            nextPlayer.setDeflect(false);
            return { from: this.status, to: playerIdx, shield: false, deflect: true };
        } else if (nextPlayer.checkShield()) {
            nextPlayer.setShield(false);
            return { from: this.status, to: playerIdx, shield: true, deflect: false };
        } else {
            nextPlayer.addSkip();
            return { from: this.status, to: playerIdx, shield: false, deflect: false };
        }
    }

    skipPlayer(props) {
        var player = this.players[props.onIdx];
        if (player.checkDeflect()) {
            player.setDeflect(false);
            return { from: props.skippedBy, to: props.onIdx, shield: false, deflect: true };
        } else if (player.checkShield()) {
            player.setShield(false);
            return { from: props.skippedBy, to: props.onIdx, shield: true, deflect: false };
        } else {
            player.addSkip();
            return { from: props.skippedBy, to: props.onIdx, shield: false, deflect: false };
        }
    }

    removePiece(props) {
        // props: { board, row, col }
        return this.boards[props.board].clearBox(props.row, props.col);
    }

    placeBomb(props) {
        this.boards[props.board].placeBomb(props.row, props.col);
    }

    placeCurse(props) {
        var player = this.players[props.onIdx];
        if (player.checkDeflect()) {
            player.setDeflect(false);
            return { from: props.cursedBy, to: props.onIdx, shield: false, deflect: true };
        } else if (player.checkShield()) {
            player.setShield(false);
            return { from: props.cursedBy, to: props.onIdx, shield: true, deflect: false };
        } else {
            player.setCurse(props.cursedBy);
            return { from: props.cursedBy, to: props.onIdx, shield: false, deflect: false };
        }
    }

    randomizeReplacePiece(props) {
        var players = this.players.map((x,i) => i);
        //  result { from, to, winner, hasEnded }
        var result = this.boards[props.board].randomizeReplaceBox(props.row, props.col, players);
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
            this.boards[props.board] = new Board(this.boardSize, this.boardSize);
        }
        return result;
    }

    getPowerAt(props) {
        return this.boards[props.board].getPowerAt(props.row, props.col);
    }

    shieldCurrentPlayer() {
        this.players[this.status].setShield(true);
    }

    deflectCurrentPlayer() {
        this.players[this.status].setDeflect(true);
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
        return this.players.filter(x => x.online).length == 0;
    }

    isLastPerson() {
        return this.players.filter(x => x.online).length == 1;
    }

    isLobby() {
        return this.status == LOBBY;
    }
};