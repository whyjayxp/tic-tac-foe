# Tic Tac Foe - The Multiplayer Game
Like Tic Tac Toe, but better! At the most fundamental level, you win a board the old school way, 3 in a row. You win the game by winning X number of boards. There are many players. There are many concurrent boards. Each box may contain a powerup or a trap - every move is exciting, every game is different. Rethink your strategy in this reinvented game!

This web application game was built during HackNRoll 2021.

## Tech Stuff
Tic Tac Foe uses ReactJS to support the frontend and Node.js/Express to build the backend. For multiplayer turn-based support, SocketIO was used to facilitate real-time server-client communication.

Run `npm start` in the root folder. In a new terminal, run `cd frontend && npm install && npm run build`. Open `http://localhost:8080` to play.

## What's next for Tic Tac Foe
We would love to come up with more comprehensive rules, power-ups and traps to make the game more exciting! Also, we suck at frontend but we really do want to improve the UI/UX design :')
