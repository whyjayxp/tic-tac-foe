import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class Waiting extends React.Component {
  constructor(props) {
    super(props);
    this.pressStart = this.pressStart.bind(this);
    this.state = {
      concurBoards: 2,
      boardsToWin: 3
    };
  }

  pressStart() {
    if (this.props.room.players.length < 2) {
      alert("There must be at least 2 players to start!");
    } else {
      this.props.socket.emit('startGame', this.props.room.roomId, this.state.concurBoards, this.state.boardsToWin);
    }
  }

  componentDidMount() {
    this.props.socket.on('youAreTheHost', () => {
      const roomId = this.props.room.roomId;
      const players = this.props.room.players;
      this.props.updateRoom({ roomId, players, isHost: true });
    });

    this.props.socket.on('updatePlayers', (roomId, players) => {
      const isHost = this.props.room.isHost;
      this.props.updateRoom({ roomId, players, isHost });
    });

    this.props.socket.on('startGame', (roomId, players) => {
      this.props.startGame(roomId, players);
    });
  }

  render() {
    const listPlayers = this.props.room.players.map((player) =>
      <li>{player.username}</li>
    );
    const hostFeatures = this.props.room.isHost ? (
      <form className="create" noValidate autoComplete="off">
      {/* <TextField id="outlined-basic" label="User Name" variant="outlined" /> */}
      <TextField id="outlined-basic" label="Number of Boards" variant="outlined" />
      <TextField id="outlined-basic" label="Number of Boards to Win" variant="outlined" />
      {/* <TextField id="outlined-basic" label="Enter Room Code" variant="outlined" /> */}
        <Button className="home-button" onClick={this.pressStart}>
            Start Game!
        </Button>
    </form>
    ) : null;
    return (
      <div>
        <b>{ this.props.room.roomId }</b>
        <ul>{ listPlayers }</ul>
        { hostFeatures }
      </div>
    );
  }
  
}

export default Waiting