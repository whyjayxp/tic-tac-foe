const PORT = 8080

const app = require('express')();
const server = require('http').Server(app);
const initSocket = require('./socketio/socketioController.js');
initSocket(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

server.listen(PORT, () => {
    console.log(`socketio listening on port ${PORT}`);
})