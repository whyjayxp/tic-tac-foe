import React from 'react';

function Rules() {
    return (
        <div id="rules">
          <b>How To Play Tic Tac Foe</b>
          <ul class="rulesList">
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
            <br />
            <li><i>Traps</i> are immediately applied when you place your symbol</li>
            <li><img src={`/images/clown.svg`} alt={"home"} height={'20'} /> <b>Joker</b>: Randomly places your symbol</li>
            <li><img src={`/images/mine.svg`} alt={"home"} height={'20'} /> <b>Bomb trap</b>: Destroys the symbol that you placed on it</li>
          </ul>
        </div>
    );
}

export default Rules;