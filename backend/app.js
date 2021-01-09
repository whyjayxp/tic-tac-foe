const PORT = process.env.PORT || 8080

const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
app.use(cors())
const server = require('http').Server(app);
const initSocket = require('./socketio/socketioController.js');
initSocket(server);

// global dictionary of all rooms
rooms = {};

// replace this with frontend
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
//   });

app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../frontend/build/index.html')));

server.listen(PORT, () => {
    console.log(`socketio listening on port ${PORT}`);
})