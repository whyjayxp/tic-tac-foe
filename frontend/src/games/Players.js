import React from 'react';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

class Players extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  pressPlayer(idx) {
    if (this.props.status === 'use_power_3') {
        this.props.socket.emit('usePowerup', this.props.room.roomId, 3, { cursedBy: this.props.room.turn, onIdx: idx});
        this.props.updateStatus('turn');
    } else if (this.props.status === 'use_power_6') {
        this.props.socket.emit('usePowerup', this.props.room.roomId, 6, { onIdx: idx });
        this.props.updateStatus('turn');
    } else {
        // do nothing
      // this.props.socket.emit('startGame', this.props.room.roomId, this.state.concurBoards, this.state.boardsToWin);
    }
  }

  componentDidMount() {
  }

  render() {
    const listPlayers = this.props.room.players.map((player, idx) => 
    (<Button key={player.symbol} onClick={() => this.pressPlayer(idx)}> 
      <li id={(!player.isOnline) ? "playerGridOffline" : (idx === this.props.room.turn) ? "playerGridTurn" : "playerGrid"}>
        <div id="playerSymbol">{player.symbol}</div> 
        <div>{player.username}</div> 
        <div>
          {player.wins} <Tooltip title="Wins"><img src={'/images/win.svg'} alt={"win"} height={'15'} /></Tooltip>
          {player.skips} <Tooltip title="Skips"><img src={`/images/0.svg`} alt={"skip"} height={'15'} /></Tooltip> 
        </div>
      </li>
    </Button>)
    );
    return (
      <div id="playerGridList">
        <ul>{ listPlayers }</ul>
      </div>
    );
  }
  
}

export default Players