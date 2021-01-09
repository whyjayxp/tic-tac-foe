import React from 'react'
import ReactDOM from 'react-dom'
import './index.css';
import Create from './create/Create'
import Waiting from './waitingRoom/waitingRoom'
import Game from './games/Game'
import socketClient from 'socket.io-client'

const SERVER = "http://localhost:8080"

class App extends React.Component {
    constructor(props) {
        super(props);
        this.updateRoom = this.updateRoom.bind(this);
        this.updateStatus = this.updateStatus.bind(this);
        this.joinRoom = this.joinRoom.bind(this);
        this.startGame = this.startGame.bind(this);
        this.state = {
            socket: socketClient(SERVER, {transports: ["websocket"]}),
            room: null,
            status: 'home'
        };
    }

    joinRoom(roomId, players, isHost) {
    // players: [{ username: x.username, symbol: x.symbol, wins: x.wins, skips: x.skips }]
        this.setState({ room: {roomId, players, isHost}, status: 'lobby' })
    }

    startGame(roomId, gameState) {
    // gameState: { boards: this.getBoards(), players: this.getPlayers(), turn: this.status };
    console.log(gameState);
        this.setState({ room: 
            {roomId, players: gameState.players, boards: gameState.boards, turn: gameState.turn}, 
            status: 'game' });
    }

    updateStatus(status) {
        this.setState({status});
    }

    updateRoom(room) {
        this.setState({room});
    }

    componentDidMount() {
    }

    render() {
        const socket = this.state.socket;
        const room = this.state.room;
        const status = this.state.status;
        let page;
        if (status === 'home') {
            page = <Create socket={socket} joinRoom={this.joinRoom} />
        } else if (status === 'lobby') {
            page = <Waiting room={room} socket={socket} updateRoom={this.updateRoom} startGame={this.startGame} />
        } else {
            page = <Game room={room} socket={socket} status={status} updateRoom={this.updateRoom} updateStatus={this.updateStatus} />
        }
        return (<div>
                { page }
        </div>);
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
