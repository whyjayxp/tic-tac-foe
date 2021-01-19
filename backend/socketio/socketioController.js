const socketio = require('socket.io');
const initLobby = require('./lobbyController');
const initGame = require('./gameController');

const getPublicRooms = () => {
    return Object.keys(rooms).filter(x => rooms[x].publicRoom && rooms[x].isLobby()).map(x => { return { roomId: rooms[x].roomId, players: rooms[x].players.length, maxPlayers: rooms[x].maxPlayers } });
};

module.exports = server => {
    const options = {}; // for socketio server
    const io = socketio(server, options); 
    io.on('connection', (socket) => {
        console.log(`${socket.id} just connected`);

        initLobby(io, socket);
        initGame(io, socket);

        socket.emit('showPublicRooms', getPublicRooms());

        socket.on('getPublicRooms', () => {
            socket.emit('showPublicRooms', getPublicRooms());
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
                            if (room.isEmpty()) {
                                console.log("empty room");
                                delete rooms[roomId];
                            } else {
                                socket.to(roomId).emit('updatePlayers', roomId, room.getPlayers()); // update player list
                                io.to(room.getHost()).emit('youAreTheHost');
                            }
                            return;
                        }
                        if (room.isGameOver()) {
                            room.removePlayer(socket.player);
                            if (room.isEmpty()) {
                                delete rooms[roomId];
                            } else {
                                socket.to(roomId).emit('disconnectedPlayer', socket.player.username);
                            }
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
                        socket.to(roomId).emit('newGameState', roomId, room.getGameState(), null);
                    }
                });
            }
        });

        socket.on('disconnect', (reason) => {
            console.log(`${socket.id} disconnected`);
        });


    });
};