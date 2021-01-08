import React from 'react';
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import './index.css';
import Navbar from './Navbar'
import Home from './home/Home'
import Create from './create/Create'
import Join from './join/Join'
import Game from './games/Game'

class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Navbar />
                <Switch>
                    <Route exact path='/'>
                        <Home />
                    </Route>
                    <Route exact path='/create'>
                        <Create />
                    </Route>
                    <Route exact path='/join'>
                        <Join />
                    </Route>
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
