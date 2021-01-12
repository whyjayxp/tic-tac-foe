import React from 'react'
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class ChatRoom extends React.Component {
  constructor(props) {
    super(props);
    this.sendMessage = this.sendMessage.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.state = {
      msgs: [],
      msg: "",
    };
  }

  addToChat(msg) {
    this.setState({ msgs: this.state.msgs.concat(msg) });
  }

  sendMessage() {
    this.props.socket.emit('newMessage', this.props.roomId, this.state.msg);
    this.setState({msg: ''});
  }

  _updateMessage(e) {
    this.setState({ msg: e.target.value });
  }

  scrollToBottom() {
    if (!this.messageList) return;
    const scrollHeight = this.messageList.scrollHeight;
    const height = this.messageList.clientHeight;
    const maxScrollTop = scrollHeight - height;
    this.messageList.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  }

  componentDidMount() {
    this.props.socket.on('newMessage', (msg) => {
      this.props.showNewMsg();
      this.addToChat(msg);
      this.scrollToBottom();
    });
  }

  componentWillUnmount() {
    this.props.socket.off('newMessage');
  }

  render() {
    const chatItems = this.state.msgs.map((msg, idx) =>
    <li key={idx}>{msg}</li>
    );
    return (
      <Dialog maxWidth={false} onEnter={this.scrollToBottom} onClose={this.props.onClose} open={ this.props.open }>
        <div id="logs">
        <div style={{ 'maxHeight': '50vh', 'overflowY': 'auto', 'marginBottom': '10px' }} ref={(div) => { this.messageList = div; } }>
            <ul className="logList">{ chatItems }</ul>
        </div>
        <form className="chatRoom" noValidate autoComplete="off" onSubmit={(e) => e.preventDefault()}>
          <TextField fullWidth inputProps={{ maxLength: 50 }} size="small" label="Message" variant="filled" value={this.state.msg} onChange={(e) => this._updateMessage(e)} onKeyDown={(e) => {if (e.key === "Enter") { this.sendMessage() }}} />
          <Button className="home-button" variant="outlined" onClick={this.sendMessage}>
                Send
          </Button>
          </form>
        <center><i>Click outside to dismiss</i></center>
        </div>
      </Dialog>
    );
  }
}

export default ChatRoom;