const socketio = require('socket.io');
const initLobby = require('./lobbyController');
const initGame = require('./gameController');

module.exports = server => {
    const options = {}; // for socketio server
    const io = socketio(server, options); 
    io.on('connection', (socket) => {
        console.log(`${socket.id} just connected`);
        socket.emit('newConnection');

        initLobby(io, socket);
        initGame(io, socket);

        socket.on('leaveRoom', (roomId) => {
            var room = rooms[roomId];
            socket.leave(roomId);
            if (!room) return;
            room.removePlayer(socket.player);
            if (room.isEmpty()) {
                delete rooms[roomId];
            } else {
                socket.to(roomId).emit('updatePlayers', roomId, room.getPlayers()); // update player list
                io.to(room.getHost()).emit('youAreTheHost');
            }
        });

        socket.on('newMessage', (roomId, msg) => {
            io.to(roomId).emit('newMessage', `${socket.player.username}: ${msg}`);
        });

        socket.on('disconnecting', (reason) => {
            // before socket.rooms is wiped out, handle existing game room
            if (socket.hasOwnProperty('player')) {
                socket.rooms.forEach(roomId => {
                    if (roomId != socket.id) {
                        var room = rooms[roomId];
                        if (!room) return; // game ended, room disappeared
                        if (room.isLobby()) {
                            room.removePlayer(socket.player);
                            socket.to(roomId).emit('updatePlayers', roomId, room.getPlayers()); // update player list
                            io.to(room.getHost()).emit('youAreTheHost');
                            return;
                        }
                        if (room.isLastPerson()) {
                            delete rooms[roomId]; // socketio room is automatically closed, just clear dictionary
                            return;
                        }
                        // middle of a game
                        var nextPlayer = room.setDisconnectedPlayer(socket.player);
                        if (nextPlayer !== null) {
                            io.to(nextPlayer).emit('itsYourTurn');
                        }
                        socket.to(roomId).emit('disconnectedPlayer', socket.player.username);
                        socket.to(roomId).emit('newGameState', roomId, room.getGameState());
                    }
                });
            }
        });

        socket.on('disconnect', (reason) => {
            console.log(`${socket.id} disconnected`);
        });


    });
};