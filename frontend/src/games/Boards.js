import React from 'react'
import Board from './tictacfoe/Board'

class Boards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    // const symbols = this.props.room.players.map(player => player.symbol);
    const boards = this.props.room.boards.map((board, idx) =>
    <span>
      <Board display="flex" justify-content="center" key={idx} idx={idx} socket={this.props.socket} room={this.props.room} status={this.props.status} updateStatus={this.props.updateStatus} />
    <br /></span>
    );
    return (
      <div id="boardsList">
        { boards }
      </div>
    );
  }
}

export default Boards