import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Changelog from './Changelog'
import RefreshIcon from '@material-ui/icons/Refresh';
import { withSnackbar } from 'notistack';

class Create extends React.Component {
  constructor(props) {
    super(props);
    this.createRoom = this.createRoom.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.loadPublicRooms = this.loadPublicRooms.bind(this);
    this.state = {
      username: '',
      roomId: '',
      isHost: false,
      publicRooms: [] // array of { roomId, players, maxPlayers }
    };
  }

  _updateUsername(e) {
    this.setState({ username: e.target.value });
  }

  _updateRoomId(e) {
    this.setState({ roomId: e.target.value });
  }

  createRoom() {
    if (this.props.socket.disconnected) {
      this.props.enqueueSnackbar("Server is down! :(", { autoHideDuration: 3000, variant: 'error' });
      return;
    }
    const username = this.state.username;
    if (username === '') {
      this.props.enqueueSnackbar("Please input your name!", { autoHideDuration: 3000 });
      return;
    }
    this.setState({ isHost: true });
    this.props.socket.emit('createRoom', username);
  }

  joinRoom() {
    if (this.props.socket.disconnected) {
      this.props.enqueueSnackbar("Server is down! :(", { autoHideDuration: 3000, variant: 'error' });
      return;
    }
    const username = this.state.username;
    const roomId = this.state.roomId.toUpperCase();
    if (username === '') {
      this.props.enqueueSnackbar("Please input your name!", { autoHideDuration: 3000 });
      return;
    }
    if (roomId === '') {
      this.props.enqueueSnackbar("Please input a room ID!", { autoHideDuration: 3000 });
      return;
    }
    this.setState({ isHost: false });
    this.props.socket.emit('joinRoom', username, roomId);
  }

  loadPublicRooms() {
    this.props.socket.emit('getPublicRooms');
  }

  pressPublicRoom(roomId) {
    if (this.props.socket.disconnected) {
      this.props.enqueueSnackbar("Server is down! :(", { autoHideDuration: 3000, variant: 'error' });
      return;
    }
    const username = this.state.username;
    if (username === '') {
      this.props.enqueueSnackbar("Please input your name!", { autoHideDuration: 3000 });
      return;
    }
    this.setState({ isHost: false });
    this.props.socket.emit('joinRoom', username, roomId);
  }

  componentDidMount() {
    this.props.socket.on('errorJoiningRoom', (msg) => {
      this.props.enqueueSnackbar(msg, { autoHideDuration: 3000 });
    });

    this.props.socket.on('successJoiningRoom', (roomId, players) => {
      this.props.joinRoom(roomId, players, this.state.isHost);
    });

    this.props.socket.on('showPublicRooms', (roomList) => {
      this.setState({ publicRooms: roomList });
    });
  }

  componentWillUnmount() {
    this.props.socket.off('errorJoiningRoom');
    this.props.socket.off('successJoiningRoom');
    this.props.socket.off('showPublicRooms');
  }

  render() {
    const roomItems = this.state.publicRooms.map((room, idx) => (
      <Button onClick={() => this.pressPublicRoom(room.roomId)} key={idx}>
          <li id="roomList">
              <b>{room.roomId}</b> [{room.players}/{room.maxPlayers}] 
          </li>
      </Button>
          ));
    const publicRooms = (this.state.publicRooms.length > 0) ? (
        <ul>{roomItems}</ul>
    ) : (<div style={{ marginTop: '10px' }}><i>No rooms available :( Create one?</i></div>);
    return (
      <div>
        <div className="home">
            <img src={"/images/home.svg"} alt={"home"} height={'300'}/>
            <h1>Welcome To Tic Tac Foe!</h1>
        </div><br />
        <form className="create" noValidate autoComplete="off" onSubmit={(e) => e.preventDefault()}>
          <TextField inputProps={{ maxLength: 10 }} size="small" label="User Name" variant="filled" value={this.state.username} onChange={(e) => this._updateUsername(e)} onKeyDown={(e) => {if (e.key === "Enter") { this.createRoom() }}} />
          <Button style={{width:'150px'}} className="home-button" variant="outlined" onClick={this.createRoom}>
                Create Room
          </Button>
          </form>
          <form className="create" noValidate autoComplete="off" onSubmit={(e) => e.preventDefault()}>
          <TextField inputProps={{ maxLength: 4 }} size="small" label="Room Code" align-self="left" variant="filled" value={this.state.roomId} onChange={(e) => this._updateRoomId(e)} onKeyDown={(e) => {if (e.key === "Enter") { this.joinRoom() }}} />
            <Button style={{width:'150px'}} className="home-button" variant="outlined" onClick={this.joinRoom}>
                Join Room
            </Button>
        </form>
        <br />
        <div id="publicRooms">
          <b>Public Rooms</b> <Tooltip arrow title="Refresh List"><RefreshIcon onClick={this.loadPublicRooms} style={{ verticalAlign: 'bottom' }} /></Tooltip>
          { publicRooms }
        </div>
        <br />
        <center>Created by <a target="_blank" rel="noreferrer" href="https://github.com/whyjayxp">Yue Jun</a> & <a target="_blank" rel="noreferrer" href="https://github.com/qing-yuan">Qing Yuan</a> for HackNRoll 2021</center>
        <Changelog />
      </div>
    );
  }
  
}

export default withSnackbar(Create);