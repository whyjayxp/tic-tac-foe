import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withSnackbar } from 'notistack';

class Create extends React.Component {
  constructor(props) {
    super(props);
    this.createRoom = this.createRoom.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.state = {
      username: '',
      roomId: '',
      isHost: false
    };
  }

  _updateUsername(e) {
    this.setState({ username: e.target.value });
  }

  _updateRoomId(e) {
    this.setState({ roomId: e.target.value });
  }

  createRoom() {
    const username = this.state.username;
    if (username === '') {
      this.props.enqueueSnackbar("Please input your name!", { autoHideDuration: 2000 });
      return;
    }
    this.setState({ isHost: true });
    this.props.socket.emit('createRoom', username);
  }

  joinRoom() {
    const username = this.state.username;
    const roomId = this.state.roomId.toUpperCase();
    if (username === '') {
      this.props.enqueueSnackbar("Please input your name!", { autoHideDuration: 2000 });
      return;
    }
    if (roomId === '') {
      this.props.enqueueSnackbar("Please input a room ID!", { autoHideDuration: 2000 });
      return;
    }
    this.setState({ isHost: false });
    this.props.socket.emit('joinRoom', username, roomId);
  }

  componentDidMount() {
    this.props.socket.on('errorJoiningRoom', (msg) => {
      this.props.enqueueSnackbar(msg, { autoHideDuration: 2000 });
    });

    this.props.socket.on('successJoiningRoom', (roomId, players) => {
      this.props.joinRoom(roomId, players, this.state.isHost);
    });
  }

  componentWillUnmount() {
    this.props.socket.off('errorJoiningRoom');
    this.props.socket.off('successJoiningRoom');
  }

  render() {
    return (
      <div>
        <div className="home">
            <img src={"/images/home.svg"} alt={"home"} height={'300'}/>
            <h1>Welcome To Tic Tac Foe!</h1>
        </div>
        <form className="create" noValidate autoComplete="off" onSubmit={(e) => e.preventDefault()}>
          <TextField size="small" placeholder="User Name" variant="outlined" value={this.state.username} onChange={(e) => this._updateUsername(e)} onKeyDown={(e) => {if (e.key === "Enter") { this.createRoom() }}} />
          <Button className="home-button" variant="outlined" onClick={this.createRoom}>
                Create Room!
          </Button>
          </form>
          <br/>
          <form className="create" noValidate autoComplete="off" onSubmit={(e) => e.preventDefault()}>
          <TextField size="small" placeholder="Room Code" align-self="left" variant="outlined" value={this.state.roomId} onChange={(e) => this._updateRoomId(e)} onKeyDown={(e) => {if (e.key === "Enter") { this.joinRoom() }}} />
            <Button className="home-button" variant="outlined" onClick={this.joinRoom}>
                Join Room!
            </Button>
        </form>
      </div>
    );
  }
  
}

export default withSnackbar(Create);