import React from 'react'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Players from './Players'
import Inventory from './Inventory'
import Boards from './Boards'
import Logs from './Logs'
import ChatRoom from './ChatRoom'
import StaticBoard from './tictacfoe/StaticBoard'
import { withSnackbar } from 'notistack';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.pressLeave = this.pressLeave.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.closeLogs = this.closeLogs.bind(this);
        this.closeChat = this.closeChat.bind(this);
        this.addToLog = this.addToLog.bind(this);
        this.showNewMsg = this.showNewMsg.bind(this);
        this.state = {
            prevBoard: [],
            dialogOpen: false,
            winner: { },
            logs: [],
            logsOpen: false,
            hasNewMsg: false,
            chatOpen: false
        };
      }

    pressLeave() {
        this.props.resetRoom(this.props.room.roomId);
    }

    closeDialog() {
        this.setState({ dialogOpen: false });
    }

    closeLogs() {
        this.setState({ logsOpen: false });
    }

    closeChat() {
        this.setState({ chatOpen: false, hasNewMsg: false });
    }

    addToLog(msg) {
        this.setState({ logs: this.state.logs.concat(msg) });
    }

    showNewMsg() {
        this.setState({ hasNewMsg: true });
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
            this.addToLog(`You need to clear ${numBoards} ${board} to win the game!`);
        });

        this.props.socket.on('boardOver', (winner, prevBoard) => {
            if (winner > -1) {
                this.setState({ winner: this.props.room.players[winner], prevBoard: prevBoard, dialogOpen: true });
                this.addToLog(`${this.props.room.players[winner].username} cleared a board!`);
                // this.props.enqueueSnackbar(`${this.props.room.players[winner].username} cleared the board!`, { autoHideDuration: 2000 });
            }
        });

        this.props.socket.on('gameOver', (winner) => {
            this.setState({ winner: this.props.room.players[winner], prevBoard: [], dialogOpen: false });
            this.props.updateStatus('gameover');
            // this.props.resetRoom(this.props.room.roomId);
            // window.location.reload();
        });

        this.props.socket.on('disconnectedPlayer', (burden) => {
            this.props.enqueueSnackbar(`${burden} has disconnected.`, { autoHideDuration: 2000 });
            this.addToLog(`${burden} has disconnected.`);
            // alert(`${burden} disconnected. Moving back to home page...`);
            // this.props.resetRoom(this.props.room.roomId);
            // window.location.reload();
        });


        this.props.socket.on('skipUsed', ({ from, to, shield }) => {
            var fromName = this.props.room.players[from].username;
            var toName = this.props.room.players[to].username;
            var msg;
            if (shield) {
                msg = `${toName} was shielded from ${fromName}'s skip!`;
            } else {
                msg = `${fromName} skipped ${toName}'s turn!`;
            }
            this.props.enqueueSnackbar(msg, { autoHideDuration: 2000 });
            this.addToLog(msg);
        });

        this.props.socket.on('removeUsed', ({ board, symbol }) => {
            this.props.enqueueSnackbar(`${this.props.room.players[symbol].symbol} has been removed from board ${board + 1}!`, { autoHideDuration: 2000 });
            this.addToLog(`${this.props.room.players[symbol].symbol} has been removed from board ${board + 1}!`);
        });

        this.props.socket.on('randomizeReplaceUsed', ({ board, from, to }) => {
            this.props.enqueueSnackbar(`${this.props.room.players[from].symbol} has been replaced with ${this.props.room.players[to].symbol} on board ${board + 1}!`, { autoHideDuration: 2000 });
            this.addToLog(`${this.props.room.players[from].symbol} has been replaced with ${this.props.room.players[to].symbol} on board ${board + 1}!`);
        });

        this.props.socket.on('bombUsed', () => {
            this.props.enqueueSnackbar(`A bomb has been planted!`, { autoHideDuration: 2000 });
            this.addToLog(`A bomb has been planted!`);
        });

        this.props.socket.on('curseUsed', ({ from, to, shield }) => {
            var fromName = this.props.room.players[from].username;
            var toName = this.props.room.players[to].username;
            var msg;
            if (shield) {
                msg = `${toName} was shielded from ${fromName}'s curse!`;
            } else {
                msg = `A curse has been applied!`;
            }
            this.props.enqueueSnackbar(msg, { autoHideDuration: 2000 });
            this.addToLog(msg);
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
            <Dialog onClose={this.closeDialog} open={ this.state.dialogOpen }>
                    <div style={{ "fontSize": "20px" }}><center><b>{ this.state.winner.username }</b> won a board!</center></div>
                    <StaticBoard display="flex" justify-content="center" closeDialog={this.closeDialog} grid={ this.state.prevBoard } room={this.props.room} />
                    <center><i>Click outside to dismiss</i></center>
            </Dialog>
            <Logs onClose={this.closeLogs} open={ this.state.logsOpen } logs={ this.state.logs } />
            <ChatRoom socket={this.props.socket} roomId={this.props.room.roomId} onClose={this.closeChat} open={ this.state.chatOpen } showNewMsg={ this.showNewMsg } />
            <Players socket={this.props.socket} room={this.props.room} status={this.props.status} updateStatus={this.props.updateStatus} />
            <div>
            <Button style={{ 'marginRight': '5px' }} variant="outlined" onClick={() => this.setState({ logsOpen: true })}>
                    Check Logs
            </Button>
            <Button style={{ 'marginLeft': '5px' }} variant={ (this.state.hasNewMsg) ? "contained" : "outlined"} color={ (this.state.hasNewMsg) ? "primary" : "default"} onClick={() => this.setState({ chatOpen: true })}>
                    Open Chat
            </Button>
            </div>
            <br />
            <Inventory socket={this.props.socket} room={this.props.room} status={this.props.status} updateStatus={this.props.updateStatus} addToLog={this.addToLog} />
            {gameEnded}
            <Boards socket={this.props.socket} room={this.props.room} status={this.props.status} updateStatus={this.props.updateStatus} />
        </div>
        );
    }
}

export default withSnackbar(Game)