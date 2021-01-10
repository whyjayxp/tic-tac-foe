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
  7: "Randomly Replace Piece" };
const DESCS = {
  0: "The next player will lose a turn.",
  1: "Choose any existing symbol on the board to remove. The powerup is wasted if an empty tile is chosen.",
  2: "Choose any empty tile on the board to plant a bomb. The next symbol placed there will disappear.",
  3: "Choose any player to curse. The next tile placed by that player will become your symbol instead.",
  6: "Choose any player to skip so that they will lose a turn.",
  7: "Choose any existing symbol on the board to randomly replace it with another symbol. If the tile is empty, any symbol may appear."
};

class Inventory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        powerups: [7]
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
            // 7 : randomize replace { board, row, col }
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
            } else if (pow === 7) {
              this.props.enqueueSnackbar('Choose a symbol on the boards to randomly replace it!', { autoHideDuration: 2000 });
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
            this.props.enqueueSnackbar('A bomb was on this tile! Your symbol has exploded :(', { autoHideDuration: 2000 });
            return;
        }

        if (pow === 5) {
            this.props.enqueueSnackbar('A joker was hiding on this tile! Your symbol was placed randomly :p', { autoHideDuration: 2000 });
            return;
        }
        this.props.enqueueSnackbar('You got a powerup!', { autoHideDuration: 2000 });
        this.setState({ powerups: this.state.powerups.concat([pow]) });
    });

    this.props.socket.on('bombed', (user) => {
        this.props.enqueueSnackbar(`${user} got bombed! Their symbol is gone :(`, { autoHideDuration: 2000 });
    });

    this.props.socket.on('joked', (user) => {
        this.props.enqueueSnackbar(`${user} encountered the joker! Their symbol was placed randomly :p`, { autoHideDuration: 2000 });
    })

    this.props.socket.on('cursed', (user, by) => {
        this.props.enqueueSnackbar(`${user} was cursed by ${ this.props.room.players[by].username }!`, { autoHideDuration: 2000 });
    });

  }

  componentWillUnmount() {
    this.props.socket.off('itsYourTurn');
    this.props.socket.off('newPower');
    this.props.socket.off('bombed');
    this.props.socket.off('joked');
    this.props.socket.off('cursed');
  }

  render() {
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
        <b>Your Powerups</b><br />
        <i>Hover over a powerup to see more details!</i><br />
        <i>Click on a powerup to use it!</i>
        <ul>{ listPowerups }</ul>
      </div>
    );
  }
  
}

export default withSnackbar(Inventory);