const Room = require('../model/room.js');
const Player = require('../model/player.js');

module.exports = (io, socket) => {
    socket.on('startGame', (roomId, concurrBoards, numBoardsToWin, emojiMode) => {
        var room = rooms[roomId];
        room.setConcurBoards(concurrBoards);
        room.setNumBoardsToWin(numBoardsToWin);
        var firstPlayer = room.startGame(emojiMode);
        io.to(roomId).emit('startGame', roomId, room.getGameState());
        io.to(firstPlayer).emit('itsYourTurn');
    });

    socket.on('chooseGrid', (roomId, props) => {
        var room = rooms[roomId];
        var result = room.chooseGrid(props);
        // result:{ power, winner, hasEnded, cursedBy, gameOver }
        if (result.gameOver) {
            io.to(roomId).emit('gameOver', result.winner);
            delete rooms[roomId]; 
            return;
        }
        if (result.hasEnded) {
            io.to(roomId).emit('boardOver', result.winner); // use for broadcast & update view
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
        // console.log(room.getGameState());
        io.to(nextPlayer).emit('itsYourTurn');
    });

    socket.on('usePowerup', (roomId, pow, props) => {
        // 0 : skip next player
        // 1 : remove piece  { board, row, col }
        // 2 : good bomb     { board, row, col }
        // 3 : good curse    { cursedBy, onIdx }
        // 6 : skip any player { onIdx }
        var room = rooms[roomId];
        if (pow == 0) {
            var playerIdx = room.skipNextPlayer();
            io.to(roomId).emit('skipUsed', playerIdx); // can use to broadcast who got skipped & update view
            io.to(roomId).emit('newGameState', roomId, room.getGameState());
        } else if (pow == 1) {
            room.removePiece(props);
            io.to(roomId).emit('removeUsed', props); // can use to broadcast & update view
            io.to(roomId).emit('newGameState', roomId, room.getGameState());
        } else if (pow == 2) {
            room.placeBomb(props);
            io.to(roomId).emit('bombUsed'); // can use to broadcast
        } else if (pow == 3) {
            room.placeCurse(props);
            io.to(roomId).emit('curseUsed'); // can use to broadcast
        } else if (pow == 6) {
            var playerIdx = room.skipPlayer(props.onIdx);
            io.to(roomId).emit('skipUsed', playerIdx);
            io.to(roomId).emit('newGameState', roomId, room.getGameState());
        }
    })

};