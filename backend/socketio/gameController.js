const Room = require('../model/room.js');
const Player = require('../model/player.js');

module.exports = (io, socket) => {
    socket.on('startGame', (roomId, concurrBoards, numBoardsToWin, emojiMode, startingPowerup) => {
        var room = rooms[roomId];
        room.setConcurBoards(concurrBoards);
        room.setNumBoardsToWin(numBoardsToWin);
        var firstPlayer = room.startGame(emojiMode);
        io.to(roomId).emit('startGame', roomId, room.getGameState());
        io.to(roomId).emit('numBoardsToWin', numBoardsToWin);
        if (startingPowerup) io.to(roomId).emit('startingPowerup');
        // room.players.forEach((player, idx) => {
        //     io.to(player.socket.id).emit('youAreTheNthPlayer', idx);
        // })
        io.to(firstPlayer).emit('itsYourTurn');
    });

    socket.on('chooseGrid', (roomId, props) => {
        var room = rooms[roomId];
        var result = room.chooseGrid(props);
        // result:{ power, winner, hasEnded, cursedBy, gameOver }
        if (result.gameOver) {
            io.to(roomId).emit('newGameState', roomId, room.getGameState());
            io.to(roomId).emit('gameOver', result.winner);
            delete rooms[roomId]; 
            return;
        }
        if (result.hasEnded) {
            // result.prevBoard contains the prev board to display winning line
            console.log(result.prevBoard);
            io.to(roomId).emit('boardOver', result.winner, result.prevBoard); // use for broadcast & update view
        }
        if (result.cursedBy > -1) {
            io.to(roomId).emit('cursed', socket.player.username, result.cursedBy);
        }
        socket.emit('newPower', result.power);
        if (result.power === 4) {
            socket.to(roomId).emit('bombed', socket.player.username);
        } else if (result.power === 5) {
            socket.to(roomId).emit('joked', socket.player.username);
        }
        var nextPlayer = room.nextTurn();
        io.to(roomId).emit('newGameState', roomId, room.getGameState());
        io.to(nextPlayer).emit('itsYourTurn');
    });

    socket.on('usePowerup', (roomId, pow, props) => {
        // 0 : skip next player
        // 1 : remove piece  { board, row, col }
        // 2 : good bomb     { board, row, col }
        // 3 : good curse    { cursedBy, onIdx }
        // 6 : skip any player { onIdx }
        // 7 : randomize replace { board, row, col }
        // 8 : unbox the box { board, row, col }
        // 9 : shield
        // 10 : deflect
        var room = rooms[roomId];
        if (pow == 0) {
            // res { from, to, shield }
            var res = room.skipNextPlayer();
            io.to(roomId).emit('skipUsed', res); // can use to broadcast who got skipped & update view
            if (res.shield) {
                io.to(room.players[res.to].socket.id).emit('shieldUsed');
            }
            io.to(roomId).emit('newGameState', roomId, room.getGameState());
        } else if (pow == 1) {
            var symbol = room.removePiece(props);
            io.to(roomId).emit('removeUsed', { board: props.board, symbol }); // can use to broadcast & update view
            io.to(roomId).emit('newGameState', roomId, room.getGameState());
        } else if (pow == 2) {
            room.placeBomb(props);
            io.to(roomId).emit('bombUsed'); // can use to broadcast
        } else if (pow == 3) {
            var res = room.placeCurse(props);
            if (res.shield) {
                io.to(room.players[res.to].socket.id).emit('shieldUsed');
            }
            io.to(roomId).emit('curseUsed', res); // can use to broadcast
        } else if (pow == 6) {
            // res { from, to, shield }
            var res = room.skipPlayer(props.onIdx);
            io.to(roomId).emit('skipUsed', res);
            if (res.shield) {
                io.to(room.players[res.to].socket.id).emit('shieldUsed');
            }
            io.to(roomId).emit('newGameState', roomId, room.getGameState());
        } else if (pow == 7) {
            // result = { from, to, gameOver, winner, hasEnded }
            var result = room.randomizeReplacePiece(props);
            if (result === null) return;
            io.to(roomId).emit('randomizeReplaceUsed', { board: props.board, from: result.from, to: result.to });
            if (result.gameOver) {
                io.to(roomId).emit('newGameState', roomId, room.getGameState());
                io.to(roomId).emit('gameOver', result.winner);
                delete rooms[roomId]; 
                return;
            }
            if (result.hasEnded) {
                io.to(roomId).emit('boardOver', result.winner); // use for broadcast & update view
            }
            io.to(roomId).emit('newGameState', roomId, room.getGameState());
        } else if (pow == 8) {
            var power = room.getPowerAt(props);
            socket.emit('unboxResult', power);
        } else if (pow == 9) {
            room.shieldCurrentPlayer();
        } else if (pow == 10) {
            room.deflectCurrentPlayer();
        }
    })

};