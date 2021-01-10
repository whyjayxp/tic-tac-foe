import React from 'react'
import Button from '@material-ui/core/Button';
import Players from './Players'
import Inventory from './Inventory'
import Boards from './Boards'
import { withSnackbar } from 'notistack';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.pressLeave = this.pressLeave.bind(this);
        this.state = {
            winner: { }
        };
      }

    pressLeave() {
        this.props.resetRoom(this.props.room.roomId);
    }

    componentDidMount() {
        this.props.socket.on('newGameState', (roomId, gameState) => {
          var room = {roomId, players: gameState.players, boards: gameState.boards, turn: gameState.turn};
          this.props.updateRoom(room);
        });

        this.props.socket.on('itsYourTurn', () => {
            this.props.updateStatus('turn');
            this.props.enqueueSnackbar('It\'s your turn!', { autoHideDuration: 2000 });
          });

        this.props.socket.on('numBoardsToWin', (numBoards) => {
            var board = (numBoards === 1) ? "board" : "boards";
            this.props.enqueueSnackbar(`You need to clear ${numBoards} ${board} to win the game!`, { autoHideDuration: 5000, variant: 'info' });
        });

        this.props.socket.on('boardOver', (winner) => {
            if (winner > -1) {
                this.props.enqueueSnackbar(`${this.props.room.players[winner].username} cleared the board!`, { autoHideDuration: 2000 });
            }
        });

        this.props.socket.on('gameOver', (winner) => {
            this.setState({ winner: this.props.room.players[winner] });
            this.props.updateStatus('gameover');
            // this.props.resetRoom(this.props.room.roomId);
            // window.location.reload();
        });

        this.props.socket.on('disconnectedPlayer', (burden) => {
            alert(`${burden} disconnected. Moving back to home page...`);
            this.props.resetRoom(this.props.room.roomId);
            // window.location.reload();
        });


        this.props.socket.on('skipUsed', (playerIdx) => {
            this.props.enqueueSnackbar(`${this.props.room.players[playerIdx].username}'s turn will be skipped!`, { autoHideDuration: 2000 });
        });

        this.props.socket.on('removeUsed', ({ board, row, col }) => {
            this.props.enqueueSnackbar(`A symbol has been removed from board ${board + 1}!`, { autoHideDuration: 2000 });
        });

        this.props.socket.on('randomizeReplaceUsed', ({ board, from, to }) => {
            this.props.enqueueSnackbar(`${this.props.room.players[from].symbol} has been replaced with ${this.props.room.players[to].symbol} on board ${board + 1}!`, { autoHideDuration: 2000 });
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
        this.props.socket.off('itsYourTurn');
        this.props.socket.off('numBoardsToWin');
        this.props.socket.off('boardOver');
        this.props.socket.off('gameOver');
        this.props.socket.off('disconnectedPlayer');
        this.props.socket.off('skipUsed');
        this.props.socket.off('removeUsed');
        this.props.socket.off('randomizeReplaceUsed');
        this.props.socket.off('bombUsed');
        this.props.socket.off('curseUsed');
    }

    render() {
        const gameEnded = (this.props.status === "gameover" && this.state.winner !== null) ? (
            <div id="gameOver">
                <b>Game Over</b><br />
                The winner is
                <div id="winnerGrid">
                    <div id="playerSymbol">{this.state.winner.symbol}</div> 
                    <div>{this.state.winner.username}</div> 
                </div><br />
                <Button variant="contained" onClick={this.pressLeave}>
                    Back to Home
                </Button><br />
            </div>
        ) : null;
        return (
        <div className="game">
            <Players socket={this.props.socket} room={this.props.room} status={this.props.status} updateStatus={this.props.updateStatus} />
            <Inventory socket={this.props.socket} room={this.props.room} status={this.props.status} updateStatus={this.props.updateStatus} />
            {gameEnded}
            <Boards socket={this.props.socket} room={this.props.room} status={this.props.status} updateStatus={this.props.updateStatus} />
        </div>
        );
    }
}

export default withSnackbar(Game)