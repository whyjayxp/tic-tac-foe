import React from 'react';

class Changelog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showItems: false
    };
  }

  render() {
    return (
        <div id="changelog" onClick={() => (this.state.showItems) ? this.setState({showItems: false}) : this.setState({showItems: true})}>
          <b>Changelog (click to show/hide)</b>
          <ul className="logList" style={{ display: (this.state.showItems) ? 'block' : 'none' }}>
            <li><b>v1.5 (11 Jan 2021)</b>: New powerup: Unbox.</li>
            <li><b>v1.4 (11 Jan 2021)</b>: Chat Room and Logs. Game can now go on even when a player disconnects.</li>
            <li><b>v1.3 (10 Jan 2021)</b>: Highly requested feature: the winning boards are now displayed. 🙂</li>
            <li><b>v1.2 (10 Jan 2021)</b>: New powerup: Randomized Replace. Starting Powerups. Powerup/trap probabilities have been modified. Proper Game Over page added to honour the winner.</li>
            <li><b>v1.1 (10 Jan 2021)</b>: Emoji Mode. Up to 9 players. UI/UX has been enhanced. Server connection issues are now handled better. Changelog was added.</li>
            <li><b>v1.0 (9 Jan 2021)</b>: Tic Tac Foe was created. Up to 6 players per room, with powerups (Skip, Remove, Bomb, Curse) and traps (Joker, Bomb Trap).</li>
          </ul>
        </div>
    );
  }
}

export default Changelog;