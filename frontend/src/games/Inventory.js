import React from 'react';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import { withSnackbar } from 'notistack';

const POWERS = { 
  0: "Skip Next Player", 
  1: "Remove One Piece", 
  2: "Plant A Bomb", 
  3: "Cast A Curse", 
  6: "Skip Chosen Player",
  7: "Randomly Replace Piece",
  8: "Unbox A Box",
  9: "Use A Shield",
  10: "Activate Deflect" };
const DESCS = {
  0: "The next player will lose a turn.",
  1: "Choose any existing symbol on the board to remove. The powerup is wasted if an empty tile is chosen.",
  2: "Choose any empty tile on the board to plant a bomb. The next symbol placed there will disappear.",
  3: "Choose any player to curse. The next tile placed by that player will become your symbol instead.",
  6: "Choose any player to skip so that they will lose a turn.",
  7: "Choose any existing symbol on the board to randomly replace it with another symbol. The powerup is wasted if an empty tile is chosen.",
  8: "Choose any empty tile on the board to reveal what is hidden underneath.",
  9: "Protect against a Skip or Curse powerup from other players. Effect cannot be stacked.",
  10: "The next player who tries to use a Skip or Curse powerup against you will have the power used against them instead. Effect cannot be stacked."
};

class Inventory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        powerups: [],
        isShieldActive: false
    };
  }

  pressPowerup(idx) {
    if (this.props.status !== 'turn') {
        this.props.enqueueSnackbar('You can only use powerups during your turn!', { autoHideDuration: 2000 });
    } else {
        var pow = this.state.powerups[idx];
        this.setState({ powerups: this.state.powerups.filter((v, i) => i !== idx) });

        if (pow === 0 || pow === 9 || pow === 10) {
            this.props.socket.emit('usePowerup', this.props.room.roomId, pow, {});
            if (pow === 9) {
              this.setState({ isShieldActive: true });
              this.props.enqueueSnackbar('Shield has been activated!', { autoHideDuration: 2000 });
              this.props.addToLog('Shield has been activated!');
            } else if (pow === 10) {
              this.props.enqueueSnackbar('Deflect has been activated!', { autoHideDuration: 2000 });
              this.props.addToLog('Deflect has been activated!');
            }
        } else {
            if (pow === 1) {
              this.props.enqueueSnackbar('Choose a symbol on the boards to remove it!', { autoHideDuration: 3000 });
            } else if (pow === 2) {
              this.props.enqueueSnackbar('Choose an empty box on the boards to plant a bomb!', { autoHideDuration: 3000 });
            } else if (pow === 3) {
              this.props.enqueueSnackbar('Choose a player to curse!', { autoHideDuration: 3000 });
            } else if (pow === 6) {
              this.props.enqueueSnackbar('Choose a player to skip their turn!', { autoHideDuration: 3000 });
            } else if (pow === 7) {
              this.props.enqueueSnackbar('Choose a symbol on the boards to randomly replace it!', { autoHideDuration: 3000 });
            } else if (pow === 8) {
              this.props.enqueueSnackbar('Choose an empty box on the boards to reveal what is hidden underneath!', { autoHideDuration: 3000 });
            }
            this.props.updateStatus(`use_power_${pow}`);
        }
    }
  }

  componentDidMount() {
    this.props.socket.on('startingPowerup', () => {
      var keys = Object.keys(POWERS);
      var startPower = Number(keys[keys.length * Math.random() << 0]);
      this.setState({ powerups: [startPower] });
    });

    this.props.socket.on('newPower', (pow) => {
        if (pow === -1) {
            return;
        }
        if (pow === 4) {
            this.props.enqueueSnackbar('A bomb was on this tile! Your symbol has exploded :(', { autoHideDuration: 2000 });
            this.props.addToLog('A bomb was on this tile! Your symbol has exploded :(');
            return;
        }

        if (pow === 5) {
            this.props.enqueueSnackbar('A joker was hiding on this tile! Your symbol was placed randomly :p', { autoHideDuration: 2000 });
            this.props.addToLog('A joker was hiding on this tile! Your symbol was placed randomly :p');
            return;
        }
        this.props.enqueueSnackbar('You got a powerup!', { autoHideDuration: 2000 });
        this.props.addToLog('You got a powerup!');
        this.setState({ powerups: this.state.powerups.concat([pow]) });
    });

    this.props.socket.on('bombed', (user) => {
        this.props.enqueueSnackbar(`${user} got bombed! Their symbol is gone :(`, { autoHideDuration: 2000 });
        this.props.addToLog(`${user} got bombed! Their symbol is gone :(`);
    });

    this.props.socket.on('joked', (user) => {
        this.props.enqueueSnackbar(`${user} encountered the joker! Their symbol was placed randomly :p`, { autoHideDuration: 2000 });
        this.props.addToLog(`${user} encountered the joker! Their symbol was placed randomly :p`);
    })

    this.props.socket.on('cursed', (user, by) => {
        this.props.enqueueSnackbar(`${user} was cursed by ${ this.props.room.players[by].username }!`, { autoHideDuration: 2000 });
        this.props.addToLog(`${user} was cursed by ${ this.props.room.players[by].username }!`);
    });

    this.props.socket.on('unboxResult', (res) => {
        var msg;
        if (res === -1) {
          msg = "Nothing is hiding underneath the chosen box.";
        } else if (res === 4) {
          msg = "A bomb trap is hiding underneath the chosen box.";
        } else if (res === 5) {
          msg = "A joker is hiding underneath the chosen box.";
        } else {
          msg = `A "${POWERS[res]}" powerup is hiding underneath the chosen box.`;
        }
        this.props.enqueueSnackbar(msg, { autoHideDuration: 2000 });
        this.props.addToLog(msg);
    });

    this.props.socket.on('shieldUsed', () => {
      this.setState({ isShieldActive: false });
    })
  }

  componentWillUnmount() {
    this.props.socket.off('startingPowerup');
    this.props.socket.off('newPower');
    this.props.socket.off('bombed');
    this.props.socket.off('joked');
    this.props.socket.off('cursed');
    this.props.socket.off('unboxResult');
    this.props.socket.off('shieldUsed');
  }

  render() {
    const shieldActive = (this.state.isShieldActive) ? (
      <div style={{ marginBottom: '10px' }}>[ <img src={`/images/9.svg`} alt={"power"} height={'15'} margin-left="10px" /> ACTIVE ]</div>
    ) : null;
    const listPowerups = (this.state.powerups.length === 0) ? (
      <li>You do not have any powerups :(<br />You might find some hidden on the board!</li>
    ) : 
    (this.state.powerups.map((power, idx) =>
    <span key={idx}>
      <Tooltip arrow title={DESCS[power]}>
    <Button onClick={() => this.pressPowerup(idx)}>
      <li><b>{POWERS[power]}</b> <img src={`/images/${power}.svg`} alt={"power"} height={'20'} margin-left="10px"/></li>
      
    </Button>
    </Tooltip>
    <br />
    </span>
    ));
    return (
      <div id="powerupList">
        { shieldActive }
        <b>Your Powerups</b><br />
        <i>Hover or hold over a powerup to see more details!</i><br />
        <i>Click on a powerup before placing your symbol to use it!</i>
        <ul>{ listPowerups }</ul>
      </div>
    );
  }
  
}

export default withSnackbar(Inventory);