const Room = require('../model/room.js');
const Player = require('../model/player.js');

const getPublicRooms = () => {
    return Object.keys(rooms).filter(x => rooms[x].publicRoom).map(x => { return { roomId: rooms[x].roomId, players: rooms[x].players.length, maxPlayers: rooms[x].maxPlayers } });
};

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
        socket.room = roomId;
        rooms[roomId] = room;
        socket.emit('successJoiningRoom', roomId, room.getPlayers());
        socket.to(roomId).emit('updatePlayers', roomId, room.getPlayers());
        // socket.emit('youAreTheHost');
    });

    socket.on('joinRoom', (username, roomId) => {
        console.log('joinRoom ' + roomId);
        // check if roomId exists
        var room = rooms[roomId];
        if (!room) {
            socket.emit('errorJoiningRoom', `Room ${roomId} does not exist!`);
        } else if (room.isGameOver()) {
            socket.emit('errorJoiningRoom', `Room ${roomId} has finished the game!`);
        } else if (!room.isLobby()) {
            socket.emit('errorJoiningRoom', `Room ${roomId} has already started the game!`);
        } else if (room.isFull()) {
            socket.emit('errorJoiningRoom', `Room ${roomId} is full!`);
        } else {
            socket.join(roomId);
            console.log(io.sockets.adapter.rooms);

            var player = new Player({ socket, username });
            room.addPlayer(player);
            socket.player = player;
            socket.room = roomId;
            socket.emit('successJoiningRoom', roomId, room.getPlayers());
            socket.to(roomId).emit('updatePlayers', roomId, room.getPlayers());
            socket.emit('hostUpdated', {
                concurBoards: room.maxConcurBoards,
                boardsToWin: room.numBoardsToWin,
                emojiMode: room.emojiMode,
                startingPowerup: room.startingPowerup,
                teamMode: room.teamMode,
                powersToUse: room.powersToUse,
                publicRoom: room.publicRoom,
                maxPlayers: room.maxPlayers
            });
        }
    });

    socket.on('leaveRoom', (roomId) => {
        var room = rooms[roomId];
        socket.leave(roomId);
        if (!room) return;
        room.removePlayer(socket.player);
        if (room.isEmpty()) {
            delete rooms[roomId];
        } else {
            socket.to(roomId).emit('playerLeft', socket.player.username);
            socket.to(roomId).emit('updatePlayers', roomId, room.getPlayers()); // update player list
            io.to(room.getHost()).emit('youAreTheHost');
        }
        socket.emit('showPublicRooms', getPublicRooms());
    });

    socket.on('hostUpdate', (roomId, settings) => {
        var room = rooms[roomId];
        if (room.players[0].socket !== socket) return; // only host can change! user probably modified client-side
        socket.to(roomId).emit('hostUpdated', settings);
        if (settings.hasOwnProperty('concurBoards')) room.setConcurBoards(settings.concurBoards);
        if (settings.hasOwnProperty('boardsToWin')) room.setNumBoardsToWin(settings.boardsToWin);
        if (settings.hasOwnProperty('emojiMode')) room.setEmojiMode(settings.emojiMode);
        if (settings.hasOwnProperty('startingPowerup')) room.setStartingPowerup(settings.startingPowerup);
        if (settings.hasOwnProperty('teamMode')) room.setTeamMode(settings.teamMode);
        if (settings.hasOwnProperty('powersToUse')) room.setPowersToUse(settings.powersToUse);
        if (settings.hasOwnProperty('publicRoom')) room.setPublicRoom(settings.publicRoom);
        if (settings.hasOwnProperty('maxPlayers')) room.setMaxPlayers(settings.maxPlayers);
    });

    socket.on('playAgain', (roomId) => {
        if (socket.player === null || socket.player === undefined) return;
        var room = rooms[roomId];
        if (!room) return;
        var nextRoomId = room.getNextRoomId();
        if (nextRoomId !== '') {
            var nextRoom = rooms[nextRoomId];
            if (!nextRoom) {
                socket.emit('errorRejoiningRoom', `The room does not exist!`);
            } else if (nextRoom.isGameOver()) {
                socket.emit('errorRejoiningRoom', `The room has finished the game!`);
            } else if (!nextRoom.isLobby()) {
                socket.emit('errorRejoiningRoom', `The room has already started the game!`);
            } else if (nextRoom.isFull()) {
                socket.emit('errorRejoiningRoom', `The room is full!`);
            } else {
                room.removePlayer(socket.player);
                socket.leave(roomId);
                socket.join(nextRoomId);
                var username = socket.player.username;
                var player = new Player({ socket, username });
                nextRoom.addPlayer(player);
                socket.player = player;
                socket.room = nextRoomId;
                socket.to(roomId).emit('playerLeft', username);
                socket.emit('successRejoiningRoom', nextRoomId, nextRoom.getPlayers(), false);
                socket.to(nextRoomId).emit('updatePlayers', nextRoomId, nextRoom.getPlayers());
                if (room.isEmpty()) {
                    delete rooms[roomId];
                }
            }
        } else {
            // create room
            while (true) {
                nextRoomId = Math.random().toString(36).substring(2, 6).toUpperCase();
                if (!io.sockets.adapter.rooms.has(nextRoomId)) break;
            }
            room.removePlayer(socket.player);
            room.setNextRoomId(nextRoomId);
            socket.leave(roomId);
            socket.join(nextRoomId);
            var nextRoom = new Room({ io, nextRoomId });
            var username = socket.player.username;
            var player = new Player({ socket, username });
            nextRoom.addPlayer(player);
            socket.player = player;
            socket.room = nextRoomId;
            rooms[nextRoomId] = nextRoom;
            socket.to(roomId).emit('playerLeft', username);
            socket.emit('successRejoiningRoom', nextRoomId, nextRoom.getPlayers(), true);
            socket.to(nextRoomId).emit('updatePlayers', nextRoomId, nextRoom.getPlayers());
            socket.emit('hostUpdated', {
                concurBoards: nextRoom.maxConcurBoards,
                boardsToWin: nextRoom.numBoardsToWin,
                emojiMode: nextRoom.emojiMode,
                startingPowerup: nextRoom.startingPowerup,
                teamMode: nextRoom.teamMode,
                powersToUse: nextRoom.powersToUse,
                publicRoom: nextRoom.publicRoom,
                maxPlayers: nextRoom.maxPlayers
            });
            if (room.isEmpty()) {
                delete rooms[roomId];
            }
        }     
    });
};