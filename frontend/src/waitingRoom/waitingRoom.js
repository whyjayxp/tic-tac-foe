import React from 'react';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import { withSnackbar } from 'notistack';

const MAX_BOARDS = 15;

class Waiting extends React.Component {
  constructor(props) {
    super(props);
    this.pressStart = this.pressStart.bind(this);
    this.state = {
      concurBoards: 2,
      boardsToWin: 3
    };
  }

  handleNumBoardsChange = (event) => {
      this.setState({ concurBoards: event.target.value })
  };

  handleNumWinningBoardsChange = (event) => {
      this.setState({ boardsToWin: event.target.value })
  };

  pressStart() {
    if (this.props.room.players.length < 2) {
      this.props.enqueueSnackbar("There must be at least 2 players to start!");
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

    this.props.socket.on('startGame', (roomId, gameState) => {
      this.props.startGame(roomId, gameState);
    });
  }

  render() {
    const boardsMenuItems = []
    for (let i = 1; i < MAX_BOARDS; i++) {
        boardsMenuItems.push(<MenuItem className="menuItem" key={i} value={i}>{i}</MenuItem>)
    }
    const listPlayers = this.props.room.players.map((player) =>
      <li key={player.username}>{player.username}</li>
    );
    const hostFeatures = this.props.room.isHost ? (
      <form className="waiting" noValidate autoComplete="off">
          {/* <FormControl className={classes.formControl}> */}
          <b>Host Settings</b><br />
          <FormControl>
            Concurrent Boards: <InputLabel id="demo-simple-select-label" />
            <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={this.state.concurBoards}
            onChange={this.handleNumBoardsChange}>
            {boardsMenuItems}
            </Select>
          </FormControl>
          <br/>
          <FormControl>
            Boards to Win: <InputLabel id="demo-simple-select-label" />
            <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={this.state.boardsToWin}
            onChange={this.handleNumWinningBoardsChange}>
            {boardsMenuItems}
            </Select>
          </FormControl><br/>
        <Button variant="outlined" onClick={this.pressStart}>
            Start Game!
        </Button>
    </form>
    ) : null;
    return (
      <div>
        <div id="roomId">{ this.props.room.roomId }</div>
        <ul id="playerList">{ listPlayers }</ul>
        { hostFeatures }
        <div id="rules">
          <b>How To Play Tic Tac Foe</b>
          <ul id="rulesList">
            <li>Get 3 in a row to win a board</li>
            <li>Play multiple boards at the same time</li>
            <li>Win as many boards as possible</li>
            <li>Power-ups and traps are hidden on the board</li>
            <li>Play as many power-ups as you want per turn</li>
            <li><img src={`/images/0.svg`} alt={"home"} height={'20'} /> <b>Skip</b>: Next player loses a turn</li>
            <li><img src={`/images/1.svg`} alt={"home"} height={'20'} /> <b>Remove</b>: Remove an existing symbol from any board</li>
            <li><img src={`/images/2.svg`} alt={"home"} height={'20'} /> <b>Bomb</b>: Plant a hidden bomb that destroys the player's symbol)</li>
            <li><img src={`/images/3.svg`} alt={"home"} height={'20'} /> <b>Curse</b>: The next symbol the target places will be yours</li>
            <li><img src={`/images/clown.svg`} alt={"home"} height={'20'} /> <b>Joker</b>: Randomly places your symbol</li>
            <li><img src={`/images/mine.svg`} alt={"home"} height={'20'} /> <b>Bomb trap</b>: Destroys the symbol that you placed on it</li>
          </ul>
        </div>
      </div>
    );
  }
  
}

export default withSnackbar(Waiting);