import React from 'react'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Badge from '@material-ui/core/Badge';
import Players from './Players'
import Inventory from './Inventory'
import Boards from './Boards'
import Logs from './Logs'
import Rules from '../waitingRoom/Rules'
import ChatRoom from './ChatRoom'
import StaticBoard from './tictacfoe/StaticBoard'
import { withSnackbar } from 'notistack';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.pressLeave = this.pressLeave.bind(this);
        this.pressPlayAgain = this.pressPlayAgain.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.closeLogs = this.closeLogs.bind(this);
        this.closeRules = this.closeRules.bind(this);
        this.closeChat = this.closeChat.bind(this);
        this.addToLog = this.addToLog.bind(this);
        this.showNewMsg = this.showNewMsg.bind(this);
        this.state = {
            prevBoard: [],
            dialogOpen: false,
            winner: null,
            logs: [],
            logsOpen: false,
            rulesOpen: false,
            hasNewMsg: 0,
            chatOpen: false,
            lightUp: null
        };
      }

    pressLeave() {
        this.props.resetRoom(this.props.room.roomId);
    }

    pressPlayAgain() {
        this.props.socket.emit('playAgain', this.props.room.roomId);
    }

    closeDialog() {
        this.setState({ dialogOpen: false });
    }

    closeLogs() {
        this.setState({ logsOpen: false });
    }

    closeRules() {
        this.setState({ rulesOpen: false });
    }


    closeChat() {
        this.setState({ chatOpen: false, hasNewMsg: 0 });
    }

    addToLog(msg) {
        this.setState({ logs: this.state.logs.concat(msg) });
    }

    showNewMsg() {
        if (this.state.chatOpen) return;
        this.setState({ hasNewMsg: this.state.hasNewMsg + 1 });
    }

    componentDidMount() {
        this.props.socket.on('errorRejoiningRoom', (msg) => {
            this.props.enqueueSnackbar(msg, { autoHideDuration: 3000 });
          });
      
          this.props.socket.on('successRejoiningRoom', (roomId, players, isHost) => {
            this.props.joinRoom(roomId, players, isHost);
          });

        this.props.socket.on('newGameState', (roomId, gameState, info) => {
          var room = {roomId, players: gameState.players, boards: gameState.boards, turn: gameState.turn};
          this.setState({ lightUp: info });
          this.props.updateRoom(room);
        });

        this.props.socket.on('itsYourTurn', () => {
            this.props.updateStatus('turn');
            this.props.enqueueSnackbar('It\'s your turn!', { autoHideDuration: 3000 });
          });

        this.props.socket.on('numBoardsToWin', (numBoards) => {
            var board = (numBoards === 1) ? "board" : "boards";
            this.props.enqueueSnackbar(`You need to clear ${numBoards} ${board} to win the game!`, { autoHideDuration: 5000, variant: 'info' });
            this.addToLog(`You need to clear ${numBoards} ${board} to win the game!`);
        });

        this.props.socket.on('boardOver', (winner, boardNum, prevBoard) => {
            if (winner !== '') {
                this.setState({ winner: winner, prevBoard: prevBoard, dialogOpen: true });
                this.addToLog(`${winner} won board ${ boardNum + 1 }!`);
            } else {
                this.props.enqueueSnackbar(`Board ${ boardNum + 1 } was cleared without any winner.`, { autoHideDuration: 3000 });
                this.addToLog(`Board ${ boardNum + 1 } was cleared without any winner.`);
            }
        });

        this.props.socket.on('gameOver', (winner) => {
            this.setState({ winner: winner, prevBoard: [], dialogOpen: false });
            this.props.updateStatus('gameover');
            // this.props.resetRoom(this.props.room.roomId);
            // window.location.reload();
        });

        this.props.socket.on('disconnectedPlayer', (burden) => {
            this.props.enqueueSnackbar(`${burden} has disconnected.`, { autoHideDuration: 3000 });
            this.addToLog(`${burden} has disconnected.`);
            // alert(`${burden} disconnected. Moving back to home page...`);
            // this.props.resetRoom(this.props.room.roomId);
            // window.location.reload();
        });

        this.props.socket.on('playerLeft', (burden) => {
            this.props.enqueueSnackbar(`${burden} has left the room.`, { autoHideDuration: 3000 });
            this.addToLog(`${burden} has left the room.`);
        });

        this.props.socket.on('skipUsed', ({ from, to, shield, deflect }) => {
            var fromName = this.props.room.players[from].username;
            var toName = this.props.room.players[to].username;
            var msg;
            if (deflect) {
                msg = `${toName} deflected ${fromName}'s skip!`;
            } else if (shield) {
                msg = `${toName} was shielded from ${fromName}'s skip!`;
            } else {
                msg = `${fromName} skipped ${toName}'s turn!`;
            }
            this.props.enqueueSnackbar(msg, { autoHideDuration: 3000 });
            this.addToLog(msg);
        });

        this.props.socket.on('removeUsed', ({ board, symbol }) => {
            this.props.enqueueSnackbar(`${symbol} has been removed from board ${board + 1}!`, { autoHideDuration: 3000 });
            this.addToLog(`${symbol} has been removed from board ${board + 1}!`);
        });

        this.props.socket.on('randomizeReplaceUsed', ({ board, from, to }) => {
            this.props.enqueueSnackbar(`${from} has been replaced with ${to} on board ${board + 1}!`, { autoHideDuration: 3000 });
            this.addToLog(`${from} has been replaced with ${to} on board ${board + 1}!`);
        });

        this.props.socket.on('bombUsed', () => {
            this.props.enqueueSnackbar(`A bomb has been planted!`, { autoHideDuration: 3000 });
            this.addToLog(`A bomb has been planted!`);
        });

        this.props.socket.on('curseUsed', ({ from, to, shield, deflect }) => {
            var fromName = this.props.room.players[from].username;
            var toName = this.props.room.players[to].username;
            var msg;
            if (deflect) {
                msg = `${toName} deflected ${fromName}'s curse!`;
            } else if (shield) {
                msg = `${toName} was shielded from ${fromName}'s curse!`;
            } else {
                msg = `A curse has been applied!`;
            }
            this.props.enqueueSnackbar(msg, { autoHideDuration: 3000 });
            this.addToLog(msg);
        });
    }

    componentWillUnmount() {
        this.props.socket.off('errorRejoiningRoom');
        this.props.socket.off('successRejoiningRoom');
        this.props.socket.off('newGameState');
        this.props.socket.off('itsYourTurn');
        this.props.socket.off('numBoardsToWin');
        this.props.socket.off('boardOver');
        this.props.socket.off('gameOver');
        this.props.socket.off('disconnectedPlayer');
        this.props.socket.off('playerLeft');
        this.props.socket.off('skipUsed');
        this.props.socket.off('removeUsed');
        this.props.socket.off('randomizeReplaceUsed');
        this.props.socket.off('bombUsed');
        this.props.socket.off('curseUsed');
    }

    render() {
        const winners = (this.props.status === "gameover" && this.state.winner !== null) ? 
            this.props.room.players.filter(x => x.symbol === this.state.winner).map((player, idx) => (
                <Button key={idx}>
                    <li id="winnerGrid">
                        <div id="playerSymbol">{player.symbol}</div> 
                        <div>{player.username}</div> 
                    </li>
                </Button>
            )) : null;
        const gameEnded = (this.props.status === "gameover" && this.state.winner !== null) ? (
            <div id="gameOver">
                <b>Game Over</b><br />
                Congratulations to the { this.props.room.players.filter(x => x.symbol === this.state.winner).length > 1 ? "winners" : "winner" }!
                <ul>{ winners }</ul><br />
                <div>
                <Button variant="contained" style={{ 'marginRight': '5px' }} onClick={this.pressPlayAgain}>
                    Play Again
                </Button>
                <Button variant="contained" style={{ 'marginLeft': '5px' }} onClick={this.pressLeave}>
                    Back to Home
                </Button>
                </div><br />
            </div>
        ) : null;
        const newMsg = (this.state.hasNewMsg === 0) ? (
            <Button style={{ 'marginLeft': '5px' }} variant="outlined" color="default" onClick={() => this.setState({ chatOpen: true, hasNewMsg: 0 })}>
                    Open Chat
            </Button>
        ) : (
            <Badge badgeContent={this.state.hasNewMsg} color="error">
                <Button style={{ 'marginLeft': '5px' }} variant="contained" color="primary" onClick={() => this.setState({ chatOpen: true, hasNewMsg: 0 })}>
                        Open Chat
                </Button>
            </Badge>
        );
        return (
        <div className="game">
            <Dialog onClose={this.closeDialog} open={ this.state.dialogOpen }>
                    <div style={{ "fontSize": "20px" }}><center><b>{ this.state.winner }</b> won a board!</center></div>
                    <StaticBoard display="flex" justify-content="center" closeDialog={this.closeDialog} grid={ this.state.prevBoard } room={this.props.room} />
                    <center><i>Click outside to dismiss</i></center>
            </Dialog>
            <Logs onClose={this.closeLogs} open={ this.state.logsOpen } logs={ this.state.logs } />
            <Dialog onClose={this.closeRules} open={ this.state.rulesOpen }>
                    <Rules />
                    <center><i>Click outside to dismiss</i></center>
            </Dialog>
            <ChatRoom socket={this.props.socket} roomId={this.props.room.roomId} onClose={this.closeChat} open={ this.state.chatOpen } showNewMsg={ this.showNewMsg } />
            <Players socket={this.props.socket} room={this.props.room} status={this.props.status} updateStatus={this.props.updateStatus} />
            <div>
            <Button style={{ 'marginRight': '5px' }} variant="outlined" onClick={() => this.setState({ logsOpen: true })}>
                    Logs
            </Button>
            <Button style={{ 'marginRight': '5px', 'marginLeft': '5px' }} variant="outlined" onClick={() => this.setState({ rulesOpen: true })}>
                    Rules
            </Button>
            { newMsg }
            </div>
            <br />
            <Inventory socket={this.props.socket} room={this.props.room} status={this.props.status} updateStatus={this.props.updateStatus} addToLog={this.addToLog} />
            {gameEnded}
            <Boards socket={this.props.socket} room={this.props.room} status={this.props.status} updateStatus={this.props.updateStatus} lightUp={this.state.lightUp} />
        </div>
        );
    }
}

export default withSnackbar(Game)