const Room = require('../model/room.js');
const Player = require('../model/player.js');

module.exports = (io, socket) => {
    socket.on('createRoom', (username) => {
        console.log('createRoom');
        var roomId;
        while (true) {
            roomId = Math.random().toString(36).substring(2, 6).toUpperCase();
            if (!io.sockets.adapter.rooms.has(roomId)) break;
        }
        socket.join(roomId);
        console.log(io.sockets.adapter.rooms);

        var room = new Room({ io, roomId });
        var player = new Player({ socket, username });
        room.addPlayer(player);
        socket.player = player;
        rooms[roomId] = room;
        io.to(roomId).emit('updatePlayers', roomId, room.getPlayers());
        socket.emit('youAreTheHost');
    });

    socket.on('joinRoom', (username, roomId) => {
        console.log('joinRoom ' + roomId);
        // check if roomId exists
        var room = rooms[roomId];
        if (!room) {
            socket.emit('errorJoiningRoom', `Room ${roomId} does not exist!`);
        } else if (room.isFull()) {
            socket.emit('errorJoiningRoom', `Room ${roomId} is full!`);
        } else if (!room.isLobby()) {
            socket.emit('errorJoiningRoom', `Room ${roomId} has already started the game!`);
        } else {
            socket.join(roomId);
            console.log(io.sockets.adapter.rooms);

            var player = new Player({ socket, username });
            room.addPlayer(player);
            socket.player = player;
            io.to(roomId).emit('updatePlayers', roomId, room.getPlayers());
        }
    });
};