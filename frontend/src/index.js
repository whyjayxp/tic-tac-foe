import React from 'react'
import ReactDOM from 'react-dom'
import './index.css';
import Create from './create/Create'
import Waiting from './waitingRoom/waitingRoom'
import Game from './games/Game'
import socketClient from 'socket.io-client'
import { SnackbarProvider } from 'notistack';

// const SERVER = "http://localhost:8080" // use this if calling 'npm start' from frontend folder, access via localhost:3000
const SERVER = "/" // use this if using static files in build folder after 'npm run build', access via localhost:8080

class App extends React.Component {
    constructor(props) {
        super(props);
        this.updateRoom = this.updateRoom.bind(this);
        this.updateStatus = this.updateStatus.bind(this);
        this.joinRoom = this.joinRoom.bind(this);
        this.resetRoom = this.resetRoom.bind(this);
        this.startGame = this.startGame.bind(this);
        this.state = {
            socket: socketClient(SERVER, {transports: ["websocket"]}),
            room: null,
            status: 'home' // home, lobby, game, turn, gameover, use_power_{idx}
        };
    }

    joinRoom(roomId, players, isHost) {
    // players: [{ username: x.username, symbol: x.symbol, wins: x.wins, skips: x.skips }]
        this.setState({ room: {roomId, players, isHost}, status: 'lobby' })
    }

    startGame(roomId, gameState) {
    // gameState: { boards: this.getBoards(), players: this.getPlayers(), turn: this.status };
    //console.log(gameState);
        this.setState({ room: 
            {roomId, players: gameState.players, boards: gameState.boards, turn: gameState.turn}, 
            status: 'game' });
    }

    resetRoom(roomId) {
        this.state.socket.emit('leaveRoom', roomId);
        this.setState({ status: 'home', room: null });
    }

    updateStatus(status) {
        this.setState({status});
    }

    updateRoom(room) {
        this.setState({room});
    }

    componentDidMount() {
        this.state.socket.on('disconnect', (reason) => {
            if (this.state.hasOwnProperty('status') && this.state.status !== 'home') {
                alert('You disconnected from the room!');
            }
            this.setState({status: 'home', room: null });
        });
    }

    componentWillUnmount() {
        this.props.socket.off('disconnect');
    }

    render() {
        const socket = this.state.socket;
        const room = this.state.room;
        const status = this.state.status;
        let page;
        if (status === 'home') {
            page = <Create socket={socket} joinRoom={this.joinRoom} />
        } else if (status === 'lobby') {
            page = <Waiting room={room} socket={socket} updateRoom={this.updateRoom} startGame={this.startGame} updateStatus={this.updateStatus} resetRoom={this.resetRoom} />
        } else {
            page = <Game room={room} socket={socket} status={status} updateRoom={this.updateRoom} updateStatus={this.updateStatus} resetRoom={this.resetRoom} joinRoom={this.joinRoom} />
        }
        return (<div>
                { page }
        </div>);
    }
}

ReactDOM.render(<SnackbarProvider maxSnack={3}><App /></SnackbarProvider>, document.getElementById('root'));
