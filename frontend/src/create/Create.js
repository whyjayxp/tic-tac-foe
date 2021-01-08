import React from 'react';
import { Link } from 'react-router-dom'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class Create extends React.Component {
  render() {
    // const classes = useStyles();

    return (
      <div>
        <div className="home">
            <img src={"/images/home.svg"} alt={"home"} height={'300'}/>
            <h1>Welcome To Tic Tac Foe!</h1>
        </div>
        <form className="create" noValidate autoComplete="off">
          <TextField id="outlined-basic" label="User Name" variant="outlined" />
          {/* <TextField id="outlined-basic" label="Number of Boards" variant="outlined" />
          <TextField id="outlined-basic" label="Number of Boards to Win" variant="outlined" /> */}
          <TextField id="outlined-basic" label="Enter Room Code" variant="outlined" />
          <Link to="/waiting">
            <Button className="home-button" onClick={this.props.value}>
                Create!
            </Button>
          </Link>
          <Button className="home-button">
              Join Room!
          </Button>
        </form>
      </div>
    );
  }
  
}

export default Create