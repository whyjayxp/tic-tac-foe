const socketio = require('socket.io');
const initLobby = require('./lobbyController');

module.exports = server => {
    const options = {}; // for socketio server
    const io = socketio(server, options); 
    io.on('connection', (socket) => {
        console.log(`${socket.id} just connected`);

        initLobby(io, socket);

        socket.on('disconnecting', (reason) => {
            // before socket.rooms is wiped out, handle existing game room
            if (socket.hasOwnProperty('player')) {
                socket.rooms.forEach(roomId => {
                    if (roomId != socket.id) {
                        var room = rooms[roomId];
                        room.removePlayer(socket.player);
                        if (room.isEmpty()) {
                            delete rooms[roomId]; // socketio room is automatically closed, just clear dictionary
                        } else if (room.isLobby()) {
                            socket.to(roomId).emit('updatePlayers', roomId, room.getPlayers()); // update player list
                            io.to(room.getHost()).emit('youAreTheHost');
                        }
                    }
                });
            }
        });

        socket.on('disconnect', (reason) => {
            console.log(`${socket.id} disconnected`);
        });


    });
};