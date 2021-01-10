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

        this.props.socket.on('boardOver', (winner) => {
            if (winner > -1) {
                this.props.enqueueSnackbar(`${this.props.room.players[winner].username} cleared the board!`, { autoHideDuration: 2000 });
            }
        });

        this.props.socket.on('gameOver', (winner) => {
            alert(`${this.props.room.players[winner].username} is the winner!`);
            this.props.updateStatus('home');
            this.props.resetRoom(this.props.room.roomId);
            // window.location.reload();
        });

        this.props.socket.on('disconnectedPlayer', (burden) => {
            alert(`${burden} disconnected. Moving back to home page...`);
            this.props.updateStatus('home');
            this.props.resetRoom(this.props.room.roomId);
            // window.location.reload();
        });


        this.props.socket.on('skipUsed', (playerIdx) => {
            this.props.enqueueSnackbar(`${this.props.room.players[playerIdx].username}'s turn will be skipped!`, { autoHideDuration: 2000 });
        });

        this.props.socket.on('removeUsed', ({ board, row, col }) => {
            this.props.enqueueSnackbar(`A symbol has been removed from board ${board}!`, { autoHideDuration: 2000 });
        });

        this.props.socket.on('bombUsed', () => {
            this.props.enqueueSnackbar(`A bomb has been planted!`, { autoHideDuration: 2000 });
        });

        this.props.socket.on('curseUsed', () => {
            this.props.enqueueSnackbar(`A curse has been applied!`, { autoHideDuration: 2000 });
        });
    }

    componentWillUnmount() {
        this.props.socket.off('newGameState');
        this.props.socket.off('boardOver');
        this.props.socket.off('gameOver');
        this.props.socket.off('disconnectedPlayer');
        this.props.socket.off('skipUsed');
        this.props.socket.off('removeUsed');
        this.props.socket.off('bombUsed');
        this.props.socket.off('curseUsed');
    }

    render() {
        return (
        <div className="game">
            <Players socket={this.props.socket} room={this.props.room} status={this.props.status} updateStatus={this.props.updateStatus} />
            <Inventory socket={this.props.socket} room={this.props.room} status={this.props.status} updateStatus={this.props.updateStatus} />
            <Boards socket={this.props.socket} room={this.props.room} status={this.props.status} updateStatus={this.props.updateStatus} />
        </div>
        );
    }
}

export default withSnackbar(Game)