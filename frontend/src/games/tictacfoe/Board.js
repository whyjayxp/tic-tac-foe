import React from 'react'
import Square from './Square'

function calculateWinner(squares) {
    const line = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

    for (let i = 0; i < line.length; i++) {
        const [a, b, c] = line[i]
        if (squares[a] !== null && squares[b] === squares[a] && squares[c] === squares[a]) {
            return squares[a]
        }
    }

    return null
}
  
class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            symbols: ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],
            xIsNext: true

        }
    }

    handleClick(i) {
        const squares = this.state.squares.slice();
        squares[i] = this.state.xIsNext ? 'X' : 'O'
        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext
        })
    }

    renderSquare(i) {
        return <Square 
            value={this.state.squares[i]}
            onClick={() => this.handleClick(i)}
        />;
    }

    render() {
        const winner = calculateWinner(this.state.squares)
        let status
        if (winner !== null) {
            status = "Winner: " + winner
        } else {
            status = 'Next player: ' + (this.state.xIsNext? 'X' : 'O')
        }

        return (
        <div>
            <div className="status">{status}</div>
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

export default Board