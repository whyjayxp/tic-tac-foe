// import { Server } from 'socket.io';

const socketio = require('socket.io');
const Room = require('../model/room.js');
const Player = require('../model/player.js');

// global dictionary of all rooms
let rooms = {};

module.exports = server => {
    const options = {}; // for socketio server
    const io = socketio(server, options); 
    io.on('connection', (socket) => {
        console.log(`${socket.id} just connected`);

        ////////////////////////////// LOBBY STUFF
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
        });

        socket.on('joinRoom', (username, roomId) => {
            console.log('joinRoom ' + roomId);
            // check if roomId exists
            var room = rooms[roomId];
            if (!room) {
                console.log(`room ${roomId} does not exist!`);
            } else if (room.isFull()) {
                console.log(`room ${roomId} is full!`);
            } else {
                socket.join(roomId);
                console.log(io.sockets.adapter.rooms);

                var player = new Player({ socket, username });
                room.addPlayer(player);
                socket.player = player;
                io.to(roomId).emit('updatePlayers', roomId, room.getPlayers());
            }
        });

        socket.on('disconnecting', (reason) => {
            // before socket.rooms is wiped out, handle existing game room
            if (socket.hasOwnProperty('player')) {
                socket.rooms.forEach(roomId => {
                    if (roomId != socket.id) {
                        var room = rooms[roomId];
                        room.removePlayer(socket.player);
                        if (room.isEmpty()) {
                            delete rooms[roomId];
                        } else {
                            // if room status is waiting room
                            socket.to(roomId).emit('updatePlayers', roomId, room.getPlayers());
                        }
                    }
                });
            }
        });

        socket.on('disconnect', (reason) => {
            // remove user, cleanup room if no more users
            console.log(`${socket.id} disconnected`);
        });


    });
};