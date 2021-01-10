import React from 'react';

function Changelog() {
    return (
        <div id="changelog">
          <b>Changelog</b>
          <ul id="logList">
            <li><b>v1.2 (10 Jan 2021)</b>: New powerup: Randomized Replace. Powerup/trap probabilities have been modified. Proper Game Over page added to honour the winner.</li>
            <li><b>v1.1 (10 Jan 2021)</b>: Emoji Mode. Up to 9 players. UI/UX has been enhanced. Server connection issues are now handled better. Changelog was added.</li>
            <li><b>v1.0 (9 Jan 2021)</b>: Tic Tac Foe was created. Up to 6 players per room, with powerups (Skip, Remove, Bomb, Curse) and traps (Joker, Bomb Trap).</li>
          </ul>
        </div>
    );
}

export default Changelog;