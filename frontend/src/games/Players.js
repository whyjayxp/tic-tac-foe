import React from 'react';
import Button from '@material-ui/core/Button';

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
    (idx === this.props.room.turn) ? 
    (<Button key={player.symbol} onClick={() => this.pressPlayer(idx)}> 
      <li id="playerGridTurn"><div id="playerSymbol">{player.symbol}</div> <div>{player.username}</div> <div>{player.wins} <img src={'/images/win.svg'} alt={"win"} height={'15'} /> {player.skips} <img src={`/images/0.svg`} alt={"skip"} height={'15'} /> </div></li>
    </Button>) :
    (<Button key={player.symbol} onClick={() => this.pressPlayer(idx)}> 
      <li id="playerGrid"><div id="playerSymbol">{player.symbol}</div> <div>{player.username}</div> <div>{player.wins} <img src={'/images/win.svg'} alt={"win"} height={'15'} /> {player.skips} <img src={`/images/0.svg`} alt={"skip"} height={'15'} /></div></li>
    </Button>)
    );
    return (
      <div>
        <ul>{ listPlayers }</ul>
      </div>
    );
  }
  
}

export default Players