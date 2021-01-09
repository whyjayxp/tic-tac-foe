import React from 'react'
import Players from './Players'
import Inventory from './Inventory'
import Boards from './Boards'
import { withSnackbar } from 'notistack';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
      }

    componentDidMount() {
        this.props.socket.on('newGameState', (roomId, gameState) => {
          var room = {roomId, players: gameState.players, boards: gameState.boards, turn: gameState.turn};
          this.props.updateRoom(room);
        });

        this.props.socket.on('gameOver', (winner) => {
            alert(`${this.props.room.players[winner].username} is the winner!`);
            this.props.updateStatus('home');
        });

        this.props.socket.on('disconnectedPlayer', (burden) => {
            alert(`${burden} disconnected. Moving back to home page...`);
            this.props.updateStatus('home');
        });


        this.props.socket.on('skipUsed', (playerIdx) => {
            this.props.enqueueSnackbar(`${this.props.room.players[playerIdx].username}'s turn will be skipped!`);
        });

        this.props.socket.on('removeUsed', () => {
            this.props.enqueueSnackbar(`A symbol has been removed!`);
        });

        this.props.socket.on('bombUsed', () => {
            this.props.enqueueSnackbar(`A bomb has been planted!`);
        });

        this.props.socket.on('curseUsed', () => {
            this.props.enqueueSnackbar(`A curse has been applied!`);
        });
    }

    render() {
        return (
        <div className="game">
            <div className="game-board">
            <Players className="players-list" socket={this.props.socket} room={this.props.room} status={this.props.status} updateStatus={this.props.updateStatus} />
            <Inventory socket={this.props.socket} room={this.props.room} status={this.props.status} updateStatus={this.props.updateStatus} />
            <Boards socket={this.props.socket} room={this.props.room} status={this.props.status} updateStatus={this.props.updateStatus} />
            </div>
            <div className="game-info">
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
            </div>
        </div>
        );
    }
}

export default withSnackbar(Game)