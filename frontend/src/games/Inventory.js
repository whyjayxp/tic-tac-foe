import React from 'react';
import Button from '@material-ui/core/Button';
import { withSnackbar } from 'notistack';

// 0 : skip next player
// 1 : remove piece
// 2 : good bomb
// 3 : good curse
const POWERS = { 0: "Skip Next Player", 1: "Remove One Piece", 2: "Plant A Bomb", 3: "Cast A Curse", 6: "Skip Chosen Player" };

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
            // 6 : skip any player { onIdx }
        if (pow === 0) {
            this.props.socket.emit('usePowerup', this.props.room.roomId, pow, {});
        } else {
            if (pow === 1) {
              this.props.enqueueSnackbar('Choose a symbol on the boards to remove it!', { autoHideDuration: 2000 });
            } else if (pow === 2) {
              this.props.enqueueSnackbar('Choose an empty box on the boards to plant a bomb!', { autoHideDuration: 2000 });
            } else if (pow === 3) {
              this.props.enqueueSnackbar('Choose a player to curse!', { autoHideDuration: 2000 });
            } else if (pow === 6) {
              this.props.enqueueSnackbar('Choose a player to skip their turn!', { autoHideDuration: 2000 });
            }
            this.props.updateStatus(`use_power_${pow}`);
        }
    }
  }

  componentDidMount() {
    this.props.socket.on('itsYourTurn', () => {
      this.props.updateStatus('turn');
      this.props.enqueueSnackbar('It\'s your turn!', { autoHideDuration: 2000 });
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
        this.props.enqueueSnackbar('You got a powerup!', { autoHideDuration: 2000 });
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
      <img src={`/images/${power}.svg`} alt={"power"} height={'20'} margin-left="10px"/>
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