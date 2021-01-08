import React from 'react'

class Home extends React.Component {
    render() {
        return(
            <div className="home">
                <img src={"/images/home.svg"} alt={"home"} height={'300'}/>
                <h1>Welcome To Tic Tac Foe!</h1>
                <div>Rules (TODO)</div>
            </div>
        )
    }
}

export default Home