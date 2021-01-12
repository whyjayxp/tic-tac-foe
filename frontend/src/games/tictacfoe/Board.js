import React from 'react'
import Square from './Square'
import { withSnackbar } from 'notistack';

const CHECKS = [  // only for 3x3
    [[0,0], [0,1], [0,2]], [[1,0], [1,1], [1,2]], [[2,0], [2,1], [2,2]], // rows
    [[0,0], [1,0], [2,0]], [[0,1], [1,1], [2,1]], [[0,2], [1,2], [2,2]], // cols
    [[0,0], [1,1], [2,2]], [[0,2], [1,1], [2,0]] // diagonals
];
  
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
                this.props.enqueueSnackbar(`This box is already taken!`, { autoHideDuration: 3000 });
            }
        } else if (this.props.status === 'use_power_1') { // remove piece
            // if (hasSymbol) {
                this.props.socket.emit('usePowerup', this.props.room.roomId, 1, { board: this.props.idx, row, col });
                this.props.updateStatus('turn');
            // } else {
            //     this.props.enqueueSnackbar(`This box has no symbol to remove!`, { autoHideDuration: 3000 });
            // }
        } else if (this.props.status === 'use_power_2') { // plant bomb
            if (!hasSymbol) {
                this.props.socket.emit('usePowerup', this.props.room.roomId, 2, { board: this.props.idx, row, col });
                this.props.updateStatus('turn');
            } else {
                this.props.enqueueSnackbar(`Bomb must be planted on an empty box!`, { autoHideDuration: 3000 });
            }
        } else if (this.props.status === 'use_power_7') { // randomize replace
            // if (hasSymbol) {
                this.props.socket.emit('usePowerup', this.props.room.roomId, 7, { board: this.props.idx, row, col });
                this.props.updateStatus('turn');
            // } else {
            //     this.props.enqueueSnackbar(`This box has no symbol to randomly replace!`, { autoHideDuration: 3000 });
            // }
        } else if (this.props.status === 'use_power_8') { // unbox the box
            if (!hasSymbol) {
                this.props.socket.emit('usePowerup', this.props.room.roomId, 8, { board: this.props.idx, row, col });
                this.props.updateStatus('turn');
            } else {
                this.props.enqueueSnackbar(`You can only unbox a box without a symbol!`, { autoHideDuration: 3000 });
            }
        }
    }

    renderSquare(i, isWin) {
        var board = this.props.room.boards[this.props.idx];
        const symbols = this.props.room.players.map(player => player.symbol);
        const row = Math.floor(i / 3);
        const col = i % 3;
        return <Square isWin={isWin}
            value={symbols[board[row][col]]}
            onClick={() => this.handleClick(i)}
        />;
    }

    getWinningLine() {
        var board = this.props.room.boards[this.props.idx];
        for (var i = 0; i < CHECKS.length; i++) {
            var toCheck = CHECKS[i];
            if (board[toCheck[0][0]][toCheck[0][1]] === board[toCheck[1][0]][toCheck[1][1]] &&
                board[toCheck[1][0]][toCheck[1][1]] === board[toCheck[2][0]][toCheck[2][1]]) {
                    if (board[toCheck[0][0]][toCheck[0][1]] !== -1) {
                        return [toCheck[0][0] * 3 + toCheck[0][1], toCheck[1][0] * 3 + toCheck[1][1], toCheck[2][0] * 3 + toCheck[2][1]];
                    }
                }
        }
        return [];
    }

    render() {
        const winLine = this.getWinningLine();

        return (
        <div id="big-board">
            <div className="board-row">
            {this.renderSquare(0, winLine.includes(0))}
            {this.renderSquare(1, winLine.includes(1))}
            {this.renderSquare(2, winLine.includes(2))}
            </div>
            <div className="board-row">
            {this.renderSquare(3, winLine.includes(3))}
            {this.renderSquare(4, winLine.includes(4))}
            {this.renderSquare(5, winLine.includes(5))}
            </div>
            <div className="board-row">
            {this.renderSquare(6, winLine.includes(6))}
            {this.renderSquare(7, winLine.includes(7))}
            {this.renderSquare(8, winLine.includes(8))}
            </div>
        </div>
        );
    }
}

export default withSnackbar(Board);