import React from 'react';

function Rules() {
    return (
        <div id="rules">
          <b>How To Play Tic Tac Foe</b>
          <ul className="rulesList">
            <li>Get 3 in a row to win a board</li>
            <li>Play multiple boards at the same time</li>
            <li>Win as many boards as possible</li>
            <br/>
            <li>Your turn ends when you place your symbol on a tile</li>
            <li>The tile may contain a hidden powerup or trap</li>
            <li>Play as many <i>powerups</i> as you want during your turn</li>
            <li><img src={`/images/0.svg`} alt={"home"} height={'20'} /> <b>Skip</b>: A player loses their next turn</li>
            <li><img src={`/images/1.svg`} alt={"home"} height={'20'} /> <b>Remove</b>: Remove an existing symbol from any board</li>
            <li><img src={`/images/2.svg`} alt={"home"} height={'20'} /> <b>Bomb</b>: Plant a hidden bomb that destroys the player's symbol</li>
            <li><img src={`/images/3.svg`} alt={"home"} height={'20'} /> <b>Curse</b>: The next symbol the target places will be yours</li>
            <li><img src={`/images/7.svg`} alt={"home"} height={'20'} /> <b>Replace</b>: Replace an existing symbol with another random symbol</li>
            <li><img src={`/images/8.svg`} alt={"home"} height={'20'} /> <b>Unbox</b>: Reveal what is hidden underneath the chosen box</li>
            <li><img src={`/images/9.svg`} alt={"home"} height={'20'} /> <b>Shield</b>: Protect against Skip and Curse attacks</li>
            <li><img src={`/images/10.svg`} alt={"home"} height={'20'} /> <b>Deflect</b>: Deflect Skip and Curse attacks to the attacker</li>
            <br />
            <li><i>Traps</i> are immediately applied when you place your symbol</li>
            <li><img src={`/images/5.svg`} alt={"home"} height={'20'} /> <b>Joker</b>: Randomly places your symbol</li>
            <li><img src={`/images/4.svg`} alt={"home"} height={'20'} /> <b>Bomb trap</b>: Destroys the symbol that you placed on it</li>
          </ul>
        </div>
    );
}

export default Rules;