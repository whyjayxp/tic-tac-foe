import React from 'react'
import Square from './Square'

const CHECKS = [  // only for 3x3
    [[0,0], [0,1], [0,2]], [[1,0], [1,1], [1,2]], [[2,0], [2,1], [2,2]], // rows
    [[0,0], [1,0], [2,0]], [[0,1], [1,1], [2,1]], [[0,2], [1,2], [2,2]], // cols
    [[0,0], [1,1], [2,2]], [[0,2], [1,1], [2,0]] // diagonals
];
  
class StaticBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    renderSquare(i, isWin) {
        var board = this.props.grid;
        const symbols = this.props.room.players.map(player => player.symbol);
        const row = Math.floor(i / 3);
        const col = i % 3;
        return <Square isWin={isWin}
            value={symbols[board[row][col]]} onClick={this.props.closeDialog}
        />;
    }

    getWinningLine() {
        var board = this.props.grid;
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
        console.log(this.props);
        if (this.props.grid === undefined || this.props.grid.length === 0) return null;
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

export default StaticBoard;