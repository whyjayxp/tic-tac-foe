import React from 'react';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import Badge from '@material-ui/core/Badge';
// import ToggleButton from '@material-ui/lab/ToggleButton';
// import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Checkbox from '@material-ui/core/Checkbox'
import FormGroup from '@material-ui/core/FormGroup'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { withSnackbar } from 'notistack';
import Rules from './Rules'
import ChatRoom from '../games/ChatRoom'

const MAX_BOARDS = 15;
const MAX_PLAYERS = 9;
const SYMBOLS = ['X', 'O', '@', '#', '$', '%', '&', 'A', 'Z']
const EMOJIS = ['🐶', '🐱', '🐷', '🐹', '🐰', '🦊', '🐻', '🐼', '🐯']

class Waiting extends React.Component {
  constructor(props) {
    super(props);
    this.pressStart = this.pressStart.bind(this);
    this.pressLeave = this.pressLeave.bind(this);
    this.closeChat = this.closeChat.bind(this);
    this.showNewMsg = this.showNewMsg.bind(this);
    this.state = {
      hasNewMsg: 0,
      chatOpen: false,
      concurBoards: 2,
      boardsToWin: 3,
      emojiMode: false,
      startingPowerup: false,
      teamMode: false,
      // team: 'X',
      publicRoom: false,
      maxPlayers: 9,
      powersToUse: new Array(11).fill(true)
    };
  }

  closeChat() {
    this.setState({ chatOpen: false, hasNewMsg: 0 });
  }

  showNewMsg() {
    if (this.state.chatOpen) return;
    this.setState({ hasNewMsg: this.state.hasNewMsg + 1 });
  }

  handleNumBoardsChange = (event) => {
      this.setState({ concurBoards: event.target.value });
      this.props.socket.emit('hostUpdate', this.props.room.roomId, { concurBoards: event.target.value });
  };

  handleNumWinningBoardsChange = (event) => {
      this.setState({ boardsToWin: event.target.value });
      this.props.socket.emit('hostUpdate', this.props.room.roomId, { boardsToWin: event.target.value });
  };

  handleEmojiModeChange = (event) => {
    this.setState({ emojiMode: event.target.checked });
    this.props.socket.emit('hostUpdate', this.props.room.roomId, { emojiMode: event.target.checked });
  }

  handleStartingPowerupChange = (event) => {
    this.setState({ startingPowerup: event.target.checked });
    this.props.socket.emit('hostUpdate', this.props.room.roomId, { startingPowerup: event.target.checked });
  }

  handleTeamModeChange = (event) => {
    this.setState({ teamMode: event.target.checked });
    this.props.socket.emit('hostUpdate', this.props.room.roomId, { teamMode: event.target.checked });
  }

  // handleTeamChange = (event, newVal) => {
  //   this.setState({ team: newVal });
  // }

  handlePublicRoomChange = (event) => {
    this.setState({ publicRoom: event.target.checked });
    this.props.socket.emit('hostUpdate', this.props.room.roomId, { publicRoom: event.target.checked });
  }

  handleMaxPlayersChange = (event) => {
    this.setState({ maxPlayers: event.target.value });
    this.props.socket.emit('hostUpdate', this.props.room.roomId, { maxPlayers: event.target.value });
  };

  handlePowerupChange = (event, i) => {
    // handle both skips together
    var newArr = this.state.powersToUse.map((x,j) => (i === j || (i === 0 && j === 6)) ? event.target.checked : x);
    this.setState({ powersToUse: newArr });
    this.props.socket.emit('hostUpdate', this.props.room.roomId, { powersToUse: newArr });
  }

  pressStart() {
    if (this.props.room.players.length < 2) {
      this.props.enqueueSnackbar("There must be at least 2 players to start!", { autoHideDuration: 3000 });
    } else {
      this.props.socket.emit('startGame', this.props.room.roomId, this.state.concurBoards, this.state.boardsToWin, this.state.emojiMode, this.state.startingPowerup, this.state.teamMode, this.state.powersToUse);
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

    this.props.socket.on('hostUpdated', (settings) => {
      this.setState(settings);
    });
  }

  componentWillUnmount() {
    this.props.socket.off('youAreTheHost');
    this.props.socket.off('updatePlayers');
    this.props.socket.off('startGame');
    this.props.socket.off('hostUpdated');
  }

  render() {
    // const teamSelection = (this.state.teamMode) ? (<ToggleButtonGroup
    //   value={this.state.team}
    //   exclusive
    //   onChange={this.handleTeamChange}
    //   aria-label="team">
    //   <ToggleButton value="X" aria-label="X"><b style={{ 'fontSize': '20px' }}>{ (this.state.emojiMode) ? EMOJIS[0] : SYMBOLS[0] }</b></ToggleButton>
    //   <ToggleButton value="O" aria-label="O"><b style={{ 'fontSize': '20px' }}>{ (this.state.emojiMode) ? EMOJIS[1] : SYMBOLS[1] }</b></ToggleButton>
    // </ToggleButtonGroup>) : null;
    const boardsMenuItems = []
    for (let i = 1; i <= MAX_BOARDS; i++) {
        boardsMenuItems.push(<MenuItem className="menuItem" key={i} value={i}>{i}</MenuItem>)
    }
    const playersMenuItems = []
    for (let i = 2; i <= MAX_PLAYERS; i++) {
        playersMenuItems.push(<MenuItem className="menuItem" key={i} value={i}>{i}</MenuItem>)
    }
    const listPlayers = this.props.room.players.map((player, i) =>
      <li key={player.username}><b>{ this.state.emojiMode ? EMOJIS[(this.state.teamMode ? i%2 : i)] : SYMBOLS[(this.state.teamMode ? i%2 : i)] }</b> {player.username} { (i === 0) ? "(Host)" : ""}</li>
    );
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
    const hostFeatures = (
      <form className="waiting" noValidate autoComplete="off">
          {/* <FormControl className={classes.formControl}> */}
          <b>Host Settings</b><span><i>{ (!this.props.room.isHost) ? "Only the host can modify these settings!" : "" }</i></span>
          <FormControl>
            <FormControlLabel
            control={
              <Switch
                checked={this.state.publicRoom}
                disabled={ !this.props.room.isHost }
                onChange={this.handlePublicRoomChange}
                color="default"
                name="publicRoom"
                inputProps={{ 'aria-label':  'primary checkbox' }}
              />
            }
            label={<span style={ {font: '14px Century Gothic, Futura, sans-serif'} }>Public Room</span>}
            />
          </FormControl><br />
          <FormControl>
            Maximum Players: <InputLabel id="demo-simple-select-label" />
            <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            disabled={ !this.props.room.isHost }
            value={this.state.maxPlayers}
            onChange={this.handleMaxPlayersChange}>
            {playersMenuItems}
            </Select>
          </FormControl>
          <br/>
          <FormControl>
            Concurrent Boards: <InputLabel id="demo-simple-select-label" />
            <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            disabled={ !this.props.room.isHost }
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
            disabled={ !this.props.room.isHost }
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
                disabled={ !this.props.room.isHost }
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
                checked={this.state.teamMode}
                disabled={ !this.props.room.isHost }
                onChange={this.handleTeamModeChange}
                color="default"
                name="team"
                inputProps={{ 'aria-label':  'primary checkbox' }}
              />
            }
            label={<span style={ {font: '14px Century Gothic, Futura, sans-serif'} }>Team Mode</span>}
            />
          </FormControl>
          <FormControl>
            <FormControlLabel
            control={
              <Switch
                checked={this.state.startingPowerup}
                disabled={ !this.props.room.isHost }
                onChange={this.handleStartingPowerupChange}
                color="default"
                name="startPower"
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
                control={<Checkbox color="default" disabled={ !this.props.room.isHost } />}
                label={<img src={`/images/${i}.svg`} alt={"home"} height={'20'} />}
                labelPlacement="bottom" />
              ))
              }
              </FormGroup>
            </FormControl>
          <br /><br />
        <Button variant="outlined" onClick={this.pressStart} disabled={ !this.props.room.isHost }>
            Start Game
        </Button>
    </form>
    );
    return (
      <div>
        <ChatRoom socket={this.props.socket} roomId={this.props.room.roomId} onClose={this.closeChat} open={ this.state.chatOpen } showNewMsg={ this.showNewMsg } />
        <div id="roomId">{ this.props.room.roomId }</div>
        <ul id="playerList">{ listPlayers }</ul>
        <div id="leaveRoomButton">
        <Button style={{ 'marginRight': '5px' }} variant="outlined" onClick={this.pressLeave}>
            Leave Room
        </Button>
        { newMsg }
        </div>
        { hostFeatures }
        <Rules />
      </div>
    );
  }
  
}

export default withSnackbar(Waiting);