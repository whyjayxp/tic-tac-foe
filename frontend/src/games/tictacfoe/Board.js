import React from 'react'
import Square from './Square'
import { withSnackbar } from 'notistack';
  
class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    
    handleClick(i) {
        var board = this.props.room.boards[this.props.idx];
        const row = Math.floor(i / 3);
        const col = i % 3;
        const hasSymbol = board[row][col] > -1;
        if (this.props.status === 'turn') {
            if (!hasSymbol) {
                this.props.socket.emit('chooseGrid', this.props.room.roomId, { board: this.props.idx, row, col });
                this.props.updateStatus('game');
            } else {
                this.props.enqueueSnackbar(`This box is already taken!`, { autoHideDuration: 2000 });
            }
        } else if (this.props.status === 'use_power_1') { // remove piece
            // if (hasSymbol) {
                this.props.socket.emit('usePowerup', this.props.room.roomId, 1, { board: this.props.idx, row, col });
                this.props.updateStatus('turn');
            // } else {
            //     this.props.enqueueSnackbar(`This box has no symbol to remove!`, { autoHideDuration: 2000 });
            // }
        } else if (this.props.status === 'use_power_2') { // plant bomb
            if (!hasSymbol) {
                this.props.socket.emit('usePowerup', this.props.room.roomId, 2, { board: this.props.idx, row, col });
                this.props.updateStatus('turn');
            } else {
                this.props.enqueueSnackbar(`Bomb must be planted on an empty box!`, { autoHideDuration: 2000 });
            }
        }
    }

    renderSquare(i) {
        var board = this.props.room.boards[this.props.idx];
        const symbols = this.props.room.players.map(player => player.symbol);
        const row = Math.floor(i / 3);
        const col = i % 3;
        return <Square 
            value={symbols[board[row][col]]}
            onClick={() => this.handleClick(i)}
        />;
    }

    render() {
        return (
        <div id="big-board">
            <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
            </div>
            <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
            </div>
            <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
            </div>
        </div>
        );
    }
}

export default withSnackbar(Board);