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
          <b>Changelog (click to show/hide)</b><br />
          <ul className="logList" style={{ display: (this.state.showItems) ? 'block' : 'none' }}>
            <li><i>Why is there a changelog? Isn't this a 24 hour hackathon?</i> Yes, but being the perfectionist he is, Yue Jun decided to continue developing it into a more polished game to play with his friends (and now you can too).</li><br />
            <li><b>v2.1 (19 Jan 2021)</b>: Public Rooms so that you don't need friends to play. Hosts can also set the maximum capacity of their rooms.</li>
            <li><b>v2.0 (18 Jan 2021)</b>: Team Mode! Now you can team up to conquer the boards!</li>
            <li><b>v1.9 (14 Jan 2021)</b>: Waiting Room enhancements. Now everyone can see the room settings and chat.</li>
            <li><b>v1.8 (14 Jan 2021)</b>: Minor bug fixes - Randomized Replace no longer includes offline players (and will have no effect if there is no other symbol to change to). Prevent undefined powerups from showing if host unselects all powerups.</li>
            <li><b>v1.7 (13 Jan 2021)</b>: Add rules to game page for easier reference. Board now highlights the box that was previously modified.</li>
            <li><b>v1.6 (12 Jan 2021)</b>: Powerups can now be unselected. Option to return to the same waiting room. Improved Chat Room experience. Bug fixes.</li>
            <li><b>v1.5 (11 Jan 2021)</b>: New powerups: Unbox, Shield, Deflect. Host can now decide which powerups to include in the game.</li>
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