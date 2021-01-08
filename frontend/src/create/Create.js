import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

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
      alert("Please input your name!");
      return;
    }
    this.setState({ isHost: true });
    this.props.socket.emit('createRoom', username);
  }

  joinRoom() {
    const username = this.state.username;
    const roomId = this.state.roomId;
    if (username === '') {
      alert("Please input your name!");
      return;
    }
    if (roomId === '') {
      alert("Please input a room ID!");
      return;
    }
    this.setState({ isHost: false });
    this.props.socket.emit('joinRoom', username, roomId);
  }

  componentDidMount() {
    this.props.socket.on('errorJoiningRoom', (msg) => {
      alert(msg);
    });

    this.props.socket.on('successJoiningRoom', (roomId, players) => {
      alert(`Joined ${roomId}!`);
      this.props.joinRoom(roomId, players, this.state.isHost);
    });
  }

  render() {
    return (
      <div>
        <div className="home">
            <img src={"/images/home.svg"} alt={"home"} height={'300'}/>
            <h1>Welcome To Tic Tac Foe!</h1>
        </div>
        <form className="create" noValidate autoComplete="off">
          <TextField id="outlined-basic" label="User Name" variant="outlined" value={this.state.username} onChange={(e) => this._updateUsername(e)} />
          <TextField id="outlined-basic" label="Enter Room Code" variant="outlined" value={this.state.roomId} onChange={(e) => this._updateRoomId(e)}  />
            <Button className="home-button" onClick={this.createRoom}>
                Create Room!
            </Button>
            <Button className="home-button" onClick={this.joinRoom}>
                Join Room!
            </Button>
        </form>
      </div>
    );
  }
  
}

export default Create