import React from 'react';
import Button from '@material-ui/core/Button';
import { withSnackbar } from 'notistack';

// 0 : skip next player
// 1 : remove piece
// 2 : good bomb
// 3 : good curse
const POWERS = ["Skip Next Player", "Remove One Piece", "Plant A Bomb", "Curse Jeff"];

class Inventory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        powerups: []
    };
  }

  pressPowerup(idx) {
    if (this.props.status !== 'turn') {
        // do nothing
    } else {
        var pow = this.state.powerups[idx];
        this.setState({ powerups: this.state.powerups.filter((v, i) => i !== idx) });

        // socket.on('usePowerup', (roomId, powIdx, props) => {
        //     var pow = socket.player.usePowerup(powIdx);
            // 0 : skip next player
            // 1 : remove piece  { board, row, col }
            // 2 : good bomb     { board, row, col }
            // 3 : good curse    { cursedBy, onIdx }
        if (pow === 0) {
            this.props.socket.emit('usePowerup', this.props.room.roomId, pow, {});
        } else {
            this.props.updateStatus(`use_power_${pow}`);
        }
    }
  }

  componentDidMount() {
    this.props.socket.on('itsYourTurn', () => {
      this.props.updateStatus('turn');
    });

    this.props.socket.on('newPower', (pow) => {
        if (pow === -1) {
            return;
        }
        if (pow === 4) {
            this.props.enqueueSnackbar('You got bombed! Your symbol is gone :(', { autoHideDuration: 2000 });
            return;
        }

        if (pow === 5) {
            this.props.enqueueSnackbar('You got the joker! Your symbol was placed randomly :p', { autoHideDuration: 2000 });
            return;
        }
        this.setState({ powerups: this.state.powerups.concat([pow]) });
    });

    this.props.socket.on('bombed', (user) => {
        this.props.enqueueSnackbar(`${user} got bombed! Their symbol is gone :(`, { autoHideDuration: 2000 });
    });

    this.props.socket.on('joked', (user) => {
        this.props.enqueueSnackbar(`${user} got the joker! Their symbol was placed randomly :p`, { autoHideDuration: 2000 });
    })

  }

  render() {
    const listPowerups = this.state.powerups.map((power, idx) =>
    <Button key={idx} onClick={() => this.pressPowerup(idx)}>
      <li><b>{POWERS[power]}</b></li>
      <img src={`/images/${power}.svg`} alt={"home"} height={'20'} margin-left="10px"/>
    </Button>
    );
    return (
      <div>
        <ul>{ listPowerups }</ul>
      </div>
    );
  }
  
}

export default withSnackbar(Inventory);