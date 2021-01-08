const Room = require('../model/room.js');
const Player = require('../model/player.js');

module.exports = (io, socket) => {
    socket.on('startGame', (roomId, concurrBoards, numBoardsToWin) => {
        var room = rooms[roomId];
        room.setConcurBoards(concurrBoards);
        room.setNumBoardsToWin(numBoardsToWin);
        var firstPlayer = room.startGame();
        io.to(roomId).emit('startGame', roomId, room.getGameState());
        io.to(firstPlayer).emit('itsYourTurn');
    });

    socket.on('chooseGrid', (roomId, props) => {
        var room = rooms[roomId];
        var result = room.chooseGrid(props);
        // { power, winner, hasEnded, gameOver }
        if (result.gameOver) {
            io.to(roomId).emit('gameOver', winner);
            delete rooms[roomId]; 
            return;
        }
        if (result.hasEnded) {
            io.to(roomId).emit('boardOver', winner); // use for broadcast & update view
        }
        socket.emit('newPower', power);
        var nextPlayer = room.nextTurn();
        io.to(roomId).emit('newGameState', room.getGameState());
        io.to(nextPlayer).emit('itsYourTurn');
    });

    socket.on('usePowerup', (roomId, powIdx, props) => {
        var pow = socket.player.usePowerup(powIdx);
        // 0 : skip next player
        // 1 : remove piece  { board, row, col }
        // 2 : good bomb     { board, row, col }
        // 3 : good curse    { symbol, onIdx }
        if (pow == 0) {
            room.skipNextPlayer();
            io.to(roomId).emit('skipUsed', playerIdx); // can use to broadcast who got skipped & update view
        } else if (pow == 1) {
            room.removePiece(props);
            io.to(roomId).emit('removeUsed', props); // can use to broadcast & update view
        } else if (pow == 2) {
            room.placeBomb(props);
            io.to(roomId).emit('bombUsed'); // can use to broadcast
        } else if (pow == 3) {
            room.placeCurse(props);
            io.to(roomId).emit('curseUsed'); // can use to broadcast
        }
    })


};