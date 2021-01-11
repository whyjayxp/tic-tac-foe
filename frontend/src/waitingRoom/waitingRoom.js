import React from 'react';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Checkbox from '@material-ui/core/Checkbox'
import FormGroup from '@material-ui/core/FormGroup'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { withSnackbar } from 'notistack';
import Rules from './Rules'

const MAX_BOARDS = 15;

class Waiting extends React.Component {
  constructor(props) {
    super(props);
    this.pressStart = this.pressStart.bind(this);
    this.pressLeave = this.pressLeave.bind(this);
    this.state = {
      concurBoards: 2,
      boardsToWin: 3,
      emojiMode: false,
      startingPowerup: false,
      powersToUse: new Array(11).fill(true)
    };
  }

  handleNumBoardsChange = (event) => {
      this.setState({ concurBoards: event.target.value })
  };

  handleNumWinningBoardsChange = (event) => {
      this.setState({ boardsToWin: event.target.value })
  };

  handleEmojiModeChange = (event) => {
    this.setState({ emojiMode: event.target.checked })
  }

  handleStartingPowerupChange = (event) => {
    this.setState({ startingPowerup: event.target.checked })
  }

  handlePowerupChange = (event, i) => {
    // handle both skips together
    this.setState({ powersToUse: this.state.powersToUse.map((x,j) => (i === j || (i === 0 && j === 6)) ? event.target.checked : x) })
  }

  pressStart() {
    if (this.props.room.players.length < 2) {
      this.props.enqueueSnackbar("There must be at least 2 players to start!", { autoHideDuration: 2000 });
    } else {
      this.props.socket.emit('startGame', this.props.room.roomId, this.state.concurBoards, this.state.boardsToWin, this.state.emojiMode, this.state.startingPowerup, this.state.powersToUse);
    }
  }

  pressLeave() {
    this.props.resetRoom(this.props.room.roomId);
    // window.location.reload();
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

  componentWillUnmount() {
    this.props.socket.off('youAreTheHost');
    this.props.socket.off('updatePlayers');
    this.props.socket.off('startGame');
  }

  render() {
    const boardsMenuItems = []
    for (let i = 1; i <= MAX_BOARDS; i++) {
        boardsMenuItems.push(<MenuItem className="menuItem" key={i} value={i}>{i}</MenuItem>)
    }
    const listPlayers = this.props.room.players.map((player, i) =>
      <li key={player.username}>{player.username} { (i === 0) ? "(Host)" : ""}</li>
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
          </FormControl>
          <br/>
          <FormControl>
            <FormControlLabel
            control={
              <Switch
                checked={this.state.emojiMode}
                onChange={this.handleEmojiModeChange}
                color="default"
                name="emoji"
                inputProps={{ 'aria-label':  'primary checkbox' }}
              />
            }
            label={<span style={ {font: '14px Century Gothic, Futura, sans-serif'} }>Emoji Mode</span>}
            />
          </FormControl>
          <FormControl>
            <FormControlLabel
            control={
              <Switch
                checked={this.state.startingPowerup}
                onChange={this.handleStartingPowerupChange}
                color="default"
                name="emoji"
                inputProps={{ 'aria-label':  'primary checkbox' }}
              />
            }
            label={<span style={ {font: '14px Century Gothic, Futura, sans-serif'} }>Starting Powerup</span>}
            />
          </FormControl><br />
          <FormControl>
            <center>Powerups In Game</center>
            <FormGroup aria-label="position" row>
              {
              Array.apply(0, Array(11)).map((x,i) => (
                (i === 6) ? null :
              <FormControlLabel
                key={i}
                style={{ margin: '5px' }}
                checked={this.state.powersToUse[i]}
                onChange={(e) => this.handlePowerupChange(e, i)}
                control={<Checkbox color="default" />}
                label={<img src={`/images/${i}.svg`} alt={"home"} height={'20'} />}
                labelPlacement="bottom" />
              ))
              }
              </FormGroup>
            </FormControl>
          <br /><br />
        <Button variant="outlined" onClick={this.pressStart}>
            Start Game
        </Button>
    </form>
    ) : null;
    return (
      <div>
        <div id="roomId">{ this.props.room.roomId }</div>
        <ul id="playerList">{ listPlayers }</ul>
        <div id="leaveRoomButton">
        <Button variant="outlined" onClick={this.pressLeave}>
            Leave Room
        </Button>
        </div>
        { hostFeatures }
        <Rules />
      </div>
    );
  }
  
}

export default withSnackbar(Waiting);