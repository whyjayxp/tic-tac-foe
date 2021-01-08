import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import './index.css';
import Create from './create/Create'
import Game from './games/Game'
import Waiting from './waitingRoom/waitingRoom'
import socketClient  from "socket.io-client"

const SERVER = "http://localhost:8080"

let socket

function createRoom(input) {
    socket.emit('createRoom', input.value)
}

class App extends React.Component {
    componentDidMount() {
        socket = socketClient(SERVER, {transports: ["websocket"]})
        socket.on('connection', () => {
            console.log(`I'm connected with the back-end`);
        });
        socket.on('youAreTheHost', () => {
            alert("You are the host");
        });

        // socket.on('updatePlayers', (room, arr) => {
        //     form.remove();
        //     form2.remove();
        //     list.innerHTML = "";
        //     roomId.innerHTML = `Room ID: <b>${room}</b>`;
        //     arr.forEach((player) => {
        //         var li = document.createElement("li");
        //         //li.appendChild(document.createTextNode(player[1]));
        //         li.innerHTML = `<b>${player[0]}</b> ${player[1]}`;
        //         list.appendChild(li);
        //     });
        // });
    }
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path='/'>
                        <Create value={createRoom}/>
                    </Route>
                    <Route exact path='/waiting'>
                        <Waiting />
                    </Route>
                    <Route exact path='/games'>
                        <Game />
                    </Route>
                    {/* <Route exact path='/join'>
                        <Join />
                    </Route> */}
                    <Route path='/'>
                        <Game />
                    </Route>
                </Switch>
            </ BrowserRouter>
        )
    }
}

// ========================================

ReactDOM.render(
<App />,
document.getElementById('root')
);
